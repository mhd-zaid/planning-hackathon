import planningController from "../controllers/planningController.js";

export default function (router) {
    router.get('/:classId', planningController.getPlanning);
  return router;
}