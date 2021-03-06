const express = require('express')
const router = express.Router()
const Company = require('../models/company');
const employee = require('../models/employees');
const path = require('path');

router.get('/companiesPage', (req, res) => {
    Company.find({}, (err, companies) => {
        if (err) return res.status(500).json({ msg: "Server Error :)", err: err.message });
        res.render(path.join(__dirname, '../views', './index.ejs'), { companies })
    });
});

router.get('/all', (req, res) => {
    Company.find({}, (err, companies) => {
        if (err) return res.status(500).json({ msg: "Server Error :)", err: err.message });
        res.json(companies);
    });
});


router.get('/getallmanagers', (req, res) => {
    Company.find({}, (err, company) => {
        if (err) return res.status(500).json({ msg: "Server Error :)", err: err.message });
        employee.find({ manager: true }, { name: 1, lastName: 1, manager: 1, _id: 0 }).populate('company', 'name').exec((err, employees) => {
            if (err) return res.status(500).json({ msg: "Server Error :)", err: err.message })
            res.json({ employees })

        })
    })
});

router.get('/getallemployees/:id', (req, res) => {
    Company.findOne({ _id: req.params.id }, (err, company) => {
        const companyName = company
        if (err) return res.status(500).json({ msg: "Server Error :)", err: err.message });
        employee.find({ company: req.params.id }, (err, employees) => {
            if (err) return res.status(500).json({ msg: "Server Error :)", err: err.message })
            res.json({ employees })

        })
    })
});

router.get('/getmanager/:id', (req, res) => {
    Company.findOne({ _id: req.params.id }, (err, company) => {
        if (err) return res.status(500).json({ msg: "Server Error :)", err: err.message });
        employee.find({ company: company._id, manager: true }, { name: 1, lastName: 1, manager: 1, _id: 0 }, (err, employees) => {
            if (err) return res.status(500).json({ msg: "Server Error :)", err: err.message });
            res.json({ employees })

        })
    })
});

router.get('/age/:id', (req, res) => {
    const inputYear = Number(req.params.id);
    const year = new Date();
    const yearNow = year.getFullYear();
    const yearToCount = yearNow - inputYear;
    Company.find({
            dateOfCreation: { $gt: `${yearToCount }`, $lt: `${yearNow}` }
        },
        (err, company) => {
            if (err) return res.status(500).json({ msg: "Server Error :)", err: err.message });
            res.json(company)
        })
});


router.get('/:id', (req, res) => {
    Company.findOne({ _id: req.params.id }, (err, company) => {
        if (err) return res.status(500).json({ msg: "Server Error :)", err: err.message });
        employee.find({ company: company._id }, (err, employees) => {
            if (err) return res.status(500).json({ msg: "Server Error :)", err: err.message });
            res.render('companyInfo', { company, employees })

        })
    })
})

router.put('/', (req, res) => {
    if (!req.body.name) {
        return res.status(400).json({ msg: "Bad Request :)" })
    };


    Company.findOne({ name: req.body.name.trim() }, (err, existCompany) => {
        if (err) return res.status(500).json({ msg: "Server Error :)", err: err.message });
        if (existCompany) return res.status(406).json({ msg: "Exist Company Name :(" })

        const newCompany = new Company({
            name: req.body.name,
            creatId: req.body.creatId,
            number: req.body.number,
            city: req.body.city,
            province: req.body.province,
            dateOfCreation: req.body.dateOfCreation,
            number: req.body.number,


        });

        newCompany.save((err, company) => {
            if (err) return res.status(500).json({ msg: "Server Error :)", err: err.message });
            res.json(company);
        })
    })
});



router.get('/age/:id', (req, res, next) => {
    let search = req.params.id
    search = JSON.parse('{"' + search.replace(/&/g, '","').replace(/=/g, '":"') + '"}', function(key, value) { return key === "" ? value : decodeURIComponent(value) })
    console.log(search);
    if (search.to === '' || search.from === '') return res.redirect('/company/companiespage')
    Company.find({
            dateOfCreation: { $gt: search.from, $lt: search.to }
        },
        (err, companies) => {
            if (err) return res.status(500).json({ msg: "Server Error :)", err: err.message });

            res.render('date', { companies })

        });
});


router.post('/changecity', (req, res) => {
    const city = req.body.city
    Company.updateMany(({}, { $set: { city: `${city}`, province: `${city}` } }), (err, company) => {
        if (err) return res.status(500).json({ msg: "Server Error :)", err: err.message });
        res.json({ company, msg: "success" });
    })

});


router.post('/:id', (req, res) => {

    Company.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true }, (err, company) => {
        if (err) return res.status(500).json({ msg: "Server Error :)", err: err.message });
        res.json(company);
    })

});


router.delete('/:id', (req, res) => {
    Company.findOne({ _id: req.params.id }, (err, company) => {
        if (err) return res.status(500).json({ msg: "Server Error :)", err: err.message });
        if (!company) return res.status(404).json({ msg: "Not Found!" })
        company.deleteOne((err, company) => {
            if (err) return res.status(500).json({ msg: "Server Error :)", err: err.message });

            employee.deleteMany({ company: company._id }, err => {
                if (err) return res.status(500).json({ msg: "Server Error :)", err: err.message });

                Company.find({}, (err, companies) => {
                    if (err) return res.status(500).json({ msg: "Server Error :)", err: err.message });
                    res.render('index', { companies })
                })
            })
        });

    })
});
module.exports = router