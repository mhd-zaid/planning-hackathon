import db from "../models/index.js";
import { uuidv4 } from "uuidv7";

const acceptReplacement = async (req, res) => {

    try {
        const replacementId = req.params.replacementId;
    
        const replacement = await db.Replacement.findOne({
        where: {
            id: replacementId,
        },
        });
    
        if (!replacement) {
        return res.status(404).send({
            message: "Le remplacement n'existe pas.",
        });
        }

        await db.WorkHour.create({
            id: uuidv4(),
            beginDate: replacement.beginDate,
            endDate: replacement.endDate,
            subjectClassId: replacement.subjectClassId,
            schoolDayClassId: replacement.schoolDayClassId,
        });

        const replacementsToDelete = await db.Replacement.findAll({
            where: {
                unavailabilityId: replacement.unavailabilityId,
            },
        });

        for (const replacementToDelete of replacementsToDelete) {
            await db.Replacement.destroy({
                where: {
                    id: replacementToDelete.id,
                },
            });
        }
    
        return res.status(200).send({
        message: "Le remplacement a été accepté.",
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
        message: "Une erreur est survenue.",
        });
    }
};

const declineReplacement = async (req, res) => {
    try {
        const replacementId = req.params.replacementId;
    
        const replacement = await db.Replacement.findOne({
        where: {
            id: replacementId,
        },
        });
    
        if (!replacement) {
        return res.status(404).send({
            message: "Le remplacement n'existe pas.",
        });
        }
    
        await db.Replacement.destroy({
        where: {
            id: replacement.id,
        },
        });
    
        return res.status(200).send({
        message: "Le remplacement a été refusé.",
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
        message: "Une erreur est survenue.",
        });
    }
}

const getAllReplacements = async (req, res) => {
    try {
        const userId = req.params.id;

        const replacements = await db.Replacement.findAll({
            where:{
                teacherId: userId,
            }
        });
        return res.status(200).send(replacements);
    } catch (error) {
        console.log(error);
        return res.status(500).send({
        message: "Une erreur est survenue.",
        });
    }
};

export default { acceptReplacement, declineReplacement, getAllReplacements };