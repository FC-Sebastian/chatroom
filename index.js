const express = require('express');
const webPush = require('web-push');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const { JSDOM } = require('jsdom');
const { window } = new JSDOM("");
const $ = require('jquery')(window);
const cors = require('cors');
const fs = require('fs');
const {Query} = require("mysql/lib/protocol/sequences");
const app = express();
const publicKey = "BP9dpMh9ZzDu76icN_y9poka-vUmxC1WSFrwxHSariK-puJvRrwcsTYNs2AOrZ6SzNPcVzWnPq6vH1Q-yCXdHXc";
const privateKey = "WWE6g5zfMfrgkb27o44mfugBpnGfxTGGzykZjQLxu-c";
let confParams;
let pool;
let emptyRooms = [];
let inactiveUsers = [];
$.ajax("http://192.168.2.186/chatroom/index.php",{
    "type":"POST",
    "async":false,
    "data":{"controller":"GetConfParamsAjax"},
    "success":function (response){
        confParams = JSON.parse(response);
        pool = mysql.createPool({
            connectionLimit: 100,
            host: confParams.host,
            user: confParams.user,
            password: confParams.pass,
            database: confParams.db
        });
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
    console.log(`server started on ${port}`);
});

//setInterval(sendPushNotifications,1000);
setInterval(setUserInactive,2000);
setInterval(clearRooms,15000);

/**
 * saves subscription to db
 * @param sub
 * @param username
 * @param chatroomId
 * @returns {Promise<void>}
 */
async function saveSubscription(sub, username, chatroomId){
    let subUnique = await checkSubscriptionUnique(username,chatroomId);
    if (subUnique === true) {
        let query = `INSERT INTO chat_subscriptions (chat_room_id,user,subscription) VALUES ('${chatroomId}','${username}','${cipher(JSON.stringify(sub),"encrypt")}')`;
        pool.query(query,function (err){
            if (err) throw err;
        });
    }
}

/**
 * checks whether a subscription is unique
 * @param username
 * @param chatroomId
 * @returns {Promise<unknown>}
 */
function checkSubscriptionUnique(username, chatroomId) {
    return new Promise(resolve => {
        let query = `SELECT * FROM chat_subscriptions WHERE user='${username}' AND chat_room_id='${chatroomId}' LIMIT 1`;
        pool.query(query,(err, result) => {
            if (err) throw err;
            resolve(result.length === 0);
        });
    });
}

/**
 * ciphers given data process can be "decrypt" or "encrypt"
 * @param data
 * @param process
 * @returns {string}
 */
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

/**
 * sends push notifications
 */
function sendPushNotifications(){
    console.log("sending PN");
    let query = "SELECT * FROM chat_subscriptions";
    pool.query(query, async function (err, result){
        if (err) throw err;
        for (let i = 0; i < result.length; i++){
            let pushNecessary = await isPushNecessary(result[i]);
            if (pushNecessary === true) {
                let payload = JSON.stringify({
                    title:"Hey " + result[i].user + "!",
                    body:"There are new messages for you"
                });
                let subscription = JSON.parse(cipher(result[i].subscription,"decrypt"));
                webPush.sendNotification(subscription,payload);
                console.log("PN sent");
            }
        }
    });
}

/**
 * checks whether a push notification is necessary
 * @param subscriptionData
 * @returns {Promise<unknown>}
 */
function isPushNecessary(subscriptionData){
    return new Promise(async resolve=> {
        let userInactive = await isUserInactive(subscriptionData.user,subscriptionData.chat_room_id,"chat_active");
        if (userInactive === true) {
            console.log("user inactive");
            let lastMessageId = await getLastMessageId(subscriptionData.chat_room_id);
                if (subscriptionData.last_message_id < lastMessageId) {
                    console.log("PN necessary");
                    await updateLastMessageId(subscriptionData.id,lastMessageId);
                    resolve(true);
                }
        } else {
            resolve(false);
        }
    });
}

/**
 * gets id of last message from given room
 * @param chatroomId
 * @returns {Promise<unknown>}
 */
function getLastMessageId(chatroomId) {
    return new Promise(resolve => {
        let query = `SELECT id FROM chat_messages WHERE chat_room_id = '${chatroomId}' AND user <> '' ORDER BY id DESC LIMIT 1`;
        pool.query(query,(err, result) => {
            if (err) throw err;
            if (result.length > 0) {
                resolve(result[0].id);
            }
        });
    });
}

/**
 * checks whether user is active
 * @param user
 * @param chatroomId
 * @param table
 * @returns {Promise<unknown>}
 */
function isUserInactive(user, chatroomId, table) {
    return new Promise(resolve => {
        let query = `SELECT * FROM ${table} WHERE user='${user}' AND chat_room_id='${chatroomId}' AND active='0' LIMIT 1`;
        pool.query(query,(err, result) => {
            if (err) throw err;
            resolve(result.length === 1);
        });
    });
}

/**
 * updates last message id of given subscription
 * @param subscriptionId
 * @param lastId
 * @returns {Promise<unknown>}
 */
function updateLastMessageId(subscriptionId, lastId) {
    return new Promise(resolve => {
        let query = `UPDATE chat_subscriptions SET last_message_id = '${lastId}' WHERE id='${subscriptionId}'`;
        pool.query(query,err=>{
            if (err) throw err;
            resolve(true);
        });
    });
}

/**
 * clears empty rooms then stores empty rooms in emptyRooms array
 * @returns {Promise<void>}
 */
async function clearRooms()
{
    if (emptyRooms.length > 0) {
        for (let i = 0; i < emptyRooms.length; i++){
            let roomEmpty = await isRoomEmpty(emptyRooms[i]);
            if (roomEmpty === true) {
                let deleted = await deleteRoom(emptyRooms[i]);
                if (deleted === true) {
                    console.log("deleted room "+emptyRooms[i]);
                    emptyRooms.splice(i,1);
                }
            }
        }
    }
    emptyRooms = await getEmptyRooms();
}

/**
 * checks whether room is empty
 * @param roomId
 * @returns {Promise<unknown>}
 */
function isRoomEmpty(roomId) {
    return new Promise(resolve => {
        let query = `SELECT * FROM chat_active WHERE chat_room_id='${roomId}' LIMIT 1`;
        pool.query(query,(err, result) => {
            if (err) throw err;
            resolve(result.length === 0);
        });
    });
}

/**
 * deletes room with given id
 * @param roomId
 * @returns {Promise<unknown>}
 */
function deleteRoom(roomId){
    return new Promise(async resolve => {
        let picsDeleted = await deletePics(roomId);
        if (picsDeleted === true) {
            deleteSubscription(roomId);
            deleteMessages(roomId);
        }
        let query = `DELETE FROM chat_rooms WHERE id = '${roomId}'`;
        pool.query(query, (err) => {
            if (err) throw err
            resolve(true);
        });
    });
}

/**
 * deletes images of given chatroom
 * @param roomId
 * @returns {Promise<unknown>}
 */
function deletePics(roomId){
    return new Promise(resolve => {
        let query = `SELECT picture_url FROM chat_messages WHERE chat_room_id = '${roomId}' AND picture_url <> ''`;
        pool.query(query,(err, result) => {
            if (err) throw err;
            for (let i = 0; i < result.length; i++){
                let url = cipher(result[i].picture_url,"decrypt");
                let file = url.slice(url.lastIndexOf("/")+1);
                let path = __dirname+"\\pics\\"+file;
                fs.unlink(path,(err) =>{
                    if (err) throw err;
                    console.log("deleted "+path);
                });
            }
            resolve(true);
        });
    });
}

/**
 * deletes messages of given chatroom
 * @param roomId
 */
function deleteMessages(roomId) {
    let query = `DELETE FROM chat_messages WHERE chat_room_id = '${roomId}'`;
    pool.query(query,(err) =>{
        if (err) throw err;
    });
}

/**
 * deletes subscriptions of given chatroom
 * @param roomId
 */
function deleteSubscription(roomId){
    let query = `DELETE FROM chat_subscriptions WHERE chat_room_id = '${roomId}'`;
    pool.query(query,(err) =>{
        if (err) throw err;
    });
}

/**
 * returns ids of empty chat rooms
 * @returns {Promise<unknown>}
 */
function getEmptyRooms()
{
    return new Promise(resolve => {
        let query = `SELECT id FROM chat_rooms`;
        let empty = [];
        pool.query(query,async (err, result) => {
            if (err) throw err;
            for (let i = 0; i < result.length; i++) {
                let roomEmpty = await isRoomEmpty(result[i].id);
                if (roomEmpty === true) {
                    empty.push(result[i].id);
                }
            }
            resolve(empty);
        });
    });
}

/**
 * checks if users are still active and deletes them if not
 * then stores all active users in array
 * @returns {Promise<void>}
 */
async function setUserInactive() {
    if (inactiveUsers.length > 0) {
        for (let i = 0; i < inactiveUsers.length; i++){
            let userInactive = await isUserInactive(inactiveUsers[i].user, inactiveUsers[i].chat_room_id,"chat_active");
            if (userInactive === true) {
                let deleted = await deleteUser(inactiveUsers[i].user, inactiveUsers[i].chat_room_id);
                if (deleted === true) {
                    sendUserLeft(inactiveUsers[i].user,inactiveUsers[i].chat_room_id);
                    inactiveUsers.splice(i,1);
                }
            }
        }
    }
    inactiveUsers = await getActiveUsers();
}

/**
 * deletes user by username and chat room id
 * @param user
 * @param chatId
 * @returns {Promise<unknown>}
 */
function deleteUser(user, chatId) {
    return new Promise(resolve => {
        let query = `DELETE FROM chat_active WHERE user = '${user}' AND chat_room_id = '${chatId}'`;
        pool.query(query,err => {
            if (err) throw err;
            resolve(true);
        });
        console.log(user + " deleted")
    });
}

/**
 * queries db and returns list of active users
 * @returns {Promise<unknown>}
 */
function getActiveUsers() {
    return new Promise(resolve => {
        let query = `SELECT * FROM chat_active`;
        let active = [];
        pool.query(query,async (err, result) => {
            if (err) throw err;
            for (let i = 0; i < result.length; i++) {
                active.push(result[i]);
            }
            resolve(active);
        });
    });
}

/**
 * sends "user left chat" notification
 * @param user
 * @param chat
 */
function sendUserLeft(user, chat) {
    let query = `INSERT INTO chat_messages (chat_room_id,msg_text) VALUES ('${chat}','${user} left the chat')`;
    pool.query(query, err => {
        if (err) throw err;
    });
}