// This is just an example,
// so you can safely delete all default props below

export default {
  // failed: 'Action failed',
  // success: 'Action was successful',
  login: {
    labels: {
      login: 'Login',
      email: 'Email',
      password: 'Password',
      submit: 'Login',
    },
    rules: {
      email: 'Email cannot be empty',
      password: 'Password cannot be empty',
    },
  },
  register: {
    label: {
      register: 'Create account',
      name: 'Name',
      email: 'Email',
      password: 'Password',
      confirm_password: 'Confirm password',
      submit: 'Register',
    },
    hint: {
      password:
        'The password must contain at least 8 characters, including letters, numbers, and special characters.',
    },
    rules: {
      name: 'Name is required',
      email: 'Email is required',
      email_invalid: 'Enter a valid email',
      password: 'Password is required',
      password_digit: 'Password must contain at least one number',
      password_lowerCase: 'Password must contain at least one lowercase letter',
      password_upperCase: 'Password must contain at least one uppercase letter.',
      password_special_character: 'Password must contain at least one special character',
      password_length: 'Password must contain at least 8 characters',
      confirm_password: 'Passwords are different',
    },
  },
  profile: {
    cards: {
      title: 'Cards',
      title_session_user: 'My Cards',
      add: 'Add card',
      no_cards: 'No cards found',
    },
    add_cards: {
      title: 'Add cards',
      info: 'Select the cards you wish to add to your account.',
      add: 'Add',
      no_cards: 'No cards found',
      confirm: {
        title: 'Review selected cards',
        description: 'Description:',
        remove: 'Remove Card',
        save: 'Confirm',
      },
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
  home: {
    cards: {
      no_cards: 'No cards found',
    },
    trades: {
      title: 'Trades Made',
      filter: {
        items_per_page: 'items per page',
      },
      pagination: {
        previous: 'Previous',
        next: 'Next',
      },
      name: 'Requester:',
      date: 'Date:',
      offering: 'Cards offered:',
      receiving: 'Cards received:',
      no_trades: 'No trades found',
      delete: {
        title: 'Delete Trade',
        description: 'Do you really want to delete this trade?',
        info: 'This action cannot be undone!',
        cancel: 'Cancel',
        delete: 'Delete',
      },
    },
  },
  layouts: {
    main_layout: {
      profile: 'My profile',
      logout: 'Logout',
      navigation: {
        cards: 'Cards',
        trades: 'Trades',
      },
    },
  },
  success: {
    register: 'Registration completed',
    add_card: 'Cards added',
    delete_trade: 'Trade deleted',
  },
  errors: {
    get_cards: "Ops! We couldn't load the cards right now.",
    login_generic: 'Ops! Unable to log in right now.',
    get_user_data: 'Ops! Unable to load the user information. Please try again later.',
    register_generic: 'Ops! Registration was not possible. Please try again later.',
    get_available_cards: 'It was not possible to load more cards.',
    add_card: 'Unable to add the selected cards! Please try again later.',
    delete_trade: 'Unable to delete the trade! Please try again later.',
  },
};
