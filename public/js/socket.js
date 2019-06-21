// var socket = io.connect("http://75.127.75.161:2023"); 
var socket = io.connect("http://127.0.0.1:4000"); 

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

function dalay(){
    var obj = {
        usermail: $('#usermail').val(),
        title: $('#title').val(),
        start_date: $('#sdate').val(),
        end_date: $('#edate').val(),
        reason: $('#reason').val(),
    }

    console.log(obj)

    socket.emit('newproject', obj );
    // socket.emit('track', trackingnumber);
}

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