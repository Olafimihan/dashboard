var mysql = require('mysql'); 
var DataBasepool = mysql.createPool({
    connectionLimit: 1000000, 
    host: "127.0.0.1",
    //    host: "75.127.75.161",
    user: "root",
    password: "opeyemi",
    database: "surveydb" 
});



[{
	
}]

class getBoardContentTotal {

    constructor () {
        this.db = [];
        
    }

    getProjectTotal (){
        
    }

    addUser (id, name, room, email, phone, image) {

        var user = {id, name, room, email, phone, image};
        this.users.push(user);
        return user;
    }

        
    removedata (id) {

        var user = this.getUser(id);
        if (user) {

            this.users = this.users.filter((user) => user.id !== id);
        }	
        return user;
    }



    changeRoom (id, room){
        
        var user = this.getUser(id);

        if(user){
            this.users = this.users.filter((user) => user.id === id);
            var userArray = this.users.map((user) =>{ return user.room = room });

            // var namesArray = users.map((user) => { return user.room	} );	
            return userArray; 
        
        }
        
        
    }		

    getData (id) {

        return this.users.filter((user) => user.id === id)[0]
    }

    getUserList (room) {

        var users = this.users.filter((user) => 
        { 
            var obj;

            obj = user.room === room;
            return obj 
        } 
        );

        var namesArray = users.map((user) => 
        { 
            var obj ={
                image: user.image, username: user.name
            }

            return obj;	
            // return user.image, user.name;	
        }
        );

        return namesArray;
    }

    getRoomList () {
        
        var users = this.users.filter((user) => { return user.room !=='xxx' } );

        
        var namesArray = users.map((user) => { return user.room	} );	
        return namesArray; 
    }

    getServerCurrentTime(oDate){
        var sDate;
        if (oDate instanceof Date) {

            sDate = 
                        ((oDate.getHours  () < 10) ? '0' + (oDate.getHours()  ) : oDate.getHours())
                + ':' + ((oDate.getMinutes() < 10) ? '0' + (oDate.getMinutes()) : oDate.getMinutes())
                + ':' + ((oDate.getSeconds() < 10) ? '0' + (oDate.getSeconds()) : oDate.getSeconds());
        } else {
            throw new Error("oDate is not an instance of Date");
        }
        return sDate;
    }

    checkTime( i ) {
        if ( i < 10 ) 
        {
            i = "0" + i
        }; 
        return i;
    }
}

module.exports = {

    getBoardContentTotal
};