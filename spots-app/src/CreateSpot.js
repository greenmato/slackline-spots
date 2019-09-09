import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import CreateSpotWindow from './CreateSpotWindow';

class CreateSpot extends Component {
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
        {this.props.show && <CreateSpotWindow spot={this.props.spot} />}
      </Fragment>
    )
  }
};

CreateSpot.propTypes = {
  spot: PropTypes.shape({
    name: PropTypes.string,
    description: PropTypes.string,
  }).isRequired,
};

export default CreateSpot;
