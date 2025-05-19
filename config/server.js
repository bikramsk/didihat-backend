module.exports = ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  url: env('PUBLIC_URL', 'http://localhost:1337'),
  app: {
    keys: env.array('APP_KEYS'),
  },
  webhooks: {
    populateRelations: env.bool('WEBHOOKS_POPULATE_RELATIONS', false),
  },
  // Add this section for CORS
  middleware: {
    settings: {
      cors: {
        enabled: true,
        origin: ['*'],
        headers: ['*'],
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD'],
        keepHeaderOnError: true,
      },
    },
  },
});

// module.exports = ({ env }) => ({
//   host: env('HOST', '0.0.0.0'),
//   port: env.int('PORT', 1337),
//   app: {
//     keys: env.array('APP_KEYS'),
//   },
//   webhooks: {
//     populateRelations: env.bool('WEBHOOKS_POPULATE_RELATIONS', false),
//   },
// });
