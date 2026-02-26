
import requireLogin from "../middlewares/auth.middleware"
import { firewallService } from "../../index.ts"
import { Router } from "express"
import { Seperators, Types, Protocols } from "../services/iptables.ts"

const router = Router()

// <allow / deny> * traffic from an IP
router.post('/ip', requireLogin, async (req, res) => {
    const { ip, type } = req.body

    console.debug(type, ip)

    if (!type || !Types.includes(type)) return res.status(400).json({ type: "bad" })
    if (!ip) return res.status(400).json({ type: "bad" })

    try {
        const data = await firewallService.ip(ip, type)
        if (!data) throw new Error(`Failed to ${type} traffic from IP`)

        return res.json({ type: "ok" })
    } catch (err) {
        console.error(`Failed to ${type} traffic from an IP: ${err}`)
        return res.status(500).json({ type: "failed" })
    }
})

// <allow / deny> * traffic from a bulk of IPs, using a seperator
router.post('/ip-bulk', requireLogin, async (req, res) => {
    const { ips, seperator, type } = req.body

    if (!seperator || !(seperator in Seperators)) return res.status(400).json({ type: "bad" })
    if (!type || !Types.includes(type)) return res.status(400).json({ type: "bad" })
    if (!ips) return res.status(400).json({ type: "bad" })

    const ipsArray = ips
        .split(Seperators[seperator as keyof typeof Seperators])
        .map((ip: string) => ip.trim())
        .filter((ip: string) => ip.length > 0)

    try {
        for (const ip of ipsArray) {
            const data = await firewallService.ip(ip, type)


            if (!data) {
                console.error(`Failed to ${type} traffic from IP (bulk): ${ip}`)
                continue
            }
        }
    } catch (err) {
        console.error(`Failed to ${type} traffic from IPs: ${err}`)
        return res.status(500).json({ type: "failed" })
    }

    return res.json({ type: "ok" })
})

// <allow / deny> port traffic from an IP
router.post('/ip-port', requireLogin, async (req, res) => {
    const { ip, port, type } = req.body

    if (!type || !Types.includes(type)) return res.status(400).json({ type: "bad" })
    if (!ip || !port) return res.status(400).json({ type: "bad" })

    try {
        const data = await firewallService.portForIp(port, ip, Protocols.tcp, type)
        if (!data) throw new Error("Failed to deny port traffic from IP")

        return res.json({ type: "ok" })
    } catch (err) {
        console.error(`Failed to ${type} port traffic from IP: ${err}`)
        return res.status(500).json({ type: "failed" })
    }
})


// <open / close> port
router.post(`/port`, requireLogin, async (req, res) => {
    const { port, type, protocol } = req.body

    if (!type || !Types.includes(type)) return res.status(400).json({ type: "bad" })
    if (!port) return res.status(400).json({ type: "bad" })

    try {
        const data = await firewallService.port(port, protocol, type)
        if (!data) throw new Error(`Failed to ${type} port`)

        return res.json({ type: "ok" })
    } catch (err) {
        console.error(`Failed to ${type} port: ${err}`)
        return res.status(500).json({ type: "failed" })
    }
})

export default router