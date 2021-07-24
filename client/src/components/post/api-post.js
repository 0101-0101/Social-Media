import Axios from 'axios'
import cookie from 'js-cookie'

const token = cookie.get('token')
const userId =  JSON.parse(localStorage.getItem('user'))


export const like = (postId) => {
    console.log("like",postId);
    Axios.put('http://localhost:5000/api/posts/like/',
    {userId:userId._id, postId},
        {
        Headers: {
            'authorization':token
      }
      }            
      ) 
    .then((response) => {
      console.log(response);
      console.log("Like Sucess");
    }).catch((err) => {
      console.log(err)
    })
  }

  export const unlike = (postId) => {
    console.log("Unlike",postId);
    Axios.put('http://localhost:5000/api/posts/unlike/',
    {userId:userId._id, postId},
        {
        Headers: {
            'authorization':token
      }
      }            
      ) 
    .then((response) => {
      console.log(response);
      console.log("Unlike Sucess");
    }).catch((err) => {
      console.log(err)
    })
  }

export const comment = ({post_id},all_comment)=>{
    console.log("followId",post_id,all_comment);
    console.log("userId",userId._id);
    Axios.put('http://localhost:5000/api/posts/comment',
        {userId:userId._id, postId: post_id,comment:all_comment},
        {
            Headers: {
                'authorization':token
            }
          }
        )
    .then(response => {
        console.log(response);
        console.log("Comment Sucess");
    })
    .catch(error => {
        console.log(error);
    })
}

export const listByUser = (params)=>{
  console.log("userId",params);
   return(Axios.get(`http://localhost:5000/api/posts/by/${params}`,
      { Headers: {'authorization':token } }
      )
  .then(response => {
      console.log(response);
      console.log("listByUser Sucess");
      return response.data
  })
  .catch(error => {
      console.log(error);
  })
   )
}