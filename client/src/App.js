import './App.css';
import { BrowserRouter,Switch , Route,withRouter } from 'react-router-dom'
import Home from './components/Home';
import PrimarySearchAppBar from './components/Navbar';
import Profile from './components/user/Profile';
import Messenger from './components/messenger/Messenger';
import Search from './components/user/Search';

function App() {
  return (
    <BrowserRouter>
    <PrimarySearchAppBar/>
    <Switch>
        {/* <Route></Route> */}
        <Route path='/profile/:userId/'  component={Profile}></Route>
        <Route path='/messenger' component={Messenger}></Route>
        <Route path='/search' component={Search}></Route>
        <Route path='/' exact component={withRouter(Home)}></Route>
        
    </Switch>
    </BrowserRouter>
  );
}

export default App;
