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
          <NavLink exact to='/'>About</NavLink>
          <NavLink exact to='/read'>Read vinyl</NavLink>
          <NavLink exact to='/create'>Create vinyl</NavLink>
        </nav>
      </header>
      <GithubCorner />
      <div className='content'>
        <Switch>
          <Route exact path='/' component={AboutPage} />
          <Route exact path='/read' component={ReadVinylPage} />
          <Route exact path='/create' component={CreateVinylPage} />
          <Redirect to='/' />
        </Switch>
      </div>
    </>
  );
};

export default App;
