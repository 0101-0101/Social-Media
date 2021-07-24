import axios from 'axios';

const val = JSON.parse(localStorage.getItem('user'))


export const userdata = async ()=>{
    try {
    return await axios.get("http://localhost:5000/api/users/" + val._id)
    .then((res) => {
        // console.log(res);
        return  res.data
        // return res.data
      })
    } catch (error) {
        console.log(error);
    }
  }



    


