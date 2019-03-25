import idiom from 'idiom.js'

const lang = idiom({
  'default': {
    'welcome': 'Welcome to AI World',
    'game_over': 'Game Over'
  },
  'fr': {
    'welcome': 'Bienvenue dans AI World',
    'game_over': 'Game Over'
  }
})

export default lang(window.navigator.language)