var socket = io.connect();
var $dele = $('#dele');
var $button1 = $('#button1');var counter=0;var moves=0;var gamecount=1;var playersname;var iden;
var visited1=0;
var visited2=0;
var visited3=0;
var visited4=0;
var visited5=0;
var visited6=0;
var visited7=0;
var visited8=0;
var visited9=0;
var ismoved=0;
var $button2 = $('#button2');
var $available=$('#available');
var $reset=$('#reset');
var $joinarea=$('#joinarea');
var $gamearea=$('#gamearea');
var $users=$('#users');
var $spot1=$('#spot1');
var $spot2=$('#spot2');
var $spot3=$('#spot3');
var $spot4=$('#spot4');
var $spot5=$('#spot5');
var $spot6=$('#spot6');
var $spot7=$('#spot7');
var $spot8=$('#spot8');
var $spot9=$('#spot9');
socket.on('available',function(data){
var html2='';
for(var i=0;i<data.length;i++)
{
html2+='<li class="list-group-item">Game id:  '+data[i].id+'</li>';
}
$available.html(html2);
});
$button1.click(function(e){
e.preventDefault();
mbox.prompt("Enter Your name",function(result){
    socket.emit('create',result);
});
socket.on('created',function(data){
  $joinarea.hide();
  $gamearea.show();
    iden=data.id;
  var html1='<p style="color:#263238"><strong>Game id:  '+data.id+'<strong></p>';var list=data.list; var html2='';
  for(i=0;i<list.length;i++)
  {
    html2+='<li class="list-group-item">'+list[i]+'</li>';
  }
  html1+=html2;
  $users.html(html1);
});
});
$button2.click(function(e){
e.preventDefault();
mbox.prompt("enter the id of game you want to enter:",function(result){
    socket.emit('join',result);
    socket.on('player2name',function(data){
      mbox.prompt("enter your name:",function(result){
        if(result)
        {socket.emit('gamestart',result);}
      });
    });
});
});


socket.on('joined',function(data){
$joinarea.hide();
$gamearea.show();
    iden=data.id;
var html1='<h4 style="color:white">Game id:  '+data.id+'</h4>';var list=data.list; var html2='';
for(i=0;i<list.length;i++)
{
  html2+='<li class="list-group-item">'+list[i]+'</li>';
}
html1+=html2;
$users.html(html1);
  socket.emit('namelist',gamecount);
});

$dele.click(function(e){
    socket.emit('disconnect',{id:iden});
    socket.disconnect();
    location.reload();

});
socket.on('display',function(data){
var html1='<h4 style="color:white">Game id:  '+data.id+'</h4>';var list=data.list; var html2='';
for(i=0;i<list.length;i++)
{
  html2+='<li class="list-group-item">'+list[i]+'</li>';
}
html1+=html2;
$users.html(html1);
});
socket.on('firstmove',function(data){
mbox.alert(data[1]+" will make the first move",function(err,result){
  if (err) throw err;
});
});
$spot1.click(function(){
    if(visited1==0)
    {
  if(counter==0)
  {document.getElementById("spot1").innerHTML ="O";counter=counter+1;}
  else {
    document.getElementById("spot1").innerHTML = "X";counter=counter-1;
  }
   visited1=1;
  socket.emit('check',{id:iden,area:"spot1",counter:counter,moves:moves,visited:visited1});

    }

});
socket.on('checked',function(data){
   data.visited=1;
if(data.counter==0)
{document.getElementById(data.area).innerHTML="X";}
else {
  document.getElementById(data.area).innerHTML="O";
}
    document.getElementById(data.area).click(false);
counter=data.counter;moves=data.moves+1;
if(($spot1.text()=="X"&&$spot2.text()=="X"&&$spot3.text()=="X")||($spot4.text()=="X"&&$spot5.text()=="X"&&$spot6.text()=="X")||($spot7.text()=="X"&&$spot8.text()=="X"&&$spot9.text()=="X")||($spot1.text()=="X"&&$spot4.text()=="X"&&$spot7.text()=="X")
||($spot2.text()=="X"&&$spot5.text()=="X"&&$spot8.text()=="X")||($spot3.text()=="X"&&$spot6.text()=="X"&&$spot9.text()=="X")||($spot1.text()=="X"&&$spot5.text()=="X"&&$spot9.text()=="X")||($spot3.text()=="X"&&$spot5.text()=="X"&&$spot7.text()=="X"))
{
  console.log("chal jaa na yaar");
    moves=0;counter=0;
  mbox.alert(playersname[(data.gamecount+1)%2]+" won the game!!..Press Reset to start new game",function(err,result){
    if (err) throw err;
  });
}
else if(($spot1.text()=="O"&&$spot2.text()=="O"&&$spot3.text()=="O")||($spot4.text()=="O"&&$spot5.text()=="O"&&$spot6.text()=="O")||($spot7.text()=="O"&&$spot8.text()=="O"&&$spot9.text()=="O")||($spot1.text()=="O"&&$spot4.text()=="O"&&$spot7.text()=="O")
||($spot2.text()=="O"&&$spot5.text()=="O"&&$spot8.text()=="O")||($spot3.text()=="O"&&$spot6.text()=="O"&&$spot9.text()=="O")||($spot1.text()=="O"&&$spot5.text()=="O"&&$spot9.text()=="O")||($spot3.text()=="O"&&$spot5.text()=="O"&&$spot7.text()=="O"))
{
    console.log("chal jaa na yaar");
    moves=0;counter=0;
    mbox.alert(playersname[data.gamecount]+" won the game!!..Press Reset to start new game",function(err,result){
      if (err) throw err;
    });
}
else if(moves==9)
{
  console.log("chal jaa na yaar");
  socket.emit('draw',{id:iden,gamecount:gamecount});
  mbox.alert("the game resulted in draw",function(err,result){
    if (err) throw err;
    mbox.alert("Press Reset to start new game",function(err,result){
      if (err) throw err;
    });
  });
    socket.emit('namelist',{id:iden,gamecount:gamecount});
}
});
socket.on('newgame1',function(data){
moves=0;counter=0;
});
$reset.click(function(e){
e.preventDefault();
$spot1.empty();$spot2.empty();$spot3.empty();$spot4.empty();$spot5.empty();$spot6.empty();$spot7.empty();$spot8.empty();$spot9.empty();
gamecount=gamecount+1;gamecount=gamecount%2;
    visited1=0;visited2=0;visited3=0;visited4=0;visited5=0;visited6=0;visited7=0;visited8=0;visited9=0;
mbox.alert(playersname[gamecount]+" will make first move",function(err,result){
  if (err) throw err;
});
});
socket.on('gotnamelist',function(data){
  playersname=data.list;
});
$spot2.click(function(){
     if(visited2==0)
    {
  if(counter==0)
  {document.getElementById("spot2").innerHTML ="O";counter=counter+1;}
  else {
    document.getElementById("spot2").innerHTML = "X";counter=counter-1;
  }
      visited2=1;
  socket.emit('check',{id:iden,area:"spot2",counter:counter,moves:moves,visited:visited2});

    }
  });
$spot3.click(function(){
     if(visited3==0)
    {
  if(counter==0)
  {document.getElementById("spot3").innerHTML ="O";counter=counter+1;}
  else {
    document.getElementById("spot3").innerHTML = "X";counter=counter-1;
  }
     visited3=1;
  socket.emit('check',{id:iden,area:"spot3",counter:counter,moves:moves,visited:visited3});

    }

});
$spot4.click(function(){
     if(visited4==0)
    {
  if(counter==0)
  {document.getElementById("spot4").innerHTML ="O";counter=counter+1;}
  else {
    document.getElementById("spot4").innerHTML = "X";counter=counter-1;
  }
     visited4=1;
  socket.emit('check',{id:iden,area:"spot4",counter:counter,moves:moves,visited:visited4});

    }
});
$spot5.click(function(){
     if(visited5==0)
    {
  if(counter==0)
  {document.getElementById("spot5").innerHTML ="O";counter=counter+1;}
  else {
    document.getElementById("spot5").innerHTML = "X";counter=counter-1;
  }
      visited5=1;
  socket.emit('check',{id:iden,area:"spot5",counter:counter,moves:moves,visited:visited5});

    }
});
$spot6.click(function(){
     if(visited6==0)
    {
  if(counter==0)
  {document.getElementById("spot6").innerHTML ="O";counter=counter+1;}
  else {
    document.getElementById("spot6").innerHTML = "X";counter=counter-1;
  }
      visited6=1;
  socket.emit('check',{id:iden,area:"spot6",counter:counter,moves:moves,visited:visited6});

    }
});
$spot7.click(function(){
     if(visited7==0)
    {
  if(counter==0)
  {document.getElementById("spot7").innerHTML ="O";counter=counter+1;}
  else {
    document.getElementById("spot7").innerHTML = "X";counter=counter-1;
  }
       visited7=1;
  socket.emit('check',{id:iden,area:"spot7",counter:counter,moves:moves,visited:visited7});

    }
                });
$spot8.click(function(){
     if(visited8==0)
    {
  if(counter==0)
  {document.getElementById("spot8").innerHTML ="O";counter=counter+1;}
  else {
    document.getElementById("spot8").innerHTML = "X";counter=counter-1;
  }
     visited8=1;
  socket.emit('check',{id:iden,area:"spot8",counter:counter,moves:moves,visited:visited8});

    }
                });
$spot9.click(function(){
     if(visited9==0)
    {
  if(counter==0)
  {document.getElementById("spot9").innerHTML ="O";counter=counter+1;}
  else {
    document.getElementById("spot9").innerHTML = "X";counter=counter-1;
  }
    visited9=1;
  socket.emit('check',{id:iden,area:"spot9",counter:counter,moves:moves,visited:visited9});

    }

});
socket.on('reset',function(data){counter=0;moves=0;gamecount=1;
$spot1.empty();$spot2.empty();$spot3.empty();$spot4.empty();$spot5.empty();$spot6.empty();$spot7.empty();$spot8.empty();$spot9.empty();
visited1=0;visited2=0;visited3=0;visited4=0;visited5=0;visited6=0;visited7=0;visited8=0;visited9=0;
                                });
