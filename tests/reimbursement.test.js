const request = require("supertest");
const app = require("../App");
const {
  sequelize,
  Location,
  OfficialLetter,
  Reimbursement,
  User,
  UserLocation,
} = require("../models");
const { queryInterface } = sequelize;
const pass = require("../helpers/bcrypt");
const { signPayload } = require("../helpers/jwt");

let dummyUser = null;
let dummyAdmin = null;
let adminToken = null;
let userToken = null;

let dummyOfficialLetter = null

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

      let data = 
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
        }
      ;

      return OfficialLetter.create(data);
    })
    .then((officialLetter) => {
      dummyOfficialLetter = officialLetter.dataValues;

      let data = [
        {
          OfficialLetterId: "1",
          description: "Hotel 1 malam di pontianak",
          cost: 250000,
          image:
            "https://nugrohofebianto.com/wp-content/uploads/2022/01/Hotel-Merpati-Kota-Pontianak-1024x768.jpg",
          category: "Accomodation",
          status: "pending",
          updatedBy: "-",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          OfficialLetterId: "1",
          description: "Homestay 2 malam di Pekanbaru",
          cost: 550000,
          image:
            "https://nugrohofebianto.com/wp-content/uploads/2022/01/Hotel-Merpati-Kota-Pontianak-1024x768.jpg",
          category: "Accomodation",
          status: "pending",
          updatedBy: "-",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      return queryInterface.bulkInsert("Reimbursements", data);
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

//GET REIMBUSEMENT BY ID
describe("GET /reimbursements/:id", () => {
  describe("GET /reimbursements/:id - Get one Reimbursements by Reimbursement ID - Success Test", () => {
    it("Should return a status of 200 and a reimbursement", async () => {

      const res = await request(app)
        .get("/reimbursements/2")
        .set({ access_token: adminToken });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("id", 2);
    });
  });

  describe("GET /reimbursements/:id - Get one Reimbursements by Reimbursement ID - Fail Test", () => {
    it("Should return a status of 500", async () => {
      jest.spyOn(Reimbursement, "findByPk").mockRejectedValue("Error");
      const res = await request(app)
        .get("/reimbursements/2")
        .set({ access_token : adminToken });

        expect(res.status).toBe(500);
        expect(res.body).toHaveProperty("message", "Internal server error");
    });
  });
  
});

describe("GET /reimbursements/:id", () => {
  describe("GET /reimbursements/:id - Get one Reimbursements by Reimbursement ID - Success Test", () => {
    it("Should return a status of 200 and a reimbursement", async () => {

      const res = await request(app)
        .get("/reimbursements/2")
        .set({ access_token: adminToken });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("id", 2);
    });
  });
  
});

//GET REIMBURSEMENT FROM LETTER 
describe("GET /reimburse-letter/:OfficialLetterId - Get Reimbursements by Official Letter ID - Success Test", () => {
  it("Should return a status of 200", async () => {
    const res = await request(app)
      .get("/reimburse-letter/" + dummyOfficialLetter.id)
      .set({ access_token : adminToken });

      expect(res.status).toBe(200);
      expect(res.body[0]).toHaveProperty('OfficialLetterId', dummyOfficialLetter.id)
  });

  describe("GET /reimburse-letter/:OfficialLetterId - Get Reimbursements by Official Letter ID - Fail Test", () => {
    it("Should return a status of 500", async () => {
      jest.spyOn(Reimbursement, "findAll").mockRejectedValue("Error");
      const res = await request(app)
        .get("/reimburse-letter/"+dummyOfficialLetter.id)
        .set({ access_token : adminToken });

        expect(res.status).toBe(500);
        expect(res.body).toHaveProperty("message", "Internal server error");
    });
  });
});

//CREATE NEW REIMBURSEMENT
describe("POST /reimbursements - Create New Reimbursement - Success Test", () => {
  it("Should return a status of 201", async () => {
    let data = {
      OfficialLetterId: "1",
      description: "New Reimbursement",
      cost: 250000,
      image:
        "https://nugrohofebianto.com/wp-content/uploads/2022/01/Hotel-Merpati-Kota-Pontianak-1024x768.jpg",
      category: "Transportation",
      status: "pending",
      updatedBy: "-",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const res = await request(app)
      .post("/reimbursements")
      .send(data)
      .set({ access_token : adminToken });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('message', 'Successfully requesting a new reimbursement')
  });

  describe("POST /reimbursements - Create New Reimbursement - Fail Test", () => {
    it("Should return a status of 500", async () => {
      jest.spyOn(Reimbursement, "create").mockRejectedValue("Error");
      let data = {
        OfficialLetterId: "1",
        description: "New Reimbursement",
        cost: 250000,
        image:
          "https://nugrohofebianto.com/wp-content/uploads/2022/01/Hotel-Merpati-Kota-Pontianak-1024x768.jpg",
        category: "Transportation",
        status: "pending",
        updatedBy: "-",
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      const res = await request(app)
        .post("/reimbursements")
        .send(data)
        .set({ access_token : adminToken });

        expect(res.status).toBe(500);
        expect(res.body).toHaveProperty("message", "Internal server error");
    });
  });
});

//UPDATE REIMBURSEMENT STATUS
describe("PATCH /reimbursements/:id - Update Reimbursement Status - Success Test", () => {
  it("Should return a status of 201", async () => {
    let data = {
      status: "OK",
    };

    const res = await request(app)
      .patch("/reimbursements/1")
      .send(data)
      .set({ access_token: adminToken });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('message', 'Reimbursement status id 1 has been updated to OK')
  });
});

//GET REIMBURSEMENT PDF
describe("GET reimbursements/pdf/:id - Get Reimbursement PDF - Success Test", () => {
  it("Should return a status of 200", async () => {

    const res = await request(app)
      .get("/reimbursements/pdf/1")
      .set({ access_token: adminToken });

    expect(res.status).toBe(200);
  });
});

//GET ALL REIMBURSEMENTS
describe("GET /reimbursements", () => {
  describe("GET /reimbursements - Get All Reimbursements - Success Test", () => {
    it("Should return all reimbursements without pagination", async () => {
      const res = await request(app)
        .get("/reimbursements")
        .set({ access_token: adminToken });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("totalPages", null);
    });
  });

  describe("GET /reimbursements - Get All Reimbursements - Fail Test", () => {
    it("Should return a status of 500 and an ISE message", async () => {
      jest.spyOn(Reimbursement, "findAll").mockRejectedValue("Error");
      const res = await request(app)
        .get("/reimbursements")
        .set({ access_token: adminToken });

        expect(res.status).toBe(500);
        expect(res.body).toHaveProperty("message", "Internal server error");
    });
  });
});
