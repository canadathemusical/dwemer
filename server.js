var express = require('express'),
    logger = require('morgan'),
    app = express(),
    homepage = require('jade').compileFile(__dirname + '/source/templates/homepage.jade'),
    // aboutpage = require('jade').compileFile(__dirname + '/source/templates/about.jade'),
    contactpage = require('jade').compileFile(__dirname + '/source/templates/contact.jade'),
    contactfail = require('jade').compileFile(__dirname + '/source/templates/contactfail.jade'),
    contactsuccess = require('jade').compileFile(__dirname + '/source/templates/contactsuccess.jade')
var stylus = require("stylus");
var path = require("path");
var nodemailer = require('nodemailer');
var credentials = require('./emizzle.js');

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

app.use(logger('dev'));
app.use(express.static(__dirname + '/static'));

app.get('/', function(req, res, next) {
    try {
        var html = homepage({ title: 'Home' });
        res.send(html);
    } catch (e) {
        next(e);
    }
});

// app.get('/about', function(req, res, next) {
//     try {
//         var html = aboutpage({ title: 'About' });
//         res.send(html);
//     } catch (e) {
//         next(e);
//     }
// });

app.get('/contact', function(req, res, next) {
    try {
        var html = contactpage({ title: 'Contact' });
        res.send(html);
    } catch (e) {
        next(e);
    }
});

// POST route from contact form
app.post('/contact', function(req, res) {
    let smtpTrans, mailOpts;
    smtpTrans = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: credentials.email_user,
            pass: credentials.itsasecret
        }
    });
    mailOpts = {
        from: req.body.name + ' &lt;' + req.body.email + '&gt;',
        to: credentials.email_user,
        subject: 'New message from contact form at whatever fuck who cares',
        text: `${req.body.name}(${req.body.email}) says: ${req.body.message}`
    };
    smtpTrans.sendMail(mailOpts, function(error, response) {
        if (error) {
            console.log("Fail! You're a piece of shit...");
            console.log(error);
            try {
                var html = contactfail({ title: 'Contact Failure' });
                res.send(html);
            } catch (e) {
                next(e);
            }
        } else {
            console.log("success")
            try {
                var html = contactsuccess({ title: 'Contact Success' });
                res.send(html);
            } catch (e) {
                next(e);
            }
        }
    });
});

app.listen(process.env.PORT || 3000, function() {
    console.log('Listening on http://localhost:' + (process.env.PORT || 3000));
});
