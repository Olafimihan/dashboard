<%-- 
    Document   : order
    Created on : Mar 18, 2019, 7:36:30 PM
    Author     : mac
--%>

<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>

<%
    String roleId = "";
    String mGlobalUserId = (String) session.getAttribute("userId");
    String mGlobalUsername = (String) session.getAttribute("username");
    String GlobalRoleId = (String) session.getAttribute("roleid");
    String gd_sysdate = (String) session.getAttribute("gd_sysdate");
        

    if (mGlobalUserId==null){
      out.println("<script>alert('Sorry, Please, enter your user ID and Password to continue!!!')</script>");
      out.println("<script>window.location = 'logins.jsp'</script>");
    }
    

%>
 

<html lang="en">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">

    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="Kode is a Premium Bootstrap Admin Template, It's responsive, clean coded and mobile friendly">
    <meta name="keywords" content="bootstrap, admin, dashboard, flat admin template, responsive," />
    <title>Clients Orders Submission</title>
      
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
      
    
    <!-- ========== - Files ========== -->
        <link href="css/root.css" rel="stylesheet">       
	 
        
        <link rel="stylesheet" href="css/sweet-alert.css">
        
        <!--<link type="text/css" href="css/style1.css" rel="StyleSheet">-->
        <script type="text/javascript" src="jquery-1.10.2.js" ></script>
 
                <script src="js/sweet-alert.min.js" type="text/javascript"></script>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.1.1/socket.io.js" ></script>        
    <script src="js/socket.js" ></script> 
     
    <script type="text/javascript" src="js/jquery.autocomplete.min.js"></script>
       
    <style >
    /** resets **/
html, body, div, span, applet, object, iframe, h1, h2, h3, h4, h5, h6, p, blockquote, pre, a, abbr, acronym, address, big, cite, code, del, dfn, em, img, ins, kbd, q, s, samp, small, strike, strong, sub, sup, tt, var, b, u, i, center, dl, dt, dd, ol, ul, li, fieldset, form, label, legend, table, caption, tbody, tfoot, thead, tr, th, td, article, aside, canvas, details, embed, figure, figcaption, footer, header, hgroup, menu, nav, output, ruby, section, summary, time, mark, audio, video {
  margin: 0;
  padding: 0;
  border: 0;
  font-size: 100%;
  font: inherit;
  vertical-align: baseline;
  outline: none;
  -webkit-font-smoothing: antialiased;
  -webkit-text-size-adjust: 100%;
  -ms-text-size-adjust: 100%;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
}
html { height: 101%; }
body { 
  background: #f0f0f0 url('images/bg.gif'); 
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  color: #313131;
  font-size: 62.5%; 
  line-height: 1; 
  border-style: dotted;
  
}

::selection { background: #a4dcec; }
::-moz-selection { background: #a4dcec; }
::-webkit-selection { background: #a4dcec; }

::-webkit-input-placeholder { /* WebKit browsers */
  color: #ccc;
  font-style: italic;
}
:-moz-placeholder { /* Mozilla Firefox 4 to 18 */
  color: #ccc;
  font-style: italic;
}
::-moz-placeholder { /* Mozilla Firefox 19+ */
  color: #ccc;
  font-style: italic;
}
:-ms-input-placeholder { /* Internet Explorer 10+ */
  color: #ccc !important;
  font-style: italic;  
}

br { display: block; line-height: 2.2em; } 

article, aside, details, figcaption, figure, footer, header, hgroup, menu, nav, section { display: block; }
ol, ul { list-style: none; }

input, textarea { 
  -webkit-font-smoothing: antialiased;
  -webkit-text-size-adjust: 100%;
  -ms-text-size-adjust: 100%;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
  outline: none; 
}

blockquote, q { quotes: none; }
blockquote:before, blockquote:after, q:before, q:after { content: ''; content: none; }
strong { font-weight: bold; } 

table { border-collapse: collapse; border-spacing: 0; }
img { border: 0; max-width: 100%; }

#topbar {
  background: #4f4a41;
  padding: 10px 0 10px 0;
  text-align: center;
}

#topbar a {
  color: #fff;
  font-size:1.3em;
  line-height: 1.25em;
  text-decoration: none;
  opacity: 0.5;
  font-weight: bold;
}

#topbar a:hover {
  opacity: 1;
}

/** typography **/
h1 {
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  font-size: 2.5em;
  line-height: 1.5em;
  letter-spacing: -0.05em;
  margin-bottom: 20px;
  padding: .1em 0;
  color: #444;
	position: relative;
	overflow: hidden;
	white-space: nowrap;
	text-align: center;
}
h1:before,
h1:after {
  content: "";
  position: relative;
  display: inline-block;
  width: 50%;
  height: 1px;
  vertical-align: middle;
  background: #f0f0f0;
}
h1:before {    
  left: -.5em;
  margin: 0 0 0 -50%;
}
h1:after {    
  left: .5em;
  margin: 0 -50% 0 0;
}
h1 > span {
  display: inline-block;
  vertical-align: middle;
  white-space: normal;
}

p {
  display: block;
  font-size: 1.35em;
  line-height: 1.5em;
  margin-bottom: 22px;
}

a { color: #5a9352; text-decoration: none; }
a:hover { text-decoration: underline; }

.center { display: block; text-align: center; }


/** page structure **/
#w {
  display: block;
  width: 750px;
  margin: 0 auto;
  padding-top: 30px;
}

#content {
  display: block;
  width: 100%;
  background: #fff;
  padding: 5px 0px;
  padding-bottom: 35px;
  -webkit-box-shadow: rgba(0, 0, 0, 0.1) 0px 1px 2px 0px;
  -moz-box-shadow: rgba(0, 0, 0, 0.1) 0px 1px 2px 0px;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 1px 2px 0px;
}

#searchfield { display: block; width: 100%; text-align: center; margin-bottom: 35px; }

#searchfield form {
  display: inline-block;
  background: #e08e0b;
  color: #000;
  padding: 0;
  margin: 0;
  padding: 5px;
  border-radius: 6px;
  margin: 5px 0 0 0;
}
#searchfield form .biginput {
  width: 900px;
  height: 50px;
  padding: 0 2px 0 2px;
  background-color: #fff;
  border: 1px solid #c8c8c8;
  border-radius: 3px;
  color: #aeaeae;
  font-weight:normal;
  font-size: 1.5em;
  -webkit-transition: all 0.2s linear;
  -moz-transition: all 0.2s linear;
  transition: all 0.2s linear;
}
#searchfield form .biginput:focus {
  color: #858585;
}



.flatbtn {
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
  display: inline-block;
  outline: 0;
  border: 0;
  color: #f3faef;
  text-decoration: none;
  background-color: #6bb642;
  border-color: rgba(0, 0, 0, 0.1) rgba(0, 0, 0, 0.1) rgba(0, 0, 0, 0.25);
  font-size: 1.2em;
  font-weight: bold;
  padding: 12px 22px 12px 22px;
  line-height: normal;
  text-align: center;
  vertical-align: middle;
  cursor: pointer;
  text-transform: uppercase;
  text-shadow: 0 1px 0 rgba(0,0,0,0.3);
  -webkit-border-radius: 3px;
  -moz-border-radius: 3px;
  border-radius: 3px;
  -webkit-box-shadow: 0 1px 0 rgba(15, 15, 15, 0.3);
  -moz-box-shadow: 0 1px 0 rgba(15, 15, 15, 0.3);
  box-shadow: 0 1px 0 rgba(15, 15, 15, 0.3);
}
.flatbtn:hover {
  color: #fff;
  background-color: #73c437;
}
.flatbtn:active {
  -webkit-box-shadow: inset 0 1px 5px rgba(0, 0, 0, 0.1);
  -moz-box-shadow:inset 0 1px 5px rgba(0, 0, 0, 0.1);
  box-shadow:inset 0 1px 5px rgba(0, 0, 0, 0.1);
}



.autocomplete-suggestions { border: 1px solid #999; background: #fff; cursor: default; overflow: auto; }
.autocomplete-suggestion { padding: 10px 5px; font-size: 1.2em; white-space: nowrap; overflow: hidden; }
.autocomplete-selected { background: #f0f0f0; }
.autocomplete-suggestions strong { font-weight: normal; color: #3399ff; }    
    </style>
    
    
    <script type="text/javascript" >
        $(document).ready(function(){
            $.ajax({  
                url         :       "acctData?",
                type        :       "GET",
                data        :       "flag=SUPItem",
                cache       :       false,
                success     :       function(data){
                    
                    
                    var dataArray=data.split('!'); 

//                        $("#supplier").html(dataArray[0]);
                    $("#items").html(dataArray[1]);
//                    alert(dataArray[1]);
                    
                    var custs=dataArray[2];
                     
                     
                    var gd = JSON.parse(custs);
                    
                    var list = [];
                    gd.forEach(function(elm, idx){
                        var val="", dat=0;
                        
                        val = gd[idx].cust_company_name;
                        dat = gd[idx].cust_id;
//                        console.log(val);
//                        console.log(dat);
                        
                        var obj = {
                            value: val,
                            data: dat
                        };
                        
                        list.push(obj);
                        
                        
                    });
                    
//                    alert(list);
                    $('#autocomplete').autocomplete({
                        lookup: list,
                        onSelect: function (suggestion) {
                            var thehtml = '<strong>Product Name:</strong> ' + suggestion.value + ' <br> <strong>Code:</strong> ' + suggestion.data;
                            var item = suggestion.data;

                            var length = $('#customer').children('option').length;
                            setSelectedIndex(document.getElementById("customer"), suggestion.data);
 
//                            $("#pricelevel").val(1); 
//                            savebtnEnable();
//                            ajaxFunction();
                            getcustomerData(suggestion.data)
                            
//                            $.ajax({
//                               url: "acctData?",
//                               cache: false,
//                               type: "GET",
//                               data    :       "item="+item+"&flag=getStockbalance",
//                               success: (data) => {
////                                   alert(data)
//                                   $("#c_stock").val(data);
//                                   
////                                   $("#quantity").select()
//                                   $("#quantity").focus();
//                                   $("#quantity").select();
//                               },
//                               error: (data) => {
//
//                               },
//                               datatype: "text"
//                            });

                        }
                    });
   
                    
//                    alert(dataArray[2])
                    //displayData(pens); //$("#result").html();

                },
                error       :       function(data){
                    alert('error'+data);
                },
                datatype    :       "text"

            });


        })

        function setSelectedIndex(s, valsearch)
        {
            // Loop through all the items in drop down list
            for (i = 0; i < s.options.length; i++)
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
  
        
    </script>
      
    <style>
        body {font-family: Arial, Helvetica, sans-serif;}

        /* The Modal (background) */
        .modal {
          display: none; /* Hidden by default */
          position: fixed; /* Stay in place */
          z-index: 1; /* Sit on top */
          padding-top: 0px; /* Location of the box */
          left: 0;
          top: 0;
          width: auto; /* Full width */
          height: auto; /* Full height */
          overflow: auto; /* Enable scroll if needed */
          background-color: #c5c5c5; 
          /*background-color: rgba(0,0,0,0.4);  Black w/ opacity */
        }

        /* Modal Content */
        .modal-content {
          background-color: #ffcccc;
/*          background-color: #fefefe;*/
          margin: auto;
          padding: 0px;
          border: 1px solid #888;
          width: 100%;
        }

        /* The Close Button */
        .close {
          color: #aaaaaa;
          float: right;
          font-size: 28px;
          font-weight: bold;
        }
        
        .modal-footer{
            background-color: grey;
            height: 80px;
        }

        .close:hover,
        .close:focus {
          color: #000;
          text-decoration: none;
          cursor: pointer;
        }
    </style>
    
    <style>
        .thumb {
          height: 200px;
          border: 1px solid #000;
          margin: 5px 5px 0 0;
        }
        
        body{
            background-color: #CCC;
        }
        
        .content{
            align-self: flex-start;
        }
    </style>

  </head>
  
    <body>  

        <!-- START CONTENT -->
        <div class="content">
            <input type="hidden" id="ref"  name="ref"  >
            <input type="hidden" id="user" name="user" value="<%=mGlobalUserId%>"  >

            <!-- //////////////////////////////////////////////////////////////////////////// --> 
            <!-- START CONTAINER -->
            <div class="container-default" >

                <!-- Start Row -->
                <div class="row" >
                  <div class="col-md-12  " > 
                        <div class="panel col-md-6" >
                            <div class="panel-header bg-danger col-md-12 bg-success">
                                <h1></h1>    
                                <h3 style="font-size: 18px; text-align: center"  ><strong>Clients' Order / Job Assignment</strong> </h3>
                                <ul class="panel-tools">
                                    <li><a class="icon"><i class="fa fa-minus"></i></a></li>
                                    <li><a class="icon"><i class="fa fa-expand"></i></a></li>
                                    <li><a class="icon"><i class="fa fa-times"></i></a></li>
                                </ul>
                            </div>

                            <div style="background-color: #fff" class='panel-body form-group-sm col-md-12' >
                                    
                                <div class="col-md-12" >
                                    <div class='form-label col-md-2'> </div> 
                                    <div id="searchfield" class="col-md-10">
                                        <form id="search" class="col-md-12" >
                                            <input class="col-md-12 form-control" size="60" type="text" name="itemslist" class="biginput" id="autocomplete" placeholder="Type customer here to lookup...">
                                        </form>
                                    </div>
 
                                </div>
                                    
                                <div class='form-group-sm col-md-12 hidden' >
                                    <div class='form-control col-md-2 hidden'>Select Customer</div> 
                                    <div class='col-md-6 hidden'>
                                        <select class="form-control " id="customer" onchange="getcustomerData(this.value)">

                                        </select>
                                    </div>

                                    <div class='form-control col-md-2'><input type="text" id="phone"></div>
                                    <div class='form-control col-md-2'><input type="text" id="email"></div>
                                </div>

                                <div class='form-group-sm col-md-12' >
                                    <div class='form-control col-md-4'>Select Service</div> 
                                    <div class='col-md-8'>
                                        <select class='form-control' id="service" onchange="getservicedetail(this.value)">
                                        </select>
                                    </div>
                                </div>

                                <div class='form-group-sm col-md-12' >
                                    <div class='form-control col-md-4'>Order Date </div>
                                    <div class='form-control col-md-8'><input type="text" id="datepicker" value="<%=gd_sysdate%>" readonly ></div>
                                </div> 

                            </div>

                            <div class='panel-footer col-md-12' >
                                <button class="btn btn-success" id="saver" type="button" onclick="saveOrder()"> Submit </button>
                                <!--<button class="btn btn-primary" type="button" > Assign Job </button>-->
                                <button class="btn btn-primary" type="button" onclick="window.location='myHomePage.jsp'"> Close </button>
                            </div> 

                        </div><!-- End Panel 1 -->

                        <div class="panel col-md-6">
                            <div class="panel-header bg-danger col-md-12 bg-success">

                                <h3 style="font-size: 18px; text-align: center" ><strong>Orders List</strong> </h3>
                                <ul class="panel-tools">
                                    <li><a class="icon"><i class="fa fa-minus"></i></a></li>
                                    <li><a class="icon"><i class="fa fa-expand"></i></a></li>
                                    <li><a class="icon"><i class="fa fa-times"></i></a></li>
                                </ul>
                            </div>
                            <!-- Trigger/Open The Modal -->
                            <p><button class="hidden" id="myBtn">Open Modal</button></p>
                            <p><button class="hidden" id="myBtn2">Open Modal</button></p>

                            <div class="panel-body form-group-sm col-md-12"> 
                                <table id="example" class="display col-md-12" width="100%">
                                    <thead>
                                        <tr>   
                                            <th style='text-align: left'>Service</th>
                                            <th>Allocate</th>
                                            <th>Delete</th>
                                        </tr>
                                    </thead>

                                    <tbody id="order"> 
                                    </tbody>

                                    <tfoot>
                                        <tr>  
                                            <th style='text-align: left'>Service</th>

                                            <th>Allocate</th>  
                                            <th>Delete</th>  
                                        </tr>
                                    </tfoot> 

                                </table>

                            </div> 

<!--                            <div class='panel-footer col-md-12' >
                                <button class="btn btn-success" type="button" onclick="calendar()"> Check Artist Calendar </button>
                                <button class="btn btn-primary" type="button" > Assign Job </button>
                                <button class="btn btn-primary" type="button" onclick="window.location='myHomePage.jsp'"> Close </button>
                            </div>-->

                        </div><!-- End Panel 2 -->

                    </div>


                </div><!-- End Row -->

                <!-- Start Footer -->
                <div class="row footer">
                  <div class="col-md-6 text-left">
                  Copyright ï¿½ 2019, Tres Chic Beauty.
                  </div>

                  <div class="col-md-6 text-center">
                    Designed and Programmed by DELAF SYSTEMS COMPANY
                  </div> 
                </div>
                <!-- End Footer -->


            </div><!-- END CONTAINER -->

            <div class="modal modal-lg" id="assignjob" style="width: 800px; height: 650px" role="dialog">
                <input id="orderid" type="hidden">
                <div class="modal-dialog modal-lg" style="width: 800px; height: 650px; margin-top: 0px" title="Service Assignment to Artists">
                      
                    <div class="modal-header" style="padding: 15px 40px; background-color: #6F4E37; color: whitesmoke; font-weight: bolder; font-size: 18px">
                        <span class="close">&times;</span>
                        <h4 style="text-align: center; font-weight: bolder; font-size: 18px; color: white">Allocate Jobs to Artists.</h4>
                    </div>

                    <div class="modal-body col-md-12" style="height: 400px; background-color: whitesmoke">
                        <div class="col-md-5">
                            <div id="view" style="background-color: whitesmoke; float: left" class='col-md-12'>
                                <div class='col-md-12'>


                                    <p class="form-control col-md-12" style="background-color: gray; font-size: 20px; color: #fff; text-align: center" id='serv'>

                                    </p>

                                    <p class='form-control col-md-12' style="background-color: gray; font-size: 17px; color: #fff; text-align: center" id='durat'>

                                    </p>
                                </div> 

                            </div>

                            <div class="col-md-12">
                                <div class=' col-md-12'>

                                    <label for="artist" class="col-md-4">Select Artist</label> 
                                    <select class="form-control col-md-8" id="artist" name="artist"  >

                                    </select>
                                </div>

                            </div>

                            <div class='col-md-12'>
                                <div class="col-md-12">
                                    <label for="date" class="col-md-8">Transaction Date</label> 
                                    <input type='date' class="form-control col-md-4" id="datepicker2" name="datepicker2" size="4" >
                                </div>

                            </div> 

                            <div class='col-md-12'>
                                <div class="col-md-12">
                                    <label for="stime" class="col-md-8">Start Time</label> 
                                    <input type='time' class="form-control col-md-4" id="stime" name="stime" size="6" >
                                </div>

                            </div> 
                            <div class='col-md-12'>
                                <div class="col-md-12">
                                    <label for="etime" class="col-md-8">End Time</label> 
                                    <input type='time' class="form-control col-md-4" id="etime" name="etime" size="6" >
                                </div>

                            </div>  

                        </div>

                        <div class="col-md-7" >
                            <div id="calendar" class='col-md-10' style="float: left; background-color: whitesmoke; font-size: 12px; color: #000" >
                                <!--Stylist Calendar-->
                            </div>
                        </div> 

                    </div>

                    <div class="modal-footer col-md-12" style="background-color: #00acac">
                        <button type="button" class="btn btn-success col-md-4" onclick="checkartistavailabilty()" ><i class="fa fa-" ></i>Check Availability</button>

                        <button onm type="button" class="btn btn-primary col-md-4" id="allocate" onclick="allocateToArtist()" ><i class="fa fa-database" ></i>Allocate</button>

                        <!--<button class="btn btn-secondary btn-round btn-block" data-toggle="modal" data-target=".animate" data-ui-class="a-rotate"	    >Rotate</button>-->
                    </div>
                </div>
            </div>

            <div class="modal modal-backdrop " id="timetabler" style="width: 700px; height: 550px" role="dialog">
                
                <div class="modal-dialog" style="width: 700px; height: 550px; margin-top: 0px" title="Jobs Time Table">
                      
                    <div class="modal-header" style="padding: 15px 40px; background-color: #ffffcc; color: #fff; font-size: 18px; font-weight: bolder">
                        <span class="closed">&times;</span>
                        <span ><p id="artistname" style="background-color: whitesmoke; color: black; font-weight: bolder;; font-size: 16px; text-align: center"></p></span>
                        <h4 style="text-align: center; font-weight: bolder; font-size: 18px">Job Time Table.</h4>
                    </div>

                    <div class="modal-body col-md-12" style="height: 400px; background-color: whitesmoke">
                        <table id="example" class="display col-md-12" width="100%">
                            <thead>
                                <tr> 
                                    <th style='text-align: center'>Trans. Date</th>
                                    <th style='text-align: center'>Time</th>
                                    <th style='text-align: left'>Service Description</th>
                                    <th style='text-align: left'>Client</th>
                                </tr>
                            </thead>

                            <tbody id="jobtime"> 
                            </tbody>

<!--                            <tfoot>
                                <tr> 
                                    <th style='text-align: center'>Time</th>
                                    <th style='text-align: left'>Service Description</th>
                                    <th style='text-align: left'>Client</th>
                                </tr>
                            </tfoot> -->

                        </table>

                    </div>
                    
                    <div>
                        <button class="btn btn-success" id="cls" >Close</button>
                    </div>

                </div>
            </div>
            
            <div class="modal animate" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true" data-backdrop="true">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="exampleModalLabel">Modal title</h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">×</span>
                            </button>
                        </div>
                        <div class="modal-body text-center p-lg">
                            <p>Are you sure to execute this action?</p>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                            <button type="button" class="btn btn-primary">Save changes</button>
                        </div>
                    </div>
                </div>
            </div>



        </div>
        
      
                              
      

<script>
    // Get the modal
    var modal = document.getElementById('assignjob');

    // Get the button that opens the modal
    var btn = document.getElementById("myBtn");

    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close")[0];

    // When the user clicks the button, open the modal 
    btn.onclick = function() {
        $('#allocate').attr('disabled', false);
        modal.style.display = "block";
        
        //audit insert
        var auditObject = {
            userid: $('#user').val(),
            activity: 'User opens the Modal window to allocate jobs to artist.'
        };
        
        socket.emit('insertaudittrail', auditObject);      
    };

    // When the user clicks on <span> (x), close the modal
    span.onclick = function() {
      modal.style.display = "none";
    };

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
      if (event.target == modal) {
        modal.style.display = "none";
      }
    };
    
    
    // Get the modal
    var modal2 = document.getElementById('timetabler');

    // Get the button that opens the modal
    var btn2 = document.getElementById("myBtn2");

    // Get the <span> element that closes the modal
    var span2 = document.getElementById("cls");

    // When the user clicks the button, open the modal 
    btn2.onclick = function() {
//        $('#allocate').attr('disabled', false);
        modal2.style.display = "block";
      
    }

    // When the user clicks on <span> (x), close the modal
    span2.onclick = function() {
      modal2.style.display = "none";
    }

    // When the user clicks anywhere outside of the modal, close it
//    window.onclick = function(event) {
//      if (event.target == modal) {
//        modal.style.display = "none";
//      }
//    }
    
    
    
    
    
    
</script>


  </body>
</html>
