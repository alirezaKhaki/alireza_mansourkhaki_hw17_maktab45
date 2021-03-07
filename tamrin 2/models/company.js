const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const employees = require('./employees')

const CompanySchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 30
    },
    creatId: {
        type: Number,
        required: true,
    },

    city: {
        type: String,
        trim: true
    },
    province: {
        type: String,
        trim: true
    },
    number: {
        type: Number,
    },
    dateOfCreation: {
        type: Date
    },

}, {
    timestamps: true
});

module.exports = mongoose.model('Company', CompanySchema);