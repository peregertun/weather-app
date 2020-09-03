const app = require("express");
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const axios = require("axios");

const url = "https://jsonplaceholder.typicode.com/posts/1";
// const apiUrl = "http://api.openweathermap.org/data/2.5/";
let unit = true;
const cityID = 2711533;
const apiKey = "f97d92a14a6c1188251c76bf2e9b81a3";

async function getWeatherData() {
  let weatherRequest = await axios
    // .get(`${apiUrl}weather?id=${cityID}&units=${unit}&&appid=${apiKey}`)
    .get(url)
    .then((response) => {
      let data = response.data;
      console.log(response);
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
      //   console.log(data);
      console.log("sending: " + JSON.stringify(data, null, 2));

      socket.broadcast.emit("weatherData", data);
    }
  }
  sendDataFromApi();
});

http.listen(5000, () => {
  console.log("Server listening on port 5000");
});
