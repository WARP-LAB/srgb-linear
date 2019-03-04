# LUT for sRGB to linear or vice versa conversion

## About

When

* you want to receive data in linear colour space in your texture lookups (as you should ^_^)
* but you can't because your crappy SBC OpenGL ES on EGL implementation does not have `GL_SRGB` internal format
* your texture is not floating point
* and you want to avoid converting sRGB to linear colour space in shader for every fragment

then apply LUT to image data before giving it to `glTexImage2D` while still keeping internal format specified as `GL_RGB(A)`.

Or vice versa.


## Generation

Edit `generate.js` to choose which mapping function to use.

Generate output file `lut.hpp`

```sh
node generate.js > lut.hpp
```

See attached `lut.hpp`.


## Usage

Say you are using [*stb_image*](https://github.com/nothings/stb)


```c++
int stbiWidth, stbiHeight, stbiNoChannels;
unsigned char *stbiData;
stbiData = stbi_load(pathToImage.c_str(), &stbiWidth, &stbiHeight, &stbiNoChannels, 0);

if (stbiData == nullptr) {
	// throw std::runtime_error ...
}

GLint internalFormat = GL_RGB;
GLenum format = GL_RGB;

// populate mapped float array, edit raw image data, convert from sRGB to linear
std::vector<float> stbiDataF;
unsigned int stbiCount = stbiWidth * stbiHeight * stbiNoChannels;
for (unsigned int pIdx = 0; pIdx < stbiCount; pIdx += stbiNoChannels) {
    for (unsigned int cIdx = pIdx; (cIdx < pIdx + stbiNoChannels && cIdx < pIdx + 3); cIdx++) {
        stbiDataF.push_back(lut_srgb_to_linear_f[stbiData[cIdx]]);
        stbiData[cIdx] = lut_srgb_to_linear_8[stbiData[cIdx]];
    }
}

// feed to gpu (preferably float)
glTexImage2D(GL_TEXTURE_2D, 0, GL_RGB16F, stbiWidth, stbiHeight, 0, format, GL_FLOAT, stbiDataF.data());

// but you can still use unsigned bytes
// just note the precission loss in space conversation (see first 15 bytes of lut_srgb_to_linear_8)
// glTexImage2D(GL_TEXTURE_2D, 0, internalFormat, stbiWidth, stbiHeight, 0, format, GL_UNSIGNED_BYTE, stbiData);

```

For floating point textures do conversation on the fly.

Profit.
