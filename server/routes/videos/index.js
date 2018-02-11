import {Router} from 'express'
import list from './list'
import show from './show'
const router = Router()

router.get('/', list)
router.get('/:id', show)

export default router
