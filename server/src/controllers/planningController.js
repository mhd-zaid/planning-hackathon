import db from '../models/index.js';

const getAll = async(req, res) => {
    try {
      
      return res.status(200).json("planning");
    } catch (error) {
      console.error("Une erreur s'est produite :", error);
      return res
        .status(500).error("Une erreur s'est produite");
    }
}

export default {getAll}