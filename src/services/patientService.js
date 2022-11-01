import db from '../models/index';
require('dotenv').config();
import emailService from './emailService'
import { v4 as uuidv4 } from 'uuid';
uuidv4(); // ⇨ '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d'


let buildUrlEmail = (doctorId, token) => {
   
    let result = `${process.env.URL_REACT}/verify-booking?token=${token}&doctorId=${doctorId}`
    return result;
}
let postBookAppointment =(data)=> {
    return new Promise(async(resolve, reject) => {
        try {
            if (!data.fullName || !data.email || !data.doctorId || !data.timeType || !data.date){
                resolve({
                    errCode:1,
                    errMessage:'Missing required parameters!'
                })
            }else {
                let token = uuidv4(); // ⇨ '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d'
                  
                await emailService.sendSimpleEmail({
                    receiverEmail:data.email,
                    patientName:' khangnguyen ',
                    time:data.timeString,
                    doctorName:data.doctorName,
                    language:data.language,
                    redirectLink:buildUrlEmail(data.doctorId, token)
                })

                //upsert patient
                let user = await db.User.findOrCreate({
                    where: { email: data.email},
                    defaults: {
                        email: data.email,
                        roleId:'R3'
                    },
                });
                console.log ('hoi tao di m check user',user[0])
                // create a booking record
                if( user && user[0]){
                    await db.Booking.findOrCreate({
                        where:{ patientId: user[0].id },
                        defaults: {
                            statusId :'S1',
                            doctorId:data.doctorId,
                            patientId:user[0].id,
                            date:data.date,
                            timeType:data.timeType,
                            token:token
                        }
                    })
                }
                resolve({
                    errCode :0,
                    errMessage :'Save infor patient succeed!'
                })
            }
        }catch(e){
            reject(e)
        }
    })
}

let postVerifyBookAppointment = (data) => {
    return new Promise(async(resolve, reject) => {
        try {
            if (!data.token || !data.doctorId ){
                resolve({
                    errCode:1,
                    errMessage:'Missing required parameters!'
                })
            }else {
                let appointment = await db.Booking.findOne({
                    where:{
                        doctorId:data.doctorId,
                        token:data.token,
                        statusId:'S1'
                    },
                    raw:false
                })
                if (appointment){
                    appointment.statusId = 'S2';
                    await appointment.save()
                    resolve({
                        errCode:0,
                        errMessage:'Update the appointment succeed!'
                    })
                }else{
                    resolve({
                        errCode:2,
                        errMessage:'Appointment booking failed or does not exist'
                    })
                }

            }
        }catch(e){
            reject(e)
        }
    })
}
module.exports = {
    postBookAppointment:postBookAppointment,
    postVerifyBookAppointment:postVerifyBookAppointment,
    
}