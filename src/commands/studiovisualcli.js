const { welcome } = require('../functions/messages')
const { textToSlug } = require('../helpers/helpers')
const {
  askName,
  askDescription,
  askSage,
  askPlugins,
} = require('../functions/questions')

const command = {
  name: 'studiovisualcli',
  run: async (toolbox) => {
    // mensagem de boas vindas
    toolbox.print.info(welcome())

    // inicia as perguntas
    const allAsk = [askName, askDescription, askSage, askPlugins]
    const { name, description, sage, plugins } = await toolbox.prompt.ask(
      allAsk
    )
    const nameSlug = textToSlug(name)
    const nameSlugComposer = textToSlug(name, '-')

    // cria arquivos do docker
    await toolbox.template.generate({
      template: 'docker-compose.js.ejs',
      target: `${nameSlug}/docker-compose.yml`,
      props: { nameSlug },
    })

    await toolbox.template.generate({
      template: 'docker-compose-m1.js.ejs',
      target: `${nameSlug}/docker-compose-m1.yml`,
      props: { nameSlug },
    })

    await toolbox.template.generate({
      template: 'dockerfile.js.ejs',
      target: `${nameSlug}/Dockerfile`,
      props: { nameSlug },
    })

    // cria arquivos git
    await toolbox.template.generate({
      template: 'gitignore.js.ejs',
      target: `${nameSlug}/.gitignore`,
    })

    // cria arquivos composer
    await toolbox.template.generate({
      template: 'composer.js.ejs',
      target: `${nameSlug}/composer.json`,
      props: { nameSlugComposer, description },
    })

    // inicia loading
    const spinner = toolbox.print.spin('Criando seu projeto')

    // roda comandos bash para o projeto
    let installSage = `composer create-project roots/sage themes/${nameSlug}`

    // switch (sage) {
    //   // case 'v9.0':
    //   //   installSage = `composer create-project roots/sage themes/${nameSlug} 9.x-dev`
    //   //   break
    //   // case 'v10.0':
    //   //   installSage = `composer create-project roots/sage themes/${nameSlug} 10`
    //   //   break
    // }

    await toolbox.system.run(`
      cd ${nameSlug} &&
      composer install --ignore-platform-reqs
      ${installSage} &&
      cd themes/${nameSlug} &&
      composer install --ignore-platform-reqs &&
      npm install &&
      npm run build
    `)

    // finaliza loading
    spinner.succeed('Projeto criado com sucesso!')
  },
}

module.exports = command
