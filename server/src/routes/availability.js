import availabilityController from '../controllers/availabilityController.js';

export default function (router) {
    router.get('/:userId', availabilityController.getAll);
    router.post('/:userId', availabilityController.create);
    router.put('/:id', availabilityController.update);
    router.delete('/:id', availabilityController.deleteAvailability);
    return router;
}
