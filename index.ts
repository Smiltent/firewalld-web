
import dotenv from "dotenv"
import WebserverService from "./src/services/webserver"
import FirewalldService from "./src/services/firewalld"
dotenv.config()

const webserverService = new WebserverService(process.env.PORT || "3000")
const firewallService = new FirewalldService()