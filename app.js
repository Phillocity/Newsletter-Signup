"use strict";
const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv").config();
const axios = require("axios");
const app = express();
app.use(express.static("public"));
app.listen(process.env.PORT || 8080);
app.use(bodyParser.urlencoded({
    extended: true,
}));
const listId = "55381e217f";
const apiKey = process.env.MAILCHIMP_API_KEY;
const serverPrefix = "us10";
app.get("/", (res) => {
    res.sendFile(__dirname + "/signup.html");
});
app.post("/", (req, res) => {
    const firstName = req.body.fname;
    const lastName = req.body.lname;
    const email = req.body.email;
    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName,
                },
            },
        ],
    };
    const url = `https://${serverPrefix}.api.mailchimp.com/3.0/lists/${listId}`;
    const jsonData = JSON.stringify(data);
    const axiosConig = {
        auth: {
            username: "phillip1",
            password: apiKey,
        },
        headers: {
            "Content-Type": "application/json",
        },
    };
    axios.post(url, jsonData, axiosConig).then((response) => {
        if (response.status === 200) {
            res.sendFile(__dirname + "/success.html");
        }
        else {
            res.sendFile(__dirname + "/failure.html");
        }
    });
});
app.post("/failure", (res) => {
    res.redirect("/");
});
