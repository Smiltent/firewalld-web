
import { firewallService } from "../.."
import requireLogin from "../middlewares/auth.middleware"
import { Router } from "express"

const router = Router()

router.get('/main', requireLogin, (req, res) => {
    res.render("pages/main")
}) 

router.get('/add', requireLogin, async (req, res) => {
    res.render("pages/add") /* { zones: await firewallService.getZones() } */
}) 

router.get('/rules', requireLogin, async (req, res) => {
    res.render("pages/rules", { richrules: await firewallService.listRules() })
}) 

export default router
