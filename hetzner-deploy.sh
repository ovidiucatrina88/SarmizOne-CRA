#!/bin/bash

# Generate production files for Hetzner server deployment
echo "Creating deployment files for Hetzner server..."

# Create the production.cjs file content
cat > production.cjs << 'PRODUCTION_EOF'
EOF

# Copy the actual production.cjs content
cat dist/production.cjs >> production.cjs

# Create client directory and index.html
mkdir -p client
cat > client/index.html << 'CLIENT_EOF'
EOF

# Copy the actual client content
cat dist/client/index.html >> client/index.html

echo "Files created:"
echo "- production.cjs ($(wc -c < production.cjs) bytes)"
echo "- client/index.html ($(wc -c < client/index.html) bytes)"
echo ""
echo "Copy these files to your Hetzner server:"
echo "1. production.cjs -> /root/risk-hetzner/dist/production.cjs"
echo "2. client/index.html -> /root/risk-hetzner/dist/client/index.html"
echo ""
echo "Then run on your server:"
echo "cd /root/risk-hetzner"
echo "NODE_ENV=production DATABASE_URL=your_db_url node dist/production.cjs"