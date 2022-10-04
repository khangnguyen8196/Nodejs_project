import db from '../models/index';
import CRUDService from '../services/CRUDService';


let getHomePage =async(req, res) => {
    try{
        let data= await db.User.findAll();
        return res.render ('homepage.ejs', {
            data:JSON.stringify(data),
        });
    } catch (e){
        console.log(e);
    }
}

let getAboutPage =(req, res) => {
    return res.render ('test/about.ejs');
}

let getCrudPage =(req, res) => {
    return res.render ('test/crud.ejs');
}

let postCrudPage = async(req, res) => {
    let message = await CRUDService.createNewUser(req.body);
    console.log(message);
    return res.send ('post crud from server');
}

module.exports = {
    getHomePage: getHomePage,
    getAboutPage: getAboutPage,
    getCrudPage: getCrudPage,
    postCrudPage: postCrudPage,
}