# backend/Dockerfile

# Use the official Node.js image
FROM node:hydrogen-alpine3.20

# Create and change to the app directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on
EXPOSE 3001

# Start the app
CMD ["npm", "run", "dev"]
