const request = require("supertest");
const app = require("../App");
const { sequelize, User } = require("../models");
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

let dummyUser = null;
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

  let data = {
    firstName: "test",
    lastName: "Puter",
    role: "Super Admin",
    email: "test@dinasq.com",
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
      return User.create(data);
    })
    .then((user) => {
      dummyUser = user.dataValues;
      done();
    })
    .catch((err) => {
      done(err);
      console.log(err);
    });
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
    it("Should return a status of 401 and an unathorized message", async () => {
      let userData = {
        firstName: "Hermiyon",
        lastName: "Genjer",
        role: "Staff",
        email: "hermiyon@dinasq.com",
        password: "12341234",
        phoneNumber: "081212121212",
        address: "Jl. Hokwart No. 13",
        position: "Software Engineer",
      };
      await User.create(userData);

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
      let userData = {
        firstName: "Blake",
        lastName: "Lively",
        role: "Staff",
        email: "blake@dinasq.com",
        password: "12341234",
        phoneNumber: "081212121212",
        address: "Jl. Hokwart No. 13",
        position: "Software Engineer",
      };
      await User.create(userData);

      const payload = {
        email: "blake@dinasq.com",
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
      const access_token = generateToken();

      const res = await request(app).get("/users").set({ access_token });

      expect(res.status).toBe(200);
    });
  });
});

//GET ALL USERS DETAILS
describe("GET /usersdetails", () => {
  describe("GET /usersetails - Get All Users Details Data - Success Test", () => {
    it("Should return all users details", async () => {
      const access_token = generateToken();

      const res = await request(app).get("/usersdetails").set({ access_token });

      expect(res.status).toBe(200);
      expect(res.body[0]).toHaveProperty("OfficialLetters");
    });
  });
});

//GET ONE USER DETAILS
describe("GET /users/:id", () => {
  describe("GET /users/:id - Get One User Data - Success Test", () => {
    it("Should return a user data", async () => {
      const access_token = generateToken();

      const res = await request(app).get("/users/1").set({ access_token });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("id", 1);
      expect(res.body).toHaveProperty("firstName", "Heri");
      expect(res.body).toHaveProperty("OfficialLetters");
    });
  });
});

//GET LOGGED IN USER DETAILS
describe("GET /logged-in-user", () => {
  describe("GET /logged-in-user - Get Logged In User Data - Success Test", () => {
    it("Should return the logged in user data", async () => {
      const access_token = generateToken();

      const res = await request(app)
        .get("/logged-in-user")
        .set({ access_token });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("id", 1);
      expect(res.body).toHaveProperty("firstName", "Heri");
      expect(res.body).toHaveProperty("OfficialLetters");
    });
  });
});

//UPDATE USER DETAILS
describe("PUT /users/:id", () => {
  describe("PUT /users/:id - Update User Details - Success Test", () => {
    it("Should return a status of 200 and a success message", async () => {
      const access_token = generateToken();

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
        .put("/users/2")
        .send(payload)
        .set({ access_token });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty(
        "message",
        "Successfully updating user 2"
      );
    });
  });
});

//DELETE USER
describe("DELETE /users/:id", () => {
  describe("DELETE /users/:id - Delete a User - Success Test", () => {
    it("Should return a user data", async () => {
      const access_token = generateToken();

      console.log(adminToken, "<<<<< admin tkn")
      const res = await request(app)
        .delete("/users/" + dummyUser.id)
        .set({ access_token: adminToken });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('message', 'Successfully deleting user 2')
    });
  });
});

//CREATE NEW USER TEST
describe("POST /register - Create User", () => {
  describe("POST /register - Create User - Success Test", () => {
    it("Should return a status of 201 with a success message", async () => {
      const jwtPayload = {
        id: 1,
        email: "heri@dinasq.com",
        role: "Super Admin",
      };

      const access_token = signPayload(jwtPayload);

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
        .set({ access_token });
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty(
        "message",
        "Successfully creating new user"
      );
    });
  });

  describe("POST /register - fail test", () => {
    it('Should return a status of 400 and a message of "Email is Required"', async () => {
      const jwtPayload = {
        id: 1,
        email: "heri@dinasq.com",
        role: "Super Admin",
      };

      const access_token = signPayload(jwtPayload);

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
        .set({ access_token });
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("message", "Please insert email");
    });

    it('Should return a status 400 and a message of "Password is Required"', async () => {
      const jwtPayload = {
        id: 1,
        email: "heri@dinasq.com",
        role: "Super Admin",
      };

      const access_token = signPayload(jwtPayload);

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
        .set({ access_token });
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("message", "Please insert password");
    });

    it('Should return an object with status of 400 and a message "Please insert user phone number"', async () => {
      const jwtPayload = {
        id: 1,
        email: "heri@dinasq.com",
        role: "Super Admin",
      };

      const access_token = signPayload(jwtPayload);

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
        .set({ access_token });
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty(
        "message",
        "Please insert user phone number"
      );
    });

    it('Should return an object with status of 400 and a message "Please insert user address"', async () => {
      const jwtPayload = {
        id: 1,
        email: "heri@dinasq.com",
        role: "Super Admin",
      };

      const access_token = signPayload(jwtPayload);

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
        .set({ access_token });
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("message", "Please insert user address");
    });

    it('Should return an object with status of 400 and a message "Please insert user position"', async () => {
      const jwtPayload = {
        id: 1,
        email: "heri@dinasq.com",
        role: "Super Admin",
      };

      const access_token = signPayload(jwtPayload);

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
        .set({ access_token });
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("message", "Please insert user position");
    });
  });
});
