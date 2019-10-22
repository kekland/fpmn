const ora = require('ora')
const cheerio = require('cheerio')
const prompts = require('prompts')
const utils = require('./utils')
const axios = require('axios').default
const chalk = require('chalk').default

module.exports = async (arg) => {
  let suggestedPackages = []
  let selectedPackage = null

  const oraProcess = ora({ discardStdin: false })
  oraProcess.start(`Fetching package ${chalk.bold(arg)} from pub.dev`)

  try {
    const response = await axios.get(`https://pub.dev/packages/${arg}`)

    if (response.request.path.startsWith('/packages?q=')) {
      const $ = cheerio.load(response.data)
      const suggestions = []

      $('li.list-item').each((_, el) => {
        const h3 = el.children.filter((v) => v.name === 'h3')

        if (h3.length > 0) {
          const children = h3[0].children
          if (children.length > 0 && children[0].name === 'a') {
            const textChildren = children[0].children
            if (textChildren.length > 0 && textChildren[0].data) {
              suggestions.push(textChildren[0].data)
            }
          }
        }
      })

      if (suggestions.length > 0) {
        suggestedPackages = suggestions.slice(0, 4)
      }
      oraProcess.fail(`Package ${chalk.bold(arg)} does not exist`)
      throw Error('package-doesnt-exist');
    }
    else {
      oraProcess.succeed()
      selectedPackage = arg
    }
  }
  catch (e) {
    if (e.message !== 'package-doesnt-exist') { return; }
    await utils.awaitForMilliseconds(1000)

    const promptResponse = await prompts({
      message: `Package ${chalk.bold(arg)} was not found. Maybe you meant:`,
      type: 'select',
      choices: [...suggestedPackages.map((v) => { return { title: v, value: v } }), { title: 'Cancel', value: false }],
      initial: 4,
    })

    if (promptResponse) {
      selectedPackage = promptResponse[0]
    }
    else {
      return;
    }
  }

  const oraProcess2 = ora({ discardStdin: false })
  oraProcess2.start(`Adding ${chalk.bold(selectedPackage)} to ${chalk.grey('pubspec.yaml')}`)
}