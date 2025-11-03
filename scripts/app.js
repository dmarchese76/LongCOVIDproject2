// Write your code!
console.log('Hello bakers');
// Write your code!
import scrollama from 'scrollama';
import * as d3 from 'd3';
import maplibregl from 'maplibre-gl';
import lc from '../_data/lc.json';

const map = new maplibregl.Map({
  container: 'map', // container id
  style: 'https://demotiles.maplibre.org/globe.json', // style URL
  center: [-98.5795, 39.8283], // Chicago's coordinates [lng, lat]
  zoom: 4, // starting zoom
  interactive: false, // Disable map interactions
});
function panAndZoomMap(lng, lat, zoomLevel) {
  map.flyTo({
    center: [lng, lat], // New coordinates [lng, lat]
    zoom: 4, // New zoom level
    essential: true, // This ensures the animation is user-friendly
    //padding: { top: 50, bottom: 50, left: 50, right: 50 } // Adjust padding as needed
  });
}
map.on('load', () => {
  map.setProjection('equalEarth');
  map.fitBounds(
    [
      [-125.0, 24.5], // Southwest coordinates (roughly southern CA/TX)
      [-66.9, 49.4], // Northeast coordinates (roughly Maine/North Dakota)
    ],
    {
      padding: 80, // Optional: adds padding around the bounds
      duration: 1000, // Optional: animation duration in ms
    }
  );
  map.resize();
  init();
});
// Example usage: Pan and zoom to New York City

// using d3 for convenience, and storing a selected elements
const container = d3.select('#scroll');
const graphic = container.select('.scroll__graphic');
const chart = graphic.select('.chart');
const text = container.select('.scroll__text');
const step = text.selectAll('.step');

// initialize the scrollama
const scroller = scrollama();

function handleResize() {
  // 1. update height of step elements for breathing room between steps
  const stepHeight = Math.floor(window.innerHeight * 0.5);
  //step.style('height', stepHeight + 'px');

  // 2. update height of graphic element

  var graphicHeight = window.innerHeight / 2;
  var graphicMarginTop = (window.innerHeight - graphicHeight) / 2;

  graphic;
  //.style('height', graphicHeight + 'px')
  // .style('top', graphicMarginTop + 'px');

  // 4. tell scrollama to update new element dimensions
  scroller.resize();
}

let markerLookup = new Map();

function handleStepEnter(response) {
  console.log('handleStepEnter', response);
  // response = { element, direction, index }

  // fade in current step
  step.classed('is-active', function (d, i) {
    return i === response.index;
  });

  // update graphic based on step here
  var activeStep = response.index + 1;
  // Clear the chart ...
  if (activeStep == 1) {
    console.log('DO THE STEP ONE STUFF...');
    //panAndZoomMap(-87.6298, 41.8781, 2); // Adjust zoom level to fit all pins
    // Clear out the markerLookup and remove existing markers from the map
    markerLookup.forEach((marker) => {
      marker.remove();
    });
    markerLookup.clear();

    // Create markers and store them in the lookup
    lc.forEach((location) => {
      if (location.Longitude && location.Latitude) {
        const markerColor =
          location.status === 'yes'
            ? 'green'
            : location.status === 'no'
            ? 'red'
            : 'blue';

        const markerElement = document.createElement('div');
        markerElement.style.backgroundColor = markerColor;
        markerElement.style.width = '12px';
        markerElement.style.height = '12px';
        markerElement.style.borderRadius = '50%';
        markerElement.style.border = '2px solid white';

        const marker = new maplibregl.Marker({ element: markerElement })
          .setLngLat([location.Longitude, location.Latitude])
          .addTo(map);

        markerLookup.set(`${location.Longitude},${location.Latitude}`, marker);
      }
    });
  }

  if (activeStep == 4) {
    console.log('DO THE STEP FOUR STUFF...');
    // Change the color of markers based on status}

    // Update marker colors based on status
    markerLookup.forEach((marker, key) => {
      console.log('key', key);
      const [lng, lat] = key.split(',').map(Number);
      const markerData = lc.find(
        (location) => location.Longitude === lng && location.Latitude === lat
      );
      console.log('markerData', markerData);

      if (markerData) {
        const markerElement = marker.getElement();
        markerElement.style.backgroundColor =
          markerData.status === 'Did not answer the survey' ? 'gray' : 'blue';
      }
    });
  }

  if (activeStep == 5) {
  }
  console.log('activeStep', activeStep);
}

function init() {
  console.log('init');
  // 1. call a resize on load to update width/height/position of elements
  handleResize();

  // 2. setup the scrollama instance
  // 3. bind scrollama event handlers (this can be chained like below)
  scroller
    .setup({
      container: '#scroll', // our outermost scrollytelling element
      graphic: '.scroll__graphic', // the graphic
      text: '.scroll__text', // the step container
      step: '.scroll__text .step', // the step elements
      offset: 0.5, // set the trigger to be 1/2 way down screen
      debug: false, // display the trigger offset for testing
    })
    .onStepEnter(handleStepEnter);

  // setup resize event
  window.addEventListener('resize', handleResize);
}
