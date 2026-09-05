#!/usr/bin/env sh

set -eu

SCRIPT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
cd "${SCRIPT_DIR}/.."

if [ -z "${FLAME_API_URL:-}" ]; then
    echo "Falta la variable FLAME_API_URL en Netlify."
    echo "Ejemplo: https://flame-burger-api.example.com"
    exit 1
fi

API_URL="${FLAME_API_URL%/}"

rm -rf public
mkdir -p public

# Netlify publica solamente estos archivos. El backend, .env y node_modules
# nunca forman parte del sitio público.
cp -R frontend/. public/
cp -R admin public/admin

cat > public/js/config.js <<EOF
window.FLAME_API_URL = "${API_URL}";
EOF

cat > public/admin/js/config.js <<EOF
window.FLAME_API_URL = "${API_URL}";
EOF

# Compatibilidad para cualquier llamada relativa que todavía exista.
cat > public/_redirects <<EOF
/api/* ${API_URL}/api/:splat 200
/uploads/* ${API_URL}/uploads/:splat 200
EOF

echo "Frontend preparado para usar: ${API_URL}"