import mongoose from  "mongoose";


const connectionRequestSchema =new mongoose.Schema({
    fromUserId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",  //refrence to the user Collection
        required:true

    },
    toUserId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",  //refrence to the user Collection
        required:true
    },
    status:{
        type:String,
        required:true,

        enum:{
            values:["accepted","rejected","interested","ignored"],
            message: `{VALUE} is not valid status`
        }
    }
},
{timestamps:true}
);
// ConnectionRequest.find({fromUserId:someId})  with indexing it will give very fast result 

connectionRequestSchema.index({fromUserId :1,toUserId:1}) //compund indexing ;

const ConnectionRequestModel=mongoose.model("ConnectionRequest",connectionRequestSchema);

export default ConnectionRequestModel;