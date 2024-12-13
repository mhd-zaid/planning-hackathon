import planningController from "../controllers/planningController.js";

export default function (router) {
    router.get('/:classId', planningController.getPlanning);
    router.get('/backlog/:classId', planningController.getBacklog);
  return router;
}