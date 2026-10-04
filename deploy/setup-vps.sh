#!/usr/bin/env bash
set -Eeuo pipefail

if [[ "${EUID}" -ne 0 ]]; then
  echo "Run this script as root: sudo bash deploy/setup-vps.sh" >&2
  exit 1
fi
if [[ ! -r /etc/os-release ]]; then
  echo "Cannot identify the operating system." >&2
  exit 1
fi
. /etc/os-release
if [[ "${ID:-}" != "ubuntu" ]]; then
  echo "This setup script supports Ubuntu only." >&2
  exit 1
fi

APP_DIR="/opt/morai"
DEPLOY_USER="morai-deploy"
REPOSITORY="https://github.com/dyknsp/Morai.git"

read -r -p "Domain name pointing to this server (for example shop.example.com): " DOMAIN
if [[ ! "$DOMAIN" =~ ^([a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$ ]]; then
  echo "Enter a valid public domain name." >&2
  exit 1
fi
read -r -p "Email for Let's Encrypt certificate notices: " CERTBOT_EMAIL
if [[ ! "$CERTBOT_EMAIL" =~ ^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$ ]]; then
  echo "Enter a valid email address." >&2
  exit 1
fi
read -r -p "GitHub Actions deploy public SSH key: " DEPLOY_PUBLIC_KEY
if [[ ! "$DEPLOY_PUBLIC_KEY" =~ ^(ssh-ed25519|ssh-rsa|ecdsa-sha2-nistp256|sk-ssh-ed25519@openssh.com)[[:space:]][A-Za-z0-9+/=]+([[:space:]].*)?$ ]]; then
  echo "Enter an OpenSSH public key. Do not provide the private key." >&2
  exit 1
fi
read -r -p "Admin login [admin]: " ADMIN_USERNAME
ADMIN_USERNAME="${ADMIN_USERNAME:-admin}"
if [[ ! "$ADMIN_USERNAME" =~ ^[a-zA-Z0-9_.-]{3,48}$ ]]; then
  echo "Admin login must be 3-48 letters, digits, dots, underscores, or hyphens." >&2
  exit 1
fi
read -r -s -p "Choose an admin password (20+ letters and digits): " ADMIN_PASSWORD
echo
read -r -s -p "Repeat the admin password: " ADMIN_PASSWORD_CONFIRM
echo
if [[ "$ADMIN_PASSWORD" != "$ADMIN_PASSWORD_CONFIRM" || ! "$ADMIN_PASSWORD" =~ ^[a-zA-Z0-9]{20,}$ ]]; then
  echo "The passwords must match and contain at least 20 letters and digits." >&2
  exit 1
fi

if [[ -e "$APP_DIR" ]]; then
  echo "$APP_DIR already exists; refusing to overwrite it." >&2
  exit 1
fi

export DEBIAN_FRONTEND=noninteractive
apt-get update
apt-get install -y ca-certificates curl git certbot openssl
install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
chmod a+r /etc/apt/keyrings/docker.asc
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu ${VERSION_CODENAME} stable" \
  > /etc/apt/sources.list.d/docker.list
apt-get update
apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
systemctl enable --now docker

if ! id "$DEPLOY_USER" >/dev/null 2>&1; then
  useradd --create-home --shell /bin/bash "$DEPLOY_USER"
fi
if ! getent group docker >/dev/null 2>&1; then
  groupadd docker
fi
usermod -aG docker "$DEPLOY_USER"
install -d -m 0700 -o "$DEPLOY_USER" -g "$DEPLOY_USER" "/home/$DEPLOY_USER/.ssh"
printf '%s\n' "$DEPLOY_PUBLIC_KEY" > "/home/$DEPLOY_USER/.ssh/authorized_keys"
chown "$DEPLOY_USER:$DEPLOY_USER" "/home/$DEPLOY_USER/.ssh/authorized_keys"
chmod 0600 "/home/$DEPLOY_USER/.ssh/authorized_keys"

certbot certonly --standalone --non-interactive --agree-tos --no-eff-email \
  --email "$CERTBOT_EMAIL" -d "$DOMAIN"
git clone --branch main --depth 1 "$REPOSITORY" "$APP_DIR"
chown -R "$DEPLOY_USER:$DEPLOY_USER" "$APP_DIR"

SESSION_SECRET="$(openssl rand -hex 32)"
umask 077
cat > "$APP_DIR/.env" <<EOF
MORAI_DOMAIN=$DOMAIN
NEXT_PUBLIC_SITE_URL=https://$DOMAIN
ADMIN_USERNAME=$ADMIN_USERNAME
ADMIN_PASSWORD=$ADMIN_PASSWORD
ADMIN_SESSION_SECRET=$SESSION_SECRET
ORDERS_FILE=/app/data/orders.json
INDEXNOW_KEY=
EOF
chmod 0600 "$APP_DIR/.env"
chown "$DEPLOY_USER:$DEPLOY_USER" "$APP_DIR/.env"

install -d -m 0755 /etc/letsencrypt/renewal-hooks/deploy
cat > /etc/letsencrypt/renewal-hooks/deploy/reload-morai-nginx <<EOF
#!/usr/bin/env bash
set -e
docker compose --project-directory "$APP_DIR" -f "$APP_DIR/deploy/docker-compose.yml" restart nginx
EOF
chmod 0755 /etc/letsencrypt/renewal-hooks/deploy/reload-morai-nginx
systemctl enable --now certbot.timer

runuser -u "$DEPLOY_USER" -- docker compose --project-directory "$APP_DIR" \
  -f "$APP_DIR/deploy/docker-compose.yml" up -d --build

echo
echo "MORAI AROMA is starting at https://$DOMAIN"
echo "Admin panel: https://$DOMAIN/admin"
echo "Admin login: $ADMIN_USERNAME"
echo "Add these GitHub Actions variables: VPS_HOST=$DOMAIN, VPS_USER=$DEPLOY_USER, VPS_APP_PATH=$APP_DIR, NEXT_PUBLIC_SITE_URL=https://$DOMAIN"
echo "Add VPS_SSH_KEY as the matching private key and VPS_KNOWN_HOSTS from ssh-keyscan -H $DOMAIN as repository secrets."
echo "Save the admin password you entered. It is stored only in $APP_DIR/.env on this server."
