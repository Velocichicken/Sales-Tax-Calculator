const express = require('express')
const app = express()

app.use(express.static("./src"))

app.listen(7080, ()=>{
    console.log("ready")
})
