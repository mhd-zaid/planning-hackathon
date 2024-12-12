import db from "../models/index.js";

const getAll = async (req, res) => {
  try {
    const unavailabilities = await db.Unavailability.findAll({
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
      return res.status(404).json({ message: "L'utilisateur n'existe pas" });
    }

    return res.status(200).json(unavailabilities);
  } catch (error) {
    console.error("Une erreur s'est produite :", error);
    return res.status(500).json({ error: "Une erreur s'est produite" });
  }
};

export default { getAll };
