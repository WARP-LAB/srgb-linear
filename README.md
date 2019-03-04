# LUT for sRGB to linear or vice versa conversion

## About

When

* you want to receive data in linear colour space in your texture lookups (as you should ^_^)
* but you can't because your crappy SBC GLES on EGL implementation does not have `GL_SRGB` internal format
* and you want to avoid converting sRGB to linear colour space in shader for every fragment

then apply LUT to image data before giving it to `glTexImage2D` while still keeping internal format specified as `GL_SRGB(A)`.

Or vice versa.


## Generation

Edit `generate.js` to choose which mapping function to use.

Generate output file `lut.hpp`

```sh
node generate.js > lut.hpp
```

It will contain something like this

```c++
unsigned char lut_srgb_to_linear[256] = {
// 256 entries of mapped values
};
```

## Usage

Say you are using [*stb_image*](https://github.com/nothings/stb)


```c++
int stbiWidth, stbiHeight, stbiNoChannels;
unsigned char *stbiData;
stbiData = stbi_load(pathToImage.c_str(), &stbiWidth, &stbiHeight, &stbiNoChannels, 0);

if (stbiData == nullptr) {
	// throw std::runtime_error ...
}

GLint internalFormat;
GLenum format;

// set format
switch (stbiNoChannels) {
    case 1:
        format = USER_GL_RED;
        break;
    case 3:
        format = GL_RGB;
        break;
    case 4:
        format = GL_RGBA;
        break;
    default:
        format = GL_RGB;
        break;
}

// preset internal format
internalFormat = format;

// edit raw image data, convert from sRGB to linear
unsigned int stbiCount = stbiWidth * stbiHeight * stbiNoChannels;
for (unsigned int pIdx = 0; pIdx < stbiCount; pIdx += stbiNoChannels) {
    for (unsigned int cIdx = pIdx; (cIdx < pIdx + stbiNoChannels && cIdx < pIdx + 3); cIdx++) {
        stbiData[cIdx] = lut_srgb_to_linear[stbiData[cIdx]];
    }
}

// feed in
glTexImage2D(GL_TEXTURE_2D, 0, internalFormat, stbiWidth, stbiHeight, 0, format, GL_UNSIGNED_BYTE, stbiData);
```


Profit.