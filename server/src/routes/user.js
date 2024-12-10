import userController from "../controllers/userController.js";


export default function (router) {
  router.get('/', userController.getAll);
  return router;
}