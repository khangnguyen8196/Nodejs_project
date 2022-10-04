import express from 'express';
import homeController from '../controllers/homeController'

let router =express.Router();

let initWebRoutes =(app) => {
    router.get('/', homeController.getHomePage)
    router.get('/about', homeController.getAboutPage);
    router.get('/crud', homeController.getCrudPage);

    router.post('/post-crud', homeController.postCrudPage);
    router.get('/get-crud', homeController.displayGetCRUD);


      
      
    return app.use("/", router);
}
module.exports =initWebRoutes;