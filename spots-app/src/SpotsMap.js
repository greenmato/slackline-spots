import React, { Component, Fragment } from 'react';
import Spot from './Spot';
import CreateSpot from './CreateSpot';
import GoogleMap from './GoogleMap';
import MapControl from './MapControl';
import MapButton from './MapButton';
import axios from './Api';

class SpotsMap extends Component {
  static defaultProps = {
    center: {
      lat: 30.5074000,
      lng: 0.1278000
    },
    zoom: 11
  };

  constructor(props) {
    super(props);

    this.state = {
      spots: [],
    };
  }

  componentDidMount() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        var center = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        }
        this.getSpots(center)
      });
    }
  }

  getSpots(center) {
    axios.get('map/spots/')
      .then(
        (response) => {
          var spots = response.data.data
          spots.forEach((spot) => {
            spot.id = spot.id.toString();
            spot.show = false;
          });
          this.setState({
            isLoaded: true,
            spots: spots,
            createSpot: {
              show: false,
              lat: null,
              lng: null
            },
            center: center
          });
        },
        (error) => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      )
  }

  // onChildClick callback can take two arguments: key and childProps
  onChildClickCallback = (key, childProps) => {
    this.setState((state) => {
      const index = state.spots.findIndex(e => e.id === key);
      state.spots[index].show = !state.spots[index].show;
      return { spots: state.spots };
    });
  };

  enableCreateSpotMode = () => {
    this.map.setOptions({draggableCursor:'crosshair'});
    this.maps.event.addListener(this.map, "click", this.openForm);
  };

  openForm = (click) => {

  }

  render() {
    const { spots, createSpot } = this.state;
    console.log(createSpot)
    return (
      <Fragment>
        <div style={{ height: '100vh', width: '100%' }}>
          <GoogleMap
            center={this.state.center}
            defaultZoom={this.props.zoom}
            bootstrapURLKeys={{ key: process.env.REACT_APP_MAP_KEY }}
            onChildClick={this.onChildClickCallback}
            onGoogleApiLoaded={({map, maps}) => {
              this.map = map
              this.maps = maps
              this.setState({mapControlShouldRender: true})
            }}
            yesIWantToUseGoogleMapApiInternals
          >

            <MapControl
              map={this.map || null}
              controlPosition={this.maps ? this.maps.ControlPosition.TOP_CENTER : null}
            >
              <MapButton
                name={'Create Spot'}
                onClick={ this.enableCreateSpotMode }
              />
            </MapControl>

            <CreateSpot
              lat={createSpot.lat}
              lng={createSpot.lng}
              show={createSpot.show}
            />

            {spots.map(spot =>
              (<Spot
                key={spot.id}
                spot={spot}
                lat={spot.latitude}
                lng={spot.longitude}
                show={spot.show}
              />))}
          </GoogleMap>
        </div>
      </Fragment>
    );
  }
}

export default SpotsMap;
