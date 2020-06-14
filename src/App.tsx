import React from 'react';
import ReadVinylPage from './ReadVinylPage';
import GithubCorner from './components/GithubCorner';
import { Link, NavLink, Redirect, Route, Switch } from 'react-router-dom';
import AboutPage from './AboutPage';
import CreateVinylPage from './CreateVinylPage';

const App: React.FC = () => {
  return (
    <>
      <header>
        <Link to='/'>
          <h1>Vixyl</h1>
        </Link>
        <nav>
          <NavLink to='/about'>About</NavLink>
          <NavLink to='/read'>Read vinyl</NavLink>
          <NavLink to='/create'>Create vinyl</NavLink>
        </nav>
      </header>
      <GithubCorner />
      <div className='content'>
        <Switch>
          <Route exact path='/about' component={AboutPage} />
          <Route exact path='/read' component={ReadVinylPage} />
          <Route exact path='/create' component={CreateVinylPage} />
          <Redirect to='/about' />
        </Switch>
      </div>
    </>
  );
};

export default App;
