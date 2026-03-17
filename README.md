# iptables webui
> [!IMPORTANT]
> This should not be exposed to the Web, it is recommended to place this under a VPN service, like Tailscale, or used locally.  

## what is this project?
It's an easier way of managing the iptables rules, without having to mess around with the command line.  
Submitted to Hackclub Flavortown!

## demo
### video
[![iptables web ui showcase](https://img.youtube.com/vi/z38n15EXIkc/0.jpg)](https://www.youtube.com/watch?v=z38n15EXIkc)
### site
The example site can be accessed at https://firewall-showcase.smilt.dev  
To access the panel itself, just write anything and click enter.

## running
On each system, you must have iptables & bun installed. If you are just trying it out, you must change `NODE_ENV` to `showcase` in `.env`  
### linux
```bash
sudo env "PATH=$PATH" bun index.ts
```
### docker (compose)
```bash
sudo docker compose up -d
```
