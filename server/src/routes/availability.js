import availabilityController from '../controllers/availability';

export default function (router) {
    router.post('/', availabilityController.create);
    router.put('/:id', availabilityController.update);
    router.delete('/:id', availabilityController.remove);
    return router;
}
