
function ipToNumb(ip: string): number {
    return ip.split('.').reduce((int, oct) => (int << 8) + parseInt(oct, 10), 0) >>> 0;
}

export default function isInIpRange(ip: string, range: string): boolean {
    const [ ipRange, prefix ] = range.split('/')

    if (!ipRange || !prefix) {
        throw new Error(`Invalid CIDR range: ${range}`)
    }

    const ipNumb = ipToNumb(ip)
    const rangeNumb = ipToNumb(ipRange)

    const mask = -1 << (32 - parseInt(prefix, 10))

    return (ipNumb & mask) === (rangeNumb & mask)
}