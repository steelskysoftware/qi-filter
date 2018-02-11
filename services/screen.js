import styles from '../mixins/screen.styl'
import debounce from 'lodash/debounce'

var style = document.createElement('style')
style.textContent = styles

var handle = document.createElement('div')
handle.classList.add('responsive')


document.head.appendChild(style)

if(document.body) {
  document.body.appendChild(handle)
} else {
  document.addEventListener('DOMContentLoaded', e => {
    document.body.appendChild(handle)
  })
}

const SIZES = [ 'desktop', 'tablet', 'mobile' ]

export default {
  observe(cb) {
    var callback = debounce(e=> {cb(this)}, 250)
    window.addEventListener('resize', callback)
    return () => {
      window.removeEventListener('resize', callback)
    }

  },
  get isMobile() {
    return this.size == 'mobile'
  },
  get isTablet() {
    return this.size == 'tablet'
  },
  get isDevice() {
    return this.size != 'desktop'
  },
  get size() {
    return SIZES[window.getComputedStyle(handle).zIndex]
  }
}
