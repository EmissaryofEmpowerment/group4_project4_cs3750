# Pull the node:alpine image from hub.docker.com so we can install react to docker image
FROM node:alpine

# Change working directory to what is supplied below
WORKDIR /usr/src/app

# Copy the files that start with "package" and ends in ".json" to the current working directory (results in both package.json and package-lock.json being copied)
COPY package*.json ./

# run the below command so it installs the required dependencies for the React server
RUN npm i

# Copy everything from where the Dockerfile is located (everything inside the "React server (client)" folder) to the container's current working directory ("/usr/src/app") https://forums.docker.com/t/what-does-copy-mean/74121/3
COPY . .

# Expose port 3000 on the docker container so it can listen on this port when it is running
EXPOSE 3000

# The reason why we supply the path to the ng executible is because of the issue described here https://stackoverflow.com/questions/67583633/error-cannot-find-module-usr-src-app-nodemon-while-using-docker-compose
CMD ["npm", "start"]