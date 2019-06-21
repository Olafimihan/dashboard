var express = require('express')
var socketIO = require('socket.io')
var bodyParser = require('body-parser')
 
var nodemailer = require('nodemailer')

const request = require('request')
// var cron = require('cron')

var path = require('path')
var http = require('http')

var mysql = require('mysql')
 

// cloudinary.uploader.upload("my_picture.jpg", function(result) { console.log(result) });

/**set your db connection here */
var DataBasepool = mysql.createPool({
  host: "127.0.0.1",
//    host: "75.127.75.161",
  user: "root",
  password: "opeyemi",
  database: "courierdb" 
})

var app = express()

var server = http.createServer(app)

var io = socketIO(server)


io.on('connection', (socket) => {
    console.log(socket+' Connected...')

    socket.on('track', (trackingnumber)=>{

      DataBasepool.getConnection(function(err, connection){
	      var sql = "select * from transactionstbl where refnos = ?";
        connection.query(sql, [trackingnumber], function (err, result, fields) {
          if (err) throw err
          //console.log(result)
          socket.emit('tracked', result)
          connection.release()
        })
      })
      
      console.log(trackingnumber)
    })

    socket.on('phone', ()=>{
        DataBasepool.getConnection(function(err, connection){
            connection.query("select * from infotbl where refnos = 1", function (err, result, fields) {
                var phone;	
                if (err) throw err
                result.forEach(function(row) { 
                    phone= row.phone; 
                });  

            
                console.log(result)
                socket.emit('phone', phone)
                connection.release()
            })
        })
      
    })

    socket.on('contact-us', (object)=>{
      console.log('The sent Data...')
      console.log(object)

      var name    = object.name
      var email   = object.email
      var phone   = object.phone
      var message = object.msg

      var output  = `
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
                      <h2>Service Request</h2> 
                  </div>

                  <div class='body' style="text-align: center; background-color: #fff; color: #000; font-family: 'Open Sans', sans-serif; font-size: 13px; padding: 1px; margin-top: 10px; border-radius: 2px 10px 0px 0px;">
                    Hi, A client with name ${name} has sent you a mail on ${email}. The message in the mail is as shown below:

                    
                    <p style='font-size: 22px; color: green' > ${message} </p>
                  
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
          to: "dolaf2007@yahoo.com, delafsolutions@gmail.com", // list of receivers
          // to: `${email}` ,

          subject: "Courier Service Request", // Subject line
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
              socket.emit('contact-us', info.messageId)
          }

      })
    })
 

});



server.listen(2023, () => {
	console.log(`Started on port 2023...`)
});
