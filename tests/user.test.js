const request = require('supertest');
const app = require('../App');
const { sequelize, Location, OfficialLetter, Reimbursement, User, UserLocation } = require('../models');
const { queryInterface } = sequelize
const pass = require('../helpers/bcrypt')
const jwt = require('../helpers/jwt');

afterAll((done) => {
    User.destroy({ truncate: true, restartIdentity: true, cascade: true })
})

//CREATE NEW USER TEST
describe('POST /admin/register - Create User', () => {
    describe('POST /admin/register - Create User - Success Test', () => {
        it('Should return a status of 201 with a success message', async () => {
            const payload = {
                firstName: 'Budi',
                lastName: 'Budiman',
                role: 'admin',
                email: 'budi@dinasq.com',
                password: '12341234',
                phoneNumber: '081212121212',
                address: 'Jl. Cempaka No. 12',
                position: 'Software Engineer'
            }

            const res = await request(app).post('/admin/register').send(payload)
            expect(res.status).toBe(201)
            expect(res.body).toHaveProperty('message', 'New User Successfully Created')
        })
    })

    describe('POST /admin/register - fail test', () => {
        it('Should return a status of 400 and a message of "Email is Required"', async ()=> {
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

            const res = await request(app).post('/admin/register').send(payload)
            expect(res.status).toBe(400)
            expect(res.body).toHaveProperty('message', 'Email is required')
        })

        it('Should return a status 400 and a message of "Password is Required"', async ()=> {
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

            const res = await request(app).post('/admin/register').send(payload)
            expect(res.status).toBe(400)
            expect(res.body).toHaveProperty('message', 'Password is required')
        })

        it('Should return an object with status of 400 and a message "Validation error: Input a valid email address!"', async ()=> {
            const payload = {
                firstName: 'Budi',
                lastName: 'Budiman',
                role: 'admin',
                email: 'budidinasq.com',
                password: '12341234',
                phoneNumber: '081212121212',
                address: 'Jl. Cempaka No. 12',
                position: 'Software Engineer'
            }

            const res = await request(app).post('/pub/register').send(payload)
            expect(res.status).toBe(400)
            expect(res.body).toHaveProperty('message', 'Validation error: Input a valid email address!')
        })

        it('Should return an object with status of 400 and a message "Validation error: Min. 5 characters"', async ()=> {
            const payload = {
                firstName: 'Budi',
                lastName: 'Budiman',
                role: 'admin',
                email: 'budidinasq.com',
                password: '1234',
                phoneNumber: '081212121212',
                address: 'Jl. Cempaka No. 12',
                position: 'Software Engineer'
            }

            const res = await request(app).post('/admin/register').send(payload)
            expect(res.status).toBe(400)
            expect(res.body).toHaveProperty('message', 'Validation error: Min. 5 characters')
        })

        it('Should return an object with status of 400 and a message of "Email is Already Taken"', async () => {
            const payload = {
                //PAYLOAD
            }

            const res = await request(app).post('/pub/register').send(payload)
            expect(res.status).toBe(400)
            expect(res.body).toHaveProperty('message', 'Email is Already Taken')
        })
       
    })
})
