import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';

import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import CardMedia from '@material-ui/core/CardMedia';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';

import Axios from 'axios';
import { read } from '../api-user'
import { listByUser } from '../post/api-post'

import { Link, useParams } from 'react-router-dom';


const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    '& > *': {
      margin: theme.spacing(1),
    },
  },
  // root: {
  //   maxWidth: 220,
  //   margin:5,
  //   marginTop:30,
  //   marginLeft:40
    
  // },
  paper: 
  {
    margin:"10px",
    display: "flex",
    padding:"20px",
    // "justify-content": "center" 
    // textAlign: 'center',
    // padding: theme.spacing(6),
  },
  media: {
    height: 250,
  },
  large: {
    width: theme.spacing(18),
    height: theme.spacing(18),
  }
}));

function Profile(param) {
  const { userId } = useParams()
  
  console.log("Val",userId);

  const [data, setdata] = useState({
          following:0,
          followers:0,
          posts: []
        })

  // const check
  // if (user)
  const profileID= userId
  useEffect(() => {
    read({profileID})
    .then((data)=> {
      console.log(data);
        const followers = data.followers.length
        const following = data.following.length
        // console.log(followers,following);
      // setdata({followers,following})

      console.log("listByUser(profileID)",listByUser(profileID));
      listByUser(profileID)
      .then( (posts) => {
        console.log(posts);
        setdata({followers,following,posts})
      })
    })
    // console.log(read({profileID}).followers);
    // setdata(data)
      // .then((data) => {
      // })
  }, [])



    const classes = useStyles();
    return (
     
  <div className={classes.root}>
      <Grid container spacing={3}>
      <Grid item xs={12} >
          <Paper className={classes.paper}>
          <Avatar className={classes.large} alt="Remy Sharp" src="/static/images/avatar/1.jpg" />

      <div style={{margin:"40px",display: "flex"}}>
          <h2 style={{ "margin-right": "30px"}}>Post:{data.posts.length}</h2>
          <h2  style={{ "margin-right": "30px"}}>Followers:{data.followers}</h2>
          <h2 >Following:{data.following}</h2>
      </div>
          
   
          </Paper>
          
          {/* <h2>Posts</h2> */}
          <Grid container spacing={2}>

          {data.posts.map( val => {
          console.log( val );

          return( 
          <Grid item xs={3} >
          <Card className={classes.root}>
          <CardActionArea>
            <CardMedia
            className={classes.media}
              component="img"
              alt="User Post"
              // height="140"
              image={`http://localhost:5000/${val.photo}`}
              title="Contemplative Reptile"
            />
          </CardActionArea>
        </Card>
        </Grid>
          )       
        })}
        </Grid>
        </Grid>
      </Grid>
      
  </div>

    )
}

export default Profile
