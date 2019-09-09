import React, { Component } from 'react';
import PropTypes from 'prop-types';

class MapButton extends Component {
  render() {
    const infoWindowStyle = {
      backgroundColor: 'white',
      padding: 10,
      fontSize: 14,
      zIndex: 100,
    };

    return (
      <button onClick={this.props.onClick} style={infoWindowStyle}>
        { this.props.name }
      </button>
    );
  }
};

MapButton.propTypes = {
  name: PropTypes.string,
};

export default MapButton;
