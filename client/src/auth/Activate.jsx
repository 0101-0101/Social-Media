import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import { authenticate, isAuth } from '../helpers/auth';
import { Link, Redirect } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

import Button from '@material-ui/core/Button';



const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));


const Activate = ({ match }) => {

  const classes = useStyles();

  const [formData, setFormData] = useState({
    name: '',
    token: '',
    show: true
  });

  // useEffect(() => {
  //   let token = match.params.token;
  //   let { name } = jwt.decode(token);

  //   if (token) {
  //     setFormData({ ...formData, name, token });
  //   }

  //   console.log(token, name);
  // }, [match.params]);

  const { name, token, show } = formData;

  const handleSubmit = e => {
    e.preventDefault();

    axios
      // .post(`${process.env.REACT_APP_API_URL}/activation`, {
      .post(`http://localhost:5000/api/activation`, {

        token
      })
      .then(res => {
        setFormData({
          ...formData,
          show: false
        });
        
        toast.success(res.data.message);
        <Redirect to='/login' />
      })
      .catch(err => {
        
        toast.error(err.response.data.errors);
      });
  };

  return (
    <Container component="main" maxWidth="xs">
       {isAuth() ? <Redirect to='/' /> : null}
       <ToastContainer />
       <div className={classes.paper}>

        {/* <Typography component="h1" variant="h5">
        Welcome {name}
        </Typography> */}

        <form className={classes.form} onSubmit={handleSubmit}>

        {/* <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Activate your Account
          </Button> */}
          
          <div className="text-center">
            <h1 >Hey {name}, Ready to activate your account?</h1>

            <Button
            type="submit"
            margin="normal"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Activate Account
          </Button>

        </div>
        </form>
        </div>
      

    </Container>
  )


};

export default Activate;
