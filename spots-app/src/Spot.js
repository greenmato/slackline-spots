import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import SpotWindow from './SpotWindow';

class Spot extends Component {
  render() {
    const markerStyle = {
      border: '1px solid white',
      borderRadius: '50%',
      height: 10,
      width: 10,
      backgroundColor: this.props.show ? 'red' : 'blue',
      cursor: 'pointer',
      zIndex: 10,
    };

    return (
      <Fragment>
        <div style={markerStyle} />
        {this.props.show && <SpotWindow spot={this.props.spot} />}
      </Fragment>
    )
  }
};

Spot.propTypes = {
  spot: PropTypes.shape({
    name: PropTypes.string,
    description: PropTypes.string,
  }).isRequired,
};

export default Spot;
