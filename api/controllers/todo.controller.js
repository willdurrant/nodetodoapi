'use strict';

var mongoose = require('mongoose'),
    Todo = mongoose.model('Todo');

var getErrorMessage = function(err) {
  if (err.errors) {
    for (var errName in err.errors) {
      if (err.errors[errName].message) return err.errors[errName].message;
    }
  } else {
    return 'Unknown server error';
  }
};

module.exports = {
  hello: hello,
  findTodo: findTodo,
  listTodos: listTodos,
  createTodo: createTodo,
  updateTodo: updateTodo,
  deleteTodo: deleteTodo
};

function hello(req, res) {
  // variables defined in the Swagger document can be referenced using req.swagger.params.{parameter_name}
  var name = req.swagger.params.name.value || 'stranger';
  //var hello = util.format('Hello, %s!', name);

  var hello = {"message":"some message", "age":7};


  // this sends back a JSON response which is a single string
  res.json(hello);
}

function listTodos(req, res) {

  var queryObj = {};
  var creator = req.swagger.params.creator.value;
  console.log('listTodos called... ' + creator);
  if (creator != undefined){
    queryObj.creator = creator;
  } else {
    return res.status(400).send({
      message: 'missing creator id for retrieving list of todos'
    });
  }

  //for Tag base searches
  if (req.swagger.params.tag != undefined && req.swagger.params.tag.value){
    var tags = req.swagger.params.tag.value;
    console.log('Weve got tags... : ' + JSON.stringify(tags));

    //check if we're dealing with an array
    if( Object.prototype.toString.call( tags ) === '[object Array]' ) { //eg. tag=Shopping&tag=Home
      queryObj.tag = {$in: tags};
      console.log('Weve got array of tags... : ' + JSON.stringify(queryObj.tag))
    } else if (tags.split(',').length > 0) { //eg. tag=Shopping%2CHome
      queryObj.tag = {$in: tags.split(',')};
      console.log('Weve got array of tags... : ' + JSON.stringify(queryObj.tag))
    } else {
      queryObj.tag = { $regex : new RegExp(tags, "i") };
    }
  }

  console.log('listTodos called queryObj... ' + JSON.stringify(queryObj));

  Todo.find(queryObj).sort({'priority.priority': -1}).populate('creator', 'name username').exec(function(err, todos) {
    if (err) {
      console.log('err listTodos called... ' + err);

      return res.status(400).send({
        message: getErrorMessage(err)
      });
    } else {
      console.log('Got some todos');
      res.json(todos);
    }
  });

}

function findTodo(req, res) {
  var id = req.swagger.params.id.value;
  Todo.findById(id).populate('creator', 'name username').exec(function(err, todo) {
    if (err)
      return next(err);

    if (!todo)
      return next(new Error('Failed to load todo ' + id));

    req.todo = todo;
    next();
  });

}

function createTodo(req, res) {
  var todo = req.swagger.params.body.value;
  res.json(todo);
}

function updateTodo(req, res) {
  var todo = req.swagger.params.body.value;
  todo.title = req.body.title;
  todo.tag = req.body.tag;
  todo.comment = req.body.comment;
  todo.completed = req.body.completed;
  todo.status = req.body.status;
  todo.priority = req.body.priority;
  todo.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: getErrorMessage(err)
      });
    } else {
      res.json(todo);
    }
  });
}

function deleteTodo(req, res) {
  var id = req.swagger.params.id.value;
  console.log('deleteTodo called for id ' + id);
  Todo.findByIdAndRemove(id, function(err) {
    if (err) {
      return res.status(400).send({
        message: getErrorMessage(err)
      });
    } else {
      var msg = {"message":"Todo successfully deleted"};
      // this sends back a JSON response which is a single string
      res.json(msg);
    }
  });
};