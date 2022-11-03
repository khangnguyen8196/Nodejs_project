import  userService from "../services/userService"

let handleLogin =async(req, res)=>{
    let email = req.body.email;
    let password = req.body.password;
    if (!email || !password){
        return res.status(500).json({
            errCode:1,
            message: 'Missing inputs parameters !'

        })
    }
    let userData = await userService.handleUserLogin(email, password);
    return res.status(200).json ({
        errCode: userData.errCode,
        message: userData.errMessage,
        user: userData.user ? userData.user : {}
    
    })
}

let handleGetAllUsers =async (req, res) => {
    let id = req.query.id; // All, id 

    if(!id){
        return res.status(200).json({
            errCode: 1,
            errMessage: 'Missing required parameter',
            users:[]
        })
    }
    let users = await userService.getAllUsers(id);
    return res.status(200).json({
        errCode: 0,
        errMessage: 'Ok',
        users
    })

}

let handleCreateNewUser =async (req, res) => {
    let message = await userService.createNewUser(req.body);
    return res.status(200).json(message);
}

let handleDeleteUser =async (req, res) => {
    if(!req.body.id){
        return res.status(200).json({
            errCode:1,
            errMessage:"Missing required parameters!"
        })
    }
    let message = await userService.deleteUser(req.body.id);
    return res.status(200).json(message);
}

let handleEditUser = async(req, res) => {
    try {
        let message = await userService.updateUserData(req.body);
        return res.status(200).json(message)
    }catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode:-1,
            errMessage:' Error from server....'
        })
    }
   
}

let getAllCode =async (req, res) => {
    try {
        setTimeout(async() => {
            let data = await userService.getAllCodeService(req.query.type);
            console.log(data);
            return res.status(200).json(data);
        },3000)
        // let data = await userService.getAllCodeService(req.query.type);
        // console.log(data);
        // return res.status(200).json(data);
    }catch(e){
        console.log('getAllCode error: ',e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}
    
module.exports={
    handleLogin: handleLogin,
    handleGetAllUsers: handleGetAllUsers,
    handleCreateNewUser: handleCreateNewUser,
    handleEditUser: handleEditUser,
    handleDeleteUser: handleDeleteUser,
    getAllCode: getAllCode,
}