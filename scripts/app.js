// Write your code!
console.log('Hello bakers');
// Write your code!
import scrollama from 'scrollama';
import * as d3 from 'd3';
import maplibregl from 'maplibre-gl';
import lc from '../_data/lc.json';
console.log(lc);

const map = new maplibregl.Map({
  container: 'map', // container id
  style: 'https://demotiles.maplibre.org/globe.json', // style URL
  center: [-99.9018, 31.9686], // Chicago's coordinates [lng, lat]
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
  map.resize();
  init();
});
// Example usage: Pan and zoom to New York City

console.log(maplibregl);
console.log(map);

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
  step.style('height', stepHeight + 'px');

  // 2. update height of graphic element

  var graphicHeight = window.innerHeight / 2;
  var graphicMarginTop = (window.innerHeight - graphicHeight) / 2;

  graphic
    .style('height', graphicHeight + 'px')
    .style('top', graphicMarginTop + 'px');

  // 4. tell scrollama to update new element dimensions
  scroller.resize();
}

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
    panAndZoomMap(-87.6298, 41.8781, 2); // Adjust zoom level to fit all pins

    // Add pins for all locations in lc.json

    lc.forEach((location) => {
      console.log(location);
      if (location.Longitude && location.Latitude) {
        // Ensure coordinates are valid
        let markerColor = 'blue'; // Default color
        if (location.status === 'yes') {
          markerColor = 'green'; // Green for "yes"
        } else if (location.status === 'no') {
          markerColor = 'red'; // Red for "no"
        }

        // Create a custom marker element
        const markerElement = document.createElement('div');
        markerElement.style.backgroundColor = markerColor;
        markerElement.style.width = '12px';
        markerElement.style.height = '12px';
        markerElement.style.borderRadius = '50%';
        markerElement.style.border = '2px solid white';

        // Add the marker to the map
        new maplibregl.Marker({ element: markerElement })
          .setLngLat([location.Longitude, location.Latitude]) // Set marker coordinates
          .addTo(map); // Add marker to the map
      }
    });
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
