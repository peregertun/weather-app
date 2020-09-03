function Toolbox(weatherData) {
  let deg = convertWindDir(weatherData.wind.deg);
  let sunrise = convertTime(weatherData.sys.sunrise);
  let sunset = convertTime(weatherData.sys.sunset);

  let mydata = [deg, sunrise, sunset];

  function convertTime(unixTime) {
    let dt = new Date(unixTime * 1000);
    let h = dt.getHours();
    let m = "0" + dt.getMinutes();
    let t = h + ":" + m.substr(-2);
    return t;
  }

  function convertWindDir(deg) {
    let compass = [
      "N",
      "NNE",
      "NE",
      "ENE",
      "E",
      "ESE",
      "SE",
      "SSE",
      "S",
      "SSW",
      "SW",
      "WSW",
      "W",
      "WNW",
      "NW",
      "NNW",
      "N",
    ];
    let index = Math.round((deg % 360) / 22.5);
    return compass[index];
  }
  return mydata;
}

export default Toolbox;
