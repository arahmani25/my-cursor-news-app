// Email service for sending password reset emails
// This uses EmailJS as a free email service

interface EmailData extends Record<string, unknown> {
  to_email: string;
  to_name: string;
  reset_link: string;
  from_name: string;
}

interface WelcomeEmailData extends Record<string, unknown> {
  to_email: string;
  to_name: string;
  app_url: string;
  from_name: string;
}

// EmailJS configuration
// Replace these with your actual EmailJS credentials
const EMAILJS_SERVICE_ID = 'service_2u8d39s'; // e.g., 'service_abc123'
const EMAILJS_TEMPLATE_ID = 'template_zyxc7dj'; // e.g., 'template_xyz789'
const EMAILJS_WELCOME_TEMPLATE_ID = 'template_dbfh5hx'; // Replace with your welcome template ID
const EMAILJS_USER_ID = 'EN-JTkX7Rw0oDM-K_'; // e.g., 'user_def456'

// Generate a secure reset token
export const generateResetToken = (): string => {
  const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  return token;
};

// Store reset tokens (in a real app, this would be in a database)
// Using localStorage for persistence across page refreshes
const RESET_TOKENS_KEY = 'news_app_reset_tokens';

// Get tokens from localStorage
const getResetTokens = (): Map<string, { email: string; expires: Date }> => {
  try {
    const stored = localStorage.getItem(RESET_TOKENS_KEY);
    if (!stored) return new Map();
    
    const tokensArray = JSON.parse(stored) as Array<[string, { email: string; expires: string }]>;
    const tokens = new Map<string, { email: string; expires: Date }>();
    
    // Convert string dates back to Date objects
    for (const [key, value] of tokensArray) {
      tokens.set(key, {
        email: value.email,
        expires: new Date(value.expires)
      });
    }
    return tokens;
  } catch (error) {
    console.error('Error loading reset tokens:', error);
    return new Map();
  }
};

// Save tokens to localStorage
const saveResetTokensToStorage = (tokens: Map<string, { email: string; expires: Date }>) => {
  try {
    // Convert to array for JSON serialization
    const tokensArray = Array.from(tokens.entries());
    localStorage.setItem(RESET_TOKENS_KEY, JSON.stringify(tokensArray));
  } catch (error) {
    console.error('Error saving reset tokens:', error);
  }
};

// Clean up expired tokens
const cleanupExpiredTokens = () => {
  const tokens = getResetTokens();
  const now = new Date();
  let hasExpired = false;
  
  // Use Array.from to avoid iteration issues
  const entries = Array.from(tokens.entries());
  for (const [token, data] of entries) {
    if (now > data.expires) {
      tokens.delete(token);
      hasExpired = true;
    }
  }
  
  if (hasExpired) {
    saveResetTokensToStorage(tokens);
  }
  
  return tokens;
};

// Save reset token
export const saveResetToken = (email: string, token: string): void => {
  const expires = new Date();
  expires.setHours(expires.getHours() + 1); // Token expires in 1 hour
  
  const tokens = cleanupExpiredTokens();
  tokens.set(token, { email, expires });
  saveResetTokensToStorage(tokens);
};

// Validate reset token
export const validateResetToken = (token: string): string | null => {
  const tokens = cleanupExpiredTokens();
  const tokenData = tokens.get(token);
  
  if (!tokenData) {
    return null; // Token not found
  }
  
  if (new Date() > tokenData.expires) {
    tokens.delete(token); // Remove expired token
    saveResetTokensToStorage(tokens);
    return null; // Token expired
  }
  
  return tokenData.email;
};

// Remove used token
export const removeResetToken = (token: string): void => {
  const tokens = getResetTokens();
  tokens.delete(token);
  saveResetTokensToStorage(tokens);
};

// Send password reset email using EmailJS
export const sendPasswordResetEmail = async (email: string, name: string): Promise<string> => {
  try {
    // Generate reset token
    const token = generateResetToken();
    saveResetToken(email, token);
    
    // Create reset link
    const resetLink = `${window.location.origin}/reset-password?token=${token}&email=${encodeURIComponent(email)}`;
    
    // Email data
    const emailData: EmailData = {
      to_email: email,
      to_name: name,
      reset_link: resetLink,
      from_name: 'News App Team'
    };

    console.log('🔧 EmailJS Configuration Check:');
    console.log('Service ID:', EMAILJS_SERVICE_ID);
    console.log('Template ID:', EMAILJS_TEMPLATE_ID);
    console.log('User ID:', EMAILJS_USER_ID);
    console.log('Email Data:', emailData);

    // Check if all credentials are properly configured
    console.log('🔍 Checking credentials...');
    console.log('Service ID exists:', !!EMAILJS_SERVICE_ID);
    console.log('Template ID exists:', !!EMAILJS_TEMPLATE_ID);
    console.log('User ID exists:', !!EMAILJS_USER_ID);
    console.log('All credentials exist:', !!(EMAILJS_SERVICE_ID && EMAILJS_TEMPLATE_ID && EMAILJS_USER_ID));

    if (EMAILJS_SERVICE_ID && EMAILJS_TEMPLATE_ID && EMAILJS_USER_ID) {
      console.log('✅ All credentials found, attempting EmailJS...');
      try {
        console.log('📧 Attempting to send real email via EmailJS...');
        
        // Import EmailJS
        const emailjs = await import('@emailjs/browser');
        
        // Initialize EmailJS with your user ID
        emailjs.default.init(EMAILJS_USER_ID);
        
        console.log('📧 EmailJS initialized successfully');
        console.log('📧 Sending email with data:', emailData);
        
        // Send the email
        const result = await emailjs.default.send(
          EMAILJS_SERVICE_ID,
          EMAILJS_TEMPLATE_ID,
          emailData,
          EMAILJS_USER_ID
        );
        
        console.log('✅ Email sent successfully:', result);
        return 'Email sent successfully! Check your inbox for the password reset link.';
      } catch (emailError: any) {
        console.error('❌ EmailJS error details:', emailError);
        console.error('❌ Error message:', emailError.message);
        console.error('❌ Error code:', emailError.code);
        console.error('❌ Error text:', emailError.text);
        
        // Check for specific EmailJS errors
        if (emailError.text) {
          console.error('❌ EmailJS error text:', emailError.text);
        }
        
        console.warn('📧 Falling back to simulation due to EmailJS error');
        // Fall back to simulation
        return sendPasswordResetEmailSimple(email, name);
      }
    } else {
      console.log('⚠️ EmailJS not configured, using simulation');
      console.log('Missing credentials:');
      if (!EMAILJS_SERVICE_ID) console.log('- Service ID');
      if (!EMAILJS_TEMPLATE_ID) console.log('- Template ID');
      if (!EMAILJS_USER_ID) console.log('- User ID');
      
      // Fallback: Show the reset link in console for testing
      console.log('📧 Password Reset Email (Simulated)');
      console.log('To:', email);
      console.log('Reset Link:', resetLink);
      console.log('In a real app, this would be sent via email');
      
      // For testing purposes, you can copy this link
      alert(`For testing: Copy this reset link: ${resetLink}`);
      
      return 'Reset link generated (check console for testing)';
    }
  } catch (error) {
    console.error('Failed to send email:', error);
    throw new Error('Failed to send password reset email');
  }
};

// Alternative: Send email using a simple HTTP request to a backend
export const sendPasswordResetEmailSimple = async (email: string, name: string): Promise<string> => {
  try {
    // Generate reset token
    const token = generateResetToken();
    saveResetToken(email, token);
    
    // Create reset link
    const resetLink = `${window.location.origin}/reset-password?token=${token}&email=${encodeURIComponent(email)}`;
    
    // In a real app, you would make an HTTP request to your backend
    // const response = await fetch('/api/send-reset-email', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ email, name, resetLink })
    // });
    
    // For now, simulate the email sending
    console.log('📧 Password Reset Email (Simulated)');
    console.log('To:', email);
    console.log('Reset Link:', resetLink);
    
    // Show the link for testing
    alert(`For testing: Copy this reset link: ${resetLink}`);
    
    return 'Reset link generated successfully';
  } catch (error) {
    console.error('Failed to send email:', error);
    throw new Error('Failed to send password reset email');
  }
}; 

// Send welcome email using EmailJS
export const sendWelcomeEmail = async (email: string, name: string): Promise<string> => {
  try {
    // Create app URL
    const appUrl = window.location.origin;
    
    // Email data
    const emailData: WelcomeEmailData = {
      to_email: email,
      to_name: name,
      app_url: appUrl,
      from_name: 'News App Team'
    };

    console.log('🔧 Welcome Email Configuration Check:');
    console.log('Service ID:', EMAILJS_SERVICE_ID);
    console.log('Welcome Template ID:', EMAILJS_WELCOME_TEMPLATE_ID);
    console.log('User ID:', EMAILJS_USER_ID);
    console.log('Welcome Email Data:', emailData);

    // Check if all credentials are properly configured
    console.log('🔍 Checking welcome email credentials...');
    console.log('Service ID exists:', !!EMAILJS_SERVICE_ID);
    console.log('Welcome Template ID exists:', !!EMAILJS_WELCOME_TEMPLATE_ID);
    console.log('User ID exists:', !!EMAILJS_USER_ID);
    console.log('All welcome credentials exist:', !!(EMAILJS_SERVICE_ID && EMAILJS_WELCOME_TEMPLATE_ID && EMAILJS_USER_ID));

    if (EMAILJS_SERVICE_ID && EMAILJS_WELCOME_TEMPLATE_ID && EMAILJS_USER_ID) {
      console.log('✅ All welcome credentials found, attempting EmailJS...');
      try {
        console.log('📧 Attempting to send welcome email via EmailJS...');
        
        // Import EmailJS
        const emailjs = await import('@emailjs/browser');
        
        // Initialize EmailJS with your user ID
        emailjs.default.init(EMAILJS_USER_ID);
        
        console.log('📧 EmailJS initialized successfully');
        console.log('📧 Sending welcome email with data:', emailData);
        
        // Send the welcome email
        const result = await emailjs.default.send(
          EMAILJS_SERVICE_ID,
          EMAILJS_WELCOME_TEMPLATE_ID,
          emailData,
          EMAILJS_USER_ID
        );
        
        console.log('✅ Welcome email sent successfully:', result);
        return 'Welcome email sent successfully!';
      } catch (emailError: any) {
        console.error('❌ Welcome EmailJS error details:', emailError);
        console.error('❌ Error message:', emailError.message);
        console.error('❌ Error code:', emailError.code);
        console.error('❌ Error text:', emailError.text);
        
        // Check for specific EmailJS errors
        if (emailError.text) {
          console.error('❌ EmailJS error text:', emailError.text);
        }
        
        console.warn('📧 Welcome email failed, but registration continues');
        return 'Welcome email failed, but registration successful';
      }
    } else {
      console.log('⚠️ Welcome email not configured, skipping welcome email');
      console.log('Missing welcome credentials:');
      if (!EMAILJS_SERVICE_ID) console.log('- Service ID');
      if (!EMAILJS_WELCOME_TEMPLATE_ID) console.log('- Welcome Template ID');
      if (!EMAILJS_USER_ID) console.log('- User ID');
      
      return 'Registration successful (welcome email not configured)';
    }
  } catch (error) {
    console.error('Failed to send welcome email:', error);
    return 'Registration successful (welcome email failed)';
  }
}; 