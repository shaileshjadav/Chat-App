//include require
var express=require('express');
var app=express();
var server=require('http').createServer(app);
var io=require('socket.io').listen(server);

users=[];
connections=[];

//connect server to port
// server.listen(process.env.PORT || 3000);
server.listen(process.env.PORT || 4545);


console.log("server started...");
//set route
app.get('/',function(req,res){
    res.sendFile(__dirname+'/index.html');
});

//get user connect to sockets
io.sockets.on('connection',function(socket){
    connections.push(socket);
   
    console.log("Connected: %s sockets connected", connections.length);

    //get after disconnected user
    socket.on('disconnect',function(){
        //remove from online user
       
        users.splice(users.indexOf(socket.username),1);
        updateusernames();
        connections.splice(connections.indexOf(socket),1);
        console.log("Disconnected: %s sockets connected",connections.length);
    });
   
    //send message
    socket.on('send message',function(data){
        // console.log(data);
        io.sockets.emit('new message',{msg:data,user:socket.username});
    });

    //New user
    socket.on('new user',function(data,acknowledgement){
        //for acknowledgement
        acknowledgement(true);
        //set username to socket
        socket.username=data;
        //update in user arr
        users.push(socket.username);
        //get  username from socket
        updateusernames();
    });
    
    // online users
    function updateusernames(){
        io.sockets.emit('get users',users);
    }
    
});