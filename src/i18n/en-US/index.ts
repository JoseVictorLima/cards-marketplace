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
  layouts: {
    main_layout: {
      profile: 'My profile',
      logout: 'Logout',
    },
  },
  success: {
    register: 'Registration completed',
  },
  errors: {
    get_cards: "Ops! We couldn't load the cards right now.",
    login_generic: 'Ops! Unable to log in right now.',
    get_user_data: 'Ops! Unable to load the user information. Please try again later.',
    register_generic: 'Ops! Registration was not possible. Please try again later.',
  },
};
