const app = require("express");
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const axios = require("axios");
require("dotenv").config();

// const url = "https://jsonplaceholder.typicode.com/posts/1";
let unit = true;
const cityID = 2711533;

async function getWeatherData() {
  let weatherRequest = await axios
    .get(
      `${process.env.URL}weather?id=${cityID}&units=${unit}&&appid=${process.env.API_KEY}`
    )
    // .get(url)
    .then((response) => {
      let data = response.data;
      // console.log(response);
      return data;
    })
    .catch((error) => {
      console.log(error);
    });

  return weatherRequest;
}

io.on("connection", (socket) => {
  async function sendDataFromApi() {
    while (true) {
      await new Promise((resolve) => setTimeout(resolve, 10000));
      const data = await getWeatherData();

      console.log("sending: " + JSON.stringify(data, null, 2));
      socket.broadcast.emit("weatherData", data);
    }
  }
  sendDataFromApi();
});

http.listen(5000, () => {
  console.log("Server listening on port 5000");
});
