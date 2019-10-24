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
      'stroke': getTileMapColor.gray80,
      'fill': color
    };
  }

  // args: (str, x, y, shape, anchorX, anchorY, useHTML, baseline, className)
  const labelTx = 'Year-over-year change (rounded to the nearest whole number)';
  chart.renderer
    .label( labelTx, 5, 5, null, null, null, true, false, 'label__tile-map' )
    .add();

  const legend = chart.renderer.g( 'legend__tile-map ' ).add();

  chart.renderer
    .rect( 10, 48, 15, 15 )
    .attr( _boxStyle( colors[4] ) )
    .add( legend );
  chart.renderer
    .rect( 10, 71, 15, 15 )
    .attr( _boxStyle( colors[3] ) )
    .add( legend );
  chart.renderer
    .rect( 10, 94, 15, 15 )
    .attr( _boxStyle( colors[2] ) )
    .add( legend );
  chart.renderer
    .rect( 10, 117, 15, 15 )
    .attr( _boxStyle( colors[1] ) )
    .add( legend );
  chart.renderer
    .rect( 10, 140, 15, 15 )
    .attr( _boxStyle( colors[0] ) )
    .add( legend );

  chart.renderer
    .rect( 10, 163, 15, 15 )
    .attr( _boxStyle( '#fff' ) )
    .add( legend );

  // 6 bins
  // chart.renderer.text( '>' + bins[5].min, 32, 61 ).add( legend );
  // chart.renderer.text( '>' + bins[4].min, 32, 84 ).add( legend );
  // chart.renderer.text( '>' + bins[3].min, 32, 107 ).add( legend );
  // chart.renderer.text( '>' + bins[2].min, 32, 130 ).add( legend );
  // chart.renderer.text( '>' + bins[1].min, 32, 153 ).add( legend );
  // chart.renderer.text( '>' + bins[0].min, 32, 176 ).add( legend );
  // chart.renderer.text( bins[0].min, 32, 199 ).add( legend );

  // 5 bins
  chart.renderer.text( '>' + bins[4].min, 32, 61 ).add( legend );
  chart.renderer.text( '>' + bins[3].min, 32, 84 ).add( legend );
  chart.renderer.text( '>' + bins[2].min, 32, 107 ).add( legend );
  chart.renderer.text( '>' + bins[1].min, 32, 130 ).add( legend );
  chart.renderer.text( '>' + bins[0].min, 32, 153 ).add( legend );
  //chart.renderer.text( '>' + bins[0].min, 32, 176 ).add( legend );
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
    const { pacific50, pacific20, gray80, green20, green50 } = getTileMapColor;
    colors = colors ? colors : [ pacific50, pacific20, gray80, green20, green50 ];
    data = processMapData( data[0], colors );

    const options = {
      bins: bins,
      chart: {
        marginTop: 150,
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
