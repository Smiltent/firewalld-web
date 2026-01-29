
import cookieParser from "cookie-parser"
import session from "express-session"
import bodyParser from "body-parser"
import express from "express"
import path from "path"
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
        this.routes()
        this.start() 
    }

    public init() {
        const isDev = process.env.NODE_ENV === 'dev'

        this.app.use(
            '/public',
            express.static(path.join(__dirname, '..', '..', 'public'), {
                etag: !isDev,
                lastModified: !isDev,
                maxAge: isDev ? 0 : '10s',
            })
        )

        this.app.use(bodyParser.urlencoded({ extended: true }))
        this.app.use(cookieParser())
        this.app.use(express.json())
        this.app.use(cors())

        // sessions
        this.app.use(session({
            secret: String(process.env.SESSION_TOKEN),
            resave: false,
            saveUninitialized: false,
            cookie: {
                maxAge: 1000 * 60 * 60 
            }
        }))

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
    }

    public routes() {
        this.app.use('/panel', firewallRulesRoutes)
        this.app.use('/', publicRoutes)
    }

    public start() {
        this.app.listen(this.port, () => {
            console.log(`Webserver running on port ${this.port}!`)  
        })
    }
}
