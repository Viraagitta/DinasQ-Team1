const { Reimbursement, OfficialLetter, User } = require("../models");
const { generatePdf } = require("../services/toPdf")

class ReimbursementController {
  static async getReimbursements(req, res, next) {
    try {
      const response = await Reimbursement.findAll();
      res.status(200).json(response);
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

  static async getPdf(req, res, next){
    try {
      const { id } = req.params;
      const reimbursement = await Reimbursement.findOne({
        where: {id},
        include: [{
          model: OfficialLetter,
          include: {
            model: User,
            attributes: ['firstName', 'lastName', 'position']}}]
      });
      if (!reimbursement) return next({ name: "ReimbursementNotFound" });

      console.log(reimbursement.dataValues, "<<<reimburse")

      generatePdf(reimbursement.dataValues)

    } catch (error) {
      next(error);
    }
  }
}

module.exports = ReimbursementController;
