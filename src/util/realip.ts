
import type { Request } from "express"

export default function getClientIp(req: Request) {
    if (req.headers["cf-connecting-ip"]) return req.headers["cf-connecting-ip"] // if under cf
    if (req.headers["x-forwarded-for"]) { // if under proxy
        const ips = (req.headers["x-forwarded-for"] as string).split(",").map(ip => ip.trim())
        return ips[0]
    }

    if (req.headers["x-real-ip"]) return req.headers["x-real-ip"]

    return req.ip
}