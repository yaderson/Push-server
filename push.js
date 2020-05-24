const vapid = require('./vapid.json')
const fs = require('fs')
const webpush = require('web-push')

webpush.setVapidDetails(
    'mailto:example@yourdomain.org',
    vapid.publicKey,
    vapid.privateKey
);

urlsafeBase64 = require('urlsafe-base64')

const db = require('./subs-db.json')

module.exports.getKey = function() {
    return urlsafeBase64.decode(vapid.publicKey)
}

module.exports.addSubscription = function (subscription) {
    db.push(subscription)
    fs.writeFileSync(`${__dirname}/subs-db.json`, JSON.stringify(db))
    return 0
}

module.exports.sendPush = function (post) {
    db.forEach((subscription, i) => {
        webpush.sendNotification(subscription, JSON.stringify(post))
        console.log('SEND')
    })
}