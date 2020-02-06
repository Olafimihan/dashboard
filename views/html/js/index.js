/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

// var socket = io.connect('http://127.0.0.1:4000');
var socket = io.connect('http://75.127.75.161:4000');

var app = {
    // Application Constructor
    initialize: function() {
      document.addEventListener('deviceready', function() {
        /**PICK the device coordinate */

        // navigator.geolocation.getCurrentPosition(onSuccess, onError, { enableHighAccuracy: true });
        // var watchID = navigator.geolocation.watchPosition(onwatchSuccess, onwatchError, { timeout: 30000 });
     
        /**Check network presence and take a decision */
        document.addEventListener("offline", offlineMode, false);
        document.addEventListener("online", OnlineMode, false);
        document.addEventListener("online", pushlocaldatatocloudserver, false);

        // this call will be used to keep tracking auditors to each question coordinate
        var watchID = navigator.geolocation.watchPosition(watchSuccess, watchError, {enableHighAccuracy: true}); 
        // navigator.geolocation.clearWatch(watchID);
        
        /** CHECK IF THE DEVICE iS ROOTED  : true/false */
        //cordova.plugins.diagnostic.isDeviceRooted(successCallback, errorCallback);
        // cordova.plugins.diagnostic.isLocationEnabled(successCallback, errorCallback);

      //   cordova.plugins.diagnostic.getLocationMode(function(locationMode){
      //     switch(locationMode){
      //         case cordova.plugins.diagnostic.locationMode.HIGH_ACCURACY:
      //             console.log("High accuracy");
      //             break;
      //         case cordova.plugins.diagnostic.locationMode.BATTERY_SAVING:
      //             console.log("Battery saving");
      //             break;
      //         case cordova.plugins.diagnostic.locationMode.DEVICE_ONLY:
      //             console.log("Device only");
      //             break;
      //         case cordova.plugins.diagnostic.locationMode.LOCATION_OFF:
      //             console.log("Location off");
      //             break;
      //     }
      // },function(error){
      //     console.error("The following error occurred: "+error);
      // });

      
      
        
        // document.addEventListener()
     
          
     }); /** End of deviceReady event */
    
        
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        this.receivedEvent('deviceready');
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        alert('Received Event: ' + id);


    }
};

// setInterval(function() {
//   // Do something every 5 seconds
//   navigator.geolocation.getCurrentPosition(watchSuccess, watchError, { enableHighAccuracy: true });
        
// }, 60000); // 60 secs

var watchSuccess = (position) => {
  var GPS_loc = position.coords.latitude +", "+ position.coords.longitude;
  // console.log(GPS_loc);

  localStorage.setItem("geolocation", GPS_loc);
  var device = localStorage.getItem("IMEI");
  $("#succ").html('Wayching!!!You are at: '+ GPS_loc);
  // console.log(device)
  
  // report the coordinate to the cloud server every 120 sec

  setInterval(()=>{
    // 
    // $.ajax({
    //   url: "http://75.127.75.161:4000/reportcoordinate",
    //   cache: false,
    //   type: "GET",
    //   data: "gps="+GPS_loc+"&device="+device,
    //   dataType: "JSON",
    //   success: function(data){
    //     // alert(data.ans);
    //     // console.log(data.ans);
    //     // console.log(data);
    //   },
    //   error: function(error){
        
    //     // alert(error.statusText)
    //     // alert(Object.keys(error));
    //   }
    // });  
  }, 120000);

  
}

function watchError(error) {
  alert('code: '    + error.code    + '\n' +
        'message: ' + error.message + '\n');
}

var pushlocaldatatocloudserver = () => {
  var surveydb = window.sqlitePlugin.openDatabase({name: "surveydb.db", location: 'default'});

  surveydb.transaction((tx)=>{
    tx.executeSql("select * from question_response", [], function(tr, result) {
      console.log(result);
      // alert(result);

    }, function(err){

    });
    
    tx.executeSql("select * from gps_status_grabber", [], function(tr, results) {
      console.log(results);
      // alert(results);

    }, function(err) {

    });

  }, function(err){
    // alert(err);
  }, function(){
    // alert('done...');
  })

}

var onwatchSuccess = (position) => {
  alert('Latitude: '          + position.coords.latitude          + '\n' +
              'Longitude: '         + position.coords.longitude         + '\n' +
              'Altitude: '          + position.coords.altitude          + '\n' +
              'Accuracy: '          + position.coords.accuracy          + '\n' +
              'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
              'Heading: '           + position.coords.heading           + '\n' +
              'Speed: '             + position.coords.speed             + '\n' +
              'Timestamp: '         + position.timestamp                + '\n');
}

var onwatchError = (error) => {
  alert('code: '    + error.code    + '\n' +
  'message: ' + error.message + '\n');
}

var getCurrentTime = () => {
  var today = new Date();
  var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  ret
}


var getGeolocation = () => {
  navigator.geolocation.getCurrentPosition(onSuccess, onError, { enableHighAccuracy: true });


}  

var onSuccess = (position) => {
  // alert('Dele')
  var gps="empty";
  
  var lat = position.coords.latitude;
  var lon = position.coords.longitude;
  var accuracy = position.coords.accuracy;
  var altitude = position.coords.altitude;

  var timestamp = position.timestamp;

  var locationObj = {
    latitude: lat,
    longitude: lon,
    accuracy: accuracy,
    altitude: altitude,
    timestamp: timestamp
  };


  gps = lat+", "+lon;

  // alert('GPS', lat+', '+lon, 'success');
  localStorage.setItem('geolocation', gps);
  // alert("Tracked => "+gps)
             
             
}

var onError = (err) => {
  localStorage.setItem('geolocationErr', err);
  // alert(err);
}


// Populate the database
//
function populateDB(tx) {
  tx.executeSql('CREATE TABLE IF NOT EXISTS DEMO (id INTEGER PRIMARY KEY AUTOINCREMENT, name,number)');
}

// Query the database
//
function queryDB(tx) {
  tx.executeSql('SELECT * FROM DEMO', [], querySuccess, errorCB);
}

function searchQueryDB(tx) {
  tx.executeSql("SELECT * FROM DEMO where name like ('%"+ document.getElementById("txtName").value + "%')",
            [], querySuccess, errorCB);
}
// Query the success callback
//
function querySuccess(tx, results) {
    var tblText='<table id="t01"><tr><th>ID</th> <th>Name</th> <th>Number</th></tr>';
    var len = results.rows.length;

    for (var i = 0; i < len; i++) {
        var tmpArgs=results.rows.item(i).id + ",'" + results.rows.item(i).name
                + "','" + results.rows.item(i).number+"'";

        tblText +='<tr onclick="goPopup('+ tmpArgs + ');"><td>' + results.rows.item(i).id +'</td><td>'
                + results.rows.item(i).name +'</td><td>' + results.rows.item(i).number +'</td></tr>';
    }

    tblText +="</table>";
    document.getElementById("tblDiv").innerHTML = tblText;
}

//Delete query
function deleteRow(tx) {
  tx.executeSql('DELETE FROM DEMO WHERE id = ' + currentRow, [], queryDB, errorCB);
}

// Transaction error callback
//
function errorCB(err) {
  alert("Error processing SQL: "+err.code);
}

/***WHEN DEVICE IS OFFLINE 
 * GET REASON FOR BEING OFFLINE AND REPORT
*/
var offlineMode = () => {
  navigator.geolocation.getCurrentPosition(onSuccess, onError, { enableHighAccuracy: true });
  var IMEI = localStorage.getItem('IMEI');

  $('#logins').click(function() { /**LOGIN-IN when the device is in OFFLINE MODE */
    var user = $('#user').val();
    var pass = $('#pass').val();

    var rows=0;
    var localuser = localStorage.getItem("username");
    var localpass = localStorage.getItem("passkey");
    
    if(pass==localpass) {
      $('.reg').addClass('hidden');
      $('.singin').addClass('hidden');
      $('.questionaire').removeClass('hidden');

      // alert(localStorage.getItem("Questionaire"));
      // console.log(localStorage.getItem("Questionaire"));

      var resObject = {resp: 'success', questions: localStorage.getItem("Questionaire"), options: localStorage.getItem("Options"), projectid: localStorage.getItem("project_id")}
      $('.alert-danger').addClass('hidden');
      
      // localStorage.setItem('_surveytoken', resObject.resp);
      // questionaireLayout(resObject); /**for KNOWN devices */

      // getData();
      questionaireLocalLayout(); /**for KNOWN devices */

    } else {
      $('.alert-danger').removeClass('hidden');
      $('#dang').html('Wrong Login details sent to server!!!');
    }

    // var _tokenizer = localStorage.getItem('_surveytoken'); 
     
    // alert(Object.keys(surveydb));
     
  }); /**End of Login */
  // resObject = localStorage.getItem("Questionaire");
  // var resObject = localStorage.getItem("Questionaire");

  var confirmLoginCredentials = ()=> {
    
  }

  function getData() {
    var surveydb = window.sqlitePlugin.openDatabase({name: "surveydb.db", location: 'default'});

    surveydb.transaction(function (tx) {
        var query = "SELECT * FROM webusers";
        tx.executeSql(query, [], function (tx, resultSet) {
          // console.log();
          console.log('counters: '+resultSet.rows.length);

          for(x = 0; x < resultSet.rows.length; x++) {
              console.log("refnos: " + resultSet.rows.item(x).passkey +
                      ", Question: " + resultSet.rows.item(x).passkey );

                  
          }
          // some business logic code here
            
        },
        function (tx, error) {
            console.log('SELECT error: ' + error.message);
        });
    }, function (error) {
        console.log('transaction error: ' + error.message);
        surveydb.close();
    }, function () {
        console.log('transaction ok');
        surveydb.close
    });
  }



}; /**END of OFFLINE MODE CODE */


/***WHEN DEVICE IS OFFLINE 
 * GET REASON FOR BEING OFFLINE AND REPORT
*/

var tryToUploadFile = () => {
  alert(Object.keys(survbeydb));

}


var OnlineMode = () => {
  // dont use this blocking method when implementing.
  // tryToUploadFile();


  localStorage.setItem('IMEI', device.serial);
  
  localStorage.setItem('maker', device.manufacturer);
  // var imei  = device.serial;
  
  /** REGISTER */
  
  /** */

//  socket.on('connect', function() {

//    socket.on('errmsg', (error) => {
//      swal('Admin Says', error.error, 'error');
//    });

//    socket.on('text', function(text) {
//       //  swal('AUTHENTICATED', text, 'success');
//        $('.alert-success').removeClass('hidden');
//        $('#succ').html(text);
//    });

//  }); /**Socket ends here */


}; /**End Online Mode code */


/** This method can be called anytime you need to write 
 * 
 *  the project Questionaire to the local device with SQLIte DB*/

var writeQuestionaireToLocalTable = (resObject) => {  
  var q_Array = resObject.questions;
  var opt_Array   = resObject.options;

  var surveyDB = window.sqlitePlugin.openDatabase({name: "surveydb.db", location: 'default'});
    
  surveyDB.transaction(function(tx) {
    q_Array.forEach((rec, idx)=>{ /**Array start */
      var q_refnos = 0; var question = "";
      var q_required="", q_serialnumber=0;
                  
      q_refnos = questionsArray[idx].refnos;
      question = questionsArray[idx].question; 
      q_required = questionsArray[idx].required;
      q_serialnumber = questionsArray[idx].question_no;

      tx.executeSql('INSERT INTO questions_tbl(refnos, project_id, question_no, question, required) VALUES (?, ?, ?, ?, ?)', [q_refnos, 0, q_serialnumber, question, q_required]
        , function(tr, resultSet){
          alert('resultSet.insertId: ' + resultSet.insertId);
          alert('resultSet.rowsAffected: ' + resultSet.rowsAffected);

        }, function(err){
          alert('Error: '+ err.message);
      });

    }) /**Array ends here */

  }, function(error) {// Transaction Callback
    alert('Transaction ERROR: ' + error.message);
    surveyDB.close(function() {
      console.log('database is closed with Error: '+error.message);
    });
  }, function() {
    alert('Populated database OK');
    surveyDB.close(function() {
      console.log('database is closed ok');
    });
  });
 

  return 0; 

};


var insertLocalDB = (respObject) => {
  console.log(respObject);
  var surveyDB = window.sqlitePlugin.openDatabase({name: "surveydb.db", location: 'default'});

  // var sql = "question_response (refnos bigint(20), project_id bigint(20), question_no tinyint(4), question varchar(250), required varchar(3), usermail varchar(50), status varchar(3) )";

  tx.executeSql('INSERT INTO question_response(refnos, project_id, question_no, ) VALUES (?, ?, ?)', [1, user, pass]
    , function(tx, resultSet) {
      alert('resultSet.insertId: ' + resultSet.insertId);
      alert('resultSet.rowsAffected: ' + resultSet.rowsAffected);

    }, function(error) {
      alert('INSERT error: ' + error.message);
  }); 
}


function checkConnection() {
  var networkState = navigator.connection.type;

  var states = {};
  states[Connection.UNKNOWN]  = 'Unknown connection';
  states[Connection.ETHERNET] = 'Ethernet connection';
  states[Connection.WIFI]     = 'WiFi connection';
  states[Connection.CELL_2G]  = 'Cell 2G connection';
  states[Connection.CELL_3G]  = 'Cell 3G connection';
  states[Connection.CELL_4G]  = 'Cell 4G connection';
  states[Connection.CELL]     = 'Cell generic connection';
  states[Connection.NONE]     = 'No network connection';

  // alert('Connection type: ' + states[networkState]);

  return states[networkState];
}


var videoconferencing = () => {
  var cameraOptions = { 
    quality: 50, 
    destinationType: Camera.DestinationType.DATA_URL, 
    sourceType : Camera.PictureSourceType.CAMERA,
    allowEdit : true,
    // encodingType: Camera.EncodingType.JPEG,
    targetWidth: 100,
    targetHeight: 100,
    // popoverOptions: CameraPopoverOptions,
    saveToPhotoAlbum: false,
    correctOrientation: true,

    /** * audio/video camera options 
     * Camera.MediaType = {
          PICTURE: 0,    // allow selection of still pictures only. DEFAULT. Will return format specified via DestinationType
          VIDEO: 1,      // allow selection of video only, WILL ALWAYS RETURN FILE_URI
          ALLMEDIA : 2   // allow selection from all media types
      };
    */

    mediaType: Camera.MediaType.VIDEO

  };

  navigator.camera.getPicture(onvideoCameraSuccess, onvideoCameraFail, cameraOptions);

};


var getCamera = () => {
  var cameraOptions = { 
    quality: 75, 
    destinationType: Camera.DestinationType.DATA_URL, 
    sourceType : Camera.PictureSourceType.CAMERA,
    allowEdit : true,
    encodingType: Camera.EncodingType.JPEG,
    targetWidth: 350,
    targetHeight: 350,
    popoverOptions: CameraPopoverOptions,
    saveToPhotoAlbum: false //,
    // correctOrientation: true

    /** * audio/video camera options 
     * Camera.MediaType = {
          PICTURE: 0,    // allow selection of still pictures only. DEFAULT. Will return format specified via DestinationType
          VIDEO: 1,      // allow selection of video only, WILL ALWAYS RETURN FILE_URI
          ALLMEDIA : 2   // allow selection from all media types
      };
    */

    // mediaType: Camera.MediaType.VIDEO

  };

  navigator.camera.getPicture(onCameraSuccess, onCameraFail, cameraOptions);
}

function onCameraSuccess(result) {
  
  // console.log(result);
  // console.log(typeof result);

  // convert JSON string to JSON Object
  var thisResult = JSON.parse(result);
  var imageURI = thisResult.filename; /** The image file itself */

  console.log(imageURI)
  console.log(typeof imageURI);

  // convert json_metadata JSON string to JSON Object 
  var metadata = JSON.parse(thisResult.json_metadata);
  var image = document.getElementById('myImage');
  image.src = "data:image/jpeg;base64," + imageURI;

  console.log(imageURI);

  if (thisResult.json_metadata != "{}") {
    if (device.platform == 'iOS') {
      // notice the difference in the properties below and the format of the result when you run the app.
      // iOS and Android return the exif and gps differently and I am not converting or accounting for the Lat/Lon reference.
      // This is simply the raw data being returned.

      //  navigator.notification.alert('Lat: '+metadata.GPS.Latitude+' Lon: '+metadata.GPS.Longitude);
    } else {
      // navigator.notification.alert('Lat: '+metadata.gpsLatitude+' Lon: '+metadata.gpsLongitude);
    }
  }
  // navigator.camera.cleanup(onCleanSuccess, onCleanFail);

}

function onCameraFail(message) {
   alert('Failed because: ' + message);
}
  
function onvideoCameraSuccess(result) {
  // convert JSON string to JSON Object
  var thisResult = JSON.parse(result);

  // convert json_metadata JSON string to JSON Object 
  var metadata = JSON.parse(thisResult.json_metadata);

   var image = document.getElementById('myImage');
   var imageURI = thisResult.filename; /** The image file itself */
   document.getElementById('imgname').innerHTML = imageURI;

   image.src = imageURI;

   if (thisResult.json_metadata != "{}") {
       if (device.platform == 'iOS') {

         // notice the difference in the properties below and the format of the result when you run the app.
         // iOS and Android return the exif and gps differently and I am not converting or accounting for the Lat/Lon reference.
         // This is simply the raw data being returned.

         navigator.notification.alert('Lat: '+metadata.GPS.Latitude+' Lon: '+metadata.GPS.Longitude);
       } else {
          navigator.notification.alert('Lat: '+metadata.gpsLatitude+' Lon: '+metadata.gpsLongitude);
       }

   }
}

function onvideoCameraFail(message) {
   alert('Failed because: ' + message);
}


var getAudio = () => {

  // limit capture operation to 3 media files, no longer than 10 seconds each
  var options = { limit: 1, duration: 59 };

  navigator.device.capture.captureAudio(audiocaptureSuccess, audiocaptureError, options);

}

// capture callback
function audiocaptureSuccess(mediaFiles) {
  var i, path, len;
  console.log(mediaFiles);
  console.log(typeof mediaFiles);

  for (i = 0, len = mediaFiles.length; i < len; i += 1) {
      path = mediaFiles[i].fullPath;
      // do something interesting with the file
      console.log(mediaFiles[i].getFormatData )

  }
  var player = document.getElementById("myAudio");
  player.src = path;
  player.play();

  console.log(path);

};

 // capture error callback
 var audiocaptureError = function(error) {
  navigator.notification.alert('Error code: ' + error.code, null, 'Capture Error');
};


function onCleanSuccess() {
    console.log("Camera cleanup success.")
}

function onCleanFail(message) {
    alert('Failed because: ' + message);
}