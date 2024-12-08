# Use a Node.js base image for building
FROM node:16 AS build

# Define build arguments for environment variables
ARG VITE_REACT_APP_BACKEND_URL

# Set environment variables during the build process
ENV VITE_REACT_APP_BACKEND_URL=$VITE_REACT_APP_BACKEND_URL

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the React app
RUN npm run build

# Use a lightweight web server (Nginx) to serve the built frontend
FROM nginx:alpine

# Copy the Nginx config files into the container
ADD ./conf/ /etc/nginx/

# Clears the default static files
RUN rm -rf /usr/share/nginx/html/*

# Copy the React build output to Nginx's static folder
# Copy from the build folder in the build stage to Nginx's serving directory
COPY --from=build /usr/src/app/dist /usr/share/nginx/html

# Expose the port that Nginx will listen on
EXPOSE 80

# Start Nginx in the foreground (default command for Nginx)
CMD ["nginx", "-g", "daemon off;"]
