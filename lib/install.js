const ora = require('ora')
const cheerio = require('cheerio')
const prompts = require('prompts')
const utils = require('./utils')
const pubdev = require('./pubdev-utils')
const pubspec = require('./pubspec-utils')
const axios = require('axios').default
const chalk = require('chalk').default

module.exports = async (pubspec, arg, selectVersion = true) => {
  let suggestedPackages = []
  let selectedPackage = null

  const oraProcess = ora({ discardStdin: false })
  oraProcess.start(`Fetching package ${utils.green(arg)} from pub.dev`)

  try {
    const result = await pubdev.findPackage(arg)

    if (result.suggestions) {
      suggestedPackages = result.suggestions.slice(0, 4)

      oraProcess.fail(`Package ${utils.green(arg)} does not exist`)
      throw Error('package-doesnt-exist');
    }
    else {
      oraProcess.succeed()
      selectedPackage = result.value
    }

  }
  catch (e) {
    if (e.message !== 'package-doesnt-exist') { return; }
    await utils.awaitForMilliseconds(500)

    const promptResponse = await prompts({
      message: `Package ${utils.green(arg)} was not found. Maybe you meant:`,
      type: 'select',
      name: 'value',
      choices: [...suggestedPackages.map((v) => { return { title: v, value: v } }), { title: 'Cancel', value: 'cancel' }],
      initial: suggestedPackages.length,
    })

    if (promptResponse.value && promptResponse.value !== 'cancel') {
      selectedPackage = promptResponse.value
    }
    else {
      return;
    }
  }

  if (selectedPackage in pubspec.dependencies) {
    await utils.awaitForMilliseconds(500)
    const promptResponse = await prompts({
      message: `Package ${utils.green(selectedPackage)} with version ${utils.green(pubspec.dependencies[selectedPackage] || 'latest')} already exists in ${utils.green('pubspec.yaml')}. Do you want to upgrade it?`,
      type: 'select',
      name: 'value',
      choices: [{ title: 'Yes', value: 'yes' }, { title: 'No', value: false }],
      initial: 0,
    })

    if (promptResponse.value !== 'yes') {
      return;
    }
  }

  let version = ''
  if (selectVersion) {
    await utils.awaitForMilliseconds(500)
    const oraProcess2 = ora({ discardStdin: false })
    oraProcess2.start(`Fetching versions of ${utils.green(selectedPackage)}`)

    try {
      const versions = await pubdev.fetchVersions(selectedPackage)
      const lastVersions = versions.slice(0, 5)

      oraProcess2.succeed()

      await utils.awaitForMilliseconds(1000)

      const promptResponse = await prompts({
        message: `Select the version:`,
        type: 'select',
        name: 'value',
        choices: [{ title: 'Latest', value: 'latest' }, ...lastVersions.map((v) => { return { title: v, value: v } })],
        initial: 0,
      })

      if (promptResponse.value) {
        if (promptResponse.value === 'latest') {
          version = ''
        }
        else {
          version = `^${promptResponse.value}`
        }
      }
      else {
        return;
      }
    }
    catch (e) {
      oraProcess2.fail('Failed to fetch versions.')
      return;
    }
  }

  pubspec.dependencies[selectedPackage] = version

  return pubspec
}