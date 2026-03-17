
import { targetsList, Protocols, Targets, protocolsList } from "../services/iptables.ts"
import requireLogin from "../middlewares/auth.middlewares.ts"
import { firewallService } from "../../index.ts"

import { Router } from "express"
const router = Router()

// <allow / deny> * traffic from an IP
router.post('/ip', requireLogin, async (req, res) => {
    const { ip, target } = req.body

    if (!ip || !target || !targetsList.includes(target)) return res.status(400).json({ type: "bad" })

    try {
        await firewallService.ip(ip, target as Targets)

        return res.json({ type: "ok" })
    } catch (err) {
        console.error(`Failed to ${target} traffic from an IP: ${err}`)
        return res.status(500).json({ type: "failed" })
    }
})

// <allow / deny> port traffic from an IP
router.post('/ipport', requireLogin, async (req, res) => {
    const { ip, port, protocol, target } = req.body

    if (!ip || !port || !target || !targetsList.includes(target)) return res.status(400).json({ type: "bad" })
    if (!protocol || !protocolsList.includes(protocol)) return res.status(400).json({ type: "bad" })

    try {
        await firewallService.portForIp(ip, port, protocol as Protocols, target as Targets)

        return res.json({ type: "ok" })
    } catch (err) {
        console.error(`Failed to ${target} port traffic from IP: ${err}`)
        return res.status(500).json({ type: "failed" })
    }
})

// <open / close> port
router.post(`/port`, requireLogin, async (req, res) => {
    const { port, target, protocol } = req.body

    if (!port || !target || !targetsList.includes(target)) return res.status(400).json({ type: "bad" })
    if (!protocol || !protocolsList.includes(protocol)) return res.status(400).json({ type: "bad" })

    try {
        await firewallService.port(port, protocol as Protocols, target as Targets)

        return res.json({ type: "ok" })
    } catch (err) {
        console.error(`Failed to ${target} port: ${err}`)
        return res.status(500).json({ type: "failed" })
    }
})

router.post(`/richrule`, requireLogin, async (req, res) => {
    const { source, destination, sourcePort, destinationPort, protocol, target } = req.body

    if (!target || !targetsList.includes(target)) return res.status(400).json({ type: "bad" })
    if (!protocol || !protocolsList.includes(protocol)) return res.status(400).json({ type: "bad" })

    try {
        await firewallService.richRule({
            source,
            destination,
            sourcePort,
            destinationPort,
            protocol: protocol as Protocols,
            target: target as Targets
        })

        return res.json({ type: "ok" })
    } catch (err) {
        console.error(`Failed to create rich rule: ${err}`)
        return res.status(500).json({ type: "failed" })
    }
})

router.delete("/rule/:nr", requireLogin, async (req, res) => {
    const nr = parseInt(req.params.nr as string)

    if (isNaN(nr) || nr < 1) return res.status(400).json({ type: "bad" })
    
    try {
        await firewallService.deleteRule(nr)

        return res.json({ type: "ok" })
    } catch (err) {
        console.error(`Failed to delete rule #${nr}: ${err}`)
        return res.status(500).json({ type: "failed" })
    }
})

export default router