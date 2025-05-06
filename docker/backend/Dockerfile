FROM node:20-alpine

WORKDIR /app

# Install dependencies for bcrypt
RUN apk add --no-cache make gcc g++ python3

# Copy package files
COPY server/package*.json ./

# Install dependencies
RUN npm install

# Copy application code
COPY server/ ./

EXPOSE 5000

CMD ["npm", "start"]