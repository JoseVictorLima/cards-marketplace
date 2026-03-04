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
      register: 'Create account',
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
      description: 'Description:',
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
      title: 'Cards available for trade',
      no_cards: 'No cards found',
      button: {
        owns: 'Already owns',
        cart: 'In the cart',
        trade: 'Trade',
      },
    },
    trades: {
      title: 'Open Trades',
      filter: {
        items_per_page: 'items per page',
      },
      pagination: {
        previous: 'Previous',
        next: 'Next',
      },
      name: 'Requester:',
      date: 'Date:',
      offering: 'Offered:',
      receiving: 'Received:',
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
  cart: {
    title: 'Your Cart',
    description: 'Description:',
    no_selected: 'No card selected',
    submit: 'Finish',
    receiving: {
      title: 'Receiving:',
      invalid: 'You already own one or more cards selected!',
      info: {
        prefix: 'Click',
        link: 'here',
        suffix: 'to select the cards you wish to receive',
      },
    },
    offering: {
      title: 'Offering:',
      invalid: 'Cards cannot be repeated!',
      info: 'To make the trade, add at least one of your cards.',
    },
    select: {
      title: 'Select the cards you wish to offer',
      no_card: 'You have no cards',
      confirm: 'Confirm',
      info: {
        prefix: 'You can add cards to your',
        link: 'profile',
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
      translation: {
        english: 'English',
        portuguese: 'Portuguese',
      },
    },
  },
  not_found: {
    info: "Oops. The page you're looking for wasn't found...",
    button: 'Return to homepage',
  },
  success: {
    register: 'Registration completed',
    add_card: 'Cards added',
    delete_trade: 'Trade deleted',
    save_trade: 'Trade request completed.',
  },
  errors: {
    get_cards: 'Oops! It was not possible to load the cards.Please try again later.',
    login_generic: 'Oops! Unable to log in right now.',
    get_user_data: 'Oops! Unable to load the user information. Please try again later.',
    get_user_cards:
      'Oops! Não foi possível Carregar as cartas do usuario logado! Tente mais tarde.',
    register_generic: 'Oops! Registration was not possible. Please try again later.',
    get_available_cards: 'Oops! It was not possible to load more cards.',
    add_card: 'Oops! Unable to add the selected cards. Please try again later.',
    load_trade: 'Oops! Unable to load the trades. Please try again later.',
    delete_trade: 'Oops! Unable to delete the trade. Please try again later.',
    save_trade: 'Oops! Unable to complete your trade request. Please try again later.',
  },
};
