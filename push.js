const vapid = require('./vapid.json')
const webpush = require('web-push')
const urlsafeBase64 = require('urlsafe-base64')
const fs = require('fs')
const fetch = require('node-fetch');
const pool = require('./pool')


//Create pg tables 
const queries = {
    tableSubs: `
        CREATE TABLE IF NOT EXISTS subs(
            subscriptionObject text NOT NULL PRIMARY KEY,
            pushCondition text NOT NULL
        );
    `
}

//Config vapid
webpush.setVapidDetails(
    'mailto:example@yourdomain.org',
    vapid.publicKey,
    vapid.privateKey
);



function createDb () {
    console.log(pool)
}

async function addSubscription (subscription, condition) {
    const result = await pool.query('INSERT INTO subs (subscriptionObject, pushCondition) VALUES($1, $2)',[subscription, condition])
    return result
}

async function sendPush (post) {
    const subs = await pool.query('SELECT * FROM subs')
    const ResultToUpdate = await fetch('https://api.covid19api.com/summary')

    ResultToUpdate.forEach((result) => {
        console.log(result)
    })

    // db.forEach((subscription, i) => {
    //     webpush.sendNotification(subscription, JSON.stringify(post))
    //     console.log('SEND')
    // })
}

async function getAllSuscribeUsers () {
    const result = await pool.query('SELECT * FROM subs')
    return result.rows
}


function getKey () {
    return urlsafeBase64.decode(vapid.publicKey)
}
async function create () {
    const result = await pool.query(queries.tableSubs)
    return result
}
module.exports = {
    createDb,
    getKey,
    addSubscription,
    getAllSuscribeUsers,
    create,
    sendPush
}