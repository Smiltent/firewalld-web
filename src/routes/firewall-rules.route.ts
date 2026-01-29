
import { Router } from "express"

import requireLogin from "../middlewares/auth.middleware"

const router = Router()

router.get('/panel', requireLogin, (req, res) => {

}) 

export default router
