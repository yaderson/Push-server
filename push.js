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

async function sendPush () {
    try {
        const subs = await pool.query('SELECT * FROM subs')
        const Result = await fetch('https://api.covid19api.com/summary')
        const res = await Result.json()

        subs.rows.forEach((subscriber, i) => {
            console.log(subscriber)

            const data = res.Countries.find(element => element.Slug === subscriber.pushcondition)
            
            if(data){
                const notify = {
                    title: `New Update For ${data.Country}`,
                    body: `New Cases Confirmed ${data.NewConfirmed}, New Recovered ${data.NewRecovered} & New Deaths ${data.NewDeaths} - Total Confirmed ${data.TotalConfirmed}, Total Deaths ${data.TotalDeaths}, Total Recovered ${data.TotalRecovered} Click or tap To see more info...`,
                    user: 'None',
                    slug: data.Slug
                }

                webpush.sendNotification(subscriber.subscriptionobject, JSON.stringify(notify))
                console.log(`Send data to USER ${i}, County ${subscriber.pushcondition}`)
            }else {
                console.log('Failed to send push...')
            }
        })

        return true
    }catch (err) {
        console.log(err)
    }
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