const express = require("express")
const app = express()
const mongoose = require('mongoose');
const path = require('path');

const company = require('./routes/company')
const employees = require('./routes/employees')

mongoose.set('useFindAndModify', false);
mongoose.connect(
    'mongodb://localhost:27017/companyDatabases2', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
);


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));


app.get('/', (req, res) => {
    res.send(path.join(__dirname, './public', 'index.html'))
})
app.use('/company', company)
app.use('/employees', employees)


app.listen(5000, () => {
    console.log("server up and runnig on port 5000");
})