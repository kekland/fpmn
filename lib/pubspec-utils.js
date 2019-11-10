const yaml = require('js-yaml')
const fs = require('fs')

const parsePubspec = (file) => {
  const pubspec = yaml.safeLoad(fs.readFileSync(file))

  for (const key in pubspec.dependencies) {
    const v = pubspec.dependencies[key]
    pubspec.dependencies[key] = v == null ? '' : v
  }

  return pubspec
}

const writePubspec = (file, pubspec) => {
  const str = yaml.dump(pubspec)

  fs.writeFileSync(file, str)
}

module.exports.parsePubspec = parsePubspec
module.exports.writePubspec = writePubspec