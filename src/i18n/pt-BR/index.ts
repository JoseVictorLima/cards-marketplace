export default {
  // failed: 'Ação falhou',
  // success: 'Ação foi bem sucedida',
  login: {
    labels: {
      login: 'Iniciar sessão',
      email: 'E-mail',
      password: 'Senha',
      submit: 'Login',
    },
    rules: {
      email: 'E-mail não pode ser vazio',
      password: 'Senha não pode ser vazia',
    },
  },
  register: {
    label: {
      register: 'Criar conta',
      name: 'Nome',
      email: 'E-mail',
      password: 'Senha',
      confirm_password: 'Confirmar senha',
      submit: 'Cadastrar',
    },
    hint: {
      password:
        'Senha deve conter pelo menos 8 caracteres, incluindo letras, números e caracteres especiais.',
    },
    rules: {
      name: 'Nome é obrigatório',
      email: 'E-mail é obrigatório',
      email_invalid: 'Digite um e-mail válido',
      password: 'Senha é obrigatória',
      password_digit: 'Senha deve conter pelo menos um número',
      password_lowerCase: 'Senha deve conter pelo menos uma letra minúscula',
      password_upperCase: 'Senha deve conter pelo menos uma letra maiúscula',
      password_special_character: 'Senha deve conter pelo menos um caractere especial',
      password_length: 'Senha deve conter pelo 8 caracteres',
      confirm_password: 'Senhas estão diferentes',
    },
  },
  profile: {
    cards: {
      title: 'Cartas',
      title_session_user: 'Minhas cartas',
      add: 'Adicionar carta',
      no_cards: 'Nenhuma carta encontrada',
    },
    add_cards: {
      title: 'Adicionar cartas',
      info: 'Selecione as cartas que deseja adicionar à sua conta.',
      add: 'Adicionar',
      no_cards: 'Nenhuma carta encontrada',
      confirm: {
        title: 'Revisar cartas selecionadas',
        description: 'Descrição:',
        remove: 'Remover Carta',
        save: 'Confirmar',
      },
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
  home: {
    cards: {
      no_cards: 'Nenhuma carta encontrada',
    },
    trades: {
      title: 'Trocas Realizadas',
      filter: {
        items_per_page: 'items por página',
      },
      pagination: {
        previous: 'Anterior',
        next: 'Próxima',
      },
      name: 'Solicitante:',
      date: 'Data:',
      offering: 'Cartas oferecidas:',
      receiving: 'Cartas recebidas:',
      no_trades: 'Nehuma troca encontrada',
      delete: {
        title: 'Apagar Troca',
        description: 'Deseja realmente apagar esta troca?',
        info: 'Esta ação não poderá ser desfeita!',
        cancel: 'Cancelar',
        delete: 'Apagar',
      },
    },
  },
  layouts: {
    main_layout: {
      profile: 'Meu perfil',
      logout: 'Sair',
      navigation: {
        cards: 'Cartas',
        trades: 'Trocas',
      },
    },
  },
  success: {
    register: 'Cadastro concluído.',
    add_card: 'Cartas adicionadas.',
    delete_trade: 'Troca apagada.',
  },
  errors: {
    get_cards: 'Ops! Não conseguimos carregar os cards agora.',
    login_generic: 'Ops! Não foi possível fazer login agora.',
    get_user_data: 'Ops! Não foi possível carregar as informações do usuário. Tente mais tarde.',
    register_generic: 'Ops! Não foi possível realizar o cadastro! Tente mais tarde.',
    get_available_cards: 'Não foi possível carregar mais cartas.',
    add_card: 'Não foi possível adicionar as cartas selecionadas! Tente mais tarde',
    delete_trade: 'Não foi possível apagar a troca! Tente mais tarde.',
  },
};
