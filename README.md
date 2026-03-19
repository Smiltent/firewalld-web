# iptables webui
> [!IMPORTANT]
> This should not be exposed to the Web, it is recommended to place this under a VPN service, like Tailscale, or used locally.  

## what is this project?
It's an easier way of managing the iptables rules, without having to mess around with the command line.  
Submitted to Hackclub Flavortown!

## usage
### login
Start off by declaring the secret in `.env`, that will be your only way of logging in to the dashboard.  

When you get to the starting screen, there is no password field, instead, it listens to your keystrokes and sends a request back to the server to see if its correct.  

> [!IMPORTANT]
> The showcase has login disabled
### adding rules
You can go to the "add" section at the top to add a rule. It's quite bland, but you can accept/reject/drop ip's, port's, ip's going to port's and rich rules.

### deleting and viewing rules
You can go to the "rules" section at the top to view and delete rules.  
Hovering over one, you can see a x, which let's you delete it.

## demo
### video
[youtube video](https://www.youtube.com/watch?v=z38n15EXIkc)
### site
The example site can be accessed at https://firewall-showcase.smilt.dev  

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
