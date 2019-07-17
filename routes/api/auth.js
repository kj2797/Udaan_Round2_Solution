const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jsonwt = require('jsonwebtoken')
const passport = require('passport')
const key = require('../../setup/myurl')
require("../../setup/mailin");



// @type     GET
// @route    /api/auth
// @desc     just for test
// @access   PUBLIC

router.get('/', (req, res) => res.json({ test: 'Auth is being tested' }))


//Import schema for person to register
const Person = require('../../models/Person')
const Profile = require('../../models/Profile')


// @type     POST
// @route    /api/auth/register
// @desc     route for new user registration
// @access   PUBLIC

router.post('/register', (req, res) => {
    Person.findOne({ name: req.body.name })
        .then(person => {
            if (person) {
                return res
                    .status(400)
                    .json({ nameerror: 'This Participant already registered' })
            } else {
                const newPerson = new Person({
                    name: req.body.name
                })
                newPerson
                    .save()
                    .then(person => res.json({ success: "true", person: person, message: "Welcome to cricket fantasy league" }))
                    .catch(err => console.log(err))


            }
        })
        .catch(err => console.log(err))
})


// @type     POST
// @route    /api/auth/addplayer
// @desc     route for new player registration
// @access   PUBLIC

router.post('/addplayer', (req, res) => {
    Person.findOne({ name: req.body.name })
        .then(person => {
            if(person){
            if (person.isAdmin=="1") {


                Profile.findOne({ playerName: req.body.playername })
                    .then(profile => {
                        if (profile) {
                            return res
                                .status(400)
                                .json({ nameerror: 'This Player already registered' })
                        } else {
                            const newProfile = new Profile({
                                playerName: req.body.playername,
                                playerValue: req.body.score,
                                playerTeam:req.body.team

                            })
                            newProfile
                                .save()
                                .then(profile => res.json({ success: "true", profile: profile, message: "Player added to cricket fantasy league" }))
                                .catch(err => console.log(err))


                        }
                    })
                    .catch(err => console.log(err))

            } else {
                return res.json({ adminerror: "You are not an admin" })
            }
        } else {
            return res.json({ adminerror: "Name does not exist" })
        }

        })

        .catch(err => console.log(err))
})



// @type     GET
// @route    /api/auth/profile
// @desc     route for checking your team
// @access   PUBLIC
router.get('/profile',(req, res) => {
        //console.log(req)
        res.json({
            id: req.user.id,
            name: req.user.name,
            email: req.user.email,
            profilepic: req.user.profilepic
        })
    })






module.exports = router;
