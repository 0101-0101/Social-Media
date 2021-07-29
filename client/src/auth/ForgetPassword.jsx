import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';

import { Link } from 'react-router-dom';


import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';


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


const ForgetPassword = () => {

  const classes = useStyles();

  const [formData, setFormData] = useState({
    email: '',
    textChange: 'Submit'
  });
  const { email, textChange } = formData;
  const handleChange = text => e => {
    setFormData({ ...formData, [text]: e.target.value });
  };
  const handleSubmit = e => {
    console.log(formData)
    e.preventDefault();

    if (email) {
      setFormData({ ...formData, textChange: 'Submitting' });

      // .put(`${process.env.REACT_APP_API_URL}/forgotpassword`, {
      axios.put(`http://localhost:5000/api/forgotpassword`, { email })
        .then(() => {
          toast.success(`Please check your email`);
            setFormData({
              ...formData,
              epreventDefaultmail: '',
            });
        })
        .catch(err => {
        console.log(err.response)
          toast.error(err.response.data.error);
        });

    } else {
      toast.error('Please fill all fields');
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <ToastContainer />
      <CssBaseline />
      <div className={classes.paper}>

        <Typography component="h1" variant="h5">
       Forget Password ??
        </Typography>
        <form className={classes.form} onSubmit={handleSubmit}>
        <TextField
            variant="outlined"
            type='email'
            margin="normal"
            required
            fullWidth
            id="email"
            label="Enter Your Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            onChange={handleChange('email')}
            value={email}
          />
          

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Submit
          </Button>

          <Grid container>
            <Grid item xs>
              {/* <Link to='/users/password/forget' variant="body2">
                Forgot password?
              </Link> */}
            </Grid>
            <Grid item>
              <Link to='/register' variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>

        </form>
      </div>
      <Box mt={8}>
        {/* <Copyright /> */}
      </Box>
    </Container>
  );

};

export default ForgetPassword;
