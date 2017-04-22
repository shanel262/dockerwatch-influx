# Dockerwatch-influx
A Node.js server that waits to receive container statistics from Dockerwatch-stats clients and then communicate with InfluxDB to store them. 

## How to run
1. Clone the repo using ```git clone https://github.com/shanel262/dockerwatch-influx```
2. If InfluxDB are not accessible through localhost then insert the IP address in the config.yml file
3. Run ```npm install``` in the root directory
4. Run ```npm start``` to start the service on port 4000

## Change InfluxDB database to connect to
The name of the database is located in a file called server.js. By default the database is called 'dockerwatch' but that can be changed by editing the name in the line:
```
database: 'dockerwatch'
```
