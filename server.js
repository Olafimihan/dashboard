'use strict';

// ================================================================
// get all the tools we need
// ================================================================
const cool = require('cool-ascii-faces')

var express = require('express');

var port = process.env.PORT || 4000;

var app = express();
var bodyParser = require('body-parser')
var mysql = require('mysql') 
var multer = require('multer')
var path = require('path')
var nodemailer = require('nodemailer')
var mailer = require('./mailer/mailer')
var urlencodedParser = bodyParser.urlencoded({extended: false})
 

// var dateFormat = require('dateFormat');

var http = require('http')
var ejs = require('ejs')
var routes = require('./routes/index.js');
var publicPath = path.join(__dirname, 'public');
var htmlPath = path.join(__dirname, 'views/html')
var socketIO = require('socket.io')
var server = http.createServer(app)
var io = socketIO(server)
var fs = require('fs')

var DataBasepool = require('./connections/connection')

// ================================================================
// setup our express application
// ================================================================
// app.set('view engine', 'html');
// app.use('public', express.static(process.cwd() + 'public'));
// app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');
app.set('views', __dirname);

app.use(express.static(publicPath));
app.use(express.static(htmlPath));
app.use(function(req, res, next){
    res.header('Access-Control-Allow-Origin', "127.0.0.1:4000");
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
})
 
// ================================================================
// setup routes
// ================================================================
app.get('/cool', (req, res) => res.send(cool()))

app.get('/register', (req, res) => {
    console.log('Dele waz....')
});

app.get('/', function(req, res) {
    res.sendFile(htmlPath+('/login.html'));
    // res.sendFile('html/login');

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
  console.log(req.body)
  updateCompanyInfo(req.body, function(response){
      console.log(response)

      getCompanyInfo(function(result){             
          console.log( result[0].phone )

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
              console.log('ID: '+recid)
              var email = req.body.email
              
              // console.log('available file name 22: '+req.file.filename)
              var productImage = "http://75.127.75.161/courier/" + req.file.filename

              console.log('Mail: '+email)

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

                  subject: "Acknowledgement", // Subject line
                  // text: "Hello world?", // plain text body
                  html: output // html body
              }; 

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

app.get('/rawdata', function(req, res){
    var usermail = req.query.user;

    console.log('User: '+usermail); 

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
            console.log(project_id)
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

                    console.log(responses);
                    
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
                        console.log(str);

                        
                    })
    
                })
    
            })


        })

        connection.release();

    }) //DB Connection Pool end
})

app.get('/projrawdata', function(req, res){
    var usermail   = req.query.user;
    var project_id = req.query.projectid;
    var role       = req.query.role;

    // console.log('User: '+usermail); 
    // console.log('Role: '+role); 

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

                if(role=='Admin'){
                    sql ="select * from question_response where project_id = ? and view_state = 'admin' order by usermail, refnos";
                }  
                else if(role=='client'){
                    sql ="select * from question_response where project_id = ? and view_state = 'client' order by usermail, refnos";
                }
                else if(role=='manager'){
                    sql ="select * from question_response where project_id = ? and view_state = 'field' order by usermail, refnos";
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
                            project: results
                        }

                        var str = "<table style='overflow: scroll' class='table table-bordered table-hover table-sm' id='example0' border='0' cellpadding='0' cellspacing='0'  >";
                        if(role=='Admin'){
                            str += "<thead class='thead-dark' ><tr style='background-color: skyblue; color: black' ><th><input class='form-control' type='checkbox' id='header' value='"+project_id+"' name='header' onclick='checker(this.id, this.value)' ></th><th>Respondent Name</th><th>GPS Location</th>"; 
                        }
                        else if(role=='client'){
                            str += "<thead class='thead-dark' ><tr style='background-color: skyblue; color: black' ><th>Respondent Name</th><th>GPS Location</th>";
                        
                        }
                        else if(role=='manager'){
                            str += "<thead class='thead-dark' ><tr style='background-color: skyblue; color: black' ><th><input class='form-control' type='checkbox' id='header' value='"+project_id+"' name='header' onclick='checker(this.id, this.value)' ></th><th>Respondent Name</th><th>GPS Location</th>"; 
                        }
                        
                        result.forEach((q_rs) => {
                            str += "<th>"+ q_rs.question +"</th>";
                        })

                        str += "</tr></thead>";

                        var topmail = "empty";

                        var status="";
                        responses.forEach((r_rs) => {
                            var currentmail = r_rs.usermail;
                            status = r_rs.checker;

                            if(topmail != currentmail){
                                if(status==1){
                                    
                                    if(role=='Admin'){
                                        str += "<tr style='font-weight: normal; font-size: 12px' ><td><input type='checkbox' checked class='rad' id='"+ r_rs.refnos+"' value='"+ r_rs.usermail+"'  name='selected'  onclick='checkersingleton(this.id, this.value)' ></td><td>"+ currentmail +"</td><td>"+ r_rs.location +"</td><td>"+ r_rs.response_text +"</td>";
                                    }else if(role=='client'){
                                        str += "<tr style='font-weight: normal; font-size: 12px' ><td>"+ currentmail +"</td><td>"+ r_rs.location +"</td><td>"+ r_rs.response_text +"</td>";
                                    }else if(role=='manager'){
                                        str += "<tr style='font-weight: normal; font-size: 12px' ><td><input type='checkbox' checked class='rad' id='"+ r_rs.refnos+"' value='"+ r_rs.usermail+"'  name='selected'  onclick='checkersingleton(this.id, this.value)' ></td><td>"+ currentmail +"</td><td>"+ r_rs.location +"</td><td>"+ r_rs.response_text +"</td>";
                                    }

                                }else{

                                    if(role=='Admin'){
                                        str += "<tr style='font-weight: normal; font-size: 12px' ><td><input type='checkbox'  class='rad' id='"+ r_rs.refnos+"' value='"+ r_rs.usermail+"'  name='selected'  onclick='checkersingleton(this.id, this.value)' ></td><td>"+ currentmail +"</td><td>"+ r_rs.location +"</td><td>"+ r_rs.response_text +"</td>";
                                    }else if(role=='client'){
                                        str += "<tr style='font-weight: normal; font-size: 12px' ><td>"+ currentmail +"</td><td>"+ r_rs.location +"</td><td>"+ r_rs.response_text +"</td>";
                                    }else if(role=='manager'){
                                        str += "<tr style='font-weight: normal; font-size: 12px' ><td><input type='checkbox'  class='rad' id='"+ r_rs.refnos+"' value='"+ r_rs.usermail+"'  name='selected'  onclick='checkersingleton(this.id, this.value)' ></td><td>"+ currentmail +"</td><td>"+ r_rs.location +"</td><td>"+ r_rs.response_text +"</td>";
                                    }

                                }
                                
                            }else if(topmail == currentmail) {
                                str += "<td>"+ r_rs.response_text +"</td>"; 

                                if(topmail == currentmail){  

                                }else{

                                    str += "</tr>";    
                                } 
                                    
                            }
                            topmail = currentmail;

                        });

                        str += "</table>";

                        res.send(str);
                        console.log(str);
                        
                    });
    
                });
    
            });

        });
        connection.release();

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

          console.log(results.length)
          console.log(JSON.stringify(results))
          console.log( JSON.stringify(results).length )
 
      })
      connection.release();

  })
})



app.get('/getquestiongraphdata', function(req, res){
  var questionid = req.query.questionid;
  var role = req.query.role;

  console.log(questionid);
  console.log(role);
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

                  var question=[];
                  resp.forEach(function(row){
                      question.push(row.question);
                  })


                  res.send({
                      labels: lbl, 
                      series: seriesval,
                      question: question
                  });
                  // res.send(JSON.stringify(results));
                  // res.send(results+"@"+result);

                //   console.log(seriesval)
                //   // console.log(seriesval.length)
                //   console.log(JSON.stringify(seriesval))
                //   console.log( JSON.stringify(seriesval).length )
                //   console.log("Options: "+seriesval)
  
                  
              })
          })
      })
      connection.release();

  })
})

app.get('/getquestionoptions', function(req, res){
  var questionId = req.query.questionId;

  var sql = "SELECT * FROM options_tbl WHERE question_id = ?";
  DataBasepool.getConnection(function(err, connection){
      if(err){
        //   console.log(err);
          res.send(err.sqlMessage);
          return;
      }
      connection.query(sql, [questionId], function(err, result, fields){
          if(err){
            //   console.log(err);
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
    console.info(questionId);

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

    console.info(user);
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



app.get('/getquestions', function(req, res){
  var project_id = req.query.projectid; //projectid

  console.log('ProjectCode: '+project_id);

  DataBasepool.getConnection(function(err, connection){
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
                str += "<tr id="+ row.refnos +" onclick='clicked(this.id)'><td>"+ recs +"</td><td>"+ row.question +"</td><td><button type='button' class='btn btn-success' tooltip='Add Option to question to be selected by users' id='"+ row.refnos +"' value='"+ row.question +"' onclick='openoptions(this.id, this.value)' >Options</button> </td><td><button type='button' class='btn btn-primary' tooltip='Click to edit the question' id='"+ row.refnos +"' onclick='editQuestion(this.id)' ><span><i class='fa fa-pencil' ></i> </span></button></td><td><button type='button' class='btn btn-primary' tooltip='Click to edit the question' id='"+ row.refnos +"' onclick='questionCondition (this.id)' ><span><i class='fa fa-control' ></i> Condition</span></button></td> <td><button type='button' class='btn btn-danger' tooltip='Click to delete the question' id='"+ row.refnos +"' onclick='deleteQuestion(this.id)' ><span><i class='fa fa-trash' ></i></span></button> </td></tr>";
        
              });

              str += "</table>";

              var var_str = results+ "$" + result + "$" + str + "$" + status + "$" + recs;
        
              var object_Values = {
                  questions: results, 
                  options: result,
                  str: str, 
                  status: status,
                  questtotal: recs
              };

            //   var var_str = {
            //       str: str,
            //       questions: results
            //   }

              res.send(var_str);
              
          });
 
      });

      connection.release();

  });
});

app.get('/setQuestionCondition', (req, res) => {
    var projectid = req.query.projectid;
    var refid = req.query.questionid;

    DataBasepool.getConnection((err, connection) => {
        if(err){
            res.send(err);
            return;
        };

        connection.query("select * from options_tbl o where o.`question_id` = ?", [refid], (err, result, fields) => {
            if(err){
                res.send(err);
                return;
            };

            connection.query("select * from questions_tbl where `refnos` > ? and project_id = ?", [refid, projectid], (err, results, flds) => {
                if(err){
                    res.send(err);
                    return;
                }

                var val = "<option value='" +0+ "'>"+"Please, Select aquestion....."+"</option>.....";

                results.forEach(function(row) { 
                    val += "<option value='" + row.refnos + "'>";
                    val += row.question;  
                    val += "</option>";
                });

                var str = "<table class='table-bordered'  cellspacing='5' cellpadding='5' > ";

                console.log(projectid)
                console.log(refid)
                console.log(val)

                str += "<thead><tr><td colspan='5' style='text-align: center; font-size: 18px; font-weight: bolder'>Options Condition Statements.</td></tr></thead>";
                str += "<tbody>";
                result.forEach((row) => {
                    
                    str += "<tr><td style='width='100%'>If user picks</td><td>"+ row.response_text +"</td><td>Go to </td><td><select id='restext' name='restext' >"+ val +"</select></td><td><button id='"+row.refnos+"' type='button' class='btn btn-primary' onclick='saver(this.id)' >Save</button></td></tr>";
                });

                str += "</tbody>";
                str += "</table>";

                res.send(str);

            })

    
        });
        connection.release();

    })

})

app.get('/editquestion', (req, res) => {
    var questionid = req.query.questionid;
    console.log('yeahh!!!'+ questionid);
});

app.get('/deletequestion', (req, res) => {
    var questionid = req.query.questionid;
    console.log('Delete yeahh!!!'+ questionid);
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

app.get('/close', (req, res) => {
    res.sendFile(htmlPath+('/board.html'));
})

app.get('/mapusers', (req, res) => {
    var owner = req.query.owner;
    var user = req.query.user;
    var project = req.query.project;

    DataBasepool.getConnection((err, connection) => {
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

            connection.query("update app_users_auth set project_id = ? where refnos = ?", [project, user], (err, fl) => {
                if(err){
                    res.send(err);
                    return;
                };
                connection.query("select * from app_users_auth where project_id = ?", [project], (err, result, flds) => {
                    if(err){
                        res.send(err.sqlMessage)
                        return;
                    };
        
                    var xx = 0;
                    var str = "<table class='table table-condensed' >";
                    result.forEach(function(row){
                        xx++;
                        str += "<tr><td>"+ xx +"</td><td>"+ row.name +"</td><td>"+ row.phone +"</td></tr>";
        
                    });
                    str += "</table>";
        
                    res.send(str);
        
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
    var required    = req.query.required;

    console.log(req.query.projectid)

    DataBasepool.getConnection(function(err, connection){
        if(err){
            res.send(err);
            return;
        }

          
        connection.query("insert into questions_tbl(project_id, question_no, question, usermail, required) values(?, ?, ?, ?, ?) ", [project_id, position, question, usermail, required], function(err, results, fields){
            if(err){
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

        });

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
      console.log(usermail);
          
      connection.query("select refnos, project_title from project where usermail = ?", [usermail], function(err, results, fields){
          if(err){
              res.send(err.sqlMessage);
              return;
          }

          var xx = 0;
          results.forEach(function(row){
              xx++;
          })

          
          console.log(results);
          console.log(usermail); 
          // res.s
          console.log('gbamgba dekun here truly...'+usermail);
          
          res.render('pages/newproject', {
              usermail: usermail,
              projects: results
          });

          
      })
      connection.release();
  
    })


  
});

app.get('/getprojectslist', function(req, res){
    DataBasepool.getConnection(function(err, connection){
        if(err){
            // console.log(err);
            res.send(err);
            return;
        }

        var user = req.query.user;
        var role = req.query.role;
        var sql = "";
        
        console.log(role);
        console.log(user);

        if(role=='Admin') {
            sql = "select * from project where usermail = ?";        
        }else if(role=='client') {
            sql = "select p.`refnos`, p.`project_title`  from project p, mapusers_project m where m.usermail = ? and p.`refnos`=m.`project_id`";        
        }else if(role=='manager') {
            sql = "select p.`refnos`, p.`project_title`  from project p, mapusers_project m where m.usermail = ? and p.`refnos`=m.`project_id`";        
        }
        
        connection.query(sql, [user], function(err, result, fields) {
            if(err){
                console.log(err.sqlMessage);
                res.send(err.sqlMessage);
                return connection.rollback(function(){

                })
            }

            var val = "<option value='" +0+ "'>"+"Please, Select Project....."+"</option>.....";

            result.forEach(function(row) {
                val += "<option value='" + row.refnos + "'>";
                val += row.project_title;  
                val += "</option>";
            });

            
            res.send(val);          
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
                val += row.fname + "     ==>>     " + row.access_level;  
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
  
  DataBasepool.getConnection(function(err, connection){
      if(err){
          res.send(err.sqlMessage)
          return;
      }
    //   console.log(usermail);
          
      connection.query("insert into project(project_title, usermail, startdate, enddate, reason) values(?, ?, ?, ?, ?) ", [title, usermail, sdate, edate, reason], function(err, result, fields){
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

  console.log("Gotten: "+usermail );

  DataBasepool.getConnection(function(err, connection){
      if(err){
          res.send(err.sqlMessage);
          return;
      }
      // connection.query("call f_get_response_data()", function (err, result, fields) {
      console.log(usermail);
          
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

app.get('/optns', function(req, res){
  var questionid = req.query.questionid;

  console.log(questionid)
  DataBasepool.getConnection(function(err, connection){
      if(err){
          res.send(err.sqlMessage);
          return;
      }
      
      var sql = "select * from options_tbl where question_id = ?"
      
      connection.query(sql, [questionid], function(err, result, fields){
          if(err){
              res.send(err.sqlMessage);
              return;
          }
          console.log(result)

          res.send(result);

          
      })
      connection.release();    
  })


})

app.get('/getQuestionNumber', function(req, res){

  var questionId = req.query.questionId;
  console.log(questionId)
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
          console.log(result)

          res.send(result);

          
      })
      connection.release();
  })
})

app.post('/savecondition', urlencodedParser, function(req, res){ 

  var questionId = req.body.questionId;
  var responseId = req.body.responseId;
  var gotoId = req.body.gotoId; 
  var gotoIndex = req.body.gotoIndex; 

  DataBasepool.getConnection(function(err, connection){
      if(err){
          res.send(err.sqlMessage);
          return;
      }
      
      var sql = "insert into question_conditions(question_id, response_id, goto, idx) values(?, ?, ?, ?)"
      
      connection.query(sql, [questionId, responseId, gotoId, gotoIndex], function(err, result, fields){
          if(err) {
            res.send(err.sqlMessage);
            return connection.rollback(function(){
                // connection.release();
            })
          }

          var answer = "success";

        //   console.log("Inserted rec: "+answer)
          
          res.send(answer);

          

      })
      connection.release();
  })

})

app.post('/deletequestioncondition', urlencodedParser, function(req, res){
  var referencenumber = req.body.referencenumber; 
  console.log('The code: '+referencenumber);

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
      console.log(questionId)
      console.log(responseId)
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

    DataBasepool.getConnection(function(err, connection){
        if(err){
            // console.log(err);
            res.send(err);
            return;
        };
          
        var sql = "insert into options_tbl(question_id, response_text, coltype) values(?, ?, ?)"
        
        connection.query(sql, [questionid, choice, type], function(err, results, fields){
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

        var sql = "select * from app_users_auth ";
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
                str += "<tr><td>" + recs + "</td><td>" + row.name + "</td></tr>";

            })

            res.send(str);
        })

        connection.release();
    })

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
    
      res.send(str);


    })
    connection.release();

  }) 
  
})

app.get('/getproject', function(req, res){ 
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
        str += "<tr id="+ row.refnos +" onclick='clicked(this.id)'><td>"+ recs +"</td><td>"+ row.project_title +"</td><td><button type='button' id='"+ row.refnos +"' class='btn btn-primary' onclick='deleteproject(this.id)' ><i class='fa fa-recycle' ></i></button></td></tr>";

      });

      str += "</table>";
    
      res.send(str);


    })
    connection.release();
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
            var val = "<option value='" +0+ "'>"+"Select a Project form the list"+"</option>.....";    
            result.forEach(function(row) { 
                val += "<option value='" + row.refnos + "'>";
                val += row.question;  
                val += "</option>";
            });

            var outObj = {
                question: val
            }

            // console.log(outObj);
            response.send(val);
            // connection.release();
        });
        connection.release();
    });

    // console.log('here now...')
})


/**
 * 
 *  The surveyPlanet Mobile APP routes 
 * 
 */

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

var authenticateuser = function(user, pass){
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

io.on('connection', (socket) => {
    console.log(socket+' Connected...')

    socket.on('track', (trackingnumber)=>{
      DataBasepool.getConnection(function(err, connection){
        connection.query("select t.product_img, t.product_name, p.from, p.to, p.narration  from transactionstbl t inner join product_movement p ON p.transactionstblpt = t.refnos where p.transactionstblpt = ?",[trackingnumber], function (err, result, fields) {
          if (err) throw err
          console.log(result)
          socket.emit('tracked', result)
          connection.release()
        })
      })
      
      console.log(trackingnumber)
    })

    // socket.on('newproject', (obj)=>{
    //     console.log(obj)
    // })

});


// ================================================================
// start our server
// ================================================================
app.listen(port, function() {
    // console.log('Server listening on port ' + port + '...');
    console.log(`Server listening on port ${port}`)
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
// });