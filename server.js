var net = require('net')
var influxdb = require('influx').InfluxDB
var yaml_config = require('node-yaml-config')
var config = yaml_config.load(__dirname + '/config.yml')

var HOST = '0.0.0.0'
var PORT = 8001
var containerId = ""

net.createServer(function(socket){

	var influx = new influxdb({
		host: config.host,
		port: 8086,
		username: 'root',
		password: 'root',
		database: 'test'
	})
	
	console.log('CONNECTED: ' + socket.remoteAddress + ' : ' + socket.remotePort)

	socket.on('data', function(data){
		var info = JSON.parse(data)
		containerId = info.id.substring(0, 3)
		if(info.tag === 'Stats'){
			console.log('Received container stats:', info)
			influx.writeMeasurement(containerId, [
				{
					fields: {
						cpu: info.cpu.toFixed(2),
						memPerc: info.memPerc.toFixed(2),
						memBytes: info.memBytes,
						rxBytes: info.rxBytes,
						txBytes: info.txBytes,
						rxPackets: info.rxPackets,
						txPackets: info.txPackets,
						rxDropped: info.rxDropped,
						txDropped: info.txDropped,
						rxError: info.rxError,
						txError: info.txError
					},
					tags: {type: 'stat'}
				}
			])
		}
		else if(info.tag === 'Info'){
			console.log('Received container info:', info)
			influx.writeMeasurement(containerId, [
				{
					fields: {
						name: info.name,
						created: info.created,
						image: info.image,
						restartCount: info.restartCount,
						ipAddress: info.ipAddress,
						port: info.port,
						subnetAddress: info.subnetAddress,
						macAddress: info.macAddress,
						memLimit: info.memLimit,
						state: info.state
					},
					tags: {type: 'info'}
				}
			])
		}
	})

	socket.on('close', function(){
		console.log('CONNECTION CLOSED: ' + socket.remoteAddress + ' : ' + socket.remotePort)
	})
}).listen(PORT)

console.log('Server listening on ' + HOST + ' : ' + PORT)
