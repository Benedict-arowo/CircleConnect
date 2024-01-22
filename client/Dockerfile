# Use a node image with Alpine Linux 20
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /home/client

# Copy only the package.json and lock file to leverage Docker caching
COPY package.json .
COPY package-lock.json .

# Install dependencies
RUN npm ci

# Copy the rest of the application code
COPY . .

# Expose the default Vite development port
EXPOSE 5173

# Specify the default command to run your application
CMD ["npm", "run", "dev"]
