const express = require('express')
const bodyParser = require('body-parser')
const push = require('./push.js')

const app = express()


app.use(function(req, res, next) { res.header("Access-Control-Allow-Origin", "*"); res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); res.header("Access-Control-Allow-Headers", "*"); next(); });
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Suscribe an user 
app.post('/Subscribe', (req, res) => {
    const sub = req.body
    res.send('ok')
    push.addSubscription(sub)
    console.log(JSON.stringify(sub))
})

//Get key
app.get('/key', (req, res) => {
    const key = push.getKey()
    console.log(`Consulta ${key}`)
    res.send(key)
})

app.post('/Push',(req, res) => {
    const body = req.body
    const notify = {
        title: body.title,
        body: body.body,
        user: body.user
    }
    push.sendPush(notify)
    res.send(notify)
})

const port  = process.env.PORT || 80

app.listen(port, ()=> {
    console.log(`App is running on PORT ${port}`)
})