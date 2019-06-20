const eventsRouter = require('../node_modules/express').Router()
//const Event = require('../models/event')  
const axios = require('../node_modules/axios'); 


 
eventsRouter.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>')
})

eventsRouter.get('/all', (req, res) => {
    let query = "http://open-api.myhelsinki.fi/v1/events/"
    console.log("loading..." + new Date())
    console.log('query: ', query)
    axios
        .get(query)
        .then(response => {
            console.log("done!" + new Date())
            let events = response.data 
            if (events) {
                res.json(events)
            } else {
                res.send("no events there")
            }
        })
        .catch(error => {
            console.log(error)
        }) 
})

eventsRouter.get('/allTags', (req, res) => {
    let query = "http://open-api.myhelsinki.fi/v1/events/"
    console.log("loading..." + new Date())
    console.log('query: ', query)
    axios
        .get(query)
        .then(response => {
            console.log("done!" + new Date())
            let tags = response.data.tags 
            if (tags) {
                res.json(tags) 
            } else {
                res.send("no events there")
            }
        })
        .catch(error => {
            console.log(error)
        }) 
})

eventsRouter.get('/eventsByCoordinates', (req, res) => {

    let lat = req.query.lat
    let long = req.query.long
    let dist = req.query.dist
    console.log("loading..." + new Date())
    console.log(lat, long, dist)
    let query = "http://open-api.myhelsinki.fi/v1/events/"
    query += `?distance_filter=${lat}%2c${long}%2c${dist}`
    console.log('query: ', query)
    axios
        .get(query)
        .then(response => {
            console.log("done!" + new Date())
            let events = response.data 
            
            if (events) {
                res.json(events)
            } else {
                res.send("no events there")
            }
        })
        .catch(error => {
            console.log(error)
        })
})

 
module.exports = eventsRouter 