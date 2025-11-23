

 export const adminAuth = (req,res,next)=>{
    const token="xyz"
    const isAdminAuthorised= token==="xyz"
    if(!isAdminAuthorised){
        res.status(401).send("Unauthorized Access")
    }
    next()
}

export const userAuth =(req,res,next)=>{
    const token ="abc"
    const isUserAuthorised = token==="abc"
    if(!isUserAuthorised){
        res.status(401).send("Unauthorized Access"

        )
    }
    next()
}