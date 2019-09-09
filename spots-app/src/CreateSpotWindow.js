import React, { Component } from 'react';

class CreateSpotWindow extends Component {
  render() {
    const infoWindowStyle = {
      position: 'relative',
      bottom: 150,
      left: '-45px',
      width: 220,
      backgroundColor: 'white',
      boxShadow: '0 2px 7px 1px rgba(0, 0, 0, 0.3)',
      padding: 10,
      fontSize: 14,
      zIndex: 100,
    };

    return (
      <div style={infoWindowStyle}>
        <h2>{this.props.spot.name}</h2>
        <p>{this.props.spot.description}</p>
      </div>
    );
  }
};

export default CreateSpotWindow;
