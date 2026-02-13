module.exports = ({ env }) => ({
  email: {
    config: {
      provider: 'nodemailer',
      providerOptions: {
        host: env('SMTP_HOST', 'smtp.resend.com'),
        port: env.int('SMTP_PORT', 465),
        auth: {
          user: env('SMTP_USERNAME', 'resend'),
          pass: env('SMTP_PASSWORD', env('RESEND_API_KEY')),
        },
        secure: env.bool('SMTP_SECURE', true),
      },
      settings: {
        defaultFrom: env('RESEND_FROM_EMAIL'),
        defaultReplyTo: env('REPLY_TO_EMAIL'),
      },
    },
  },
  'users-permissions': {
    config: {
      register: {
        allowedFields: ['phone'],
      },
    },
  },
});