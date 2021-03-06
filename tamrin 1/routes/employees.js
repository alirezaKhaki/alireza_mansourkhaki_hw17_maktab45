const express = require('express')
const router = express.Router()
const employees = require('../models/employees');
const company = require('../models/company');

router.get('/employeesPage', (req, res) => {
    employees.find({}, (err, employee) => {
        if (err) return res.status(500).json({ msg: "Server Error :)", err: err.message });
        res.render('employee', { employee })
    });
});

router.get('/all', (req, res) => {
    employees.find({}, (err, employee) => {
        if (err) return res.status(500).json({ msg: "Server Error :)", err: err.message });
        res.json(employee);
    });
});

router.get('/20-30', (req, res) => {
    const date = new Date();
    const yearNow = date.getFullYear();
    const thirty = yearNow - 30;
    const twenty = yearNow - 20;
    employees.find({ birthDate: { $gt: `${thirty}`, $lt: `${twenty}` } }, { _id: false }, (err, employee) => {
        if (err) return res.status(500).json({ msg: "Server Error :)", err: err.message });
        res.json(employee);
    });
});

router.get('/managers', (req, res) => {

    employees.find({ manager: true }, (err, employee) => {
        if (err) return res.status(500).json({ msg: "Server Error :)", err: err.message });
        res.json(employee);
    });
});

router.get('/:id', (req, res) => {
    employees.findOne({ _id: req.params.id }, (err, employee) => {
        if (err) return res.status(500).json({ msg: "Server Error :)", err: err.message });
        res.json(employee);
    })
});

router.put('/', (req, res) => {

    if (!req.body.name || !req.body.company) {
        return res.status(400).json({ msg: "Bad Request :)" })
    };
    if (req.body.manager === true) {
        employees.find({ manager: true, company: req.body.company }, (err, employee) => {
            if (err) return res.status(500).json({ msg: "Server Error :)", err: err.message });
            if (employee.length > 0) {
                return res.json({ msg: "each company has only one manager" })
            } else {
                company.findById(req.body.company, (err, company) => {
                    if (err) return res.status(500).json({ msg: "Server Error :)", err: err.message });
                    if (!company) return res.status(404).json({ msg: "Not Found :)" })

                    const newemployee = new employees({
                        name: req.body.name,
                        lastName: req.body.lastName,
                        gender: req.body.gender,
                        manager: req.body.manager,
                        socialId: req.body.socialId,
                        birthDate: req.body.birthDate,
                        company: company._id
                    });

                    newemployee.save((err, employee) => {
                        if (err) return res.status(500).json({ msg: "Server Error :)", err: err.message });
                        res.json(employee)
                    })
                });
            }
        })
    } else {
        company.findById(req.body.company, (err, company) => {
            if (err) return res.status(500).json({ msg: "Server Error :)", err: err.message });
            if (!company) return res.status(404).json({ msg: "Not Found :)" })

            const newemployee = new employees({
                name: req.body.name,
                lastName: req.body.lastName,
                gender: req.body.gender,
                manager: req.body.manager,
                socialId: req.body.socialId,
                birthDate: req.body.birthDate,
                company: company._id
            });

            newemployee.save((err, employee) => {
                if (err) return res.status(500).json({ msg: "Server Error :)", err: err.message });
                res.json(employee)
            })
        });
    }

});

router.post('/:id', (req, res) => {
    if (req.body.manager == "true" || req.body.manager === true) {
        employees.findOne({ _id: req.params.id }, (err, employee) => {
            if (err) return res.status(500).json({ msg: "Server Error :)", err: err.message });
            const emp = employee
            employees.findOne({ company: emp.company, manager: true }, (err, emps) => {
                if (err) return res.status(500).json({ msg: "Server Error :)", err: err.message });
                if (emps) return res.status(400).send('each company has only one manager!')
                if (employee.length > 0) return res.json({ msg: "each company has only one manager" })
                employees.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true }, (err, employee) => {
                    if (err) return res.status(500).json({ msg: "Server Error :)", err: err.message });
                    res.json(employee);
                })
            })
        })
    } else {
        employees.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true }, (err, employee) => {
            if (err) return res.status(500).json({ msg: "Server Error :)", err: err.message });
            res.json(employee);
        })
    }
});

router.delete('/:id', (req, res) => {
    employees.findOneAndDelete({ _id: req.params.id }, (err, employee) => {
        if (err) return res.status(500).json({ msg: "Server Error :)", err: err.message });
        res.json({ employee, msg: "success" });
    })
});



module.exports = router