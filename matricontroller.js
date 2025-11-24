exports.home=(req,res,next)=>{
    res.render("index")
}

exports.about=(req,res,next)=>{
    res.render("about")
}

exports.contact=(req,res,next)=>{
    res.render("contact")
}

exports.groom=(req,res,next)=>{
    res.render("Groom")
}

exports.bride=(req,res,next)=>{
    res.render("Bride")
}

exports.login=(req,res,next)=>{
    res.render('Login')
}

exports.sig=(req,res,next)=>{
    res.render("Signup")
}