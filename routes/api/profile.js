 const express=require('express')
const router=express.Router()
const mongoose=require('mongoose')
const passport=require('passport')

//Load Person Model
const Person=require('../../models/Person')

//Load Profile Model
const Profile=require('../../models/Profile')

//router.get('/',(req,res)=>res.json({test:'profile working'}))

// @type     GET
// @route    /api/profile/find/everyone
// @desc     route for getting all player profile
// @access   PUBLIC

router.get('/find/everyone',(req,res)=>{
    Profile.find()
    .populate('user',['name','playerValue','playerType','playerTeam','profilepic'])
        .then(profiles=>{
            if(!profiles){
                res.status(404).json({usernotfound:'No player found'})
            }
            res.json(profiles)
        })
        .catch(err=>console.log('Error in fetching user name'+err))
})



// @type     POST
// @route    /api/profile/maketeam
// @desc     route for adding team of a person
// @access   PUBLIC

router.post('/maketeam',(req,res)=>{
    Person.findOne({name:req.body.name})
        .then(person=>{
            if(!person){
                res.status(404).json({usernotfound:'No person found'})
            }
            
            const newTeam={
                team:req.body.playername,
            }
            person
                .save()
                .then(person=>res.json({msg:"Team Added",person:person}))
                .catch(err=>console.log(err))
        })
        .catch(err=>console.log(err))
})














// @type     GET
// @route    /api/profile/user/:username
// @desc     route for getting user profile based on USERNAME
// @access   PUBLIC

router.get('/user/:username',(req,res)=>{
    Profile.findOne({name:req.params.username})
    .populate('user',['name','profilepic'])
        .then(profile=>{
            if(!profile){
                res.status(404).json({usernotfound:'User not Found'})
            }
            res.json(profile)
        })
        .catch(err=>console.log('Error in fetching user name'+err))
})





module.exports=router;


