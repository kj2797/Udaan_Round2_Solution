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
        required:true
    },
    playerScore:{
        type:String
    },
    playerTeam:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        default:Date.now
    }
})


module.exports=Profile=mongoose.model('myProfile',ProfileSchema)

