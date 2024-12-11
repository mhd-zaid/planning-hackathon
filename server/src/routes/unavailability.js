import unavailabilityController from "../controllers/unavailabilityController.js";

export default function (router) {
  router.get("/:userId", unavailabilityController.getAll);
  router.post("/:userId", unavailabilityController.createAbsence);
  router.put("/:id", unavailabilityController.update);
  router.delete("/:id", unavailabilityController.deleteUnavailability);
  return router;
}
