FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies with legacy peer deps
RUN npm install --legacy-peer-deps

# Create and set permissions for uploads directory
RUN mkdir -p public/uploads && chmod 777 public/uploads

# Copy environment files first
COPY .env.local .env.local
COPY .env .env

# Copy rest of the application
COPY . .

# Ensure uploads directory has correct permissions after copy
RUN chmod 777 public/uploads

# Build the Next.js application
RUN npm run build

# Expose port 8000
EXPOSE 8000

# Start the application
CMD ["npm", "start", "--", "-p", "8000"]
