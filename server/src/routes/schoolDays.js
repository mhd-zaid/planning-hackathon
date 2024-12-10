import schoolDayController from "../controllers/schoolDayController.js";


export default function (router) {
  router.get('/:classId', schoolDayController.getAll)
  router.post('/:classId', schoolDayController.create);
  return router;
}