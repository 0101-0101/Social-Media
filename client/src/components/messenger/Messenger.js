import React, { useEffect, useState , useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import "./messenger.css";
import ChatOnline from './ChatOnline';
import Conversation from './Conversation';
import Message from './Message';
import axios from 'axios';

const user =  JSON.parse(localStorage.getItem('user'))
// userId._id


const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
}));

function Messenger() {

  const [conversations, setConversations] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const scrollRef = useRef();

  useEffect(() => {
    const getConversations = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/conversations/" + user._id);
        console.log("Conversation",res.data);
        setConversations(res.data);
      } catch (err) { 
        console.log(err);
      }
    };
    getConversations();
  }, [user._id]);

  useEffect(() => {
    const getMessages = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/messages/" + currentChat?._id);
        console.log("Message",res.data);
        setMessages(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getMessages();
  }, [currentChat]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const message = {
      sender: user._id,
      text: newMessage,
      conversationId: currentChat._id,
    };

    try {
      const res = await axios.post("http://localhost:5000/api/messages", message);
      setMessages([...messages, res.data]);
      setNewMessage("");
    } catch (err) {useRef
      console.log(err);
    }
  };

    const classes = useStyles();
    
    return (
        <div className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs>
        <Paper className={classes.paper}>
              <div className="chatMenu">
              <input placeholder="Search for friends" className="chatMenuInput" />
              </div>
              { conversations.map((c) => (
                <div onClick={() => setCurrentChat(c)}>
                  <Conversation conversation={c} currentUser={user}/> 
                  </div>
              ))}
        
        
        </Paper>
        </Grid>
        <Grid item xs={6}>
          <Paper className={classes.paper}>
              {currentChat ? (
              <>
                <div className="chatBoxTop">
                  {messages.map((m) => (
                    <div ref={scrollRef}> 
                      <Message message={m} own={m.sender === user._id} />
                    </div>
                  ))}
                </div>
                <div className="chatBoxBottom">
                  <textarea
                    className="chatMessageInput"
                    placeholder="write something..."
                    onChange={(e) => setNewMessage(e.target.value)}
                    value={newMessage}
                  ></textarea>
                  <button className="chatSubmitButton" onClick={ handleSubmit }>
                    Send
                  </button>
                </div>
              </>
            ) : (
              <span className="noConversationText">
                Open a conversation to start a chat.
              </span>
            )}  

          </Paper>
        </Grid>
        <Grid item xs>
          <Paper className={classes.paper}>
              <div className="chatOnline">

              </div>
              <ChatOnline/>
          </Paper>
        </Grid>
      </Grid>
    </div>
    )
}

export default Messenger
