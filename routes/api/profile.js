 const express=require('express')
const router=express.Router()
const mongoose=require('mongoose')
const passport=require('passport')

//Load Person Model
const Person=require('../../models/Person')

//Load Profile Model
const Profile=require('../../models/Profile')

// @type     GET
// @route    /api/profile/
// @desc     route for personnal user profile
// @access   PRIVATE
router.get(
    '/',
    passport.authenticate('jwt',{session:false}),
    (req,res)=>{
        Profile.findOne({user:req.user.id})
            .then(profile=>{
                if(!profile){
                    return res.status(404).json({profilenotfound:'No Profile Found'})
                }
                res.json(profile)
            })
            .catch(err=>console.log('Got some error in profile'+err))

})



//router.get('/',(req,res)=>res.json({test:'profile working'}))



// @type     POST
// @route    /api/profile/
// @desc     route for updating/saving personnal user profile
// @access   PRIVATE
router.post(
    '/',
    passport.authenticate('jwt',{session:false}),
    (req,res)=>{
        const profileValues={}
        profileValues.user=req.user.id
        if (req.body.username)  profileValues.username=req.body.username
        if (req.body.website)  profileValues.website=req.body.website
        if (req.body.country)  profileValues.country=req.body.country
        if (req.body.portfolio)  profileValues.portfolio=req.body.portfolio
        if (req.body.languages!==undefined ){
            profileValues.languages=req.body.languages.split(',');
        }

        //get social links
        profileValues.social={}
        if (req.body.youtube)  profileValues.social.youtube=req.body.youtube
        if (req.body.facebook)  profileValues.social.facebook=req.body.facebook
        if (req.body.instagram)  profileValues.social.instagram=req.body.instagram
    
        //Do database stuff
        Profile.findOne({user:req.user.id})
            .then(profile=>{
                if(profile){
                    Profile.findOneAndUpdate(
                        {user:req.user.id},
                        {$set:profileValues},
                        {new:true}
                    )
                        .then(profile=>res.json(profile))
                        .catch(err=>console.log('Problem in update'+err))
                }else{
                    Profile.findOne({username:profileValues.username})
                        .then(profile=>{
                            //Username already exists
                            if(profile){
                                res.status(400).json({username:'username already exists'})
                            }
                            //save user
                            new Profile(profileValues).save()
                                .then(profile=>res.json(profile))
                                .catch(err=>console.log('error in else of profile'+err))
                        })
                        .catch(err=>console.log('Error in else block in profile.js '+err))
                }
            })
            .catch(err=>console.log('Problem in fetching profile'+err))

    }
)


// @type     GET
// @route    /api/profile/user/:username
// @desc     route for getting user profile based on USERNAME
// @access   PUBLIC

router.get('/user/:username',(req,res)=>{
    Profile.findOne({username:req.params.username})
    .populate('user',['name','profilepic'])
        .then(profile=>{
            if(!profile){
                res.status(404).json({usernotfound:'User not Found'})
            }
            res.json(profile)
        })
        .catch(err=>console.log('Error in fetching user name'+err))
})


// @type     GET
// @route    /api/profile/find/everyone
// @desc     route for getting all user profile
// @access   PUBLIC

router.get('/find/everyone',(req,res)=>{
    Profile.find()
    .populate('user',['name','profilepic'])
        .then(profiles=>{
            if(!profiles){
                res.status(404).json({usernotfound:'No profile found'})
            }
            res.json(profiles)
        })
        .catch(err=>console.log('Error in fetching user name'+err))
})

// @type     DELETE
// @route    /api/profile/
// @desc     route for deleting user base on ID
// @access   PRIVATE

router.delete('/',passport.authenticate('jwt',{session:false}),(req,res)=>{
    Profile.findOne({user:req.user.id})
        .then(()=>{
            Profile.findOneAndRemove({user:req.user.id})
                .then(()=>{
                    Person.findOneAndRemove({_id:req.user.id})
                        .then(()=>res.json({success:"delete was a success"}))
                        .catch(err=>console.log('Error in deleting erson'+err))
                })
                .catch(err=>console.log('Error in deleting Profile'+err))
            
        })
        .catch(err=>console.log('Error in delete route'+err))
})

// @type     POST
// @route    /api/profile/workrole
// @desc     route for adding work profile of a person
// @access   PRIVATE

router.post('/workrole', passport.authenticate('jwt',{session:false}),(req,res)=>{
    Profile.findOne({user:req.user.id})
        .then(profile=>{
            if(!profile){
                res.status(404).json({usernotfound:'No profile found'})
            }
            
            const newWork={
                role:req.body.role,
                company:req.body.company,
                country:req.body.country,
                from:req.body.from,
                to:req.body.to,
                current:req.body.current,
                details:req.body.details
            }
            profile.workrole.unshift(newWork)
            profile
                .save()
                .then(profile=>res.json(profile))
                .catch(err=>console.log(err))
        })
        .catch(err=>console.log(err))
})



module.exports=router;


