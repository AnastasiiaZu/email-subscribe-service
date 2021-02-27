const express = require("express");
const app = express();

// requiring and setting up the body parcer
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({
  extended: true
}));

const request = require("request");
const https = require("https");

// helps to render static files (like images and CSS code) for the server
app.use(express.static("public"));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.post("/", function(req, res) {

  var firstName = req.body.fName;
  var lastName = req.body.lName;
  var email = req.body.email;

  var data = {
    members: [{
      email_address: email,
      status: "subscribed",
      merge_fields: {
        FNAME: firstName,
        LNAME: lastName
      }
    }]
  };
  var jsonData = JSON.stringify(data);

  const url = "https://us1.api.mailchimp.com/3.0/lists/f2e4f01e7e";

  const options = {
    method: "POST",
    auth: "anastasiia1:87c267ab00a1102c46f34be2ecc067ad-us1"
  };

  const request = https.request(url, options, function(response) {
    response.on("data", function(data) {
      console.log(JSON.parse(data));

      var status = response.statusCode;

      if(status === 200){
        res.sendFile(__dirname + "/success.html");
      } else {
        res.sendFile(__dirname + "/failure.html");
      };
    });
  });

  request.write(jsonData);
  request.end();

});

app.post("/failure", function(req, res){
  res.redirect("/");
});




//API key = f6956c93692460bc8742604018156cad-us1
//List ID = f2e4f01e7e

app.listen(process.env.PORT || 3000, function() {
  console.log("This server is running on port 3000!")
});
