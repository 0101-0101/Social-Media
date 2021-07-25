import React, { useState,useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import Axios from 'axios';
import {comment , uncomment} from './api-post'
import {Link} from 'react-router-dom'
import DeleteIcon from '@material-ui/icons/Delete';



const useStyles = makeStyles((theme) => ({
    cardHeader: {
      paddingTop: theme.spacing.unit,
      paddingBottom: theme.spacing.unit
    },
    smallAvatar: {
      width: 25,
      height: 25
    },
    commentField: {
      width: '96%'
    },
    commentText: {
      backgroundColor: 'white',
      padding: theme.spacing.unit,
      margin: `2px ${theme.spacing.unit*2}px 2px 2px`
    },
    commentDate: {
      display: 'block',
      color: 'gray',
      fontSize: '0.8em'
   },
   commentDelete: {
     fontSize: '1.6em',
     verticalAlign: 'middle',
     cursor: 'pointer'
   }
  })
)

function Comments({post_id,comments}) {
  const userId =  JSON.parse(localStorage.getItem('user'))

    // console.log("Comment",post_id,comments);
    // var comments = comments
    // const [prev, setprev] = useState()
    // setprev(comments)
    const [all_comment,setall] = useState(comments.reverse())
    const [add_comment, setcomment] = useState()
    // const handleChange =  event => {
    //     // setcomment({[event.target.name]: event.target.value})
    //     console.log(event.target.value);
    //   }

    // const addComment = (event) => {
    //     console.log("ADd1 ",post_id,comment);
    //     if(event.keyCode == 13 ){
    //         event.preventDefault()
    //         console.log("ADd 2");
    //     }
    // }

        const postComment = (event) => {
            console.log("ADd1 ",post_id,add_comment);
            comment({post_id,add_comment})
            .then(val => {
              console.log("return val", val);
              // comments 
              // setall([{_id:val._id,text:add_comment,postedBy:val.postedBy} ,...all_comment ])
              // setall([{_id:val._id,text:comments,postedBy:val.postedBy} ,...all_comment ])
              setall(val.comments.reverse())

            })
            setcomment()
            
            // Axios.put
    }

    // useEffect(() => {
    //     Axios.put('http://localhost:5000/api/posts/comment')
    //     .then(response => {
    //         console.log(response)
    //     })
    // }, [])
    
    const classes = useStyles();

    const deleteComment = (post_id,comment_id) => {
      console.log("Param", post_id,comment_id);
      // all_comment.map( (value) => {
      //   return {...value,}
      // })
      const removecmt = all_comment.filter( val => val._id !==comment_id )
      console.log(removecmt);
      setall(removecmt)

      uncomment({ post_id , comment_id })
    }
    
    const commentBody = item => {
      // console.log(userId._id,item.postedBy);
      return (
        <p className={classes.commentText}>
          {/* <Link to={"/user/" + item.postedBy._id}>{item.postedBy.name}</Link><br/> */}
          {item.text}
          <span className={classes.commentDate}>
            {(new Date(item.created)).toDateString()} |
          {userId._id == item.postedBy &&
              <DeleteIcon onClick={ () => deleteComment(post_id,item._id)} className={classes.commentDelete}>delete</DeleteIcon> }
              {/* <DeleteIcon onclick={ () => uncomment(post_id,item._id)} className={classes.commentDelete}>delete</DeleteIcon> } */}

          </span>
        </p>
      )
    }

    return (
        <div>
           <CardHeader
        avatar={
          <Avatar aria-label="recipe" className={classes.avatar}>
            R
          </Avatar>
        }
        title={ <TextField
            // onKeyDown={addComment}
            multiline
            // value={this.state.text}
            onChange={ (event) => setcomment(event.target.value) }
            placeholder="Write something ..."
            margin="normal"
            />}
          className={classes.cardHeader}

      />
      <Button variant="contained" onClick={()=>postComment(post_id)} color="primary">
        Comment
      </Button>

      
      <div style={{"margin-left": "10%" }}>
      {all_comment.map((val) => {
            return(
              <CardHeader
                      avatar={
                        <Avatar className={classes.smallAvatar} />
                      }
                      title={commentBody(val)}
                      className={classes.cardHeader}
                      key={val}/>
            )
      }) }
    </div>

        </div>
    )
}

export default Comments
