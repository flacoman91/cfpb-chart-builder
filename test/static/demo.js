// This file is used to test the programmatic rendering and updating of a chart.

import { createChart, TileMap } from '../../src/js/index';
const container = document.getElementById( 'update-demo' );
const mapContainer = document.getElementById( 'map' );
const demoTileMap = document.getElementById( 'demo-tile-map' );

const demoTileData = [
  [
    { 'name': 'CA', 'value': 189568 },
    { 'name': 'FL', 'value': 140149 },
    { 'name': 'TX', 'value': 117748 },
    { 'name': 'NY', 'value': 94447 },
    { 'name': 'GA', 'value': 73889 },
    { 'name': 'IL', 'value': 53633 },
    { 'name': 'NJ', 'value': 51244 },
    { 'name': 'PA', 'value': 47724 },
    { 'name': 'NC', 'value': 43113 },
    { 'name': 'OH', 'value': 41448 },
    { 'name': 'VA', 'value': 40027 },
    { 'name': 'MD', 'value': 38833 },
    { 'name': 'MI', 'value': 32479 },
    { 'name': 'AZ', 'value': 29367 },
    { 'name': 'WA', 'value': 26115 },
    { 'name': 'MA', 'value': 24324 },
    { 'name': 'TN', 'value': 22950 },
    { 'name': 'CO', 'value': 21837 },
    { 'name': 'SC', 'value': 20947 },
    { 'name': 'MO', 'value': 19843 },
    { 'name': 'NV', 'value': 17779 },
    { 'name': 'LA', 'value': 16985 },
    { 'name': 'AL', 'value': 16104 },
    { 'name': 'IN', 'value': 15440 },
    { 'name': 'CT', 'value': 15256 },
    { 'name': 'MN', 'value': 14326 },
    { 'name': 'WI', 'value': 14045 },
    { 'name': 'OR', 'value': 13725 },
    { 'name': 'KY', 'value': 9633 },
    { 'name': 'UT', 'value': 9041 },
    { 'name': 'OK', 'value': 8686 },
    { 'name': 'MS', 'value': 8038 },
    { 'name': 'DC', 'value': 7419 },
    { 'name': 'AR', 'value': 6681 },
    { 'name': 'KS', 'value': 6614 },
    { 'name': 'DE', 'value': 6556 },
    { 'name': 'NM', 'value': 5982 },
    { 'name': 'IA', 'value': 5324 },
    { 'name': 'NH', 'value': 5088 },
    { 'name': 'HI', 'value': 4286 },
    { 'name': 'ID', 'value': 4130 },
    { 'name': 'RI', 'value': 3998 },
    { 'name': 'NE', 'value': 3813 },
    { 'name': 'ME', 'value': 3776 },
    { 'name': 'WV', 'value': 3205 },
    { 'name': 'MT', 'value': 2135 },
    { 'name': 'VT', 'value': 1780 },
    { 'name': 'SD', 'value': 1623 },
    { 'name': 'AK', 'value': 1476 },
    { 'name': 'ND', 'value': 1332 },
    { 'name': 'WY', 'value': 1259 }
  ]
];

const chart = new TileMap( {
  el: demoTileMap,
  data: demoTileData,
  colors: [
    'rgba(247, 248, 249, 0.5)',
    'rgba(212, 231, 230, 0.5)',
    'rgba(180, 210, 209, 0.5)',
    'rgba(137, 182, 181, 0.5)',
    'rgba(86, 149, 148, 0.5)',
    'rgba(37, 116, 115, 0.5)'
  ],
  localize: true,
  events: {
    // custom event handlers we can pass on
    click: function (event) {
      console.log(event)
      console.log(this)
    }
  }
} );


// Test chart updating.
// const testChartUpdateBtn = document.querySelector( '#test-chart-update' );
// testChartUpdateBtn.addEventListener( 'click', testChartUpdate );

function testChartUpdate() {
  testChartUpdateBtn.setAttribute( 'disabled', '' );

  chart.update( {
    source: 'mortgage-performance/time-series/30-89/12031;mortgage-performance/time-series/30-89/national',
    metadata: 'pct90'
  } ).then( () => {
    testChartUpdateBtn.removeAttribute( 'disabled' );
  } );
}

// Test map updating.
const testGeomapStatesBtn = document.querySelector( '#test-geomap-states' );
testGeomapStatesBtn.addEventListener( 'click', testGeomapStates );

const testGeomapCountiesBtn = document.querySelector( '#test-geomap-counties' );
testGeomapCountiesBtn.addEventListener( 'click', testGeomapCounties );

const testGeomapMetrosBtn = document.querySelector( '#test-geomap-metros' );
testGeomapMetrosBtn.addEventListener( 'click', testGeomapMetros );

const testGeomapHighlightBtn = document.querySelector( '#test-geomap-highlight' );
testGeomapHighlightBtn.addEventListener( 'click', testGeomapHighlight );

const btns = [
  testGeomapStatesBtn,
  testGeomapCountiesBtn,
  testGeomapMetrosBtn,
  testGeomapHighlightBtn
];

function disableBtns() {
  for ( let i in btns ) {
    btns[i].setAttribute( 'disabled', '' );
  }
}

function enableBtns() {
  for ( let i in btns ) {
    btns[i].removeAttribute( 'disabled' );
  }
}

function testGeomapStates() {
  disableBtns();

  map.update( {
    source: 'mortgage-performance/map-data/30-89/states/2009-01',
    metadata: 'states'
  } ).then( () => {
    enableBtns();
  } );
}

function testGeomapCounties() {
  disableBtns();

  map.update( {
    source: 'mortgage-performance/map-data/30-89/counties/2009-01',
    metadata: 'counties'
  } ).then( () => {
    enableBtns();
  } );
}

function testGeomapMetros() {
  disableBtns();

  map.update( {
    source: 'mortgage-performance/map-data/30-89/metros/2009-01',
    metadata: 'metros'
  } ).then( () => {
    map.highchart.chart.get( '10740' ).select( false );
    enableBtns();
  } );
}

function testGeomapHighlight() {
  disableBtns();

  map.update( {
    source: 'mortgage-performance/map-data/30-89/metros/2009-01',
    metadata: 'metros'
  } ).then( () => {
    map.highchart.chart.get( '10740' ).select( true, false );
    enableBtns();
  } );
}
