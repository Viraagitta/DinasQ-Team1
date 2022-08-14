const { UserLocation } = require("../models");
const { getGeocode, getCityName } = require("../services/location");
class UserLocationController {
  static async checkInUser(req, res, next) {
    try {
      const { id } = req.user;
      const geocode = await getGeocode();
      const city =  await getCityName(geocode);
      const checkIn = await UserLocation.create({
        UserId: id,
        latitude: geocode.lat,
        longitude: geocode.lng,
        cityName: city,
      });
      res.status(201).json({message: `Successfully checked in at ${city}`});
    } catch (err) {
      next(err);
    }
  }
}

module.exports = UserLocationController;
