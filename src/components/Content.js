import React from "react";
import Weather from "./Weather";
import ForecastSlider from "./ForecastSlider";

class Content extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const {
      unit,
      cityID,
      addToFavorites,
      feelsLike,
      humidity,
      wind,
      deg,
      sunrise,
      sunset,
      weatherData,
      forecastItems,
      visibility,
      area,
      country,
      temp,
      weather,
      icon,
    } = this.props;
    return (
      <main>
        <form>
          <button type="button" onClick={() => addToFavorites(cityID, area)}>
            Add to favorites
          </button>
        </form>
        <Weather
          area={area}
          country={country}
          weather={weather}
          temp={temp}
          feelsLike={feelsLike}
          icon={icon}
          unit={unit}
        />
        <hr />
        <ForecastSlider forecastItems={forecastItems} />
        <hr />
        {weatherData && (
          <table className="details-table">
            <tbody>
              <tr>
                <th>Feels like</th>
                <th>Wind</th>
              </tr>
              <tr>
                <td>
                  {feelsLike}&deg;
                  {unit ? "C" : "F"}
                </td>
                <td>
                  {deg} {wind}
                  {unit ? "m/s" : "m/h"}
                </td>
              </tr>
              <tr>
                <th>Sunrise</th>
                <th>Sunset</th>
              </tr>
              <tr>
                <td>{sunrise}</td>
                <td>{sunset}</td>
              </tr>
              <tr>
                <th>Humidity</th>
                <th>Visibility</th>
              </tr>
              <tr>
                <td>{humidity}%</td>
                <td>{visibility}m</td>
              </tr>
            </tbody>
          </table>
        )}
      </main>
    );
  }
}

export default Content;
