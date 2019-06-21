var adb = require('adbkit');
var client = adb.createClient();
var Promise = require('bluebird');
var readline = require('readline');
 
client.listDevices()
	.then(function(devices) {
        console.log(devices)
		return Promise.map(devices, function(device) {
			console.log('Device %s ', device.id)
			client.shell(device.id, "dumpsys iphonesubinfo", function(err, output) {
                if (err) {
                    console.log(err);
                }
                var readStream = output;
                readStream
                
            })
        })

    })
//     .on('data',  function (data) { 
// 	    console.log('Data!', data.toString());  
// 		var lines = data.toString().split('n').length - 1;
//   		console.log(lines);

		
//     })
    
//   .on('error', function (err)  { console.error('Error', err); })
//   .on('end',   function ()     { console.log('All done!');    })

			
		
.catch(function(err) {
	console.log('No device detected!')
	console.error('Something went wrong:', err.stack)
});




// var adb = require('adbkit');
// var client = adb.createClient();
// var Promise = require('bluebird');
// var readline = require('readline');
 
// client.listDevices()
// 	.then(function(devices) {
// 		return Promise.map(devices, function(device) {
// 			console.log('Device %s ', device.id)
// 			client.shell(device.id, "dumpsys iphonesubinfo", function(err, output) {
// 			if (err) {
// 			    console.log(err);
// 			  }
// 				var readStream = output;

// readStream
//   .on('data',  function (data) { 
// 	console.log('Data!', data.toString());  
// 		var lines = data.toString().split('n').length - 1;
//   		console.log(lines);

		
// 	})
//   .on('error', function (err)  { console.error('Error', err); })
//   .on('end',   function ()     { console.log('All done!');    });

			
// 		})
// 	})
// .catch(function(err) {
// 	console.log('No device detected!')
// 	console.error('Something went wrong:', err.stack)
// })