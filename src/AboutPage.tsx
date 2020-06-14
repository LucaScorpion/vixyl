import React from 'react';
import ExternalLink from './components/ExternalLink';
import vinyl from './images/vinyl.png';

const AboutPage: React.FC = () => {
  return (
    <main>
      <h3>Vixyl lets you read and create pixel art vinyls.</h3>

      <p>
        This project started thanks to a <ExternalLink href='https://twitter.com/notch/status/490927655806853120'>tweet
        by
        Notch</ExternalLink>, which contained just this image:
      </p>

      <img src={vinyl} alt='Turn Down For What vinyl' />

      <p>
        Encoded in the spiral is an 8-bit mono 4kHz audio track, containing 3 seconds of the song "Turn Down for
        What". Vixyl allows you to read these kinds of images, and even create your own. Simply click one of the links
        in the header to get started!
      </p>

      <p>
        This project is completely open source and available <ExternalLink href='https://github.com/LucaScorpion/vixyl'>on
        GitHub</ExternalLink>! If you encounter any bugs, have suggestions, or otherwise want to contribute, feel free
        to check out the repo.
      </p>
    </main>
  );
};

export default AboutPage;
