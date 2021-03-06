import  { useForm} from 'react-hook-form'
import Axios from 'axios'
import { useState, useEffect } from "react";
// import Alert from "react-bootstrap/Alert";

import Alert from '@material-ui/lab/Alert';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';


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
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import Navbar from './Navbar'

import PrimarySearchAppBar from "./Navbar";
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

import { authenticate, isAuth } from '../helpers/auth';
import { Link, Redirect } from 'react-router-dom';


// import Divider from 'material-ui/Divider'

import Comments from "./post/Comments";


import { ToastContainer, toast } from 'react-toastify';

import { makeStyles } from '@material-ui/core/styles';

import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import AddCommentIcon from '@material-ui/icons/AddComment';

import { like,unlike,remove } from './post/api-post'

import  {follow , unfollow}  from './api-user'


const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      // margin: theme.spacing(1),
      width: '50ch',
      margin:"10px",
      
      // "margin-bottom": "25px"
    },
    // maxWidth: 345,
  },
  media: {
    height: '95%',
    width:'95%',
    paddingTop: '100%', // 16:9
    // paddingTop: '0%', // 16:9

  },
  avatar: {
    backgroundColor: red[500],
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    margin :"4px"
  },
  large: {
    width: theme.spacing(7),
    height: theme.spacing(7),
  },
  follow:{
    margin:"10px",
    display: "flex",
    padding:"5px",

  }
  
}));

function Home() {
  const userId =  JSON.parse(localStorage.getItem('user'))

  const classes = useStyles();
  const { register ,handleSubmit , formState: { errors }} = useForm();
  const [data, setdata] = useState([])
  const [user_list, setuser] = useState([])
  const [search, setsearch] = useState()

  var current_user = user_list.filter((val) => val._id == userId._id)
  // console.("current_user",current_user)

  const adddata = (values) =>{
    console.log("Added Values",values);
    console.log("photo",`http://localhost:5000/${values.photo}`);
        /* 
            Be Careful
            [] Bracket return array

        */
        const newTasks = [{_id:values._id,text:values.text,photo:values.photo,comments:[],likes:[]} ,...data ]


    setdata(newTasks);
  }

  const likeupdate = (val) => {
    console.log(val)
    like(val)
    const data_clone = [...data]
    data_clone.map((element) => {
      if( element._id == val){
      return {...element,likes:element.likes.push(userId._id)}
    }})
    setdata(data_clone)
  }

  const Unlikeupdate =  (val) => {
    console.log(val)
    unlike(val)
    const data_clone = [...data]
    const rturn_val=  data_clone.map((element) => {
      // if( element._id == val){
      //  console.log(element.likes.filter(likeid => likeid == userId._id) )
      // }
      if( element._id == val){
      return {...element,likes:element.likes.filter(likeid => likeid !== userId._id)}
    }
    return element
    })
    console.log(rturn_val)
    setdata(rturn_val)
  }

  const deletePost = (postId) => {
        console.log(postId)
        
      const finalPost =  data.filter( val => val._id !==postId )
      console.log(finalPost);
      setdata(finalPost)
      remove(postId)

  }

  useEffect(() => {
    fetch(`http://localhost:5000/api/posts/feed/${userId._id}`)
      .then(response => response.json())
      .then( product => {
          // console.log("product.data",product)
          setdata(product)
      })
  }, [])

  useEffect( () =>{
    fetch('http://localhost:5000/api/users')
    .then( response => response.json() )
    .then( user => {
      // console.log(user)
      setuser(user)
    })
  },[])
  console.log(user_list)  

  function userFollow(val){
    console.log("val",val);
    follow(val)
    const user_clone = [...user_list]
     const ret = user_clone.map((user_val) => {
       if (user_val._id ==userId._id){
        /* 
          !!! Javascript Array Return length of Array not the item pushed !!!
          Here Array is Pass by Reference(AnyChange on Array is Refelected on its Copy Array 
            so console.log(user_val.following.push({"_id":val})))  also push the value to Original Array
        */

        // 1.Working code
        // user_val.following.push({"_id":val})
        //  return user_val

        // 2.Working Code
        return {...user_val,following: user_val.following.concat({"_id":val}) }
       } 
       return user_val
     })
    //  console.log("ret",ret)    
     setuser(ret)


    // setuser( user_list.filter((val) => val._id !==val) )
  }

  function userUnfollow(val){
    unfollow(val)
    const user_clone = [...user_list]
        // User Unfollow
    // console.log(user_list.filter((val) => val._id !==val))
    const ret = user_clone.map((user_val) => {
      if (user_val._id ==userId._id){
        // console.log( { ...user_val, following: user_val.following.filter((value) => value._id !==val) } )
          return { ...user_val, following: user_val.following.filter((value) => value._id !==val) }
      }
      return user_val
    })
    console.log(ret)
    setuser(ret)


  }

  const onSubmit = (data) => { 

    console.log(data);
    console.log(data.file[0]);
    // console.log(typeof(data.title));

    // FormData use "multipart/form-data" &  multer require "multipart/form-data"
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('photo',data.file[0])
    console.log("formdata",formData);
    const posted_by = userId._id
    Axios.post(`http://localhost:5000/api/posts/upload/${posted_by}`, formData)
      .then( val=>{ 
        //  console.log(val.data)
        //  console.log(val.data._id,val.data.photo_path); 
         adddata({"_id":val.data._id,'text':data.title,'photo': val.data.photo_path})

        })

      .catch(error => {
        // console.log("data",error.response.data);
        console.log("data",error);

      })

    }
    return (
        <div >
          { current_user? <Navbar current_user={current_user}/> : null}
          {isAuth() ? <Redirect to='/' /> : <Redirect to='/login' />}
          
        {/* <div style={{width:"600px",margin: "0 auto"}}> */}
        

        <Grid container spacing={3}>

        <Grid item xs>
          {/* <Paper className={classes.paper}>xs
          </Paper>  */}
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

      { data.length > 0 ? data.map( (pro) =>{
        // console.log(pro)
        
      // { data.reverse().map( (pro) =>{

       return ( 
      <Card key={pro._id} className={classes.root}>
      <CardHeader
        avatar={
          <Avatar aria-label="recipe" className={classes.avatar}>
            R
          </Avatar>
        }
        // action={
        //   <IconButton aria-label="settings">
        //     <MoreVertIcon />
        //   </IconButton>
        // }
        title={pro.text}
        subheader="September 14, 2016"
      />
      <CardContent>
        <Typography variant="body2" color="textSecondary" component="p">
        This impressive paella is a perfect party dish and a fun meal to cook together with your
        guests. Add 1 cup of frozen peas along with the mussels, if you like.
      </Typography>
      </CardContent>
      <CardMedia
        className={classes.media}
        image={`http://localhost:5000/${pro.photo}`}
        // image="https://images.unsplash.com/photo-1433086966358-54859d0ed716?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8bmF0dXJlfGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=50"
        title="Paella dish"/> 
      <CardActions disableSpacing>
        {/* {console.log(pro.likes.indexOf(userId._id) > -1)} */}
        { (pro.likes.indexOf(userId._id) > -1)
        ?  <IconButton onClick={()=> Unlikeupdate(pro._id)} aria-label="Like" color="secondary">
            <ThumbUpIcon/>
            <span>{pro.likes.length}</span>
            {/* {console.log} */}
            </IconButton>
        :  <IconButton onClick={()=>likeupdate(pro._id)  } aria-label="Like" >
          <ThumbUpIcon/>
          <span>{pro.likes.length}</span>
          </IconButton>
        }


      {/* { (pro.comments.indexOf(userId._id) > -1)
        ?  <IconButton  aria-label="Comment" color="secondary">
            <AddCommentIcon/>
            <span>{pro.comments.length}</span>
            </IconButton>
        :  <IconButton  aria-label="Comment" >
          <AddCommentIcon/>
          <span>{pro.comments.length}</span>
          </IconButton>
        } */}
        

        <IconButton aria-label="Comment">
          <AddCommentIcon/>
          {/* <span>{pro.comments.length}</span> */}
        </IconButton>


        { userId._id == pro.postedBy._id &&
        <IconButton>
        <DeleteIcon onClick= { () => deletePost(pro._id)}/>
        {/* <DeleteIcon onClick={ () => deleteComment(post_id,item._id)}/> */}

        </IconButton>
        
        }

      </CardActions>

      {/* { console.log(pro.comments)} */}
      <Comments post_id={pro._id} comments={pro.comments} />
        {/* <Divider/> */}
    </Card>
       )
       
    
      })
    
    :
    <div>
      <h2>No Post to Show</h2>
      <p>Please Follow Other to view Post </p>
      </div>
    
    }

          </Paper>
        </Grid>

        <Grid item xs>
          <ToastContainer/>
          <Paper>
            {/* <h3>Follow User</h3> */}
            
              {user_list.map( (val) => {
                // console.log(val.following,val._id);
                // let current_user = user_list.filter((val) => val._id == userId._id)
                console.log("current_user",current_user)
                console.log(current_user[0].following.map((val) => val._id));
                const user_follow = current_user[0].following.map((val) => val._id)
                if ( !(val._id == userId._id)){

                // const status = user_list.some( (val) => val.following.includes()))
                
                  // console.log(val.following.map((follow) => follow._id),userId._id);
                  // console.log(val.following.map((follow) => follow._id).includes(userId._id));
                // if( !user_list.following.includes(userId._id))
                return(
                  <div className={classes.follow}>
                    
                    {/* <Avatar aria-label="recipe" className={classes.avatar}>
                      R
                    </Avatar> */}
                  
                  <Avatar alt={val.name} src={`http://localhost:5000/${val.profile_pic}`} className={classes.large} />
                    {/* <p onClick={}>{val.name}</p>                    */}
                    <p style={{padding:"10px" }}><Link style={{ textDecoration: 'none',color:"black" }} to={`/profile/${val._id}/`}>{val.name}</Link></p>                   
                    
                  <div style={{"margin-left":"10%"}}>

                  {(user_follow.includes(val._id))?
                  <Button variant="contained" size="small" onClick={ ()=>userUnfollow(val._id)} color="primary">
                  UnFollow
                </Button>
                :
                <Button variant="contained" size="small" onClick={ ()=> userFollow(val._id)} color="primary">
                  Follow
                </Button>
                }
                </div>
            
                  </div>
                )
                  }
              })}
          </Paper>
        </Grid>
      </Grid>

          {/* <Alert variant="danger">
          This is a alert???check it out!
        </Alert> */}
        {/* <Alert severity="error">This is an error alert ??? check it out!</Alert> */}
      {/* <div className="result">{ state.message }</div> */}



  

      </div>
    )
}

export default Home


