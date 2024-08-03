# Use an official Node.js runtime as a parent image
FROM node:18.20.1

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Install a lightweight web server
RUN npm install -g serve

# Set the command to start the server
CMD ["serve", "-s", "dist"]

# Expose the port the app runs on
EXPOSE 5000