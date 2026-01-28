
import { exec } from "child_process"

enum PortProtocols {
    tcp = "tcp",
    udp = "udp"
}

export default class FirewalldService {
    /**
     * Base command wrapper for making firewalld rules
     * @param cmd Command
     */
    private firewallcmd(cmd: string): Promise<string> {
        return new Promise((resolve, reject) => {
            exec(`firewall-cmd ${cmd}`, (error, stdout, stderr) => {
                if (error) return reject(stderr || error.message)

                resolve(stdout.trim())
            })
        })
    }

     /**
     * Base command wrapper for making firewalld rich rules
     * @param cmd Rich Rule
     */
    private richrule(cmd: string): Promise<string> {
        return new Promise((resolve, reject) => {
            exec(`firewall-cmd --add-rich-rule='${cmd}'`, (error, stdout, stderr) => {
                if (error) return reject(stderr || error.message)

                resolve(stdout.trim())
            })
        })
    }

    /**
     * Reload firewalld to apply changes
     * @returns true / false
     */
    private async reload(): Promise<boolean> {
        var result = await this.firewallcmd('--reload')

        return result == "success" ? true : false
    }

    // ===================================================
    // list
    // ===================================================
    public async getZones(): Promise<Array<string>> {
        var result = (await this.firewallcmd('--get-zones')).split(' ')

        return result
    }
    public async getDefaultZone() {
        return await this.firewallcmd('--get-default-zone')
    }
    public async getOpenPorts(): Promise<Array<string>> {
        var result = (await this.firewallcmd('--list-ports')).split(' ')

        return result
    }
    public async getServices(): Promise<Array<string>> {
        var result = (await this.firewallcmd('--list-services')).split(' ')

        return result
    }
    public async getRichRules(): Promise<Array<string>> {
        var result = (await this.firewallcmd('--list-rich-rules')).split('\n')

        return result
    }

    // ===================================================
    // ports
    // ===================================================
    public async removeRichRule(rule: string) {
        var result = await this.firewallcmd(`--remove-rich-rule='${rule}'`)
        var reload = await this.reload()
        
        return result == "success" && reload == true ? true : false
    }

    // ===================================================
    // ports
    // ===================================================
    public async openPort(port: string, protocol: PortProtocols = PortProtocols.tcp) {
        var result = await this.firewallcmd(`--add-port=${port}/${protocol} --permanent`)
        var reload = await this.reload()

        return result == "success" && reload == true ? true : false
    }
    public async closePort(port: string, protocol: PortProtocols = PortProtocols.tcp) {
        var result = await this.firewallcmd(`--remove-port=${port}/${protocol} --permanent`)
        var reload = await this.reload()

        return result == "success" && reload == true ? true : false
    }

    // ===================================================
    // rich rules - supports ip ranges and port ranges (i think)
    // ===================================================
    public async denyIp(ip: string) {
        var result = await this.richrule(`rule family="ipv4" source address="${ip}" drop`)
        var reload = await this.reload()

        return result == "success" && reload == true ? true : false
    }
    public async allowIp(ip: string) {
        var result = await this.richrule(`rule family="ipv4" source address="${ip}" accept`)
        var reload = await this.reload()

        return result == "success" && reload == true ? true : false
    }

    public async denyPortForIp(port: string, ip: string) {
        var result = await this.richrule(`rule family="ipv4" source address="${ip}" port port="${port}" protocol="tcp" drop`)
        var reload = await this.reload()

        return result == "success" && reload == true ? true : false
    }
    public async allowPortForIp(port: string, ip: string) {
        var result = await this.richrule(`rule family="ipv4" source address="${ip}" port port="${port}" protocol="tcp" accept`)
        var reload = await this.reload()

        return result == "success" && reload == true ? true : false
    }
}