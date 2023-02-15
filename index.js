const express = require('express');
const webPush = require('web-push');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const { JSDOM } = require('jsdom');
const { window } = new JSDOM("");
const $ = require('jquery')(window);
const cors = require('cors');
const app = express();
const publicKey = "BP9dpMh9ZzDu76icN_y9poka-vUmxC1WSFrwxHSariK-puJvRrwcsTYNs2AOrZ6SzNPcVzWnPq6vH1Q-yCXdHXc";
const privateKey = "WWE6g5zfMfrgkb27o44mfugBpnGfxTGGzykZjQLxu-c";
let confParams;

$.ajax("http://localhost/chatroom/index.php",{
    "type":"POST",
    "data":{"controller":"GetConfParamsAjax"},
    "complete":function (response){
        confParams = JSON.parse(response.responseText);
    }
});

app.use(bodyParser.json());
app.use(cors());
webPush.setVapidDetails("mailto:test@mail.com",publicKey,privateKey);

app.post("/subscribe", (req,res) =>{
    const params = req.body;
    res.status(201).json({});
    saveSubscription(params.subscription, params.username, params.chatroomId);
});

const port = 3000;
app.listen(port, ()=>{
    console.log(`server started on ${port}`)
});

setInterval(sendPushNotifications,10000)

async function saveSubscription(sub, username, chatroomId){
    let subUnique = await checkSubscriptionUnique(username,chatroomId);
    if (subUnique === true) {
        let connection = getDbConnection();;
        connection.connect(function (err){
            if (err) throw err;
            let query = "INSERT INTO chat_subscriptions (chat_room_id,user,subscription) VALUES ('"+chatroomId+"','"+username+"','"+cipher(JSON.stringify(sub),"encrypt")+"')";
            connection.query(query,function (err){
                if (err) throw err;
            });
        });
    }
}

function checkSubscriptionUnique(username, chatroomId) {
    let connection = getDbConnection();
    return new Promise(resolve => {
        connection.connect(function (err){
            if (err) throw err;
            let query = "SELECT * FROM chat_subscriptions WHERE user='"+username+"' AND chat_room_id='"+chatroomId+"' LIMIT 1";
            connection.query(query,(err, result, fields) => {
                if (err) throw err;
                resolve(result.length === 0);
            });
        });
    });
}

function cipher(data,process){
    let ciphered = "";
    $.ajax(confParams.url+"index.php",{
        "type":"POST",
        "async":false,
        "data":{
            "controller":"CipherAjax",
            "process":process,
            "data":data
        },
        "complete":function (response){
              ciphered = response.responseText;
        }
    });
    return ciphered;
}

function sendPushNotifications(){
    let connection = getDbConnection();
    connection.connect(function (err){
        if (err) throw err;
        let query = "SELECT * FROM chat_subscriptions";
        connection.query(query, async function (err, result){
            if (err) throw err;
            for (let i = 0; i < result.length; i++){
                let pushNecessary = await isPushNecessary(result[i]);
                if (pushNecessary === true) {
                }
            }
        });
    });
}

function isPushNecessary(subscriptionData){
    return new Promise(async resolve=> {
        let userInactive = await isUserInactive(subscriptionData.user,subscriptionData.chat_room_id);
        if (userInactive === true) {
            let lastMessageId = await getLastMessageId(subscriptionData.chat_room_id);
                if (subscriptionData.last_message_id < lastMessageId) {
                    let payload = JSON.stringify({

                    })
                    webPush.sendNotification(cipher(subscriptionData.subscription,"decrypt"),payload);
                }
        } else {
            resolve(false);
        }
    })
}

function getLastMessageId(chatroomId) {
    return new Promise(resolve => {
        let connection = getDbConnection();
        connection.connect(function (err){
            if (err) throw err;
            let query = "SELECT id FROM chat_messages WHERE chat_room_id='"+chatroomId+"' ORDER BY id DESC LIMIT 1";
            connection.query(query,(err, result) => {
                if (err) throw err;
                resolve(result.id);
            });
        });
    })
}

function isUserInactive(user, chatroomId) {
    let connection = getDbConnection();
    return new Promise(resolve => {
        connection.connect(function (err){
            if (err) throw err;
            let query = "SELECT * FROM chat_active WHERE user='"+user+"' AND chat_room_id='"+chatroomId+"' LIMIT 1";
            connection.query(query,(err, result, fields) => {
                if (err) throw err;
                resolve(result.length === 0);
            });
        });
    });
}

function getDbConnection(){
    return mysql.createConnection({
        host: confParams.host,
        user: confParams.user,
        password: confParams.pass,
        database: confParams.db
    })
}