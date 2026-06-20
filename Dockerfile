# Use a lightweight Node image
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your app's source code
COPY . .

# Expose the port Vite runs on
EXPOSE 5173

# Start the Vite server (must use --host to expose it outside the container)
CMD ["npm", "run", "dev", "--", "--host"]
