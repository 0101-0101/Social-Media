// import Cookies from 'js-cookie'
import { Redirect, Route } from 'react-router-dom';
import { getCookie } from '../helpers/auth';

export default function PrivateRoute({ component: Component, ...rest }) {
    // console.log( Cookies.get('token'))
  return (
    <Route {...rest} render={(props) =>
      getCookie('token') ? ( <Component {...props} />) : (<Redirect to="/login" />)
      }
    ></Route>
  );
}


   