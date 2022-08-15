const { OfficialLetter, Reimbursement } = require("../models");

class OfficialLetterController {
  static async getAllOfficialLetter(req, res, next) {
    try {
      const { page: xpage, size } = req.query;
      const page = xpage - 1;
      const limit = size ? +size : 9;
      const offset = page ? +page * limit : 0;
      const response = await OfficialLetter.findAndCountAll({
        limit,
        offset,
        include: [Reimbursement],
      });
      res.status(200).json({
        totalOfficialLetters: response.count,
        totalPages: Math.ceil(response.count / size),
        currentPage: +xpage,
        response,
      });
    } catch (err) {
      next(err);
    }
  }

  static async getOfficialLetterById(req, res, next) {
    try {
      const { id } = req.params;
      const response = await OfficialLetter.findByPk(id, {
        include: [Reimbursement],
      });
      if (!response) return next({ name: "LetterNotFound" });
      res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  }

  static async loggedInOfficialLetter(req, res, next) {
    try {
      const UserId = req.user.id;
      const findLetter = await OfficialLetter.findOne({
        where: {
          UserId,
        },
        include: [Reimbursement]
      });
      res.status(200).json(findLetter);
    } catch (err) {
      next(err)
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

  static async updateStatusLetter(req, res, next) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const letter = await OfficialLetter.findByPk(id);
      if (!letter) return next({ name: "LetterNotFound" });
      const updateStatus = await OfficialLetter.update(
        {
          status,
          updatedAt: new Date(),
        },
        { where: { id } }
      );
      res.status(201).json({
        message: `Official letter status ${id} has been updated to ${status}`,
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = OfficialLetterController;
