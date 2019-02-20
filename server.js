var express = require('express'),
    logger = require('morgan'),
    app = express(),
    homepage = require('jade').compileFile(__dirname + '/source/templates/homepage.jade')
    aboutpage = require('jade').compileFile(__dirname + '/source/templates/about.jade')
    contactpage = require('jade').compileFile(__dirname + '/source/templates/contact.jade')

app.use(logger('dev'))
app.use(express.static(__dirname + '/static'))

app.get('/', function(req, res, next) {
    try {
        var html = homepage({ title: 'Home' })
        res.send(html)
    } catch (e) {
        next(e)
    }
})

app.get('/about', function(req, res, next) {
    try {
        var html = aboutpage({ title: 'About' })
        res.send(html)
    } catch (e) {
        next(e)
    }
})

app.get('/contact', function(req, res, next) {
    try {
        var html = contactpage({ title: 'Contact' })
        res.send(html)
    } catch (e) {
        next(e)
    }
})

app.listen(process.env.PORT || 3000, function() {
    console.log('Listening on http://localhost:' + (process.env.PORT || 3000))
})
