const express = require('express')
const jwt = require('jsonwebtoken')
const router = express.Router()
const User = require('../models/user')
const mongoose = require('mongoose')
const db = "mongodb+srv://usernaveen:passwordnaveen@cluster0.c28ib.mongodb.net/eventsdb?retryWrites=true&w=majority"

mongoose.connect(
    db,
    { useNewUrlParser: true,useUnifiedTopology: true },
    err =>{
            
        if(err){
            console.error('Error', + err)
        }
        else{
            console.log('connected to db')
        }
})

function verifyToken(req, res, next){
    if(!req.headers.authorization){
        return res.status(401).send('unauthorized status')
    }
    let token = req.headers.authorization.split(' ')[1]
    if(token === 'null'){
        return res.status(401).send('unauthorized request')
    }
    let payload =jwt.verify(token, 'secretkey')
    if(!payload){
        return res.status(401).send('unauthorizd request')
    }
    req.userId = payload.subject
    next()
}

router.get('/', (req, res)=>{
    res.send('From API Route')

})

router.post('/register', (req, res)=>{
    let userData = req.body
    let user = new User(userData)
    user.save((error, registeredUser)=>{
        if(error){
            console.log(error)
        }
        else 
        {
            let payload= { subject: registeredUser._id}
            let token = jwt.sign(payload, 'secretkey')
            res.status(200).send({token}) 
        }
    }) 
})

router.post('/login', (req, res)=>{
    let userData = req.body

    User.findOne({email: userData.email}, (error, user)=>{
        let userName= user.email        
        if(error){
            console.log(error)
        }else {
            if(!user){
                res.status(401).send('Invalid email')
            } else{
                if(user.password !== userData.password){
                    res.status(401).send('Invalid password')
                }else{
                    let payload = { subject: user._id}
                    let token = jwt.sign(payload, 'secretkey')
                    res.status(200).send({token,userName,user})
                }
            }
        }
    })
})

router.get('/user',verifyToken,(req, res)=>{
    User.find({}).then(function (users) {
        const response = {            
            users: users.map(user => {
                return {
                    _id: user._id, 
                    firstName : user.firstName,
                    lastName : user.lastName,
                    email : user.email                   
                }
            })
        };
        res.send(response);
        });
})
router.get('/user/:id',verifyToken, (req,res)=>{
    User.findById(req.params.id)
    .then(user => {res.send(user)})
})
router.delete('/user/:id',(req,res)=>{
    User.remove(req.params.id)
})
module.exports = router
