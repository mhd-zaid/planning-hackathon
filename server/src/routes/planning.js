import planningController from "../controllers/planningController.js";

export default function (router) {
    router.get('/:classId', planningController.generatePlanning);
    router.get('/', planningController.getPlanning);
  return router;
}