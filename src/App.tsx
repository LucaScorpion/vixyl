import React from 'react';
import ReadVinylPage from './ReadVinylPage';
import GithubCorner from './components/GithubCorner';

const App: React.FC = () => {
  return (
    <>
      <header>
        <h1>Vixyl</h1>
      </header>
      <GithubCorner />
      <main>
        <ReadVinylPage />
      </main>
    </>
  );
};

export default App;
