const cheerio = require('cheerio')
const axios = require('axios').default

const findPackage = async (name) => {
  const response = await axios.get(`https://pub.dev/packages/${name}`)

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

    return { suggestions, value: null }
  }
  else {
    return { suggestions: null, value: name }
  }
}


const fetchVersions = async (name) => {
  const response = await axios.get(`https://pub.dev/packages/${name}/versions`)

  const $ = cheerio.load(response.data)

  const versions = []
  $('table.version-table').find('tbody').children().each((i, e) => versions.push(e.attribs['data-version']))
  
  return versions
}

module.exports.findPackage = findPackage
module.exports.fetchVersions = fetchVersions