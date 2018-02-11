import {Router} from 'express'
import guests from './guests'
import videos from './videos'

const router = Router()
router.use('/guests', guests)
router.use('/videos', videos)

export default router
