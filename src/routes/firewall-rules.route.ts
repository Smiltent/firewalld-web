
import requireLogin from "../middlewares/auth.middleware"
import { firewallService } from "../../index.ts"
import { Router } from "express"

const router = Router()

/**
 * 
 * FIREWALL POST REQUESTS
 * 
 */
// deny * traffic from an IP
router.post('/ip/deny', requireLogin, async (req, res) => {
    const { ip } = req.body

    if (!ip) return res.status(400).json({ type: "bad" })

    try {
        const data = await firewallService.denyIp(ip)
        if (!data) throw new Error("Failed to deny traffic from IP")

        return res.json({ type: "ok" })
    } catch (err) {
        console.error(`Failed to deny traffic from an IP: ${err}`)

        return res.status(500).json({ type: "failed" })
    }
})

// allow * traffic from an IP
router.post('/ip/allow', requireLogin, async (req, res) => {
    const { ip } = req.body

    if (!ip) return res.status(400).json({ type: "bad" })

    try {
        const data = await firewallService.allowIp(ip)
        if (!data) throw new Error("Failed to allow traffic from IP")

        return res.json({ type: "ok" })
    } catch (err) {
        console.error(`Failed to allow traffic from IP: ${err}`)

        return res.status(500).json({ type: "failed" })
    }
})

// deny port traffic from an IP
router.post('/ip/port/deny', requireLogin, async (req, res) => {
    const { ip, port } = req.body

    if (!ip || !port) return res.status(400).json({ type: "bad" })

    try {
        const data = await firewallService.denyPortForIp(port, ip)
        if (!data) throw new Error("Failed to deny port traffic from IP")

        return res.json({ type: "ok" })
    } catch (err) {
        console.error(`Failed to deny port traffic from IP: ${err}`)

        return res.status(500).json({ type: "failed" })
    }
})

// allow port traffic from an IP
router.post('/ip/port/allow', requireLogin, async (req, res) => {
    const { ip, port } = req.body

    if (!ip || !port) return res.status(400).json({ type: "bad" })

    try {
        const data = await firewallService.allowPortForIp(port, ip)
        if (!data) throw new Error("Failed to allow port traffic from IP")

        return res.json({ type: "ok" })
    } catch (err) {
        console.error(`Failed to allow port traffic from IP: ${err}`)

        return res.status(500).json({ type: "failed" })
    }
})

// close port
router.post(`/port/close`, requireLogin, async (req, res) => {
    const { port } = req.body

    if (!port) return res.status(400).json({ type: "bad" })

    try {
        const data = await firewallService.closePort(port)
        if (!data) throw new Error("Failed to close port")

        return res.json({ type: "ok" })
    } catch (err) {
        console.error(`Failed to close port: ${err}`)

        return res.status(500).json({ type: "failed" })
    }
})

// open port
router.post(`/port/open`, requireLogin, async (req, res) => {
    const { port } = req.body

    if (!port) return res.status(400).json({ type: "bad" })

    try {
        const data = await firewallService.openPort(port)
        if (!data) throw new Error("Failed to open port")

        return res.json({ type: "ok" })
    } catch (err) {
        console.error(`Failed to open port: ${err}`)

        return res.status(500).json({ type: "failed" })
    }
})

export default router