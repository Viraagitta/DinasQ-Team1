const request = require("supertest");
const app = require("../App");
const { User, UserLocation } = require("../models");
const { signPayload } = require("../helpers/jwt");

let dummyUser = null;
let dummyAdmin = null;
let adminToken = null;
let userToken = null;

beforeAll((done) => {
  let userData = {
    firstName: "Heri",
    lastName: "Puter",
    role: "Super Admin",
    email: "heri@dinasq.com",
    password: "12341234",
    phoneNumber: "081212121212",
    address: "Jl. Hokwart No. 13",
    position: "Software Engineer",
  };

  let data = {
    firstName: "Hermiyon",
    lastName: "Granjer",
    role: "Staff",
    email: "hermiyon@dinasq.com",
    password: "12341234",
    phoneNumber: "081212121212",
    address: "Jl. Hokwart No. 13",
    position: "Region Manager",
  };

  User.create(userData)
    .then((user) => {
      dummyAdmin = user.dataValues;
      adminToken = signPayload({
        id: dummyAdmin.id,
        email: dummyAdmin.email,
        role: dummyAdmin.role,
      });
      return User.create(data);
    })
    .then((user) => {
      dummyUser = user.dataValues;
      userToken = signPayload({
        id: dummyUser.id,
        email: dummyUser.email,
        role: dummyUser.role,
      });
    
    })
    .then(() => {
      const data = {
        UserId: 2,
        latitude: '111111',
        longitude: '111111',
        cityName: 'Jakarta',
      };

      return UserLocation.create(data)
    })
    .then(()=> done())
    .catch((err) => {
      done(err);
      console.log(err);
    });
});

beforeEach(() => {
  jest.restoreAllMocks();
});

afterAll((done) => {
  User.destroy({ truncate: true, restartIdentity: true, cascade: true })
    .then(() => {
      done();
    })
    .catch((err) => {
      done(err);
      console.log(err);
    });
});

//CHECKIN USER
describe("POST /locations - Checkin User", () => {
  describe("POST /locations - Checkin User - Success Test", () => {
    it("Should return a status of 201, a success message with city name", async () => {
      const payload = {
        longitude: "1111111",
        latitude: "1111111",
        cityName: "Jakarta",
      };

      const res = await request(app)
        .post("/locations")
        .send(payload)
        .set({ access_token: userToken });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty(
        "message",
        "Successfully checked in at Jakarta"
      );
    });
  });

  describe("POST /locations - Checkin User - Fail Test", () => {
    it("Should return a status of 400, a fail message", async () => {
      const payload = {
        longitude: "",
        latitude: "",
        cityName: "",
      };

      const res = await request(app)
        .post("/locations")
        .send(payload)
        .set({ access_token: userToken });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("message", "Please check in first");
    });
  });

  describe("POST /locations - Checkin User - Fail Test", () => {
    it("Should return a status of 500, a ISE message", async () => {
      jest.spyOn(UserLocation, "create").mockRejectedValue("Error");
      const payload = {
        longitude: "11111",
        latitude: "11111",
        cityName: "Jakarta",
      };

      const res = await request(app)
        .post("/locations")
        .send(payload)
        .set({ access_token: userToken });

      expect(res.status).toBe(500);
      expect(res.body).toHaveProperty("message", "Internal server error");
    });
  });
});

//LOCATION HISTORY
describe("GET /location-history - User's Location History", () => {
  describe("GET /location-history - User's Location History - Success Test", () => {
    it("Should return a status of 200", async () => {
      const res = await request(app)
        .get("/location-history")
        .set({ access_token: userToken });

      expect(res.status).toBe(200);
    });
  });

  describe("GET /location-history - User's Location History - Fail Test", () => {
    it("Should return a status of 500 and an ISE message", async () => {
      jest.spyOn(UserLocation, "findAll").mockRejectedValue("Error");
      const res = await request(app)
        .get("/location-history")
        .set({ access_token: userToken });

      expect(res.status).toBe(500);
      expect(res.body).toHaveProperty("message", "Internal server error");
    });
  });
});

//All Users Locations
describe("GET /locations - All Users Location History", () => {
  describe("GET /locations - All Users Location History - Success Test", () => {
    it("Should return a status of 200", async () => {
      const res = await request(app)
        .get("/locations")
        .set({ access_token: userToken });


        console.log(res.body, "<<<<<<last Locations");
      expect(res.status).toBe(200);
    });
  });

  
});
