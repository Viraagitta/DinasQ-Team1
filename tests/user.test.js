const request = require('supertest');
const app = require('../App');
const { sequelize, Location, OfficialLetters, Reimbursement, User, UserLocation } = require('../models');
const { queryInterface } = sequelize


console.log('jalan')