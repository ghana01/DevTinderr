


const intialiseSocket  = (server)=>{
    const Io = socket(server,{
        cors:{
            origin:"http://localhost:5173",
            credentials: true
        }
    })
    Io.on("connection",(socket)=>{
        // handel events here 

    })
}

export default intialiseSocket;