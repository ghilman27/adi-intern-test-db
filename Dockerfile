# Use the official Node.js 20 image.
FROM node:20-slim

# Create and change to the app directory.
WORKDIR /app

# Copy application dependency manifests to the container image.
COPY package*.json ./

# Install production dependencies.
RUN npm install --only=production

# Copy local code to the container image.
COPY . .

# Expose Port 8080 -> the default port on cloud run
EXPOSE 8080

# Run the web service on container startup.
CMD [ "node", "index.js" ]