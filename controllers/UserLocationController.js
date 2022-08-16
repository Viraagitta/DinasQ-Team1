const { UserLocation, User, sequelize } = require("../models");
const { getGeocode, getCityName } = require("../services/location");
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
      res
        .status(201)
        .json({ message: `Successfully checked in at ${cityName}` });
    } catch (err) {
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
      });
      res.status(200).json(history);
    } catch (err) {
      next(err);
    }
  }

  static async lastLocationAllUser(req, res, next) {
    try {
      const locations = await User.findAll({
        attributes: [
          "id",
          "firstName",
          "lastName",
          "email",
          "phoneNumber",
          "address",
          "position",
        ],
        include: [
          {
            model: UserLocation,
          },
        ],
        order: [[UserLocation, "updatedAt", "DESC"]],
      });
      res.status(200).json(locations);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = UserLocationController;
