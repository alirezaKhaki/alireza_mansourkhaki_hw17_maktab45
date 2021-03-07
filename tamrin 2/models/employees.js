const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Company = require('./company')

const employeesSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    company: {
        type: Schema.Types.ObjectId,
        ref: "Company",
        required: true
    },
    socialId: {
        type: Number,
        required: true,
    },
    gender: {
        type: String,
        defult: "male",
    },
    birthDate: {
        type: Date,
        requireD: true
    },
    manager: {
        type: Boolean,
        required: true,
    },
    CreatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('employees', employeesSchema);