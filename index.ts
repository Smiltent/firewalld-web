
import FakeTablesService from "./src/services/faketables"
import WebserverService from "./src/services/webserver"
import IptablesService from "./src/services/iptables"

import dotenv from "dotenv"
dotenv.config()

import logging from "./src/util/log"
logging(true)

export const webserverService = new WebserverService(process.env.PORT || "3000")

let _firewall = process.env.NODE_ENV === "showcase"
    ? new FakeTablesService()
    : new IptablesService()

export { _firewall as firewallService }