const request = require("supertest");
const app = require("../App");
const { sequelize, User } = require("../models");
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
      done();
    })
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

//LOGIN ADMIN TEST
describe("POST /login - Admin Login Test", () => {
  describe("POST /login - Admin Login - Success Test", () => {
    it("Should return a status of 200, a success message, and an access token", async () => {
      const payload = {
        email: "heri@dinasq.com",
        password: "12341234",
      };

      const res = await request(app).post("/login").send(payload);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("message", "Login success");
      expect(res.body).toHaveProperty("access_token");
    });
  });

  describe("POST /login - Admin Login - Fail Test", () => {
    it("Should return a status of 404 and a not found message", async () => {
      const payload = {
        email: "heri@dinasq.com",
        password: "1234123456",
      };

      const res = await request(app).post("/login").send(payload);

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty("message", "User not found");
    });

    it("Should return a status of 401 and an unathorized message", async () => {
      const payload = {
        email: "hermiyon@dinasq.com",
        password: "12341234",
      };

      const res = await request(app).post("/login").send(payload);

      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty(
        "message",
        "You are not eligible to sign in"
      );
    });
  });
});

//LOGIN ALL USERS TEST
describe("POST /login-all - All Users Login Test", () => {
  describe("POST /login-all - All Users Login - Success Test", () => {
    it("Should return a status of 200, a success message, and an access token", async () => {
      const payload = {
        email: "hermiyon@dinasq.com",
        password: "12341234",
      };

      const res = await request(app).post("/login-all").send(payload);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("message", "Login success");
      expect(res.body).toHaveProperty("access_token");
    });
  });
});

//GET ALL USERS
describe("GET /users", () => {
  describe("GET /users - Get All Users Data - Success Test", () => {
    it("Should return all users", async () => {
      const res = await request(app)
        .get("/users")
        .set({ access_token: adminToken });

      expect(res.status).toBe(200);
    });
  });
});

//GET ALL USERS DETAILS
describe("GET /usersdetails", () => {
  describe("GET /usersetails - Get All Users Details Data - Success Test", () => {
    it("Should return all users details", async () => {
      const res = await request(app)
        .get("/usersdetails")
        .set({ access_token: adminToken });

      expect(res.status).toBe(200);
      expect(res.body[0]).toHaveProperty("OfficialLetters");
    });
  });
});

//GET ONE USER DETAILS
describe("GET /users/:id", () => {
  describe("GET /users/:id - Get One User Data - Success Test", () => {
    it("Should return a user data", async () => {
      const res = await request(app)
        .get("/users/" + dummyUser.id)
        .set({ access_token: adminToken });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("id", 2);
      expect(res.body).toHaveProperty("firstName", "Hermiyon");
      expect(res.body).toHaveProperty("OfficialLetters");
    });
  });
});

//GET LOGGED IN USER DETAILS
describe("GET /logged-in-user", () => {
  describe("GET /logged-in-user - Get Logged In User Data - Success Test", () => {
    it("Should return the logged in user data", async () => {
      const res = await request(app)
        .get("/logged-in-user")
        .set({ access_token: adminToken });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("id", 1);
      expect(res.body).toHaveProperty("firstName", "Heri");
      expect(res.body).toHaveProperty("OfficialLetters");
    });
  });

  describe("GET /logged-in-user - Get Logged In User Data - Fail Test", () => {
    it("Should return a status of 500 and an ISE message", async () => {
        jest.spyOn(User, "findByPk").mockRejectedValue("Error");
        const res = await request(app)
        .get("/logged-in-user")
        .set({ access_token: adminToken });

        expect(res.status).toBe(500);
        expect(res.body).toHaveProperty("message", "Internal server error");
    });
  });
});

//UPDATE USER DETAILS
describe("PUT /users/:id", () => {
  describe("PUT /users/:id - Update User Details - Fail Test", () => {
    it("Should return a status of 500 and an ISE message", async () => {
      jest.spyOn(User, "update").mockRejectedValue("Error");
      const payload = {
        firstName: "Update",
        lastName: "Newton",
        role: "Super Admin",
        email: "newton@dinasq.com",
        password: "12341234",
        phoneNumber: "081212121212",
        address: "Jl. Cempaka No. 12",
        position: "Backend Engineer",
      };

      const res = await request(app)
        .put("/users/" + dummyUser.id)
        .send(payload)
        .set({ access_token: adminToken });

        expect(res.status).toBe(500);
        expect(res.body).toHaveProperty("message", "Internal server error");
    });
  });

  describe("PUT /users/:id - Update User Details - Success Test", () => {
    it("Should return a status of 200 and a success message", async () => {
      const payload = {
        firstName: "Update",
        lastName: "Newton",
        role: "Super Admin",
        email: "newton@dinasq.com",
        password: "12341234",
        phoneNumber: "081212121212",
        address: "Jl. Cempaka No. 12",
        position: "Backend Engineer",
      };

      const res = await request(app)
        .put("/users/" + dummyUser.id)
        .send(payload)
        .set({ access_token: adminToken });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty(
        "message",
        "Successfully updating user " + dummyUser.id
      );
    });
  });
});

//UPDATE PASSWORD FOR STAFF
describe("PATCH /users/:id", () => {
  describe("PATCH /users/:id - Update Staff User Password - Fail Test", () => {
    it("Should return a status of 500 and an ISE message", async () => {
      jest.spyOn(User, "update").mockRejectedValue("Error");
      const payload = {
        password: "6789067890",
      };

      const res = await request(app)
        .patch("/users")
        .send(payload)
        .set({ access_token: adminToken });

      expect(res.status).toBe(500);
      expect(res.body).toHaveProperty("message", "Internal server error");
    });
  });

  describe("PATCH /users/:id - Update Staff User Password - Success Test", () => {
    it("Should return a user data", async () => {
      const payload = {
        password: "6789067890",
      };

      const res = await request(app)
        .patch("/users")
        .send(payload)
        .set({ access_token: adminToken });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("message", "Password has been updated");
    });
  });
});

//DELETE USER
describe("DELETE /users/:id", () => {
  describe("DELETE /users/:id - Delete a User - Fail Test", () => {
    it("Should return a status of 500 and an ISE message", async () => {
      jest.spyOn(User, "destroy").mockRejectedValue("Error");

      const res = await request(app)
        .delete("/users/" + dummyUser.id)
        .set({ access_token: adminToken });

      expect(res.status).toBe(500);
      expect(res.body).toHaveProperty("message", "Internal server error");
    });
  });

  describe("DELETE /users/:id - Delete a User - Success Test", () => {
    it("Should return a status of 200 and a success message", async () => {
      const res = await request(app)
        .delete("/users/" + dummyUser.id)
        .set({ access_token: adminToken });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty(
        "message",
        "Successfully deleting user 2"
      );
    });
  });
});

//CREATE NEW USER TEST
describe("POST /register - Create User", () => {
  describe("POST /register - Create User - Success Test", () => {
    it("Should return a status of 201 with a success message", async () => {
      const payload = {
        firstName: "Budi",
        lastName: "Budiman",
        role: "Admin",
        email: "budi@dinasq.com",
        password: "12341234",
        phoneNumber: "081212121212",
        address: "Jl. Cempaka No. 12",
        position: "Software Engineer",
      };

      const res = await request(app)
        .post("/register")
        .send(payload)
        .set({ access_token: adminToken });
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty(
        "message",
        "Successfully creating new user"
      );
    });
  });

  describe("POST /register - fail test", () => {
    it('Should return a status of 400 and a message of "Email is Required"', async () => {
      const payload = {
        firstName: "Budi",
        lastName: "Budiman",
        role: "admin",
        email: null,
        password: "12341234",
        phoneNumber: "081212121212",
        address: "Jl. Cempaka No. 12",
        position: "Software Engineer",
      };

      const res = await request(app)
        .post("/register")
        .send(payload)
        .set({ access_token: adminToken });
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("message", "Please insert email");
    });

    it('Should return a status 400 and a message of "Password is Required"', async () => {
      const payload = {
        firstName: "Budi",
        lastName: "Budiman",
        role: "admin",
        email: "budi@dinasq.com",
        password: null,
        phoneNumber: "081212121212",
        address: "Jl. Cempaka No. 12",
        position: "Software Engineer",
      };

      const res = await request(app)
        .post("/register")
        .send(payload)
        .set({ access_token: adminToken });
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("message", "Please insert password");
    });

    it('Should return an object with status of 400 and a message "Please insert user phone number"', async () => {
      const payload = {
        firstName: "Budi",
        lastName: "Budiman",
        role: "admin",
        email: "budidinasq.com",
        password: "12341234",
        phoneNumber: null,
        address: "Jl. Cempaka No. 12",
        position: "Software Engineer",
      };

      const res = await request(app)
        .post("/register")
        .send(payload)
        .set({ access_token: adminToken });
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty(
        "message",
        "Please insert user phone number"
      );
    });

    it('Should return an object with status of 400 and a message "Please insert user address"', async () => {
      const payload = {
        firstName: "Budi",
        lastName: "Budiman",
        role: "admin",
        email: "budidinasq.com",
        password: "12341234",
        phoneNumber: "08080808",
        address: null,
        position: "Software Engineer",
      };

      const res = await request(app)
        .post("/register")
        .send(payload)
        .set({ access_token: adminToken });
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("message", "Please insert user address");
    });

    it('Should return an object with status of 400 and a message "Please insert user position"', async () => {
      const payload = {
        firstName: "Budi",
        lastName: "Budiman",
        role: "admin",
        email: "budidinasq.com",
        password: "12341234",
        phoneNumber: "08080808",
        address: "Jl. Cempaka No. 12",
        position: null,
      };

      const res = await request(app)
        .post("/register")
        .send(payload)
        .set({ access_token: adminToken });
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("message", "Please insert user position");
    });
  });
});
