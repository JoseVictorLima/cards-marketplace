export default {
  failed: 'Ação falhou',
  success: 'Ação foi bem sucedida',
  login: {
    labels: {
      email: 'E-mail',
      password: 'Senha',
      submit: 'Login',
    },
    rules: {
      email: 'E-mail não pode ser vazio',
      password: 'Senha não pode ser vazia',
    },
  },
  components: {
    card: {
      description: 'Descrição',
    },
  },
  utils: {
    notify: {
      positive: 'Sucesso.',
      negative: 'Erro.',
    },
  },
  homepage: {
    no_cards: 'Nenhum card encontrado',
  },
  layouts: {
    main_layout: {
      logout: 'Sair',
    },
  },
  errors: {
    fetch_cards: 'Ops! Não conseguimos carregar os cards agora.',
    login_generic: 'Ops! Não foi possível fazer login agora.',
    get_user_data:
      'Não foi possível carregar as informações do usuário! Tente novamente mais tarde.',
  },
};
