const request = require("supertest");
const app = require("../App");
const { sequelize, OfficialLetter, User } = require("../models");
const { queryInterface } = sequelize;
const pass = require("../helpers/bcrypt");
const { signPayload } = require("../helpers/jwt");

const generateToken = () => {
  const jwtPayload = {
    id: 1,
    email: "heri@dinasq.com",
    role: "Super Admin",
  };

  const access_token = signPayload(jwtPayload);

  return access_token;
};

let dummyAdmin = null;
let adminToken = null;

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

  User.create(userData)
    .then((user) => {
      dummyAdmin = user.dataValues;
      adminToken = signPayload({
        id: dummyAdmin.id,
        email: dummyAdmin.email,
        role: dummyAdmin.role,
      });

      let data = [
        {
          UserId: "1",
          activityName: "Mengunjungi client project kalimantan",
          from: "Jakarta",
          to: "Pontianak",
          leaveDate: "19/08/2022",
          returnDate: "23/08/2022",
          status: "pending",
          updatedBy: "Windah Basudara",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          UserId: "1",
          activityName: "Menghadiri undangan dari lembaga industri",
          from: "Jakarta",
          to: "Surabaya",
          leaveDate: "20/08/2022",
          returnDate: "24/08/2022",
          status: "pending",
          updatedBy: "Windah Basudara",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      return queryInterface.bulkInsert("OfficialLetters", data);
    })
    .then(() => done())
    .catch((err) => {
      done(err);
      console.log(err);
    });
});

beforeEach(() => {
    jest.restoreAllMocks();
  });

afterAll((done) => {
  OfficialLetter.destroy({
    truncate: true,
    restartIdentity: true,
    cascade: true,
  })
    .then(() => {
      return User.destroy({
        truncate: true,
        restartIdentity: true,
        cascade: true,
      });
    })
    .then(() => {
      done();
    })
    .catch((err) => {
      done(err);
      console.log(err);
    });
});

//GET OFFICIAL LETTER BY ID
describe("GET /officialletters/:id", () => {
  describe("GET /officialletters/:id - Get One Official Letter by Id - Success Test", () => {
    it("Should return a status of 200 and an official letter", async () => {
    
      const res = await request(app)
        .get("/officialletters/1")
        .set({ access_token: adminToken});

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("id", 1);
    });
  });

  describe("GET /officialletters/:id - Get One Official Letter by Id - Fail Test", () => {
    it("Should return a 404 message", async () => {

      const res = await request(app)
        .post("/officialletters/1000")
        .set({ access_token : adminToken });

      expect(res.status).toBe(404);
    });
  });
});

//GET LOGGED IN USER'S OFFICIAL LETTERS
describe("GET /logged-in-letter", () => {
  describe("GET /logged-in-letter - Get Logged In User Official Letters - Success Test", () => {
    it("Should return a status of 200 and official letters", async () => {

      const res = await request(app)
        .get("/logged-in-letter")
        .set({ access_token: adminToken });

      expect(res.status).toBe(200);
    });
  });

  describe("GET /logged-in-letter - Get Logged In User Official Letters - Fail Test", () => {
    it("Should return a 400 message", async () => {

      const res = await request(app).post("/logged-in-letter");

      expect(res.status).toBe(400);
    });
  });
});

//CREATE OFFICIAL LETTER
describe("POST /officialletters", () => {
  describe("POST /officialletters - Create an official letter - Success Test", () => {
    it("Should return a status of 201", async () => {
      const data = {
        UserId: "1",
        activityName: "New Activity",
        from: "Jakarta",
        to: "Surabaya",
        leaveDate: "20/08/2022",
        returnDate: "24/08/2022",
        status: "pending",
        updatedBy: "Windah Basudara",
      };

      const res = await request(app)
        .post("/officialletters")
        .send(data)
        .set({ access_token: adminToken });

      expect(res.status).toBe(201);
    });
  });

  describe("POST /officialletters - Create an official letter - Fail Test", () => {
    it("Should return a 400 message", async () => {
      const data = {
        UserId: null,
        activityName: null,
        from: "Jakarta",
        to: "Surabaya",
        leaveDate: "20/08/2022",
        returnDate: "24/08/2022",
        status: "pending",
        updatedBy: "Windah Basudara",
      };

      const res = await request(app)
        .post("/officialletters")
        .send(data)
        .set({ access_token : adminToken });

      expect(res.status).toBe(400);
    });
  });
});

//UPDATE STATUS
describe("PATCH /officialletters/:id", () => {
  describe("PATCH /officialletters/:id - Update Official Letter Status - Success Test", () => {
    it("Should return a status of 201 and a success message", async () => {
      const data = {
        status: "OK",
      };

      const res = await request(app)
        .patch("/officialletters/1")
        .send(data)
        .set({ access_token : adminToken});

      expect(res.status).toBe(201);
    });
  });

  describe("PATCH /officialletters/:id - Update Official Letter Status - Fail Test", () => {
    it("Should return a status of 400 and a fail message", async () => {
      const data = {
        status: null,
      };

      const res = await request(app)
        .patch("/officialletters/1000")
        .send(data)
        .set({ access_token : adminToken });

      expect(res.status).toBe(404);
    });
  });
});

//GET ALL OFFICIAL LETTERS
describe("GET /officialletters", () => {
  describe("GET /officialletters - Get All Official Letters - Success Test", () => {
    it("Should return all official letters without pagination", async () => {

      const res = await request(app)
        .get("/officialletters")
        .set({ access_token : adminToken });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("totalOfficialLetters");
    });
  });

  describe("GET /officialletters - Get All Official Letters - Fail Test", () => {
    it("Should return a token error", async () => {
      jest.spyOn(OfficialLetter, "findAll").mockRejectedValue("Error");

      const res = await request(app)
        .get("/officialletters")
        .set({ access_token : adminToken });

        expect(res.status).toBe(500);
        expect(res.body).toHaveProperty("message", "Internal server error");
    });
  });
});
