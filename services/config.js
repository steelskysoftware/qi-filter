export const config = {
  lang: 'en',
  navigate(path) {
    location.href = path
  },
}

if(localStorage.locale) config.lang = localStorage.locale

export default config
