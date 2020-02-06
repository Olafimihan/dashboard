
app.initialize();

var questionaireLayout = (resObject) => {
  // alert(resObject.questions);
  // console.log(resObject.questions);

  var counter=0;

  /**Insert into  LOCAL tables */
  var $maincarousel = $('.main-carousel');
  var questionsArray = resObject.questions;
  var optionsArray   = resObject.options;
  var projectid      = resObject.projectid;
  localStorage.setItem("projectid", projectid);

  var carouselhtmlString="";
  
  // SQLite initiated for local action
  
  // surveyDB.transaction(function(tx) {
      /**WIRE THE questionaire into the phone SQLite database: surveydb.db
       * DB NAME: surveydb.db
       * ENGINE : Innodb
       * Platform: SQLite Cordova Plugin
       */

      // alert('dele');
      questionsArray.forEach(function(recs, idx) {

            counter++;
            carouselhtmlString += '<div class="carousel-cell">';

            var q_refnos = 0; var question = "";
            var q_required="", q_serialnumber=0;
                        
            q_refnos = questionsArray[idx].refnos;
            question = questionsArray[idx].question; 
            q_required = questionsArray[idx].required;
            q_serialnumber = questionsArray[idx].question_no;
            if(q_required=='yes') {
              $('.carousel').addClass('hidden');

              // carouselhtmlString += "<h6 style='text-align: center; background-color: #ffcccc; color: white; font-weight: bolder' >Question Requires response</h6></br>";
            }
            
            carouselhtmlString += '<h1 style="margin: 20px; font-size: 28px; background-color: whitesmoked; color: black" >' + question + '</h1></br>';  
            carouselhtmlString += '<h6 style="margin: 20px; font-size: 28px; background-color: whitesmoked; color: black" ><p id="responsetimer"></p></h6></br>';  
  
            var filtered = filter( optionsArray, {question_id: q_refnos } );
  
            //Add the customly created Options for each question here...
            filtered.forEach(function(options, indx) {
                var coltyp, idd, opt, ref, plh="";
                var opturl="", gotoid="", fromid="";
  
                ref     = filtered[indx].refnos;
                coltyp  = filtered[indx].coltype; /**Tells me the type of option in focus, either img, aud, vid, txt, num, rad, chk, sel */
                idd     = filtered[indx].question_id;
                opt     = filtered[indx].response_text;

                opturl  = filtered[indx].optionURL;
                gotoid  = filtered[indx].gotoquestionid;
                fromid  = filtered[indx].fromquestionid;

                // tx.executeSql('INSERT INTO options_tbl(refnos, question_id, response_text, coltype, optionURL, gotoquestionid, fromquestionid) VALUES (?, ?, ?, ?, ?, ?, ?)', [ref, idd, opt, coltyp, opturl, gotoid, fromid]
                //   , function(tx, resultSet) {
                //     alert('resultSet.insertId: ' + resultSet.insertId);
                //     alert('resultSet.rowsAffected: ' + resultSet.rowsAffected);

                //   }, function(error) {
                //     alert('INSERT error: ' + error.message);
                // }); 
  
                // options += '<input type="text" id="'+idd+'" value="'+opt+'" placeholder="'+ opt +'" >' ;
                if(coltyp=='txt') {
                    carouselhtmlString += '<div class="col-md-12" ><p class="col-md-12"></p><input style=" color: #000" class="chtype col-md-12" type="text" name="'+idd+'" id="'+ref+'" value="'+ q_required +'" placeholder="'+ opt +'" ></div>' + '</br>' ;
                }
                else if(coltyp=='num') {
                    // carouselhtmlString += '<input class="chtype" type="number" name="'+idd+'" id="'+ref+'" value="'+opt+'" placeholder="'+opt+'" >' + '</br>';
                    carouselhtmlString += '<p class="col-md-8"><input style="color: #000" class="chtype col-md-12" type="number" name="'+idd+'" id="'+ref+'" value="'+ q_required +'" placeholder="'+opt+'" ></p>' + '</br>';
                }
                else if(coltyp=='rad') {
                    // console.log('Dele Olafimihan')
                    carouselhtmlString += '<div class="col-md-12" style="background-color: pink; color: black" ><p class="col-md-4" style="background-color: red; color: white"> ' + opt + '</p><p class="col-md-6" ><input class="chtype" style="font-size: 12px; text-align: left" type="radio" name="'+idd+'" id="'+ref+'" value="'+q_required+'" placeholder ></p></div></br>';
                    // carouselhtmlString += '<div class="form-group col-md-8"><input class="chtype" type="radio" name="'+idd+'" id="'+ref+'" value="'+opt+'"  ></div> ' + opt + '</br>';
                }
                else if(coltyp=='chk') {
                    carouselhtmlString += '<p class="col-md-8"> '+opt + '<input class="chtype col-md-4" type="checkbox" name="'+idd+'" id="'+ref+'" value="'+q_required+'"  ></p></br>';
                }
                else if(coltyp=='img') {
                  carouselhtmlString += '<p class="col-md-8"><button class="chtype col-md-8 btn btn-primary" type="button" onclick="getCamera()"  name="'+idd+'" id="'+ref+'" value="'+ q_required +'"  >'+opt + '<i class="fa fa-camera" ></i></button></p> </br>';
                    carouselhtmlString += '<p class="col-md-8"><input class="chtype col-md-8" name="imgname" id="imgname" ></p> </br>';
                    carouselhtmlString += '<p class="col-md-12"><img class="chtype col-md-12" width="100" height="auto" alt="myImage" name="myImage" id="myImage" ></p> </br>';
                }else if(coltyp=='sel') {
                    carouselhtmlString += '<select class="chtype form-control" type="select" name="'+idd+'" id="'+ref+'" value="'+ q_required +'" >'+'<option>'+ opt +'</option>'+'</select>' ;
                                                
                    // carouselhtmlString += '</select>' ;
                }
            });
  
            carouselhtmlString += '</div>'; 
  
        });

        // alert('dayo')

    // }, function(error) {
    //   // OK to close here:
    //   console.log('transaction error: ' + error.message);
    //   surveyDB.close(()=>{
    //     console.log(error.message+' badly closed Database....')
    //   });
    // }, function() {
    //   // OK to close here:
    //   console.log('transaction ok');
    //   surveyDB.close(function() {
    //     console.log('database is closed ok');
    //   });
    // });

    //This is the save button CONCAT below
    // carouselhtmlString += '<div class="carousel-cell" ><button type="button" name="save" id="save" class="btn btn-success" >Submit Survey</button></div>'
    carouselhtmlString += '<div class="carousel-cell" style="margin-top: 30px" >'+
                            '<button type="button" name="save" id="save" onclick="saver()" class="btn btn-success btn-lg btn-block" >Submit Survey</button>'+
                            '<button type="button" name="refresh" id="refresh" onclick="refreshPage()" class="btn btn-primary btn-lg btn-block" > Refresh Form </button>'
                        '</div>'
    // carouselhtmlString += '<div class="carousel-cell" style="margin-top: 30px" ><button type="button" name="save" id="save" onclick="saver()" class="btn btn-success" > Refresh Form</button></div>'

    // console.log(carouselhtmlString);
    
    $('.main-carousel').html(carouselhtmlString);

    $('.main-carousel').flickity({
        // options
        cellAlign: 'left',
        contain: true,
        fullscreen: false, 
        contain: true, 
        pageDots: false, 
        prevNextButtons : true
        ,
        fade: true

    }); 

};

// 

var $carousel = $('.main-carousel');


// jQuery
$carousel.on( 'change.flickity', function( event, index ) {
  console.log( 'Slide changed to ' + index )
});

// jQuery
$carousel.on( 'settle.flickity', function( event, index ) {
  console.log( 'Flickity settled at ' + index );
});
var routeLogin = () => {
  // alert($('#user'))
  var user = 'dele';
  var pass = 'dele';
  var imei = 'dele1234';
  alert(user);

  $.ajax({
    url: 'http://75.127.75.161:8000/posts?',
    data: "user="+user,
    type: "GET",
    dataType: 'text',
    success: function(res) {
      console.log('Got AJAX response: ' + JSON.stringify(res));
      // $.each(res, function(i, item) {
      //   console.log('REPO NAME: ' + item.name);
      //   tx.executeSql("INSERT INTO tt values (?)", JSON.stringify(item.name));
      // });
    },
    error: (err)=>{
      console.log(err)
      alert(err);

    }
  });

};


function trackInputFiles(){
  var file=null;
  var reader=null;

  var reader = new FileReader();
  var file = document.getElementById('imgname').files[0];

  var reader = new FileReader();
  // $("#main").show('slow'); 

  // Closure to capture the file information.
  reader.onload = (function(theFile) {
    return function(e) {
      // Render thumbnail.
      var span = document.createElement('span');

      var nm = theFile.name;
      var len= nm.length; 

      if(len > 50){
          swal("Warning",theFile.type+" The File name length cannot be more than 50 letters!!!/n "+theFile.name, "warning");
          return;
      }


      // if(theFile.type !='image/jpeg' && theFile.type != 'image/gif'){
      //     swal("Warning",theFile.type+" File type not allowed...JPEG and GIF File type are allowed here!!!", "warning");
      //     return;
      // }
      
      span.innerHTML = ['<img class="thumb" src="'+e.target.result+ '" width="350" height="250" title="'+ escape(theFile.name)+ '"/>'];

      $("#list").html('<img class="thumb" src="'+e.target.result+ '" width="350" height="250" title="'+ escape(theFile.name)+ '"/>');
    };
  })(file);

  // Read in the image file as a data URL.
  reader.readAsDataURL(file);

}

var questionaireLocalLayout = () => {
  var counter=0; 
  
  var surveyDB = window.sqlitePlugin.openDatabase({name: "surveydb.db", location: 'default'});

  // alert(Object(surveyDB));

  var $maincarousel = $('.main-carousel');
  surveyDB.transaction((tx) => {
    
    var carouselhtmlString="";
  

    var query = "SELECT * FROM questions_tbl";
    tx.executeSql(query, [], function (tx, resultSet) {
      // console.log();
      console.log('Questions counted: '+resultSet.rows.length);

      for(x = 0; x < resultSet.rows.length; x++) {

        carouselhtmlString += '<div class="carousel-cell">';
        var q_refnos = 0; var question = "";
        var q_required="", q_serialnumber=0;

        q_refnos = resultSet.rows.item(x).refnos;
        question = resultSet.rows.item(x).question; 
        q_required = resultSet.rows.item(x).required;
        q_serialnumber = resultSet.rows.item(x).question_no;
        
        if(q_required=='yes') {
          // $('.carousel').addClass('hidden');
        }      
        carouselhtmlString += '<h1 style="margin: 20px; font-size: 28px; background-color: whitesmoked; color: black" >' + question + '</h1></br>';  
        // var filtered = filter( optionsArray, {question_id: q_refnos });
        carouselhtmlString += '</div>';


          // console.log("refnos: " + resultSet.rows.item(x).passkey +
          //         ", Question: " + resultSet.rows.item(x).passkey );

              
      }
      // some business logic code here
        
      //This is the save button CONCAT below
      // carouselhtmlString += '<div class="carousel-cell" ><button type="button" name="save" id="save" class="btn btn-success" >Submit Survey</button></div>'
      carouselhtmlString += '<div class="carousel-cell" style="margin-top: 30px" >'+
                            '<button type="button" name="save" id="save" onclick="saver()" class="btn btn-success btn-lg btn-block" >Submit Survey</button>'+
                            '<button type="button" name="refresh" id="refresh" onclick="refreshPage()" class="btn btn-primary btn-lg btn-block" > Refresh Form </button>'
                            '</div>';
      // carouselhtmlString += '<div class="carousel-cell" style="margin-top: 30px" ><button type="button" name="save" id="save" onclick="saver()" class="btn btn-success" > Refresh Form</button></div>'

      // console.log(carouselhtmlString);
      // alert(carouselhtmlString);
      
      $maincarousel.html(carouselhtmlString);

      $maincarousel.flickity({
          // options
          cellAlign: 'left',
          contain: true,
          fullscreen: false, 
          contain: true, 
          pageDots: false, 
          prevNextButtons : true,
          fade: true
      }); 

    },
    function (tx, error) {
        console.log('SELECT error: ' + error.message);
    }); 

    // var questionsArray = resObject.questions;
    // var optionsArray   = resObject.options;
    // var projectid      = resObject.projectid; 

  }, function(err) {
    console.log('Questionaire pick error: '+err);
    surveyDB.close();
  }, function() {
    console.log('Questions picked ok...');
    surveyDB.close();
  })

  
  

}
