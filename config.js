// UpeNix Email Configuration
// Configure your email service settings here

const EMAIL_CONFIG = {
  // Using EmailJS for client-side email sending
  // Sign up at: https://www.emailjs.com/
  
  SERVICE_ID: 'service_90en9pg',
  TEMPLATE_ID: 'template_lu8ae3d',
  PUBLIC_KEY: '54gafnp0xTzGO7ooa',
  
  // Email recipients
  RECIPIENT_EMAIL: 'upenixtechnologies@gmail.com',
  
  // Email template variables (customize in EmailJS dashboard)
  TEMPLATE_PARAMS: {
    TO_EMAIL: 'upenixtechnologies@gmail.com',
    FROM_NAME: 'UpeNix Consultation Form',
    REPLY_TO_EMAIL: 'upenixtechnologies@gmail.com'
  },
  
  // Optional: Send copy to submitter
  SEND_COPY_TO_SUBMITTER: true,
  
  // Success/Error messages
  MESSAGES: {
    SENDING: 'Sending your consultation request...',
    SUCCESS: 'Thank you! We received your request. Our team will contact you within 24 hours.',
    ERROR: 'Sorry, there was an error sending your request. Please try again or contact us directly at +91 9958664330',
    VALIDATION_ERROR: 'Please fill in all required fields correctly.'
  }
};
