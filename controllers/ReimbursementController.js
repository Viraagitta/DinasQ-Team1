const { Reimbursement } = require("../models");

class ReimbursementController {
  static async getReimbursements(req, res, next) {
    try {
      const { page: xpage, size } = req.query;
      const page = xpage - 1;
      const limit = size ? +size : 9;
      const offset = page ? +page * limit : 0;
      const response = await Reimbursement.findAndCountAll({
        limit,
        offset,
      });
      res.status(200).json({
        totalReimbursements: response.count,
        totalPages: Math.ceil(response.count / size),
        currentPage: +xpage,
        response,
      });
    } catch (err) {
      next(err);
    }
  }

  static async getReimbursementById(req, res, next) {
    try {
      const { id } = req.params;
      const response = await Reimbursement.findByPk(id);
      if (!response) return next({ name: "ReimbursementNotFound" });
      res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  }

  static async createReimbursement(req, res, next) {
    try {
      const { OfficialLetterId, description, cost, image } = req.body;
      const newReimburse = await Reimbursement.create({
        ...req.body,
      });
      res
        .status(201)
        .json({ message: "Successfully requesting a new reimbursement" });
    } catch (err) {
      next(err);
    }
  }

  static async updateStatusReimbursement(req, res, next) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const updatedBy = req.user.firstName + " " + req.user.lastName;
      const reimburse = await Reimbursement.findByPk(id);
      if (!reimburse) return next({ name: "ReimbursementNotFound" });
      const updateStatus = await Reimbursement.update(
        {
          status,
          updatedBy,
        },
        { where: { id } }
      );
      res.status(201).json({
        message: `Reimbursement status id ${id} has been updated to ${status}`,
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = ReimbursementController;
