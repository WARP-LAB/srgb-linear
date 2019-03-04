
function normalize(t, min, max) {
  const range = max - min;
  return (t - min) / range;
}

function unsignedbitefy(t) {
  return Math.round(t * 255);
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
    // change srgbToLinearSimple to whatever as needed
  const methodChosen = srgbToLinearSimple;
  const gamma = 2.2;
  
  console.log('// Using method srgbToLinearSimple with gamma 2.2');
  console.log('');

  const arr8 = [];
  const arrFloat = [];

  for (let pVal = 0; pVal < 256; pVal++) {
    const resultFloat = methodChosen(normalize(pVal, 0, 255), gamma);
    arrFloat.push(resultFloat);
    const result8 = unsignedbitefy(resultFloat)
    arr8.push(result8);
  }

  // float array
  process.stdout.write('float lut_srgb_to_linear_f[256] = {');
  console.log('');
  for (let pVal = 0; pVal < 256; pVal++) {
    let str = Number.parseFloat(arrFloat[pVal]).toFixed(10).toString();
    str += 'f';
    if (pVal < 256 - 1) {
      str += ',';
    }
    str = str.padEnd(15, ' ')
    process.stdout.write(str);
    if ((pVal + 1) % 16 === 0) {
      console.log('');
    }
  }
  process.stdout.write('};');
  console.log('');
  console.log('');

  // 8bit array
  process.stdout.write('unsigned char lut_srgb_to_linear_8[256] = {');
  console.log('');
  for (let pVal = 0; pVal < 256; pVal++) {
    let str = arr8[pVal].toString();
    if (pVal < 256 - 1) {
      str += ',';
    }
    str = str.padEnd(5, ' ')
    process.stdout.write(str);
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
