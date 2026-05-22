FROM node:20-alpine

WORKDIR /app

# Install deps
COPY package.json package-lock.json* ./
RUN npm ci --silent || npm install --silent

# Copy source
COPY . /app

ENV NODE_ENV=development
EXPOSE 3000

# Start in dev mode binding to 0.0.0.0 so container is reachable
CMD ["sh", "-c", "npm run dev -- -H 0.0.0.0"]
