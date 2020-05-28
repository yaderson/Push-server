const express = require('express')
const bodyParser = require('body-parser')
const { getKey, addSubscription, getAllSuscribeUsers, create, sendPush } = require('./push.js')

const app = express()


app.use(function(req, res, next) { res.header("Access-Control-Allow-Origin", "*"); res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); res.header("Access-Control-Allow-Headers", "*"); next(); });
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Suscribe an user 
app.post('/Subscribe', async (req, res) => {
    try {
        const {sub, condition} = req.body
        const response = await addSubscription(sub,condition)
        res.json({
            ok: true
        })
    } catch (err) {
        res.status(500)
        console.log(err.detail)
        if(err.routine === 'ExecConstraints') {
            return res.json({
                ok: false,
                msg: 'Subscription is Already exist',
                err: err
            })
        }
        res.json({
            ok: false,
            msg: 'Server error',
            err: err
        })
    }
})

//Get key
app.get('/key', (req, res) => {
    const key = getKey()
    console.log(`Consulta ${key}`)
    res.send(key)
})

app.get('/Users', async (req, res) => {
    try {
        const Users = await getAllSuscribeUsers() 
        console.log(Users)
        res.json(Users)
    } catch (err) {
        res.status(500)
        res.json({
            ok: false,
            err
        })
    }
})

app.get('/Create', async (req, res) => {
    try {
        const Users = await create() 
        console.log(Users)
        res.json({
            ok: true
        })
    } catch (err) {
        res.status(500)
        res.json({
            ok: false,
            err
        })
    }
})

app.post('/Push', async(req, res) => {
    const body = req.body
    const notify = {
        title: body.title,
        body: body.body,
        user: body.user
    }
    await sendPush(notify)
    res.send(notify)
})

const port  = process.env.PORT || 80

app.listen(port, ()=> {
    console.log(`App is running on PORT ${port}`)
})