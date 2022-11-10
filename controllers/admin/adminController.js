module.exports.getAdmin = (req, res, next) => {
    res.setHeader("Content-type", "application/json");
    try{
        res.status(200).json({message: "correto"})
    }catch(err){
        res.status(400).json({message: "algo errado ocorreu"})
    }
}