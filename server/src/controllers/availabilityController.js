import db from '../models/index.js';
import {uuidv4} from "uuidv7";
import {Op} from "sequelize";

const create = async (req, res) => {
    try {
        const availability = req.body;

        const userExist = await db.User.findOne({
            where: {
                id: req.params.userId
            }
        })

        if (!userExist) {
            return res.status(404).json({message: "L'utilisateur n'existe pas"});
        }

        const overlap = await db.Availability.findOne({
            where: {
                userId: req.params.userId,
                [Op.or]: [
                    {
                        start: {
                            [Op.between]: [availability.start, availability.end]
                        }
                    },
                    {
                        end: {
                            [Op.between]: [availability.start, availability.end]
                        }
                    },
                    {
                        [Op.and]: [
                            {
                                start: {
                                    [Op.lte]: availability.start
                                }
                            },
                            {
                                end: {
                                    [Op.gte]: availability.end
                                }
                            }
                        ]
                    }
                ]
            }
        });

        if (overlap) {
            return res.status(400).json({message: "La disponibilité chevauche une autre disponibilité existante"});
        }

        const newAvailability = await db.Availability.create({
            id: uuidv4(),
            date: availability.date,
            start: availability.start,
            end: availability.end,
            isFavorite: availability.isFavorite,
            userId: req.params.userId
        });
        return res.status(201).json({availability: newAvailability});
    } catch (error) {
        console.error("Une erreur s'est produite :", error);
        return res
            .status(500).json({error: "Une erreur s'est produite"});
    }
}

const update = async (req, res) => {

}

const deleteAvailability = async (req, res) => {
    try {
        const availability = await db.Availability.findOne({
            where: {
                id: req.params.id
            }
        });

        if (!availability) {
            return res.status(404).json({message: "La disponibilité n'existe pas"});
        }

        await availability.destroy();
        return res.status(204).json();
    } catch (error) {
        console.error("Une erreur s'est produite :", error);
        return res
            .status(500).json({error: "Une erreur s'est produite"});
    }
}

export default {create, update, deleteAvailability}
