const express = require('express')
const app = express()

app.use(express.static("./src"))

app.listen(5500, ()=>{
    console.log("ready")
})
