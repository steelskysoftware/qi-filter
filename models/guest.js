import {model, endpoint} from './index'

@endpoint('guests')
@model('Guest')
export class Guest {
  get image() {
    try {
      return require(`@/assets/guests/${this.tag}.jpg`)
    } catch(e) {
      return require(`@/assets/guests/placeholder.jpg`)
    }
  }
}
