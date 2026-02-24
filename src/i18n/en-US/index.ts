// This is just an example,
// so you can safely delete all default props below

export default {
  failed: 'Action failed',
  success: 'Action was successful',
  login: {
    labels: {
      email: 'Email',
      password: 'Password',
      submit: 'Login',
    },
    rules: {
      email: 'Email cannot be empty',
      password: 'Password cannot be empty',
    },
  },
  components: {
    card: {
      description: 'Description',
    },
  },
  utils: {
    notify: {
      positive: 'Success.',
      negative: 'Error.',
    },
  },
  homepage: {
    no_cards: 'No cards found',
  },
  errors: {
    fetch_cards: "Ops! We couldn't load the cards right now.",
    login_generic: 'Ops! Unable to log in right now.',
  },
};
