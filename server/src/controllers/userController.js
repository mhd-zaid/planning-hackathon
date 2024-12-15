import db from '../models/index.js';

const getAll = async(req, res) => {
    try {
      const users = await db.User.findAll(
        {
          include: [
            {
              model: db.Class,
              as: 'class',
            },
          ],
        }
      );
      return res.status(200).json(users);
    } catch (error) {
      console.error("Une erreur s'est produite :", error);
      return res
        .status(500).error("Une erreur s'est produite");
    }
}

const getUserByEmail = async(req, res) => {
    try {
      const user = await db.User.findOne({ where: { email: req.params.email } });

      if (!user) {
        return res
          .status(404)
          .json({ message: "Aucun utilisateur trouvé avec cet email" });
      }

      return res.status(200).json(user);
    } catch (error) {
      console.error("Une erreur s'est produite :", error);
      return res
        .status(500).error("Une erreur s'est produite");
    }
}

export default {getAll, getUserByEmail}