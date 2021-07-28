import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';

import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
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


const ResetPassword = ({match}) => {

  const classes = useStyles();

  const [formData, setFormData] = useState({
      password1: '',
      password2: '',
      token: '',
    textChange: 'Submit'
  });
    const { password1, password2, textChange, token } = formData;
    
    useEffect(() => {
        let token = match.params.token
        if(token) {
            setFormData({...formData, token,})
        }
        
    }, [])
  const handleChange = text => e => {
    setFormData({ ...formData, [text]: e.target.value });
  };
    const handleSubmit = e => {
      console.log(password1, password2)
    e.preventDefault();
    if ((password1 === password2) && password1 && password2) {
      setFormData({ ...formData, textChange: 'Submitting' });
      axios
        // .put(`${process.env.REACT_APP_API_URL}/resetpassword`, {
        .put(`http://localhost:5000/api/resetpassword`, {

            newPassword: password1,
            resetPasswordLink: token
        })
        .then(res => {
          console.log(res.data.message)
            setFormData({
              ...formData,
               password1: '',
              password2: ''
            });
            toast.success(res.data.message);
          
        })
        .catch(err => {
          console.log("err",err.error);
          toast.error('Something is wrong try again');
        });
    } else {
      toast.error('Passwords don\'t matches');
    }
  };



  return (
    <Container component="main" maxWidth="xs">
      {/* <CssBaseline /> */}
      <ToastContainer />

      <div className={classes.paper}>

        <Typography component="h1" variant="h5">
        Reset Your Password
        </Typography>
        <form className={classes.form} onSubmit={handleSubmit}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Password"
            type="password"
            id="password1"
            onChange={handleChange('password1')}
            value={password1}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Confirm Password"
            type="password"
            id="password2"
            onChange={handleChange('password2')}
            value={password2}
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

        </form>
      </div>
      <Box mt={8}>
        {/* <Copyright /> */}
      </Box>
    </Container>
  );
};

export default ResetPassword;
