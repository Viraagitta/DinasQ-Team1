const axios = require("axios");
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const getCityName = async (geocode) => {
  try {
    const { lat, lng } = geocode;

    let city = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_API_KEY}`
    );

    var cityName = city.data.results[0].address_components.filter(function (
      address_component
    ) {
      return address_component.types.includes("administrative_area_level_2");
    });

    return cityName[0].long_name;
  } catch (error) {
    console.log(error);
  }
};

const getGeocode = async () => {
  try {
    let location = await axios.post(
      `https://www.googleapis.com/geolocation/v1/geolocate?key=${GOOGLE_API_KEY}`
    );
    location = location.data.location;

    return location;
  } catch (error) {
    console.log(error);
  }
};

module.exports = { getGeocode, getCityName };
