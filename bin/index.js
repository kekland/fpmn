const arg = require('arg')
const fs = require('fs')
const path = require('path')
const chalk = require('chalk').default

const pubspecUtils = require('../lib/pubspec-utils')
const install = require('../lib/install')
const uninstall = require('../lib/install')

const commands = {
  install,
  uninstall,
}

const aliases = {
  i: commands.install,
  install: commands.install,
  u: commands.uninstall,
  uninstall: commands.uninstall,
}

const cli = async () => {
  const args = arg({})

  const cwd = process.cwd()
  console.log(cwd)

  const pubspecLocation = path.join(cwd, 'pubspec.yaml')

  if (!fs.existsSync(pubspecLocation)) {
    console.error(chalk.red(`Current directory does not contain ${chalk.bold('pubspec.yaml')}.`))
    return;
  }

  let pubspec = pubspecUtils.parsePubspec(pubspecLocation)

  const command = args._[0]
  pubspec = await aliases[command](pubspec, args._[1])

  if (pubspec) {
    pubspecUtils.writePubspec(pubspecLocation, pubspec)
  }
}

cli()