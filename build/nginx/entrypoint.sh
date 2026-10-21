#!/bin/sh
# The entry point of the image that runs the application.
#
# It writes the configuration of the deployment next to the application, so the
# same image can be pointed at another API without a new build, and it hands
# the work over to the web server.
set -eu

API_BASE_URL="${API_BASE_URL:-https://jsonplaceholder.typicode.com}"

# The configuration of the server. The address of the API is the only value
# the deployment can change.
mkdir -p /tmp/conf.d
envsubst '${API_BASE_URL}' < /etc/nginx/templates/default.conf.template > /tmp/conf.d/default.conf

# The configuration of the application. It holds no secret: the address of a
# public API is not a secret.
cat > /usr/share/nginx/html/config.json <<EOF
{
  "apiBaseUrl": "${API_BASE_URL}"
}
EOF

exec nginx -g 'daemon off;'
