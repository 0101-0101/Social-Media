import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'react-toastify/dist/ReactToastify.css';

import App from './App';
import Register from './auth/Register';
import Activate from './auth/Activate';
import Login from './auth/Login';
import ForgetPassword from './auth/ForgetPassword';
import ResetPassword from './auth/ResetPassword';

import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Route, Redirect, Switch ,withRouter  } from 'react-router-dom';
import Home from './components/Home';
import Profile from './components/user/Profile';
import Messenger from './components/messenger/Messenger';
import Search from './components/user/Search';


import 'bootstrap/dist/css/bootstrap.min.css';
import PrivateRoute from './components/PrivateRoute'


ReactDOM.render(
  <BrowserRouter>
    <Switch>
    
    {/* Using render we can pass to the component */}
    <Route path='/register' exact render={props => <Register {...props} />} />
    <Route path='/users/activate/:token' exact render={props => <Activate {...props} />} />
    {/* <Route path='/login' exact render={props => <Login {...props} />} /> */}
    <Route exact path='/login'  component={Login} />

    <Route path='/users/password/forget' exact render={props => <ForgetPassword {...props} />} />
    <Route path='/users/password/reset/:token' exact render={props => <ResetPassword {...props} />} />

    {/* <Route path='/'  render={props => <App {...props} />} /> */}
    <Route path='/profile/:userId/'  component={Profile}></Route>
    <Route path='/messenger' component={Messenger}></Route>
    <Route path='/search' component={Search}></Route>

    <Route exact path='/'  component={Home}></Route>

    {/* <PrivateRoute exact path='/'  component={ withRouter(App) } /> */}

    </Switch>
  </BrowserRouter>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
