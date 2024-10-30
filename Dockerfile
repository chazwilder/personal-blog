FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies with legacy peer deps
RUN npm install --legacy-peer-deps

# Copy environment files first
COPY .env.local .env.local
COPY .env .env

# Copy rest of the application
COPY . .

# Build the Next.js application
RUN npm run build

# Expose port 8000
EXPOSE 8000

# Start the application
CMD ["npm", "start", "--", "-p", "8000"]
