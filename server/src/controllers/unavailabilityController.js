import db from '../models/index.js';
import {uuidv4} from "uuidv7";


const getAll = async (req, res) => {
    try {
        const unavailabilities = await db.Unavailability.findAll({
            where: {
                userId: req.params.userId
            }
        });

        const userExist = await db.User.findOne({
            where: {
                id: req.params.userId
            }
        })

        if (!userExist) {
            return res.status(404).json({message: "L'utilisateur n'existe pas"});
        }

        return res.status(200).json(unavailabilities);
    } catch (error) {
        console.error("Une erreur s'est produite :", error);
        return res
            .status(500).json({error: "Une erreur s'est produite"});
    }
}

const create = async (req, res) => {

    try {
        const unavailability = req.body;

        const userExist = await db.User.findOne({
            where: {
                id: req.params.userId
            }
        })

        if (!userExist) {
            return res.status(404).json({message: "L'utilisateur n'existe pas"});
        }

        const newUnavailability = await db.Unavailability.create({
            id: uuidv4(),
            date: unavailability.date,
            start: unavailability.start,
            end: unavailability.end,
            userId: req.params.userId
        });

        return res.status(201).json(newUnavailability);
    } catch (error) {
        console.error("Une erreur s'est produite :", error);
        return res
            .status(500).json({error: "Une erreur s'est produite"});
    }
}

const update = async (req, res) => {
}

const deleteUnavailability = async (req, res) => {

}

export default {create, update, deleteUnavailability, getAll}
