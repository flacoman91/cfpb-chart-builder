/**
 * helper function to get max value
 * @param data array of data
 */
function getMax( data ) {
  return Object.values( data ).reduce( ( a, b ) => Math.max( a, b ), 0 );
}

/**
 * helper function to get the bins for legend and colors, etc.
 * @param data
 * @returns {[]|Array}
 */
function getBins( data ) {
  const binCount = 6;
  const max = getMax( data );
  const min = 0;

  // Early exit
  if ( max === 0 ) return [];

  const bins = [];
  const step = ( max - min ) / binCount;

  for ( let i = 0, curr = min; i < binCount; i++, curr += step ) {
    bins.push( { color: '#000000', index: i, min: Math.round( curr ) } );
  }

  return bins;
}

/**
 * Returns color given a data value.
 * @param   {number} value A numerical data value.
 * @param   {array} bins different buckets for values.
 * @param   {array} colors contains the input colors for the tile map
 * @returns {string} A color hex string.
 */
function getColorByValue( value, bins, colors ) {
  if ( parseInt( value, 10 ) === 0 ) {
    return '#fff';
  }

  let color = '#fff';
  for ( let i = 0; i < colors.length; i++ ) {
    if ( value > bins[ i ].min ) {
      color = colors[ i ];
    }
  }

  return color;
}

export default {
  getBins,
  getColorByValue
};
