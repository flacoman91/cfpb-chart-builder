import Highcharts from 'highcharts/highmaps';
import accessibility from 'highcharts/modules/accessibility';
import getTileMapColor from '../utils/get-tile-map-color';
import { processMapData } from '../utils/process-json';

accessibility( Highcharts );

/**
 * Draw a legend on a chart.
 * @param {Object} chart A highchart chart.
 */
function _drawLegend( chart ) {
  const d = chart.options.series[0].data.map(o=>o.value);
  const colors = chart.options.colors;
  const bins = getTileMapColor.getBins(d);

  /**
   * @param {string} color hex color code.
   * @returns {Object} Return a hash of box fill and stroke styles.
   */
  function _boxStyle( color ) {
    return {
      'stroke-width': 1,
      'stroke': '#75787b',
      'fill': color
    };
  }

  // args: (str, x, y, shape, anchorX, anchorY, useHTML, baseline, className)
  const labelTx = 'Map shading: Complaints';
  chart.renderer
    .label( labelTx, 5, 5, null, null, null, true, false, 'label__tile-map' )
    .add();

  const legend = chart.renderer.g( 'legend__tile-map ' ).add();

  const g1 = chart.renderer.g( 'g1' ).translate(0,50).add(legend);
  const g2 = chart.renderer.g( 'g2' ).translate(70,50).add(legend);
  const g3 = chart.renderer.g( 'g3' ).translate(140,50).add(legend);
  const g4 = chart.renderer.g( 'g4' ).translate(210,50).add(legend);
  const g5 = chart.renderer.g( 'g5' ).translate(280,50).add(legend);

  chart.renderer
    .rect( 0, 0, 65, 15 )
    .attr( _boxStyle( colors[4] ) )
    .add( g1 );
  chart.renderer
    .text( '>' + bins[4].min, 0, 14 )
    .add( g1 );

  chart.renderer
    .rect( 0, 0, 65, 15 )
    .attr( _boxStyle( colors[3] ) )
    .add( g2 );
  chart.renderer
    .text( '>' + bins[3].min, 0, 14 )
    .add( g2 );

  chart.renderer
    .rect( 0, 0, 65, 15 )
    .attr( _boxStyle( colors[2] ) )
    .add( g3 );
  chart.renderer.text( '>' + bins[2].min, 0, 14 ).add( g3 );


  chart.renderer
    .rect( 0, 0, 65, 15 )
    .attr( _boxStyle( colors[1] ) )
    .add( g4 );
  chart.renderer.text( '>' + bins[1].min, 0, 14 ).add( g4 );

  chart.renderer
    .rect( 0, 0, 65, 15 )
    .attr( _boxStyle( colors[0] ) )
    .add( g5 );
  chart.renderer
    .text( '>' + bins[0].min, 0, 14 )
    .add( g5 );

  chart.renderer
    .rect( 10, 163, 60, 15 )
    .attr( _boxStyle( '#fff' ) )
    .add( legend );
  chart.renderer.text( bins[0].min, 32, 176 ).add( legend );


}

Highcharts.setOptions( {
  lang: {
    thousandsSep: ','
  }
} );

class TileMap {
  constructor( { el, description, data, title, colors } ) {
    const bins = getTileMapColor.getBins(data);
    colors = colors ? colors : [ '#96c4ed', '#d6e8fa', '#75787b', '#e2efd8', '#bae0a2' ];
    data = processMapData( data[0], colors );

    const options = {
      bins: bins,
      chart: {
        marginTop: 20,
        styledMode: true
      },
      colors: colors,
      title: false,
      description: description,
      credits: false,
      legend: {
        enabled: false
      },
      tooltip: {
        enabled: false
      },
      series: [ {
        type: 'map',
        clip: false,
        dataLabels: {
          enabled: true,
          formatter: function() {
            return '<div class="highcharts-data-label-state-abbr">' +
                   this.point.name +
                   '<br /><span class="highcharts-data-label-state-value">' +
                   this.point.value.toLocaleString() + '</span></div>';
          },
          useHTML: true
        },
        name: title,
        data: data
      } ]
    };

    return Highcharts.mapChart( el, options, _drawLegend );
  }
}

export default TileMap;
