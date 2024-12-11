import { validate as uuidValidate } from 'uuid';


const checkUUID = (uuid) => {
    return uuidValidate(uuid);
}

export {checkUUID};