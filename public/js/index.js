// import { forEach } from "../../../Users/MR DELE/AppData/Local/Microsoft/TypeScript/2.6/node_modules/@types/async";

$(document).ready(function(){


})

function filter(arr, criteria) {
    return arr.filter(function(obj) {
        return Object.keys(criteria).every(function(c) {
        return obj[c] == criteria[c];
        });
    });
}

var conditiondeleter = (referencenumber) => {
    $.ajax({
        url: "/deletequestioncondition",
        type: "POST",
        cache: false,
        // data: dataObj,
        data: "referencenumber="+referencenumber , 
        success: function(data){ 
            $('.res').html(str);

            $('.res').removeClass('hidden')


        },
        error: function(data){

        },
        datatype: "text"
    })
}

var getQuestion = (projectid)=>{
    var str = '<table id="sort" class="table table-striped table-hover"><tbody>'; 
    $.ajax({
        url: "/getquestions",
        type: "get",
        cache: false,
        data: "projectid="+projectid,
        success: function(dataobj){  
            localStorage.setItem('optionsObject', dataobj);

            var data = dataobj.questions;
            var opt  = dataobj.options; 

            var projectquestions = '<option value ="0">Please select a question...</option>'; 
            var ref = $(".refnos").val(); 
            for(var xx=0; xx < data.length; xx++){
                var y = xx + 1; 
                // str += '<tr style="background-color: whitesmoked" id="'+data[xx].question_no+'" width="40" height="15" ><td>' + y + '</td><td style="" >' + data[xx].question +  '</td> <td><button class="btn btn-primary" id="'+ data[xx].refnos +'" name="'+ data[xx].question +'" value="'+opt+'" onclick="addOptions(this.id, this.name, this.value)" >Options</button></td><td><button class="btn btn-primary" id="'+ data[xx].refnos +'" name="'+ data[xx].question +'" value="'+ data[xx].question_no +'"  onclick="addConditions(this.id, this.name, this.value)" >Conditions</button></td> <td><button class="btn btn-primary" id="'+ data[xx].refnos +'" onclick="EditQuestions(this.id)" ><i class="fa fa-edit"></i></button></td> <td><button type="button" class="btn btn-danger" id="'+ data[xx].refnos +'" onclick="DeleteQuestions(this.id)" ><i class="fas fa-trash-alt"></i></button></td> </tr>';
                str += '<tr style="background-color: whitesmoked" draggable="true"  id="'+data[xx].refnos+'" width="40" height="15" ><td>' + y + '</td><td style=""  class="index" >' + data[xx].question +  '</td> <td><button class="btn btn-primary" id="'+ data[xx].refnos +'" name="'+ data[xx].question +'" value="'+opt+'" onclick="addOptions(this.id, this.name, this.value)" >Options</button></td><td><button class="btn btn-primary" id="'+ data[xx].refnos +'" name="'+ data[xx].question +'" value="'+ data[xx].question_no +'"  onclick="addConditions(this.id, this.name, this.value)" >Conditions</button></td> <td><button class="btn btn-primary" id="'+ data[xx].refnos +'" onclick="EditQuestions(this.id)" ><i class="fa fa-edit"></i></button></td> <td><button type="button" class="btn btn-danger" id="'+ data[xx].refnos +'" onclick="DeleteQuestions(this.id)" ><i class="fas fa-trash-alt"></i></button></td> </tr>';
                // str += '<tr style="background-color: whitesmoked" draggable="true" ondragleave="leave(event)"  ondragstart="drag(event)" ondrop="drop(event)" ondragover="allowDrop(event)"  id="'+data[xx].question_no+'" width="40" height="15" ><td>' + y + '</td><td style="" >' + data[xx].question +  '</td> <td><button class="btn btn-primary" id="'+ data[xx].refnos +'" name="'+ data[xx].question +'" value="'+opt+'" onclick="addOptions(this.id, this.name, this.value)" >Options</button></td><td><button class="btn btn-primary" id="'+ data[xx].refnos +'" name="'+ data[xx].question +'" value="'+ data[xx].question_no +'"  onclick="addConditions(this.id, this.name, this.value)" >Conditions</button></td> <td><button class="btn btn-primary" id="'+ data[xx].refnos +'" onclick="EditQuestions(this.id)" >Edit</button></td> <td><button type="button" class="btn btn-danger" id="'+ data[xx].refnos +'" onclick="DeleteQuestions(this.id)" ><img src="/public/img/g1.jpg" height="10"/></button></td> </tr>';
                // str += '<div style="margin-top: 5px" id="'+ y +'" ondrop="drop(event)" ondragover="allowDrop(event)" ><tbody style="background-color: whitesmoked" draggable="true" ondragstart="drag(event)" id="'+data[xx].question_no+'" width="88" height="31" ><td>' + y + '</td><td style="text-align: left; width: 400px; font-size: 14px; float: left" >' + data[xx].question +  '</td> <td><button class="btn btn-success" id="'+ data[xx].refnos +'" name="'+ data[xx].question +'" value="'+opt+'" onclick="addOptions(this.id, this.name, this.value)" >Options</button></td><td><button class="btn btn-success" id="'+ data[xx].refnos +'" name="'+ data[xx].question +'" value="'+ data[xx].question_no +'"  onclick="addConditions(this.id, this.name, this.value)" >Conditions</button></td> <td><button class="btn btn-success" id="'+ data[xx].refnos +'" onclick="EditQuestions(this.id)" >Edit</button></td> <td><button class="btn btn-success" id="'+ data[xx].refnos +'" onclick="DeleteQuestions(this.id)" >Delete</button></td> </tbody></div>';
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                //<button type="button" class="btn btn-group-sm rounded" onclick="sendContentToArtist()" ><i class="fa fa-send" ></i>Send</button>
                if(data[xx].refnos != ref){
                    projectquestions += '<option value ="' + data[xx].refnos + '">'+ data[xx].question +'</option>'; 
                }
            }
 
            str += '</tbody></table>';

            $('#r3').removeClass('hidden');

            $('#res').html(str);   

            $('#goto').html(projectquestions)
            $('tbody').sortable({
                stop: function(ui, event){
                    // alert(len);
                },
                update: function(ui, event){
                    var id = event.item.attr('id');
                    
                    var len = $('tbody tr').length;
                    var handler = $('tbody tr');
                    // console.log( typeof handler)

                    var resultObj='[';
                    var obj = [];

                    var projectid = $('#projectid').val();
                    // console.log(handler.length);

                    
                    for( key in handler ) {
                        var id = handler[ key ].id;
                        var position = +key + 1;

                        var data = {id, position, projectid};

                        // resultObj = '{"ID": "'+id+'", "q_no": "'+ yy +'" }';
                        
                        if(key <= handler.length){
                            obj.push(data);
                        }
                         
                        // console.log( "key is " + [ key ] + ", value is " + handler[ key ].id );

                    } 

                    console.log( typeof obj)
                    console.log( JSON.stringify(obj ))

                    var variable = JSON.stringify(obj );
                    $.ajax({
                        url: "/reorderquestions",
                        type: "GET",
                        cache: false,
                        // data: dataObj,
                        data: "objectId="+variable,
                        success: function(data){ 
                             
                        },
                        error: function(data){
                
                        },
                        datatype: "text"
                    })
                     
                    // console.log(obj);

                }                

            }); 

        },
        error: function(data){

        },
        datatype: "text"
    })

}


// var leave = (ev)=>{
//     event.currentTarget.style.background = '#fff';
    
// }

// function allowDrop(ev) {
//     event.preventDefault();
//     event.currentTarget.style.background = '#c5c5c5';
//     // ev.preventDefault();
// }


  
// function drag(ev) {
//     // alert('dee')
//     ev.dataTransfer.setData("text", ev.target.id);

//     var dt = ev.originalEvent.dataTransfer;
//     dt.setData('text', $(this).attr('id'));
//     console.log('Drag STart: '+dt );
    
// }

// function drop(ev) {
//     ev.preventDefault();
//     const data = ev.dataTransfer.getData("text");
//     // const element = document.querySelector(`#${data}`);
//     ev.currentTarget.style.background = 'white'

//     console.log('Dropped: '+data)
//     // console.log(element)

//     try {
//         ev.target.appendChild(element);
//     } catch (error) {
//       console.warn("you can't move the item to the same place")
//     }

//     // console.log("Drop arena:"+ data)
// }

// function dragstart_handler(ev) {
//     console.log("dragStart");
//     // Add the target element's id to the data transfer object
//     ev.dataTransfer.setData("text", ev.target.id);
//     console.log(ev.target.id);
// }

var addOptions = (id, name, options)=>{
     $(".refnos").val(id);
    $(".q1").val(name);
    $("#pushtodisplay").modal({
        backdrop: 'static',
        keyboard: false
    });

    $.ajax({
        url: "/getquestionoptions",
        type: "GET",
        cache: false,
        data: "questionId="+id , 
        success: function(data){ 
            var questionOptions = '<table class="table table-bordered">';
              data.forEach(function(el, xx){
              questionOptions += '<tbody>'+ '<td style><button class="btn btn-primary" id="' + data[xx].refnos + '" onclick="deleteOptions(this.id)" >Delete</button>'+ '<td>'+ data[xx].response_text + '</td>'+ '</tbody>'; 
            })

            questionOptions += '</table>';

            $('#choices').html(questionOptions);

        },
        error: function(data){

        },
        datatype: "text"
    })
    var resultStr=""; // options.filter(option => option.)
 
}

var deleteOptions = (id) => {
    // console.log(id)
    var q_id = $(".refnos").val();

    $.ajax({
        url: "/deletequestionoptions",
        type: "POST",
        cache: false,
        // data: dataObj,
        data: "OptionId="+id+"&questionId="+q_id,
        success: function(data){ 
            var questionOptions = '<table class="table table-bordered">';
            // questionOptions += '<thead style="background-color: #ffcccc; color: black; font-weight: bolder"><td>refnos</td><td>Option</td></thead>'
 
             data.forEach(function(el, xx){
                questionOptions += '<tbody>'+ '<td><button class="btn btn-primary" id="'+ data[xx].refnos +'" onclick="deleteOptions(this.id)" >Delete</button>'+ '<td>' + data[xx].response_text + '</td>'+ '</tbody>'; 
            })

            questionOptions += '</table>'

            $('#choices').html(questionOptions); 
        },
        error: function(data){

        },
        datatype: "text"
    })
}


var addConditions = (id, name, questionIndex)=>{ 

    // alert(id)
    // alert(name)
    // alert(questionIndex)

    $(".refnos").val(id);
    $(".q1").val(name);
    $("#questno").val(questionIndex);

    //use ajax to get question options for use
    $.ajax({
        url: "/optns",
        type: "get",
        cache: false,
        data: "questionid="+id,
        success: function(data){ 
            var counter;
            var projectquestions = '<option value ="0">Please select an Option to Add Condition...</option>'; 
            
            console.log(data)
            data.forEach(function(el, xx){
                projectquestions += '<option value ="' + data[xx].refnos + '">'+ data[xx].response_text +'</option>'; 
            })

            console.log(projectquestions);
            $('#choice').html(projectquestions);


            
        },
        error: function(data){

        },
        datatype: "text"
    });

    /**Initialize the modal window */
    $("#addConditions").modal({
        backdrop: 'static',
        keyboard: false
    });

}

var saveChoices = ()=>{
    // var projectRef = $("#project").val();
    var questionRef = $("#refnos").val();
    var choice = $("#response").val().trim();
    var type = $("#c_type").val().trim(); 
    $.ajax({
        url: "/savechoice",
        type: "get",
        cache: false,
        data: "questionid="+questionRef+"&choice="+choice+"&type="+type,
        success: function(data){ 
            var str;
            for(var xx=0; xx < data.length; xx++){
                var y = xx + 1;  
                
                str += '<table cellspacing="10" cellpadding="5" border="1" width="100%" ><tr  >' + '<td style="text-align: left; font-size: 14px">'+ y +' </td> <td style="text-align: left; font-size: 14px" >' + data[xx].response_text + '</td> <td><button class="btn btn-primary" id="'+ data[xx].refnos +'" name="'+ data[xx].response_text +'" onclick="addOptions(this.id, this.name)" >Delete</button></td>  </tr></table>';
                                           
            }

            $('#choices').html(str);

        },
        error: function(data){

        },
        datatype: "text"
    })

   
}

var saveCondition = ()=>{
    var questionId = $('.refnos').val();
    var responseId = $('#choice').val();
    var gotoId = $('#goto').val();
    var gotoIndex = ($('#questno').val() - 1);

    
    var dataObj = {
        questionId: questionId, 
        responseId: responseId,
        gotoId: gotoId
    }

    // console.log("data: "+dataObj.questionId)

    // alert(questionId+":::"+responseId+":::"+gotoId)
    $.ajax({
        url: "/savecondition",
        type: "post",
        cache: false,
        // data: dataObj,
        data: "questionId="+questionId+"&responseId="+responseId+"&gotoId="+gotoId+"&gotoIndex="+gotoIndex, //questno
        success: function(data){ 
            var str;
            //  console.log(data)
            $('#choices').html(str);

        },
        error: function(data){

        },
        datatype: "text"
    })
}

var getQuestionIndex = (val) =>{

    // alert(val)
    $.ajax({
        url: "/getQuestionNumber",
        type: "get",
        cache: false,
        // data: dataObj,
        data: "questionId="+val, //questno
        success: function(data){ 
            var str;
             console.log(data)
            $('#questno').val(data[0].question_no);

        },
        error: function(data){

        },
        datatype: "text"
    })

}

var getGoto = (responseId) => {
    var questionId = $('.refnos').val();
    $.ajax({
        url: "/getquestioncondition",
        type: "GET",
        cache: false,
        // data: dataObj,
        data: "responseId="+responseId+"&questionId="+questionId , 
        success: function(data){ 
            var str = '<table class="table table-striped">';
             console.log(data)
            $('#choices').html(str);

            var counter=0;
            str += '<thead style="background-color: grey; font-weight: bold; color: white" ><td>S/N</td><td>Options/Choices</td><td>Question that will get focus</td><td></td></thead>'
            data.forEach(function(element, idx){
                counter++
                str += '<tbody><td>' + counter + '</td>' + '<td>' + data[idx].selectedoption + '</td>' + '<td>'+ data[idx].focusquestion + '</td>' + '<td><button class="btn btn-danger" type="button" id="'+ data[idx].refnos +'" onclick="conditiondeleter(this.id)" >Delete</button></td>' +  '</tbody>'
            })

            $('.res').html(str);

            $('.res').removeClass('hidden')


        },
        error: function(data){

        },
        datatype: "text"
    })

}
