const Listr = require('listr')
const axios = require('axios').default
const chalk = require('chalk').default

module.exports = (arg) => {
  const tasks = new Listr([
    {
      title: `Fetching package ${chalk.bold(arg)} from pub.dev`,
      task: async () => {
        const response = await axios.get(`https://pub.dev/packages/${arg}`)

        return true
      },
    },
  ])

  tasks.run().catch(console.error)
}