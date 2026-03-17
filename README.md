# iptables webui
> [!IMPORTANT]
> This should not be exposed to the Web, it is recommended to place this under a VPN service, like Tailscale, or used locally.  

## what is this project?
It's an easier way of managing the iptables rules, without having to mess around with the command line.  
submitted to Hackclub Flavortown!

## running
On each system, you must have iptables & bun installed. If you are just trying it out, you must change `NODE_ENV` in `.env`  
### linux
```bash
sudo env "PATH=$PATH" bun index.ts
```
### docker (compose)
```bash
sudo docker compose up -d
```