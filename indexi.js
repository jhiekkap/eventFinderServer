const express = require("express");
const app = express();
const port = 3001; 
const axios = require("axios");
const CircularJSON = require("circular-json");

const getEvents = (options = {}) => {
  try {
    console.log("http://open-api.myhelsinki.fi/v1/events/" + options);

    return axios
      .get("http://open-api.myhelsinki.fi/v1/events/" + options)
      .then(response => CircularJSON.stringify(response.data));
  } catch (error) {
    console.error("Axios error: " + error);
  }
};

app.use(function(req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
app.get("/api/events/", async (req, res, next) => {
  console.log(req.query);
  let options = "?";
  for (let key in req.query) {
    if (options != "?") {
      options += "&";
    }
    options += key + "=" + encodeURIComponent(req.query[key]);
  }
  try {
    const events = await getEvents(options);
    res.json(JSON.parse(events));
  } catch (error) {
    next(error);
  }
});

app.listen(port, () => console.log("Server running in port: " + port));
