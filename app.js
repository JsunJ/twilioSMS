// log-timestamp
require('log-timestamp');

// declaring in global scope to hold the dog image url for later
let imageUrl;

// node-fetch
const fetch = require("node-fetch");

// grabbing data from the dog api
function getRandomImage(){
  const randomImageApiUrl = "https://dog.ceo/api/breed/pembroke/images/random";

  // using the fetch api (node-fetch) and promises
  fetch(randomImageApiUrl)
    .then(function(response){
      // raw response to be converted to json for easy use
      return response.json();
    })
    .then(function(json){
      // log successful api call converted to json then store it
      console.log(json);
      imageUrl = json.message;
    })
    .catch(function(error){
      // for potential communication errors with the dog api
      console.log(error);
    });
};

// load first dog image when program starts
getRandomImage();

// node-cron
const cron = require('node-cron');

// dog image refresh schedule
const dogTask = cron.schedule('55 11 * * *', () => {
  getRandomImage();
});

dogTask.start();

// twilio set up
require('dotenv').config()
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

// require the Twilio module and create a REST client
const client = require('twilio')(accountSid, authToken);

// twilio SMS schedule
const task = cron.schedule('0 12 * * *', () => {
  client.messages.create({
    to: '+1xxxxxxxxxx',
    from: '+1xxxxxxxxxx',
    body: 'Hello!',
    mediaUrl: [imageUrl]
  })
  .then(message => console.log(message.sid));
});

task.start();