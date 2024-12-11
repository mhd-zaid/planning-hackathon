import planningController from "../controllers/planningController.js";

export default function (router) {
    router.get('/', planningController.getAll);
    router.get('/:classId', planningController.generatePlanning);
  return router;
}