import React from 'react';
import ReadVinylPage from './ReadVinylPage';
import GithubCorner from './components/GithubCorner';
import { Link, Redirect, Route, Switch } from 'react-router-dom';
import AboutPage from './AboutPage';

const App: React.FC = () => {
  return (
    <>
      <header>
        <Link to='/'>
          <h1>Vixyl</h1>
        </Link>
        <nav>
          <Link to='/'>About</Link>
          <Link to='/read'>Read vinyl</Link>
        </nav>
      </header>
      <GithubCorner />
      <div className='content'>
        <Switch>
          <Route exact path='/' component={AboutPage} />
          <Route exact path='/read' component={ReadVinylPage} />
          <Redirect to='/' />
        </Switch>
      </div>
    </>
  );
};

export default App;
