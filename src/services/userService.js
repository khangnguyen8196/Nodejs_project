import db from '../models/index';
import bcrypt from 'bcryptjs';
const salt = bcrypt.genSaltSync(10);

let hashUserPassword = (password) => {
    return new Promise(async (resolve, reject) => {
        try {
            //lưu ý, truyền vào đúng password cần hash
            // let hashPassWord = await bcrypt.hashSync("B4c0/\/", salt); => copy paste mà ko edit nè
            let hashPassWord = await bcrypt.hashSync(password, salt);

            resolve(hashPassWord);
        } catch (e) {
            reject(e);
        }

    })
}

let handleUserLogin =(email, password) => {
    return new Promise(async(resolve, reject) => {
        try {
            let userData ={};
            let isExist = await checkUserEmail(email);
            if (isExist) {
                let user = await db.User.findOne({
                    attributes:['email','roleId', 'password'],
                    where: {email: email},
                    raw:true,

                });

                if (user){
                    // compare password
                    let check = await bcrypt.compare(password, user.password);
                    if (check){
                        userData.errCode = 0;
                        userData.errMessage ="OK";

                        delete user.password;
                        userData.user = user;
                    }else {
                        userData.errCode =3;
                        userData.errMessage ='wrong password';
                    }
                }else {
                    userData.errCode =2;
                    userData.errMessage =` User not found`
                }


            }else {
                userData.errCode =1;
                    userData.errMessage = `your's Email isn't exist  in your system. Plz try other email!`
                }
                resolve(userData);
        }catch(e){
            reject(e);
        }
    })
}


let checkUserEmail=(userEmail) => {
    return new Promise(async(resolve, reject) =>{
        try{
            let user= await db.User.findOne({
                where:{ email: userEmail}
            })
            if (user){
                resolve(true)
            }else {
                resolve(false)
            }

        }catch(e){
            reject(e);
        }
    })
}

let getAllUsers = (userId) => {
    return new Promise(async(resolve, reject) => {
        try {
            let users ="";
            if(userId ==='ALL') {
                users =await db.User.findAll({
                    attributes:{
                        exclude:['password']
                    }
                })
            }
            if(userId && userId !== 'ALL') {
                users = await db.User.findOne({
                    where: {id:userId},
                    attributes:{
                        exclude:['password']
                    }
                    
                })
            }
            resolve(users)
        }catch(e){
            reject(e);
        }
    })
}

let createNewUser = (data) => {
    return new Promise(async(resolve, reject) => {
        try 
            {   //check email is exist ???
                let check = await checkUserEmail(data.email);
                if (check === true) {
                    resolve({
                        errCode:1,
                        message:'your email is already in used, please try another email'
                    });
                }
                let hashPassWordFromBcrypt = await hashUserPassword(data.password);
                await db.User.create({
                    email: data.email,
                    password: hashPassWordFromBcrypt,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    address: data.address,
                    phoneNumber: data.phoneNumber,
                    gender: data.gender === '1' ? true : false,
                    roleId: data.roleId,
            })
                resolve({
                    errCode:0,
                    message:'OK'
                });
    
    }catch(e){
        reject(e);
    }
    })
}

let deleteUser = (userId) => {
    return new Promise(async(resolve, reject) => {
        try{
            let foundUser = await db.User.findOne({
                where:{id : userId},
            })
            if(!foundUser){
                resolve({
                    errCode :2,
                    errMessage:`The user isn't exist`
                })
            }
            await db.User.destroy({
                where: {id: userId}
            })

            resolve({
                errCode:0,
                message:`The user is deleted success`
            })
        }catch(e){
            reject(e)
        }
        
    })
}

let updateUserData = (data) => {
    return new Promise(async(resolve, reject) => {
        try {
            if(!data.id){
                resolve({
                    errCode:2,
                    errMessage:'missing required parameters'
                })
            }
            let user = await db.User.findOne({
                where: { id: data.id },

            })
            if (user) {
                user.firstName = data.firstName;
                user.lastName = data.lastName;
                user.address = data.address;

                await user.save();
                
                resolve({
                    errCode:0,
                    message:'Update user succeeds!'
                });

            } else {
                resolve({
                    errCode:1,
                    errMessage:'User not found!'
                });

            }

        }catch (e){
            reject(e)
        }
    })
}
module.exports ={
    handleUserLogin:handleUserLogin,
    getAllUsers: getAllUsers,
    createNewUser: createNewUser,
    deleteUser: deleteUser,
    updateUserData: updateUserData,
}