'use strict';
var bodyParser = require('body-parser')
var mysql = require('mysql') 
var multer = require('multer')
var path = require('path')
var nodemailer = require('nodemailer')
var mailer = require('../mailer/mailer')
var urlencodedParser = bodyParser.urlencoded({extended: false})
 
/**
 * Communicate with the database here 
 */

/**Setup diskstorage for multer upload 
 * 
*/
// var diskstorage = multer.diskStorage({
//     destination: '/var/www/html/courier/',
//     filename: function(req, file, cb){
//         cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname) )
//     }
// });


/**Setup upload variable */
// var upload = multer({ storage: diskstorage }).single('myImage');

// var upload = multer({
//     dest: diskstorage
// }).single('image')

/**set your db connection here */
var DataBasepool = mysql.createPool({
    connectionLimit: 1000000, 
    // host: "127.0.0.1",
       host: "75.127.75.161",
    user: "root",
    password: "opeyemi",
    database: "surveydb" 
});



var updateImageLocation = (id, img, cb) => {
    // console.log('The ID is: '+id)
    // console.log('The image is: '+img)

    DataBasepool.getConnection(function(err, connection){ 
        var sql = "update transactionstbl set product_img = ? where refnos = ?"
        // var imgname = img.fieldname + '-' + Date.now() + path.extname(img.originalname)

        // console.log(img )
        connection.query(sql, [img, id], function (err, result) {
            if (err){
                console.log(err)
            }else{
                connection.release()

                return cb()               
                
                // console.log("Result: "+result)
                
            }     

        })
    })    

}

var getAllData = function(callback){
    var data
    DataBasepool.getConnection(function(err, connection){ 
        var sql = "select * from transactionstbl where status !='delivered' order by refnos desc"
        
        connection.query(sql, function (err, result) {
            if (err){
                console.log(err)
            } else{
                connection.release()

                return callback(result)               
                
                // console.log("Result: "+result)
                
            }            

        })
    })    

};

var query = function(sql) {
    return new Promise(function(resolve, reject) {
        var returnValue = "";
        db.query(sql, function(error, rows) {
            if (error) {
                returnValue = "";
            } else {
                returnValue = rows[0]['url'];
                console.log("in function result: " + returnValue);
            }
            resolve(returnValue)
        });
    });
};

var getSlaveURL = function() {
    var sqlQuery = "select * from transactionstbl where status !='delivered' order by refnos desc";
    let result = query(sqlQuery)
    // console.log("out function result: " + result);
};



// var getData = new Promise(function(resolve, reject) {
//     var sqlQuery = "select * from transactionstbl where status !='delivered' order by refnos desc ";
//     var returnValue = "";
//     db.query(sqlQuery, function(error, rows) {
//         if (error) {
//             returnValue = "";
//         } else {
//             returnValue = rows[0]['url'];
//             console.log("in function result: " + returnValue);
//         }
//         resolve(returnValue)
//     });
// });

var getDataArray = function(result){
    console.log("The real result: "+result)
    return result
}

function buildHtml(req) {
    var header = '';
    // var body = Object.Keys(req);
    
    // console.log('Builder: '+JSON.stringify(req))
    // concatenate header string
    // concatenate body string
    // var ol  = jQuery('<ol ></ol>');
    // req.forEach(function(row) { 

        // ol.append( jQuery('<span><li style="background-color: skyblue; padding-left: 10px;">  ' +row.description+ '</li></span>') );
    // }); 
    
    // return ol
  
    return '<!DOCTYPE html>'
         + '<html><head>' + header + '</head><body>' + req.refnos + '</body></html>';
         
};

 //Pick up and Delivery of iPhone device from London to Lagos
var db = function(object, fLoc, callback){
    
    // console.log('JJJJ 1: '+fLoc.filename)
    // console.log(Object.keys(fLoc))

    DataBasepool.getConnection(function(err, connection){
        var email = object.email
        // var fdate = object.flightdated
        var pname = object.product
        // var weight = object.weight
        // var status = o bject.status
        console.log('JJJJ 3: '+fLoc)
        var productImage = "http://75.127.75.161/courier/" + fLoc.filename

        // var data = [ object.email, object.flightdated, object.product, object.weight, object.status ]
        var sql = "insert into transactionstbl(usermail, product_name, product_img) values(?, ?, ?)"
        connection.query(sql, [email, pname, productImage], function (err, result) {
          if (err){
              console.log(err)
          } else{
            console.log('suuccessfully inserted '+result.insertId)
            callback(result.insertId)
          }
          connection.release()
           
          return result
        })
    })

}


var getCompanyInfo = function(cb){
    DataBasepool.getConnection(function(err, connection){
 
        var sql = "select * from infotbl where refnos = 1"
        connection.query(sql, function (err, result) {
          if (err){
              console.log(err)
          } else{
              connection.release()
              return cb(result);
            // console.log('Successfully Deleted '+result+ ' Records...')
          }
          
        //   connection.release()
        //   return result
        })
    })

}

var updateCompanyInfo = function(object, cb){
    
    
    DataBasepool.getConnection(function(err, connection){
        var email = object.email
        var phone = object.phone
        var addy1 = object.add1
        var addy2 = object.add2
        var addy3 = object.add3

        // var data = [ object.email, object.flightdated, object.product, object.weight, object.status ]

        // console.log('The object look like: '+object.add1+':::>'+object.add2)
        var sql = "update infotbl set phone = ?, email = ?, address = ?, address2 = ?, address3 = ?"
        connection.query(sql, [phone, email, addy1, addy2, addy3], function (err, result) {
            if (err){
                console.log(err)
            } else{
            console.log('Successfully updated '+result.affectedRows+ ' Records...')
            }
            connection.release()
            
            return cb()
        })
    })
}


var eraser = function(object, cb){
    console.log('The object look like: '+object)

    DataBasepool.getConnection(function(err, connection){ 
        var sql = "delete from transactionstbl where refnos = ?"
        connection.query(sql, [object], function (err, result) {
          if (err){
              console.log(err)
          } else{
            console.log('Successfully Deleted '+result.affectedRows+ ' Records...')
          }
          connection.release()
           
          return result
        })
    })

}

module.exports = function(app) { //start app route
    app.get('/', function(req, res) {
        console.log(path)
        console.log(__dirname)
        res.sendFile(path.join(__dirname + '/html/login.html'));
        // res.sendFile('html/login');
    });

    app.get('/about', function(req, res) {
        res.render('pages/about');
    });

    app.get('/new', function(req, res) {
        getAllData(function(response)
        {
            // Here you have access to your variable
            var list = response//YOUR OBJECT DATA
            var count= Object.keys(list).length; 
            
            var data = buildHtml(list)

            // console.log('Data from htmlbuilder: '+list)

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

    } )


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

    app.post('/rawdata', urlencodedParser, function(req, res){
        var project_id = req.body.projectid;
        var usermail = req.body.user;

        console.log('Project: '+project_id);
        console.log('User: '+usermail); 

        DataBasepool.getConnection(function(err, connection){
            // connection.query("call f_get_response_data()", function (err, result, fields) {
            connection.query("select * from questions_tbl where project_id = ? order by refnos", [project_id], function (err, result, fields) {
              if (err){

              }else{

                    // connection.query("call f_get_response_data()", function (err, responses, fields) {
                    connection.query("select * from question_response where project_id = ? order by usermail, question_refnos", [project_id], function(err, responses, fields){
                        if(err){

                        }
                        var topmail, bottommail;

                        console.log(responses);
                        
                        connection.query("select refnos, project_title from project where usermail = ?",[usermail], function(err, results, fields){
                            if(err){

                            }

                            res.render('pages/r_response', {
                                questions: result, 
                                responses: responses,
                                topmail: 'empty',
                                bottommail: 'fadolaftit@yahoo.com',
                                project: results
                            });

                            connection.release();
                        })
  
                  })

                  

              } 
            })
        })
 
    })

    app.get('/_rawresponse', function(req, res){
        var usermail = 'dolaf2007@yahoo.com';
        
        DataBasepool.getConnection(function(err, connection){
            connection.query("select refnos, project_title from project where usermail = ?",[usermail], function(err, results, fields){
                if(err){
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

                connection.release();
            })
        })
        
    })

    app.get('/getquestiongraphdata2', function(req, res){
        var questionid = req.query.questionid;
        DataBasepool.getConnection(function(err, connection){
            var sql = "select q.response_text as label, count(q.response_text) as series from question_response q where question_refnos = ? GROUP BY q.response_text";
            connection.query(sql, [questionid], function(err, results, fields){
                if(err){
                    throw err;
                }

                res.send({
                    results: results
                });
                // res.send(JSON.stringify(results));
                // res.send(results+"@"+result);

                console.log(results.length)
                console.log(JSON.stringify(results))
                console.log( JSON.stringify(results).length )
                 

                connection.release();

               


            })
        })
    })



    app.get('/getquestiongraphdata', function(req, res){
        var questionid = req.query.questionid;

        DataBasepool.getConnection(function(err, connection){
            var sql = "select q.response_text as labels from question_response q where question_refnos = ? GROUP BY q.response_text order by q.response_text";
            connection.query(sql, [questionid], function(err, results, fields){
                if(err){

                }
                var lbl = [];
                results.forEach(function(recs){
                    lbl.push(recs.labels); 
                })

                // console.log(lbl);

                connection.query("select count(q.response_text) as series from question_response q where question_refnos = ? GROUP BY q.response_text", [questionid], function(err, result, fields){
                    if(err){
    
                    }
                    var seriesval=[];

                    result.forEach(function(rec){
                        seriesval.push(rec.series);
                    })
                    
                    connection.query("select question from questions_tbl where refnos = ?", [questionid], function(err, resp, fields){
                        if(err) throw err

                        var question=[];
                        resp.forEach(function(row){
                            question.push(row.question);
                        })


                        res.send({
                            labels: results, 
                            series: seriesval,
                            question: question
                        });
                        // res.send(JSON.stringify(results));
                        // res.send(results+"@"+result);
    
                        console.log(seriesval)
                        // console.log(seriesval.length)
                        console.log(JSON.stringify(seriesval))
                        console.log( JSON.stringify(seriesval).length )
                        console.log("Options: "+seriesval)
        
                        connection.release();
                    })
                })
            })
        })
    })

    app.get('/getquestionoptions', function(req, res){
        var questionId = req.query.questionId;

        var sql = "SELECT * FROM options_tbl WHERE question_id = ?";
        DataBasepool.getConnection(function(err, connection){
            connection.query(sql, [questionId], function(err, result, fields){
                if(err) throw err

                console.log(result);

                res.send(result);

            })
        })
    })

    app.get('/reorderquestions', function(req, res){
        var objectArray = JSON.parse(req.query.objectId);
  
        DataBasepool.getConnection(function(err, connection){
            var project_id = objectArray[0].projectid;
            var sql = "update questions_tbl set question_no = ? where refnos = ?";

            objectArray.forEach((elm, idx)=>{
                var id=0; var pos=0; var projectid=0;
                id  = objectArray[idx].id;
                pos = objectArray[idx].position;
                projectid = objectArray[idx].projectid;

                connection.query(sql, [pos, id], function(err, result, fields){
                    if(err) throw err    
    
                })
                
            })
            connection.query("SELECT * FROM questions_tbl WHERE project_id = ? order by question_no", [project_id], function(err, results, fields){
                if(err) throw err

                console.log(results);

                res.send(results);

                connection.release();

            })
            
        })
 

    })

    app.post('/deletequestionoptions',urlencodedParser, function(req, res){
        var optionId = req.body.OptionId;
        var questionId = req.body.questionId;

        var sql = "DELETE FROM options_tbl where refnos = ?";
        DataBasepool.getConnection(function(err, connection){
            connection.query(sql, [optionId], function(err, result, fields){
                if(err) throw err

                connection.query("SELECT * FROM options_tbl WHERE question_id = ?", [questionId], function(err, results, fields){
                    if(err) throw err
    
                    console.log(results);
    
                    res.send(results);
                    connection.release();
    
                })

            })
        })

    })

    app.get('/getquestions', function(req,res){
        var project_id = req.query.projectid; //projectid

        // console.log('ProjectCode: '+project_id);

        DataBasepool.getConnection(function(err, connection){
            
            connection.query("select * from questions_tbl where project_id = ? order by question_no", [project_id], function(err, results, fields){
                if(err){
                    console.log(err);
                }                 

                var sql = "SELECT * FROM options_tbl as b WHERE EXISTS( SELECT * FROM questions_tbl as a WHERE b.question_id = a.refnos and a.project_id = ?)";

                connection.query(sql, [project_id], function(err, result, fields){
                    if(err) throw err;
                    
                    // console.log(results);
                    // console.log(result);
                    // console.log("dee:"+project_id);
                    
                    var obj={
                        questions:results, 
                        options: result
                    };

                    res.send(obj);
                    // res.send(results);
     
                    connection.release();
    
                })


                
            })
        })
    })

    app.get('/newquestion', function(req, res){
        var usermail = req.query.usermail.trim();

        DataBasepool.getConnection(function(err, connection){
            // connection.query("call f_get_response_data()", function (err, result, fields) {
            console.log(usermail);
                
            connection.query("select refnos, project_title from project where usermail = ?", [usermail], function(err, results, fields){
                if(err){
                    console.log(err);
                } 
                
                res.render('pages/questions', {
                    questions: results,
                    usermail: usermail,
                    projects: results

                });

                connection.release();
            })
        })


    })

    app.post('/insertquestion', urlencodedParser, function(req, res){
        var usermail = req.body.usermail.trim();
        var project_id = req.body.projectid;
        var question = req.body.question.trim();
        var position = req.body.position;

        console.log(req.body.projectid)

        DataBasepool.getConnection(function(err, connection){
            
            console.log(usermail);
                
            connection.query("insert into questions_tbl(project_id, question_no, question) values(?, ?, ?) ", [project_id, position, question], function(err, results, fields){
                if(err){
                    console.log(err);
                } 

                connection.query("select * from questions_tbl where project_id = ?", [project_id], function(err, result, fields){
                    if(err){
                        console.log(err);
                    }

                    connection.query("select refnos, project_title from project where usermail = ?", [usermail], function(err, resp, fields){
                        if(err){
                            console.log(err);
                        }
    
                        
                        
                        
                        res.render('pages/questions', {
                            questions: result,
                            usermail: usermail,
                            projects: resp
                        });
    
                        connection.release();
                    }) 
                }) 

            })
        })

    })

    app.get('/myprojects', function(req, res){
        var usermail = req.query.usermail.trim();
        DataBasepool.getConnection(function(err, connection){
            // connection.query("call f_get_response_data()", function (err, result, fields) {
            // console.log(usermail);
                
            connection.query("select refnos, project_title from project where usermail = ?", [usermail], function(err, results, fields){
                if(err){
                    console.log(err);
                }

                var xx = 0;
                results.forEach(function(row){
                    xx++;
                })

                
                // console.log(results);
                // console.log(usermail); 
                // // res.s
                // console.log('gbamgba dekun here truly...'+usermail);
                
                res.render('pages/newproject', {
                    usermail: usermail,
                    projects: results
                });

                connection.release();
            })
        })


        
    })

    app.post('/newproject', urlencodedParser, function(req, res){
        var usermail = (req.body.usermail).trim();
        var title    = (req.body.title).trim();    
        var sdate    = (req.body.sdate).trim();    
        var edate    = (req.body.edate).trim();    
        var reason   = (req.body.reason).trim();
        
        DataBasepool.getConnection(function(err, connection){
            
            console.log(usermail);
                
            connection.query("insert into project(project_title, usermail, startdate, enddate, reason) values(?, ?, ?, ?, ?) ", [title, usermail, sdate, edate, reason], function(err, results, fields){
                if(err){
                    console.log(err);
                } 

                connection.query("select refnos, project_title from project where usermail = ?", [usermail], function(err, results, fields){
                    if(err){
                        console.log(err);
                    }

                    var xx = 0;
                    results.forEach(function(row){
                        xx++;
                    }) 
                    
                    
                    res.render('pages/newproject', {
                        usermail: usermail,
                        projects: results
                    });

                    connection.release();
                }) 

            })
        })
        


    })

    app.get('/rawresponse', function(req, res){
        var project_id = 1; // req.body.project;
        var usermail = (req.query.usermail).trim(); //'dolaf2007@yahoo.com';
 
        console.log("Gotten: "+usermail );

        DataBasepool.getConnection(function(err, connection){
            // connection.query("call f_get_response_data()", function (err, result, fields) {
            console.log(usermail);
                
            connection.query("select refnos, project_title from project where usermail = ?", [usermail], function(err, results, fields){
                if(err){
                    console.log(err);
                }

                var xx = 0;
                results.forEach(function(row){
                    xx++;
                })

                // console.log(xx);
                // console.log(results);
                // console.log(usermail);
                // console.log(usermail.trim());
                
                // res.s
                res.render('pages/r_response', {
                    questions: results, 
                    responses: results,
                    topmail: 'empty',
                    bottommail: 'fadolaftit@yahoo.com',
                    project: results
                });

                connection.release();
            })
        })
    })

    app.get('/optns', function(req, res){
        var questionid = req.query.questionid;

        console.log(questionid)
        DataBasepool.getConnection(function(err, connection){
            
            var sql = "select * from options_tbl where question_id = ?"
            
            connection.query(sql, [questionid], function(err, result, fields){
                if(err){
                    console.log(err);
                }
                console.log(result)

                res.send(result);

                connection.release();
            })
        })
    })

    app.get('/getQuestionNumber', function(req, res){

        var questionId = req.query.questionId;
        console.log(questionId)
        DataBasepool.getConnection(function(err, connection){
            
            var sql = "select question_no from questions_tbl where refnos = ?"
            
            connection.query(sql, [questionId], function(err, result, fields){
                if(err){
                    console.log(err);
                }
                console.log(result)

                res.send(result);

                connection.release();
            })
        })
    })

    app.post('/savecondition', urlencodedParser, function(req, res){ 

        var questionId = req.body.questionId;
        var responseId = req.body.responseId;
        var gotoId = req.body.gotoId; 
        var gotoIndex = req.body.gotoIndex; 

        DataBasepool.getConnection(function(err, connection){
            
            var sql = "insert into question_conditions(question_id, response_id, goto, idx) values(?, ?, ?, ?)"
            
            connection.query(sql, [questionId, responseId, gotoId, gotoIndex], function(err, result, fields){
                if(err) throw err

                var answer = "success";

                console.log("Inserted rec: "+answer)
                
                res.send(answer);

                connection.release();

            })
        })

    })

    app.post('/deletequestioncondition', urlencodedParser, function(req, res){
        var referencenumber = req.body.referencenumber; 
        console.log('The code: '+referencenumber);

        DataBasepool.getConnection(function(err, connection){
            var sql = "delete FROM question_conditions where refnos = ?"; 
            connection.query(sql, [referencenumber], function(err, result, fields){
                if(err){
                    console.log(err);
                    res.send(err)
                    return;
                } 
                var dataObj;
                var qid, gotoid; 
                 
                res.send(result);

                connection.release();

            })
        })

    })

    app.get('/getquestioncondition', function(req, res){ 
        
        var questionId = req.query.questionId; 
        var responseId = req.query.responseId; 

        DataBasepool.getConnection(function(err, connection){
            var sql = "select qc.refnos, qc.question_id, qc.response_id, qc.`goto`, ot.response_text as selectedoption,  qt.question as focusquestion FROM question_conditions qc INNER JOIN questions_tbl qt ON qt.refnos = qc.goto INNER JOIN options_tbl ot ON ot.refnos = qc.response_id   where qc.question_id = ? and qc.response_id = ?"; 
            // var sql = "select * FROM question_conditions where response_id = ? and question_id = ?";
            console.log(questionId)
            console.log(responseId)
            connection.query(sql, [questionId, responseId], function(err, result, fields){
                if(err){
                    console.log(err);
                    res.send(err)
                    return;
                } 
                var dataObj;
                var qid, gotoid; 
                 
                res.send(result);

                connection.release();

            })
        })

    })

    app.get('/graphresponse', function(req, res){
        var project_id = 1; // req.body.project;
        var usermail = (req.query.usermail).trim(); //'dolaf2007@yahoo.com';
    
        console.log("Gotten for Graph: "+usermail );

        DataBasepool.getConnection(function(err, connection){
            // connection.query("call f_get_response_data()", function (err, result, fields) {
            console.log(usermail);
                
            connection.query("select refnos, project_title from project where usermail = ?", [usermail], function(err, results, fields){
                if(err){
                    console.log(err);
                }

                var xx = 0;
                results.forEach(function(row){
                    xx++;
                }) 

                // var sql = "SELECT b.refnos, b.project_id, b.question_no, b.question FROM questions_tbl as b SELECT * FROM project as a WHERE b.project_id = a.refnos and a.usermail = 'delafsolutions@gmail.com' )""

                var sql = "SELECT * FROM questions_tbl as b WHERE EXISTS( SELECT * FROM project as a WHERE b.project_id = a.refnos and a.usermail = ? )";

                connection.query(sql, [usermail], function(err, questions, fields){
                    
                    console.log(questions)

                    res.render('pages/r_graph', {
                        projects: results, //project
                        questions: questions,
                        topmail: 'empty',
                        bottommail: 'fadolaftit@yahoo.com',
                        project: results
                    });

                    connection.release(); 

                })
                
            })
        })
    })


    app.get('/savechoice', function(req, res){
        var questionid = req.query.questionid;
        var choice = req.query.choice;
        var type = req.query.type;

        DataBasepool.getConnection(function(err, connection){
                
            var sql = "insert into options_tbl(question_id, response_text, coltype) values(?, ?, ?)"
            
            connection.query(sql, [questionid, choice, type], function(err, results, fields){
                if(err){
                    console.log(err);
                    res.send(err)
                    return;
                }

                connection.query("select * from options_tbl where question_id = ?", [questionid], function(err, result, fields){
                    if(err){
                        console.log(err);
                    }
                    console.log(result)
    
                    res.send(result);
    
                    connection.release();
                })
    
            })
        })
    })

    app.post('/login', urlencodedParser, function(req, res){
        
        var user = req.body.user;
        var pass = req.body.pass;
        var valuestr="empty"
         
        DataBasepool.getConnection(function(err, connection){
          connection.query("select * from webusers where usermail = ? AND passkey = ?", [user, pass], function (err, result, fields) {
            if (err) throw err
            // console.log(result)            
      
            result.forEach(function(row) { 
              valuestr = row.FullName; 
            });  
            // console.log(valuestr)
            if(valuestr=='empty'){
              res.render('pages/404', {data: valuestr})  
            }else{
                res.render('pages/index', {
                    data: valuestr,
                    usermail: user
                })
            }
            //socket.emit('tracked', result)
            connection.release()
            // return result
          })
        })

    });

    app.get('/clientdata', function(req, res){
        console.log('Dele');

        var name = req.query.name;
        var email = req.query.email;
        var phone = req.query.phone;
        var location = req.query.location;
 
        // console.log('Dele 2'+ name);

        DataBasepool.getConnection(function(err, connection){
            if(err){
                res.send(err);
                connection.release();
                return;
            }

            var sql = "insert into clients(name, email, telephone, gpslocation) values(?, ?, ?, ?)";
            connection.query(sql, [name, email, phone, location], function(err, fields){
                if(err){
                    res.send(err.sqlMessage);
                    connection.release();
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
                connection.release(); 

            });

        });

    })

}; //end app route

/**
 * Function CALL to send E-Mail
 */
var emailsender = (a, b)=> {
    console.log(a);
    console.log(b);
}
