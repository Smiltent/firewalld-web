
import { exec } from "child_process"

enum PortProtocols {
    tcp = "tcp",
    udp = "udp"
}

/**
 * Originally, this was called firewalld web ui
 * 
 * but, the whole reason why I decided to switch this to iptables, 
 * because I recently (25.02.26), got a really bad experience with firewalld
 * 
 * so I am switching back to iptables
 */

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
            exec(`firewall-cmd --permanent --add-rich-rule='${cmd}'`, (error, stdout, stderr) => {
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
    // removing rich rules
    // ===================================================
    public async removeRichRule(rule: string) {
        var result = await this.firewallcmd(`--remove-rich-rule='${rule}'`)
        var reload = await this.reload()
        
        return result == "success" && reload == true ? true : false
    }

    // ===================================================
    // methods
    // ===================================================
    public async typePort(port: string, protocol: PortProtocols = PortProtocols.tcp, type: string) {
        var result = await this.richrule(`rule family="ipv4" port port="${port}" protocol="${protocol}" ${type}`)
        var reload = await this.reload()

        return result == "success" && reload == true ? true : false
    }

    public async typeIp(ip: string, type: string) {
        var result = await this.richrule(`rule family="ipv4" source address="${ip}" ${type}`)
        var reload = await this.reload()

        return result == "success" && reload == true ? true : false
    }

    public async typePortForIp(port: string, ip: string, protocol: PortProtocols = PortProtocols.tcp, type: string) {
        var result = await this.richrule(`rule family="ipv4" source address="${ip}" port port="${port}" protocol="${protocol}" ${type}`)
        var reload = await this.reload()

        return result == "success" && reload == true ? true : false
    }
}