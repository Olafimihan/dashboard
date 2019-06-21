// var socket = io.connect("http://75.127.75.161:2023"); 


// //jomi, jagunlabi, extra flush
// 07034809006

var socket = io.connect("http://127.0.0.1:4000"); 

$(document).ready(() => {
    alert('abc');
    var name = localStorage.getItem('name');
    var user = localStorage.getItem('userid');
    var role = localStorage.getItem('roleId');
    
    if(role=='client'){
        $('.ops').addClass('hidden');

        $('.newproject').addClass('hidden')
        $('.questionaire').addClass('hidden')
        
        $('.users').addClass('hidden')
        $('.mapping').addClass('hidden')

    }else if(role=='manager'){
        $('.newproject').addClass('hidden')
        $('.questionaire').addClass('hidden')

        $('.users').addClass('hidden')
        $('.mapping').addClass('hidden')

    }

})
socket.on('connect', function(){
    console.log('socket...'+socket);

    socket.emit('phone')

    socket.on('phone', (resp) =>{
        console.log('The Phone Number: '+resp)
        
        $('.theme-clr').html('<br>'+resp)
        // console.log(resp)
    })
    
    socket.on('cron', (result) => {
        console.log("Response from server: "+result);
    });
    $('#save').click(function(){
        alert('clicked...') 
        // $('.tracked').removeClass('hidden');
    });

    socket.on('contact-us', (obj)=>{
        console.log(obj)
    })

    // socket.on('contact-us',)

    socket.on('tracked', (trackedresult) => {
        console.log(trackedresult.length);

        if(trackedresult.length > 0){
            $('.tracked').removeClass('hidden');           
            var image = trackedresult[0].product_img
            var name  = trackedresult[0].product_name
            $('.productimg').find('img').attr("src", image)    
            $('.p_name').html(trackedresult[0].product_name)
            $('.status').html(trackedresult[0].status)
            $('.location').html(trackedresult[0].currentLocation)
            $('.o_date').html(trackedresult[0].submit_date)
            $('.a_date').html(trackedresult[0].arrival_date)            
        }else{
            $('.tracked').addClass('hidden');
        }
         
    });

});


function displayData(list)
{
    var datas = list; // $.parseJSON(churchlist);
    var tblcontent="";
    var church_content="";

    console.log('The Church List Array: ')

    var image, name
    console.log(datas[0].product_img)

    $.each(datas, function(index, value){
        image   = value['product_img'];
        name  	= value['product_name'];
 
    });

    
    // console.log('Ímage: '+image)
    // console.log('Name: '+name)

    //$('#tbd-church').append(tblcontent); 
    // $('#church-connect').html('');
    // $('#church-connect').append(church_content);

}


var getDele = (val) =>{
    console.log('Dele'+val);
}

function getList(jsondata){

    $.each(jsondata, function(index, value){


        photo = value['photo'];					

        content +='<div class="panel panel-primary" style="width:90%; margin-right:auto; margin-left:auto; box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);">';
        content += '<div class="panel-heading"><span>'+ value['names']+'</span></div>';
        content +='<div class="panel-body"><div class="row">';
        content +='<div class="col-5 col-xs-5 col-sm-5 col-md-5">';	
        content += '<img src="'+photo+'" class="img-thumbnail float-left" style="height:100px; width: 100px">';
        // content += '<img src="'+photo+'" class="img-thumbnail float-left" style="height:100px; width: 100px; margin:4px 10px 10px 0px">';
        content +='</div>';
        content +='<div class="col-7 col-xs-7 col-sm-7 col-md-7">';
        content += '<b>Designation: </b>' + value['status'] + '<br/>';
        content += '<b>Programme: </b>' + value['programme'] + '<br/>';
        content += '<b>Phone: </b>' + value['phone'] + '<br/>';
        content += '<b>Email: </b>' + value['email'] + '<br/>';
        content += '<b>Skype: </b>' + value['skype'] + '<br/>';
        content += '<b>Facebook: </b>' + value['facebook'] + '</p>';
        content +='</div>';
        content +='</div>';
        content +='</div>';
        content +='</div>'; 
                        

    });

     
}

var getQuestionGraphReport = (refcode) => {
    var charttype  = $('input:radio[name=chart]:checked').val();  

    
    $.ajax({ 
        url: "/getquestiongraphdata",
        method:"GET",
        data: "questionid="+refcode,
        // data: "usermail="+usermail+"&project="+project ,
        cache: false,
        success: function(data){
            var label; 

            var LabelKPI  = data.labels; 
            var seriesKPI = data.series; 
            var question  = data.question;

            var labelval = [];
            var seriesval = [];
            var lbl, srs;

// console.log(LabelKPI );
console.log(seriesKPI);
// console.log(question );
            LabelKPI.forEach(function(el, row){
                label = LabelKPI[row].labels;
                labelval.push(label);

            });

            seriesKPI.forEach(function(el, idx){
                srs = seriesKPI[idx];
                seriesval.push(srs);
            }); 


            console.log(seriesval);

            // var sr = '5, 4, 3, 7, 5, 10, 3'
            var series= seriesval;
            var obj=labelval;
            var counter=0;
            var projectquestions="";
            
            //Draw the graph [ THE BAR CHART ]
            new Chartist.Bar('#chartist-bar', {
                labels: labelval,
                series: seriesval
                } 
                , {
                axisX: {
                    // On the x-axis start means top and end means bottom
                    position: 'end'
                },
                axisY: {
                    // On the y-axis start means left and end means right
                    position: 'start'
                }
            }); 

            //   new Chartist.Bar('#chart2', {labels: obj, series: series} );
            //draw THE GRAPH [ PIE CHART]
            var data = {
                labels: labelval,
                // series: [20, 15, 40]
                series: seriesval
              };
              
              var options = {
                labelInterpolationFnc: function(value) {
                  return value[0]
                }
                ,showGridBackground: true 
                ,plugins: [
                    Chartist.plugins.legend()
                ]

                // labelInterpolationFnc: Chartist.noop,
              };
              
              var responsiveOptions = [
                ['screen and (min-width: 640px)', {
                  chartPadding: 20,
                  labelOffset: 10,
                  labelDirection: 'explode',
                  labelInterpolationFnc: function(value) {
                    return value;
                  }
                }],
                ['screen and (min-width: 1024px)', {
                  labelOffset: 10,
                  chartPadding: 20
                }]
              ];
              
              new Chartist.Pie('#chartist-pie', data, options, responsiveOptions);

            $('#question').html(question);
            
        },
        error: function(data){
            alert("E: "+data);
        },
        datatype: "text"
    }) 
}

var getQuestions = (code) => {
    // alert(code)
    var x = $("#uid").html(); 
    $.ajax({ 
        url: "/getquestions",
        method:"GET",
        data: "projectid="+code,

        // data: JSON.stringify(data),
        // data: "usermail="+usermail+"&project="+project ,
        cache: false,
        success: function(data){ 
            var questions = data.questions; //var obj={questions:results, options: result};

            var counter=0;
            var projectquestions = '<option value ="0">Please select a question...</option>'; 

            questions.forEach(function(el, index){
                // <option value = "0" > Please, select a Question... </option>                        
                projectquestions += '<option value ="' + questions[index].refnos + '">'+ questions[index].question +'</option>'; 
               
                counter++;

            });

            // console.log(projectquestions)

            $("#questions").html(projectquestions);

        },
        error: function(data){
            alert("E: "+data);
        },
        datatype: "text"
    })

}

