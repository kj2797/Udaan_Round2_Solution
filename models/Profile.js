const mongoose=require('mongoose')
const Schema=mongoose.Schema;

const ProfileSchema=new Schema({
    playerName:{
        type:String,
        required:true,
        max:50
    },
    playerValue:{
        type:String,
        default:"0"
    },
    playerScore:{
        type:String,
        default:"0"
    },
    playerTeam:{
        type:String,
        required:true
    },
    playerType:{
        type:String,
        default:"B"
    },
    date:{
        type:Date,
        default:Date.now
    }
})


module.exports=Profile=mongoose.model('myProfile',ProfileSchema)

