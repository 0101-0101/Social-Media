import React, { useState } from 'react';
import { alpha, makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import InputBase from '@material-ui/core/InputBase';
import Badge from '@material-ui/core/Badge';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MailIcon from '@material-ui/icons/Mail';
import NotificationsIcon from '@material-ui/icons/Notifications';
import MoreIcon from '@material-ui/icons/MoreVert';
import Avatar from '@material-ui/core/Avatar';
import { ToastContainer, toast } from 'react-toastify';

import  {follow}  from './api-user'
import Button from '@material-ui/core/Button';

import { Redirect , useHistory} from "react-router-dom";

import { Link } from 'react-router-dom';
import { signout } from '../helpers/auth';

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.black, 0.15),
    '&:hover': {
      backgroundColor: alpha(theme.palette.common.black, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: 'auto',
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',

  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
  },
  sectionMobile: {
    display: 'flex',
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
}));



const SearchContext = React.createContext();


export default function PrimarySearchAppBar(props) {
  let history = useHistory()

  const [Search, setSearch] = useState()
  const userId =  JSON.parse(localStorage.getItem('user'))


  const classes = useStyles();

  function user_logout(){
  //   () =>  signout(() => { <Redirect 
  //     to={{ pathname: '/login' }} />
  //  })  

    signout();
    return <Redirect to='/login' />
  }

  function searchProduct(e){
    e.preventDefault()
    // console.log(e.target.value);
    // setSearch(e.target.value)
  
    const val = e.target.value
    console.log(val);
    fetch (`http://localhost:5000/api/users/search?value=${val}`, {
      method: 'POST',
        })
        .then (response => response.json ())
        .then (response => {
            console.log(response)
            setSearch(response)
            // setProducts(response)
            // dispatch( { type:FETCH_DATA,payload: response } ) 
        })
        .catch (error => {
            console.error (error);
        });

        setTimeout(() => {setSearch()}, 5000);
  }

  const menuId = 'primary-search-account-menu';

  const renderMobileMenu = (
    <Menu>
      <MenuItem>
        <IconButton aria-label="show 4 new mails" color="inherit">
          <Badge badgeContent={4} color="secondary">
            <MailIcon />
          </Badge>
        </IconButton>
        <p>Messages</p>
      </MenuItem>
      <MenuItem>
        <IconButton aria-label="show 11 new notifications" color="inherit">
          <Badge badgeContent={11} color="secondary">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <p>Notifications</p>
      </MenuItem>
      <MenuItem >
        <IconButton
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit">
          <AccountCircle />
        </IconButton>
        {/* <p>Profile</p> */}
      </MenuItem>
    </Menu>
  );

  
  return (
    <div className={classes.grow} >
                <ToastContainer/>
      <AppBar position="static" style={{ background: 'white' }}>
        <Toolbar>
          {/* <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="open drawer"
          >
            <MenuIcon />
          </IconButton> */}
          <Typography className={classes.title} variant="h6" noWrap>
           <Link to='/'style={{ textDecoration: 'none',color:"black" }}> Social Media </Link>
          </Typography>
          <div className={classes.search} style={{ background: '#efebe9' }} >
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <InputBase
              placeholder="Search…"
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              onChange={searchProduct}
              inputProps={{ 'aria-label': 'search' }}
            />
          </div>
          
          <div className={classes.grow} />
           <Button variant="outlined" color="primary" 
           onClick= { () =>  signout(() => { history.push('/login')} ) } >
              logout
            </Button>

            {/* <Button variant="outlined" color="primary" 
           onClick= {() => user_logout() }>


              logout
            </Button> */}
          <div className={classes.sectionDesktop}>
          
            <IconButton aria-label="show 4 new mails" color="primary">
              {/* <Badge badgeContent={4} color="secondary" >       */}
                <Link to='/messenger'style={{ textDecoration: 'none' }}> <MailIcon /> </Link>
              {/* </Badge> */}
            </IconButton>
            <IconButton aria-label="show 17 new notifications" color="primary">
              {/* <Badge badgeContent={17} color="secondary" > */}
              <Link to='/'style={{ textDecoration: 'none' }}> <NotificationsIcon /> </Link>
              {/* </Badge> */}
            </IconButton>
          
            <IconButton>

              {/* { props.current_user[0] ?  
              <Link to={`/profile/${userId._id}/`}>
                <Avatar  alt="Remy Sharp" src={`http://localhost:5000/${props.current_user[0].profile_pic}`} >
                </Avatar>
              </Link>
                : null} */}

            <Link to={`/profile/${userId._id}/`}><AccountCircle /></Link>

            </IconButton>

          </div>

        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      
         <div>
         {Search?.map( (val) => {
                return(
                  <div style={{display:"inline-flex"}}>
                    
                    {/* <Avatar aria-label="recipe" className={classes.avatar}>
                      R
                    </Avatar> */}
                  
                  <Avatar alt={val.name} src={`http://localhost:5000/${val.profile_pic}`}  />
                    {/* <p onClick={}>{val.name}</p>                    */}
                    <p style={{padding:"10px" }}><Link style={{ textDecoration: 'none',color:"black" }} to={`/profile/${val._id}/`}>{val.name}</Link></p>                   
                    
                  <div style={{"margin-left":"10%"}}>
                  <Button variant="contained" size="small" onClick={ ()=> follow(val._id),()=> toast.success("You Follow a User")} color="primary">
                  Follow
                </Button>
                </div>
            
                  </div>
                )
              })}
           </div>   
    </div>
  );
}
