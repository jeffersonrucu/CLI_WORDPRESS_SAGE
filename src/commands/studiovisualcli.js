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
    const { name, description, version, sage } = await toolbox.prompt.ask(
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
      props: { name, nameSlugComposer },
    })

    // inicia loading
    const spinner = toolbox.print.spin('Criando seu projeto')

    // roda comandos bash para o projeto
    await toolbox.system.run(`   
      cd ${nameSlug} &&
      composer install
      composer create-project roots/sage themes/${nameSlug} &&
      cd themes/${nameSlug} &&
      composer install &&
      yarn &&
      yarn build
    `)

    // finaliza loading
    spinner.succeed('Projeto criado com sucesso!')
  },
}

module.exports = command
