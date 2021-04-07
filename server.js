//para não estar a reeniciar o servidor.. ver e ler npm nodemon.
const express = require('express')
//utilize o mysql2
//https://www.npmjs.com/package/mysql2
const mysql = require('mysql2');
var bodyParser = require('body-parser');
const app = express()
const port = 3000


//app.use(express.static('public'));
//app.use(bodyParser.json({limit: '20mb'}));

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

  let sql = "INSERT INTO `Up` (`text`) VALUES ('"+text+"')"; 

	connection.query(sql, (err,result)=>{
		if(err) throw err;
		console.log(result);
		res.send(result);
	});
});

app.post('/InsertTD', (req, res) => {
    var text = req.body.text;
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

    let sql = "INSERT INTO `Down` (`text`) VALUES ('"+text+"');"
  
      connection.query(sql, (err,result)=>{
          if(err) throw err;
          console.log(result);
          res.send(result);
      });
  })


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})