const express = require('express')
const path = require('path')
const hbs = require('hbs')
require('./db/mongoose.js')
const userRoute = require('./routers/user.js')

const app = express()


// path for express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views') // to change path of views to anything
const partialsPath = path.join(__dirname, '../templates/partials')
// console.log(__dirname)
// console.log(__filename)

// setup handle bars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

// setup static directory to serve
app.use(express.static(publicDirectoryPath))

app.use(express.json()) // to access json from req handlers 

app.get('', (req, res) => {
    res.render('index', {
        
    })
})

app.use(userRoute)

module.exports = app