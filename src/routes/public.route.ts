
import requireLogin from "../middlewares/auth.middleware"
import { Router } from "express"

const router = Router()

router.get('/', (req, res) => {
    if (req.session.loggedIn) {
        return res.redirect("/d")
    }

    res.render("index")
}) 

router.get("/d", requireLogin, (req, res) => {
    res.render("dashboard")
})

router.get("/l", (req, res) => {
    req.session.loggedIn = false

    return res.redirect("/")
})

router.get("/favicon.ico", (req, res) => {
    res.sendFile("public/favicon.ico")
})

router.post('/a', (req, res) => {
    const { password } = req.body
    if (
        !password ||
        password !== process.env.ACCESS_TOKEN
    ) return res.status(401).send("unauthorized")
    
    req.session.loggedIn = true

    return res.status(200).send("authorized")
})

export default router
