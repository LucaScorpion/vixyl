import React from 'react';
import ExternalLink from './components/ExternalLink';
import tweet from './images/tweet.png';
import tdfw_new from './images/tdfw_new.png';
import { Link } from 'react-router-dom';

const AboutPage: React.FC = () => (
  <main style={{ maxWidth: 1000 }}>
    <h3>Vixyl lets you read and create pixel art vinyls.</h3>

    <p>
      This project started thanks to a <ExternalLink href='https://twitter.com/notch/status/490927655806853120'>tweet by
      Notch</ExternalLink>:
    </p>

    <img src={tweet} alt="Notch's tweet" style={{ width: 320 }} />

    <p>
      Encoded in the spiral is an 8-bit mono 4kHz audio track, containing 3 seconds of the song "Turn Down for What".
      Inspired by the idea I started making a tool that would allow you to read and create these kinds of images
      yourself. A couple of coding sessions and a whole bunch of scope creep later, Vixyl was born!
    </p>

    <p>
      Vixyl implements the idea of encoding binary data into an image in a more generic way. That means you can use it
      to encode any file into a vinyl. That does mean that the original image doesn't work with Vixyl, but I did make an
      updated version that does:
    </p>

    <img src={tdfw_new} alt='Turn Down For What updated vinyl' />

    <p>
      Try it out for yourself! Go to <Link to='/read'>Read vinyl</Link> to try reading the above image, or go
      to <Link to='/create'>Create vinyl</Link> to create your own vinyl from a song, image, or any other file.
    </p>

    <p>
      This project is completely open source and available <ExternalLink href='https://github.com/LucaScorpion/vixyl'>on
      GitHub</ExternalLink>! If you encounter any bugs, have suggestions, or otherwise want to contribute, feel free
      to check out the repo.
    </p>
  </main>
);

export default AboutPage;
