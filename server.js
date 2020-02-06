

// //jomi, jagunlabi, extra flush
// 07034809006

'use strict';

// ================================================================
// get all the tools we need
// ================================================================
// const cool = require('cool-ascii-faces')

var express = require('express');

var port = process.env.PORT || 4000;

var app = express();
var bodyParser = require('body-parser');
var mysql = require('mysql') ;
var multer = require('multer');
var path = require('path');
var nodemailer = require('nodemailer');
var mailer = require('./mailer/mailer');
var urlencodedParser = bodyParser.urlencoded({extended: false});
// var isBase64 = require('is-base64');

  
var http = require('http');
var ejs = require('ejs');
var routes = require('./routes/index.js');
var publicPath = path.join(__dirname, 'public');

var htmlPath = path.join(__dirname, 'views/html');
var uploadPath = path.join('/var/www/html/sprimages/');

// console.log(path)
console.log(uploadPath)

var socketIO = require('socket.io');
var server = http.createServer(app);
/** instantiate socket.io here */
var io = socketIO(server);

var fs = require('fs');

// var upload = multer({ dest: 'uploads/' })

/** Database Connections Handle */
var DataBasepool = require('./connections/connection');


var getAlltotal = require('./utilities/getTotalBoardContent');
var dateFormat = require('dateformat');
// var cors = require('cors');
var outResultArray = [];


// ================================================================
// setup our express application
// ================================================================
// app.set('view engine', 'html');
// app.use('public', express.static(process.cwd() + 'public'));
// app.engine('html', require('ejs').renderFile);

app.set('view engine', 'ejs');

app.set('views', __dirname);

// app.use(express.static(publicPath));

app.use(express.static(htmlPath));
// app.use(cors());

app.set('socketio', io);


app.use(function(req, res, next){
    res.header('Access-Control-Allow-Origin', "*");
    // res.header('Access-Control-Allow-Origin', "75.127.75.161:4000");
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, __dirname + '/uploads/');
     },
     filename: (req, file, cb) => {
        cb(null, file.fieldname + "-" + file.originalname);
        // cb(null, file.fieldname + "-" + Date.now() + "-" + file.originalname)
     }
 });

 const upload = multer({storage: storage});
 
/**Excel sheet importer */

// -> Express Upload RestAPIs
app.post('/uploadfile', upload.single("excel"), (req, res, next) =>{

    console.log(__dirname + '/uploads/' + req.file.filename);

    importExcelData2MySQL(__dirname + '/uploads/' + req.file.filename);
    
    res.send({
        status: 'File Imported successfully! ', 
        filename: req.file.filename,
        filesize: req.file.size,
        apihost: 'http://treschicpro.online/tressales'

    });
	// res.json({
    //     'msg': 'File uploaded/import successfully!', 'file': req.file
    // });
    
});

// -> Import Excel Data to MySQL database
function importExcelData2MySQL(filePath){
    // File path.
    var count=0;
	readExcelFile(filePath).then((rows) => {
		// `rows` is an array of rows
		// each row being an array of cells.	 
		// console.log('Rows: '+rows.length);
     
        count++;
		/**
		[ [ 'Id', 'Name', 'Address', 'Age' ],
		[ 1, 'Jack Smith', 'Massachusetts', 23 ],
		[ 2, 'Adam Johnson', 'New York', 27 ],
		[ 3, 'Katherin Carter', 'Washington DC', 26 ],
		[ 4, 'Jack London', 'Nevada', 33 ],
		[ 5, 'Jason Bourne', 'California', 36 ] ] 
		*/
	 
		// Remove Header ROW
		rows.shift();
	 
		// Create a connection to the database
		const connection = mysql.createConnection({
			host: 'localhost',
			user: 'root',
			password: 'opeyemi',
			database: 'treschicdb'
		});
	 
		// Open the MySQL connection
		connection.connect((error) => {
			if (error) {
				console.error(error);
			} else {
                let query = 'INSERT INTO excel_sock (dated, description, amount) VALUES ?';
                
				connection.query(query, [rows], (error, response) => {
                    console.log(error || response);

                    /**
                    OkPacket {
                    fieldCount: 0,
                    affectedRows: 5,
                    insertId: 0,
                    serverStatus: 2,
                    warningCount: 0,
                    message: '&Records: 5  Duplicates: 0  Warnings: 0',
                    protocol41: true,
                    changedRows: 0 } 
                    */

                    connection.end();
				});
			}
        });
        
    })
    
    // console.log(count)
}

function setSelectedIndex(s, valsearch)
{
    // Loop through all the items in drop down list
    for (var i = 0; i < s.options.length; i++)
    { 
        if (s.options[i].value == valsearch)
        {
            // Item is found. Set its property and exit
            s.options[i].selected = true;
            break;
        }
    }
    return;
}

var getProjectTotals = () => {
    
     DataBasepool.getConnection((err, connection)=>{
        if(err){
            console.log(err);
            return err;

        }

        var counts=0;
        var sql = "select count(refnos) as counted from project";
        connection.query(sql, (err, result, flds)=>{
            if(err){
                console.log(err);
                return err.sqlMessage;
            }
            
            result.forEach((row)=>{
                return counts = row.counted;
            })
            connection.release();

            console.log('RES: '+ counts)
            // return counts;
            
        })


    })
    
}

var getTotalResponses = () => {
    var counts=0;
    DataBasepool.getConnection((err, connection)=>{
        if(err){
            console.log(err);
            return err;

        }

        var sql = "select count(DISTINCT usermail) as counted from `question_response`";
        connection.query(sql, (err, result, flds) => {
            if(err){
                console.log(err);
                return err.sqlMessage;
            }
            
            result.forEach((row) => {
                counts = row.counted;
            })
            connection.release();



            // console.log('RES: '+ counts)

        })

    })
    return counts;
}

var getTotalQuestions = () => {
    var counts=0;
    DataBasepool.getConnection((err, connection)=>{
        if(err){
            console.log(err);
            return err;
        }

        var sql = "select count( refnos )  as counted from `questions_tbl`;";
        connection.query(sql, (err, result, flds)=>{
            if(err){
                console.log(err);
                return err.sqlMessage;
            }
            
            result.forEach((row)=>{
                counts = row.counted;
            })
            connection.release();
        })

    })
    return counts;
}

var getTotalInterviewers = () => {
    var counts=0;
    DataBasepool.getConnection((err, connection)=>{
        if(err){
            console.log(err);
            return err;
        }

        var sql = "select count( imei )  as counted from `device_registration`";
        connection.query(sql, (err, result, flds)=>{
            if(err){
                console.log(err);
                return err.sqlMessage;
            }
            
            result.forEach((row)=>{
                counts = row.counted;
            })
            connection.release();

        })

    })
    return counts;
}

var getComparedData = (sql, q_id, w_id) => {
    // console.log(sql)
    // console.log(q_id)
    // console.log(w_id)
    

}

var getTotalSupervisors = () => {
    var counts=0;
    DataBasepool.getConnection((err, connection)=>{
        if(err){
            console.log(err);
            return err;
        }

        var sql = "select count( refnos )  as counted from `supervisors`";
        connection.query(sql, (err, result, flds)=>{
            if(err){
                console.log(err);
                return err.sqlMessage;
            }
            
            result.forEach((row)=>{
                counts = row.counted;
            });
            connection.release();
        })
    })
    return counts;
}
 
// ================================================================
//                              setup routes
// ================================================================
//          app.get('/cool', (req, res) => res.send(cool()))

app.get('/register', (req, res) => {
    console.log('Dele waz....');

    var user=req.query.user;
    var email=req.query.email;
    var phone=req.query.phone;
    var model=req.query.model;
    var imei=req.query.imei;
    var u_login=req.query.u_login;
    var pass=req.query.pass;

    // console.log(u_login)
    // console.log(pass)
    // console.log(imei)
    
    // var lat=req.query.lat;
    // var lon=req.query.lon;
    var gps=req.query.gps;
    
    // var gps = lat+", "+lon;
    console.log("GPS: "+gps);
    DataBasepool.getConnection(function(err, connection) {
        if (err){
          console.log(err);
          return;
        }
  
        connection.beginTransaction((err) => {
            if (err) {
                console.log("3. "+err);
                
                res.json({resp: 'error', error: err });
                return connection.rollback(function() {
                //  connection.release();
                });
            }
  
            var query_ = "select * from webusers where usermail = ? and passkey = ? and access_level='device' ";
            connection.query(query_, [u_login, pass], (err, result, flds) => {
                if(err) {
                    res.json({resp: 'error', error: err.sqlMessage });
                    
                    console.log(err);
                    return;
                }
                console.log(result);
                var recs=0;
    
                var projectId=0;
    
                result.forEach((row) => {
                    projectId = row.project_id;
                });
    
                if(projectId==0){
                    res.json({resp: 'error', error: 'Unknown Credentials...' });
                    // socket.emit('u_login', {resp: 'Unknown Credentials...'});
                    return;
                }
    
                var sql = "insert into device_registration(name, phone, email, imei, device_type, gps, project_id) values(?, ?, ?, ?, ?, ?, ?) ";
                // Use the connection
                connection.query(sql, [user, phone, email, imei, model, gps, projectId], function (err, results, fields) {
                    // When done with the connection, release it.
                    // connection.release();
                
                    // Handle error after the release.
                    if (err) {
                        console.log(err);
                        res.json({resp: 'error', error: err });
                        return;
                    }
    
                    var Qry = "select q.refnos as refnos, q.`project_id` as project_id, q.`question_no` as question_no, q.`question` as question, q.`required` as required, q.`usermail` as usermail, q.`status` as sta, q.question_index as question_index, p.`status` as status, p.project_title as title from project p inner join questions_tbl q ON p.`refnos` = q.`project_id` where project_id = ? and q.status = 'ON' order by q.question_no";
                    connection.query(Qry, [projectId], (err, questionsRS, fields) => {
        
                        if(err) {
                            res.json({resp: 'error', error: err });
                            console.log(err);
                            return;
                        };

                        var project_title="";

                        questionsRS.forEach((row)=>{
                            project_title=row.title;
                        });
        
                        sql = "SELECT * FROM options_tbl as b WHERE EXISTS( SELECT * FROM questions_tbl as a WHERE b.question_id = a.refnos and a.project_id = ?)";
        
                        connection.query(sql, [projectId], (err, optionRS, flds) => {
                            if(err) {
                                res.json({resp: 'error', error: err });
                                console.log(err);
                                return;
                            };
        
                            connection.commit(function(err){
                                if (err) {
                                    console.log(err);
            
                                    res.json({resp: 'error', error: err });
                                    return connection.rollback(function() {
                                    //  connection.release();
                                    });
                                }
                                connection.release();
                                var respo='success'+'#'+questionsRS+'#'+optionRS+'#'+projectId;

                                // res.send(respo);

                                res.json({
                                    resp: 'success', 
                                    questions: questionsRS, 
                                    options: optionRS, 
                                    projectid: projectId,
                                    title: project_title
                                });
                                
                                console.log('Got here safe...')
                    
                                
                                // Don't use the connection here, it has been returned to the pool.
                    
                            });
                        
                        })
        
                    })
                
                });
    
            }) 
          
        })
  
    }); //pooler

});

app.get('/reportcoordinate', (req, res) => {
    var gps = req.query.gps;
    var device = req.query.device;

    // console.log(gps);
    // console.log(device);

    var dt = new Date();

    DataBasepool.getConnection((err, connection)=>{
        if(err){
            console.log(err);
            res.json({error: err})
            return
        }

        var sql = "UPDATE device_registration set gps_watching = ? where imei = ?";
        connection.query(sql, [gps, device], (err, results, fields)=>{
            if(err){
                console.log(err);
                res.json({error: err})
                return
            }
            connection.release();
    
        })

    })
});

app.get('/login', (req, res) => {
    var user = req.query.user;
    var pass = req.query.pass;
    var imei = req.query.imei;

    console.log(user);
    console.log(pass);
    console.log(imei);

    DataBasepool.getConnection(function(err, connection) {
        if (err){
          console.log(err);
          return;
        }
  
        connection.beginTransaction((err) => {
          if (err) {
            console.log("3. "+err);
            res.json({resp: 'error', error: err.sqlMessage });
            return connection.rollback(function() {
               //  connection.release();
            });
          }
  
          var _qr = "select * from device_registration where imei = ?";
          connection.query(_qr, [imei], (err, deviceRS, field) => {
            if (err) {
                console.log("3. "+err);
                res.json({resp: 'error', error: err.sqlMessage });
                return connection.rollback(function() {
                    //  connection.release();
                });
            }
            
            var deviceproject = 0;
            deviceRS.forEach((row) => {
                deviceproject = row.project_id;
            });
  
            console.log("device Projectid: "+deviceproject);

            // if(deviceproject==0) {
            //     res.json({
            //         resp: 'register', 
            //         error: 'Device not registered!!!'
            //     });
            //     return
            // }
          
            var query_ = "select * from webusers where usermail = ? and passkey = ? and access_level='device' "
            connection.query(query_, [user, pass], (err, result, flds) => {
                if(err){
                    res.json({resp: 'error', error: err.sqlMessage})
                    console.log(err)
                    return
                }
                var recs=0;
    
                var projectId=0;
                result.forEach((row) => {
                    projectId = row.project_id;
                })
                /** device and project */
                
                //   if(deviceproject !== projectId){
                //     res.json({resp: 'error', error: 'You are attempting a wrong questionaire...Contact Admin!!!'});
                //     return;
                //   }
  
                if(projectId==0){
                    res.json({resp: 'error', error: 'Login Credentials has no project...cant continue!!!'});
                    return;
                }
  
                var sql = "update device_registration set project_id = ? where imei = ? ";
                // Use the connection
                connection.query(sql, [projectId, imei], function (err, results, fields) {
                    // When done with the connection, release it.
                    // connection.release();
                
                    // Handle error after the release.
                    if (err) {
                        res.json({resp: 'error', error: err.sqlMessage});
                        console.log(err);
                        return;
                    }
    
                    var Qry = "select q.refnos as refnos, q.`project_id` as project_id, q.`question_no` as question_no, q.`question` as question, q.`required` as required, q.`usermail` as usermail, q.`status` as sta, p.`status` as status, p.project_title from project p inner join questions_tbl q ON p.`refnos` = q.`project_id` where project_id = ? and q.status = 'ON' order by q.question_no";
                    connection.query(Qry, [projectId], (err, questionsRS, fields) => {
    
                        if(err) {
                            res.json({resp: 'error', error: err.sqlMessage});
                            console.log(err);
                            return;
                        };

                        var project_title="";

                        questionsRS.forEach((row)=>{
                            project_title = row.project_title;
                        })

                        console.log('Title: '+project_title)
        
                        sql = "SELECT * FROM options_tbl as b WHERE EXISTS( SELECT * FROM questions_tbl as a WHERE b.question_id = a.refnos and a.project_id = ?)";
        
                        connection.query(sql, [projectId], (err, optionRS, flds) => {
                            if(err) {
                            res.json({resp: 'error', error: err.sqlMessage});
                            console.log(err);
                            return;
                            };
        
                            connection.commit(function(err) {
                            if (err) {
                                console.log(err);
                                res.json({resp: 'error', error: err.sqlMessage });
                                return connection.rollback(function() {
                                    //  connection.release();
                                });
                            }
                            
                            connection.release();
                            res.json({resp: 'success', questions: questionsRS, options: optionRS, projectid: projectId, title: project_title});
                    
                            // Don't use the connection here, it has been returned to the pool.
                
                            });

                            console.log('All went well!!!')
                            
                        })
        
                    });
                    
                });
  
            }) /**End of webusers */
  
          })
  
        })
        
  
  
    }); //pooler
    

    // res.json({name: "Dele"})


    

})

app.get('/', function(req, res) {
    res.sendFile(htmlPath+('/login.html'));
    // res.sendFile('html/login');

});

async function getQuestionIndexNumber(id) { 
    return new Promise((resolve, reject) => {
        DataBasepool.getConnection((err, connection) => {
            if(err){
                console.log(err);
                reject(err)
                return;
            } 
            var sql = "select question_index from questions_tbl where refnos=?";
            connection.query(sql, [id], (err, result) => {
                if(err) {
                    console.log(err);
                    reject(err)
                    return;
                }
                var q_idx=0;

                result.forEach((rec) => {
                    q_idx = rec.question_index;
                });
                console.log(q_idx)
                connection.release();

                resolve(q_idx);

            });

            
        });
    });
        

}


app.post('/savecondition', urlencodedParser, (req, res)=>{
    // console.log(answerObject)
    // var answerObject = JSON.parse(req.body.insertObject);
    // data: "user="+user+"&question_id="+questionId+"&option_id="+optionId+"&skipquestion_id="+gotoquestionId, //questno
    var user = req.body.user;
    var question_id = req.body.question_id;
    var optionId = req.body.option_id;
    var skipquestion_id = req.body.skipquestion_id;

//     var q_idx = getQuestionIndexNumber(skipquestion_id);
// console.log('Real Index: '+q_idx)


    console.log("User: "+user)
    console.log("Question: "+question_id)
    console.log("Option: "+optionId)
    console.log("Skip: "+skipquestion_id)

    
    DataBasepool.getConnection((err, connection)=>{
        if(err) {
            console.log(err);
            res.json({resp: 'error', error: err});
            return;
        };


        var sql = "update options_tbl set gotoquestionid = ? where refnos = ?";

        connection.beginTransaction((err)=>{
            if(err) {
                console.log(err);
                res.json({resp: 'error', error: err});
                return;
            };

            connection.query("select question_index from questions_tbl where refnos=?", [skipquestion_id], (err, q_idx)=>{
                if(err) {
                    console.log(err);
                    res.json({resp: 'error', error: err});
                    return;
                };

                var question_idx=0;
                q_idx.forEach((rec)=>{
                    question_idx = rec.question_index;
                })
            
                connection.query(sql, [question_idx, optionId], (err, result)=>{ //Update Option table
                    if(err) {
                        console.log(err);
                        res.json({resp: 'error', error: err});
                        return;
                    };

                    //remove
                    // connection.query("select question_index from questions_tbl where refnos=? ", [skipquestion_id], (err, questIdx)=>{
                        
                        
                    sql = "insert into question_skip_log (question_id, option_id, gotoquestion_id, user_id, idx) values(?, ?, ?, ?, ?)";
                    connection.query(sql, [question_id, optionId, skipquestion_id, user, question_idx], (err, results)=>{
                        if(err) {
                            console.log(err);
                            res.json({resp: 'error', error: err});
                            return;
                        };

                        var _query="select qs.`refnos`, ot.`response_text`, qt.`question` from `questions_tbl` qt, question_skip_log qs inner join `options_tbl` ot ON qs.`option_id` = ot.`refnos` where qs.`gotoquestion_id` = qt.`refnos` and qs.`question_id`=?";
                        connection.query(_query, [question_id], (err, responseText)=>{
                            if(err) {
                                console.log(err);
                                res.json({resp: 'error', error: err});
                                return;
                            };

                            var str = "<table class='table table-hover'>";

                            str += "<tr><td colspan='10'>QUESTIONS SKIP CONDITIONS</td></tr>";
                        
                            var counter=0;
                            responseText.forEach((rec)=>{
                                counter++;
                                str+="<tr><td>"+ counter +"</td><td>"+ rec.response_text +"</td><td>"+ rec.question +"</td></tr>";
                            });

                            str+= "</table>";

                        
                            console.log(str)
                            connection.commit((err)=>{
                                if(err) {
                                    console.log(err);
                                    res.json({resp: 'error', error: err});
                                    return;
                                };
    
                                connection.release();                    
    
                                res.json({resp: str});
                
                            })
                            
    
                        })
                        
                    })

                    // }) //remove


                })

            })
        })
    })

})

app.post('/saveconditiontxt', urlencodedParser, (req, res)=>{
    // data: "user="+user+"&question_id="+questionId+"&option_id="+optionId+"&min="+min+"&max="+max, //questno
    var user = req.body.user;
    var question_id = req.body.question_id;
    var option_id = req.body.option_id;
    var min = req.body.min;
    var max = req.body.max;

    console.log(option_id)
    console.log(min)
    console.log(max)

    DataBasepool.getConnection((err, connection)=>{
        if(err) {
            console.log(err);
            res.json({resp: 'error', error: err});
            return;
        };

        connection.beginTransaction((err)=>{
            if(err) {
                console.log(err);
                res.json({resp: 'error', error: err});
                return;
            };

            var sql = "update options_tbl set min = ?, max = ? where refnos = ?";
            connection.query(sql, [min, max, option_id], (err, result) => {
                if(err) {
                    console.log(err);
                    res.json({resp: 'error', error: err});
                    return;
                };

                connection.commit((err)=>{
                    if(err) {
                        console.log(err);
                        res.json({resp: 'error', error: err});
                        return;
                    };
        
                })

                connection.release();

                res.json({resp: "success"});
                
            })
        })
    })

})
app.post('/saveconditionnum', urlencodedParser, (req, res)=>{
    // data: "user="+user+"&question_id="+questionId+"&option_id="+optionId+"&min="+min+"&max="+max, //questno
    var user = req.body.user;
    var question_id = req.body.question_id;
    var option_id = req.body.option_id;
    var min = req.body.min;
    var max = req.body.max;

    console.log(option_id)
    console.log(min)
    console.log(max)

    DataBasepool.getConnection((err, connection)=>{
        if(err) {
            console.log(err);
            res.json({resp: 'error', error: err});
            return;
        };

        connection.beginTransaction((err)=>{
            if(err) {
                console.log(err);
                res.json({resp: 'error', error: err});
                return;
            };

            var sql = "update options_tbl set min_v = ?, max_v = ? where refnos = ?";
            connection.query(sql, [min, max, option_id], (err, result) => {
                if(err) {
                    console.log(err);
                    res.json({resp: 'error', error: err});
                    return;
                };

                connection.commit((err)=>{
                    if(err) {
                        console.log(err);
                        res.json({resp: 'error', error: err});
                        return;
                    };
        
                })

                connection.release();

                res.json({resp: "success"});
                
            })
        })
    })

})

app.post('/saveanswer', urlencodedParser, (req, res) => {
    // console.log(req)
    console.log(req.body.insertObject)

    var gps = req.body.insertObject;

    /** MAIN Answer from clients */
    var answerObject = JSON.parse(req.body.insertObject);

    // console.log(Object.keys(answerObject));

    // console.log(answerObject.length);
    // console.log(answerObject);

    var curr_gps="";
    var elm_type="";

    var timer="", usermail="", project_id="", question_id="", answer="", gps="", imei="";
     
    project_id = answerObject[0].project_id;

    console.log(project_id);

    DataBasepool.getConnection(function(err, connection) {
        if(err) {
            console.log(err);
            res.json({resp: 'error', error: err});
            return;
        };

        connection.query("select current_wave from project where refnos = ?", [project_id], (err, results)=>{
            if(err) {
                console.log(err);
                res.json({resp: 'error', error: err});
                return;
            };

            var current_wave=0;
            results.forEach((row)=>{
                current_wave=row.current_wave;
            });
            console.log('current wave: '+current_wave);
            for(var x = 0; x < answerObject.length; x++) 
            {
                imei = answerObject[x].imei;
                usermail = answerObject[x].dated;
                project_id = answerObject[x].project_id;
                question_id = answerObject[x].question_id;
                answer = answerObject[x].answer;
                gps = answerObject[x].gps;
                timer = answerObject[x].timer;
                curr_gps=answerObject[x].curr_gps;
                elm_type=answerObject[x].elm_type;

                // console.log(answer+": "+isBase64(answer));

                if(elm_type=="image") 
                {
                    var img_name='MRCImage-'+new Date()+'.jpg';
                    // write image file
                    var fi
                    var spl_arr = answer.split('base64,');
                    let buff = new Buffer(spl_arr[1], 'base64');
                    fs.writeFileSync(uploadPath + img_name, buff);
                    // build the image link URL
                    var imageURL = "http://75.127.75.161/sprimages/"+img_name;
                    answer = imageURL;

                }
                else if(elm_type=="video")
                {

                }
                else if(elm_type=="audio")
                {

                }

                /** INSERT outlet_id, state_code and area_code in  */
                var sql = "INSERT into question_response(question_refnos, response_text, usermail, imei, location, project_id, q_response_time, timer, wavecode) values(?, ?, ?, ?, ?, ?, ?, ?, ?)";

                connection.query(sql, [question_id, answer, usermail, imei, gps, project_id, timer, curr_gps, current_wave], (err, result, flds) => {
                    if(err) {
                        console.log(err);
                        //   res.json({resp: 'error', error: err});
                        return;
                    };
                    var today = dateFormat(new Date(), 'yyyy-mm-dd');
             

                    connection.query("select distinct count( distinct `usermail`) as counted  from `question_response` where date(dated) = ?", [today], (err, results, fields)=>{
                        if(err){
                            console.log(err);
                            return;
                        }
                        var counter=0;

                        results.forEach((row)=>{
                            counter = row.counted;
                        });

                        const io = req.app.get('socketio');
                        io.sockets.emit('all responses today', counter);
                        
    
                        console.log(io);
                    })
                });
            };
            
            res.json({resp: 'saved'});
            connection.release();
        })


    });

});

 
app.get('/about', function(req, res) {
  // res.render('pages/about');

});

app.get('/new', function(req, res) {
  getAllData(function(response)
  {
      // Here you have access to your variable
      var list = response//YOUR OBJECT DATA
      var count= Object.keys(list).length; 
      
      var data = buildHtml(list); 
      res.render('pages/new', {
          result: list 
      });

      data = response
  }) 
  // res.render('pages/new', {
  //     result: ''
  // });
})

app.get('/projectquestions', function(req, res){
  console.log(req.query.projectid);

  res.send('Success');
})

app.get('/info', function(req, res) {
  // console.log(req.body)   

  getCompanyInfo(function(result){             
      // console.log( result[0].phone )

      res.render('pages/info', {
          phone: result[0].phone,
          email: result[0].email,
          add1: result[0].address,
          add2: result[0].address2,
          add3: result[0].address3,
      });
  })
  
})

app.get('/popo', function(req, res){

})

app.post('/update', urlencodedParser,  (req, res)=>{
//   console.log(req.body)
  updateCompanyInfo(req.body, function(response){
      console.log(response)

      getCompanyInfo(function(result){             
        //   console.log( result[0].phone )

          res.render('pages/info', {
              phone: result[0].phone,
              email: result[0].email,
              add1: result[0].address,
              add2: result[0].address2,
              add3: result[0].address3,
          });
      })

  })

})

app.post('/image', urlencodedParser, function(req, res){
  var val = req.body.reference
  console.log(val)

  res.render('pages/imagesupload', {
      value: val
  })
})

app.post('/delete', urlencodedParser, function(req, res){
  // console.log(req.body.reference);
  var val = req.body.reference

  eraser(val);
  var data
  // getAllData(getDataArray); /**PASS another function that will work on the result as a parameter to this CALL */
  
  getAllData(function(response){
      // Here you have access to your variable
      var list = response//YOUR OBJECT DATA
      var count= Object.keys(list).length; 
      
      data = buildHtml(list)

      // console.log('Data from htmlbuilder: '+list)

      res.render('pages/new', {
          result: list 
      });

      data = response
  }) 
})

app.post('/add', function(req, res) {
  // console.log('The object look like: ' + JSON.stringify(req.body)  )    
  // if(!req.file) return
  
  // console.log('available file name: '+req.file.filename)
  
  upload(req, res, function(err){
      // console.log(req.file)
      if(err){
          console.log('My Error: '+err)
      }else{ 
          console.log('hhh'+req.file)  

          db(req.body, req.file, function(recid){
              var ID = 0;
              ID = recid
            //   console.log('ID: '+recid)
              var email = req.body.email
              
              // console.log('available file name 22: '+req.file.filename)
              var productImage = "http://75.127.75.161/courier/" + req.file.filename

            //   console.log('Mail: '+email)

              var output = `
              <!DOCTYPE html>

              <html>
                  <head>
                      <title>Software-driven Mails</title>
                      <meta charset="utf-8" >
                      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1.0, user-scalable=no">
                      <meta http-equiv="X-UA-Compatible" content="IE=edge" >
                      <meta name="description" content="Software-driven Mails">
                      <meta name="keywords" content="Software-driven Mails">
                      <meta name="author" content="Software-driven Mails">
                  </head>
                  
                  <body>

                      <div class='container'>

                          <div class='header' style="margin-left: auto; margin-right: auto; text-align: center; background-color: #2196F3; color: #Fff; font-family: 'Open Sans', sans-serif; font-size: 13px; padding: 1px; margin-top: 10px; border-radius:10px 10px 0px 0px;">
                              <h2>Tracking Details</h2> 
                          </div>

                          <div class='body' style="text-align: center; background-color: #fff; color: #000; font-family: 'Open Sans', sans-serif; font-size: 13px; padding: 1px; margin-top: 10px; border-radius: 2px 10px 0px 0px;">
                              <p style='font-size: 16px; font-weight: bold'>The delivery of your package is in progress. <br></p>
                          
                              <p style='font-size: 14px; font-weight: bold'>Your tracking details are as stated below:</p><br>

                              <p style='font-size: 16px; font-weight: bold; text-align: center'>Tracking Number:   ${ID} </p><br>
                              <p style='font-size: 16px; font-weight: bold; text-align: center'>Product Name: ${req.body.product}</p>  <br>
                              <p style='font-size: 16px; font-weight: bold; text-align: center'>Product Image: </p> <img src='${productImage}' alt='${productImage}' height='200' width='250' /> <br>
                              
                              <p style='font-size: 18px; font-weight: bold'>Click the <a href='https://delafsystems.online/courier/tracking.html'>LINK</a> to track your package now  </p>
                          </div>

                          <div class='footer' style="margin-left: auto; margin-right: auto; text-align: center; background-color: #2196F3; color: #Fff; font-family: 'Open Sans', sans-serif; font-size: 13px; padding: 1px; margin-top: 10px; border-radius:10px 10px 0px 0px;">
                              Powered by DELAF Solutions
                          </div>

                      </div>
                      
                  </body>
              </html>

              
              <body>
                  
              </body>
      
              `

              // create reusable transporter object using the default SMTP transport
              var transporter = nodemailer.createTransport({
                  service: 'Gmail',
                  auth: {
                      user: 'namaeclearanceportal@gmail.com',
                      pass: 'namaportal'
                  }
              }); 

              // setup email data with unicode symbols
              var mailOptions = {
                  from: '"Air Premium Courier" <delafsystems@gmail.com>', // sender address
                  // to: "dolaf2007@yahoo.com, delafsolutions@gmail.com", // list of receivers
                  to: `${email}` ,
                  subject: "Acknowledgement", 
                  html: output // html body
              } 

              // send mail with defined transport object
              transporter.sendMail(mailOptions, (err, info) =>{
                  if(err){
                      console.log(err)
                  }else{
                      console.log(`Email sent...%s`+info.messageId)
                      console.log('Preview URL...%s'+nodemailer.getTestMessageUrl(info))
                  }

              })

              /**Write the image to location and update the database*/

              // updateImageLocation(ID, productImage, function(){ 
              //     getAllData(function(response){ 
              //         var list = response 
              //         var count= Object.keys(list).length; 
                      
              //         res.render('pages/new', {
              //             result: list 
              //         }); 
              //     })  


              // });

              // emailsender('dele', mailOptions, function(){
              //     console.log('email sent')
              // });

              getAllData(function(response){ 
                  var list = response 
                  var count= Object.keys(list).length; 
                      
                  res.render('pages/new', {
                      result: list 
                  }); 
              })  
              

          }); /**End of db() CALL */


      }/**End of IF */

  })/**End of upload CALL */

})

app.post('/image', (req, res) => {
  // console.log("The Image: "+req.files.myImage)
  // console.log(req.body)


  var html = buildHtml(req);
  // console.log(html);

  res.writeHead(200, {
      'Content-Type': 'text/html',
      'Content-Length': html.length,
      'Expires': new Date().toUTCString()
  });

  res.end(html)

})

app.post('/upload', (req, res) => {
  // console.log("The Image: "+req.files.myImage)
  // console.log(req.body)


  var html = buildHtml(req);
  // console.log(html);

  res.writeHead(200, {
      'Content-Type': 'text/html',
      'Content-Length': html.length,
      'Expires': new Date().toUTCString()
  });

  res.end(html)

  // res.render('pages/new', {
  //     msg: "dee"
  // })


  // upload(req, res, (err) => {
  //     if(err){
  //         res.render('new', {
  //             msg: "Dele: "+err
  //         })
  //     }else{
  //         console.log(res.file)
  //     }
  // })
})

app.get('/rawdata', function(req, res) {
    var usermail = req.query.user;

    console.log('User ni: '+usermail); 

    DataBasepool.getConnection(function(err, connection){        
        if(err){
            res.send(err.sqlMessage);
            return;
        }
        connection.query("select refnos from project where usermail = ? and status ='ON' ", [usermail], (err, results, flds) => {
            if (err){
                res.send(err.sqlMessage);
                return connection.rollback(() => {
                    // connection.release();
                });
            };

            var project_id=0;

            results.forEach((p_rs) => {
                project_id = p_rs.refnos;
            })
            // console.log(project_id)
            // connection.query("call f_get_response_data()", function (err, result, fields) {
            connection.query("select * from questions_tbl where project_id = ? order by question_no", [project_id], function (err, result, fields) {
                if (err){
                    res.send(err.sqlMessage);
                    return connection.rollback(() => {
                        // connection.release();
                    })
                }

                // connection.query("call f_get_response_data()", function (err, responses, fields) {
                connection.query("select * from question_response where project_id = ? order by usermail, refnos", [project_id], function(err, responses, fields){
                    if(err){

                    }
                    var topmail, bottommail;

                    // console.log(responses);
                    
                    connection.query("select refnos, project_title from project where usermail = ?",[usermail], function(err, results, fields){
                        if(err){

                        }
                        var outObj = {
                            questions: result, 
                            responses: responses,
                            topmail: 'empty',
                            bottommail: usermail,
                            project: results
                        }

                        var str = "<table class='table display' id='example0'  >";
                        str += "<tr style='background-color: gray; color: white' ><th>Respondent&nbm; Name</th><th>GPS Location</th>";
                        result.forEach((q_rs) => {
                            str += "<th>"+ q_rs.question +"</th>";
                        })

                        str += "</tr>";

                        var topmail = "empty";

                        responses.forEach((r_rs) => {
                            var currentmail = r_rs.usermail;

                            if(topmail != currentmail){
                                str += "<tr style='font-weight: normal; font-size: 12px' ><td>"+ currentmail +"</td><td>"+ r_rs.location +"</td><td>"+ r_rs.response_text +"</td>";
 
                            }else if(topmail == currentmail){
                                str += "<td>"+ r_rs.response_text +"</td>"; 

                                if(topmail == currentmail){  

                                }else{

                                    str += "</tr>";    
                                } 
                                    
                            }
                            topmail = currentmail;

                        })

                        res.send(str);
                        // console.log(str);

                        
                    })
    
                })
    
            })


        })

        connection.release();

    }) //DB Connection Pool end
});

async function getQuestionOptionsArray(id){
    return new Promise((resolve, reject) => {
        DataBasepool.getConnection((err, connection)=>{
            if(err) {
                reject(err.sqlMessage);
                return;
            }
            
            var sql="select * from options_tbl where question_id = ?";
            connection.query(sql, [id], (err, result)=>{
                if(err) {
                    reject(err.sqlMessage);
                    return;
                }

                
                // console.log("Question: "+ txt)
                connection.release();
                resolve(result);
            })
        })
    })
}

async function getQuestionDescription(id){
    return new Promise((resolve, reject)=>{
        DataBasepool.getConnection((err, connection)=>{
            if(err) {
                reject(err.sqlMessage);
                return;
            }
            
            var sql="select question from questions_tbl where refnos = ?";
            connection.query(sql, [id], (err, result)=>{
                if(err) {
                    reject(err.sqlMessage);
                    return;
                }

                var txt = "";
                result.forEach((rec)=>{
                    txt = rec.question;
                })
                // console.log("Question: "+ txt)
                connection.release();
                resolve(txt);
            })
        })
    })
}

async function getQuestionResponseArray(id){
    return new Promise((resolve, reject) => {
        DataBasepool.getConnection((err, connection) => {
            if(err) {
                reject(err.sqlMessage);
                return;
            }
            
            var sql="select * from question_response where usermail = ?";
            connection.query(sql, [id], (err, result) => {
                if(err) {
                    reject(err.sqlMessage);
                    return;
                }

                 
                // console.log(result)
                connection.release();
                resolve(result);
            })
        })
    })
}

app.get('/editquestionaire',  async(req, res) => {
    let id = req.query.ref;
    console.log(id);

    let responseArray = await getQuestionResponseArray(id);

    let questionId=0, question="", col_type="", answer="", str="";

    for(var x=0; x < responseArray.length; x++){
        questionId = responseArray[x].question_refnos;
        answer     = responseArray[x].response_text;

        /** GET Question Options as well as col type: radio, text, checkbos, image etc */

        let question = await getQuestionDescription(questionId);

        let options  = await getQuestionOptionsArray(questionId);

        /** ThE options variable is an array  */

        console.log(question)
        console.log(options)

        col_type = options[0].coltype;
        console.log('**************************************************************************************************************************')

        let counter = x + 1;

        // <div id="carouselExampleIndicators" class="carousel slide" data-ride="carousel">
        // <ol class="carousel-indicators">
        //     <li data-target="#carouselExampleIndicators" data-slide-to="0" class="active"></li>
        //     <li data-target="#carouselExampleIndicators" data-slide-to="1"></li>
        //     <li data-target="#carouselExampleIndicators" data-slide-to="2"></li>
        // </ol>
        // <div class="carousel-inner">
        //     <div class="carousel-item active">
        //     <img class="d-block w-100" src="..." alt="First slide">
        //     </div>
        //     <div class="carousel-item">
        //     <img class="d-block w-100" src="..." alt="Second slide">
        //     </div>
        //     <div class="carousel-item">
        //     <img class="d-block w-100" src="..." alt="Third slide">
        //     </div>
        // </div>
        // <a class="carousel-control-prev" href="#carouselExampleIndicators" role="button" data-slide="prev">
        //     <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        //     <span class="sr-only">Previous</span>
        // </a>
        // <a class="carousel-control-next" href="#carouselExampleIndicators" role="button" data-slide="next">
        //     <span class="carousel-control-next-icon" aria-hidden="true"></span>
        //     <span class="sr-only">Next</span>
        // </a>
        // </div>







// <div class="carousel-item active">
//         //     <img class="d-block w-100" src="..." alt="First slide">
//         //     </div>


        if(col_type=='txt') {
            str+= "<div class='card' style='background-color: skyblue' >"
            str+= "<div class='card-body' >"
            str+= "<h3 class='card-title' style='font-weight: bold; font-size: 16px' ><p style='font-style: 18px'>Question  "+ counter +"</p> </br><p style='font-size: 20px'>" + question + "</p></h3></br>"
            str+= "<p class='card-text'><input type='text' class='form-control' value='"+answer+"' > </p>"
            
            str+="</div>"
            str+="</div>"

            // str+= "<div ><p>Question"+ x+1 +"</p>: " + question + "</div>"

        } else if(col_type='rad') {
            let opt_array;

            
            str+= "<div class='card' style='background-color: lightskyblue'>"
            str+= "<div class='card-body'>"
            str+= "<h3 class='card-title' style='font-weight: bold; font-size: 16px' > <p style='font-size: 12px'>Question  "+ counter + "</p> " + question + "</h3>"
            // str+= "<p class='card-text' ><input type='radio' class='form-control' checked value='"+answer+"' >"+answer+" </p>"

            for(let q = 0; q < options.length; q++){
                if(options[q].response_text==answer){
                    str += "<label class='container' >"+ options[q].response_text +"<input checked type='radio' value='"+ options[q].refnos +"'  ><span class='checkmark'></span></label>"
                }else{
                    str += "<label class='container' >"+ options[q].response_text +"<input type='radio' value='"+ options[q].refnos +"'  ><span class='checkmark'></span></label>"
                
                }
                
            }

            str+="</div>"
            str+="</div>"

        } else if(col_type='chk'){
            let opt_array;

            
            str+= "<div class='card'>"
            str+= "<div class='card-body'>"
            str+= "<h3 class='card-title' style='font-weight: bold; font-size: 16px' > Question"+ counter + ": " + question + "</h3></br>"
            // str+= "<p class='card-text' ><input type='checkbox' class='form-control ' value='"+answer+"' >"+answer+" </p>"

            for(let q = 0; q < options.length; q++){
                if(options[q].response_text==answer){
                    str += "<label class='container' >"+ options[q].response_text +"<input checked type='radio' value='"+ options[q].refnos +"'  ><span class='checkmark'></span></label>"
                }else{
                    str += "<label class='container' >"+ options[q].response_text +"<input type='radio' value='"+ options[q].refnos +"'  ><span class='checkmark'></span></label>"
                
                }
                
            }

            str+="</div>"
            str+="</div>"

        } else if(col_type='num'){
            str+= "<div ><p>Question"+ counter +"</p>: " + question + "</div></br>"
            str+= "<div ><p><input type='number' class='form-control' value='"+answer+"' > </p></div>"
            
        } else if(col_type='img'){
            str+= "<div ><p>Question"+ counter +"</p>: " + question + "</div></br>"
            str+= "<div ><p><input type='number' class='form-control' value='"+answer+"' > </p></div>"
            
        }
        
        // <div class="card" style="width: 18rem;">
        //     <div class="card-body">
        //         <h5 class="card-title">Card title</h5>
        //         <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
        //         <a href="#" class="btn btn-primary">Go somewhere</a>
        //     </div>
        // </div>


    }

    res.send(str)
    // console.log(responseArray);
    // console.log('Oladele')



     

})
app.get('/projrawdata', function(req, res){
    var usermail   = req.query.user;
    var project_id = req.query.projectid;
    var role       = req.query.role;

    console.log('User: '+usermail); 
    console.log('Role: '+role); 

    DataBasepool.getConnection(function(err, connection){        
        if(err) {
            res.send(err.sqlMessage);
            return;
        }
        var counter=0;
        connection.query("select count(DISTINCT usermail) as counted from `question_response` where project_id=?", [project_id], (err, resCount)=> {
            if(err) {
                console.log(err)
                res.send(err.sqlMessage);
                return;
            }   
            resCount.forEach((recs)=>{
                counter=recs.counted
            })  

            connection.query("select refnos from project where usermail = ? and status ='ON' ", [usermail], (err, results, flds) => {
                if (err){
                    res.send(err.sqlMessage);
                    return connection.rollback(() => {
                        // connection.release();
                    });
                };

                
                // connection.query("call f_get_response_data()", function (err, result, fields) {
                connection.query("select * from questions_tbl where project_id = ? order by question_no", [project_id], function (err, result, fields) {
                    if (err){
                        res.send(err.sqlMessage);
                        return connection.rollback(() => {
                            // connection.release();
                        })
                    }

                    // connection.query("call f_get_response_data()", function (err, responses, fields) {
                    var sql="";

                    if(role=='Admin') {
                        sql ="select d.`name` as devicename, q.refnos, q.question_refnos, q.response_text, q.usermail, q.imei, q.location, q.project_id, q.q_response_time, q.dated, q.timer, q.view_state, q.checker from `device_registration` d, question_response q where q.project_id = ? and q.view_state = 'admin' and d.`imei`=q.`imei` order by q.usermail desc, q.refnos;";
                        // sql ="select * from question_response where project_id = ? and view_state = 'admin' order by usermail, refnos";
                    }  
                    else if(role=='client') {
                        sql ="select d.`name` as devicename, q.refnos, q.question_refnos, q.response_text, q.usermail, q.imei, q.location, q.project_id, q.q_response_time, q.dated, q.timer, q.view_state, q.checker from `device_registration` d, question_response q where q.project_id = ? and q.view_state = 'client' and d.`imei`=q.`imei` order by q.usermail desc, q.refnos;";
                        // sql ="select * from question_response where project_id = ? and view_state = 'client' order by usermail, refnos";
                    }
                    else if(role=='manager') {
                        sql ="select d.`name` as devicename, q.refnos, q.question_refnos, q.response_text, q.usermail, q.imei, q.location, q.project_id, q.q_response_time, q.dated, q.timer, q.view_state, q.checker from `device_registration` d, question_response q where q.project_id = ? and q.view_state = 'field' and d.`imei`=q.`imei` order by q.usermail desc, q.refnos;";
                        // sql ="select * from question_response where project_id = ? and view_state = 'field' order by usermail, refnos";
                    }
                    connection.query(sql, [project_id], function(err, responses, fields){
                        if(err){
                            res.send(err.sqlMessage);
                            return connection.rollback(() => {
                                // connection.release();
                            })
                        }
                        var topmail, bottommail;

                        // console.log(responses);
                        
                        connection.query("select refnos, project_title from project where usermail = ?",[usermail], function(err, results, fields){
                            if(err){
                                res.send(err.sqlMessage);
                                return connection.rollback(() => {
                                    // connection.release();
                                })
                            }
                            var outObj = {
                                questions: result, 
                                responses: responses,
                                topmail: 'empty',
                                bottommail: usermail,
                                project: results,
                                counter: counter
                            }

                            var str = "<table class='table table-bordered table-hover table-sm' id='example0' border='0' cellpadding='0' cellspacing='0'  >";
                            if(role=='Admin'){
                                str += "<thead class='thead-dark' ><tr style='background-color: skyblue; color: black' ><th>Edit Record</th><th><input class='form-control' type='checkbox' id='header' value='"+project_id+"' name='header' onclick='checker(this.id, this.value)' ></th><th>Date</th><th>GPS Location</th><th>IMEI</th>"; 
                            }
                            else if(role=='client'){
                                str += "<thead class='thead-dark' ><tr style='background-color: skyblue; color: black' ><th>Date</th><th>GPS Location</th><th>IMEI</th>";
                            
                            }
                            else if(role=='manager'){
                                str += "<thead class='thead-dark' ><tr style='background-color: skyblue; color: black' ><th>Edit Record</th><th><input class='form-control' type='checkbox' id='header' value='"+project_id+"' name='header' onclick='checker(this.id, this.value)' ></th><th>Date</th><th>GPS Location</th><th>IMEI</th>"; 
                            }
                            
                            /** This Code writes current project question as header
                             *  before writing the responses underneath
                             */
                            result.forEach((q_rs) => {
                                str += "<th>"+ q_rs.question +"</th>";
                            })

                            str += "</tr></thead>";

                            var topmail = "empty";

                            var status="";
                            responses.forEach((r_rs) => {
                                var currentmail = r_rs.usermail;
                                var t_dated = dateFormat(r_rs.dated, 'yyyy-mm-dd HH:MM:ss');
                                var ttarr = r_rs.q_response_time.split('#');

                                var gps="</br><b style='font-style: italic'>GPS Coordinate :</b> "+'<p style="font-style: italic; color: darkgrren">'+r_rs.timer+'</p>';
                                
                                if( r_rs.response_text.includes('.jpg') ){
                                    var answer = '<b style="font-size: 14px"><a href="'+r_rs.response_text+'" target="_blank" >' + r_rs.response_text + '</a></b>'+"</br><strong  style='font-style: italic'>Arrival Time:</strong> "+'<p style="font-style: italic">'+ttarr[0]+'</p>'+" |<strong  style='font-style: italic'> Departure Time: </strong>"+'<p style="font-style: italic">'+ttarr[1]+'</p>'+gps;
                                
                                }
                                else {
                                    var answer = '<b style="font-size: 14px">'+r_rs.response_text+'</b>'+"</br><strong  style='font-style: italic'>Arrival Time:</strong> "+'<p style="font-style: italic">'+ttarr[0]+'</p>'+" |<strong  style='font-style: italic'> Departure Time: </strong>"+'<p style="font-style: italic">'+ttarr[1]+'</p>'+gps;
                                
                                }
                                
                                // var t_dated = dateFormat(r_rs.dated, "yyyy-mm-dd HH:MM:ss");
                                status = r_rs.checker;

                                if(topmail != currentmail) {
                                    if(status==1) {

                                        if(role=='Admin') {
                                            str += "<tr style='font-weight: normal; font-size: 12px' ><td><button class='btn btn-primary' >Edit Rec</button></td><td><input type='checkbox' checked class='rad' id='"+ r_rs.refnos+"' value='"+ r_rs.usermail+"'  name='selected'  onclick='checkersingleton(this.id, this.value)' ></td><td>"+ t_dated +"</td><td>"+ r_rs.location +"</td><td onmouseover='checks(this.name)' name='"+r_rs.imei+"' >"+ r_rs.imei +"</br> <b>User Name:</b>"+r_rs.devicename +"</td><td>"+ answer  +"</td>";
                                        }else if(role=='client'){
                                            str += "<tr style='font-weight: normal; font-size: 12px' ><td>"+ currentmail +"</td><td>"+ r_rs.location +"</td><td>"+ answer +"</td>";
                                        }else if(role=='manager'){
                                            str += "<tr style='font-weight: normal; font-size: 12px' ><td><button class='btn btn-primary' >Edit Rec</button></td><td><input type='checkbox' checked class='rad' id='"+ r_rs.refnos+"' value='"+ r_rs.usermail+"'  name='selected'  onclick='checkersingleton(this.id, this.value)' ></td><td>"+ t_dated +"</td><td>"+ r_rs.location +"</td><td onmouseover='checks(this.name)' name='"+r_rs.imei+"'  >"+ r_rs.imei +"</br> <b>User Name:</b>"+r_rs.devicename +"</td><td>"+ answer +"</td>";
                                        }

                                    }else{

                                        if(role=='Admin'){
                                            str += "<tr style='font-weight: normal; font-size: 12px' ><td><button class='btn btn-primary' id='"+r_rs.usermail+"' onclick=getClickedData(this.id) >Edit Rec</button></td><td><input type='checkbox'  class='rad' id='"+ r_rs.refnos+"' value='"+ r_rs.usermail+"'  name='selected'  onclick='checkersingleton(this.id, this.value)' ></td><td>"+ t_dated +"</td><td>"+ r_rs.location +"</td><td onmouseover='checks(this.name)' name='"+r_rs.imei+"'  >"+ r_rs.imei +"</br> <b>User Name:</b>"+r_rs.devicename +"</td><td>"+ answer +"</td>";
                                        }else if(role=='client'){
                                            str += "<tr style='font-weight: normal; font-size: 12px' ><td>"+ t_dated +"</td><td>"+ r_rs.location +"</td><td>"+ answer +"</td>";
                                        }else if(role=='manager'){
                                            str += "<tr style='font-weight: normal; font-size: 12px' ><td><input type='checkbox'  class='rad' id='"+ r_rs.refnos+"' value='"+ r_rs.usermail+"'  name='selected'  onclick='checkersingleton(this.id, this.value)' ></td><td>"+ t_dated +"</td><td>"+ r_rs.location +"</td><td onmouseover='checks(this.name)' name='"+r_rs.imei+"'  >"+ r_rs.imei +"</br> <b>User Name:</b>"+r_rs.devicename +"</td><td>"+ answer+"</td>";
                                        }

                                    }
                                    
                                }else if(topmail == currentmail) {
                                    str += "<td>"+ answer +"</td>"; 

                                    if(topmail == currentmail){  

                                    }else{

                                        str += "</tr>";    
                                    } 
                                        
                                }
                                topmail = currentmail;

                            });

                            str += "</table>";

                            var outObject ={
                                str: str,
                                counter: counter
                            }

                            res.json(outObject);
                            console.log(str);
                            
                        });
        
                    });
        
                });

            });
            connection.release();

        })

    }); //DB Connection Pool end
});

app.get('/returntofield', (req, res) => {
    var projectid = req.query.projectid
    DataBasepool.getConnection((err, connection) => {
        if(err){
            res.send(err);
            return;
        }

        connection.query("update question_response set view_state = 'field' where project_id = ? and checker = 1", [projectid], (err, result, flds) => {
            if(err) {
                res.send(err);
                return;
            };
            
            connection.query("update question_response set checker = 0 where project_id = ?", [projectid], (err, results, fld) => {
                if(err){
                    res.send(err);
                    return;
                };
            
                res.send('success');
            });
            
        });
        connection.release();
    });
});

app.get('/returntoclient', (req, res) => {
    var projectid = req.query.projectid
    DataBasepool.getConnection((err, connection) => {
        if(err){
            res.send(err);
            return;
        }

        connection.query("update question_response set view_state = 'client' where project_id = ? and checker = 1", [projectid], (err, result, flds) => {
            if(err){
                res.send(err);
                return;
            }

            connection.query("update question_response set checker = 0 where project_id = ?", [projectid], (err, results, fld) => {
                if(err){
                    res.send(err);
                    return;
                };
            
                res.send('success');
            });
            
        });
        connection.release();
    });

});

app.get('/changechecker', (req, res) => {
    var projectid=req.query.project;
    var stat=req.query.stat;

    DataBasepool.getConnection((err, connection) => {
        if(err){
            res.send(err);
            return;
        }

        connection.query("update question_response set checker = ? where project_id = ?", [stat, projectid], (err, result, flds) => {
            if(err){
                res.send(err);
                return;
            }



            
        });
        connection.release();
    });
});

app.get('/changecheckers', (req, res) => {
    var projectid=req.query.project;
    var stat=req.query.stat;
    var ref=req.query.ref;
    var refcode=req.query.refcode;

    DataBasepool.getConnection((err, connection) => {
        if(err){
            res.send(err);
            return;
        }

        connection.query("update question_response set checker = ? where project_id = ? and usermail = ?", [stat, projectid, refcode], (err, result, flds) => {
            if(err){
                res.send(err);
                return;
            }
            
        });
        connection.release();
    });
});


app.get('/_rawresponse', function(req, res){
  var usermail = 'dolaf2007@yahoo.com';
  
  DataBasepool.getConnection(function(err, connection){
    if(err){
        res.send(err.sqlMessage);
        return ;
    }
      connection.query("select refnos, project_title from project where usermail = ?",[usermail], function(err, results, fields){
        if(err){
            res.send(err.sqlMessage);
            return connection.rollback(() => {
                // connection.release();
            })
        }

          // console.log(results);
          // console.log(responses);
          
          res.render('pages/r_response', {
              questions: results, 
              responses: results,
              topmail: 'empty',
              bottommail: 'fadolaftit@yahoo.com',
              project: results
          });

          
      })
      connection.release();
  })
  
})

app.get('/getquestiongraphdata2', function(req, res){
  var questionid = req.query.questionid;
  DataBasepool.getConnection(function(err, connection){
    if(err){
        res.send(err.sqlMessage);
        return;
    }
      var sql = "select q.response_text as label, count(q.response_text) as series from question_response q where question_refnos = ? GROUP BY q.response_text";
      connection.query(sql, [questionid], function(err, results, fields){
        if(err){
            res.send(err.sqlMessage);
            return connection.rollback(() => {
                // connection.release();
            })
        }

          res.send({
              results: results
          });
          // res.send(JSON.stringify(results));
          // res.send(results+"@"+result);

        //   console.log(results.length)
        //   console.log(JSON.stringify(results))
        //   console.log( JSON.stringify(results).length )
 
      })
      connection.release();

  })
})



app.get('/getquestiongraphdata', function(req, res){
  var questionid = req.query.questionid;
  var role = req.query.role;

//   console.log(questionid);
//   console.log(role);
  DataBasepool.getConnection(function(err, connection){
      if(err){
          res.send(err);
          return;
      }

      var sql="";

      if(role=='Admin'){
        sql = "select q.response_text as labels from question_response q where question_refnos = ? GROUP BY q.response_text order by q.response_text";
      }else if(role=='client'){
        sql = "select q.response_text as labels from question_response q where question_refnos = ? and view_state='client' GROUP BY q.response_text order by q.response_text";

      }else if(role=='manager'){
        sql = "select q.response_text as labels from question_response q where question_refnos = ? and view_state='field' GROUP BY q.response_text order by q.response_text";

      }
      
      connection.query(sql, [questionid], function(err, results, fields){
          if(err){
              res.send(err);
              return;
          }
          var lbl = [];
          results.forEach(function(recs){
              lbl.push(recs.labels); 
          })

          // console.log(lbl);

        if(role=='Admin'){
            sql = "select count(q.response_text) as series from question_response q where question_refnos = ? GROUP BY q.response_text";
        }else if(role=='client'){
            sql = "select count(q.response_text) as series from question_response q where question_refnos = ? and view_state = 'client' GROUP BY q.response_text";

        }else if(role=='manager'){
            sql = "select count(q.response_text) as series from question_response q where question_refnos = ? and view_state = 'field' GROUP BY q.response_text";

        }

          connection.query(sql, [questionid], function(err, result, fields){
              if(err){
                  res.send(err);
                  return;
              }
              var seriesval=[];

              result.forEach(function(rec){
                  seriesval.push(rec.series);
                //   seriesval.push(rec.series);
              })
              
              connection.query("select question from questions_tbl where refnos = ?", [questionid], function(err, resp, fields){
                  if(err) {
                      res.send(err);
                      return;
                  }
                  connection.release();

                  var question=[];
                  resp.forEach(function(row){
                      question.push(row.question);
                  })

                  res.send({
                      labels: lbl, 
                      series: seriesval,
                      question: question
                  });
                  
              })
          })
      })
      
  })
})

app.get('/getquestionoptions', function(req, res) {
  var questionId = req.query.questionId;
  var sql = "SELECT * FROM options_tbl WHERE question_id = ? order by refnos";
  DataBasepool.getConnection(function(err, connection){
      if(err){
          res.send(err.sqlMessage);
          return;
      }
      connection.query(sql, [questionId], function(err, result, fields){
          if(err){
              res.send(err.sqlMessage);
              return connection.rollback(function(){
                  connection.release();
              })
          }
          res.send(result);
      })
      connection.release();
  })
})

app.get('/deleteOption', (req, res) => {
    var optionId = req.query.code;
    var questionId = req.query.questionid;
    // console.info(questionId);

    DataBasepool.getConnection(function(err, connection){
        if(err){
            // console.log(err);
            res.send(err.sqlMessage);
            return;
        }

        connection.query('delete from options_tbl where refnos = ?', [optionId], (err, fileds) => {
            if(err){
                res.send(err.sqlMessage);
                return connection.rollback(function(){
                    // connection.release();
                });
            };

            var sql = "SELECT * FROM options_tbl WHERE question_id = ?";
            connection.query(sql, [questionId], function(err, result, fields){
                if(err){
                  //   console.log(err);
                    res.send(err.sqlMessage);
                    return connection.rollback(function(){
                        // connection.release();
                    });
                }

                var recs=0;
                var str = "<table class='table table-hover' >";

                result.forEach(function(row){
                    recs++;
                    str += "<tr><td>" + recs + "</td><td>" + row.response_text + "</td><td><button class'btn btn-primary' id='"+ row.refnos +"' name='"+ row.response_text +"' onclick='deleteOptions(this.id, this.name)' >Delete</button></td></tr>";
                })

                str += "</table>";
       
                console.info(str);
                res.send(str);
                
            });

        });
        connection.release();
      
    });
});

app.get('/getprojectslistforsynch', (req, res) => {
    var user = req.query.user;

    // console.info(user);
    DataBasepool.getConnection( (err, connection) => {
        if(err){
            res.send(err.sqlMessage);
            return;
        }

        var sql = "SELECT * FROM project WHERE usermail = ? ";
        connection.query(sql, [user], (err, result, flds) => {
            if(err)
            {
                res.send(err.sqlMessage);
                return connection.rollback(() => {
                    // connection.release();
                })
            }

            // <label class="switch">
            //         <input type="checkbox" id="mode" data-toggle="tooltip" onclick="switchMode(this.value)">
            //         <span class="slider round"></span>                                    
            //     </label>

            var str = "<table class='table table-responsive' >";
            str = "<tr style='background-color: grey; color: white; font-weight: bolder; font-size: 14px' ><td>S/N</td><td>Project Title</td><td>Start Date</td><td>End Date</td><td>Synch Status</td></tr>";
            var recs=0;
            var status='';
            result.forEach((row) => {
                recs++;
                status = row.status;
                // str += "<tr><td>" + recs + "</td><td>" + row.project_title + "</td><td>" + row.startdate + "</td><td>" + row.enddate + "</td></tr>"; 
                if(status=='ON'){
                    str += "<tr><td>" + recs + "</td><td>" + row.project_title + "</td><td>" + row.startdate + "</td><td>" + row.enddate + "</td><td><input type='radio' id='"+ row.refnos+ "' name='mode' value='"+ row.status +"' checked onclick='switchMode(this.id, this.value)' ></input></td></tr>"; 
                }else if(status=='OFF'){
                    str += "<tr><td>" + recs + "</td><td>" + row.project_title + "</td><td>" + row.startdate + "</td><td>" + row.enddate + "</td><td><input type='radio' id='"+ row.refnos+ "' name='mode' value='"+ row.status +"' onclick='switchMode(this.id, this.value)' ></input></td></tr>"; 
                }
                
                
            })

            str += "</table>";

            res.send(str);
            
        })
        connection.release();

    })
});

app.get('/synchproject', (req, res) => {
    var projectid = req.query.projectid;
    var usermail  = req.query.usermail;

    DataBasepool.getConnection((err, connection) => {
        if(err){
            res.send(err.sqlMessage);
            return;
        }

        connection.query('update project set status ="OFF" where status="ON" and usermail = ? ', [usermail], (err, result) => {
            if(err){
                res.send(err.sqlMessage);
                return connection.rollback(() => {
                    // connection.release();
                })
            }

            connection.query('update project set status ="ON" where refnos = ? ', [projectid], (err, result) => {
                if(err){
                    res.send(err.sqlMessage);
                    return connection.rollback(() => {
                        // connection.release();
                    })
                }

                res.send('success');
                
            })

        })
        connection.release();
    })

})

app.get('/reorderquestions', function(req, res){
  var objectArray = JSON.parse(req.query.objectId);

  DataBasepool.getConnection(function(err, connection){
      if(err){
          res.send(err);
          return;
      }
      var project_id = objectArray[0].projectid;
      var sql = "update questions_tbl set question_no = ? where refnos = ?";

      objectArray.forEach((elm, idx)=>{
          var id=0; var pos=0; var projectid=0;
          id  = objectArray[idx].id;
          pos = objectArray[idx].position;
          projectid = objectArray[idx].projectid;

          connection.query(sql, [pos, id], function(err, result, fields){
              if(err){
                  res.send(err);
                  return;
              }

          })
          
      })
      connection.query("SELECT * FROM questions_tbl WHERE project_id = ? order by question_no", [project_id], function(err, results, fields){
          if(err){
              res.send(err);
              return;
          }

          console.log(results);

          res.send(results);

      })
      connection.release();
      
  })

})

app.post('/deletequestionoptions',urlencodedParser, function(req, res){
  var optionId = req.body.OptionId;
  var questionId = req.body.questionId;

  var sql = "DELETE FROM options_tbl where refnos = ?";
  DataBasepool.getConnection(function(err, connection){
      if(err){
          res.send(err);
          return;
      }
      connection.query(sql, [optionId], function(err, result, fields){
          if(err) {
              res.send(err);
              return;
          }

          connection.query("SELECT * FROM options_tbl WHERE question_id = ?", [questionId], function(err, results, fields){
              if(err){
                  res.send(err);
                  return;
              }

              console.log(results);

              res.send(results);
              

          })

      })
      connection.release();

  })

})



app.get('/getquestions', function(req, res) { 
  var project_id = req.query.projectid; //projectid

  console.log('ProjectCode: '+project_id);

  DataBasepool.getConnection(function(err, connection) {
      if(err){
          res.send(err.sqlMessage);
          return;
      }

      var _Query = "select q.refnos as refnos, q.`project_id` as project_id, q.`question_no` as question_no, q.`question` as question, q.`required` as required, q.`usermail` as usermail, q.`status` as sta, p.`status` as status from project p inner join questions_tbl q ON p.`refnos` = q.`project_id`  where project_id = ? and q.status = 'ON' order by q.question_no";
      connection.query(_Query, [project_id], function(err, results, fields){
          if(err){
              res.send(err.sqlMessage);
              return connection.rollback(function(){
                //   connection.release();
              });
          }                 

          var sql = "SELECT * FROM options_tbl as b WHERE EXISTS( SELECT * FROM questions_tbl as a WHERE b.question_id = a.refnos and a.project_id = ?)";

          connection.query(sql, [project_id], function(err, result, fields){
              if(err){
                  console.log(err);
                  return connection.rollback(function(){
                    //   connection.release();
                  });

              }
              
            //   console.log(results);
            //   console.log(result);
            //   console.log("dee:"+project_id);

              var recs = 0; 
              var status="";
              var str = "<table class='table table-bordered' >";
              str += "<tr style='background-color: grey; color: white; font-size: 16px; font-weight: bolder' ></tr>";
              
              results.forEach(function(row){
                recs++;
                status=row.status;
                str += "<tr id="+ row.refnos +" onclick='clicked(this.id)'><td>"+ recs +"</td><td>"+ row.question +"</td><td><button type='button' class='btn btn-success' tooltip='Add Option to question to be selected by users' id='"+ row.refnos +"' value='"+ row.question +"' onclick='openoptions(this.id, this.value)' >Options</button> </td><td><button type='button' class='btn btn-primary' tooltip='Click to add options condition' value='"+ row.question +"'  id='"+ row.refnos +"' onclick='questionCondition (this.id, this.value)' ><span><i class='fa fa-control' ></i> Condition</span></button></td> <td><button type='button' class='btn btn-danger' tooltip='Click to delete the question' id='"+ row.refnos +"' onclick='deleteQuestion(this.id)' ><span><i class='fa fa-trash-o' ></i>Delete</span></button> </td></tr>";
                // str += "<tr id="+ row.refnos +" onclick='clicked(this.id)'><td>"+ recs +"</td><td>"+ row.question +"</td><td><button type='button' class='btn btn-success' tooltip='Add Option to question to be selected by users' id='"+ row.refnos +"' value='"+ row.question +"' onclick='openoptions(this.id, this.value)' >Options</button> </td><td><button type='button' class='btn btn-primary' tooltip='Click to edit the question' id='"+ row.refnos +"' onclick='editQuestion(this.id)' ><span><i class='fa fa-pencil' ></i> </span></button></td><td><button type='button' class='btn btn-primary' tooltip='Click to add options condition' value='"+ row.question +"'  id='"+ row.refnos +"' onclick='questionCondition (this.id, this.value)' ><span><i class='fa fa-control' ></i> Condition</span></button></td> <td><button type='button' class='btn btn-danger' tooltip='Click to delete the question' id='"+ row.refnos +"' onclick='deleteQuestion(this.id)' ><span><i class='fa fa-trash' ></i></span></button> </td></tr>";
        
              });

              str += "</table>";


            connection.query("select * from questions_tbl where project_id = ?", [project_id], (err, quetionDDL) =>{
                if(err){
                    console.log(err.sqlMessage);
                    res.send(err.sqlMessage);
                    return connection.rollback(function(){
    
                    })
                }

                var val = "<option value='" +0+ "'>"+"Please, Select a question....."+"</option>.....";

                quetionDDL.forEach(function(row) { 
                    val += "<option value='" + row.refnos + "'>";
                    val += row.question;  
                    val += "</option>";
                });

                 
                var var_str = results+ "$" + result + "$" + str + "$" + status + "$" + recs;
        
                var object_Values = {
                    questions: results, 
                    options: result,
                    str: str, 
                    status: status,
                    questtotal: recs, 
                    questDDL: val
                }; 

                res.json(object_Values);
                
            })


              
              
          });
 
      });

      connection.release();

  });
});

app.get('/copyoptions', (req, res) =>{
    var cfrom = req.query.cfrom;
    var cto = req.query.cto;

    console.log(cfrom+":::"+cto);

    DataBasepool.getConnection((err, connection)=>{
        if(err){
            res.send(err);
            return;
        };

        var newquestid, newresptext, newcoltype;

        connection.query("select * from `options_tbl`  where question_id  = ?", [cfrom], (err, result)=>{
            if(err){
                console.log(err)
                res.send(err);
                return;
            };

            result.forEach((recs)=>{
                newresptext= recs.response_text;
                newcoltype = recs.coltype;

                var _Query = "INSERT into options_tbl(question_id, response_text, coltype) values(?, ?, ?)";

                connection.query(_Query, [cto, newresptext, newcoltype], (err, results)=>{
                    if(err){
                        console.log(err)
                        res.send(err);
                        return;
                    };

                })

            });

            connection.query("select * from options_tbl where question_id = ?", [cto], (err, copiedrs, flds)=>{
                if(err){
                    console.log(err)
                    res.send(err);
                    return;
                };

                res.send(copiedrs);

            })

            connection.release();

        })
    })
})

app.get('/setQuestionCondition',  (req, res) => {
    var projectid = req.query.projectid;
    var refid = req.query.questionid;

    console.log(projectid); //26 p 
    console.log(refid); //72 q

    DataBasepool.getConnection((err, connection) => {
        if(err){
            res.send(err);
            return;
        };
        // console.log('REF Id: '+refid)
        connection.query("select question_index from questions_tbl where refnos = ? ", [refid], (err, resu)=>{
            if(err){
                res.send(err);
                return;
            };
            var ans="";

            resu.forEach((rec)=>{
                ans = rec.question_index;
            });

            connection.query("select * from options_tbl o where o.`question_id` = ?", [refid], (err, result, fields) => {
                if(err){
                    res.send(err);
                    return;
                };

                // var qst_qry = "select * from questions_tbl where `refnos` > ? and project_id = ? and question_index > ?";
                var qst_qry = "select * from questions_tbl where `question_index` > ? and project_id = ?";
                connection.query(qst_qry, [ans, projectid], (err, results, flds) => {
                    if(err){
                        console.log(err)
                        res.send(err);
                        return;
                    };

                    var val = "<option value='" +0+ "'>"+"Please, Select a question....."+"</option>.....";

                    results.forEach(function(row) { 
                        val += "<option value='" + row.refnos + "'>";
                        val += row.question;  
                        val += "</option>";
                    });

                    console.log(val)
                    var str = "<table class='table-bordered' > ";

                    var val2 = "<option value='" +0+ "'>"+"Please, Select aquestion....."+"</option>.....";

                    var colType="";
                    var optionId=0;

                    result.forEach(function(row) { 
                        val2 += "<option value='" + row.refnos + "'>";
                        val2 += row.response_text;  
                        val2 += "</option>";
                        colType=row.coltype;
                        optionId=row.refnos;

                    });

                    // console.log(projectid);
                    // console.log(refid);
                    // console.log(val);

                    str += "<thead><tr><td colspan='50' style='text-align: center; font-size: 12px; font-weight: bolder'>Options Conditions Programming.</td></tr></thead>";
                    // str += "<tbody>";
                    var optionRef=0;
                    result.forEach((row) => {
                        optionRef = row.refnos;

                        // val.find( 'option[value="' + optionRef + '"]' ).prop( "selected", true );

                        // setSelectedIndex(val, optionRef);
                        // str += "<tr width='100%'><td style='font-weight: bolder' >If user picks</td><td style='font-weight: bolder'>"+ row.response_text +"</td><td style='font-weight: bolder'>Go to </td><td><select id='"+ row.refnos +"' onchange='getchoice(this.id, this.value)' name='restext' >"+ val +"</select></td></tr>";
                        // str += "<tr width='100%'><td style='font-weight: bolder; text-align: left' >If user picks</td><td style='font-weight: bolder; text-align: left'>"+ row.response_text +"</td><td style='font-weight: bolder; text-align: left'>Go to </td><td><select name='"+ row.refnos +"' onchange='getchoices(this.name, this.value)' id='restext' >"+ val +"</select></td></tr>";
                        str += "<tr width='100%'><td style='font-weight: bolder' >If user picks</td><td style='font-weight: bolder'>"+ row.response_text +"</td><td style='font-weight: bolder'>Go to </td><td><button class='btn btn-primary' id='"+row.gotoquestionid+"' onclick='showquest(this.id)' >Show  Question</button></td><td><select name='"+ row.refnos +"' onchange='getchoices(this.name, this.value)' id='restext' >"+ val +"</select></td></tr>";
                        // setSelectedIndex(document.getElementsByName("restext"), optionRef);
                    });

                    // str += "</tbody>";
                    str += "</table>";

                    var _query="select qs.`refnos`, ot.`response_text`, qt.`question` from `questions_tbl` qt, question_skip_log qs inner join `options_tbl` ot ON qs.`option_id` = ot.`refnos` where qs.`gotoquestion_id` = qt.`refnos` and qs.`question_id`=?";
                    connection.query(_query, [refid], (err, ans)=>{
                        if(err){
                            res.send(err);
                            return;
                        };

                        var responseText = "<table class='table table-hover'>";

                        responseText += "<tr style='background-color: #ffcccc'><td colspan='10'>QUESTIONS SKIP CONDITIONS</td></tr>";
                    
                        var counter=0;
                        ans.forEach((rec) => {
                            counter++;
                            responseText+="<tr><td>"+ counter +"</td><td>"+ rec.response_text +"</td><td>"+ rec.question +"</td></tr>";
                        });

                        responseText+= "</table>";

                        connection.release();
                        // console.log(colType)
                        // console.log(optionId)

                        var outResp={
                            str: str, //
                            question: val, // 
                            options: val2, //
                            questions: results, // 
                            responseText: responseText, //
                            colType: colType, //
                            optionId: optionId, //
                            values : result
                        };

                        res.json(outResp);
                        console.log(outResp)

                        
                    });
                    
                });
        
            });
                
        });
        
    });

});


app.get('/editquestion', (req, res) => {
    var questionid = req.query.questionid;
    console.log('yeahh!!!'+ questionid);
});

app.get('/deletequestion', (req, res) => {
    var questionid = req.query.questionid;
    console.log('Delete yeahh!!!'+ questionid);

    DataBasepool.getConnection((err, connection)=>{
        if(err){
            res.send(err);
            return;
        }
      
        connection.query("delete from questions_tbl where refnos = ?", [questionid], (err, results)=>{
            if(err){
                res.send(err);
                return;
            }
            res.send(results);
            connection.release();            
        })
    });
})

app.get('/newquestion', function(req, res){
    var usermail = req.query.usermail.trim();

    DataBasepool.getConnection(function(err, connection){
      if(err){
          res.send(err);
          return;
      }
      // connection.query("call f_get_response_data()", function (err, result, fields) {
      console.log(usermail);
          
      connection.query("select refnos, project_title from project where usermail = ?", [usermail], function(err, results, fields){
          if(err){
              res.send(err);
              return;
          } 
          
          res.render('pages/questions', {
              questions: results,
              usermail: usermail,
              projects: results

          });
        })
        connection.release();
    })

});

app.get('/createdevice', (req, res) => {
    var user=req.query.user; //owner
    var name=req.query.name;
    var phone=req.query.phone;
    var imei="jjkk";
    var email=req.query.email;
    var access=req.query.access;
    var p="123";
    
    DataBasepool.getConnection((err, connection) => {
        if(err){
            res.send(err);
            return;
        }

        connection.beginTransaction((err) => {
            if(err){
                res.send(err.sqlMessage);
                return connection.rollback(() => {
                        
                })
            }

        
            var sql ="insert into app_users_auth(name, phone_imei, email, phone, master_email) values(?, ?, ?, ?, ?)";
            connection.query(sql, [name, imei, email, phone, user], (err, flds) => {
                if(err){
                    console.log(err)
                    res.send(err.sqlMessage);
                    return connection.rollback(() => {

                    })
                }

                var sql2 = "insert into webusers (fname, usermail, access_level, passkey, phone, ownermail ) values(?, ?, ?, ?, ?, ?)";
                connection.query(sql2, [name, email, access, p, phone, user], (err, flds) => {
                    if(err){
                        console.log(err)
                        res.send(err.sqlMessage);
                        return connection.rollback(() => {
                        
                        })
                    }

                    connection.commit((err) => {
                        if(err){
                            res.send(err.sqlMessage);
                            return connection.rollback(() => {
                        
                            })
                        }

                        var mailogin={

                        }

                        console.log(flds)
                        res.send('success')
                        console.log('ddele')
                
                    })

                })

            

            })
        
        })

        connection.release();
    })
});

app.get('/newclients', (req, res) => {
    console.log('ME: '+req.query.user);
    var user=req.query.user; //owner
    var name=req.query.name;
    var phone=req.query.phone; 
    var email=req.query.email;
    var contact=req.query.contact; 
    console.log('Email: '+email)
    DataBasepool.getConnection((err, connection) => {
        if(err){
            console.log(err);
            res.send(err);
            return;
        }

        connection.beginTransaction((err) => {
            if(err){
                console.log(err);
                res.send(err.sqlMessage);
                return connection.rollback(() => {
                        
                });
            };
        
            var sql2 = "insert into client (description, contact_person, email, phone, owner_email ) values(?, ?, ?, ?, ?)";
            connection.query(sql2, [name, contact, email, phone, user], (err, flds) => {
                if(err){
                    console.log(err)
                    res.send(err.sqlMessage);
                    return connection.rollback(() => {
                    
                    })
                }
                connection.query("select * from client where owner_email=?", [user], (err, result)=>{
                    if(err){
                        console.log(err);
                        res.send(err.sqlMessage);
                        return connection.rollback(() => {
                    
                        })
                    }
                    
                    var xx = 0;
                    var str = "<table class='table table-condensed' >";
                    result.forEach(function(row){
                        xx++;
                        str += "<tr><td>"+ xx +"</td><td>"+ row.description +"</td><td><img src= "+ row.logo +" alt='LOGO' height='20' width='20'></td></tr>";
        
                    });
                    str += "</table>";
        

                    connection.commit((err) => {
                        if(err){
                            console.log(err);
                            res.send(err.sqlMessage);
                            return connection.rollback(() => {
                        
                            })
                        }
    
                        var mailogin={
    
                        }
    
                        console.log(flds)
                        res.send(str)
                        console.log('ddele')
                
                    });
                });
                
            });
            
        });

        connection.release();
    });
});

app.get('/createusers', (req, res) => {
    var user=req.query.user; //owner
    var name=req.query.name;
    var phone=req.query.phone;
    var imei="jjkk";
    var email=req.query.email;
    var access=req.query.access;
    var p=req.query.pass;
    
    DataBasepool.getConnection((err, connection) => {
        if(err){
            res.send(err);
            return;
        }

        connection.beginTransaction((err) => {
            if(err){
                res.send(err.sqlMessage);
                return connection.rollback(() => {
                        
                });
            };
        
            var sql ="insert into app_users_auth(name, phone_imei, email, phone, master_email) values(?, ?, ?, ?, ?)";
            connection.query(sql, [name, imei, name, phone, user], (err, flds) => {
                if(err){
                    console.log(err)
                    res.send(err.sqlMessage);
                    return connection.rollback(() => {

                    })
                }

                var sql2 = "insert into webusers (fname, usermail, access_level, passkey, phone, ownermail ) values(?, ?, ?, ?, ?, ?)";
                connection.query(sql2, [name, name, access, p, phone, user], (err, flds) => {
                    if(err){
                        console.log(err)
                        res.send(err.sqlMessage);
                        return connection.rollback(() => {
                        
                        })
                    }

                    connection.commit((err) => {
                        if(err){
                            res.send(err.sqlMessage);
                            return connection.rollback(() => {
                        
                            })
                        }

                        var mailogin={

                        }

                        console.log(flds)
                        res.send('success')
                        console.log('ddele')
                
                    })

                })

            

            })
        
        })

        connection.release();
    })
});

app.get('/newkpi', (req, res) => {
    var user = req.query.user;
    var kpi = req.query.name;

    console.log(user)
    console.log(kpi)

    DataBasepool.getConnection((err, connection) => {
        if(err){
            console.log(err);
            res.send(err);
            return;
        }

        connection.beginTransaction((err) => {
            if(err){
                console.log(err);
                res.send(err);
                return connection.rollback(() => {

                });
            }

            // var sql = "select * from kpi where ownermail = ?";
            var sql = "insert into kpi (description, ownermail) values(?, ?) ";
            connection.query(sql, [kpi, user], (err, result) => {
                if(err){
                    console.log(err);
                    res.send(err);
                    return;
                }

                sql = "select * from kpi where ownermail = ? order by description";
                connection.query(sql, [user], (err, result) => {
                    if(err){
                        console.log(err);
                        res.send(err);
                        return;
                    }
    
                    connection.release();

                    var str = "<table class='table table-bordered' >";
                    str += "<thead><tr><td colspan='50' style='text-align: center; font-size: 12px; font-weight: bolder'>KPI List</td></tr></thead>";
                    var rec=0;

                    result.forEach((row) => {
                        rec++;
                        str += "<tr><td>"+ rec +"</td><td>"+ row.description +"</td></tr>";
                    });

                    str += "</table>";

                    var outObj = {
                        resp: str
                    }

                    res.json(outObj);
                })
                
            });
    
        });
    });

});

app.get('/kpilist', (req, res) => {
    var user = req.query.user;

    DataBasepool.getConnection((err, connection) => {
        if(err){
            res.send(err);
            return;
        }

        connection.beginTransaction((err) => {
            if(err){
                res.send(err);
                return connection.rollback(() => {

                });
            }

            var sql = "select * from kpi where ownermail = ? order by description";
            // var sql = "select k.`description` as kpi, p.`project_title` as project from project p, kpi k where p.`refnos` = k.`project_id` and ownermail = ? order by k.description";
            connection.query(sql, [user], (err, result) => {
                if(err){
                    res.send(err);
                    return;
                }
                connection.release();

                var str = "<table class='table table-bordered' >";
                str += "<thead><tr><td colspan='50' style='text-align: center; font-size: 12px; font-weight: bolder'>KPI List</td></tr></thead>";
                var rec=0;

                result.forEach((row) => {
                    rec++;
                    str += "<tr><td>"+ rec +"</td><td>"+ row.description +"</td></tr>";
                });

                str += "</table>";

                var outObj = {
                    resp: str
                }

                res.json(outObj);
            });
    
        });
    });
});

app.get('/getoutletcount', (req, res) => {
    var id = req.query.project;

    DataBasepool.getConnection((err, connection) => {
        if(err){
            res.send(err);
            return;
        }
// console.log(id)
        var sql="select count(refnos) as count from outlets where project_id =?";
        connection.query(sql, [id], (err, result) => {
            if(err){
                res.send(err);
                return;
            }
            connection.release();

            var rec=0;

            result.forEach((row)=>{
                rec = row.count;
            });

            var outObj = {
                count: rec
            }
            res.json(outObj);
        })
    })
});

app.get('/kpilist2', (req, res) => {
    var user = req.query.user;
    var project = req.query.outlet;

    DataBasepool.getConnection((err, connection) => {
        if(err){
            res.send(err);
            return;
        }

        connection.beginTransaction((err) => {
            if(err){
                res.send(err);
                return connection.rollback(() => {

                });
            };

            // var sql = "select * from kpi_maps where project_id = ? order by description";
            var sql = "select k.`description` as kpi, p.`project_title` as project from project p, kpi k where p.`refnos` = k.`project_id` and ownermail = ? order by k.description";
            connection.query(sql, [project], (err, result) => {
                if(err){
                    res.send(err);
                    return;
                }
                connection.release();

                var str = "<table class='table table-bordered' >";
                str += "<thead><tr><td colspan='50' style='text-align: center; font-size: 12px; font-weight: bolder'>KPI List</td></tr></thead>";
                var rec=0;

                result.forEach((row) => {
                    rec++;
                    str += "<tr><td>"+ rec +"</td><td>"+ row.kpi +"</td></tr>";
                });

                str += "</table>";

                // var val = "<option value='" +0+ "'>"+"Please, Select Project....."+"</option>.....";

                // result.forEach(function(row) {
                //     val += "<option value='" + row.refnos + "'>";
                //     val += row.description;  
                //     val += "</option>";
                // });

                var outObj = {
                    resp: str
                }

                res.json(outObj);

            });
    
        });
    });
});

app.get('/mapoutlet', (req, res) => {
    // data: "outlet="+outlet+"&owner="+owner+"&auditor="+auditor,

    var outlet=req.query.outlet; //owner
    var owner=req.query.owner;
    var auditor=req.query.auditor;
    
    DataBasepool.getConnection((err, connection) => {
        if(err){
            res.send(err);
            return;
        }

        connection.beginTransaction((err) => {
            if(err){
                res.send(err.sqlMessage);
                return connection.rollback(() => {
                        
                });
            };
        
            var sql ="insert into outlet_mapto_auditor(outletrefnos, device_id, user_id) values(?, ?, ?)";
            connection.query(sql, [outlet, auditor, owner], (err, flds) => {
                if(err){
                    console.log(err)
                    res.send(err.sqlMessage);
                    return connection.rollback(() => {

                    });
                };

                var sql2 = "select * from outlet_mapto_auditor where outletrefnos=?";
                connection.query(sql2, [outlet], (err, result) => {
                    if(err){
                        console.log(err)
                        res.send(err.sqlMessage);
                        return connection.rollback(() => {
                        
                        })
                    }

                    var recs=0;
                    var str = "<table class='table table-bordered'>";
                    str += "<thead><tr><td style='text-align: center; font-size: 16px; font-weight: bold; background-color: #ffcccc' colspan='2'>Supervisors List: <p id='cnts'></p></td></tr></thead>";
                    result.forEach((row) => {
                        recs++;
                        str += "<tr><td>" + recs + "</td><td>" + row.outletrefnos + "</td><td>" + row.device_id + "</td></tr>";

                    });
                    str += "</table>";  

                    connection.commit((err) => {
                        if(err){
                            res.send(err.sqlMessage);
                            return connection.rollback(() => {
                        
                            })
                        }

                        var outObj={
                            msg: 'success',
                            resp: str,
                            count: recs

                        }

                        // console.log(flds)
                        res.json(outObj);
                        // console.log('ddele')
                
                    })

                });

            });
        
        });

        connection.release();
    });


});


app.get('/createsuper', (req, res) => {
    var user=req.query.user; //owner
    var name=req.query.name;
    var phone=req.query.phone;
    var email=req.query.email; 
    
    DataBasepool.getConnection((err, connection) => {
        if(err){
            res.send(err);
            return;
        }

        connection.beginTransaction((err) => {
            if(err){
                res.send(err.sqlMessage);
                return connection.rollback(() => {
                        
                });
            };
        
            var sql ="insert into supervisors(name, email, phone) values(?, ?, ?)";
            connection.query(sql, [name, email, phone], (err, flds) => {
                if(err){
                    console.log(err)
                    res.send(err.sqlMessage);
                    return connection.rollback(() => {

                    })
                }

                var sql2 = "select * from supervisors ";
                connection.query(sql2, (err, result) => {
                    if(err){
                        console.log(err)
                        res.send(err.sqlMessage);
                        return connection.rollback(() => {
                        
                        })
                    }

                    var recs=0;
                    var str = "<table class='table table-bordered'>";
                    str += "<thead><tr><td style='text-align: center; font-size: 16px; font-weight: bold; background-color: #ffcccc' colspan='2'>Supervisors List: <p id='cnts'></p></td></tr></thead>";
                    result.forEach((row) => {
                        recs++;
                        str += "<tr><td>" + recs + "</td><td>" + row.name + "</td></tr>";

                    });
                    str += "</table>";  

                    connection.commit((err) => {
                        if(err){
                            res.send(err.sqlMessage);
                            return connection.rollback(() => {
                        
                            })
                        }

                        var outObj={
                            msg: 'success',
                            resp: str,
                            count: recs

                        }

                        // console.log(flds)
                        res.json(outObj);
                        // console.log('ddele')
                
                    })

                })

            })
        
        })

        connection.release();
    })
});

app.get('/close', (req, res) => {
    // res.sendFile(htmlPath+('/board.html'));
})

app.get('/mapkpi', (req, res) => {
    var owner = req.query.owner;
    var kpi = req.query.kpi;
    var project = req.query.project;

    console.log('owner: '  +owner)
    console.log('kpi: '    +kpi)
    console.log('project: '+project)

    DataBasepool.getConnection((err, connection) => {
        if(err){
            res.send(err);
            return;
        }
        connection.query("insert into kpi_maps(project_id, kpi_id, user_id) values(?, ?, ?)", [project, kpi, owner], (err, fl) => {
            if(err){
                console.log(err)
                res.send(err);
                return;
            };

            var sql = "select k.description as kpi, p.`project_title` as project  from project p, kpi k, kpi_maps m  where p.`refnos` = ? and k.`refnos` = m.kpi_id;";
            // var sql = "select * from  kpi_maps where project_id = ?";

            connection.query(sql, [project], (err, result, flds) => {
                if(err){
                    console.log(err);
                    res.send(err.sqlMessage)
                    return;
                };

                var xx = 0;
                var str = "<table class='table table-condensed' >";
                result.forEach(function(row){
                    xx++;
                    str += "<tr><td>"+ xx +"</td><td>"+ row.kpi +"</td><td>"+ row.project +"</td></tr>";
    
                });

                str += "</table>";
    
                res.send(str);
    
            });
        });
        
    });
});

app.get('/getObjectsBag', (req, res) => {
    var user = req.query.user;
    var project = req.query.project;

    DataBasepool.getConnection((err, connection) => {
        if(err){
            res.send(err);
            return;
        }

        connection.beginTransaction((err) => {
            if(err){
                res.send(err);
                return connection.rollback(() => {

                });
            }

            var sql = "select * from kpi where ownermail = ? order by description";
            // var sql = "select k.`description` as kpi, p.`project_title` as project from project p, kpi k where p.`refnos` = k.`project_id` and ownermail = ? order by k.description";
            connection.query(sql, [user], (err, result) => {
                if(err){
                    res.send(err);
                    return;
                }

                sql = "select * from outlets where project_id=?";
                connection.query(sql, [project], (err, results) => {
                    if(err){
                        res.send(err);
                        return;
                    }

                    sql="select * from device_registration ";
                    connection.query(sql, (err, resu) => {
                        if(err){
                            res.send(err);
                            return;
                        }

                        
                        var val = "<option value='" +0+ "'>"+"Please, Select Project....."+"</option>.....";

                        result.forEach(function(row) {
                            val += "<option value='" + row.refnos + "'>";
                            val += row.description;  
                            val += "</option>";
                        });

                        
                        var val2 = "<option value='" +0+ "'>"+"Please, Select Outlet....."+"</option>.....";

                        results.forEach(function(row) {
                            val2 += "<option value='" + row.refnos + "'>";
                            val2 += row.outletname;  
                            val2 += "</option>";
                        });

                        var val3 = "<option value='" +0+ "'>"+"Please, Select auditor....."+"</option>.....";

                        resu.forEach(function(row) {
                            val3 += "<option value='" + row.refnos + "'>";
                            val3 += row.name;  
                            val3 += "</option>";
                        });

                        connection.commit(()=>{
                            if(err){
                                res.send(err.sqlMessage);
                                return connection.rollback(() => {
                            
                                })
                            }
                            connection.release();


                            var outObj = {
                                resp: val,
                                outlets: val2,
                                auditors: val3
                            }
    
                            res.json(outObj);
    
    
                        })


                        

                    })
                    
                    
                })
                
            });
    
        });
    });

});

app.get('/mapusers', (req, res) => {
    var owner = req.query.owner;
    var user = req.query.user;
    var project = req.query.project;

    DataBasepool.getConnection((err, connection) => {
        if(err) {
            res.send(err);
            return;
        }

        connection.query("update mapusers_project set status = 'OFF' where user_refpt = ? ", [user], (err, resu) => {
            if(err){
                res.send(err);
                return;
            }

            var sql = "insert into mapusers_project(project_id, user_refpt, usermail) values(?, ?, ?)";
            
            connection.query(sql, [project, user, owner], (err, flds) => {
                if(err){
                    res.send(err);
                    return;
                }

                connection.query("update webusers set project_id = ? where refnos = ?", [project, user], (err, fl) => {
                    if(err){
                        res.send(err);
                        return;
                    };
                    connection.query("select m.usermail as user, p.`project_title` as project from project p, mapusers_project m where project_id = ? and p.`refnos` = m.`project_id`", [project], (err, result, flds) => {
                        if(err){
                            res.send(err.sqlMessage)
                            return;
                        };

                        var xx = 0;
                        var str = "<table class='table table-condensed' >";
                        result.forEach(function(row){
                            xx++;
                            str += "<tr><td>"+ xx +"</td><td>"+ row.user +"</td><td>"+ row.project +"</td></tr>";
            
                        });
                        str += "</table>";
            
                        res.send(str);
            
                    });
                });
                
            });

        });

        connection.release();
    });
});

app.get('/getEmail', (req, res) => {
    var ref = req.query.ref;

    DataBasepool.getConnection((err, connection) => {
        if(err){
            res.send(err);
            return;
        }

        var email="";
        var sql = "select usermail from webusers where refnos = ?";
        connection.query(sql, [ref], (err, result, flds) => {
            if(err){
                res.send(err);
                return;
            }

            result.forEach((row) => {
                email = row.usermail;
            });

            var output ={email: email};

            console.log(email)
            console.log(output)
            res.send(output);
            
        });

        connection.release();
    });

});

app.get('/insertquestion', function(req, res) {
    var usermail   = req.query.usermail.trim();
    var project_id = req.query.projectid;
    var question   = req.query.question.trim();
    var position   = req.query.position;
    var required   = req.query.required;

    // console.log("Dele proj: "+req.query.projectid)

    DataBasepool.getConnection(function(err, connection){
        if(err){
            res.send(err);
            return;
        }

        connection.query("select max(question_index) as idx from questions_tbl where project_id = ?", [project_id], (err, idxRS)=>{
            if(err){
                console.log(err)
                res.send(err);
                return;
            };

            var newindex, maxindex;

// console.log(idxRS);

            idxRS.forEach((recs)=>{
                maxindex = recs.idx;

            });

// console.log("Max idx: "+maxindex);
            
            if(!maxindex) { /** arrange the question index here */
                newindex = 0;
            }
            else {
                newindex = maxindex + 1;
            }

            if(maxindex==0) {
                newindex = maxindex + 1;
            }

// console.log('New Index: '+newindex);

            connection.query("insert into questions_tbl(project_id, question_no, question, usermail, required, question_index) values(?, ?, ?, ?, ?, ?) ", [project_id, position, question, usermail, required, newindex], function(err, results, fields){
                if(err){
                    console.log(err)
                    res.send(err);
                    return;
                } 

                var sql = "select q.refnos as refnos, q.`project_id` as project_id, q.`question_no` as question_no, q.`question` as question, q.`required` as required, q.`usermail` as usermail, q.`status` as sta, p.`status` as status from project p inner join questions_tbl q ON p.`refnos` = q.`project_id`  where project_id = ? and q.status = 'ON' order by q.question_no";
                connection.query(sql, [project_id], function(err, result, fields){
                    if(err){
                        console.log(err);
                        return connection.rollback(function(){
                            //   connection.release();
                        });
                    };

                    connection.query("select refnos, project_title from project where usermail = ?", [usermail], function(err, resp, fields){
                        if(err){
                            console.log(err);
                            return connection.rollback(function(){
                                //   connection.release();
                            });
                        };

                        var recs = 0; 
                        
                        var status="";

                        var str = "<table class='table table-bordered' >";
                        str += "<tr style='background-color: grey; color: white; font-size: 16px; font-weight: bolder' ></tr>";
                        
                        // console.log('Recs: '+recs);

                        result.forEach(function(row){
                            recs++;
                            status=row.status;
                            str += "<tr id="+ row.refnos +" onclick='clicked(this.id)'><td>"+ recs +"</td><td>"+ row.question +"</td><td><button type='button' class='btn btn-success' tooltip='Add Option to question to be selected by users' id='"+ row.refnos +"' value='"+ row.question +"' onclick='openoptions(this.id, this.value)' >Options</button> </td><td><button type='button' class='btn btn-primary' tooltip='Click to edit the question' id='"+ row.refnos +"' onclick='editQuestion(this.id)' ><span><i class='fa fa-pencil' ></i>Edit</span></button> </td><td><button type='button' class='btn btn-danger' tooltip='Click to delete the question' id='"+ row.refnos +"' onclick='deleteQuestion(this.id)' ><span><i class='fa fa-trash' ></i>Delete</span></button> </td></tr>";
            
                            // str += "<tr id="+ row.refnos +" onclick='clicked(this.id)'><td>"+ recs +"</td><td>"+ row.question +"</td><td><button type='button' class='btn btn-success' tooltip='Add Option to question to be selected by users' id='"+ row.refnos +"' value='"+ row.question +"' onclick='openoptions(this.id, this.value)' >Options</button> </td></tr>";
                    
                        });
                        
                        str += "</table>";
                    
                        var obj = {
                            questions: str, 
                            options: result
                        };

                        res.send(str);
                    
                    }); 

                }); 

            }); /** insert query */
        })
        connection.release();

    });

});

app.get('/myprojects', function(req, res){
  var usermail = req.query.usermail.trim();
  DataBasepool.getConnection(function(err, connection){
      if(err){
          res.send(err.sqlMessage);
          return;
      }
      // connection.query("call f_get_response_data()", function (err, result, fields) {
    //   console.log(usermail);
          
      connection.query("select refnos, project_title from project where usermail = ?", [usermail], function(err, results, fields){
          if(err){
              res.send(err.sqlMessage);
              return;
          }

          var xx = 0;
          results.forEach(function(row){
              xx++;
          })

          
        //   console.log(results);
        //   console.log(usermail); 
          // res.s
        //   console.log('gbamgba dekun here truly...'+usermail);
          
          res.render('pages/newproject', {
              usermail: usermail,
              projects: results
          });

          
      })
      connection.release();
  
    })


  
});

app.get('/questionoptions', (req, res) => {
    var qid = req.query.qid;

    DataBasepool.getConnection((err, connection)=>{
        if(err){
            res.send(err.sqlMessage);
            return;
        }
        connection.query("select * from `options_tbl` as options where `question_id`=?", [qid], (err, result, fields)=>{
            if(err){
                res.send(err.sqlMessage);
                return;
            };

            connection.release();

            console.log(result.length)
            res.json({options: result});
        });

    });
});

app.get('/insertwaves', (req, res) => {
    var user = req.query.reportparam.user;
    var waves       = req.query.reportparam.waves;

    DataBasepool.getConnection((err, connection) => {
        if(err){
            res.json({error: err});
            return;
        }
        connection.query("delete from wave_tblReporter where usermail = ?", [user], (err, resulted)=>{
            if(err){
                res.json({error: err});
                return;
            }   

            var array=waves.split(',');
            
            for(var x=0; x<array.length; x++){
                connection.query("insert into wave_tblReporter(wavecode, usermail) values(?, ?)", [array[x], user], (err, result)=>{
                    if(err){
                        // res.json({error: err});
                        console.log(err.sqlMessage);
                        // return;
                    }
                    
                })

            }
            res.json({msg: 'done!'})

            connection.release();
        
        })
    });

});


function manageAsync(data, sql) {
 
    // console.log(data);
    // console.log(sql); 

    return new Promise((resolve, reject) => {
        DataBasepool.getConnection((err, connection) => {
            if(err){
                console.log(err);
                reject(err)
                return;
            } 
            connection.query(sql, [data.q_id, data.w_id], (err, result) => {
                if(err) {
                    console.log(err);
                    reject(err)
                    return;
                }
                var lbl         = [];
                var seriesval   = [];
                var question    = [];
                var wave        = [];

                result.forEach((rec) => {
                    lbl.push(rec.labels);
                    seriesval.push(rec.series);
                });

                connection.query("select question from questions_tbl where refnos = ?", [data.q_id], (err, questionRS)=>{
                    if(err){
                        console.log(err);
                        return;
                    }

                    questionRS.forEach((rec)=>{
                        question.push(rec.question);
                    });
                    
                    /** wave into an ARRAY */
                    wave.push(data.w_id);

                    // connection.release();
                    var obj = {
                        labels: lbl,
                        series: seriesval,
                        question: question,
                        // result: result,
                        wave: wave
                    }

                    // console.log(result);
                    outResultArray.push(obj);

                    resolve (obj);

                }); /** end question connection */ 
                
            });

            
        });
    });
        

}

var getwaveResponseData = (q_id, w_code, option) => {
    return new Promise ((resolve, reject)=>{
        DataBasepool.getConnection((err, connection)=>{
            // console.log(option+":::"+w_code)
    
            var query="select q.response_text as labels, count(q.response_text) as series, wavecode from question_response q where question_refnos = ? and wavecode = ? and `response_text` = ? GROUP BY q.response_text order by q.response_text";
            connection.query(query, [q_id, w_code, option], (err, result) => {
                if(err) {
                    console.log(err);
                    reject(err);
                    return;
                }
                // console.log(result);

                var lbl         = [];
                var seriesval   = [];
                var question    = [];
                var wave        = [];
                var counter=0;

                var label, series;
                result.forEach((rec) => {
                    counter++;
                    lbl.push(rec.labels);
                    seriesval.push(rec.series);

                    label = rec.labels;
                    series= rec.series;

                    // lbl.push(w_code);
                    // seriesval.push(rec.series);
                    

                });

                if(counter>0){
                    var obj = {label: label, series: series, wave: w_code}
                    
                }else{
                    var obj = {label: option, series: 0, wave: w_code}
                    
                }
                resolve(obj)
                
                // counter=0;
                // console.log(obj)
                // console.log(seriesval)
                
            }); /**  Put this inside another */
        })
    })

}

function getwaveData2(wavecode, questionid, option){
    return new Promise((resolve)=>{
        DataBasepool.getConnection((err, connection)=>{
            if(err){
                console.log(err.sqlMessage)
                return;
            }
            var sql = "select q.response_text as labels, count(q.response_text) as series, wavecode from question_response q where question_refnos = ? and wavecode = ? and `response_text` = ? GROUP BY q.response_text order by q.response_text";
            connection.query(sql, [questionid, wavecode, option], (err, answerRS)=>{
                if(err){
                    console.log(err);
                    return;
                }
    
                var val=0;
                answerRS.forEach((rows)=>{
                    val = rows.series;
                })
                // console.log(question_id);
                // console.log(wavecode);
                // console.log(current_option);
                // console.log(answerRS);
    
                connection.query("insert into wave_reportHandler (usermail, wavecode, value, name, type, description) values(?, ?, ?, ?, ?, ?)", [user, wavecode, val, current_option, "bar", "Wave" ], (err, insObj)=>{
                    if(err){
                        console.log(err);
                        return;
                    }
                    resolve(answerRS);
    
                })
    
    
            })
    
        })

    })
    
}

 function getwaveData1(userid, optionid, questionid) {
    /** This function gets all the values for each querying waves for each KPI */

    return new promise((resolve) => {
        DataBasepool.getConnection((err, connection) => {
            connection.query("select * from wave_tblReporter where usermail=?", [userid], (err, result)=>{
                if(err){
                    // res.json({error: err});
                    console.log(err)
                    return;
                }
                // console.log(user)
    
                var objX=[];
                var objY=[];
                /** Get each count of option type for each wave that is existing for user */
                /**
                 * This will get each wave value for the current question option
                 */
                result.forEach((row)=>{  
                    wavecode=row.wavecode;
                    // console.log(wavecode)
                    // let data2 =  getwaveData2(wavecode, questionid, optionid);

                    objX.push(data2.wavecode);
                    objY.push(data2.series);

                });

                var outObj={
                    x: objX,
                    y: objY
                }
                resolve(outObj);
                
            });
    
        });   
        
    })
        
}

var getuserwaves = (user) => {
    // return new promise((resolve, reject)=>{
        DataBasepool.getConnection((err, connection)=>{
            if(err) {
                console.log(err);
                reject(err.sqlMessage);
                // return;
            }
    
            connection.query("select * from wave_tblReporter where usermail=?", [user], (err, result)=>{
                if(err){
                    console.log(err.sqlMessage);
                    reject(err.sqlMessage);
                    // return;
                }
                console.log(result);
            })
        })
    // })
    
}

 function wavecomparer(varObj) {
    
    DataBasepool.getConnection((err, connection) => {
        if(err){
            res.json({error: err});
            return;
        }

        connection.query("select * from options_tbl where question_id = ?", [varObj.question], (err, optRS)=>{
            if(err){
                // res.json({error: err});
                console.log(err)
                return;
            }

            var mainXaxis=[];
            var mainYaxis=[];
            var maiObj={}

            // console.log(optRS);
            var current_option="";
            var wavecode=0;
            
            optRS.forEach((rec) => { //options/KPI loop
                current_option = rec.response_text;
                /* This will send each possible question option as a param and get all its values in each wave
                 */

                let usr_waveArr =  getuserwaves(varObj.user); 
                // let wavedata = await getwaveData1(user, current_option, question_id);
                console.log(usr_waveArr);

                
            }) /** option foreach */

            /** A CALL to the report driver table for client */
            // return optRS;
        
        })
    })
    
}

async function getQuestionsPossibleOptions(q_id) {
    return new Promise((resolve, reject)=>{
        DataBasepool.getConnection((err, connection) => {
            if(err) {
                console.log(err);
                return;
            }
    
            var sql = "select * from options_tbl where question_id = ? ";
            
            connection.query(sql, [q_id], (err, result) => {
                if(err) {
                    console.log(err);
                    reject (err);
                }
                connection.release(); 
                resolve (result)
    
            })
    
        })


    })
}

async function getwaveDataforOptions(obj) {

    return new Promise ((resolve, reject)=>{
        
        DataBasepool.getConnection((err, connection) => {
            if(err) {
                console.log(err);
                return;
            }
    
            var q_id = obj.question;
            var w_id = obj.wavecode;
            var o_id = obj.opt;

            // console.log("Question:"+ q_id)
            // console.log("Wave:"+ w_id)
            // console.log("Opt:"+ o_id)
    
            var sql = "select q.response_text as labels, count(q.response_text) as series, wavecode from question_response q where question_refnos = ? and wavecode = ? and q.response_text=? order by q.response_text";
            // var sql = "select q.response_text as labels, count(q.response_text) as series, wavecode from question_response q where question_refnos = ? and wavecode = ? and response_text=? GROUP BY q.response_text order by q.response_text";
            
            connection.query(sql, [q_id, w_id, o_id], (err, result) => {
                if(err) {
                    console.log(err);
                    reject (err);
                }
                connection.release(); 

                var series=0;
                result.forEach((row)=>{
                    series = row.series;

                })
                resolve (series);
    
            })
    
        })

    })
    
}

// function fun1(req, res){
//     return request.get('http://localhost:3000')
//      .catch((err) =>{
//        console.log('found error');
//   }).then((res) =>{
//      console.log('get request returned.');
//   });

/** Wave compare: Legend: wave; series: value: group: possible options */
app.get('/wavescompare', async(req, res) => {
    var project_id  = req.query.project;
    var question_id = req.query.question;
    var waves       = req.query.waves;
    var user       = req.query.user;
 
    var varObj = {
        project: project_id,
        question: question_id,
        waves: waves, 
        user: user
    }

    var w_arr = waves.split(',');
    var mainArray = [];
    
    let wavedata

    /** This loop iterates based on the possible options of the given question 
     *  Query the DB for data based on passed param
     * 
     * 
    */
    let optionsArr = await getQuestionsPossibleOptions(question_id);

    // console.log(optionsArr);
    // console.log(optionsArr.length);

    let trace 
    
    for(var x=0; x<optionsArr.length; x++) {
        let opt = optionsArr[x].response_text;

        // console.log(opt);
        let xAxis = [], yAxis = [];
        var _TRACE_Array;

        for(var k = 0; k < w_arr.length; k++) {
            // console.log(w_arr[k]);
            
            var obj = {
                question: question_id,
                wavecode: w_arr[k],
                opt     : opt
            };
    
            wavedata = await getwaveDataforOptions(obj);
     
            // console.log("wave "+w_arr[k]);
            console.log(wavedata);

            xAxis.push("wave "+w_arr[k]);
            yAxis.push(wavedata);
         }
        /** write new data */
        _TRACE_Array = {
            x: xAxis,
            y: yAxis,
            name: opt,
            type: 'bar'
        }


        
        mainArray.push(_TRACE_Array);

        // console.log(_TRACE_Array)
    
        
    }

    
    // console.log(xAxis);
        console.log(mainArray);

    
    res.json({
        resp: mainArray
    });

    // wavecomparer(varObj);
    
});

app.get('/wavecompareoptionlegend', async(req, res)=>{
    var project_id  = req.query.project;
    var question_id = req.query.question;
    var waves       = req.query.waves;
    var user       = req.query.user;

    // var project_id  = req.query.reportparam.project;
    // var question_id = req.query.reportparam.question;
    // var waves       = req.query.reportparam.waves;
    // var user       = req.query.reportparam.user;

    var varObj = {
        project: project_id,
        question: question_id,
        waves: waves, 
        user: user
    }

    var w_arr = waves.split(',');
    var mainArray = [];
    
    let wavedata

    /** This loop iterates based on the possible options of the given question 
     *  Query the DB for data based on passed param
     * 
     * 
    */
   
    let optionsArr = await getQuestionsPossibleOptions(question_id);

    // console.log(optionsArr);
    // console.log(optionsArr.length);

    let trace 
    
    console.log(w_arr)

    for(var x=0; x<optionsArr.length; x++) {
        let opt = optionsArr[x].response_text;

        // console.log(opt);
        let xAxis = [], yAxis = [];
        var _TRACE_Array;

        for(var k = 0; k < w_arr.length; k++) {
            // console.log(w_arr[k]);
            
            var obj = {
                question: question_id,
                wavecode: w_arr[k],
                opt     : opt
            };
    
            wavedata = await getwaveDataforOptions(obj);
     
            // console.log("wave "+w_arr[k]);
            console.log(wavedata);

            xAxis.push("wave "+w_arr[k]);
            yAxis.push(wavedata);
         }
        /** write new data */
        _TRACE_Array = {
            x: xAxis,
            y: yAxis,
            name: opt,
            type: 'bar'
        }


        
        mainArray.push(_TRACE_Array);

        // console.log(_TRACE_Array)
    
        
    }

    
    // console.log(xAxis);
        console.log(mainArray);

    
    res.json({
        resp: mainArray
    });

    // wavecomparer(varObj);
    
})

app.get('/trackdevice', async (req, res) => {
    console.log('here for MAP Data...');

    DataBasepool.getConnection((err, connection) => {
        if(err){
            console.log(err);
            return;
        }
        var answer="";

        connection.query("select refnos, name, gps from device_registration", async (err, result, fields) => {
            if(err){
                console.log(err);
                return;
            }

            // console.log(result);

            await res.json({result: result});
            answer = result;
            connection.release();

        })

        // console.log(answer)
    })
})

app.get('/getprojectslist', function(req, res) {
    DataBasepool.getConnection(function(err, connection) {
        if(err) {
            // console.log(err);
            res.send(err);
            return;
        }

        var user = req.query.user;
        var role = req.query.role;
        var sql = "";
        
        console.log(role);
        console.log(user);

        if(role==='Admin') {
            sql = "select * from project where usermail = ?";        
        }else if(role==='client') {
            sql = "select p.`refnos`, p.`project_title`  from project p, mapusers_project m where m.usermail = ? and p.`refnos`=m.`project_id`";        
        }else if(role==='manager') {
            sql = "select p.`refnos`, p.`project_title`  from project p, mapusers_project m where m.usermail = ? and p.`refnos`=m.`project_id`";        
        }
        
        connection.query(sql, [user], function(err, result, fields) {
            if(err){
                console.log(err.sqlMessage);
                res.send(err.sqlMessage);
                return connection.rollback(function(){

                })
            }
            connection.release();

            var val = "<option value='" +0+ "'>"+"Please, Select Project....."+"</option>.....";

            result.forEach(function(row) {
                val += "<option value='" + row.refnos + "'>";
                val += row.project_title;  
                val += "</option>";
            });

            console.log(val)

            res.send(val); 
           
        });
        
        
    });

});

app.get('/newoutlet', (req, res) => {
    //data: "user="+user+"&project="+project + "&name="+name+"&owner="+owner+"&code="+code+"&address="+add+"&lm="+lm+
    //"&email="+email+"&phone="+phone+"&rep="+rep+"&state="+state
    
    var user   = req.query.user;
    var project = req.query.project;
    var name   = req.query.name;
    var owner   = req.query.owner;
    var code    = req.query.code;
    var address    = req.query.address;
    var lm    = req.query.lm;
    var email    = req.query.email;
    var phone    = req.query.phone;
    var rep    = req.query.rep;
    var state    = req.query.state;

    // console.log(req.query.project)

    DataBasepool.getConnection(function(err, connection){
        if(err){
            res.send(err);
            return;
        }
          
        var sql = "insert into outlets(outletname, custname, address, code, landmark, phone, nameofrep, ownermail, project_id) values(?, ?, ?, ?, ?, ?, ?, ?, ?) ";
        connection.query(sql, [name, owner, address, code, lm, phone, rep, user, project], function(err, results, fields){
            if(err){
                res.send(err);
                return;
            } 
            connection.query("select count(refnos) as count from outlets where ownermail = ? and project_id = ?", [user, project], function(err, resp, fields){
                if(err){
                    console.log(err);
                    return connection.rollback(function(){
                        //   connection.release();
                    });
                };

                var recs = 0; 
                
                var status="";

                resp.forEach(function(row){
                    recs = row.count;
                   
                });
                 
                var obj = { 
                    count: recs
                };

                res.json(obj);
                
            }); 
 

        });

        connection.release();

    });


});

app.get('/getuserslist', function(req, res){

    DataBasepool.getConnection(function(err, connection){
        if(err){
            // console.log(err);
            res.send(err);
            return;
        }

        var user = req.query.user;

        // var sql = "select * from app_users_auth";
        var sql = "select * from webusers where ownermail = ? and access_level !='Admin' ";
        connection.query(sql, [user], function(err, result, fields){
            if(err){
                console.log(err);
                res.send(err);
                return connection.rollback(function(){
                    connection.release();
                })
            }

            var val = "<option value='" +0+ "'>"+"Please, Select a User....."+"</option>.....";

            result.forEach(function(row) { 
                val += "<option value='" + row.refnos + "'>";
                val += row.fname + "     =>     " + row.access_level ;  
                val += "</option>";
            });   

            
            res.send(val);                
        });
        
        connection.release();
    })

});

app.get('/getbas', (req, res) => {
    var ref = req. query.ref;
    DataBasepool.getConnection((err, connection) => {
        if(err){
            res.send(err.sqlMessage)
            return;
        }

        connection.query("select w.refnos, w.fname, w.phone, m.refnos, m.`project_id` from webusers w, mapusers_project m where w.refnos=m.`user_refpt` and m.`project_id`=?", [ref], (err, result, flds) => {
            if(err){
                res.send(err.sqlMessage)
                return;
            };

            var xx = 0;
            var str = "<table class='table table-condensed' >";
            result.forEach(function(row){
                xx++;
                str += "<tr><td>"+ xx +"</td><td>"+ row.fname +"</td><td>"+ row.phone +"</td></tr>";

            });
            str += "</table>";

            res.send(str);

        });
        connection.release();
    });
});

app.get('/newproject', urlencodedParser, function(req, res){
  var usermail = (req.query.usermail).trim();
  var title    = (req.query.title).trim();    
  var sdate    = req.query.sdate; 
  var edate    = req.query.edate;    
  var reason   = (req.query.reason).trim();
  var client   = req.query.client;
  
  DataBasepool.getConnection(function(err, connection){
      if(err){
          res.send(err.sqlMessage)
          return;
      }
    //   console.log(usermail);
          
      connection.query("insert into project(project_title, usermail, startdate, enddate, reason, client_id) values(?, ?, ?, ?, ?, ?) ", [title, usermail, sdate, edate, reason, client], function(err, result, fields){
          if(err){
            //   console.log(err);
              res.send(err.sqlMessage);
              return connection.rollback(function(){
                //   connection.release();
              })

          } 

          connection.query("select refnos, project_title from project where usermail = ? order by refnos", [usermail], function(err, results, fields){
            if(err){
                // console.log(err);
                res.send(err.sqlMessage);
                return connection.rollback(function(){
                    // connection.release();
                })
            } 
  
              var xx = 0;
              var str = "<table class='table table-condensed' >";
              results.forEach(function(row){
                  xx++;
                  str += "<tr><td>"+ xx +"</td><td>"+ row.project_title +"</td></tr>";

              });
              str += "</table>";
               
              res.send(str);
              
          });

      });
      connection.release();
  });

})

app.get('/rawresponse', function(req, res){
  var project_id = 1; // req.body.project;
  var usermail = (req.query.usermail).trim(); //'dolaf2007@yahoo.com';

//   console.log("Gotten: "+usermail );

  DataBasepool.getConnection(function(err, connection){
      if(err){
          res.send(err.sqlMessage);
          return;
      }
      // connection.query("call f_get_response_data()", function (err, result, fields) {
    //   console.log(usermail);
          
      connection.query("select refnos, project_title from project where usermail = ?", [usermail], function(err, results, fields){
          if(err){
              res.send(err.sqlMessage);
              return;
          }

          var xx = 0;
          results.forEach(function(row){
              xx++;
          })

        //   console.log(xx);
        //   console.log(results);
        //   console.log(usermail);
        //   console.log(usermail.trim());
          
          // res.s
          res.render('pages/r_response', {
              questions: results, 
              responses: results,
              topmail: 'empty',
              bottommail: 'fadolaftit@yahoo.com',
              project: results
          });

          
      });
      connection.release();
  })
})

app.get('/optns', function(req, res) {
  var questionid = req.query.questionid;

//   console.log(questionid)
  DataBasepool.getConnection(function(err, connection) {
      if(err){
          res.send(err.sqlMessage);
          return;
      }
      
      var sql = "select * from options_tbl where question_id = ?"
      
      connection.query(sql, [questionid], function(err, result, fields) {
          if(err){
              res.send(err.sqlMessage);
              return;
          }
        //   console.log(result)

          res.send(result);

          
      })
      connection.release();    
  })


})

app.get('/getQuestionNumber', function(req, res){

  var questionId = req.query.questionId;
//   console.log(questionId)
  DataBasepool.getConnection(function(err, connection){
      if(err){
          res.send(err.sqlMessage);
          return;
      }
      
      var sql = "select question_no from questions_tbl where refnos = ?"
      
      connection.query(sql, [questionId], function(err, result, fields){
          if(err){
              res.send(err.sqlMessage);
              return;
          }
        //   console.log(result)

          res.send(result);

          
      })
      connection.release();
  })
})

app.get('/updatecondition', function(req, res) { 

    var optionid = req.query.option;
    var gotoquestion = req.query.gotoquestion; 

// console.log("OptionId: "+optionid)
// console.log("Go to Quest: "+gotoquestion)
// console.log("Go to Quest 2: "+gotoquestion);

    DataBasepool.getConnection(function(err, connection) {
        if(err) {
            console.log(err);
            res.send(err.sqlMessage);
            return;
        }

        connection.query("select question_index from questions_tbl where refnos = ?", [gotoquestion], (err, idxRS) => {
            if(err) {
                console.log(err);
                res.send(err.sqlMessage);
                return connection.rollback(function() {
                    // connection.release();
                });
            };

            var question_idx = 0;

            idxRS.forEach((row) => {
                question_idx = row.question_index;

            });

            // console.log("q index: "+question_idx)
        
            //endeavour to identify the sending or coming from question 
            var sql = "update options_tbl set gotoquestionid = ?  where refnos = ?"; 
            
            connection.query(sql, [question_idx, optionid], function(err, result){
                if(err) {
                    console.log(err)
                    res.send(err.sqlMessage);
                    return connection.rollback(function(){
                        // connection.release();
                    })
                }
                // console.log('Implemented successfully...');

                var answer = "Implemented successfully...";

                //fieldCount,affectedRows,insertId,serverStatus,warningCount,message,protocol41,changedRows
                // console.log("Inserted rec: "+result.affectedRows);
                // console.log("Inserted rec: "+result.fieldCount);
                // console.log("Inserted rec: "+result.insertId);
                // console.log("Inserted rec: "+result.serverStatus);
                // console.log("Inserted rec: "+result.warningCount);
                // console.log("Inserted rec: "+result.message);
                // console.log("Inserted rec: "+result.protocol41);
                // console.log("Inserted rec: "+result.changedRows);
                
                res.send(answer);

            });
        })
        connection.release();
    });

});

app.post('/deletequestioncondition', urlencodedParser, function(req, res){
  var referencenumber = req.body.referencenumber; 
//   console.log('The code: '+referencenumber);

  DataBasepool.getConnection(function(err, connection){
      if(err){
          res.send(err);
          return;
      }
      var sql = "delete FROM question_conditions where refnos = ?"; 
      connection.query(sql, [referencenumber], function(err, result, fields){
          if(err){
            //   console.log(err);
              res.send(err)
              return;
          } 
          var dataObj;
          var qid, gotoid; 
           
          res.send(result);


      })
      connection.release();

  })

})

app.get('/getquestioncondition', function(req, res){ 
  
  var questionId = req.query.questionId; 
  var responseId = req.query.responseId; 

  DataBasepool.getConnection(function(err, connection){
      if(err){
          res.send(err);
          return;
      }
      var sql = "select qc.refnos, qc.question_id, qc.response_id, qc.`goto`, ot.response_text as selectedoption,  qt.question as focusquestion FROM question_conditions qc INNER JOIN questions_tbl qt ON qt.refnos = qc.goto INNER JOIN options_tbl ot ON ot.refnos = qc.response_id   where qc.question_id = ? and qc.response_id = ?"; 
      // var sql = "select * FROM question_conditions where response_id = ? and question_id = ?";
    //   console.log(questionId)
    //   console.log(responseId)
      connection.query(sql, [questionId, responseId], function(err, result, fields){
          if(err){
            //   console.log(err);
              res.send(err)
              return;
          } 
          var dataObj;
          var qid, gotoid; 
           
          res.send(result);
      
      })
      connection.release();

  })

})

app.get('/graphresponse', function(req, res){
  var project_id = 1; // req.body.project;
  var usermail = (req.query.usermail).trim(); //'dolaf2007@yahoo.com';

//   console.log("Gotten for Graph: "+usermail );

  DataBasepool.getConnection(function(err, connection){
      if(err){
          res.send(err.sqlMessage);
          return;
      }
      // connection.query("call f_get_response_data()", function (err, result, fields) {
    //   console.log(usermail);
          
      connection.query("select refnos, project_title from project where usermail = ?", [usermail], function(err, results, fields){
          if(err){
              res.send(err.sqlMessage);
              return;
          }

          var xx = 0;
          results.forEach(function(row){
              xx++;
          }) 

          // var sql = "SELECT b.refnos, b.project_id, b.question_no, b.question FROM questions_tbl as b SELECT * FROM project as a WHERE b.project_id = a.refnos and a.usermail = 'delafsolutions@gmail.com' )""

          var sql = "SELECT * FROM questions_tbl as b WHERE EXISTS( SELECT * FROM project as a WHERE b.project_id = a.refnos and a.usermail = ? )";

          connection.query(sql, [usermail], function(err, questions, fields){
              if(err){
                  res.send(err.sqlMessage);
                  return;
              }
              
              console.log(questions)

              res.render('pages/r_graph', {
                  projects: results, //project
                  questions: questions,
                  topmail: 'empty',
                  bottommail: 'fadolaftit@yahoo.com',
                  project: results
              });

      
          })
          
      })
      connection.release(); 

  })
})


app.get('/savechoice', function(req, res){
    var questionid = req.query.questionid;
    var choice = req.query.choice;
    var type = req.query.type;
    var url = req.query.url;

    DataBasepool.getConnection(function(err, connection){
        if(err){
            // console.log(err);
            res.send(err);
            return;
        };
          
        var sql = "insert into options_tbl(question_id, response_text, coltype, optionURL) values(?, ?, ?, ?)"
        
        connection.query(sql, [questionid, choice, type, url], function(err, results, fields){
            if(err){
                // console.log(err);
                res.send(err);
                return connection.rollback(function(){
                    // connection.release();
                });
            };
            
            connection.query("select * from options_tbl where question_id = ?", [questionid], function(err, result, fields){
                if(err){
                    // console.log(err);
                    res.send(err);
                    return connection.rollback(function(){
                        // connection.release();
                    });
                };
                
                // console.log('dele')

                res.send(result);

                
            })

        })
        connection.release();    
    })
});

app.get('/userslist', (req, res) => {
    DataBasepool.getConnection((err, connection) => {
        if(err){
            res.send(err);
            return;
        }
        // var user = req.query.user;

        var sql = "select * from webusers ";
        connection.query(sql, (err, result, flds) => {
            if(err){
                res.send(err);
                return;
            }

            var recs=0;
            var str = "<table class='table table-bordered'>";
            str += "<thead><tr><td style='text-align: center; font-size: 16px; font-weight: bold; background-color: #ffcccc' colspan='2'>User List</td></tr></thead>";
            result.forEach((row) => {
                recs++;
                str += "<tr><td>" + recs + "</td><td>" + row.usermail + "</td></tr>";

            })

            res.send(str);
        })

        connection.release();
    })

});

app.get('/supervisorlist', (req, res) => {
    DataBasepool.getConnection((err, connection) => {
        if(err){
            res.send(err);
            return;
        }

        var user = req.query.user;

        var sql = "select * from supervisors ";
        connection.query(sql, (err, result, flds) => {
            if(err){
                res.send(err);
                return;
            }

            var recs=0;
            var str = "<table class='table table-bordered'>";
            str += "<thead><tr><td style='text-align: center; font-size: 16px; font-weight: bold; background-color: #ffcccc' colspan='2'>Supervisors List</td></tr></thead>";
            result.forEach((row) => {
                recs++;
                str += "<tr><td>" + recs + "</td><td>" + row.name + "</td></tr>";

            });

            str += "</table>";

            
            res.send(str);
        })

        connection.release();
    })

});

app.get('/clientslist', (req, res) => {
    var user = req.query.user;

    console.log('User: '+user)

    DataBasepool.getConnection((err, connection) => {
        if(err){
            res.send(err);
            return;
        }

        var sql = "select * from client where owner_email = ? ";
        connection.query(sql, [user], (err, result, flds) => {
            if(err){
                console.log(err)
                res.send(err);
                return;
            }

            var recs=0;
            var str = "<table class='table table-bordered'>";
            str += "<thead><tr><td style='text-align: center; font-size: 16px; font-weight: bold; background-color: #ffcccc' colspan='2'>Clients List</td></tr></thead>";
            result.forEach((row) => {
                recs++;
                str += "<tr><td>"+ recs +"</td><td>"+ row.description +"</td><td><img src= "+ row.logo +" alt='LOGO' height='20' width='20'></td></tr>";
            });
            console.log(str)

            res.send(str);
        });

        connection.release();
    });

});

app.get('/userinfo', (req, res) => {
    var user = req.query.user;
    var pass = req.query.pass;

    console.log(user+":::"+pass)

    DataBasepool.getConnection((err, connection) => {
        if(err){
            console.log(err)
            res.send(err);
            return;
        }

        connection.query("select * from webusers where usermail = ? and passkey = ? and status='ACTIVE' ", [user, pass], (err, result, fields) => {
            if(err){
                console.log(err)
                res.send(err);
                return;
            }

            var name="", roleId="", userId="";

            result.forEach((row) => {
                name = row.fname + " " + row.lname;
                roleId = row.access_level;
                userId = row.usermail;

            });

            var outObject = {
                name: name,
                roleId: roleId,
                userId: userId
            };

            res.send(outObject);
        });

        connection.release();

    });

});
 
app.get('/boarddata', (req, res) => {

    var sql = "select count(refnos) as device_count from device_registration";
    DataBasepool.getConnection((err, connection)=>{
        if (err){
            res.send(err.sqlMessage);
            return;
        }

        var device_cnt=0;
        connection.query(sql, (err, deviceRS, flds) => {
            if (err){
                res.send(err.sqlMessage);
                return;
            }
             
            deviceRS.forEach((row) => {
                device_cnt=row.device_count;

            })
            connection.release();

            var outObject = {
                device:device_cnt
            };
            res.json(outObject);



        }); /**end of device count */


          

    })

})

app.post('/menu', urlencodedParser, function(req, res){  
  var user = req.body.username;
  var pass = req.body.password;
  var valuestr="empty"
  //  console.log(user);
  //  console.log(pass);

  DataBasepool.getConnection(function(err, connection){
    if (err){
      res.send(err.sqlMessage);
      return;
    }
    
    connection.query("select * from webusers where usermail = ? AND passkey = ?", [user, pass], function (err, result, fields) {
      if (err){
        res.send(err);
        return connection.rollback(function(){
        //   connection.release();
        })
      }
      // console.log(result)            

      result.forEach(function(row) { 
        valuestr = row.FullName; 
      });  
      // console.log(valuestr)
      if(valuestr=='empty'){
        res.sendFile(htmlPath+'/404.html')  
      }else{
        // res.render('board.html',{user: user, password: user});

        console.log(htmlPath)
        res.sendFile(htmlPath+'/board.html');
      }
      //socket.emit('tracked', result)
      // return result
    });
    connection.release()

  })

});

app.get('/getprojects', function(req, res){ 
  var user = req.query.user; 
  var role = req.query.role;

  console.log(user)
  console.log(role)
  DataBasepool.getConnection(function(err, connection){
    if(err){
      res.send(err.sqlMessage);
      return;
    }

    var sql="";

    if(role=='Admin'){
        sql = "select * from project where usermail = ? order by status desc";
    }else{
        sql = "select * from project where usermail = ? order by status desc";
    }
    

    connection.query(sql, [user], function(err, result, fields){
      if(err){
        res.send(err);
        return connection.rollback(function(){
        //   connection.release();
        })
      }

      var recs = 0; 
      var status="";
      var str = "<table class='table table-bordered' >";
      str += "<tr style='background-color: grey; color: white; font-size: 16px; font-weight: bolder' ></tr>";
      result.forEach(function(row){
        recs++;
        status = row.status;
        if(status=='ON'){
          status='ON'; 
        }else if(status=='OFF'){
          status='OFF';
        }
        str += "<tr id="+ row.refnos +" onclick='clicked(this.id)'><td>"+ recs +"</td><td>"+ row.project_title +"</td><td>"+ status +"</td></tr>";

      });

      str += "</table>";

      var RespTotal = 0;
      var questTotal = 0;
      var deviceTotal = 0;
      var superTotal = 0;
      var projTotal = recs;

       sql = "select count(DISTINCT usermail) as counted from `question_response`";
        connection.query(sql, (err, result, flds) => {
            if(err){
                console.log(err);
                return err.sqlMessage;
            }
            
            result.forEach((row) => {
                projTotal = row.counted;
            });

            var sql = "select count(DISTINCT usermail) as counted from `question_response`";
            connection.query(sql, (err, result, flds) => {
                if(err){
                    console.log(err);
                    return err.sqlMessage;
                }
                
                result.forEach((row) => {
                    RespTotal = row.counted;
                });

                var sql = "select count( refnos )  as counted from `questions_tbl`;";
                connection.query(sql, (err, result, flds)=>{
                    if(err){
                        console.log(err);
                        return err.sqlMessage;
                    }
                    
                    result.forEach((row)=>{
                        questTotal = row.counted;
                    })
                    
                    var sql = "select count( imei )  as counted from `device_registration`";
                    connection.query(sql, (err, result, flds)=>{
                        if(err){
                            console.log(err);
                            return err.sqlMessage;
                        }
                        
                        result.forEach((row)=>{
                            deviceTotal = row.counted;
                        });

                        var sql = "select count( refnos )  as counted from `supervisors`";
                        connection.query(sql, (err, result, flds)=>{
                            if(err){
                                console.log(err);
                                return err.sqlMessage;
                            }
                            
                            result.forEach((row)=>{
                                superTotal = row.counted;
                            })
                            connection.release();
 
                            var resObject = {
                                str: str,
                                projTotal: projTotal,
                                RespTotal: RespTotal,
                                questTotal: questTotal,
                                deviceTotal: deviceTotal,
                                superTotal: superTotal,
                      
                            };
                      
                            console.log(resObject)
                            res.json(resObject);

                        });
                    });
 
                });

                // console.log('RES: '+ counts)

            });
            
        })

    //   var projTotal = getProjectTotals();
    //   var RespTotal = getTotalResponses();
    //   var questTotal = getTotalQuestions();
    //   var deviceTotal = getTotalInterviewers();
      var superTotal = getTotalSupervisors();

    //   var gpsoffTotal = 
    //   var netoffTotal =   

    //   

      


    })
    

  }) 
  
})

app.get('/updateprojectwave', (req, res) => {
    DataBasepool.getConnection((err, connection) => {
        if(err) {
            res.json({error: err});
            return;
        }

        connection.query("update project set current_wave = ? where refnos = ?", [req.query.newwave, req.query.project], (err, result) => {
            if(err) {
                res.json({error: err});
                return;
            }
            connection.release();
            res.json({error: 'success'});
            
        })
          
    })
})

app.get('/getproject', function(req, res) { 
  var user = req.query.user; 
  DataBasepool.getConnection(function(err, connection){
    if(err){
      res.send(err);
      return;
    }

    var sql = "select * from project where usermail = ? order by status desc";
    connection.query(sql, [user], function(err, result, fields){
        if(err){
            res.send(err);
            return connection.rollback(function(){
            //   connection.release();
            })
        }

        connection.query('select * from client',  (err, results, flds) => {
            if(err){
                res.send(err);
                return connection.rollback(function(){
                //   connection.release();
                })
            }
            connection.release();
            var val = "<option value='" +0+ "'>"+"Select a Client form the list"+"</option>.....";    
            results.forEach(function(row) { 
                val += "<option value='" + row.refnos + "'>";
                val += row.description;  
                val += "</option>";
            })

            var recs = 0; 
            var status="";
            var str = "<table class='table table-bordered' >";
            str += "<tr style='background-color: grey; color: white; font-size: 16px; font-weight: bolder' ><td>S/N</td><td>TITLE</td><td>WAVE #</td><td>Delete</td></tr>";
            result.forEach(function(row){
                recs++;
                status = row.status;
                if(status=='ON'){
                status='ON'; 
                }else if(status=='OFF'){
                status='OFF';
                }
                str += "<tr id="+ row.refnos +" onclick='clicked(this.id)'><td>"+ recs +"</td><td  >"+ row.project_title +"</td><td><input type='number' id='"+ row.refnos +"' onblur='wavechanger(this.id, this.value)' value='"+ row.current_wave +"' ></td><td><button type='button' id='"+ row.refnos +"' class='btn btn-primary' onclick='deleteproject(this.id)' ><i class='fa fa-trash' ></i></button></td></tr>";

            })

            str += "</table>";



            
            res.json({str: str, val: val});

        })


    })
    
  }) 
  
});

app.get('/gettickets', (req, res) => {
    var user = req.query.user;
    DataBasepool.getConnection((err, connection) => {
        if(err){
            res.send(err);
            return;
        }

        var sql = "select * from tickets where usermail = ? and status != 9 order by refnos desc";
        connection.query(sql, [user], (err, result, fields) => {
            if(err){
                res.send(err.sqlMessage);
                return;
            }

            var str = "<table class='table table-hover' style='margin-top: 0px'>";
            
            var recs=0;
            var st=0; 
            var status="";


            result.forEach((row) => {
                recs++;
                st = row.status;
                if(st==0){
                    status = "waiting for agent";
                }
                else if(st==1){
                    status = "waiting for client";
                }
                str += "<tr style='font-size: 12px' ><td>"+ row.title +"</td><td>"+ status +"</td></tr>";
            })
            
            str += "</table>";

            res.send(str);


        });

        connection.release();
    })
});

app.get('/insertticket', (request, response) => {
    var priority    = request.query.priority;
    var title    = request.query.title;
    var message  = request.query.message;
    var usermail = request.query.usermail;

    console.log(title)
    DataBasepool.getConnection((err, connection) => {
        if(err){
            response.send(err.sqlMessage);
            return;
        }

        var sql = "insert into tickets(title, usermail, priority) values(?, ?, ?)";
        connection.query(sql, [title, usermail, priority], (err, results) => {
            if(err){
                response.send(err.sqlMessage);
                return;
            }

            var ticketId = results.insertId; 

            connection.query("insert into ticket_message(ticketpt, message, usermail) values(?, ?, ?)", [ticketId, message, usermail], (err, flds) => {
                if(err){
                    response.send(err.sqlMessage);
                    return;
                }

                connection.query("select * from tickets where usermail = ? and status != 9 order by refnos desc", [usermail], (err, result, fields) => {
                    if(err){
                        response.send(err.sqlMessage);
                        return;
                    }
                    var str = "<table class='table table-hover'>";
            
                    var recs=0;
                    var st=0; 
                    var status="";

                    result.forEach((row) => {
                        recs++;
                        st = row.status;
                        if(st==0)
                        {
                            status = "waiting for agent";
                        }
                        else if(st==1)
                        {
                            status = "waiting for client";
                        }
                        str += "<tr style='font-size: 12px' ><a href=''><td>"+ row.title +"</td><td>"+ status +"</td></a></tr>";
                    });
                    
                    str += "</table>";

                    response.send(str);


                })

            })

        });

        connection.release();
    })

})

app.get('/surveycontact', (req, res) => {
    console.log('Dele');
    
    var name    = req.query.name;
    var email   = req.query.email;
    var phone   = req.query.phone;
    var subject = req.query.subject;
    var message = req.query.message;
  
    DataBasepool.getConnection(function(err, connection){
        if(err){
            res.send(err);
          //   connection.release();
            return;
        }
  
        var sql = "insert into clients(name, email, telephone, subject, message) values(?, ?, ?, ?, ?)";
        connection.query(sql, [name, email, phone, subject, message], function(err, fields){
            if(err){
                res.send(err.sqlMessage);
              //   connection.release();
                return;
            }
  
            //Send a mail to the given email address
            fields.insertId;
            fields.ro
  
            var mailObject = {
                flag: 'welcome',
                recipient: email,
                name: name
            };

            // mailer(mailObject);
  
            res.send('success');
            
        });
        connection.release(); 
  
    });
  
});


app.get('/clientdata', function(req, res) {
  console.log('Dele');

  var name = req.query.name;
  var email = req.query.email;
  var phone = req.query.phone;
  var subject = req.query.subject;
  var message = req.query.message;
 

  DataBasepool.getConnection(function(err, connection){
      if(err){
          res.send(err);
        //   connection.release();
          return;
      }

      var sql = "insert into clients(name, email, telephone, subject, message) values(?, ?, ?, ?, ?)";
      connection.query(sql, [name, email, phone, subject, message], function(err, fields){
          if(err){
              res.send(err.sqlMessage);
            //   connection.release();
              return;
          }

          //Send a mail to the given email address

          var mailObject = {
              flag: 'welcome',
              recipient: email,
              name: name
          }
          mailer(mailObject);


          res.send('success');
          
      });
      connection.release(); 

  });

});

app.get('/getprices', (req, res) => {
    console.log('I am here...')
})

app.get('/projects', (request, response) => {
    var usermail = request.query.usermail;
    console.log(usermail)
    DataBasepool.getConnection((err, connection) => {
        if(err){
            response.send(err.sqlMessage);
            return;
        }

        var sql = "select * from project where usermail = ?";
        connection.query(sql, [usermail], (err, result, fields) => {
            if(err){
                response.send(err.sqlMessage);
                return;
            }
            var val = "<option value='" +0+ "'>"+"Select a Project form the list"+"</option>.....";    
            result.forEach(function(row) { 
                val += "<option value='" + row.refnos + "'>";
                val += row.project_title;  
                val += "</option>";
            });

            var outObj = {
                project: val
            }

            // console.log(outObj);
            response.send(val);
            // connection.release();
        });
        connection.release();
    });

    // console.log('here now...')
})

app.get('/resetdevice', (req, res)=>{
    var imei = req.query.imei


    DataBasepool.getConnection(()=>{
        if(err){
            res.json({resp: "error", result: err});
            return
        }

        connection.query("delete from device_registration where imei = ?", [imei], (err, result)=>{
            if(err){
                res.json({resp: "error", result: err});
                return
            }
            connection.release()

            var outObj = {
                resp: "success",
                result: result
            }
            res.json(outObj)
        })
    })
})

app.get('/questionsddl', (request, response) => {
    var projectid = request.query.projectid;
    
    DataBasepool.getConnection((err, connection) => {
        if(err){
            response.send(err.sqlMessage);
            return;
        }

        var sql = "select * from questions_tbl where project_id = ?";
        connection.query(sql, [projectid], (err, result, fields) => {
            if(err){
                response.send(err.sqlMessage);
                return;
            }

            connection.query("show columns from question_response", (err, tblRS)=>{
                if(err){
                    response.send(err.sqlMessage);
                    return;
                }
                connection.release();

                var val = "<option value='" +0+ "'>"+"Select a Project form the list"+"</option>.....";    
                
                result.forEach(function(row) { 
                    val += "<option value='" + row.refnos + "'>";
                    val += row.question;  
                    val += "</option>";
                });

                console.log(tblRS);
                
                var vall = "<option value='" +0+ "'>"+"Select a Response Column"+"</option>.....";    
                
                tblRS.forEach(function(row) { 
                    vall += "<option value='" + row.Field + "'>";
                    vall += row.Field;  
                    vall += "</option>"; 
                });
    
                var outObj = {
                    question: val
                };
    
                // console.log(outObj);
                response.json({val: val, tbl: vall});
                // connection.release();
            
            })
        });
        
    });

    // console.log('here now...')
})

/** GET sample_data column names */
app.get('/getcolumnnames', (req, res) => {
    DataBasepool.getConnection((err, connection) => {
        if(err){
            res.send(err.sqlMessage);
            return;
        }

        // var project_id = 

        var sql = "SELECT * FROM skucode_tbl as b WHERE b.project_id=7 and NOT EXISTS ( SELECT * FROM sku_questions_mapping as a WHERE b.`code` = a.`skucode` )";

        connection.query(sql, (err, result)=>{
            if(err){
                res.send(err.sqlMessage);
                return;
            }


            // connection.query('', ()=>{
            //     if(err) {
            //         res.send(err.sqlMessage);
            //         return;
            //     }

                connection.query("select * from project", (err, projectDDL) => {
                    if(err) {
                        res.send(err.sqlMessage);
                        return;
                    }

                    var val = "<option value='" +0+ "'>"+"Please, Select project....."+"</option>.....";

                    projectDDL.forEach(function(row) { 
                        val += "<option value='" + row.refnos + "'>";
                        val += row.project_title;  
                        val += "</option>";
                    });

                    connection.release();

                    console.log("COLUMN COUNTS: "+result.length);
                    console.log("COLUMN COUNTS: "+result.length);
        
                    var respObject = {
                        result: JSON.stringify(result), 
                        project: val
                    }

                    res.json(respObject);

                    console.log(respObject)
                    // res.json({
                    //     result: result,
                    //     project: val
                    // });
        
                
                })

            // })
            




        })


    })

})

app.get('/saveskumap', (req, res) => {
    DataBasepool.getConnection((err, connection) => {
        if(err){
            res.send(err.sqlMessage);
            return;
        }
        var project     = req.query.project;
        var skucode     = req.query.sku;
        var state       = req.query.state;
        var question    = req.query.question;
        var response    = req.query.response;

        
        var sql="insert into sku_questions_mapping (skucode, status, user_id, question_id, project_id) values(?, ?, ?, ?, ?)";
        connection.query(sql, [skucode, state, 'Dele', question, project], (err, result) => {
            if(err) {
                console.log(err.sqlMessage);
                res.send(err.sqlMessage);
                return;
            }

            /** START a new query that wraps the inserted record as 
             *  HTML for client side rendering.
             */
            connection.query("select * from sku_questions_mapping where project_id = ?", [project], (err, resultsRS) => {
                if(err){
                    console.log(err.sqlMessage);
                    res.send(err.sqlMessage);
                    return;
                }
                connection.release();

                var str = "<table class='table table-hovered'  >";
                
                resultsRS.forEach((row) => {
                    str += "<tr><td>"+ row.skucode +"</td>"
                    str += "<td>"+ row.status +"</td>"
                    str += "<td>"+ row.question_id +"</td></tr>"
                
                })

                str += "</table>";

                /**TEST FOR success and report to client 
                 *  you may need to remove added sku from 
                 *  the drop down on client.
                */
                res.send(str);
    
            })
        })
    })
})


/**
 * 
 *  The surveyPlanet Mobile APP routes 
 * 
 */


 var insertSkuMap = async (project, skucode, state, question) => { 
     return new Promise((resolve, reject)=>{
        DataBasepool.getConnection((err, connection) => {
            if(err){
                res.send(err.sqlMessage);
                return;
            }
            // var project     = req.query.project;
            // var skucode     = req.query.sku;
            // var state       = req.query.state;
            // var question    = req.query.question;
            // var response    = req.query.response;
    
            
            var sql="insert into sku_questions_mapping (skucode, status, user_id, question_id, project_id) values(?, ?, ?, ?, ?)";
            connection.query(sql, [skucode, state, 'Dele', question, project], (err, result) => {
                if(err) {
                    console.log(err.sqlMessage);
                    reject(err.sqlMessage);
                    return;
                }
    
                /** START a new query that wraps the inserted record as 
                 *  HTML for client side rendering.
                 */
                connection.query("select * from sku_questions_mapping where project_id = ?", [project], (err, resultsRS) => {
                    if(err){
                        console.log(err.sqlMessage);
                        reject(err.sqlMessage);
                        return;
                    }
                    connection.release();
    
                    var str = "<table class='table table-hovered'  >";
                    
                    resultsRS.forEach((row) => {
                        str += "<tr><td>"+ row.skucode +"</td>"
                        str += "<td>"+ row.status +"</td>"
                        str += "<td>"+ row.question_id +"</td></tr>"
                    
                    })
    
                    str += "</table>";
    
                    /**TEST FOR success and report to client 
                     *  you may need to remove added sku from 
                     *  the drop down on client.
                    */
                    resolve(str);
        
                })
            })
        })
    
     })

 }

 var insertQuestion = async (project_id, number, question, index) => {
     return new Promise((resolve, reject)=>{
         DataBasepool.getConnection((err, connection)=>{
             if(err){
                console.log(err.sqlMessage);
                reject(err.sqlMessage);
             }
             var sql = "insert into questions_tbl(project_id, question_no, question, required, usermail, status, question_index) values(?, ?, ?, ?, ?, ?, ?)";
             connection.query(sql, [project_id, number, question, 'required', 'dolaf2007@yahoo.com', 'ON', index], (err, resultRS)=>{
                if(err){
                    console.log(err.sqlMessage);
                    reject(err.sqlMessage)
                    // return;     
                }
                connection.release();
                // console.log(resultRS.insertId);
            
                resolve(resultRS)

            })
 

         })
     })
    
 }

 var getQuestionaireList = async () => {
     return new Promise((resolve, reject)=>{
        DataBasepool.getConnection((err, connection)=>{
            if(err){
                console.log(err.sqlMessage);
                reject(err.sqlMessage);
                return;
            }
            // var project_id = req.query.project;
    
            connection.query("select * from TABLE48", (err, result)=>{
                if(err) {
                    console.log(err.sqlMessage);
                    reject(err.sqlMessage);
                    return;
                }
    
                connection.release();
                // console.log(JSON.stringify(result));
    
                var question;
                var resultArray = JSON.stringify(result);
    
                  
                // connection.release();
                resolve(result);
    
            })
        })    

     })
 }

 app.get('/uploadquestionaire', async (req, res)=>{

    /** Get me the table containning questionaire to be uploaded */

    var project_id = req.query.project;

    var skucode, question;
    var array = await getQuestionaireList(); 

    var counter=0;
    console.log("LEnGTH: "+array.length)

    var arrayResult="";
    for(var x=0; x<array.length; x++){
        counter++;
        skucode  = array[x].COL1;
        question = array[x].COL2;

        // console.log("CODE: "+x)
        // console.log("SKU: "+skucode +"<======>"+ "Question: "+question)
        // console.log("Question: "+question)

        /** uploaded questions insertion */
        var retVal = await insertQuestion(project_id, counter, question, x);

        // console.log(retVal.insertId+" ::: Rec Id: "+x)

        arrayResult = await insertSkuMap(project_id, skucode, 'response', retVal.insertId );



    }
    // res.send(arrayResult);

 })


 app.get('/uploadskucode', async (req, res)=>{
    var project_id = req.query.project;

    var coded
    var col_names = await getDataColumnNames();

    for (var x=0; x<col_names.length; x++){
        coded=col_names[x].Field;

        // console.log(col_names[x].Field)
        var resp = await insertColumnNames(coded, coded, project_id);

    }




 })

 var getDataColumnNames = async () =>{
    return new Promise((resolve, reject)=>{
        DataBasepool.getConnection((err, connection)=>{
            if(err){
                console.log(err.sqlMessage);
                reject(err.sqlMessage);
                return;
            }
            connection.query('show columns from sample_data', (err, result)=>{
                if(err){
                    console.log(err.sqlMessage);
                    reject(err.sqlMessage);
                    return;
                }
                connection.release();
                
                resolve(result);
                
            })


        })
    })
 }

 var insertColumnNames = async (code, sku, project) =>{
    return new Promise((resolve, reject)=>{
        DataBasepool.getConnection((err, connection)=>{
            if(err){
                console.log(err.sqlMessage);
                reject(err.sqlMessage);
                return;
            }
            connection.query('insert into skucode_tbl(code, sku_description, project_id) values(?, ?, ?)', [code, sku, project], (err, result)=>{
                if(err) {
                    console.log(err.sqlMessage);
                    reject(err.sqlMessage);
                    return;
                }

                connection.release();
                
                resolve(result);
                
            })


        })
    })
 }
 

 app.get('/uploadresponses', async (req, res) => {
    var projectid = req.query.project;

    var datars = await getresponsedata();

    var insertionObject = {

    }

    var length_of_columns_available_in_resultset = Object.keys(datars.result[0]).length;

    var available_columns_in_resultset           = Object.keys(datars.result[0]);
    var available_columns_values_in_resultset    = Object.keys(datars.result[1]);

    // console.log(available_columns_in_resultset[0]);
    // console.log(available_columns_values_in_resultset);
    console.log(datars.result[0]);

    
    // console.log(available_columns_values_in_resultset);
    // console.log(available_columns_values_in_resultset[1]);


    // console.log(datars.fields.length);

    var rec_len, col_len, cname;

    var usermaail, imei, gps_location, project_id, resp_time,
        submit_date, outlet_id, state_code, area_code, wavecode,
        col_name, status, question_id, insertObject, valU;

    rec_len = datars.result.length; // record length
    col_len = datars.fields.length; // column length

    for (var x = 0; x < datars.result.length; x++) {
        submit_date   = datars.result[x].SubmissionDate;
        imei          = datars.result[x].deviceid;
        outlet_id     = datars.result[x].OUTLET_ID;
        gps_location  = datars.result[x].GPS1_Latitude;
        state_code    = datars.result[x].LOCATION;
        area_code     = datars.result[x].AREA;
        wavecode      = datars.result[x].quarter;
        resp_time     = datars.result[x].starttime;
        col_name      = datars.result[x].name;
 
        // console.log(datars.result[x])
 
        
        for(var y = 0; y < length_of_columns_available_in_resultset; y++) {
            /** Get the column name */
            // col_name = datars.fields[y].name;
            // console.log(available_columns_in_resultset[y]);
            col_name = available_columns_in_resultset[y];

            var str = `datars.result[y].col_name`
            // console.log(str);


            /** check status of the column */
            // var responseObj = await skumappedquestionretrieval(col_name);
            
            // resultObj += '{"elm_type": "'+typ+'", "curr_gps": "'+quest_gps+'", "imei": "'+IMEI+'", "timer": "'+stime +"#"+etime +'", "dated": "'+usermail+'", "project_id": "'+projectid+'", "question_id": "'+questionid+'", "answer": "'+answer+'", "gps": "'+geolocation+'" }, ';
            
            // status = responseObj[0].status;
            // question_id = responseObj[0].question_id;

            // status = responseObj[0].status;
            // if(status='response'){
            //     insertObject = {
            //         imei: imei,
            //         dated: usermail,
            //         project_id: projectid,
            //         question_id: question_id,
            //         answer: value,
            //         gps: gps_location,
            //         timer: resp_time,
            //         curr_gps: gps_location,
            //         elm_type: "text"

            //     }

            // }


            // console.log(responseObj);

        }
        // console.log('**********************************************************************************>:'+ x)

    }



 })


 var skumappedquestionretrieval = async (sku) => {
    return new Promise((resolve, reject) => {
        DataBasepool.getConnection((err, connection) => {
            if(err){
                reject(err.sqlMessage);
                return;
            }

            connection.query("select * from sku_questions_mapping s where s.`skucode`=?", [sku], (err, result) => {
                if(err){
                    reject(err.sqlMessage);
                    return;
                }

                connection.release();

                resolve(result);
            })
        })
    })
 }

 var getresponsedata = async () => {
    return new Promise((resolve, reject)=>{
        DataBasepool.getConnection((err, connection)=>{
            if(err){
                reject(err.sqlMessage);
                return;
            }
            connection.beginTransaction((err)=>{
                if(err){
                    reject(err.sqlMessage);
                    return
                }

                var sql = "select * from sample_data limit 2";
                connection.query(sql, (err, resultRS, flds)=>{
                    if(err){
                        reject(err.sqlMessage);
                        return;
                    }
    
                    connection.query("select * from TABLE48", (err, resRS)=>{
                        if(err){
                            reject(err.sqlMessage);
                            return;
                        }
                        var sql = "select ";
    
                        var data_array=[];
    
                        resRS.forEach((rec)=>{
                            data_array.push(rec.COL1);
                        })
    
                        sql += data_array + " from sample_data";
        
                        connection.query(sql, (err, dataRS)=>{
                            if(err){
                                reject(err.sqlMessage);
                                return;
                            }

                            connection.commit((err)=>{
                                if(err){
                                    reject(err.sqlMessage);
                                    return;
                                }

                                connection.release();
        
                                var outObj = {
                                    result: resultRS,
                                    fields: flds,
                                    columns: resRS,
                                    SqlStatement: sql,
                                    responsedata: dataRS
                                }
                
                                resolve(outObj)
                                
                            })
    
                        })
                        
                    })
    
                })
    
            })

        })
    })
 }
 app.post('/userauth', urlencodedParser, (req, res) => {
     console.log(req.body.username);
     console.log(req.body.password);

 });


// var str = "<table class='table table-bordered' >";
 
// str += "<tbody>"
// res.forEach(function(row){
//     str += "<tr><td>" + row.goods_type + "</td>";  
//     str += "<td><button class='btn btn-success' id = '" + row.idclients_orders + "' onclick='assignJob(this.id)' ><i class='fa fa-users' ></i></button></td>";
//     str += "<td><button class='btn btn-success' id = '" + row.idclients_orders + "' onclick='deleter(this.id)' ><i class='fa fa-trash' ></i></button></td></tr>";
// });

// str += "</tbody></table>";
 


// routes(app);
// ================================================================
// end of routes
// ================================================================

var authenticateuser = function(user, pass) {
    // console.log(user+"=>"+pass)
    DataBasepool.getConnection(function(err, connection){
      connection.query("select * from webusers where usermail = ? AND PassWord = ?",[user, pass], function (err, result, fields) {
        if (err) throw err
        console.log(result)
        //socket.emit('tracked', result)
        connection.release()
        return result
      })
    })
}
 

// ================================================================
// start our server
// ================================================================
server.listen(port, function() {
    // console.log('Server listening on port ' + port + '...');
    console.log(`Server listening on port ${port}`)
});




io.on('connection', (socket) => {
    console.log(socket+ ' Connected...');
    socket.emit('getter', 'Welcome!!!');

    socket.on('getquestions', (usermail) => {

        //This should have a usermail parameter
        console.log('Dele Olaf: '+usermail)
        
        // console.log('Dele Olaf')

        DataBasepool.getConnection(function(err, connection){
            if(err){
                socket.emit('errmsg', {error: err});
                return;
            }
            var projectTitle;

            var sql = "select * from project where status = 'ON' and usermail = ? ";
            connection.query(sql, [usermail], function (err, result, fields) {
                if (err){
                    socket.emit('error', err)
                    return connection.rollback(() => {
                        connection.release();
                    })
                }
                 
                var referencenumber=0;
                result.forEach(function(row){
                    referencenumber = row.refnos;
                    projectTitle    = row.project_title;
                });

                if(referencenumber==0){
                    console.log("No survey Project at this time...")
                    return;
                }
                 
                connection.query('select * from questions_tbl where project_id = ? order by question_no', [referencenumber], function(err, questionrs, q_fields){
                    var str = "", options="";
                    
                    if(err){
                        console.log(err);
                        socket.emit('errmsg', {error: err});
                        return connection.rollback(() => {
                            connection.release();
                        });
                    }

                    connection.query("select * from options_tbl", function(err, res, flds){
                        if(err){
                            console.log(err);
                            socket.emit('errmsg', {error: err});
                            return connection.rollback(() => {
                                connection.release();
                            });
                        }
    
                        // var sql = "SELECT * FROM question_conditions as b WHERE NOT EXISTS( SELECT * FROM questions_tbl as a WHERE b.refnos = a.refnos and project_id = ?)";
                        var sql = "select * from kpi";
                        connection.query(sql, [referencenumber], function(err, ans, fields){
                            if(err){
                                console.log(err);
                                socket.emit('errmsg', {error: err});
                                return connection.rollback(() => {
                                    connection.release();
                                });
                            }
        
                            str = {
                                Questions       : questionrs, 
                                Responses       : res,
                                referencenumber : referencenumber,
                                conditions      : ans,
                                projectTitle    : projectTitle

                            };

                            console.log(ans);
                            console.log(referencenumber);
                            console.log(str);
                            socket.emit('getquestions', str);

                            connection.release(); 
                        })

                    })   

                })  
           
            })

        })


    })



    socket.on('track', (trackingnumber) => {
      DataBasepool.getConnection(function(err, connection){
        connection.query("select t.product_img, t.product_name, p.from, p.to, p.narration  from transactionstbl t inner join product_movement p ON p.transactionstblpt = t.refnos where p.transactionstblpt = ?",[trackingnumber], function (err, result, fields) {
          if (err) throw err
          console.log(result)
          socket.emit('tracked', result)
          connection.release()
        })
      })
      
      console.log(trackingnumber)
    });

    socket.on('all responses today', () => {
        console.log('OLADELE');
        DataBasepool.getConnection((err, connection)=>{
            if(err){
                socket.emit('errmsg', {error: err});
                console.log(err);
                return;
            }
            var today = dateFormat(new Date(), 'yyyy-mm-dd');
             
            console.log('Dated:');
            console.log(today);
            // var dtArr_ = today.split('T');

            var counted=0;
            connection.query("select distinct count( distinct `usermail`) as counted  from `question_response` where date(dated) = ?", [today], (err, result)=>{
                if(err){
                    socket.emit('errmsg', {error: err});
                    console.log(err);
                    return;
                }

                connection.release();
                
                result.forEach((row)=>{
                    counted=row.counted;
                });
                
                var Obj = {count: counted};
                
                // console.log(Obj);
                // console.log(counted);

                socket.emit('all responses today', counted);
            });
        });
    });

    /** You can emit info to all clients from here, server decision */

    // socket.on('newproject', (obj)=>{
    //     console.log(obj)
    // })

});

// $(document).ready(function(){
//     var email,pass;
//     $("#submit").click(function(){
//         email=$("#email").val();
//         pass=$("#password").val();
//         /*
//         * Perform some validation here.
//         */
//         $.post("/login",{email:email,pass:pass}, function(data){
//             if(data==='done') {
//                 window.location.href="/admin";
//             }
//         });
//     });
// })