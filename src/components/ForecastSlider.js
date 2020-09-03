import React from "react";

class ForecastSlider extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const forecastItems = this.props.forecastItems;
    return (
      <div className="slider-container">
        <div className="slider">
          {forecastItems && (
            <div className="slides">{forecastItems}</div>
          )}
        </div>
      </div>
    );
  }
}

export default ForecastSlider;
