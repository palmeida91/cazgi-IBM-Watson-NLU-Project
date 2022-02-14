const express = require('express');
const app = new express();

/*This tells the server to use the client 
folder for all static resources*/
app.use(express.static('client'));

/*This tells the server to allow cross origin references*/
const cors_app = require('cors');
app.use(cors_app());

/*Uncomment the following lines to loan the environment 
variables that you set up in the .env file*/

const dotenv = require('dotenv');
dotenv.config();

const api_key = process.env.API_KEY;
const api_url = process.env.API_URL;

function getNLUInstance() {
    /*Type the code to create the NLU instance and return it.
    You can refer to the image in the instructions document
    to do the same.*/
    const NaturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1');
    const { IamAuthenticator } = require('ibm-watson/auth');

    const naturalLanguageUnderstanding = new NaturalLanguageUnderstandingV1({
        version: '2021-08-01',
        authenticator: new IamAuthenticator({
            apikey: api_key
        }),
        serviceUrl: api_url
    });
    return naturalLanguageUnderstanding;
}


//The default endpoint for the webserver
app.get("/", (req, res) => {
    res.render('index.html');
});

//The endpoint for the webserver ending with /url/emotion
app.get("/url/emotion", (req, res) => {
    // //Extract the url passed from the client through the request object
    let urlToAnalyze = req.query.url
    const analyzeParams =
    {
        "url": urlToAnalyze,
        "features": {
            "keywords": {
                "emotion": true,
                "limit": 1
            }
        }
    }

    const naturalLanguageUnderstanding = getNLUInstance();

    naturalLanguageUnderstanding.analyze(analyzeParams)
        .then(analysisResults => {
            //Please refer to the image to see the order of retrieval
            return res.send(analysisResults.result.keywords[0].emotion, null, 2);
        })
        .catch(err => {
            return res.send("Could not do desired operation " + err);
        });
});

//The endpoint for the webserver ending with /url/sentiment
app.get("/url/sentiment", (req, res) => {
    // First get the url from the query
    let urlToAnalyze = req.query.url
    const analyzeParams =
    {
        "url": urlToAnalyze,
        "features": {
            "keywords": {
                "sentiment": true,
                "limit": 1
            }
        }
    }

    // create and instance of nlu
    const naturalLanguageUnderstanding = getNLUInstance();

    // analyze the url and return as a promise
    naturalLanguageUnderstanding.analyze(analyzeParams)
        .then(analysisResults => {
            // retrieve data from the jSON response and send back to res
            return res.send(analysisResults.result.keywords[0].emotion, null, 2);
        })
        .catch(err => {
            return res.send("Could not do desired operation " + err);
        });

});

//The endpoint for the webserver ending with /text/emotion
app.get("/text/emotion", (req, res) => {
    // get the text to analyse
    let textToAnalyse = req.query.text;
    // create the parameters to req to the watson API
    const analyseParams =
    {
        "text": textToAnalyse,
        "features": {
            "keywords": {
                "emotion": true,
                "limit": 1
            }
        }
    }

    // Create a new instance of watson nlu
    const naturalLanguageUnderstanding = getNLUInstance();

    // analize data and respond to the request via a callback function when the promise completes
    naturalLanguageUnderstanding.analyze(analyseParams)
        .then(analysisResults => {
            return res.send(analysisResults.result.keywords[0].emotion, null, 2);
        })
        .catch(err => {
            return res.send("Could not do the desired operation " + err);
        })

});

app.get("/text/sentiment", (req, res) => {
    // get the text to analyse
    let textToAnalyse = req.query.text;
    // create the parameters to req to the watson API
    const analyseParams =
    {
        "text": textToAnalyse,
        "features": {
            "keywords": {
                "sentiment": true,
                "limit": 1
            }
        }
    }

    // Create a new instance of watson nlu
    const naturalLanguageUnderstanding = getNLUInstance();

    // analize data and respond to the request via a callback function when the promise completes
    naturalLanguageUnderstanding.analyze(analyseParams)
        .then(analysisResults => {
            return res.send(analysisResults.result.keywords[0].emotion, null, 2);
        })
        .catch(err => {
            return res.send("Could not do the desired operation " + err);
        })

});

let server = app.listen(8080, () => {
    console.log('Listening', server.address().port)
})

