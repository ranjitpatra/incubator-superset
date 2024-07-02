/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
import tinycolor from 'tinycolor2';

const rgbRegex = /^rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/;
export function getContrastingColor(color: string, thresholds = 186) {
  let r = 0;
  let g = 0;
  let b = 0;
  if (color.length > 7) {
    // rgb
    const matchColor = rgbRegex.exec(color);
    if (!matchColor) {
      throw new Error(`Invalid color: ${color}`);
    }
    r = parseInt(matchColor[1], 10);
    g = parseInt(matchColor[2], 10);
    b = parseInt(matchColor[3], 10);
  } else {
    // hex
    let hex = color;
    if (hex.startsWith('#')) {
      hex = hex.substring(1);
    }
    // #FFF
    if (hex.length === 3) {
      hex = [hex[0], hex[0], hex[1], hex[1], hex[2], hex[2]].join('');
    }
    if (hex.length !== 6) {
      throw new Error(`Invalid color: ${color}`);
    }
    r = parseInt(hex.slice(0, 2), 16);
    g = parseInt(hex.slice(2, 4), 16);
    b = parseInt(hex.slice(4, 6), 16);
  }

  return r * 0.299 + g * 0.587 + b * 0.114 > thresholds ? '#000' : '#FFF';
}

export function getAnalogousColors(colors: string[], results: number) {
  const generatedColors: string[] = [];
  const ext = 3;

  const analogousColors = colors.map(color => {
    // returns an array of tinycolor instances
    const result = tinycolor(color).analogous(results + ext);
    // remove the first three colors to avoid the same or very close colors
    return result.slice(ext);
  });

  // [[A, AA, AAA], [B, BB, BBB]] => [A, B, AA, BB, AAA, BBB]
  while (analogousColors[analogousColors.length - 1]?.length) {
    analogousColors.forEach(colors => {
      const color = colors.shift() as tinycolor.Instance;
      generatedColors.push(color.toHexString());
    });
  }

  return generatedColors;
}

export function addAlpha(color: string, opacity: number): string {
  // opacity value should be between 0 and 1.
  if (opacity > 1 || opacity < 0) {
    throw new Error(`The opacity should between 0 and 1, but got: ${opacity}`);
  }
  // the alpha value is between 00 - FF
  const alpha = `0${Math.round(opacity * 255)
    .toString(16)
    .toUpperCase()}`.slice(-2);

  return `${color}${alpha}`;
}

export function hexToRgb(h: string) {
  let r = '0';
  let g = '0';
  let b = '0';

  // 3 digits
  if (h.length === 4) {
    r = `0x${h[1]}${h[1]}`;
    g = `0x${h[2]}${h[2]}`;
    b = `0x${h[3]}${h[3]}`;

    // 6 digits
  } else if (h.length === 7) {
    r = `0x${h[1]}${h[2]}`;
    g = `0x${h[3]}${h[4]}`;
    b = `0x${h[5]}${h[6]}`;
  }

  return `rgb(${+r}, ${+g}, ${+b})`;
}

export function rgbToHex(red: number, green: number, blue: number) {
  let r = red.toString(16);
  let g = green.toString(16);
  let b = blue.toString(16);

  if (r.length === 1) r = `0${r}`;
  if (g.length === 1) g = `0${g}`;
  if (b.length === 1) b = `0${b}`;

  return `#${r}${g}${b}`;
}
