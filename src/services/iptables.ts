
import { exec } from "child_process"

export enum Protocols {
    tcp = "tcp",
    udp = "udp",
}

export enum Targets {
    drop = "DROP",
    accept = "ACCEPT",
    reject = "REJECT",
    masquerade = "MASQUERADE"
}

export enum States {
    new = "NEW",
    established = "ESTABLISHED",
    related = "RELATED"
}

export const protocolsList = Object.values(Protocols)
export const targetsList = Object.values(Targets)
export const statesList = Object.values(States)

export interface ParsedRule {
    nr: number
    state: string
    target: string
    protocol: string
    source: string
    destination: string
    option: string
    raw: string
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
        const out = await this.iptables(["-L", "INPUT", "-n", "--line-numbers", "-v"])
        const lines = out.split("\n").slice(2)

        return lines
            .filter(line => line.trim())
            .map(line => {
                const parts = line.trim().split(/\s+/)
                return {
                    nr: parseInt(parts[0] as string),
                    chain: "INPUT",
                    target: parts[3] || "",
                    protocol: parts[4] || "all",
                    source: parts[8] || "",
                    destination: parts[9] || "",
                    options: parts.slice(10).join(" ") || "",
                    raw: line.trim(),
                }
            })
    }

    public async deleteRule(line: number | string) {
        await this.iptables(["-D", "INPUT", line.toString()])
    }

    // ===================================================
    // methods
    // ===================================================
    public async port(port: string, protocol: Protocols, target: Targets) {
        return await this.iptables([
            "-A", "INPUT",
            "-p", protocol,
            "--dport", port,
            "-j", target
        ])
    }

    public async ip(ip: string, target: Targets) {
        return await this.iptables([
            "-A", "INPUT",
            "-s", ip,
            "-j", target
        ])
    }

    public async portForIp(ip: string, port: string, protocol: Protocols, target: Targets) {
        return await this.iptables([
            "-A", "INPUT",
            "-s", ip,
            "-p", protocol,
            "--dport", port,
            "-j", target
        ])
    }

    public async richRule(opts: {
        source?: string,
        destination?: string,
        sourcePort?: string,
        destinationPort?: string,
        protocol: Protocols,
        target: Targets
    }) {
        const args = ["-A", "INPUT"]

        if (opts.source) args.push("-s", opts.source)
        if (opts.destination) args.push("-d", opts.destination)
        args.push("-p", opts.protocol)

        if (opts.sourcePort) args.push("--sport", opts.sourcePort)
        if (opts.destinationPort) args.push("--dport", opts.destinationPort)
        args.push("-j", opts.target)

        await this.iptables(args)
    }
}