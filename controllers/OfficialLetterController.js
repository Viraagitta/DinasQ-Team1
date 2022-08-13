const { OfficialLetter, Reimbursement } = require("../models");

class OfficialLetterController {
  static async getAllOfficialLetter(req, res, next) {
    try {
      const response = await OfficialLetter.findAll({
        include: [Reimbursement]
      });
      res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  }

  static async getOfficialLetterById(req, res, next) {
    try {
      const { id } = req.params;
      const response = await OfficialLetter.findByPk(id);
      if (!response) return next({ name: "LetterNotFound" });
      res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  }

  static async createOfficialLetter(req, res, next) {
    try {
      const { id } = req.user;
      const { activityName, from, to, leaveDate, returnDate } = req.body;
      const newRequest = await OfficialLetter.create({
        UserId: id,
        activityName,
        from,
        to,
        leaveDate,
        returnDate,
      });
      res.status(201).json({ message: "Successfully requesting new activity" });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = OfficialLetterController;
