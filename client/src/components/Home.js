import { useHistory } from "react-router-dom";
import  { useForm} from 'react-hook-form'
import Axios from 'axios'
import { useState, useEffect } from "react";
// import Alert from "react-bootstrap/Alert";

import Alert from '@material-ui/lab/Alert';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';


import clsx from 'clsx';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { red } from '@material-ui/core/colors';
import ShareIcon from '@material-ui/icons/Share';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MoreVertIcon from '@material-ui/icons/MoreVert';

import PrimarySearchAppBar from "./Navbar";
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

// import Divider from 'material-ui/Divider'

import Comments from "./post/Comments";


import { ToastContainer, toast } from 'react-toastify';

import { makeStyles } from '@material-ui/core/styles';

import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import AddCommentIcon from '@material-ui/icons/AddComment';
import { Link } from 'react-router-dom'

import {like} from './post/api-post'

import  {follow}  from './api-user'

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(2),
      width: '50ch',
    },
    // maxWidth: 345,
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  avatar: {
    backgroundColor: red[500],
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  large: {
    width: theme.spacing(7),
    height: theme.spacing(7),
  },
}));

function Home() {
  const adddata = (values) =>{
    console.log("Added Values",values);
    console.log("photo",`http://localhost:5000/${values.photo}`);
    const newTasks = [{text:values.text,photo:values.photo},...data ]
    setdata(newTasks);
  }

  useEffect(() => {
    fetch('http://localhost:5000/api/posts/upload')
      .then(response => response.json())
      .then( product => {
          // console.log(product.data)
          setdata(product.data)
      },
      (error) => {
        if (error) {
          console.log(error);
        }
      })
  }, [])

  useEffect( () =>{
    fetch('http://localhost:5000/api/users')
    .then( response => response.json() )
    .then( user => {
      // console.log(user)
      setuser(user)

    },
    (error) => {
      if (error){
        console.log(error);
      }
    }
    )
  },[])




  const classes = useStyles();
  const { register ,handleSubmit , formState: { errors }} = useForm();
  const [data, setdata] = useState([])
  const [user_list, setuser] = useState([])

  const onSubmit = (data) => { 
    console.log(data);
    console.log(data.file[0]);
    // console.log(typeof(data.title));

    // FormData use "multipart/form-data" &  multer require "multipart/form-data"
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('photo',data.file[0])
    console.log("formdata",formData);
    const posted_by = "60f3b40691ef74285e7f350f"
    const res  =  Axios.post(`http://localhost:5000/api/posts/upload/${posted_by}`, formData)
      .then( val=>{ 
         console.log(val)
         console.log(val.data.photo_path); 
         adddata({'title':data.title,'photo': val.data.photo_path} )

        })

      .catch(error => {
        console.log("data",error.response.data);
      })

    }
    return (
        <div >
        {/* <div style={{width:"600px",margin: "0 auto"}}> */}


        <Grid container spacing={3}>
        <Grid item xs>
          <Paper className={classes.paper}>xs
          </Paper>
          
        </Grid>
        <Grid item xs={6}>


          <Paper className={classes.paper}>
                  <form  className={classes.root} onSubmit={handleSubmit(onSubmit)} >   
        {/* <label> Title</label><br/> */}

        <TextField {...register("title", { required: true })} name="title" label="User Post" rows={4} variant="outlined" />
        {/* <input  {...register("title", { required: true })} name="title" /><br/> */}
        {errors.title && errors.title.type === "required" && (
                  <p className="errorMsg">Title is required.</p>
                    )}
        <input type="file" {...register("file")} name="photo" />

        {errors.file && errors.file.type === "required" && (
                <p className="errorMsg">File is required.</p>
                  )}
        <br/>
        <Button variant="contained" color="secondary" type="submit">
        Submit
      </Button>
      </form>

      { data.map( (pro) =>{
        
      // { data.reverse().map( (pro) =>{

       return ( 
      <Card key={pro._id} className={classes.root}>
      <CardHeader
        avatar={
          <Avatar aria-label="recipe" className={classes.avatar}>
            R
          </Avatar>
        }
        action={
          <IconButton aria-label="settings">
            <MoreVertIcon />
          </IconButton>
        }
        title="Shrimp and Chorizo Paella"
        subheader="September 14, 2016"
      />
      {/* <CardContent> */}
        <Typography variant="body2" color="textSecondary" component="p">
        This impressive paella is a perfect party dish and a fun meal to cook together with your
        guests. Add 1 cup of frozen peas along with the mussels, if you like.
      </Typography>
      {/* </CardContent> */}
      <CardMedia
        className={classes.media}
        image={`http://localhost:5000/${pro.photo}`}
        // image="https://images.unsplash.com/photo-1433086966358-54859d0ed716?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8bmF0dXJlfGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=50"
        title="Paella dish"/> 
      <CardActions disableSpacing>
        <IconButton onClick={()=>like(pro._id) } aria-label="Like">
          <ThumbUpIcon/>
          
        </IconButton>
        <IconButton aria-label="Comment">
          <AddCommentIcon/>
        </IconButton>

      </CardActions>
      { console.log(pro.comments)}
      <Comments post_id={pro._id} comments={pro.comments} />
        {/* <Divider/> */}
    </Card>
       )
       
    
      })}

          </Paper>
        </Grid>

        <Grid item xs>
          <ToastContainer/>
          <Paper className={classes.paper}>
            <h3>Follow User</h3>
            
              {user_list.map( (val) => {
                return(
                  <div>
                  <div style={{display: "flex"}}>
                  <Avatar alt="Aemy Sharp" src="/static/images/avatar/1.jpg" className={classes.large} />
                    {/* <p onClick={}>{val.name}</p>                    */}
                    <p ><Link to={`/profile/${val._id}/`}>{val.name}</Link></p>                   
                  </div>
                  <Button variant="contained" onClick={ ()=> follow(val._id),()=> toast.success("You Follow a User")} color="primary">
                  Follow
                </Button>
            
                  </div>
                )
              })}
          </Paper>
        </Grid>
      </Grid>

          {/* <Alert variant="danger">
          This is a alert—check it out!
        </Alert> */}
        {/* <Alert severity="error">This is an error alert — check it out!</Alert> */}
      {/* <div className="result">{ state.message }</div> */}



  

      </div>
    )
}

export default Home


