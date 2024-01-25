# group4_project4_cs3750
Grid word finder (boggle)
## Configuring Node/React Servers Using Docker
1. Clone the repository.
2. Install [Docker](https://www.docker.com/products/docker-desktop/) and [enable/install WSL2](https://learn.microsoft.com/en-us/windows/wsl/install#install-wsl-command) on your system.  Restart your computer post-installation
3. Ensure Docker Desktop is running.
4. Navigate to the root of the repository in a terminal and run `docker-compose up --build`.
5. Wait for installation completion. The process is complete when you see "Compiled successfully."
6. Verify servers running by access http://localhost:3001 for the front end and http://localhost:3000 for the back end.
7. To remove Docker containers: Run `docker-compose down`.

### Starting/Stopping NodeJS and Angular Servers:
#### Using Docker Desktop
- Go to the Containers tab. Find the container named "group4_project4_cs3750" and use the Play/Stop symbol.

#### Using Terminal

- Ensure Docker Desktop is running.
- Navigate to the root of the repository.
  - To start servers: Run `docker-compose up -d` or `docker-compose up`.
  - To stop servers: Run `docker-compose stop` or use "Ctrl + C".

### Alternate Installation and Startup Method (Local Hardware):
1. Clone the repository.
2. Install NodeJS version 18.13.0.
3. Open two terminal of your choice.
4. In each of them navigate to "Express server (server)" and "React server (client)".
5. In both terminals run the following commands 
   - `npm install` or `npm i` to install the required packages.
   - `npm start` to start the servers.