
import { firewallService } from "../.."
import requireLogin from "../middlewares/auth.middlewares"
import { Router } from "express"

const router = Router()

router.get('/main', requireLogin, (req, res) => {
    res.render("pages/main")
}) 

router.get('/add', requireLogin, async (req, res) => {
    res.render("pages/add")
}) 

router.get('/rules', requireLogin, async (req, res) => {
    try {
        const rules = await firewallService.listRules()
        res.render("pages/rules", { rules })
    } catch (err) {
        res.render("pages/rules", { rules: [], error: "failed to load rules" })
    }
})

export default router
