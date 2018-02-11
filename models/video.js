import {model, endpoint} from './index'

@endpoint('videos')
@model('Video')
export class Video {
  get guestTags() {
    return this.tags.split(',')
  }
}
