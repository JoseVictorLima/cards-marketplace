export default {
  // failed: 'Ação falhou',
  // success: 'Ação foi bem sucedida',
  login: {
    labels: {
      login: 'Iniciar sessão',
      email: 'E-mail',
      password: 'Senha',
      submit: 'Login',
      register: 'Criar conta',
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
      description: 'Descrição:',
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
      title: 'Cartas disponíveis para troca',
      no_cards: 'Nenhuma carta encontrada',
      button: {
        owns: 'Já possui',
        cart: 'No carrinho',
        trade: 'Trocar',
      },
    },
    trades: {
      title: 'Trocas Abertas',
      filter: {
        items_per_page: 'items por página',
      },
      pagination: {
        previous: 'Anterior',
        next: 'Próxima',
      },
      name: 'Solicitante:',
      date: 'Data:',
      offering: 'Oferecido:',
      receiving: 'Recebido:',
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
  cart: {
    title: 'Seu Carrinho',
    description: 'Descrição:',
    no_selected: 'Nenhuma carta selecionada',
    submit: 'Finalizar',
    receiving: {
      title: 'Recebendo:',
      invalid: 'Você já possui uma ou mais cartas selecionadas!',
      info: {
        prefix: 'Clique',
        link: 'aqui',
        suffix: 'para selecionar cartas que deseja receber',
      },
    },
    offering: {
      title: 'Oferecendo:',
      invalid: 'Cartas não podem ser repetidas!',
      info: 'Para efetuar a troca, adicione pelo menos uma carta sua',
    },
    select: {
      title: 'Selecione cartas que deseja oferecer',
      no_card: 'Você não possui cartas',
      confirm: 'Confirmar',
      info: {
        prefix: 'É possível adicionar cartas no seu',
        link: 'perfil',
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
      translation: {
        english: 'Inglês',
        portuguese: 'Português',
      },
    },
  },
  not_found: {
    info: 'Ops. A página que você procura não foi encontrada...',
    button: 'Voltar para página inicial',
  },
  success: {
    register: 'Cadastro concluído.',
    add_card: 'Cartas adicionadas.',
    delete_trade: 'Troca apagada.',
    save_trade: 'Solicitação de troca realizada.',
  },
  errors: {
    get_cards: 'Ops! Não foi possível carregar as cartas. Tente mais tarde',
    login_generic: 'Ops! Não foi possível fazer login. Tente mais tarde',
    get_user_data: 'Ops! Não foi possível carregar as informações do usuário. Tente mais tarde.',
    get_user_cards: 'Ops! Não foi possível Carregar as cartas do usuario logado! Tente mais tarde.',
    register_generic: 'Ops! Não foi possível realizar o cadastro. Tente mais tarde.',
    get_available_cards: 'Ops! Não foi possível carregar mais cartas.',
    add_card: 'Ops! Não foi possível adicionar as cartas selecionadas. Tente mais tarde',
    load_trade: 'Ops! Não foi possível carregar as trocas. Tente mais tarde.',
    delete_trade: 'Ops! Não foi possível apagar a troca. Tente mais tarde.',
    save_trade: 'Ops! Não foi possível realizar a solicitação de troca. Tente mais tarde.',
  },
};
