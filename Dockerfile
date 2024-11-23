# Use an official Node.js runtime as a parent image
FROM node:20.18.0-alpine

# Set the working directory in the container
WORKDIR /usr/src/app

# Set the Dockerize version
ENV DOCKERIZE_VERSION v0.8.0

# Install dependencies, wget, and dockerize
RUN apk update --no-cache \
    && apk add --no-cache wget openssl \
    && wget -O - https://github.com/jwilder/dockerize/releases/download/$DOCKERIZE_VERSION/dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz | tar xzf - -C /usr/local/bin \
    && apk del wget

# Copy the package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire application code to the container
COPY . .

# Copy .env file to the container (so the app can use it)
COPY .env.production .env

# Build the TypeScript application
RUN npm run build

# Expose the port the app will run on
EXPOSE 5000

# Start the application in production mode
CMD [ "npm", "start" ]
