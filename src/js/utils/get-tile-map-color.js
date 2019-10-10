const green50 = '#bae0a2';
const green20 = '#e2efd8';
const gray80 = '#75787b';
const gray5 = '#f7f8f9';
const pacific20 = '#d6e8fa';
const pacific50 = '#96c4ed';

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
 * @returns {string} A color hex string.
 */
function getColorByValue( value, bins ) {

  if ( parseInt( value, 10 ) === 0 ) {
    return '#fff';
  }

  const colors = [ pacific50, pacific20, gray80, gray5, green20, green50 ];
  let color = '#fff';
  for ( let i = 0; i < colors.length; i++ ) {
    if ( value > bins[ i ].min ) {
      color = colors[ i ];
    }
  }

  return color;

  // if ( value < -15 ) {
  //   return pacific50;
  // }
  // if ( value < -5 ) {
  //   return pacific20;
  // }
  // if ( value < 6 ) {
  //   return gray5;
  // }
  // if ( value < 16 ) {
  //   return green20;
  // }
  // return green50;
}

export default {
  getBins: getBins,
  getColorByValue: getColorByValue,
  green50: green50,
  green20: green20,
  gray80: gray80,
  gray5: gray5,
  pacific20: pacific20,
  pacific50: pacific50
};
