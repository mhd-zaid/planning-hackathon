import db from "../models/index.js";
import {uuidv4} from "uuidv7";
import {Op} from "sequelize";

const getAll = async (req, res) => {
    try {
        const availabilities = await db.Availability.findAll({
            where: {
                userId: req.params.userId,
            },
        });

        const userExist = await db.User.findOne({
            where: {
                id: req.params.userId,
            },
        });

        if (!userExist) {
            return res.status(404).json({message: "L'utilisateur n'existe pas"});
        }

        return res.status(200).json(availabilities);
    } catch (error) {
        console.error("Une erreur s'est produite :", error);
        return res.status(500).json({error: "Une erreur s'est produite"});
    }
};

const create = async (req, res) => {
    try {
        const availabilities = req.body;

        console.log(availabilities);

        const userExist = await db.User.findOne({
            where: {
                id: req.params.userId,
            },
        });

        if (!userExist) {
            return res.status(404).json({message: "L'utilisateur n'existe pas"});
        }
        const availabilitiesError = [];
        const availabilitiesSuccess = [];

        for (const availability of availabilities){
        const overlap = await db.Availability.findOne({
          where: {
            userId: req.params.userId,
            [Op.and]: [
              {beginDate: {[Op.lt]: availability.endDate}},
              {endDate: {[Op.gt]: availability.beginDate}},
            ],
          },
        });

        if (overlap) {
          availabilitiesError.push(availability);
        }else {
          availabilitiesSuccess.push(availability);
        }
      }

      // await availabilities.forEach(async (availability) => {
      //       const overlap = await db.Availability.findOne({
      //           where: {
      //               userId: req.params.userId,
      //               [Op.and]: [
      //                   {beginDate: {[Op.lt]: availability.endDate}},
      //                   {endDate: {[Op.gt]: availability.beginDate}},
      //               ],
      //           },
      //       });
      //
      //       if (overlap) {
      //           availabilitiesError.push(availability);
      //       }else {
      //           availabilitiesSuccess.push(availability);
      //       }
      //   });

        await Promise.all(
            availabilitiesSuccess.map((availability) => {
                return db.Availability.create({
                    id: uuidv4(),
                    userId: req.params.userId,
                    beginDate: availability.beginDate,
                    endDate: availability.endDate,
                    isFavorite: availability.isFavorite,
                });
            })
        );

        if (availabilitiesError.length > 0) {
            return res.status(400).json({
                message:
                    "Les disponibilités suivantes chevauchent des disponibilités existantes. Les autres disponibilités ont été créées",
                availabilitiesError,
            });
        }

        return res.status(201).json({message: "Disponibilités créées"});
    } catch (error) {
        console.error("Une erreur s'est produite :", error);
        return res.status(500).json({error: "Une erreur s'est produite"});
    }
};

const update = async (req, res) => {
    try {
        const availability = req.body;

        const availabilityExist = await db.Availability.findOne({
            where: {
                id: req.params.id,
            },
        });

        if (!availabilityExist) {
            return res.status(404).json({message: "La disponibilité n'existe pas"});
        }

        const overlap = await db.Availability.findOne({
            where: {
                userId: req.params.userId,
                [Op.and]: [
                    {beginDate: {[Op.lt]: availability.endDate}},
                    {endDate: {[Op.gt]: availability.beginDate}},
                ],
            },
        });

        if (overlap && overlap.id !== availabilityExist.id) {
            return res.status(400).json({
                message: "La disponibilité chevauche une autre disponibilité existante",
            });
        }

        await availabilityExist.update({
            beginDate: availability.beginDate,
            endDate: availability.endDate,
            isFavorite: availability.isFavorite,
        });

        return res.status(200).json({availability: availabilityExist});
    } catch (error) {
        console.error("Une erreur s'est produite :", error);
        return res.status(500).json({error: "Une erreur s'est produite"});
    }
};

const deleteAvailability = async (req, res) => {
    try {
        const availability = await db.Availability.findOne({
            where: {
                id: req.params.id,
            },
        });

        if (!availability) {
            return res.status(404).json({message: "La disponibilité n'existe pas"});
        }

        await availability.destroy();
        return res.status(204).json();
    } catch (error) {
        console.error("Une erreur s'est produite :", error);
        return res.status(500).json({error: "Une erreur s'est produite"});
    }
};

export default {create, update, deleteAvailability, getAll};
