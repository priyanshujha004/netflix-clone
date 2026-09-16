# Use official Node runtime as a parent image (alpine is lightweight)
FROM node:20-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies (only production dependencies can be installed using --omit=dev if preferred)
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on
EXPOSE 5001

# Command to run the application (Uses the start script we added earlier)
CMD ["npm", "start"]