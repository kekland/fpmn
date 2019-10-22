const arg = require('arg')

const install = require('../lib/install')
const uninstall = require('../lib/install')

const commands = {
  install: (arg) => install(arg),
  uninstall: (arg) => uninstall(arg),
}

const aliases = {
  i: commands.install,
  install: commands.install,
  u: commands.uninstall,
  uninstall: commands.uninstall,
}

const cli = () => {
  const args = arg({})

  const command = args._[0]
  aliases[command](args._[1])
}

cli()