
/*

  this is the exact same system for iptables.ts, 
  just storing everything in a database,
  instead of in the firewall itself

  this is just so I can make a demo project, 
  without exposing an actual server with iptables.

*/

import { Database } from "bun:sqlite"
import { Protocols, Targets, type ParsedRule } from "./iptables.ts"

export const protocolsList = Object.values(Protocols)
export const targetsList = Object.values(Targets)

const db = new Database("firewall.db")
db.run(`
    CREATE TABLE IF NOT EXISTS rules (
        id        INTEGER PRIMARY KEY AUTOINCREMENT,
        target    TEXT NOT NULL,
        protocol  TEXT NOT NULL DEFAULT 'all',
        source    TEXT,
        destination TEXT,
        sourcePort TEXT,
        destinationPort TEXT
    )

`)

export default class FakeTablesService {
    // ===================================================
    // list
    // ===================================================
    public async listRules(): Promise<ParsedRule[]> {
        const rows = db.query("SELECT * FROM rules ORDER BY id").all() as any[]

        return rows.map((row, i) => ({
            nr: row.id,
            state: "INPUT",
            target: row.target,
            protocol: row.protocol,
            source: row.source || "anywhere",
            destination: row.destination || "anywhere",
            option: [
                row.sourcePort ? `spt:${row.sourcePort}` : "",
                row.destinationPort ? `dpt:${row.destinationPort}` : "",
            ].filter(Boolean).join(" "),
            raw: "",
        }))
    }

    public async deleteRule(id: number) {
        db.run("DELETE FROM rules WHERE id = ?", [ id ])
    }

    // ===================================================
    // methods
    // ===================================================
    public async port(port: string, protocol: Protocols, target: Targets) {
        db.run(
            "INSERT INTO rules (target, protocol, destinationPort) VALUES (?, ?, ?)",
            [ target, protocol, port ]
        )
    }

    public async ip(ip: string, target: Targets) {
        db.run(
            "INSERT INTO rules (target, protocol, source) VALUES (?, 'all', ?)",
            [ target, ip ]
        )
    }

    public async portForIp(ip: string, port: string, protocol: Protocols, target: Targets) {
        db.run(
            "INSERT INTO rules (target, protocol, source, destinationPort) VALUES (?, ?, ?, ?)",
            [ target, protocol, ip, port ]
        )
    }

    public async richRule(opts: {
        source?: string,
        destination?: string,
        sourcePort?: string,
        destinationPort?: string,
        protocol: Protocols,
        target: Targets
    }) {
        db.run(
            `INSERT INTO rules (target, protocol, source, destination, sourcePort, destinationPort) VALUES (?, ?, ?, ?, ?, ?)`,
            [
                opts.target,
                opts.protocol,
                opts.source ?? null,
                opts.destination ?? null,
                opts.sourcePort ?? null,
                opts.destinationPort ?? null
            ]
        )
    }
}