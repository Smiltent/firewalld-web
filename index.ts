
import FirewalldService from "./src/services/firewalld"
import WebserverService from "./src/services/webserver"

import dotenv from "dotenv"
dotenv.config()

import logging from "./src/util/log"
logging(true)

export const webserverService = new WebserverService(process.env.PORT || "3000")
export const firewallService = new FirewalldService()