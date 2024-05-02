import React from 'react';
import { Route, Switch } from 'react-router-dom/cjs/react-router-dom.min';
import './App.css';
import Toolbar from './Toolbar/Toolbar';
import Login from './Login/Login';
import Home from './Home/Home';
import SinUp from './SignUp/SignUp';
import { Container } from 'react-bootstrap';
import { CookiesProvider} from 'react-cookie';
import User from './User/User';
import Product from './Product/Product';
import NotFound from './NotFound/NotFound';

function App() {

  console.log("App");

  return (
    <>
      <CookiesProvider>
        <Container className='container'>
          <Toolbar/>
        </Container>

        <Switch>
          <Route path='/' exact ><Home/></Route>
          <Route path='/Login'><Login/></Route>
          <Route path='/SignUp'><SinUp/></Route>
          <Route path='/User'><User/></Route>
          <Route path='/Product'><Product/></Route>
          <Route path='/*'><NotFound/></Route>
        </Switch>
      </CookiesProvider>
    </>
  );
}

export default App;
