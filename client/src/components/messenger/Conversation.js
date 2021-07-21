import axios from "axios";
import { useEffect, useState } from "react";

function Conversation( { conversation, currentUser } ) {

    const [user, setUser] = useState(null);
    // const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  
    useEffect(() => {
      const friendId = conversation.members.find((m) => m !== currentUser._id);
  
      const getUser = async () => {
        try {
          const res = await axios("http://localhost:5000/api/users/" + friendId);
        console.log(res.data);
            setUser(res.data);
        } catch (err) {
          console.log(err);
        }
      };
      getUser();
    }, [currentUser, conversation]);

    return (
        <div className="conversation">
          <img
            className="conversationImg"
            src="https://images.pexels.com/photos/3686769/pexels-photo-3686769.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500"
            // src="http://localhost:3000/user.png}
            alt=""
          /> 
          <span className="conversationName">{ user?.name} </span>
        </div>
      );
}

export default Conversation
