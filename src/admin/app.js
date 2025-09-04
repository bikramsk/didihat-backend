const config = {
  locales: ['en'],
  translations: {
    en: {
      'Auth.form.welcome.title': 'Welcome to Didihat!',
      'Auth.form.welcome.subtitle': 'Log in to your Didihat account',
    },
  },
};

const bootstrap = (app) => {
  console.log(app);
};

export default {
  config,
  bootstrap,
};
