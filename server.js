//para não estar a reeniciar o servidor.. ver e ler npm nodemon.
const express = require('express');
const session = require('express-session')
const saltRounds = 10;


//utilize o mysql2
//https://www.npmjs.com/package/mysql2
const mysql = require('mysql2');
var bodyParser = require('body-parser');
const app = express();
const port = 3000;
const bcrypt = require('bcrypt');
const path = require('path');
var async = require('async');
var render = require('render');



// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

// parse application/json
app.use(bodyParser.json())


app.use(session({secret:'Keep it secret'
,name:'uniqueSessionID'
,saveUninitialized:false}))


// create the connection to database
const connection = mysql.createConnection({
  host: 'localhost',
  port:"8889",
  user: 'root',
  password:"root",
  database: 'FakeOrNot',
  //this line is for MAMP only
  socketPath:"/Applications/MAMP/tmp/mysql/mysql.sock"
});

connection.connect(function(err){
  if(err)throw err;
  
  console.log("Database Connected!");
  
});


//isto é feito com o express
app.get('/', function (req, res) {
    res.send('Hello World')
  })

app.get('/Fake', (req, res) => {

	let sql = 'SELECT * FROM Fake';

	connection.query(sql, (err,result)=>{
		if(err) throw err;

		res.send(result);
	});
});

app.get('/Questionable', (req, res) => {

	let sql = 'SELECT * FROM Questionable';

	connection.query(sql, (err,result)=>{
		if(err) throw err;

		res.send(result);
	});
});


app.post('/InsertFake', (req, res) => {
    var text = req.body.text;
    console.log("\ntexto:", text);
    var email = req.body.creds;
    console.log("\nemail:", email);
    var user_id = 0;
    var url = req.body.url;
    console.log("\nurl: ", url)
    
   // handling apostrophe in sql query
  if (text.includes("'")){
    var s_aux = "";
    for (let i = 0; i<text.length; i++){
        if (text[i] == "'"){
            s_aux += text[i];
        }
        s_aux += text[i];
    }
    text = s_aux;
  }
    
  console.log("\ntexto ALT: ", text);
    
  function get_info(callback){

    var sql = "SELECT `id` FROM `User` WHERE `email` = '"+email+"'";
    connection.query(sql, function(err, result){
          if (err){ 
            throw err;
          }
          console.log(result[0]); 
          user_id = result[0];  
          return callback(result[0]);
  })
}

  get_info(function(result){
    user_id = result.id;
    console.log("o que és??", user_id)

    var sql = "INSERT INTO `Fake` (`text`, `user_id`, `url`) VALUES ('"+text+"', '"+user_id+"', '"+url+"')"; 
    connection.query(sql, (err,result)=>{
      if(err) throw err;
      console.log(result);
      res.send(result);
    });
  });
});


app.post('/InsertQuestionable', (req, res) => {
    var text = req.body.text;
    var email = req.body.creds;
    var user_id = 0;
    var url = req.body.url;
    console.log("\nurl: ", url)

    console.log("\ntexto:", text);
    
    // handling apostrophe in sql query
    if (text.includes("'")){
        var s_aux = "";
        for (let i = 0; i<text.length; i++){
            if (text[i] == "'"){
                s_aux += text[i];
            }
            s_aux += text[i];
        }
        text = s_aux;
    }
    
    console.log("\ntexto ALT: ", text);

    function get_info(callback){

      var sql = "SELECT `id` FROM `User` WHERE `email` = '"+email+"'";
      connection.query(sql, function(err, result){
            if (err){ 
              throw err;
            }
            console.log(result[0]);
            user_id = result[0]; 
            return callback(result[0]);
    })
  }
  
    get_info(function(result){
      user_id = result.id;
  
      var sql = "INSERT INTO `Questionable` (`text`, `user_id`, `url`) VALUES ('"+text+"', '"+user_id+"', '"+url+"')"; 
      connection.query(sql, (err,result)=>{
        if(err) throw err;
        console.log(result);
        res.send(result);
      });
    });
  })


// Login and logout system

//middleware function to do the authorization/check of users credentials

function authenticate_user(req, res, next) {
  var user_pass = 0;

  let creds = req.get('Authorization');

  // creds will return something like "Basic klsfkjs". We dont need the 'Basic' word and the space. Basic é um tipo comum de autenticação.
  // Só queremos as credenciais que vêm a seguir, por isso:
  creds = creds.substr(creds.indexOf(' ') + 1); // vai começar no inicio das credenciais.

  // so now we need to convert it back to binary or visually for us ascii.
  creds = Buffer.from(creds, 'base64').toString('binary');

  // so the previous line should give us something like "rita@test.com:123456789"
  // so now we want to split up the email and the pass. So:
  creds = creds.split(':'); //this will give us an array with the email and the pass.

  var email = creds[0];
  var pass = creds[1];


  /* Here we should make a DB check of credentials */

  
  function get_auth(callback){

    var sql = "SELECT `password` from User WHERE email = '"+email+"' ";
    connection.query(sql, function(err, result){
          if (err){ 
            throw err;
          }
          console.log(result[0]);
          user_pass = result[0]; 
          return callback(result[0]);
  })
}

  get_auth(function(result){
    user_pass = result.password;    
 
    bcrypt.compare(pass, user_pass, (err, result) => {
      if (err || !result) {
        console.log("result:", result)
        console.log("utilizador não autorizado")
        res.status(401).end() //401 is unauthorized
        return false;
      }
      else {
        console.log("result:", result);
        res.status(200).end(); //authorized
        next();
      }
    
    });    

  });
}


//if the user authenticates, they'll have access to the rest of the code.
app.get('/login', authenticate_user, (req, res) => {
    res.status(200).end();

});

app.get('/register', (req, res) => {

  let creds = req.get('Authorization');
  // creds will return something like "Basic klsfkjs". We dont need the 'Basic' word and the space. Basic é um tipo comum de autenticação.
  // Só queremos as credenciais que vêm a seguir, por isso:
  creds = creds.substr(creds.indexOf(' ') + 1); // vai começar no inicio das credenciais.

  // so now we need to convert it back to binary or visually for us ascii.
  creds = Buffer.from(creds, 'base64').toString('binary');

  // so the previous line should give us something like "rita@test.com:123456789"
  // so now we want to split up the email and the pass. So:
  creds = creds.split(':'); //this will give us an array with the email and the pass.

  var name = creds[0]
  var email = creds[1];
  var pass = creds[2];
  var confirmpass = creds[3];


  connection.query('SELECT email FROM User WHERE email = ?', [email], async (error, results) => {
    if (error) {
      console.log(error);
      res.status(500).end();
    }

    if (results.length > 0){ //email already exists
      console.log("xauzinho")
      res.status(400).send("That email is already in use!").end();
    }

    else if (pass === confirmpass) { // passwords are the same
      console.log("olaaaaaaa")
      let hashedPassword = await bcrypt.hash(pass, 8);
      console.log (hashedPassword);

      connection.query('INSERT INTO `User` SET ?', {name: name, email: email, password:hashedPassword}, (error, results ) =>{
         if (error) throw err;

         else {
          console.log(results);
          res.status(200).send("User registered.").end();
         }

      });
    }

    else { // passwords are not the same
      console.log("xau")
      res.status(401).end();
    }

  });

});

app.get('/logout', authenticate_user, (req, res) => {
  res.status(200).end();
});

app.use((req, res, next) => {
  res.status(400).send("Route not found");
});

app.use((err, req, res, next) => {
  res.status(err.status || 500).send(err.message || "Problem.")
});



// Port
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})