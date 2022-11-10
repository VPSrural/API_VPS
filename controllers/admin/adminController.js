const adminModel = require("../../models/admin/admin")
const db = require('../../models/connetion')
const md5 = require('md5')
const jwt = require('jsonwebtoken')

module.exports.getAdmin = async (req, res, next) => {
    res.setHeader("Content-type", "application/json");
    if(db()){
        try{
            const result = await adminModel
            .find({})
            .exec()

            res.status(200).json(result)
        }catch(err){
            res.status(400).json({error: err})
        }
    }else{
        res.status(404).json({error: "Database não encontrada"})
    }
    
}

module.exports.postAdmin = async (req, res, next) => {
    res.setHeader("Content-type", "application/json");
    if(db()){
        try{
            
            const login = req.body.login;
            const senha = md5(req.body.senha);
            const cpf = req.body.cpf;
            const rg = req.body.rg;
            const nome = req.body.nome 

            // forcing error if there arent one of them
            if(!(login && senha && cpf && rg)){
                res.status(400).json({error: "login, senha, cpf e rg são necessários"})
                return
            }

            // consulting and verifying
            const verifyCpf = await adminModel.findOne({cpf})

            if(verifyCpf){
                res.status(409).json({error: "Usuário com este cpf já existe. Apenas um cadastro por cpf"})
                return
            }

            // create doc and inserting -> return the doc
            const adminToInsert = await adminModel.create({
                login: login,
                senha: senha,
                cpf: cpf,
                nome: nome,
                rg: rg,
            })

            //creating token
            const token = jwt.sign({
                adminid: adminToInsert._id,
                adminCpf: adminToInsert.cpf
            },
            process.env.TOKEN_Key_ADMIN,
            {
                expiresIn: "30d"
            })

            // inserting token to send to the user.
            adminToInsert.token = token;

            res.status(200).send(adminToInsert)
        }catch(err){
            res.status(400).json({error: err})
        }
    }else{
        res.status(404).json({error: "Database não encontrada"})
    }
}

module.exports.updateAdmin = async (req, res) => {
    res.setHeader("Content-type", "application/json")
    if(db()){
        try{
            const adminId = req.params.id
            const login = req.body.login;
            const senha = md5(req.body.senha);
            const cpf = req.body.cpf;
            const rg = req.body.rg;
            const nome = req.body.nome

            const responseFromdb = await adminModel.findByIdAndUpdate(adminId, {
                login: login,
                senha: senha,
                cpf:cpf,
                rg: rg,
                nome: nome,
            })

            // if it returns nothing
            if(!responseFromdb){
                res.status(401).json({message: "erro ao atualizar"})
                return
            }

            res.status(200).json({message: "Atualizado com sucesso"})

        }catch(err){
            res.status(400).json({error: err})
        }
    }else{
        res.status(404).json({error: "Database não encontrada"})        
    }
}

module.exports.deleteAdmin = async (req, res) => {
    res.setHeader("Content-type", "application/json")
    if(db()){
        try{

            const adminId = req.params.id
            adminModel.findByIdAndDelete(adminId).then((err, docs)=>{
                if(!err){                    
                    res.status(200).json(deleting)
                }else{
                    res.status(400).json({message:"Erro ao excluir documento."})
                }
            })

        }catch(err){
            res.status(400).json({error: err})
        }

    }else{
        res.status(404).json({error: "Database não encontrada"})
    }
}