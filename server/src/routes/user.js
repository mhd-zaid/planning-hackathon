import userController from "../controllers/userController.js";


export default function (router) {
  router.get('/', userController.getAll);
  router.get('/:email', userController.getUserByEmail);
  return router;
}