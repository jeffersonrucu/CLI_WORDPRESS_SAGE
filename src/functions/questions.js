const askSage = () => {
  return {
    type: 'select',
    name: 'sage',
    message: `Selecione a versão que deseja do framework Sage para utilizar em seu projeto: `,
    choices: ['v9.0', 'v10.0'],
  }
}

const askName = () => {
  return {
    type: 'input',
    name: 'name',
    message: `Insira um nome para seu projeto: `,
  }
}

const askDescription = () => {
  return {
    type: 'input',
    name: 'description',
    message: `Insira uma descrição para seu projeto: `,
  }
}

const askPlugins = () => {
  return {
    type: 'multiselect',
    name: 'plugins',
    message: 'Selecione os plugins que deseja: ',
    choices: [
      'Advanced Custom Fields',
      'Yoast SEO',
      'Gravity Forms',
      'Contact Form 7',
      'WPForms',
      'Jetpack',
      'WP Super Cache',
      'Akismet Anti-Spam',
    ],
  }
}

module.exports = { askSage, askName, askDescription, askPlugins }
