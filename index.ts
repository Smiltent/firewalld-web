
import IptablesService from "./src/services/iptables"
import WebserverService from "./src/services/webserver"

import dotenv from "dotenv"
dotenv.config()

import logging from "./src/util/log"
logging(true)

export const webserverService = new WebserverService(process.env.PORT || "3000")
export const firewallService = new IptablesService()