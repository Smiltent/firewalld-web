
import { Router } from "express"
import requireLogin from "../middlewares/auth.middleware"

const router = Router()

router.get('/', (req, res) => {
    res.render("index")
}) 

router.get("/dashboard", requireLogin, (req, res) => {
    res.render("dashboard")
})

router.post('/authorize', (req, res) => {
    const { password } = req.body
    if (
        !password ||
        password !== process.env.ACCESS_TOKEN
    ) return res.status(401).send("unauthorized")
    
    req.session.loggedIn = true

    return res.status(200).send("authorized")
})

export default router
