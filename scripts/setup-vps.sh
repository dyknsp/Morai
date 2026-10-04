#!/usr/bin/env bash
set -Eeuo pipefail

if [[ ${EUID} -ne 0 ]]; then
  echo "Run as root: sudo bash scripts/setup-vps.sh" >&2
  exit 1
fi

if [[ ! -r /etc/os-release ]]; then
  echo "Cannot determine the operating system." >&2
  exit 1
fi

. /etc/os-release
if [[ ${ID:-} != ubuntu ]]; then
  echo "This setup script supports Ubuntu LTS only." >&2
  exit 1
fi

if [[ ! -t 0 ]]; then
  echo "Run this script in an interactive terminal so it can collect the domain and account details." >&2
  exit 1
fi

read -rp "Public domain for the site (DNS A/AAAA must point here): " MORAI_DOMAIN
read -rp "Email address for Let's Encrypt renewal notices: " LE_EMAIL
read -rp "Deployment SSH user (default: ${SUDO_USER:-ubuntu}): " DEPLOY_USER
read -rp "Public Git repository URL (default: https://github.com/dyknsp/Morai.git): " MORAI_REPO_URL
read -rp "SSH port for the deployment user (default: 22): " SSH_PORT

DEPLOY_USER=${DEPLOY_USER:-${SUDO_USER:-ubuntu}}
MORAI_REPO_URL=${MORAI_REPO_URL:-https://github.com/dyknsp/Morai.git}
SSH_PORT=${SSH_PORT:-22}
APP_DIR=/opt/morai
INDEXNOW_KEY_VALUE=$(openssl rand -hex 16)

if [[ ! ${MORAI_DOMAIN} =~ ^[A-Za-z0-9.-]+$ ]]; then
  echo "The domain name contains unsupported characters." >&2
  exit 1
fi
if ! id "${DEPLOY_USER}" >/dev/null 2>&1; then
  echo "Deployment user '${DEPLOY_USER}' does not exist." >&2
  exit 1
fi

apt-get update
apt-get install -y ca-certificates curl gnupg git rsync certbot ufw openssl
install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
chmod a+r /etc/apt/keyrings/docker.asc
printf 'deb [arch=%s signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu %s stable\n' \
  "$(dpkg --print-architecture)" "${UBUNTU_CODENAME:-$VERSION_CODENAME}" \
  > /etc/apt/sources.list.d/docker.list
apt-get update
apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
systemctl enable --now docker
usermod -aG docker "${DEPLOY_USER}"

if [[ ! -d "${APP_DIR}/.git" ]]; then
  git clone --depth 1 "${MORAI_REPO_URL}" "${APP_DIR}"
fi
install -d -o "${DEPLOY_USER}" -g "${DEPLOY_USER}" "${APP_DIR}/deploy/certbot-webroot"
cat > "${APP_DIR}/.env" <<EOF
MORAI_DOMAIN=${MORAI_DOMAIN}
NEXT_PUBLIC_SITE_URL=https://${MORAI_DOMAIN}
INDEXNOW_KEY=${INDEXNOW_KEY_VALUE}
EOF
chmod 600 "${APP_DIR}/.env"
chown "${DEPLOY_USER}:${DEPLOY_USER}" "${APP_DIR}/.env"

certbot certonly --standalone --non-interactive --agree-tos \
  --email "${LE_EMAIL}" -d "${MORAI_DOMAIN}"

ufw allow "${SSH_PORT}/tcp"
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable

cat > /usr/local/sbin/morai-renew-certificates <<'EOF'
#!/usr/bin/env bash
set -Eeuo pipefail
certbot renew --quiet --deploy-hook 'docker compose --env-file /opt/morai/.env -f /opt/morai/deploy/docker-compose.yml exec -T nginx nginx -s reload'
EOF
chmod 750 /usr/local/sbin/morai-renew-certificates
cat > /etc/cron.d/morai-certbot <<'EOF'
17 3 * * * root /usr/local/sbin/morai-renew-certificates >> /var/log/morai-certbot-renew.log 2>&1
EOF
chmod 644 /etc/cron.d/morai-certbot

echo
echo "VPS base setup is complete."
echo "The deployment user was added to the docker group; reconnect SSH before deploying."
echo "Set GitHub repository variable DEPLOY_ENABLED=true and configure the secrets described in README.md."
echo "Save this IndexNow key as GitHub secret INDEXNOW_KEY:"
echo "${INDEXNOW_KEY_VALUE}"
