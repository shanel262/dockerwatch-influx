var net = require('net')
var influxdb = require('influx').InfluxDB

var HOST = '127.0.0.1'
var PORT = 8001
var containerId = ""

net.createServer(function(socket){

	var influx = new influxdb({
		host: 'localhost',
		port: 8086,
		username: 'root',
		password: 'root',
		database: 'test'
	})
	
	console.log('CONNECTED: ' + socket.remoteAddress + ' : ' + socket.remotePort)

	socket.on('data', function(data){
		var info = JSON.parse(data)
		containerId = info.id.substring(0, 3)
		console.log('RECEIVED DATA ID: ' + containerId + ':  CPU: ' + info.cpu.toFixed(2) + '%  MEM: ' + info.mem.toFixed(2) + '%')

		influx.writeMeasurement(containerId, [
			{
				fields: {cpu: info.cpu.toFixed(2), mem: info.mem.toFixed(2)}
			}
		])
	})

	socket.on('close', function(){
		console.log('CONNECTION CLOSED: ' + socket.remoteAddress + ' : ' + socket.remotePort)
	})
}).listen(PORT)

console.log('Server listening on ' + HOST + ' : ' + PORT)