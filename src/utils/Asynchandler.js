const asynchandler =(requesthandler)=>{
   return (req,res,next)=>{
        Promise.resolve(requesthandler(req,res,next).catch((error)=>next(error)))
    }
}

export {asynchandler}


//const asunchandler = () => {}
//const asynchandler = (func) => () => {}
//const synchandler  = (func) => async () => {}