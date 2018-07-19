require('dotenv')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const puppeteer = require('./modules/puppeteer')
const port = process.env.PORT || 3000

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
    res.sendFile('index.html')
})
app.post('/getcarinfo', (req, res) => {
    puppeteer(req, res)
})

app.listen(port, () => {
    console.log('server running on port ', port)
})