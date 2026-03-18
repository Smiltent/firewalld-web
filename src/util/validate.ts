
export function isIp(input: string) {
    const [ip, cidr] = input.split("/")

    const regex =
        /^(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)$/

    if (!regex.test(ip as string)) throw Error("invalid ip")

    if (cidr !== undefined) {
        const cidrNum = Number(cidr)
        if (isNaN(cidrNum) || cidrNum < 0 || cidrNum > 32) throw new Error("invalid ip cidr")
    }

    return true
}

export function isPort(input: string) {
    if (input.length === 0) throw new Error("invalid port")
    if (input.startsWith("-")) throw new Error("invalid port")

    if (input.includes("-")) {
        const [start, end] = input.split("-").map(Number)
        return (
            Number.isInteger(start) &&
            Number.isInteger(end) &&
            start! > 0 &&
            end! <= 65535 &&
            start! <= end!
        )
    }

    const port = Number(input)
    if (!Number.isInteger(port) || port < 0 || port >= 65535) throw new Error("invalid port range")

    return true
}