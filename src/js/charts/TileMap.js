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
  const marginTop = chart.margin[0] || 0;
  const localize = chart.options.localize;

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

  const legend = chart.renderer.g( 'legend__tile-map' )
    .translate(10, marginTop)
    .add();
  const g1 = chart.renderer.g( 'g1' ).translate(0,0).add(legend);
  const g2 = chart.renderer.g( 'g2' ).translate(70,0).add(legend);
  const g3 = chart.renderer.g( 'g3' ).translate(140,0).add(legend);
  const g4 = chart.renderer.g( 'g4' ).translate(210,0).add(legend);
  const g5 = chart.renderer.g( 'g5' ).translate(280,0).add(legend);
  const g6 = chart.renderer.g( 'g6' ).translate(350,0).add(legend);
  const g7 = chart.renderer.g( 'g7' ).translate(420,0).add(legend);

  if ( localize ) {
    bins[5].min = bins[5].min.toLocaleString();
    bins[4].min = bins[4].min.toLocaleString();
    bins[3].min = bins[3].min.toLocaleString();
    bins[2].min = bins[2].min.toLocaleString();
    bins[1].min = bins[1].min.toLocaleString();
    bins[0].min = bins[0].min.toLocaleString();
  }

  chart.renderer
    .rect( 0, 0, 65, 15 )
    .attr( _boxStyle( colors[5] ) )
    .add( g7 );
  chart.renderer
    .text( '>' + bins[5].min, 0, 14 )
    .add( g7 );

  chart.renderer
    .rect( 0, 0, 65, 15 )
    .attr( _boxStyle( colors[4] ) )
    .add( g6 );
  chart.renderer
    .text( '>' + bins[4].min, 0, 14 )
    .add( g6 );

  chart.renderer
    .rect( 0, 0, 65, 15 )
    .attr( _boxStyle( colors[3] ) )
    .add( g5 );
  chart.renderer
    .text( '>' + bins[3].min, 0, 14 )
    .add( g5 );

  chart.renderer
    .rect( 0, 0, 65, 15 )
    .attr( _boxStyle( colors[2] ) )
    .add( g4 );
  chart.renderer
    .text( '>' + bins[2].min, 0, 14 )
    .add( g4 );

  chart.renderer
    .rect( 0, 0, 65, 15 )
    .attr( _boxStyle( colors[1] ) )
    .add( g3 );
  chart.renderer
    .text( '>' + bins[1].min, 0, 14 )
    .add( g3 );

  chart.renderer
    .rect( 0, 0, 65, 15 )
    .attr( _boxStyle( colors[0] ) )
    .add( g2 );
  chart.renderer
    .text( '>' + bins[0].min, 0, 14 )
    .add( g2 );

  chart.renderer
    .rect( 0, 0, 65, 15 )
    .attr( _boxStyle( '#fff' ) )
    .add( g1 );
  chart.renderer
    .text( 'N/A', 0, 14 )
    .add( g1 );

}

Highcharts.setOptions( {
  lang: {
    thousandsSep: ','
  }
} );

class TileMap {
  constructor( { el, description, data, title, colors, localize } ) {
    const bins = getTileMapColor.getBins(data);
    colors = colors ? colors : [ '#96c4ed', '#d6e8fa', '#75787b', '#e2efd8', '#bae0a2' ];
    data = processMapData( data[0], colors );

    const options = {
      bins,
      chart: {
        marginTop: 40,
        styledMode: true
      },
      colors: colors,
      title: false,
      description: description,
      credits: false,
      legend: {
        enabled: false
      },
      localize,
      tooltip: {
        className: 'tooltip',
        enabled: true,
        headerFormat: '',
        pointFormatter: function() {
          const product = this.product ? '<div class="row u-clearfix">' +
            '<p class="u-float-left">Product with highest complaint volume</p>' +
            '<p class="u-right">' + this.product + '</p>' +
            '</div>' : '';

          const issue = this.issue ? '<div class="row u-clearfix">' +
            '<p class="u-float-left">Issue with highest complaint volume</p>' +
            '<p class="u-right">' + this.issue + '</p>' +
            '</div>' : '';

          const value = localize ? this.value.toLocaleString() : this.value;
          return '<div class="title">' + this.fullName + '</div>' +
            '<div class="row u-clearfix">' +
              '<p class="u-float-left">Complaints</p>' +
              '<p class="u-right">' + value + '</p>' +
            '</div>' + product + issue;
        },
        useHTML: true
      },
      series: [ {
        type: 'map',
        clip: false,
        dataLabels: {
          enabled: true,
          formatter: function() {
            const value = localize ? this.point.value.toLocaleString() : this.point.value;
            return '<div class="highcharts-data-label-state">' +
              '<span class="abbr">' + this.point.name + '</span>' +
                   '<br />' +
              '<span class="value">' + value + '</span>' +
              '</div>';
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
