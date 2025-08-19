// module.exports = () => ({});

module.exports = ({ env }) => ({
    email: {
      config: {
        provider: 'nodemailer',
        providerOptions: {
          host: env('EMAIL_SMTP_HOST'),
          port: env.int('EMAIL_SMTP_PORT'),
          auth: {
            user: env('EMAIL_SMTP_USERNAME'),
            pass: env('EMAIL_SMTP_PASSWORD'),
          },
          secure: env.bool('EMAIL_SMTP_SECURE'), 
        },
        settings: {
          defaultFrom: env('EMAIL_SMTP_USERNAME'),
          defaultReplyTo: env('EMAIL_SMTP_USERNAME'),
        },
      },
    },
  });
  

// module.exports = ({ env }) => ({
   
//     email: {
//       config: {
//         provider: 'nodemailer',
//         providerOptions: {
//           host: 'smtp.gmail.com',
//           port: 465,
//           auth: {
//             user: 'kanyalbikram@gmail.com',
//             pass: 'jhsc nfmp bzpy sdlf', 
//           },
//           secure: true, // true for 465, false for 587
//         },
//         settings: {
//           defaultFrom: 'kanyalbikram@gmail.com',
//           defaultReplyTo: 'kanyalbikram@gmail.com',
//         },
//       },
//     },
//   });