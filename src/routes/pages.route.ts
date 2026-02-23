
import { firewallService } from "../.."
import requireLogin from "../middlewares/auth.middleware"
import { Router } from "express"

const router = Router()

router.get('/main', requireLogin, (req, res) => {
    res.render("pages/main")
}) 

router.get('/add', requireLogin, async (req, res) => {
    res.render("pages/add", { zones: await firewallService.getZones() })
}) 

router.get('/services', requireLogin, async (req, res) => {
    res.render("pages/services", { services: await firewallService.getServices() })
}) 

router.get('/ports', requireLogin, async (req, res) => {
    res.render("pages/ports", { ports: await firewallService.getOpenPorts() })
}) 

router.get('/richrules', requireLogin, async (req, res) => {
    res.render("pages/richrules", { richrules: await firewallService.getRichRules() })
}) 

export default router
