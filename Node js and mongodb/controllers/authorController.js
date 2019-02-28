const express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const author = mongoose.model('author');

router.get('/', (req, res) => {
    res.render("author/addOrEdit", {
        viewTitle: "Insert author"
    });
});

router.post('/', (req, res) => {
    if (req.body._id == '')
        insertRecord(req, res);
        else
        updateRecord(req, res);
});


function insertRecord(req, res) {
    var authors = new author();
    authors.fullName = req.body.fullName;
    authors.email = req.body.email;
    authors.mobile = req.body.mobile;
    authors.Article = req.body.Article;
    authors.save((err, doc) => {
        if (!err)
            res.redirect('authors/list');
        else {
            if (err.name == 'ValidationError') {
                handleValidationError(err, req.body);
                res.render("author/addOrEdit", {
                    viewTitle: "Insert author",
                    authors: req.body
                });
            }
            else
                console.log('Error during record insertion : ' + err);
        }
    });
}

function updateRecord(req, res) {
    authors.findOneAndUpdate({ _id: req.body._id }, req.body, { new: true }, (err, doc) => {
        if (!err) { res.redirect('author/list'); }
        else {
            if (err.name == 'ValidationError') {
                handleValidationError(err, req.body);
                res.render("author/addOrEdit", {
                    viewTitle: 'Update author',
                    authors: req.body
                });
            }
            else
                console.log('Error during record update : ' + err);
        }
    });
}


router.get('/list', (req, res) => {
    author.find((err, docs) => {
        if (!err) {
            res.render("author/list", {
                list: docs
            });
        }
        else {
            console.log('Error in retrieving author list :' + err);
        }
    });
});


function handleValidationError(err, body) {
    for (field in err.errors) {
        switch (err.errors[field].path) {
            case 'fullName':
                body['fullNameError'] = err.errors[field].message;
                break;
            case 'email':
                body['emailError'] = err.errors[field].message;
                break;
            default:
                break;
        }
    }
}

router.get('/:id', (req, res) => {
    author.findById(req.params.id, (err, doc) => {
        if (!err) {
            res.render("author/addOrEdit", {
                viewTitle: "Update author",
                authors: doc
            });
        }
    });
});

router.get('/delete/:id', (req, res) => {
    author.findByIdAndRemove(req.params.id, (err, doc) => {
        if (!err) {
            res.redirect('/author/list');
        }
        else { console.log('Error in author delete :' + err); }
    });
});

module.exports = router;