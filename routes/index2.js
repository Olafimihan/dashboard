app.get('/graphresponse', function(req, res){
    var project_id = 1; // req.body.project;
    var usermail = (req.query.usermail).trim(); //'dolaf2007@yahoo.com';

    console.log("Gotten for Graph: "+usermail );

    DataBasepool.getConnection(function(err, connection){
        console.log(usermail);
            
        connection.query("select refnos, project_title from project where usermail = ?", [usermail], function(err, results, fields){
            if(err){
                console.log(err);
            }

            var xx = 0;
            results.forEach(function(row){
                xx++;
            // })

            // console.log(xx);
            // console.log(results);
            // console.log(usermail);
            // console.log(usermail.trim());
            
            // res.s
            res.render('pages/r_graph', {
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