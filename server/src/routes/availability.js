import availabilityController from '../controllers/availabilityController.js';

export default function (router) {
    router.post('/:userId', availabilityController.create);
    router.put('/:id', availabilityController.update);
    router.delete('/:id', availabilityController.deleteAvailability);
    return router;
}
