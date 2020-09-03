import React from "react";
import SwipeableViews from "react-swipeable-views";
import { apiKey } from "./components/Settings";
import Toolbox from "./components/Toolbox";
import "./App.css";
import Content from "./components/Content";
import propTypes from "prop-types";
import io from "socket.io-client";

const socket = io.connect("http://localhost:5000");

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      favorites: [],
      cities: [],
      value: "",
      unit: true,
      message: "Trying to get your location",
    };
    this.addLocation = this.addLocation.bind(this);
    this.onChangeValue = this.onChangeValue.bind(this);
  }

  componentDidMount() {
    if (navigator.geolocation)
      navigator.geolocation.getCurrentPosition((position) => {
        // let latPos = -31.953512;
        // let lonPos = 115.857048;
        //funkarnte på aus för första sorteringne är om dec är större än

        // let latitude = latPos.toString().split(".");
        // let longitude = lonPos.toString().split(".");
        // let latitudeDecimal = latPos - latitude[0];
        // let longitudeDecimal = lonPos - longitude[0];

        let latitude = position.coords.latitude.toString().split(".");
        let longitude = position.coords.longitude.toString().split(".");
        let latitudeDecimal = position.coords.latitude - parseInt(latitude[0]);
        let longitudeDecimal =
          position.coords.longitude - parseInt(longitude[0]);

        fetch("./city.list.json")
          .then((response) => response.json())
          .then((data) => {
            let myArray = [];
            for (let i = 0; i < data.length; i++) {
              let lat = data[i].coord.lat.toString().split(".");
              let lon = data[i].coord.lon.toString().split(".");
              if (lat[0] === latitude[0] && lon[0] === longitude[0]) {
                let latDecimal = data[i].coord.lat - lat[0];
                let lonDecimal = data[i].coord.lon - lon[0];
                if (
                  latDecimal >= latitudeDecimal &&
                  lonDecimal >= longitudeDecimal
                ) {
                  if (
                    latDecimal.toString().charAt(2) ===
                    latitudeDecimal.toString().charAt(2)
                  ) {
                    myArray.push({
                      round: "1",
                      name: data[i].name,
                      id: data[i].id,
                      latitude: data[i].coord.lat,
                      longitude: data[i].coord.lon,
                      latDecimal: latDecimal,
                      lonDecimal: lonDecimal,
                    });
                    if (
                      myArray.length > 0 &&
                      lonDecimal.toString().charAt(2) -
                        longitudeDecimal.toString().charAt(2) <
                        3
                    ) {
                      myArray.push({
                        round: "2",
                        name: data[i].name,
                        id: data[i].id,
                        latitude: data[i].coord.lat,
                        longitude: data[i].coord.lon,
                        latDecimal: latDecimal,
                        lonDecimal: lonDecimal,
                      });
                    }
                    if (
                      myArray.length > 1 &&
                      lonDecimal.toString().charAt(2) -
                        longitudeDecimal.toString().charAt(2) <
                        2
                    ) {
                      myArray.push({
                        round: "3",
                        name: data[i].name,
                        id: data[i].id,
                        latitude: data[i].coord.lat,
                        longitude: data[i].coord.lon,
                        latDecimal: latDecimal,
                        lonDecimal: lonDecimal,
                      });
                      let cityID = data[i].id;
                      this.setState({ message: "" });
                      this.getWeather(cityID);
                    }
                  }
                }
              }
            }
            // console.log(myArray);
            // this.setState({ message: "Your location was not found" });
          });
      });
    else console.log("Geolocation is not supported");
  }

  async getWeather(cityID) {
    let unit;
    const apiUrl = "http://api.openweathermap.org/data/2.5/";
    if (this.state.unit ? (unit = "metric") : (unit = "imperial"));

    const weatherRequest = await fetch(
      `${apiUrl}weather?id=${cityID}&units=${unit}&&appid=${apiKey}`
    );

    const forecastRequest = await fetch(
      `${apiUrl}forecast?id=${cityID}&units=${unit}&&appid=${apiKey}`
    );

    const weatherData = await weatherRequest.json();
    const forecastData = await forecastRequest.json();

    if (weatherData.cod === 200) {
      //toolbox creates understandable data of windirection and time
      let result = Toolbox(weatherData);

      const forecastItems = [];
      let i;
      for (i = 0; i < forecastData.list.length; i++) {
        forecastItems.push(
          <div key={i}>
            <img
              src={`http://openweathermap.org/img/wn/${forecastData.list[i].weather[0].icon}@2x.png`}
              alt="Icon"
              className="forecast-icon"
            />
            <p>
              {forecastData.list[i].main.temp.toFixed(1)}
              &deg;
              {this.state.unit ? "C" : "F"}
            </p>
            <p>
              {forecastData.list[i].dt_txt.slice(8, 10)}/
              {forecastData.list[i].dt_txt.slice(5, 7)}
            </p>
            <p>{forecastData.list[i].dt_txt.slice(11, 16)}</p>
          </div>
        );
      }

      this.setState((prevState) => ({
        cities: [
          ...prevState.cities,
          {
            area: weatherData.name,
            cityID,
            weatherData,
            weather: weatherData.weather[0].description,
            icon: weatherData.weather[0].icon,
            country: weatherData.sys.country,
            temp: weatherData.main.temp.toFixed(1),
            feelsLike: weatherData.main.feels_like.toFixed(1),
            humidity: weatherData.main.humidity,
            visibility: weatherData.visibility,
            wind: weatherData.wind.speed,
            deg: result[0],
            sunrise: result[1],
            sunset: result[2],
            forecastData,
            forecastItems,
          },
        ],
      }));
    } else {
      console.log("something went wrong with the request to the api");
    }
  }

  toggleUnits = () => {
    this.setState({ unit: !this.state.unit }, () => {
      for (let i = 0; i < this.state.cities.length; i++) {
        this.getWeather(this.state.cities[i].cityID);
      }
    });
  };

  onChangeValue = (event) => {
    this.setState({ value: event.target.value });
  };

  addToFavorites = (cityID, area) => {
    if (!this.state.favorites.includes(cityID)) {
      this.setState(
        (prevState) => ({
          // favorite: ["cityId1", "cityId2"]
          favorites: [...prevState.favorites, cityID],
        }),
        () => {
          console.log(this.state.favorites);
        }
      );
    }
  };

  addLocation(e) {
    e.preventDefault();
    fetch("./city.list.json")
      .then((response) => response.json())
      .then((data) => {
        let searchedCity = this.state.value.trim();

        searchedCity =
          searchedCity.charAt(0).toUpperCase() + searchedCity.slice(1);
        // if (localStorage.searchResults.includes(searchedCity)) {
        //   console.log("orten du sökt på finns i localstorage");
        // }
        let length = data.length - 1;

        for (let i = 0; i < data.length; i++) {
          if (data[i].name === searchedCity) {
            let cityID = data[i].id;
            localStorage.setItem("searchResults", searchedCity);

            this.getWeather(cityID);
            this.setState({
              message: "",
            });
            break;
          }
          if (i === length) {
            this.setState({
              message: `The area "${searchedCity}" was not found"`,
            });
          }
        }
      });
  }

  // getDataFromServer = () => {
  //   // console.log(socket);
  //   socket.on("weatherData", (data) => {
  //     console.log(data);
  //   });
  // };

  renderLoadingState = () => <p>Loading...</p>;

  render() {
    // socket.on("weatherData", (data) => {
    //   console.log(data);
    // });

    const weatherData = this.state;
    const message = this.state.message;
    return (
      <>
        <nav className="swipe-container">
          <form onSubmit={this.addLocation}>
            <input
              type="text"
              placeholder="Search location"
              value={this.state.value}
              onChange={this.onChangeValue}
            />
            <button
              type="button"
              onClick={this.addLocation}
              disabled={!this.state.value}
            >
              Add location
            </button>
            <button type="button" onClick={this.toggleUnits}>
              Change unit
            </button>
            <button type="button" onClick={this.getDataFromServer}>
              Get data
            </button>
          </form>
        </nav>
        {message}
        {/* {weatherData ? "" : this.renderLoadingState()} */}
        {weatherData && (
          <SwipeableViews>
            {this.state.cities.reverse().map((value, index) => (
              <div
                key={index}
                className="swipe-container"
                style={Object.assign({})}
              >
                <Content
                  addToFavorites={this.addToFavorites}
                  area={this.state.cities[index].area}
                  cityID={this.state.cities[index].cityID}
                  weatherData={this.state.cities[index].weatherData}
                  forecastData={this.state.cities[index].forecastData}
                  forecastItems={this.state.cities[index].forecastItems}
                  feelsLike={this.state.cities[index].feelsLike}
                  wind={this.state.cities[index].wind}
                  deg={this.state.cities[index].deg}
                  humidity={this.state.cities[index].humidity}
                  sunrise={this.state.cities[index].sunrise}
                  sunset={this.state.cities[index].sunset}
                  unit={this.state.unit}
                  visibility={this.state.cities[index].visibility}
                  country={this.state.cities[index].country}
                  weather={this.state.cities[index].weather}
                  temp={this.state.cities[index].temp}
                  icon={this.state.cities[index].icon}
                />
              </div>
            ))}
          </SwipeableViews>
        )}
      </>
    );
  }
}

App.propTypes = {
  unit: propTypes.bool,
};

export default App;
