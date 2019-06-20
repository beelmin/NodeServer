var express = require('express');
var bodyParser = require("body-parser");
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://admin:admin@cluster0-bkyd9.mongodb.net/test?retryWrites=true&w=majority";


var app = express();

const port=process.env.PORT || 3000
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());



app.get('/', function (req, res,next) {

	const instance = new MongoClient(uri, { useNewUrlParser: true });
	instance.connect((err, client) => {
	  if (err){
	  	console.log('failed to connect')
	  	console.log(err)
	  } 
	  else {
	    console.log('connected')
	    const collection = client.db("chat").collection("users").find({}).toArray(function(err, result) {
		    if (err) throw err;
		    
		    instance.close();
		    res.json({
	    		"users": result
	 	    }); 
		    
		  });
	    
	  }
	 });
	
});

app.get('/chat', function(req,res,next){


	const instance = new MongoClient(uri, { useNewUrlParser: true });
	instance.connect((err, client) => {
	  if (err){
	  	console.log('failed to connect')
	  	console.log(err)
	  } 
	  else {
	    console.log('connected')
	    const collection = client.db("chat").collection("messages").find({}).toArray(function(err, result) {
		    if (err) throw err;
		   
		    instance.close();
		    res.json({
			"conversations": result
		    });
		    
		  });
	    
	  }
	 });

});


app.post('/', function(req, res, next) {
	if(req.body.authentication){
		
		var user = req.body.username;
  		var pass = req.body.password;
  		

  		const instance = new MongoClient(uri, { useNewUrlParser: true });
		instance.connect((err, client) => {
		  if (err){
		  	console.log('failed to connect')
		  	console.log(err)
		  } 
		  else {
		    
		    var query = { "user": user, "pass" : pass };
		    console.log(query)
		    const collection = client.db("chat").collection("users");
		    collection.find(query).toArray(function(err, result) {
			    if (err) throw err;
			    
			    if(result.length == 0){
			    	response = {success: false}
			    }
			    else{
			    	response = {success: true}
			    }
			    res.send(response);
			    
			  });
		    		 
		    instance.close()
		        
		  }
		 });

	}else if(req.body.coordinate){

		const instance = new MongoClient(uri, { useNewUrlParser: true });
		instance.connect((err, client) => {
		  if (err){
		  	console.log('failed to connect')
		  	console.log(err)
		  } 
		  else {

		  	const collection = client.db("chat").collection("users");

		  	var query = { "user": req.body.username, "pass" : req.body.password };
		  	var newvalues = { $set: {longitude: req.body.longitude, latitude: req.body.latitude } };
			    	
			collection.updateOne(query,newvalues, function(err, result) {
						
						if (err) throw(err)
						

						if(result){
							response = {success: true}
						}else{
							response = {success : false}
						}
					
						res.send(response);

					
			});

		  }
		  instance.close();
});
		

	}

});

app.post('/chat', function(req, res, next) {
	
	if(req.body.saveMess){
		
		var newMessage = {
			
			sender: req.body.sender,
			message : req.body.message,
			time : req.body.time
	  };
		
	  


	const instance = new MongoClient(uri, { useNewUrlParser: true });
	instance.connect((err, client) => {
	  if (err){
		console.log('failed to connect')
		console.log(err)
	  } 
	  else {
	    console.log('connected')
	    const collection = client.db("chat").collection(req.body.collectionName)
	    collection.insertOne(newMessage);
	    instance.close()

	  }
	 });
		
	}else if(req.body.getMess){
		
		const instance = new MongoClient(uri, { useNewUrlParser: true });
		instance.connect((err, client) => {
		  if (err){
			console.log('failed to connect')
			console.log(err)
		  } 
		  else {
		    console.log('connected')
		    const collection = client.db("chat").collection(req.body.collectionName).find({}).toArray(function(err, result) {
			    if (err) throw err;

			    instance.close();
			    res.json({
				"conversations": result
			    });

			  });

		  }
		 });
		
		
	}
  	
  

	   
});

app.listen(port, function () {
  console.log('Example app listening on port 3000!');
});
