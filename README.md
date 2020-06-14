# Vixyl

[![Deploy to gh-pages](https://github.com/LucaScorpion/vixyl/workflows/Deploy%20to%20gh-pages/badge.svg)](https://github.com/LucaScorpion/vixyl/actions?query=workflow%3A%22Deploy+to+gh-pages%22)

## About

This project started thanks to a [tweet by Notch](https://twitter.com/notch/status/490927655806853120), which contained just this image:

![Turn Down for What vinyl](vinyl.png)

Encoded in the spiral is an 8-bit mono 4kHz audio track, containing 3 seconds of the song "Turn Down for What".

## Usage

1. Go to https://lucascorpion.github.io/vixyl
2. Load the vinyl image you want to read
3. Detect the starting point of the track*
4. Click the "Read" button, and enjoy some lo-fi music :)

\* You can also enter the coordinates manually, but in most cases it will be able to detect the correct starting point automatically. 

## Development

1. Clone the repo
2. Run `npm install`
3. Run `npm start`, this will open a browser to http://localhost:3000/vixyl

Any changes in the code should automatically reload the tab.

## Sources

Helpful WAVE file format information: http://tiny.systems/software/soundProgrammer/WavFormatDocs.pdf
