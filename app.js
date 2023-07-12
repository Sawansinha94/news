const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
// const request = require("request");
const app = express();

//Using Body parser to decode and identify the data from URL/html
app.use(bodyParser.urlencoded({ extended: true }));

//Getting hold of folder and content for images, css, etc using express
app.use(express.static("Public"));

//Initite homepage, browser trying to get response(res) for their request(res) to "/"
app.get("/", function (req, res) {

    //Homepage "/" data is sent to browser(client)
    res.sendFile(__dirname + "/signup.html");
})

//Browser has posted the form data to server , request(req) is sent from browser
app.post("/", function (req, res) {

    //Getting hold of request body values (from the form), name is used in each element
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const Email = req.body.email;

    console.log(firstName, lastName, Email)

    //Data is prepared as Object to created JSON form, pre-defined properties from API like email_address,FNAME,etc
    const data = {
        members: [{

            email_address: Email,
            status: "subscribed",
            merge_fields: {
                FNAME: firstName,
                LNAME: lastName
            }
        }]
    }
    //Data Object is converted to JSON format
    const jsonData = JSON.stringify(data);

    //URL is prepared as per the pre-defined API template to send data
    const url = "https://us21.api.mailchimp.com/3.0/lists/b0b6ec1432/";

    //Object defined to set the method and Auth to API url format
    const options = {
        method: "POST",
        auth: "Sawan:b99e563e7eb69290a3b8deeaf4268348-us21"
    }

    //https package used, "request" : to send data ; "get" : to receive data from API
    //Callback function used to capture response from API
    const request = https.request(url, options, function (response) {

        //callback response used to check status : 200(OK)
        if (response.statusCode === 200) {
            
            //Sending success html for POST response(res) if status is OK
            res.sendFile(__dirname + "/success.html");

        }
        else {
            //Sending success html for POST response(res) if status is Not OK
            res.sendFile(__dirname + "/failure.html")

        }
            //collecting data from callback response that the https requested
        response.on("data", function (data) {

            //decoding/simplifying JSON format data received from API and logging to console.
            const statuss = JSON.parse(data);
            console.log(statuss);
        })


    })

    //Writing the json data to API server.
    request.write(jsonData);
    request.end();
})


//Browser sending response from form in success html 
app.post("/success", function (req, res) {

    //Responding by redirecting to homepage
    res.redirect("/");
})



//Browser sending response from form in success html 
app.post("/failure", function (req, res) {

    //Responding by redirecting to homepage
    res.redirect("/");
})




//Listening to port 3000 or any port select by the host
app.listen(process.env.PORT || 3000, function () {

    console.log("Server has started !");
})