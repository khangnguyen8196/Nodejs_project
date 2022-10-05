import db from '../models/index';
import bcrypt from 'bcryptjs';
let handleUserLogin =(email, password) => {
    return new Promise(async(resolve, reject) => {
        try {
            let userData ={};
            let isExist = await checkUserEmail(email);
            if (isExist) {
                let user = await db.User.findOne({
                    where: {email: email},
                    raw:true,
                    attributes:['email','roleId', 'password']

                });

                if (user){
                    // compare password
                    let check = await bcrypt.compareSync(user.password, password);
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
                    resolve(userData);
            }
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

module.exports ={
    handleUserLogin:handleUserLogin,
}