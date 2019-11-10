const yaml = require('js-yaml')
const fs = require('fs')

const parsePubspec = (file) => {
  const pubspec = yaml.safeLoad(fs.readFileSync(file))
  
  return pubspec
}

const writePubspec = (file, pubspec) => {
  const str = yaml.safeDump(pubspec)

  fs.writeFileSync(file, str)
}

module.exports.parsePubspec = parsePubspec
module.exports.writePubspec = writePubspec