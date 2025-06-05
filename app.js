const express=require('express')
require('dotenv').config();
const mongoose=require("mongoose")
const multer=require("multer")
const session=require("express-session")
const ejs=require('ejs')
const User=require('./model/user')
const controlfile=require("./controller/matricontroller")
const path=express()


path.set('view engine','ejs')

path.get("/",controlfile.home)
path.get("/about",controlfile.about)
path.get("/contact",controlfile.contact)
path.get("/Groomdata",controlfile.groom)
path.get("/Bridedata",controlfile.bride)
path.get("/login",controlfile.login)
path.get("/sign",controlfile.sig)
//signup

//database connection
mongoose.connect('mongodb://localhost:27017/weddingdata',{useNewURLParser:true})
const db=mongoose.connection
db.on('error',(error)=>console.log(error))
db.once('open',()=>console.log("connected to database"))

//fetch data from database
path.get("/cand",(req,res)=>{
    User.find().then((users)=>{
        res.render("Candidate",{users}),{
            title:"home page",
            users:users
        }
    }).catch((error)=>{
        console.log("data can not fetch")
    })
   
})

//fetch image
path.use(express.static("uploads"))

//image uploades
const storage=multer.diskStorage({
    destination:function(req,file,cb)
    {
        cb(null,'./uploads')
    },
    filename:function(req,file,cb)
    {
        cb(null,file.filename+"_"+Date.now()+"_"+file.originalname)
    }
})
var upload=multer({
    storage:storage,
}).single("image")

//insertdata into database
path.post("/adduser",upload,(req,res)=>{
    const user=new User({
        name:req.body.name,
        email:req.body.email,
        phone:req.body.phone,
        quali:req.body.quali,
        image:req.file.filename
    })
    user.save().then(()=>{
        console.log("document has been saved sucessfully")
    }).catch((err)=>{
        console.log("document has not saved")
    })
    res.redirect('/')
})

//delete data
path.use("/delete/:id",(req,res)=>{
    let id=req.params.id 
    User.findByIdAndDelete(id).then(()=>{
        res.redirect("/cand")
    }).catch((error)=>{
        console.log("something went wrong")
    })
})

//update data
path.get("/edit/:id",(req,res)=>{
    let id=req.params.id 
    User.findById(id).then((user)=>{
        res.render("Edituser",{
            title:"edit user",
            user:user
        })
    })
})

//updated data
path.post("/update/:id",upload,(req,res)=>{
    let id=req.params.id
    User.findByIdAndUpdate(id,{
         name:req.body.name,
        email:req.body.email,
        phone:req.body.phone,
        quali:req.body.quali,
        image:req.file.filename
    }).then(()=>{
       res.redirect("/cand") 
    })
})


const port=process.env.PORT||6001
path.listen(port,()=>{
    console.log(`server running on port http://localhost:${port}`)
})