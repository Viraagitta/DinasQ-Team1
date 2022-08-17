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
        order: [
          ["id", "DESC"],
          [Reimbursement, "id", "DESC"],
        ],
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
      const findLetter = await OfficialLetter.findAll({
        where: {
          UserId,
        },
        include: [
          {
            model: Reimbursement,
          },
        ],
        order: [
          ["id", "DESC"],
          [Reimbursement, "id", "DESC"],
        ],
      });
      res.status(200).json(findLetter);
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
      res.io.emit("update-list-letter", true);
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
      const updatedBy = req.user.firstName + " " + req.user.lastName;
      if (!letter) return next({ name: "LetterNotFound" });
      const updateStatus = await OfficialLetter.update(
        {
          status,
          updatedBy,
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
