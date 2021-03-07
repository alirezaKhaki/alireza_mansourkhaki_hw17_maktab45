const express = require('express')
const mongoose = require('mongoose')
const app = express()
const path = require('path')

const company = require('./routes/company')
const employees = require('./routes/employees')

mongoose.set('useFindAndModify', false);
mongoose.connect('mongodb://localhost:27017/companyDatabases2', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})


app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/company', company)
app.use('/employees', employees)


app.listen(5000, () => {
    console.log("server up and runnig on port 5000");
})