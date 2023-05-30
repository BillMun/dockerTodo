const express = require('express')
const path = require('path')
const cors = require('cors')
const cookieParser = require("cookie-parser")
const bodyParser = require("body-parser")
const cors = require("cors")
const db = require('./db')

const app = express()

db.connect(app)

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, "public")))

require("./routes")(app)

app.on("ready", ()=>{
    app.listen(4500, ()=>{
        console.log("Server is up on port", 4500)
    })
})

module.exports = app;