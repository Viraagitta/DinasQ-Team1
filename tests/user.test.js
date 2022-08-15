const request = require('supertest');
const app = require('../App');
const { sequelize, User } = require('../models');
const { queryInterface } = sequelize
const pass = require('../helpers/bcrypt')
const { signPayload } = require("../helpers/jwt");

beforeAll((done) => {
    let userData =
    {
        firstName: 'Heri',
        lastName: 'Puter',
        role: 'Super Admin',
        email: 'heri@dinasq.com',
        password: '12341234',
        phoneNumber: '081212121212',
        address: 'Jl. Hokwart No. 13',
        position: 'Software Engineer'
    }

     User.create(userData)
    .then(() => {done()})
    .catch(err => {
        done(err)
        console.log(err)})
})

afterAll((done) => {
    User.destroy({ truncate: true, restartIdentity: true, cascade: true })
        .then(() => {
            done()
        })
        .catch(err => {
            done(err)
            console.log(err)})
})

//LOGIN USER TEST
describe('POST /login - Admin Login Test', () => {
    describe('POST /login - Admin Login - Success Test', () => {
        it('Should return a status of 200, a success message, and an access token', async () => {
            const payload = {
                email: 'heri@dinasq.com',
                password: '12341234'
            }

            const res = await request(app).post('/login').send(payload)
            
            expect(res.status).toBe(200)
            expect(res.body).toHaveProperty('message', "Login success")
            expect(res.body).toHaveProperty('access_token')
        })
    })
})

//CREATE NEW USER TEST
describe('POST /register - Create User', () => {
    describe('POST /register - Create User - Success Test', () => {
        it('Should return a status of 201 with a success message', async () => {
            const jwtPayload = {
                id: 1,
                email: 'heri@dinasq.com',
                role: 'Super Admin',
            }

            const access_token = signPayload(jwtPayload);

            const payload = {
                firstName: 'Budi',
                lastName: 'Budiman',
                role: 'Admin',
                email: 'budi@dinasq.com',
                password: '12341234',
                phoneNumber: '081212121212',
                address: 'Jl. Cempaka No. 12',
                position: 'Software Engineer'
            }

            const res = await request(app).post('/register').send(payload).set({access_token})
            expect(res.status).toBe(201)
            expect(res.body).toHaveProperty('message', 'Successfully creating new user')
        })
    })

    describe('POST /register - fail test', () => {
        it('Should return a status of 400 and a message of "Email is Required"', async () => {
            const jwtPayload = {
                id: 1,
                email: 'heri@dinasq.com',
                role: 'Super Admin',
            }

            const access_token = signPayload(jwtPayload);

            const payload = {
                firstName: 'Budi',
                lastName: 'Budiman',
                role: 'admin',
                email: null,
                password: '12341234',
                phoneNumber: '081212121212',
                address: 'Jl. Cempaka No. 12',
                position: 'Software Engineer'
            }

            const res = await request(app).post('/register').send(payload).set({access_token})
            expect(res.status).toBe(400)
            expect(res.body).toHaveProperty('message', 'Please insert email')
        })

        it('Should return a status 400 and a message of "Password is Required"', async () => {
            const jwtPayload = {
                id: 1,
                email: 'heri@dinasq.com',
                role: 'Super Admin',
            }

            const access_token = signPayload(jwtPayload);

            const payload = {
                firstName: 'Budi',
                lastName: 'Budiman',
                role: 'admin',
                email: 'budi@dinasq.com',
                password: null,
                phoneNumber: '081212121212',
                address: 'Jl. Cempaka No. 12',
                position: 'Software Engineer'
            }

            const res = await request(app).post('/register').send(payload).set({access_token})
            expect(res.status).toBe(400)
            expect(res.body).toHaveProperty('message', 'Please insert password')
        })

        it('Should return an object with status of 400 and a message "Please insert user phone number"', async () => {
            const jwtPayload = {
                id: 1,
                email: 'heri@dinasq.com',
                role: 'Super Admin',
            }

            const access_token = signPayload(jwtPayload);

            const payload = {
                firstName: 'Budi',
                lastName: 'Budiman',
                role: 'admin',
                email: 'budidinasq.com',
                password: '12341234',
                phoneNumber: null,
                address: 'Jl. Cempaka No. 12',
                position: 'Software Engineer'
            }

            const res = await request(app).post('/register').send(payload).set({access_token})
            expect(res.status).toBe(400)
            expect(res.body).toHaveProperty('message', 'Please insert user phone number')
        })

        it('Should return an object with status of 400 and a message "Please insert user address"', async () => {
            const jwtPayload = {
                id: 1,
                email: 'heri@dinasq.com',
                role: 'Super Admin',
            }

            const access_token = signPayload(jwtPayload);

            const payload = {
                firstName: 'Budi',
                lastName: 'Budiman',
                role: 'admin',
                email: 'budidinasq.com',
                password: '12341234',
                phoneNumber: '08080808',
                address: null,
                position: 'Software Engineer'
            }

            const res = await request(app).post('/register').send(payload).set({access_token})
            expect(res.status).toBe(400)
            expect(res.body).toHaveProperty('message', 'Please insert user address')
        })

        it('Should return an object with status of 400 and a message "Please insert user position"', async () => {
            const jwtPayload = {
                id: 1,
                email: 'heri@dinasq.com',
                role: 'Super Admin',
            }

            const access_token = signPayload(jwtPayload);

            const payload = {
                firstName: 'Budi',
                lastName: 'Budiman',
                role: 'admin',
                email: 'budidinasq.com',
                password: '12341234',
                phoneNumber: '08080808',
                address: 'Jl. Cempaka No. 12',
                position: null
            }

            const res = await request(app).post('/register').send(payload).set({access_token})
            expect(res.status).toBe(400)
            expect(res.body).toHaveProperty('message', 'Please insert user position')
        })
       
    })
})
