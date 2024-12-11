import branchController from "../controllers/branchController.js";

export default function (router) {
  router.get('/', branchController.getAll);
  return router;
}