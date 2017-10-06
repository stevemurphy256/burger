// Boilerplate code 2-35
var express = require("express");
var bodyParser = require("body-parser");

var app = express();
var port = process.env.PORT || 3000;

// Serve static content for the app from the "public" directory in the application directory.
app.use(express.static("public"));

// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

var mysql = require("mysql");

//Needs password
var connection;

if (process.env.JAWSDB_URL) {
  connection = mysql.createConnection(process.env.JAWSDB_URL);
} else {
 connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "burger_db"
  });
};

connection.connect(function(err) {
  if (err) {
    console.error("error connecting: " + err.stack);
    return;
  }
  console.log("connected as id " + connection.threadId);
});


// Serve index.handlebars to the root route.
app.get("/", function(req, res) {
  connection.query("SELECT * FROM burgers;", function(err, data) {
    if (err) {
      return res.status(500).end();
    }
    res.render("index", { burgers: data });
  });
});


// Get the api for all the burgers
app.get("/api/burgers", function(req, res) {
  connection.query("SELECT * FROM burgers;", function(err, data) {
    if (err) {
      return res.status(500).end();
    }

    res.json(data);
  });
});


// Update a burger
app.put("/burgers", function(req, res) {
	connection.query("UPDATE burgers SET devoured = ? WHERE id = ?", [req.body.devoured, req.body.id], function(err, result) {
    if (err) {
      // If an error occurred, send a generic server faliure
      return res.status(500).end();
    } else if (result.changedRows == 0) {
      // If no rows were changed, then the ID must not exist, so 404
      return res.status(404).end();
    } else {
      res.status(200).end();
    }
  });
});


// Create a burger
app.post("/burgers", function(req, res) {
  connection.query("INSERT INTO burgers (burger_name, devoured) VALUES (?, 0)", [req.body.burger_name], function(err, result) {
    if (err) {
      return res.status(500).end();
    }

    // Send back the ID of the new todo
    res.json({ id: result.insertId });
    console.log({ id: result.insertId });
  });
});



app.listen(port, function() {
  console.log("Listening on PORT " + port);
});