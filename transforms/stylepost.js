var stylify = require('stylify')
var poststylus = require('poststylus')
const autoprefix = require('autoprefixer')
module.exports = function stylePost(file, options) {
  return stylify(file, {
    use: [
      poststylus([
        autoprefix({
          browsers: ['ie 10-11','iOS 8-10']
        }),
      ])
    ]
  })
}
