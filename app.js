var express = require('express');
var app=express();
var mongoose=require('mongoose');
mongoose.connect('mongodb://test:test@ds051833.mlab.com:51833/tictactoe');
var todoSchema = new mongoose.Schema({
  id:String,
  list:[String],
  length:{type:Number}
});
var Tic = mongoose.model('Tic',todoSchema);
var http = require('http').Server(app);
var io = require('socket.io')(http);
var id;var creator;var joiner;users={};
app.set('port',(process.env.PORT||3000));
app.get('/',function(req,res){
  res.sendFile(__dirname + '/index.html');
});
http.listen (app.get('port'),function() {
  console.log("listening to port number "+app.get('port'));
});
io.sockets.on('connection', function (socket) {
  Tic.find({length:1},{id:1,_id:0},function(err,result){
      if(err)
      {
        throw err;
      }
      else if(result){console.log(result);
      io.sockets.in(socket.id).emit('available',result);}
    });
socket.on('create',function(data){
  socket.username=data;
  var int = parseInt((Math.random() * 1000), 10)
  id=data+" "+int.toString();console.log(id);
  socket.join(id);
  var itemOne=Tic({id:id,list:[data],length:1}).save(function(err){
    if (err) throw err;
    console.log('item saved');
    Tic.findOne({id:id},function(err,result){
        if(err)
        {
          throw err;
        }
        else if(result)
        io.sockets.in(id).emit('created',result);
      });
      Tic.find({length:1},{id:1,_id:0},function(err,result){
          if(err)
          {
            throw err;
          }
          else if(result){console.log(result);
          io.sockets.emit('available',result);}
        });
  });
});
socket.on('join',function(data){
   id=data;
  socket.join(id);
  Tic.update(
    {id:id},
    {length:2},
    function(err,result){
      if (err) throw err;
      else{
        Tic.find({length:1},{id:1,_id:0},function(err,result){
            if(err)
            {
              throw err;
            }
            else if(result){console.log(result);
            io.sockets.emit('available',result);}
          });
      }
    }
  );

  io.sockets.in(socket.id).emit('player2name',id);
  socket.on('gamestart',function(data){
    socket.username=data;
    joiner=data;
    Tic.update(
      {id:id},
      {$push :{list:data}},
      function(err,result){
        if (err) throw err;
      }
    );
    Tic.findOne({id:id},function(err,result){
        if(err)
        {
          throw err;
        }
        else if(result)
        io.sockets.in(id).emit('joined',result);
        io.sockets.in(id).emit('firstmove',result.list);
        });
  });
});

socket.on('disconnect',function(data){
  Tic.update(
    {id:id},
    {$pull :{list:socket.username},$inc:{length:-1}},
    function(err,result){
      if (err) {throw err;}
      if(result.length==0)
      {
        Tic.remove({id:id},function(err,result){
          if (err) throw err;
          else{
            Tic.find({length:1},{id:1,_id:0},function(err,result){
                if(err)
                {
                  throw err;
                }
                else if(result){console.log(result);
                io.sockets.emit('available',result);}
              });
          }
        });
      }
      else{
        Tic.findOne({id:id},function(err,result){
            if(err)
            {
              throw err;
            }
            else if(result)
            io.sockets.in(id).emit('display',result);
          });
          Tic.find({length:1},{id:1,_id:0},function(err,result){
              if(err)
              {
                throw err;
              }
              else if(result){console.log(result);
              io.sockets.emit('available',result);}
              io.sockets.in(id).emit('reset',id);
            });

      }
    }
  );
});
socket.on('check',function(data){ console.log(data);
  io.sockets.in(id).emit('checked',data);
});
});
