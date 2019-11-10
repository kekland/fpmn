const chalk = require('chalk').default

module.exports.awaitForMilliseconds = (delay) => {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, delay)
  })
}

module.exports.green = (v) => chalk.bold(chalk.green(v))