FROM node:20-alpine AS builder

WORKDIR /app

# Copy root monorepo package manifests
COPY package*.json ./
COPY apps/web/package*.json ./apps/web/

# Install all monorepo dependencies (hoisted to /app/node_modules)
RUN npm ci

# Copy frontend source code
COPY apps/web ./apps/web

WORKDIR /app/apps/web

# Build Next.js project
RUN npm run build

FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Copy hoisted node_modules and built web app assets
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/web ./apps/web

WORKDIR /app/apps/web

# Expose port 3000 for Next.js
EXPOSE 3000

# Start Next.js production server
CMD ["npm", "run", "start"]
