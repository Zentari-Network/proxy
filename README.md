# Requirements:

You must have **docker**, **docker compose**, **bun**, and **go** installed in order to use this! It is highly recommended to run this on a linux machine, such a debian 13 (The OS it was made on.)

# Disclaimers:

This is a proxy to just protect againist VPN detection, and Alting (using another account to bypass bans). It is possible in the for seeable future that others may help make this support crash protection, but that is not guaranteed.

# How to Use:

## 1. Clone repository

```sh
git clone https://github.com/Zentari-Network/proxy.git
```

## 2. Build images

```sh
docker compose build --no-cache
```

## 3. Edit docker-compose.yml

Edit this file with your information, such as changing the `VPN_TOKEN` under the API to your token provided **for free** by https://vpnapi.io. For actual production use, It is suggested to remove the `server` section under `services`, as that is just a testing server. If you choose to do so, you must change the `EXTERNAL_HOST`value to your server's IP and port in this format: `<IP>:<PORT>`.

## 4. Start the service.

```sh
docker compose up -d
```

---

# Tips

## How to view logs

```sh
docker compose logs -f
```

And to exit, just do CTRL+C

## How to stop the service

```sh
docker compose down --rmi local
```

## How to update images

Repeat step 2

## How to update code from repository

**WARNING**: You may want to back up your docker-compose.yml, and/or any changes that you have made, as they will be overidden!

```sh
git pull --force
```

---

# Contact Information

If you have any questions about this proxy, please reach out to me on discord: **espryra**
