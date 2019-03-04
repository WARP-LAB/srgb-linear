
function normalize(t, min, max) {
  const range = max - min;
  return (t - min) / range;
}

function unsignedbitefy(t) {
  return t * 255;
}

// converts a [0.0, 1.0] sRGB value into a [0.0, 1.0] linear value that can be used more efectively in shader
function srgbToLinearSimple(srgb, gamma) {
  return Math.pow(srgb, gamma);
}

// converts a [0.0, 1.0] sRGB value into a [0.0, 1.0] linear value
function srgbToLinearStandard(srgb) {
  if (srgb <= 0.04045) {
    return srgb / 12.92;
  } else {
    return pow((srgb + 0.055) / 1.055, 2.4);
  }
}

// converts a [0.0, 1.0] linear value into a [0.0, 1.0] sRGB value
function linearToSrgbStandard(linear) {
  if (linear <= 0.0031308) {
    return linear * 12.92;
  } else {
    return 1.055 * pow(linear, 1.0 / 2.4) - 0.055;
  }
}

function generate() {
  console.log('// Using method srgbToLinearSimple with gamma 2.2');
  // rename array as needed
  process.stdout.write('unsigned char lut_srgb_to_linear[256] = {');
  console.log('');
  for (let pVal = 0; pVal < 256; pVal++) {
    let result = unsignedbitefy(
      // change srgbToLinearSimple to whatever as needed
      srgbToLinearSimple(normalize(pVal, 0, 255), 2.2)
    );
    result = Math.round(result);
    result = result.toString();
    if (pVal < 256 - 1) {
      result += ',';
    }
    result = result.padEnd(5, ' ')
    process.stdout.write(result);
    if ((pVal + 1) % 16 === 0) {
      console.log('');
    }
  }
  process.stdout.write('};');
  console.log('');
  console.log('// end');
}

console.log('// Generating sRGB to Linear LUT table');
generate();
