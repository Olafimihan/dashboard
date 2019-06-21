$(document).ready(() => {
    var grtyp  = $('input:radio[name=cash]:checked').val();  
    // alert(grtyp);

    var name = localStorage.getItem('name');
    var user = localStorage.getItem('userid');
    var role = localStorage.getItem('roleId');

    $('.guest').html("<strong style='font-size: 20' >Welcome, "+ name+" </strong>");
    if(role=='client') {
        $('.ops').addClass('hidden');

        $('.newproject').addClass('hidden');
        $('.questionaire').addClass('hidden');
        
        $('.users').addClass('hidden');
        $('.mapping').addClass('hidden');

    }else if(role=='manager') {
        $('.newproject').addClass('hidden');
        $('.questionaire').addClass('hidden');

        $('.users').addClass('hidden');
        $('.mapping').addClass('hidden');

    }

})

var getdata = () => {
    var user = localStorage.getItem('userid');
    var role = localStorage.getItem('roleId');
    // alert(user)
    $.ajax({
        url: "/getprojectslist",
        // url: "/projects",
        type: "GET",
        data: "user="+user+"&role="+role,
        // data: "usermail="+user,
        cache: false,
        success: (respObj) => {
            // alert(respObj);
            // alert(respObj.project);

            $("#projects").html(respObj)
        },
        error: (errObj) => {

        },
        dataType : "text"
    })
}

var getQuestionGraphReport = (refcode) => {
    $(".panel-default").addClass('hidden');

    return;
    $.ajax({ 
        url: "/getquestiongraphdata",
        method:"GET",
        data: "questionid="+refcode,
        // data: "usermail="+usermail+"&project="+project ,
        cache: false,
        success: function(data){
            // alert(data.labels)
            // console.log(data)
            var grtyp  = $('input:radio[name=cash]:checked').val();  

            
            // drawHorizontalBar(data);
            

            drawLineChart(data)
            drawPieChart(data);
            drawOverlapBar(data);
            drawEasyChart(data);

            $('.panel-title').html(data.question);
            
        },
        error: function(data){
            alert("E: "+data);
        },
        datatype: "text"
    }) 
}

var drawGraphReport = (refcode, opt) => {
    // $(".panel-default").addClass('hidden');

    $.ajax({ 
        url: "/getquestiongraphdata",
        method:"GET",
        data: "questionid="+refcode,
        // data: "usermail="+usermail+"&project="+project ,
        cache: false,
        success: function(data){
            // alert(data.labels)
            // console.log(data)
            var grtyp  = $('input:radio[name=cash]:checked').val();  

            
            // drawHorizontalBar(data);
            

            if(opt=='pie'){
                $('.pie').removeClass('hidden');
                
                $('.bar').addClass('hidden');
                $('.line').addClass('hidden');
                $('.easy').addClass('hidden');
                drawPieChart(data);
            }else if(opt=='line'){
                $('.line').removeClass('hidden');
                
                $('.bar').addClass('hidden');
                $('.pie').addClass('hidden');
                $('.easy').addClass('hidden');
                drawLineChart(data)
            }else if(opt=='bar'){
                $('.bar').removeClass('hidden');
                
                $('.line').addClass('hidden');
                $('.pie').addClass('hidden');
                $('.easy').addClass('hidden');
                drawOverlapBar(data);
            }else if(opt=='easy'){
                $('.easy').removeClass('hidden');
                
                $('.pie').addClass('hidden');
                $('.bar').addClass('hidden');
                $('.line').addClass('hidden');
                drawEasyChart(data);
            }
            
            $('.panel-title').html(data.question);
            
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

var drawLineChart = (dataval) => {
    /* ======================================================================
    Simple Line Chart
    ====================================================================== */

    var seriesval = [ ];
    var lbl = [ ];
    
    dataval.labels.forEach((el, idx) => {
        lbl.push(dataval.labels[idx]);
    });

    dataval.series.forEach((el, idx) => {
        seriesval.push(dataval.series[idx]);
    });

    new Chartist.Line('#chartist-line', {
    labels: lbl, // ['Mondays', 'Tuesday', 'Wednesday', 'Thursday', 'Fridays'],
    series: [seriesval] //[[12, 9, 7, 8, 5],[2, 1, 3.5, 7, 3],[1, 3, 4, 5, 6]]
    }, {
    fullWidth: true,
    chartPadding: {
        right: 40
    }

    });        
}

var drawPieChart = (dataval) => {
    var data = {
    labels: dataval.labels,
    series: dataval.series
    };

    var options = {
    labelInterpolationFnc: function(value) {
        return value[0]
    }
    };

    var responsiveOptions = [
    ['screen and (min-width: 640px)', {
        chartPadding: 30,
        labelOffset: 100,
        labelDirection: 'explode',
        labelInterpolationFnc: function(value) {
        return value;
        }
    }],
    ['screen and (min-width: 1024px)', {
        labelOffset: 80,
        chartPadding: 20
    }]
    ];

    new Chartist.Pie('#chartist-pie', data, options, responsiveOptions);

}

var drawEasyChart = (dataval) => {        
    /* ======================================================================
    Easy Pie Chart
    ====================================================================== */

    var str = "", str2="";
    var totalrespondents = 0;
    var percval=0;
    var dataArray = [];
    // console.log(dataval.labels);
    // console.log(dataval.series);

    dataval.series.forEach((elm, idx) => {
        totalrespondents += dataval.series[idx];
    });

    var cval=0
    // alert(totalrespondents)
    // console.log(dataval.)
    dataval.labels.forEach((elm, idx) => {
        dataArray.push(dataval.labels[idx]);
        cval=dataval.series[idx];
        percval = cval / totalrespondents * 100;
        str += '<div class="easypie" data-scale-color="#ffb400" data-percent='+ percval.toFixed(2) +' > <span>'+ cval +'</span>'+ dataval.labels[idx] +'</div>';
    
        str2 += '<div class="easypie" data-scale-color="#ffb400" data-percent='+ percval.toFixed(2) +' > <span>'+ cval +'</span>'+ dataval.labels[idx] +'</div>';
    

    });

    // $("#easypies").html(str);

    initEasyPieChart();

    // console.log( "Easy Pie:  "+$("#easypies").html() );
    // console.log( "Easy Pie 2:  "+str2 );
    
    // $('.easypie').easyPieChart({
    //     //your configuration goes here
    // });

};

var initEasyPieChart = () => {
    var element = document.querySelector('.easypie');
    console.log("Each Pie CALL: "+element);
    
    var options = {
        barColor: 'red',
        trackColor: '#f2f2f2',
        scaleColor:	'#dfe0e0',
        lineCap: 	'round',
        lineWidth: 	3,
        size: 	110,
        animate: 5000,
        rotate: 0,
        onStart: ()=> {
            // alert('started...');
        },
        onStop: () => {
            // alert('Ended...');
        },
        
    };

    var count=0;

    var chart = new EasyPieChart(element, options);
    chart.enableAnimation();

    
}

var drawHorizontalBar = (dataval) => {
    /* ======================================================================
    Horizontal Bar
    ====================================================================== */
    // alert(dataval.series);
    // console.log(dataval.series);
    var seriesval = [ ];

    dataval.series.forEach((el, idx) => {
        seriesval.push(dataval.series[idx]);
    })
// alert(seriesval)
    new Chartist.Bar('#chartist-horizontal-bar', {
        labels: [dataval.labels[0], dataval.labels[1], dataval.labels[2] ], // ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        series: [ seriesval] // [[5, 4, 3, 7, 5, 10, 3], [3, 2, 9, 5, 4, 6, 4]]
            }, {
    seriesBarDistance: 50,
    reverseData: false,
    horizontalBars: true,
    stretch: false,
    axisY: {
        offset: 70
    },
    axisX: {
        offset: 100
    }
    });

}

var drawOverlapBar = (dataval) => {
    /* ======================================================================
    Overlapping Bars
    ====================================================================== */
    var seriesval = [ ];
    var lbl = [ ];
    
    dataval.labels.forEach((el, idx) => {
        lbl.push(dataval.labels[idx]);
    });

    dataval.series.forEach((el, idx) => {
        seriesval.push(dataval.series[idx]);
    });

    var data = {
        labels: lbl, 
        series: [seriesval]
    };

    var options = {
        seriesBarDistance: 25
    };

    var responsiveOptions = [
    ['screen and (max-width: 640px)', {
        seriesBarDistance: 25,
        axisX: {
            labelInterpolationFnc: function (value) {
                return value[0];
            }
        }
    }]
    ];

    new Chartist.Bar('#chartist-bar-overlap', data, options, responsiveOptions);

}

var drawChart = (dataval) => {
    var seriesval = [ ];
    dataval.series.forEach(function(el, idx){
        srs = dataval.series[idx];
        seriesval.push(srs);
    }); 

    var data = {
    labels: [dataval.labels],
        series: [seriesval ]
    };


    var options = {
    seriesBarDistance: 15
    };

    var responsiveOptions = [
    ['screen and (min-width: 641px) and (max-width: 1024px)', {
        seriesBarDistance: 10,
        axisX: {
        labelInterpolationFnc: function (value) {
            return value;
        }
        }
    }],
    ['screen and (max-width: 640px)', {
        seriesBarDistance: 5,
        axisX: {
        labelInterpolationFnc: function (value) {
            return value[0];
        }
        }
    }]
    ];

    // new Chartist.Bar('.ct-chart', data, options, responsiveOptions);

}




var drawGaugeChart = (dataval) => {
/* ======================================================================
Gauge Chart
====================================================================== */
new Chartist.Pie('#chartist-gauge', {
    series: [20, 10, 30, 40]
}, {
donut: true,
donutWidth: 60,
startAngle: 270,
total: 200,
showLabel: false
});

}

var showgraph = (id) => {
    // alert(id);
    
    var q_id = $('#questions').val();

    drawGraphReport(q_id, id);

}



