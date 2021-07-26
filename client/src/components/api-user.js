import Axios from 'axios'
import cookie from 'js-cookie'

const token = cookie.get('token')
const userId =  JSON.parse(localStorage.getItem('user'))



export const follow = (followId)=>{
    console.log("followId",followId);
    console.log("userId",userId._id);
    Axios.put('http://localhost:5000/api/users/follow',
        {userId:userId._id, followId: followId},
        {
            Headers: {
                'authorization':token
            }
          }
        )
    .then(response => {
        console.log(response);
        console.log("Sucess");
    })
    .catch(error => {
        console.log(error);
    })
}

export const unfollow = (unfollowId)=>{
    console.log("UnfollowId",unfollowId);
    console.log("userId",userId._id);
    Axios.put('http://localhost:5000/api/users/unfollow',
        {userId:userId._id, unfollowId: unfollowId},
        {
            Headers: {
                'authorization':token
            }
          }
        )
    .then(response => {
        console.log(response.data);
        console.log("Sucess");
    })
    .catch(error => {
        console.log(error);
    })
}
// export const changePic = (followId)=>{
//     console.log("followId",followId);
//     console.log("userId",userId._id);
//     Axios.put('http://localhost:5000/api/users/follow',
//         {userId:userId._id, followId: followId},
//         {
//             Headers: {
//                 'authorization':token
//             }
//           }
//         )
//     .then(response => {
//         console.log(response);
//         console.log("Sucess");
//     })
//     .catch(error => {
//         console.log(error);
//     })
// }

export const read = (params)=>{
    console.log("profileID",params);
    return Axios.get(`http://localhost:5000/api/users/${params.profileID}`)
    .then(response => {
        console.log(response.data);
        
        console.log("Read Sucess");
        return response.data
    })
    .catch(error => {
        console.log(error);
    })
}

