import replacementController from "../controllers/replacementController.js";

export default function (router) {
    router.get('/:replacementId', replacementController.acceptReplacement);
    router.delete('/:replacementId', replacementController.declineReplacement);
    router.get('/teacher/:id', replacementController.getAllReplacements);
  return router;
}