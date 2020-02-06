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

// var socket = io.connect('http://75.127.75.161:8089');
var socket = null;

var app = {
    // Application Constructor
    initialize: function() {
      document.addEventListener('deviceready', function() {
        /**PICK the device coordinate */

        navigator.geolocation.getCurrentPosition(onSuccess, onError, { enableHighAccuracy: true });
        // var watchID = navigator.geolocation.watchPosition(onwatchSuccess, onwatchError, { timeout: 30000 });
     
        /**Check network presence and take a decision */
        document.addEventListener("offline", offlineMode, false);
        document.addEventListener("online", OnlineMode, false);
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

function filter(arr, criteria) {
    return arr.filter(function(obj) {
        return Object.keys(criteria).every(function(c) {
        return obj[c] == criteria[c];
        });
    });
};

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
    var localuser = 'fad@gmail.com'; //localStorage.getItem("user");
    var localpass = 123; //localStorage.getItem("pass");
    
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
  socket = io.connect('http://75.127.75.161:8000');   

  // dont use this blocking method when implementing.
  // tryToUploadFile();

 localStorage.setItem('IMEI', device.serial);
    
 socket.on('connect', function() {

   socket.on('errmsg', (error) => {
     swal('Admin Says', error.error, 'error');
   });

   socket.on('text', function(text) {
      //  swal('AUTHENTICATED', text, 'success');
       $('.alert-success').removeClass('hidden');
       $('#succ').html(text);
   });

   $('#logins').click(function() {
     var user = $('#user').val();
     var pass = $('#pass').val();

     var _tokenizer = localStorage.getItem('_surveytoken'); 
       
     if(!_tokenizer) { //unknown devices
       $('.reg').removeClass('hidden');
       $('.singin').addClass('hidden');
       $('.questionaire').addClass('hidden'); 
       // return;
     }else if(_tokenizer) { //This will execute if there is network and device is known

       // localStorage.setItem('IMEI', device.serial);
       var device = localStorage.getItem('IMEI');

       var inObj = {user: user, pass: pass,imei: device};


       console.log(inObj);

       socket.emit('k_login', inObj);
        console.log(inObj);
      
      socket.on('k_login', (resObject) => {
        if(resObject.resp !== 'success') {
          alert('Bad Parameters', resObject.resp, 'error');
          $('.reg').addClass('hidden');
          $('.singin').removeClass('hidden');
          $('.questionaire').addClass('hidden');

          return; 
        } else {
          $('.reg').addClass('hidden');
          $('.singin').addClass('hidden');
          $('.questionaire').removeClass('hidden');

          localStorage.setItem('_surveytoken', resObject.resp);
          questionaireLayout(resObject); /**for KNOWN devices */

        }
        
      });

     }
     
   }); /**End of Login */

   //register
   
   $('#register').click(function(){
     var username = $('#username').val();
     var email = $('#email').val();
     var phone = $('#phone').val();

     // var devicetype = device.

     var model = device.manufacturer;
     var imei  = device.serial;
     var gps   = localStorage.getItem('geolocation');

     // var GPSArray = gps.split(',');
     var regObj = {
         user: username,
         email: email,
         phone: phone,
         model: model,
         imei: imei,
         u_login: $('#user').val(),
         pass: $('#pass').val(),
         gps: gps
     };
     
     // alert(regObj)

     /**UNKNOWN Device login */

     socket.emit('u_login', regObj);

     socket.on('u_login', (resObject) => { //{resp: 'success', questions: questionsRS, options: optionRS}

       if(resObject.resp !== 'success') {
         swal('Bad Params', resObject.resp, 'error');
         $('.reg').addClass('hidden');
         $('.singin').removeClass('hidden');
         $('.questionaire').addClass('hidden');


         return; 
       } else {
         $('.reg').addClass('hidden');
         $('.singin').addClass('hidden');
         $('.questionaire').removeClass('hidden');

         /** CREATE A DATABASE on the device FIRST TIMER */

         var surveyDB = window.sqlitePlugin.openDatabase({name: "surveydb.db", location: 'default'});

          surveyDB.transaction(function(tx) {
            tx.executeSql('DROP TABLE IF EXISTS questions_tbl');
            tx.executeSql('DROP TABLE IF EXISTS webusers');
            tx.executeSql('DROP TABLE IF EXISTS question_response');
            tx.executeSql('DROP TABLE IF EXISTS options_tbl');
            tx.executeSql('DROP TABLE IF EXISTS gps_statusGrabber');

            tx.executeSql("create table if not exists webusers (refnos bigint(20), usermail varchar(65), fname varchar(25), lname varchar(25), passkey varchar(15) )  ", []
              , function(tx, res){
                  // alert('Table webusers created successfully...')
              }
              , function(err){
                //  swal('SHELL ERROR', err.message, 'error' );
                console.log(err.message);
            });

            tx.executeSql('INSERT INTO webusers(refnos, usermail, passkey) VALUES (?, ?, ?)', [1, user, pass]
              , function(tx, resultSet) {
                //  alert('resultSet.insertId: ' + resultSet.insertId);
                //  alert('resultSet.rowsAffected: ' + resultSet.rowsAffected);
                console.log(user);
                console.log(pass);

              }, function(error) {
                //  alert('INSERT error: ' + error.message);
            }); 
 
            tx.executeSql("select count(refnos) as cnt from webusers;", [], function(tx, res) {
              console.log("res.rows.length: " + res.rows.length + " -- should be 1");
              console.log("res.rows.item(0).cnt: " + res.rows.item(0).usermail + " -- should be 1");

              // alert("res.rows.length from WEBUSERS: " + res.rows.length + " -- should be 1");
              // alert("res.rows.item(0).cnt: " + res.rows.item(0).cnt + " -- should be 1");
              
            });

            tx.executeSql("CREATE TABLE IF NOT EXISTS questions_tbl (refnos bigint(20), project_id bigint(20), question_no tinyint(4), question varchar(250), required varchar(3), usermail varchar(50), status varchar(3) )", []
              ,function(tx, res) {
                // alert('Table questions_tbl created successfully...');
                console.log('got stringlength: ');
              },function(err) {
                // alert('questions_tbl table error:'+err.message);
                
            });

            tx.executeSql("CREATE TABLE IF NOT EXISTS question_response (refnos bigint(20), question_refnos tinyint(4), response_text varchar(50), usermail varchar(65), imei varchar(25), location varchar(65),  project_id bigint(20), serviceid bigint(20), q_response_time time, dated timestamp, view_state varchar(10) DEFAULT 'admin', checker tinyint(1) NOT NULL DEFAULT '0' )", []
              ,function(tx, res) {
                //  alert('Table question_response created successfully...');
                console.log('got stringlength: ');
              },function(err) {
                // alert('response table error:'+err.message);
            });

            tx.executeSql("create table if not exists options_tbl(refnos bigint(20), project_id bigint(20), question_id bigint(20), response_text varchar(150), coltype varchar(50), optionURL varchar(250), gotoquestionid bigint(20), fromquestionid bigint(20))", []
              , function(tx, res){
                //  alert('Table options_tbl created successfully...');
                console.log('got stringlength: ');
              }, function(err){
                //  alert('options_tbl table error:'+err.message);
            });

            tx.executeSql("create table if not exists gps_statusGrabber(refnos bigint(20), statusdescription varchar(45), imei varchar(25), status varchar(3), dated varchar(45), gps_status_grabbercol varchar(45))", []
              , function(tx, res) {
                // alert('Table gps_statusGrabber created successfully...');
                console.log('got stringlength: ');
              }, function(err) {
                // alert('question_response table error:'+err.message);
            }); 

            console.log(resObject.questions);
            var q_Array = resObject.questions;
            var opt_Array   = resObject.options;
            var question, q_refnos, q_required, q_serialnumber;

            var o_resptext, o_refnos, o_questionid, o_coltype, o_goto, o_from, o_opturl;
            console.log(q_Array);
            
            opt_Array.forEach((row, indx) => {
              console.log(indx);
              o_resptext = opt_Array[indx].response_text; 
              o_refnos = opt_Array[indx].refnos;
              o_questionid = opt_Array[indx].question_id; 
              o_coltype = opt_Array[indx].coltype;
              o_opturl = opt_Array[indx].optionURL;

              o_goto = opt_Array[indx].gotoquestionid;
              o_from = opt_Array[indx].fromquestionid;
 
              tx.executeSql('INSERT INTO options_tbl(refnos, project_id, question_id, response_text, coltype, optionURL, gotoquestionid, fromquestionid) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [o_refnos, 0, o_questionid, o_resptext, o_coltype, o_opturl, o_goto, o_from]
                , function(tr, res) {
                  // alert('resultSet.insertId for options_TBL: ' + res.rows.length);
                  console.log('resultSet.rowsAffected: ' + res.rowsAffected);
          
                }, function(err) { 
                    alert('Error: '+ err.message);
              });
            }) /** End of Options array */
             
            console.log(opt_Array);

            

            q_Array.forEach((rec, idx) => { /**Question Array Dumps for first TIMERs */
              question = q_Array[idx].question; 
              q_refnos = q_Array[idx].refnos;
              question = q_Array[idx].question; 
              q_required = q_Array[idx].required;
              q_serialnumber = q_Array[idx].question_no;

              // alert(question);

              tx.executeSql('INSERT INTO questions_tbl(refnos, project_id, question_no, question, required) VALUES (?, ?, ?, ?, ?)', [q_refnos, 0, q_serialnumber, question, q_required]
                , function(tr, res){
                  // alert('resultSet.insertId: ' + res.rows.length);
                  // alert('resultSet.rowsAffected: ' + res.rowsAffected);
          
                }, function(err){
                    alert('Error: '+ err.message);
              });

            }); /**End of Question Array dumps */
             
          }, function(error) { /** Transaction callbacks here */
            // OK to close here:
            console.log('transaction errorsss: ' + error.message);
            alert('transaction error: ' + error.message);
            surveyDB.close(() => {
              console.log('Database is error closed bad.');
            });
          }, function() {
            // OK to close here:
            alert('transaction ok');
             
            surveyDB.close(function() {
              console.log('database is closed ok');
            });

          });

          localStorage.setItem('_surveytoken', resObject.resp);
          
          questionaireLayout(resObject);
         
       } /**end else */
     }); /**end on socket */
     
   }); /**end register */
   
 }); /**Socket ends here */


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

var saver = () => {
  /**THE  SAVE  CODE STARTS HERE
      */ 
      //  $('#save').attr('disabled', true);
       
      //  $('#save').on('click', () => {
        let timerDivs = document.getElementsByClassName("responsetimer");

        console.log('T H E   C O N T E N T S   I N   T H E  T I M E R ');

        // console.log(timerDivs);
        // console.log("Length: "+timerDivs.length);

        var referencenumber = +new Date();
        // console.log(referencenumber)
        var geolocation=localStorage.getItem('geolocation');
        var IMEI = device.serial;
          
        var cnt = 0;
        var projectid = localStorage.getItem("projectid") ;
        var questionid;
        var answer;
        var resultObj = '[';
        var usermail= referencenumber;
        var respArray;
        var responseTimer="";

        var pos=0;


        // timerDivs.forEach((rows)=>{
        //   console.log(rows)

          $('.chtype').each(function(index, element) { //this class contains all the elements for data input
            
console.log(index+'=>'+element);

            if($(this).attr('type')=="radio") {
    
                if($(this).is(':checked')) {
                    
                    answer =  $(this).val();
                    questionid = $(this).attr('name');
                   //  responseTimer = $('.responsetimer').val();
                   //  responseTimer = document.getElementsByClassName("responsetimer")[pos].innerText;

                  //  responseTimer = timerDivs[index].value;

                    resultObj += '{"imei": "'+IMEI+'", "timer": "'+responseTimer+'", "dated": "'+usermail+'", "project_id": "'+projectid+'", "question_id": "'+questionid+'", "answer": "'+answer+'", "gps": "'+geolocation+'"  }, ';
    
                }
    
            }else if($(this).attr('type')=="number") {
                
                answer =  $(this).val()
                questionid = $(this).attr('name');
               //  responseTimer = $('.responsetimer').val();
               //  responseTimer = document.getElementsByClassName("responsetimer")[pos].innerText;
                //  responseTimer = timerDivs[index].value;

                resultObj += '{"imei": "'+IMEI+'", "timer": "'+responseTimer+'", "dated": "'+usermail+'", "project_id": "'+projectid+'", "question_id": "'+questionid+'", "answer": "'+answer+'", "gps": "'+geolocation+'" }, ';
    
            }else if($(this).attr('type')=="text"){
                /** pick the image file here store in local storage for offline mode 
                 * and straight 
                 * to live server in online mode */
                answer =  $(this).val() 
                questionid = $(this).attr('name') 
               //  responseTimer = $('.responsetimer').val();
              //  responseTimer = timerDivs[index].value;

                resultObj += '{"imei": "'+IMEI+'", "timer": "'+responseTimer+'", "dated": "'+usermail+'", "project_id": "'+projectid+'", "question_id": "'+questionid+'", "answer": "'+answer+'", "gps": "'+geolocation+'" }, ';
    
            }else if($(this).attr('type')=="img" ){ //images

             //check how to pick image file from device and send to server for storage
                answer =  $(this).val()
                questionid = $(this).attr('name') 
               //  responseTimer = $('.responsetimer').val();
                //  responseTimer = timerDivs[index].value;

                resultObj += '{"imei": "'+IMEI+'", "timer": "'+responseTimer+'", "dated": "'+usermail+'", "project_id": "'+projectid+'", "question_id": "'+questionid+'", "answer": "'+answer+'", "gps": "'+geolocation+'" }, ';
            } 

          }) // end of .each
        

        // }) // end of foreach
         
         console.log(resultObj)
     
         resultObj = resultObj.substring(0, resultObj.lastIndexOf(","));
     
        //  swal('Error!', 'No server configured for CRUD operation!!!', 'error');
     
         resultObj += ']';

         alert(resultObj);

         /**Check the Network status and DETERMINE 
          * eithr to save locally or save on the 
          * iCloud live server */

         var netState = checkConnection();

         console.log(netState)

         if(netState=='No network connection') { //SAVE TO LOCAL DATABASE
            var surveyDB = window.sqlitePlugin.openDatabase({name: "surveydb.db", location: 'default'});
            // console.log(resultObj);

            console.log(JSON.parse(resultObj));
            
            console.log('length: '+JSON.parse(resultObj).length);
          // var sql = "question_response (refnos bigint(20), project_id bigint(20), question_no tinyint(4), question varchar(250), required varchar(3), usermail varchar(50), status varchar(3) )";
          
            surveyDB.transaction(function(tx) {
              
              // tx.executeSql('INSERT INTO question_response(refnos, project_id, question_no, ) VALUES (?, ?, ?)', [1, user, pass]
              //   , function(tx, resultSet) {
              //     alert('resultSet.insertId: ' + resultSet.insertId);
              //     alert('resultSet.rowsAffected: ' + resultSet.rowsAffected);
            
              //   }, function(error) {
              //     alert('INSERT error: ' + error.message);
              // });
              $('.main-carousel').flickity();

            }, function(error) {
              alert('Insertion error: '+ error.message);
              surveyDB.close();
            }, function(){
              alert('Response inserted Locally...');
              surveyDB.close();
            })
            
         } else {// LIVE SERVER
          socket.emit('_saveanswer', JSON.parse(resultObj));
         
          socket.on('saved', () => {
            $('.main-carousel').flickity();
              swal('HEY!', 'Thanks for sharing with us...', 'success');
          });
      

         }

         
         
          /** 
          * 
          * 
          * 
          *
          * 
         */

      //  }); /**End save button  */

}/**End save CALL  */

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
    destinationType: Camera.DestinationType.FILE_URI, 
    sourceType : Camera.PictureSourceType.CAMERA,
    allowEdit : true,
    // encodingType: Camera.EncodingType.JPEG,
    targetWidth: 100,
    targetHeight: 100,
    popoverOptions: CameraPopoverOptions,
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
    quality: 50, 
    destinationType: Camera.DestinationType.FILE_URI, 
    sourceType : Camera.PictureSourceType.CAMERA,
    allowEdit : true,
    encodingType: Camera.EncodingType.JPEG,
    targetWidth: 100,
    targetHeight: 100,
    popoverOptions: CameraPopoverOptions,
    saveToPhotoAlbum: false,
    correctOrientation: true

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

