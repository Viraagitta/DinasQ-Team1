const { UserLocation, User, sequelize } = require("../models");

class UserLocationController {
  static async checkInUser(req, res, next) {
    try {
      const { id } = req.user;
      const { longitude, latitude, cityName } = req.body;
      if (!longitude || !latitude || !cityName)
        return next({ name: "CheckInFirst" });
      const checkIn = await UserLocation.create({
        UserId: id,
        latitude,
        longitude,
        cityName,
      });
      res.io.emit("update-list-location", true);
      res
        .status(201)
        .json({ message: `Successfully checked in at ${cityName}` });
    } catch (err) {
      console.log(err);
      next(err);
    }
  }

  // UNTUK MOBILE JIKA PERLU
  static async locationHistoryOfOneUser(req, res, next) {
    try {
      const { id } = req.user;
      const history = await UserLocation.findAll({
        where: {
          UserId: id,
        },
        include: [
          {
            model: User,
            attributes: [
              "id",
              "firstName",
              "lastName",
              "email",
              "phoneNumber",
              "address",
              "position",
            ],
          },
        ],
        order: [["id", "DESC"]],
      });
      res.status(200).json(history);
    } catch (err) {
      next(err);
    }
  }

  static async lastLocationAllUser(req, res, next) {
    try {
      const locations = await UserLocation.findAll({
        limit: 10,
        include: [
          {
            model: User,
          },
        ],
        order: [["createdAt", "DESC"]],
      });
      res.status(200).json(locations);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = UserLocationController;
