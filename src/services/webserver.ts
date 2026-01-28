
import express from "express"
import cors from "cors"

import firewallRulesRoutes from '../routes/firewall-rules.route.js'
import publicRoutes from '../routes/public.route.js'

export default class WebserverService {
    private port: string
    private app: express.Application

    constructor(port: string) {
        this.port = port
        this.app = express()

        this.init()
    }

    public init() {
        this.app.use(express.static('public'))

        // set engine to ejs (so it would work, duh...)
        this.app.set("view engine", "ejs")

        // trust proxy if behind one
        if (process.env.UNDER_PROXY === "true") {
            const allowedIps = process.env.ALLOWED_IPS
                ? process.env.ALLOWED_IPS.split(",").map(ip => ip.trim()) : []
                
            this.app.set("trust proxy", [
                "loopback",
                ...allowedIps
            ])
        }
        
        this.app.use(express.json())
        this.app.use(cors())
    }

    public routes() {
        this.app.use('/panel', firewallRulesRoutes)
        this.app.use('/', publicRoutes)

        this.app.use((req, res) => {
            res.status(404).render("error")
        })
    }

    public start() {
        this.app.listen(this.port, () => {
            console.log(`Webserver running on port ${this.port}!`)  
        })
    }
}
