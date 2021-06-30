//para não estar a reeniciar o servidor.. ver e ler npm nodemon.
const express = require('express')
//utilize o mysql2
//https://www.npmjs.com/package/mysql2
const mysql = require('mysql2');
var bodyParser = require('body-parser');
const app = express()
const port = 3000
const bcrypt = require('bcrypt');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

// parse application/json
app.use(bodyParser.json())

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

app.get('/TU', (req, res) => {

	let sql = 'SELECT * FROM Up';

	connection.query(sql, (err,result)=>{
		if(err) throw err;

		res.send(result);
	});
});

app.get('/TD', (req, res) => {

	let sql = 'SELECT * FROM Down';

	connection.query(sql, (err,result)=>{
		if(err) throw err;

		res.send(result);
	});
});


app.post('/InsertTU', (req, res) => {
    var text = req.body.text;
    console.log("\ntexto:", text);
    var email = req.body.creds;
    console.log("\nemail:", email);
    var user_id = 0;

    
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
          console.log(result[0]); // good
          user_id = result[0];  // Scope is larger than function
          return callback(result[0]);
  })
}

  get_info(function(result){
    user_id = result.id;
    console.log("o que és??", user_id)

    var sql = "INSERT INTO `Up` (`text`, `user_id`) VALUES ('"+text+"', '"+user_id+"')"; 
    connection.query(sql, (err,result)=>{
      if(err) throw err;
      console.log(result);
      res.send(result);
    });
  });

});


app.post('/InsertTD', (req, res) => {
    var text = req.body.text;
    var email = req.body.creds;
    var user_id = 0;

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
            console.log(result[0]); // good
            user_id = result[0];  // Scope is larger than function
            return callback(result[0]);
    })
  }
  
    get_info(function(result){
      user_id = result.id;
      console.log("o que és??", user_id)
  
      var sql = "INSERT INTO `Down` (`text`, `user_id`) VALUES ('"+text+"', '"+user_id+"')"; 
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
  let creds = req.get('Authorization');
  console.log("aqui1", creds);

  // creds will return something like "Basic klsfkjs". We dont need the 'Basic' word and the space. Basic é um tipo comum de autenticação.
  // Só queremos as credenciais que vêm a seguir, por isso:
  creds = creds.substr(creds.indexOf(' ') + 1); // vai começar no inicio das credenciais.
  console.log("aqui2", creds);

  // so now we need to convert it back to binary or visually for us ascii.
  creds = Buffer.from(creds, 'base64').toString('binary');
  console.log("aqui3", creds);

  // so the previous line should give us something like "rita@test.com:123456789"
  // so now we want to split up the email and the pass. So:
  creds = creds.split(':'); //this will give us an array with the email and the pass.
  console.log("aqui4", creds);

  var email = creds[0];
  var pass = creds[1];

  /* Here we should make a DB check of credentials */

  try{
    let user = "SELECT password from User WHERE email = '"+email+"' ";

    if(user){
      const validPass = bcrypt.compare(pass, user);
      if(validPass){
        connection.query(user, (err,result)=>{
          if(err) throw err;
          console.log(result);
          //res.send(result);
          res.status(200).end(); //authorized
          next();
      });
      }
      else{
        console.log("não autorizado")
        res.status(401).end() //401 is unauthorized
      }
    }
    else{
      console.log("não existente")
      res.status(404).json('User not found!');
    }

  }
  catch(e){
    console.log(e);
    res.status(401).end();
  }

}


//if the user authenticates, they'll have access to the rest of the code.
app.get('/login', authenticate_user, (req, res) => {
  res.status(200).end();
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