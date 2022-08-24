import express from 'express';
import fetch from 'node-fetch';
import bodyParser from 'body-parser';
import 'dotenv/config'
import {fileURLToPath} from 'url';
import {dirname} from 'path';
import {resourceLimits} from 'worker_threads';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(express.static("public"))
app.listen(8080)
app.use(bodyParser.urlencoded({
    extended: true
}));

const listId = "55381e217f"
const apiKey = process.env.MAILCHIMP_API_KEY
const serverPrefix = "us10"

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", (req, res) => {
    const firstName = req.body.fname;
    const lastName = req.body.lname;
    const email = req.body.email;

    const data = {
        members: [{
            email_address: email,
            status: "subscribed",
            merge_fields: {
                FNAME: firstName,
                LNAME: lastName
            }
        }]
    }
    const url = `https://${serverPrefix}.api.mailchimp.com/3.0/lists/${listId}`
    const jsonData = JSON.stringify(data);
    const auth = 'Basic ' + Buffer.from("phillip1" + ':' + apiKey).toString('base64');
    const options = {
        method: "POST",
        headers: {
            Authorization: auth
        },
        body: jsonData
    }

    fetch(url, options)
        .then(response => {
            if (response.ok) {
                res.sendFile(__dirname + "/success.html");
            } else {
                res.sendFile(__dirname + "/failure.html");
            }
        })
})

app.post("/failure", (req, res) => {
    res.redirect("/");
})
