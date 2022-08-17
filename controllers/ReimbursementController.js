const { Reimbursement, OfficialLetter, User } = require("../models");
const { generatePdf } = require("../services/toPdf");
const nodemailer = require("nodemailer");

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
        order: [["id", "DESC"]],
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
      res.io.emit("update-list-reimbursement", true);
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
      const { status, email } = req.body;
      console.log(email, "<<<<<<<");
      const updatedBy = req.user.firstName + " " + req.user.lastName;
      const reimburse = await Reimbursement.findByPk(id);
      if (!reimburse) return next({ name: "ReimbursementNotFound" });
      const updateStatus = await Reimbursement.update(
        {
          status,
          updatedBy,
          updatedAt: new Date(),
        },
        { where: { id } }
      );
      let mailTransporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "dinasq05@gmail.com",
          pass: "zncqxfdyjcalonps",
        },
      });

      let mailDetails = {
        from: "dinasq05@gmail.com",
        to: email,
        subject: "Status Reimburse",
        html: `<html><body><p>Hello ${email}, your reimbursement ${JSON.stringify(
          reimburse.description
        )} with amount of Rp ${reimburse.cost.toLocaleString(
          "id-ID"
        )} has been <b>${status.toUpperCase()}</b>.</p></body></html>`,
      };

      mailTransporter.sendMail(mailDetails, function (err, data) {
        if (err) {
          console.log("Error Occurs");
        } else {
          console.log("Email sent successfully");
        }
      });
      res.status(201).json({
        message: `Reimbursement status id ${id} has been updated to ${status}`,
      });
    } catch (err) {
      next(err);
    }
  }

  static async getPdf(req, res, next) {
    try {
      const { id } = req.params;
      const reimbursement = await Reimbursement.findOne({
        where: { id },
        include: [
          {
            model: OfficialLetter,
            include: {
              model: User,
              attributes: ["firstName", "lastName", "position"],
            },
          },
        ],
      });
      if (!reimbursement) return next({ name: "ReimbursementNotFound" });

      generatePdf(reimbursement.dataValues);

      res.download("services/report.pdf");
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ReimbursementController;
