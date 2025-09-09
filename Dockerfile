FROM node:latest

# Set the working directory
WORKDIR /app


# Copy package.json and package-lock.json and install dependencies
COPY package.json /app/

RUN npm install

# Copy the rest of the application code
COPY . /app/

# Build the TypeScript code
CMD ["npm", "start"]