var http=require('http');
var express=require('express');
var app=express();
var fs=require('fs');
var bodyParser=require('body-parser');
app.use(bodyParser.urlencoded({extended:true}));

app.get('/',function(request,response){
  response.sendFile(__dirname + '/homePage.html');
  
})
//homepage, the page that can able you to navigate to different pages.
app.get('/homePage.html',function(request,response){
	response.sendFile(__dirname+'/homePage.html');
});

//post to todo list page
app.get('/post.html',function(request,response){
   response.sendFile(__dirname+'/post.html');
});

 //delete from todo list page
app.get('/delete.html',function(request,response){
   response.sendFile(__dirname+'/delete.html');
});

//todo list page
app.get('/todo.html',function(request,response){
 fs.readFile(__dirname+'/todo.json','utf-8',function(error,data){
   

    if(error==null){
    	response.writeHead(200,{"content-type":"text/plain"});
    	response.write(data);
    }else{
    	response.writeHead(404);
    	response.write('file not found');
    }
    response.end();
  });
});

//rout to different task events
app.post('/homePage.html',function(request,response){
    var load=request.body.btnLoad;
    var todo=request.body.btnPost;
    var deleteItem=request.body.btnDelete;
    if(load){
    	response.redirect('/todo.html');
    }else if(todo){
    	response.redirect('/post.html');
    }else if(deleteItem){
    	response.redirect('./delete.html')
    }
});

//post data to todo list
app.post('/post.html',function(request,response){
	var input=request.body.textboxName;
	 task =input + '\n';
  allTasks=input;
	fs.appendFile(__dirname + '/todo.json', input+'\n');
	response.redirect('/todo.html');
});

//delete data from todo list
app.post('/delete.html',function(request,response){
	var task;
	var allTasks;
	var input=request.body.deleteTextBox;
  //input = args.slice(1).join(' ');
	  fs.readFile(__dirname + '/todo.json', 'utf-8', function (error, data) {
      if (error == null) {
        allTasks = data.split(/\n/);
        task = allTasks[input - 1];
        allTasks[input - 1] =allTasks.splice(input,1);
     
      data = allTasks.join('\n');
      
      fs.writeFile(__dirname + '/todo.json', data);

     console.log('The task "' + task + '" is being deleted from the tasks');
     console.log('now your task is: '+'\n' + data);
      response.write("One task is being deleted");
      response.end();
    } else if (error.code == 'ENOENT') {
      console.error('No to-do items yet');
    } else {
      console.error('Error reading to do task');
    }
  });
})

//server listen port
app.listen(8000,function(){
	console.log("server started.....");
})