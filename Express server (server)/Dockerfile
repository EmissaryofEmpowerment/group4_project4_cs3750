# Pull the node version 18.13.0 image from hub.docker.com so we can install node to docker image
FROM node:18.13.0

# Change working directory to what is supplied below
WORKDIR /usr/src/app

# Copy the files that start with "package" and ends in ".json" to the current working directory (results in both package.json and package-lock.json being copied)
COPY package*.json ./

# run the below command so it installs the required dependencies for the Node server
RUN npm i

# Copy everything from where the Dockerfile is located (everything inside the "Express server (server)" folder) to the container's current working directory ("/usr/src/app") https://forums.docker.com/t/what-does-copy-mean/74121/3
COPY . .

# Expose port 3001 on the docker container so it can listen on this port when it is running
EXPOSE 3001

# For devlopment, have it as "./node_modules/.bin/nodemon" so nodemon runs and refreshes the server.  Otherwise, have it "node" to simply have it run but not restart if changes were made.
# The reason why we supply the path to the nodemon executible is because of the issue described here https://stackoverflow.com/questions/67583633/error-cannot-find-module-usr-src-app-nodemon-while-using-docker-compose
CMD [ "./node_modules/.bin/nodemon", "server.js" ]