
import { exec } from "child_process"

export enum Protocols {
    tcp = "tcp",
    udp = "udp"
}

export enum Types {
    drop = "DROP",
    accept = "ACCEPT",
    reject = "REJECT",
    includes = "includes"
}

export enum Seperators {
    newline = "\n", 
    semicolon = ";",
    comma = ","
}

export default class IptablesService {
    /**
     * Base command wrapper for making iptables rules
     * @param args Arguments
     */
    private async iptables(args: string[]): Promise<string> {
        return new Promise((resolve, reject) => {
            exec(`iptables ${args.join(" ")}`, (error, stdout, stderr) => {
                if (error) return reject(stderr || error.message)

                resolve(stdout.trim())
            })
        })
    }

    // ===================================================
    // list
    // ===================================================
    public async listRules() {
        return (await this.iptables(['-S'])).split("\n")
    }

    public async listChain(chain: string) {
        return (await this.iptables([`-S ${chain}`])).split("\n")
    }

    // ===================================================
    // methods
    // ===================================================
    public async port(port: string, protocol: Protocols, type: Types) {
        return await this.iptables([
            "-A", "INPUT",
            "-p", protocol,
            "--dport", port,
            "-j", type
        ])
    }

    public async ip(ip: string, type: Types) {
        return await this.iptables([
            "-A", "INPUT",
            "-s", ip,
            "-j", type
        ])
    }

    public async portForIp(ip: string, port: string, protocol: Protocols, type: Types) {
        return await this.iptables([
            "-A", "INPUT",
            "-s", ip,
            "-p", protocol,
            "--dport", port,
            "-j", type
        ])
    }
}