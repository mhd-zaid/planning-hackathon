import workHourController from "../controllers/workHourController.js";

export default function (router) {
  router.post("/", workHourController.create);
  router.delete("/:id", workHourController.deleteWorkHour);
  router.get("/:userId", workHourController.getWorkHoursByUser);
  router.get("/:classId", workHourController.getWorkHoursByClass);
  return router;
}
