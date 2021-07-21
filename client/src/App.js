import logo from './logo.svg';
import './App.css';
import { BrowserRouter,Switch , Route } from 'react-router-dom'
import Home from './components/Home';
import PrimarySearchAppBar from './components/Navbar';
import Profile from './components/user/Profile';
import Messenger from './components/messenger/Messenger';

function App() {
  return (
    <BrowserRouter>
    <PrimarySearchAppBar/>
    <Switch>
        {/* <Route></Route> */}
        <Route path='/profile/:userId/'  component={Profile}></Route>
        <Route path='/messenger' component={Messenger}></Route>
        <Route path='/' exact component={Home}></Route>
        
    </Switch>
    </BrowserRouter>
  );
}

export default App;
