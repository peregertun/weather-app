import React from "react";

class Weather extends React.Component {
  render() {
    const { unit, area, country, temp, weather, icon } = this.props;
    return (
      <>
        {area && (
          <>
            <h1>
              {area}, {country}
            </h1>
            <h2>{weather}</h2>
            <img
              src={`http://openweathermap.org/img/wn/${icon}@2x.png`}
              alt="Icon"
            />
            {area && temp && (
              <h1>
                {temp}
                &deg;{unit ? "C" : "F"}
              </h1>
            )}
          </>
        )}
      </>
    );
  }
}

export default Weather;
