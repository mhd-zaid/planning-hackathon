import workHourController from "../controllers/workHourController.js";


export default function (router) {
  router.post('/:subjectClassId', workHourController.create);
  router.delete('/:id', workHourController.deleteWorkHour);
  router.get('/:userId', workHourController.getWorkHoursByUser);
  return router;
}