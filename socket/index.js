const io = require("socket.io")(8900,{
    cors: {
        origin : "http://localhost:3000"
    }
})

let users = []

const removeUser = (socketId) => {
    users = users.filter( (user) => user.socketId !== socketId );
}

const addUser = ( userId ,socketId ) => {
    !users.some((user) => user.userId === userId) && users.push({userId,socketId}) 
}
const getUser = (userId) => {
    return users.find((user) => user.userId === userId);
  };

io.on("connection" , (socket) =>{
    console.log("A User is Connected.");
    io.emit("welcome" ,"to Socket.io")
    
    socket.on("adduser", (userId) => {
        addUser(userId,socket.id)
        io.emit("getUsers",users)
    })

    socket.on("SendMessage", ({ senderId , receiverId , text }) =>{
        const user = getUser(receiverId);
        io.to(user.socketId).emit("getMessage" , {
            senderId,
            text
        })
    })  

    socket.on("disconnect" , () => {
        console.log("User Disconnected");
        removeUser(socket.id)
        io.emit("getUsers",users)
    })

})