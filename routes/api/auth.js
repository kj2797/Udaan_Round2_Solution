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
                    .then(person => res.json({success:"true",person:person,message:"Welcome to cricket fantasy league"}))
                    .catch(err => console.log(err))


            }
        })
        .catch(err => console.log(err))
})


// @type     POST
// @route    /api/auth/login
// @desc     route for login of users
// @access   PUBLIC
router.post('/login', (req, res) => {
    const email = req.body.email
    const password = req.body.password
    Person.findOne({ email })
        .then(person => {
            if (!person) {
                return res.status(404).json({ emailerror: 'user not found with this email' })
            }
            bcrypt.compare(password, person.password)
                .then(isCorrect => {
                    if (isCorrect) {
                        //res json for  
                        //res.json({success:'User logged in successfully'})


                        //USE PAYLOAD AND CREATE TOKEN FOR USER
                        const payload = {
                            id: person.id,
                            name: person.name,
                            email: person.email
                        }
                        jsonwt.sign(
                            payload,
                            key.secret,
                            { expiresIn: 60 * 60 },
                            (err, token) => {
                                if (err) throw (err)
                                res.json({
                                    success: true,
                                    token: "Bearer " + token
                                })
                            }
                        )
                    }
                    else {
                        res.status(400).json({ passworderror: 'password not correct' })
                    }
                })
                .catch(err => console.log(err))
        })
        .catch(err => console.log(err))
})


// @type     GET
// @route    /api/auth/profile
// @desc     route for user profile
// @access   PRIVATE
router.get(
    '/profile',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        //console.log(req)
        res.json({
            id: req.user.id,
            name: req.user.name,
            email: req.user.email,
            profilepic: req.user.profilepic
        })
    })


// @type     GET
// @route    /api/auth/forgot_password
// @desc     route for sending forgot password email
// @access   PUBLIC
router.post('/forgot_password', (req, res) => {
    const email = req.body.email
    Person.findOne({ email })
        .then(person => {
            if (!person) {
                return res.status(404).json({ emailerror: 'user not found with this email' })
            }

            // console.log(person.password)
            //USE PAYLOAD AND CREATE TOKEN FOR USER
            const payload = {
                id: person.id,
                name: person.name,
                email: person.email,
                password: person.password
            }
            jsonwt.sign(
                payload,
                key.secret,
                { expiresIn: 60 * 60 },
                (err, token) => {
                    if (err) throw (err)
                    var resettoken = token

                    Person.update(
                        { email: req.body.email },
                        { $set: { resettoken: resettoken } }

                    )
                        .then(profile => res.json(profile))
                        .catch(err => console.log('Problem in update' + err))
                    // console.log({ success: true,token: "Bearer " + token})

                    // console.log(token)




                    var client = new Mailin("https://api.sendinblue.com/v2.0", "q0BPgVNyXKDa5Uhj");
                    const email2 = JSON.stringify(email)

                    var x = JSON.parse(email2)
                    var key = x;
                    var obj = {};
                    obj[key] = key;
                    var data1 = {}
                    data1["to"] = obj
                    data2 = {
                        "from": ["developer.jodha@gmail.com", "WSS STO"],
                        "subject": "WSS STO Password Reset"
                    }
                    var data = { ...data1, ...data2 };
                    var content = "Click on this link to change password : <a href='http://localhost:3002/api/auth/reset_password/" + token + "' target='_blank'>Link</a>"
                    data1 = {}
                    data1["html"] = content
                    data = { ...data, ...data1 }



                    client.send_email(data).on('complete', function (data) {
                        // console.log(data);
                        // res.json(data)
                        //render('thanks')
                    });



                    // newPerson
                    //     .save()
                    //     .then(person => res.json(person))
                    //     .catch(err => console.log(err))


                }
            )
        })
        .catch(err => console.log('idhar' + err))
})


// @type     POST
// @route    /api/auth/reset_password
// @desc     route for resetting password
// @access   PUBLIC


router.get('/reset_password/:token', (req, res) => {
    // let token = req.params.token;
    var token = "Bearer " + req.params.token
    console.log(token)
    Person.findOne({ resettoken: req.params.token })
        .then(person => {
            if (!person) {
                res.status(404).json({ usernotfound: 'No profile found' })
            }

            console.log(person)

        })
        .catch(err => console.log(err))

    // console.log('reached my link')
})



module.exports = router;
