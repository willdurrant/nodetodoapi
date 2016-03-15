var mongoose = require('mongoose'),
    Todo = mongoose.model('Todo'),
    helper = require('./../helpers/helper');


module.exports = {
    listTags: listTags
};

function listTags(req, res) {
    helper.validateToken(req, res);
    console.log('Tags Controller list called...');
    var creator = req.swagger.params.creator.value;

    var queryObj = {};
    if (creator != undefined) {
        //userId = req.user.id;
        queryObj.creator = creator;
    } else {
        return res.status(400).send({
            message: 'missing user/creator id for retrieving list of todos'
        });
    }

    Todo.find(queryObj).distinct('tag').populate('creator', 'name username').exec(function (err, todos) {
        if (err) {
            return res.status(400).send({
                message: helper.getErrorMessage(err)
            });
        } else {
            res.json(todos);
        }
    });
};