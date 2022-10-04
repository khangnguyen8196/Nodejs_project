import bcrypt from 'bcryptjs';
import db from '../models/index';
import { promiseImpl } from 'ejs';
const salt = bcrypt.genSaltSync(10);

let createNewUser = async(data)=>{
     return new promiseImpl(async(resolve, reject)=>{
        try {
            let hashPasswordFromBcrypt = await hashUserPassword (data.password);
            await db.User.create({
                email: data.email,
                password: hashPasswordFromBcrypt,
                firstName: data.firstName,
                lastName: data.lastName,
                address: data.address,
                phoneNumber: data.phoneNumber,
                gender: data.gender === '1' ? true : false,
                roleId: data.roleId,
            })
            resolve(" ok create new user success")
        }catch(e){
            reject(e);
        }
    })
}

let hashUserPassword =(password) => {
    return new Promise(async(resolve, reject) => {
        try {
            let hashPassword = await bcrypt.hashSync(password, salt);
            resolve(hashPassword);
        } catch (e){
            reject(e);
        }
    
    })
}

let getAllUser =() => {
    return new Promise(async(resolve, reject) => {
        try {
            let user = await db.User.findAll({
                 raw : true,
            });
            resolve(user)
        }catch (e) {
        reject(e);
        }
    })
}

module.exports = {
    createNewUser: createNewUser,
    getAllUser: getAllUser,
}