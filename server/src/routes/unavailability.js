import unavailabilityController from "../controllers/unavailabilityController.js";

export default function (router) {
  router.get("/:userId", unavailabilityController.getAll);
  return router;
}
