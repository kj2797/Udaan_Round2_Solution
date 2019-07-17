const express=require('express')
const mongoose=require('mongoose')
const bodyparser=require('body-parser')
const passport=require('passport')
const ejs=require('ejs')

//bring all routes
const auth=require('./routes/api/auth')
const profile=require('./routes/api/profile')
const question=require('./routes/api/question')


const app=express()

//setup for ejs
app.set('view engine','ejs')

//Middleware for bodyparser
app.use(bodyparser.urlencoded({extended:false}))
app.use(bodyparser.json())


//mongoDB configuration
const db=require('./setup/myurl').mongoURL


//Attempt to connect to database
mongoose
    .connect(db)
    .then(()=>console.log('MongoDB connected successfully'))
    .catch(err=>console.log(err));

//Passport middleware    
app.use(passport.initialize())

//Config for JWT Strategy
require('./strategies/jsonwtstrategy')(passport)


//just for testing route
app.get('/',(req,res)=>{
    res.render('index')
    //res.send('connected')
});


//load register page
app.get('/register',(req,res)=>{
    res.render('register')
    //res.send('connected')
});


//load login page
app.get('/login',(req,res)=>{
    res.render('login')
    //res.send('connected')
});

//load forget password page
app.get('/forgot_pass',(req,res)=>{
    res.render('forgot_pass')
    //res.send('connected')
});

app.post('/reset_pass',(req,res)=>{
    res.render('reset_pass')
    //res.send('connected')
});

//actual routes
app.use('/api/auth',auth)
app.use('/api/profile',profile)
app.use('/api/question',question)

const port=process.env.PORT || 3002

app.listen(port,()=>console.log(`App is running at port ${port}...`))














