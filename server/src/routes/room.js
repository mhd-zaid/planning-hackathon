import roomController from "../controllers/roomController.js";

export default function (router) {
  router.get('/', roomController.getAll);
  return router;
}