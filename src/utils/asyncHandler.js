// const asyncHandler=(requestHandler)=>{
//     return  (req,res,next)=>{
//         Promise.resolve(requestHandler(req,res,next)).catch((err)=>next(err));
//     }
// };
const asyncHandler=(func)=>async(req,res,next)=>{

    try {
        await func(req,res,next);
    } catch (error) {
        console.error(error);
        res.status(500).json({message:"Server Error"});
    }
};
export    {asyncHandler}; 