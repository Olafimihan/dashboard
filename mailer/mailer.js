var nodemailer = require('nodemailer')

var mailer = (mailObject)=>{

    var flag = mailObject.flag;
    // console.log(flag);

    // console.log(errorObject);

  var output  = `
  <!DOCTYPE html>

  <html>
      <head>
          <title>Robot-driven Mails</title>
          <meta charset="utf-8" >
          <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1.0, user-scalable=no">
          <meta http-equiv="X-UA-Compatible" content="IE=edge" >
          <meta name="description" content="Software-driven Mails">
          <meta name="keywords" content="Software-driven Mails">
          <meta name="author" content="Software-driven Mails">
      </head>
      
      <body style='bacground-color: #fff'>

          <div class='container'>

              <div class='header' style="margin-left: auto; margin-right: auto; text-align: center; background-color: #2196F3; color: #Fff; font-family: 'Open Sans', sans-serif; font-size: 13px; padding: 1px; margin-top: 10px; border-radius:10px 10px 0px 0px;">
                  <h3>${errorObject.heading} </h3> 
              </div>
 

              <div class='body' style="text-align: center; background-color: #fff; color: #000; font-family: 'Open Sans', sans-serif; font-size: 13px; padding: 1px; margin-top: 10px; border-radius: 2px 10px 0px 0px;">
                  <p style='font-size: 16px; font-weight: bold'>This is an automated mail from a Robotic Mail Server.<br></p>
              
                  <p style='font-size: 14px; font-weight: bold'>welcome.: ${errorObject.error.code}</p><br>
                  <p style='font-size: 14px; font-weight: bold'>On board.: ${errorObject.error.errno}</p><br>
 

              </div>

              <div class='footer' style="margin-left: auto; margin-right: auto; text-align: center; background-color: #2196F3; color: #Fff; font-family: 'Open Sans', sans-serif; font-size: 13px; padding: 1px; margin-top: 10px; border-radius:10px 10px 0px 0px;">
                  Powered by Google.
              </div>

          </div>
          
      </body>
  </html>

  
  <body>
      
  </body>

  `

  // create reusable transporter object using the default SMTP transport
  var transporter = nodemailer.createTransport({service: 'Gmail', auth: {user: 'delafsystems@gmail.com',
          pass: 'Opeyemi123'
      }
  }); 

  // setup email data with unicode symbols
  var mailOptions = {
      from: '"DELAF Sytstems Support" <delafsystems@gmail.com>', // sender address
      to: "dolaf2007@yahoo.com", // list of receivers
      // to: `${object.email}` ,

      subject: "Welcome to TAMTEM Global Concepts.", // Subject line
      // text: "Hello world?", // plain text body
      html: output // html body
  }; 

  // send mail with defined transport object
  transporter.sendMail(mailOptions, (err, info) =>{
      if(err){
          
          console.log("Error Object: "+err)
      }else{
          console.log(`Email sent...%s`+info.messageId)
          console.log(`Email sent...%s`+info.accepted )
          console.log('Preview URL...%s'+nodemailer.getTestMessageUrl(info))
          socket.emit('contact-us', info.messageId)
      }

  })
}

module.exports = mailer;
