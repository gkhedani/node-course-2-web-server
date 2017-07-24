const express = require("express");
const hbs = require("hbs");
const fs = require("fs");

// heroku PORT environment variable
// if we run it locally, it should use the default of 3000
const port = process.env.PORT || 3000;

var app = express();

hbs.registerPartials(__dirname + "/views/partials");
hbs.registerHelper("getCurrentYear", () => {
  return new Date().getFullYear();
})

hbs.registerHelper("screamIt", (text) => {
  return text.toUpperCase();
})

app.set("view engine", "hbs");


app.use((req, res, next) => {
  // next tells express when you're middleware is done
  var now = new Date().toString();
  var log = `${now}: ${req.method} ${req.url}`;
  console.log(log);
  fs.appendFile("server.log", log + "\n", (err) => {
    if (err) {
      console.log("Unable to append to server.log");
    }
  })
  next();
});

// maintenance message middleware
// app.use((req, res, next) => {
//   res.render("maintenance.hbs");
// });

// fast way to setup a static website
// __dirname stores the path of your directory
app.use(express.static(__dirname + "/public"));

// handler for the http requests
app.get("/", (req, res) => {
  // res.send("<h1>Hello Express!</h1>");
  // example for sending json data
  // res.send({
  //   name: "Gail",
  //   likes: [
  //     "Rurouni Kenshin",
  //     "Hawaii"
  //   ]
  // });
  res.render("home.hbs", {
    pageTitle:  "My First Website",
    welcomeMessage:  "Aloha!  Welcome to my website!"
  })
});


app.get("/about", (req, res) => {
  // res.send("About Page");
  res.render("about.hbs", {
    pageTitle: "ABOUT PAGE",
  });
});

// when the app fails
app.get("/bad", (req, res) => {
  res.send({
    errorMessage: "Error!"
  });
});

// bind the application to a port on a machine
// heroku deployment - which uses an environment variable to make it dynamic
app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
