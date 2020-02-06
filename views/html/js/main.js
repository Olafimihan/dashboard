app.initialize();

var routeLogin = () => {
// alert($('#user'))
var user = 'dele';
var pass = 'dele';
var imei = 'dele1234';
// alert(user);
$.ajax({
    url: "http://75.127.75.161:4000/register",
    cache: false,
    type: "GET",
    data: "user="+user+"&pass="+pass,
    dataType: "JSON",
    success: function(data){
    // alert(data.ans);
    // console.log(data.ans);
    // console.log(data);
    },
    error: function(error){
    alert(error.statusText)
    alert(Object.keys(error));
    }
});

};

function trackInputFiles() {
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
    var q_required="", reqstat="", q_serialnumber=0;
                
    q_refnos = questionsArray[idx].refnos;
    question = questionsArray[idx].question; 
    q_required = questionsArray[idx].required;
    q_serialnumber = questionsArray[idx].question_no;

    if (q_required=='yes') {
    $('.carousel').addClass('hidden');
    reqstat = "Response required"
    // carouselhtmlString += "<h6 style='text-align: center; background-color: #ffcccc; color: white; font-weight: bolder' >Question Requires response</h6></br>";
    } else {
    reqstat = "Not Required"
    }

    /** pick from here */
    carouselhtmlString += '<h3 class="quest " style="margin: 2px; font-size: 22px; background-color: transparent; color: black" >' + question + '</h3></br>'; 
    carouselhtmlString += '<input class="responsetimer hidden" style="margin: 20px; font-size: 28px; background-color: whitesmoked; color: black" id="responsetimer" type="text" ></br>';  
    carouselhtmlString += '<input class="cur_gps hidden" style="margin: 20px; font-size: 28px; background-color: whitesmoked; color: black" id="cur_gps" type="text" ></br>'; 
    carouselhtmlString += '<h3 class="q_required" style="margin: 20px; font-size: 10px; background-color: whitesmoked; color: red; font-style: italics" >'+ q_required +'</h3></br>';


    /***/
    
    // carouselhtmlString += '<h1 style="margin: 20px; font-size: 28px; background-color: whitesmoked; color: black" >' + question + '</h1></br>';  
    // carouselhtmlString += '<h3 style="margin: 20px; font-size: 28px; background-color: whitesmoked; color: black" ><p class="responsetimer"></p></h3></br>';  

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

        // options += '<input type="text" id="'+idd+'" value="'+opt+'" placeholder="'+ opt +'" >' ;
        if(coltyp=='txt') {
            carouselhtmlString += '<p class="col-md-12" ><input data-arrival data-departure data-location data-index="'+idx+'" data-goto="'+gotoid+'" data-timed style=" color: #000" class="chtype col-md-12" type="text" name="'+idd+'" id="'+ref+'" value="NONE" ></p>' + '</br>' ;

            // carouselhtmlString += '<p class="col-md-12" ><input style=" color: #000" class="chtype col-md-12" type="hidden" name="arrival_timer" id="' +ref+'#arr'+ '" ></p>' + '</br>' ;
            // carouselhtmlString += '<p class="col-md-12" ><input style=" color: #000" class="chtype col-md-12" type="hidden" name="departure_timer" id="' +ref+'#dep'+ '" ></p>' + '</br>' ;
            // carouselhtmlString += '<p class="col-md-12" ><input style=" color: #000" class="chtype col-md-12" type="hidden" name="gpslocation" id="' +ref+'#dep'+ '" ></p>' + '</br>' ;

        }
        else if(coltyp=='num') {
            // carouselhtmlString += '<input class="chtype" type="number" name="'+idd+'" id="'+ref+'" value="'+opt+'" placeholder="'+opt+'" >' + '</br>';
            carouselhtmlString += '<p class="col-md-8"><input data-arrival data-departure data-location data-index="'+idx+'" data-goto="'+gotoid+'" data-timed style="color: #000" class="chtype col-md-12" type="number" name="'+idd+'" id="'+ref+'" value="'+ opt +'" placeholder="'+opt+'" ></p>' + '</br>';

            // carouselhtmlString += '<p class="col-md-12" ><input style=" color: #000" class="chtype col-md-12" type="hidden" name="arrival_timer" id="' +ref+'#arr'+ '" ></p>' + '</br>' ;
            // carouselhtmlString += '<p class="col-md-12" ><input style=" color: #000" class="chtype col-md-12" type="hidden" name="departure_timer" id="' +ref+'#dep'+ '" ></p>' + '</br>' ;
            // carouselhtmlString += '<p class="col-md-12" ><input style=" color: #000" class="chtype col-md-12" type="hidden" name="gpslocation" id="' +ref+'#dep'+ '" ></p>' + '</br>' ;

        }
        else if(coltyp=='rad') {
            // console.log('Dele Olafimihan') <label for = "sizeSmall">small</label>
            // <input type="radio" name="gender" value="male" checked> Male<br>

            carouselhtmlString += '<p><input data-arrival data-departure data-location data-gps data-index="'+idx+'" data-goto="'+gotoid+'" data-timed type="radio" class="chtype" name="'+idd+'" id="'+ref+'" value="'+opt+'"  />'+opt+'</p></br>';

            // carouselhtmlString += '<p class="col-md-12" ><input style=" color: #000" class="chtype col-md-12" type="hidden" name="arrival_timer" id="' +ref+'#arr'+ '" ></p>' + '</br>' ;
            // carouselhtmlString += '<p class="col-md-12" ><input style=" color: #000" class="chtype col-md-12" type="hidden" name="departure_timer" id="' +ref+'#dep'+ '" ></p>' + '</br>' ;
            // carouselhtmlString += '<p class="col-md-12" ><input style=" color: #000" class="chtype col-md-12" type="hidden" name="gpslocation" id="' +ref+'#dep'+ '" ></p>' + '</br>' ;

            // carouselhtmlString += '<div style="text-align: center; background-color: red"><p><input type="radio" class="chtype" style="" name="'+idd+'" id="'+ref+'" value="'+opt+'"  >'+opt+'</p></div></br>';

            // carouselhtmlString += '<p class="" style="background-color: pink; color: black" ><p class="" style="background-color: whitesmoked; color: black"> ' + opt + '</p> <p class="" ><input class="chtype" style="font-size: 12px; text-align: left" type="radio" name="'+idd+'" id="'+ref+'" value="'+opt+'"  ></p></p></br>';
            // carouselhtmlString += '<div class="form-group col-md-8"><input class="chtype" type="radio" name="'+idd+'" id="'+ref+'" value="'+opt+'"  ></div> ' + opt + '</br>';
        }
        else if(coltyp=='chk') {
            carouselhtmlString += '<p> <input data-arrival data-departure data-location data-gps data-index="'+idx+'" data-goto="'+gotoid+'" data-timed type="checkbox" class="chtype" name="'+idd+'" id="'+ref+'" value="'+opt+'" />'+opt+'</p></br>';

            // carouselhtmlString += '<p class="col-md-12" ><input style=" color: #000" class="chtype col-md-12" type="hidden" name="arrival_timer" id="' +ref+'#arr'+ '" ></p>' + '</br>' ;
            // carouselhtmlString += '<p class="col-md-12" ><input style=" color: #000" class="chtype col-md-12" type="hidden" name="departure_timer" id="' +ref+'#dep'+ '" ></p>' + '</br>' ;
            // carouselhtmlString += '<p class="col-md-12" ><input style=" color: #000" class="chtype col-md-12" type="hidden" name="gpslocation" id="' +ref+'#dep'+ '" ></p>' + '</br>' ;

        }
        else if(coltyp=='img') {
        carouselhtmlString += '<p class="col-md-8"><button data-arrival data-departure data-location data-index="'+idx+'" data-goto="'+gotoid+'" data-timed class="chtype col-md-8 btn btn-primary" type="button" onclick="getCamera()"  name="'+idd+'" id="'+ref+'" value="'+ opt +'"  >'+opt + '<i class="fa fa-camera" ></i></button></p> </br>';

            carouselhtmlString += '<p class="col-md-8"><input class="chtype col-md-8" name="imgname" id="imgname" ></p> </br>';
            carouselhtmlString += '<p class="col-md-12"><img class="chtype col-md-12" width="100" height="auto" alt="myImage" name="myImage" id="myImage" ></p> </br>';

            // Timer
            // carouselhtmlString += '<p class="col-md-12" ><input style=" color: #000" class="chtype col-md-12" type="hidden" name="arrival_timer" id="' +ref+'#arr'+ '" ></p>' + '</br>' ;
            // carouselhtmlString += '<p class="col-md-12" ><input style=" color: #000" class="chtype col-md-12" type="hidden" name="departure_timer" id="' +ref+'#dep'+ '" ></p>' + '</br>' ;
            // carouselhtmlString += '<p class="col-md-12" ><input style=" color: #000" class="chtype col-md-12" type="hidden" name="gpslocation" id="' +ref+'#dep'+ '" ></p>' + '</br>' ;


        }
        else if(coltyp=='sel') {
            carouselhtmlString += '<p ><select data-arrival data-departure data-location data-index="'+idx+'" data-goto="'+gotoid+'" data-timed class="chtype form-control" type="select" name="'+idd+'" id="'+ref+'" value="'+ opt +'" >'+'<option>'+ opt +'</option>'+'</select></p></br>' ;
            // carouselhtmlString += '<p class="col-md-12" ><input style=" color: #000" class="chtype col-md-12" type="hidden" name="arrival_timer" id="' +ref+'#arr'+ '" ></p>' + '</br>' ;
            // carouselhtmlString += '<p class="col-md-12" ><input style=" color: #000" class="chtype col-md-12" type="hidden" name="departure_timer" id="' +ref+'#dep'+ '" ></p>' + '</br>' ;
            // carouselhtmlString += '<p class="col-md-12" ><input style=" color: #000" class="chtype col-md-12" type="hidden" name="gpslocation" id="' +ref+'#dep'+ '" ></p>' + '</br>' ;

            // carouselhtmlString += '<p ><select class="chtype form-control" type="select" name="'+idd+'" id="'+ref+'" value="'+ opt +'" >'+'<option>'+ opt +'</option>'+'</select></p></br>' ;
                                        
            // carouselhtmlString += '</select>' ;
        }
    });

    carouselhtmlString += '</div>'; 

});    

//This is the save button CONCAT below
// carouselhtmlString += '<div class="carousel-cell" ><button type="button" name="save" id="save" class="btn btn-success" >Submit Survey</button></div>'
carouselhtmlString += '<div class="carousel-cell" style="margin-top: 30px" >'+
                        '<button type="button" name="save" id="save" onclick="saver()" class="btn btn-success btn-lg" >Submit Survey</button>'+
                        '<button type="button" name="refresh" id="refresh" onclick="refreshPage()" class="btn btn-primary btn-lg" > Refresh Form </button>'
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
    prevNextButtons : true,
    fade: true

}); 

};

var $carousel = $('.main-carousel');

// The Local device operation point
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
    // console.log('Questions counted: '+resultSet.rows.length);

    for(x = 0; x < resultSet.rows.length; x++) {
        counter++;
        carouselhtmlString += '<div class="carousel-cell">';

        var q_refnos = 0; var question = "";
        var q_required="", q_serialnumber=0;

        q_refnos = resultSet.rows.item(x).refnos;
        question = resultSet.rows.item(x).question; 
        q_required = resultSet.rows.item(x).required;
        q_serialnumber = resultSet.rows.item(x).question_no;
        
        if(q_required=='yes') {
        $('.carousel').addClass('hidden');

        // carouselhtmlString += "<h6 style='text-align: center; background-color: #ffcccc; color: white; font-weight: bolder' >Question Requires response</h6></br>";
        }

        /** pick from here */
        carouselhtmlString += '<h3 class="quest " style="margin: 2px; font-size: 22px; background-color: transparent; color: black" >' + question + '</h3></br>'; 
        carouselhtmlString += '<input class="responsetimer " style="margin: 20px; font-size: 28px; background-color: whitesmoked; color: black" id="responsetimer" type="text" /></br>';  
        carouselhtmlString += '<h3 class="q_required hidden" style="margin: 20px; font-size: 28px; background-color: whitesmoked; color: black" >'+ q_required +'</h3></br>';  

        tx.executeSql("select * from options_tbl where question_id = ?", [q_refnos], function(t, res){
        // console.log('Options counted: '+res.rows.length);
        for(var y = 0; y < res.rows.length; y++) { /** pick all options for each question */
        
            var coltyp, idd, opt, ref, plh="";
            var opturl="", gotoid="", fromid="";

            ref     = res.rows.item(y).refnos; //filtered[indx].refnos;
            
            idd     = res.rows.item(y).question_id;
            opt     = res.rows.item(y).response_text;
            opturl  = res.rows.item(y).optionURL;
            gotoid  = res.rows.item(y).gotoquestionid;
            fromid  = res.rows.item(y).fromquestionid;
            // fromid  = filtered[indx].fromquestionid;

            coltyp  = res.rows.item(y).coltype; /**Tells me the type of option in focus, either img, aud, vid, txt, num, rad, chk, sel */
            
            // console.log(opt+":::"+coltyp)
            if(coltyp=='txt') {
                carouselhtmlString += '<p class="col-md-12" ><input style=" color: #000" class="chtype col-md-12" type="text" data-goto="'+gotoid+'" name="'+idd+'" id="'+ref+'" value="'+ opt +'" placeholder="'+ opt +'" ></p>' + '</br>' ;
            }
            else if(coltyp=='num') {
                // carouselhtmlString += '<input class="chtype" type="number" name="'+idd+'" id="'+ref+'" value="'+opt+'" placeholder="'+opt+'" >' + '</br>';
                carouselhtmlString += '<p class="col-md-8"><input style="color: #000" class="chtype col-md-12" type="number" data-goto="'+gotoid+'" name="'+idd+'" id="'+ref+'" value="'+ opt +'" placeholder="'+opt+'" ></p>' + '</br>';
            }
            else if(coltyp=='rad') {
                // console.log('Dele Olafimihan') <label for = "sizeSmall">small</label>
                // <input type="radio" name="gender" value="male" checked> Male<br>

                carouselhtmlString += '<p><input type="radio" data-goto="'+gotoid+'" class="chtype" name="'+idd+'" id="'+ref+'" value="'+opt+'"  />'+opt+'</p></br>';
                // carouselhtmlString += '<div style="text-align: center; background-color: red"><p><input type="radio" class="chtype" style="" name="'+idd+'" id="'+ref+'" value="'+opt+'"  >'+opt+'</p></div></br>';

                // carouselhtmlString += '<p class="" style="background-color: pink; color: black" ><p class="" style="background-color: whitesmoked; color: black"> ' + opt + '</p> <p class="" ><input class="chtype" style="font-size: 12px; text-align: left" type="radio" name="'+idd+'" id="'+ref+'" value="'+opt+'"  ></p></p></br>';
                // carouselhtmlString += '<div class="form-group col-md-8"><input class="chtype" type="radio" name="'+idd+'" id="'+ref+'" value="'+opt+'"  ></div> ' + opt + '</br>';
            
            }
            else if(coltyp=='chk') {
                carouselhtmlString += '<p> <input type="checkbox" data-goto="'+gotoid+'" class="chtype" name="'+idd+'" id="'+q_refnos+'" value="'+opt+'"  />'+opt+'</p></br>';
            }
            else if(coltyp=='img') {
            carouselhtmlString += '<p class="col-md-8"><button class="chtype col-md-8 btn btn-primary" type="button" onclick="getCamera()"  name="'+idd+'" id="'+ref+'" value="'+ opt +'"  >'+opt + '<i class="fa fa-camera" ></i></button></p> </br>';
                carouselhtmlString += '<p class="col-md-8"><input class="chtype col-md-8" name="imgname" id="imgname" ></p> </br>';
                carouselhtmlString += '<p class="col-md-12"><img class="chtype col-md-12" width="100" height="auto" alt="myImage" name="myImage" id="myImage" ></p> </br>';
            }
            else if(coltyp=='sel') {
                carouselhtmlString += '<p ><select class="chtype form-control" type="select" data-goto="'+gotoid+'" name="'+idd+'" id="'+ref+'" value="'+ opt +'" >'+'<option>'+ opt +'</option>'+'</select></p></br>' ;
                // carouselhtmlString += '<p ><select class="chtype form-control" type="select" name="'+idd+'" id="'+ref+'" value="'+ opt +'" >'+'<option>'+ opt +'</option>'+'</select></p></br>' ;
                                            
                // carouselhtmlString += '</select>' ;
            }
        } /** End of options pick */

        // console.log(carouselhtmlString)


        }, function(err){
        console.log("Option pick Error: "+err);
        })

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
    alert(carouselhtmlString);
    
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

// function filters(arr, criteria) {
//     return arr.filters(function(obj) {
//         return Object.keys(criteria).every(function(c) {
//         return obj[c] == criteria[c];
//         });
//     });
// }; 


$carousel.on( 'select.flickity', function( event, index ) {
// console.log( 'Flickity select ' + index );
// console.log( $('.quest').html() );

});

$carousel.on( 'ready.flickity', function() { /** Upon readiness of the flickity plugin */
console.log('Flickity ready');
var d = new Date();
var tt = d.toLocaleTimeString();

var parentDOM = document.getElementsByClassName("carousel-cell")[0].getElementsByClassName("chtype");//
// var arrivalDOM = parentDOM.getElementsByName('arrival_timer'); //
//.value = tt // The moving page to be checked for null value

name = parentDOM[0].name;
typ = parentDOM[0].type;

// data-arrival data-departure data-location data-index="'+idx+'" data-goto="'+gotoid+'" data-timed 

if(typ=='radio') {
    parentDOM[0].dataset.arrival=tt; /** set the timestamp into dataset  */
    parentDOM[0].dataset.location=localStorage.getItem("geolocation"); /** set the timestamp into dataset  */
}

if(typ=='checkbox') {
    parentDOM[0].dataset.arrival=tt; /** set the timestamp into dataset  */
    parentDOM[0].dataset.location=localStorage.getItem("geolocation"); /** set the timestamp into dataset  */
}

if(typ=='text') {
    parentDOM[0].dataset.arrival=tt; /** set the timestamp into dataset  */
    parentDOM[0].dataset.location=localStorage.getItem("geolocation"); /** set the timestamp into dataset  */
}

if(typ=='number') {
    parentDOM[0].dataset.arrival=tt; /** set the timestamp into dataset  */
    parentDOM[0].dataset.location=localStorage.getItem("geolocation"); /** set the timestamp into dataset  */
}

if(typ=='image') {
    parentDOM[0].dataset.arrival=tt; /** set the timestamp into dataset  */
    parentDOM[0].dataset.location=localStorage.getItem("geolocation"); /** set the timestamp into dataset  */
}

if(typ=='select') {
    parentDOM[0].dataset.arrival=tt; /** set the timestamp into dataset  */
    parentDOM[0].dataset.location=localStorage.getItem("geolocation"); /** set the timestamp into dataset  */
}

console.log(parentDOM);
// console.log(typ);

// var name, typ;

// for(var h = 0; h < parentDOM.length; h++) {
//   name = parentDOM[h].name;
//   typ = parentDOM[h].type;
//   if(name=="arrival_timer"){
//     parentDOM[h].value=tt; 
//   }
//   if(name=="gpslocation"){
//     parentDOM[h].value=localStorage.getItem("geolocation"); 
//   }

// }



// console.log(parentDOM);


// console.log(parentDOM)
// parentDOM.getElementsByClassName()

});




// jQuery
$carousel.on( 'change.flickity', function( event, index ) {

var parentDOM = document.getElementsByClassName("carousel-cell")[index - 1];// The moving page to be checked for null value

// console.log(parentDOM.getElementsByClassName("q_required")[index - 1]);
var q_req = document.getElementsByClassName("carousel-cell")[index - 1].getElementsByClassName("q_required")[0].innerHTML;
var opt_elementofQuest = parentDOM.getElementsByClassName("chtype"); //Get the chtype class from parent DOM of the previous carousel page
console.log(opt_elementofQuest);

var elmtype, elchkst;
var pg_pusher = false;

// ensuring no BLANK value
// need to know the type of element in view

for (k = 0; k < opt_elementofQuest.length; k++) {
    elmtype = opt_elementofQuest[k].type;
    // console.log(elmtype);

    if(elmtype=="radio") {
    // treat radio element
    elchkst = opt_elementofQuest[k].checked; /** Get the checked status of current radio elm */
    // console.log(elchkst);
    if(elchkst) {
        // get the gotoid at this point
        var dataset=opt_elementofQuest[k].dataset;

        console.log(dataset);
        // qualified to move
        pg_pusher = true;
    }
    }
    else if(elmtype=="checkbox") {
    // treat checkboxes
    
    elchkst = opt_elementofQuest[k].checked; /** Get the checked status of current radio elm */
    // console.log(elchkst);
    if(elchkst) { /** the element is checked */
        // 
        var dataset=opt_elementofQuest[k].dataset;

        console.log(dataset);
        // qualified to move
        pg_pusher = true;
        // alert(pg_pusher)
    }
    
    }
    else if(elmtype=="text") {
    // treat text boxes
    elchkst = opt_elementofQuest[k].value; /** Get the checked status of current radio elm */
    if(elchkst==""){
        pg_pusher=false;
    } else {
        pg_pusher=true;
    }

    }

} 

// ensure no BLANK input
if( !pg_pusher ) { /** pg_pusher variable will be set to true at the top and after checking all elements status */
    // restrict movement
    $carousel.flickity( 'select', index-1, false, true)
    alert('Response Required here...');
    // return;
}

// write Arrival Date for current page and departure date for previous page.
var parentDOMs = document.getElementsByClassName("carousel-cell")[index].getElementsByClassName("chtype");//
var parentDOMsp = document.getElementsByClassName("carousel-cell")[index - 1].getElementsByClassName("chtype");//

var d = new Date();
var tt = d.toLocaleTimeString();
var name, typ;

typ = parentDOMs[index].type; //current DOM page
    
if(typ=='radio') {
    parentDOM[index].dataset.arrival=tt; /** set the timestamp into dataset  */
    parentDOM[index].dataset.location=localStorage.getItem("geolocation"); /** set the timestamp into dataset  */
}

if(typ=='checkbox') {
    parentDOM[index].dataset.arrival=tt; /** set the timestamp into dataset  */
    parentDOM[index].dataset.location=localStorage.getItem("geolocation"); /** set the timestamp into dataset  */
}

if(typ=='text') {
    parentDOM[index].dataset.arrival=tt; /** set the timestamp into dataset  */
    parentDOM[index].dataset.location=localStorage.getItem("geolocation"); /** set the timestamp into dataset  */
}

if(typ=='number') {
    parentDOM[index].dataset.arrival=tt; /** set the timestamp into dataset  */
    parentDOM[index].dataset.location=localStorage.getItem("geolocation"); /** set the timestamp into dataset  */
}

if(typ=='image') {
    parentDOM[index].dataset.arrival=tt; /** set the timestamp into dataset  */
    parentDOM[index].dataset.location=localStorage.getItem("geolocation"); /** set the timestamp into dataset  */
}

if(typ=='select') {
    parentDOM[index].dataset.arrival=tt; /** set the timestamp into dataset  */
    parentDOM[index].dataset.location=localStorage.getItem("geolocation"); /** set the timestamp into dataset  */
}


// writing to the previous page dataset attribute {departure time}
typ2 = parentDOMsp[index-1].type; // INIT element type of previous  DOM page

if(typ2=='radio') {
    parentDOMsp[index-1].dataset.departure=tt; /** set the timestamp into dataset  */
}

if(typ2=='checkbox') {
    parentDOMsp[index-1].dataset.departure=tt; /** set the timestamp into dataset  */
}

if(typ2=='text') {
    parentDOMsp[index-1].dataset.departure=tt; /** set the timestamp into dataset  */
}

if(typ2=='number') {
    parentDOMsp[index-1].dataset.departure=tt; /** set the timestamp into dataset  */
}

if(typ2=='image') {
    parentDOMsp[index-1].dataset.departure=tt; /** set the timestamp into dataset  */
}

if(typ2=='select') {
    parentDOMsp[index-1].dataset.departure=tt; /** set the timestamp into dataset  */
}


// monitor the change event and switch to write for previous page 
// watch out for prev page after skipping




});

// select an element
$carousel.on('select.flickity', (event, index)=>{

})

// jQuery
$carousel.on( 'settle.flickity', function( event, index ) { 


});

$carousel.on('staticClick.flickity', function( event, pointer, cellElement, cellIndex ) {
    
});

// $carousel.flickity();

$(document).ready(function(){

/** The login button pressed */
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
;
    var device = localStorage.getItem('IMEI');
    var inObj = {
        user: user, 
        pass: pass,
        imei: device
    };

    // CALL THE SERVER
    $.ajax({
        url: "http://75.127.75.161:4000/login",
        cache: false,
        type: "GET",
        data: "user="+user+"&pass="+pass+"&imei="+device,
        dataType: "JSON",
        success: function(data) {
        // alert(data.ans);
        // console.log(data.ans);
        console.log(data);

        if(data.resp !== 'success') {
            swal('Bad Parameters', data.error, 'error');
            $('.reg').addClass('hidden');
            $('.singin').removeClass('hidden');
            $('.questionaire').addClass('hidden');

            return; 
        } else {
            $('.reg').addClass('hidden');
            $('.singin').addClass('hidden');
            $('.questionaire').removeClass('hidden');

            localStorage.setItem('_surveytoken', data.resp);

            questionaireLayout(data); /**for KNOWN devices */

        }
        },
        error: function(error){
        alert(error.statusText)
        alert(Object.keys(error));
        }
    })
    }
    
}); /**End of Login */


/** The Register button pressed. This runs only once on every devices. */
$('#register').click(function() {
    var username = $('#username').val();
    var email    = $('#email').val();
    var phone    = $('#phone').val();

    // please encrypt these values later on.
    localStorage.setItem('username', $('#user').val());
    localStorage.setItem('passkey',  $('#pass').val());

    var u_login = $('#user').val();
    var pass = $('#pass').val();
    // var devicetype = device.

    var model = localStorage.getItem('maker');
    var imei  = localStorage.getItem('IMEI');
    var gps   = localStorage.getItem('geolocation');

    // var GPSArray = gps.split(',');
    var regObj = {
        user: username,
        email: email,
        phone: phone,
        model: model,
        imei: imei,
        u_login: u_login,
        pass: pass,
        gps: gps
    };
    
    /**UNKNOWN Device login */
    $.ajax({
    url: "http://75.127.75.161:4000/register",
    cache: false,
    type: "GET",
    data: "user="+username+"&u_login="+u_login+"&pass="+pass+"&phone="+phone+"&imei="+imei+"&email="+email+"&model="+model+"&gps="+gps,
    dataType: "json",
    success: function(resObject) {

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

        // console.log(resObject.questions);
        var q_Array = resObject.questions;
        var opt_Array   = resObject.options;
        var question, q_refnos, q_required, q_serialnumber;

        var o_resptext, o_refnos, o_questionid, o_coltype, o_goto, o_from, o_opturl;
        // console.log(q_Array);
        
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
                alert('Option_tbl Error: '+ err.message);
                console.log(err.message);
            });
        }) /** End of Options array */
            
        // console.log(opt_Array);

        q_Array.forEach((rec, idx) => { /**Question Array Dumps for first TIMERs */
            question = q_Array[idx].question; 
            q_refnos = q_Array[idx].refnos;
            question = q_Array[idx].question; 
            q_required = q_Array[idx].required;
            q_serialnumber = q_Array[idx].question_no;

            tx.executeSql('INSERT INTO questions_tbl(refnos, project_id, question_no, question, required) VALUES (?, ?, ?, ?, ?)', [q_refnos, 0, q_serialnumber, question, q_required]
            , function(tr, res){
                // alert('resultSet.insertId: ' + res.rows.length);
                // alert('resultSet.rowsAffected: ' + res.rowsAffected);
        
            }, function(err){
                alert('Quest Error: '+ err.message);
                console.log(err.message);
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


        } /** end of else if */



        // End line os success callback
    },
    error: function(error) {
        alert("Error: "+error.statusText);
        alert(Object.keys(error));
        console.log(error.responseJSON);
        console.log(Object.keys(error.responseJSON));
    }
    });
    
}); /**end register */

});

var saver = () => {
/**THE  SAVE  CODE STARTS HERE
*/ 
$('#save').attr('disabled', true);

//  $('#save').on('click', () => {
        
        
// let timerDivs = document.getElementsByClassName("responsetimer");
// document.getElementsByClassName("carousel-cell");

// console.log('T H E   C O N T E N T S   I N   T H E  T I M E R ');

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
var stime="", etime="";
var quest_gps="";

var pos=0;


// timerDivs.forEach((rows)=>{
//   console.log(rows)

$('.chtype').each(function(index, element) { //this class: .chtype contains all the elements for data input
    var DOMname = $(this).name;//
    

    var $me = $(this);
    // console.log($me);
    var nam = $me[0].name

    console.log(nam);

    if(nam=="arrival_timer"){
    stime = $(this)[0].value;
    // console.log(stime)
    }
    if(nam=="departure_timer"){
    etime = $(this)[0].value;
    // console.log(stime)

    responseTimer = stime +"#"+ etime;
    // answer += stime +"#"+ etime;
    }
    if(nam=="gpslocation"){
    quest_gps = $(this)[0].value;
    }



    if($(this).attr('type')=="radio") {
        

        let chkbox = document.getElementsByName(questionid);
        

        // var nm = $(this).name;
        
        // console.log("index: "+index);

        // var parentDOM = document.getElementsByClassName("carousel-cell")[index].getElementsByClassName("chtype");//

        // console.log(parentDOM);
        
            
        if($(this).is(':checked')) {
        
        answer =  $(this).val();
        questionid = $(this).attr('name');

            
            // responseTimer=$(this).getElementsByName("")
        //  responseTimer = $('.responsetimer').val();
        //  responseTimer = document.getElementsByClassName("responsetimer")[pos].innerText;

        //  responseTimer = timerDivs[index].value;

        // resultObj += '{"imei": "'+IMEI+'", "timer": "'+responseTimer +'", "dated": "'+usermail+'", "project_id": "'+projectid+'", "question_id": "'+questionid+'", "answer": "'+ answer+"|"+responseTimer +'", "gps": "'+geolocation+'"  }, ';
            resultObj += '{"curr_gps": "'+quest_gps+'", "imei": "'+IMEI+'", "timer": "'+stime +"#"+etime +'", "dated": "'+usermail+'", "project_id": "'+projectid+'", "question_id": "'+questionid+'", "answer": "'+answer+'", "gps": "'+geolocation+'"  }, ';
        }

    }else if($(this).attr('type')=="number") {
        
        answer =  $(this).val()
        questionid = $(this).attr('name');
    //  responseTimer = $('.responsetimer').val();
    //  responseTimer = document.getElementsByClassName("responsetimer")[pos].innerText;
        //  responseTimer = timerDivs[index].value;

        resultObj += '{"curr_gps": "'+quest_gps+'", "imei": "'+IMEI+'", "timer": "'+responseTimer+'", "dated": "'+usermail+'", "project_id": "'+projectid+'", "question_id": "'+questionid+'", "answer": "'+answer+'", "gps": "'+geolocation+'" }, ';

    }else if($(this).attr('type')=="text") {
        /** pick the image file here store in local storage for offline mode 
            * and straight 
            * to live server in online mode */
        answer =  $(this).val() 
        questionid = $(this).attr('name') 
    //  responseTimer = $('.responsetimer').val();
    //  responseTimer = timerDivs[index].value;

        resultObj += '{"curr_gps": "'+quest_gps+'", "imei": "'+IMEI+'", "timer": "'+responseTimer+'", "dated": "'+usermail+'", "project_id": "'+projectid+'", "question_id": "'+questionid+'", "answer": "'+answer+'", "gps": "'+geolocation+'" }, ';

    }else if($(this).attr('type')=="img" ) { //images
        answer =  $(this).val()
        questionid = $(this).attr('name') 
        resultObj += '{"curr_gps": "'+quest_gps+'", "imei": "'+IMEI+'", "timer": "'+responseTimer+'", "dated": "'+usermail+'", "project_id": "'+projectid+'", "question_id": "'+questionid+'", "answer": "'+answer+'", "gps": "'+geolocation+'" }, ';
    }else if($(this).attr('type')=="checkbox") {
    questionid = $(this).attr('name') 
    var cst, chst;
    let chkbox = document.getElementsByName(questionid);

    var ans="";

    for(var x = 0; x < chkbox.length; x++){
        cst = chkbox[x].value;
        chst = chkbox[x].checked

        // console.log(cst+":::"+chst);
        
        if(chst){
        // alert(answer+":::"+questionid);
        ans += cst +', ';
        }
    }
    // console.log(ans)

    var chkanswer =  $(this).val();
    answer = ans;
    resultObj += '{"curr_gps": "'+quest_gps+'", "imei": "'+IMEI+'", "timer": "'+responseTimer+'", "dated": "'+usermail+'", "project_id": "'+projectid+'", "question_id": "'+questionid+'", "answer": "'+answer+'", "gps": "'+geolocation+'" }, ';
    } 

}) // end of .each


// }) // end of foreach

console.log(resultObj)

resultObj = resultObj.substring(0, resultObj.lastIndexOf(","));

//  swal('Error!', 'No server configured for CRUD operation!!!', 'error');

resultObj += ']';

// alert(resultObj);
// alert(resultObj.length);

/**Check the Network status and DETERMINE 
* eithr to save locally or save on the 
* iCloud live server */

var netState = checkConnection();

console.log(netState);

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
$.ajax({
    url: "http://75.127.75.161:4000/saveanswer",
    type: "POST",
    cache: false,
    data: {insertObject: resultObj},
    dataType: "json",
    success: (data) => {
    swal('HEY!', 'Thanks for sharing with us...', 'success');
    }, 
    error: (err) => {

    }
});

// socket.emit('_saveanswer', JSON.parse(resultObj));

// socket.on('saved', () => {
//   $('.main-carousel').flickity();
//     swal('HEY!', 'Thanks for sharing with us...', 'success');
// });


}



/** 
* 
* 
* 
*
* 
*/

}/**End save CALL  */


function filter(arr, criteria) {
    return arr.filter(function(obj) {
        return Object.keys(criteria).every(function(c) {
        return obj[c] == criteria[c];
        });
    });
};


