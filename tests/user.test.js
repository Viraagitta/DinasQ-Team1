const request = require('supertest');
const app = require('../App');
const { sequelize, Location, OfficialLetter, Reimbursement, User, UserLocation } = require('../models');
const { queryInterface } = sequelize
const pass = require('../helpers/bcrypt')
const jwt = require('../helpers/jwt');

// afterAll((done) => {
//     User.destroy({ truncate: true, restartIdentity: true, cascade: true })
// })

//CREATE NEW USER TEST
describe('POST /admin/register - Create User', () => {
    describe('POST /admin/register - Create User - Success Test', () => {
        it('Should return a status pf 201 with a success message', async () => {
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
})
console.log('jalan')