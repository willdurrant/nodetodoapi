'use strict';

var mongoose = require('mongoose'),
    Todo = mongoose.model('Todo'),
    util = require('util'),
    helper = require('./../helpers/helper');


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
  var hello = util.format('Hello, %s!', name);
  // this sends back a JSON response which is a single string
  console.log('HELLO ' + JSON.stringify(hello, null , 2));

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
        message: helper.getErrorMessage(err)
      });
    } else {
      console.log('Got some todos');
      res.json(todos);
    }
  });

}

function findTodo(req, res) {
  console.log('findTodo called...');
  var id = req.swagger.params.id.value;
  Todo.findById(id).populate('creator', 'name username').exec(function(err, retrievedTodo) {
    if (err) {
      return res.status(400).send({
        message: helper.getErrorMessage(err)
      });
    } else {
      res.json(retrievedTodo);
    }
  });

}

function createTodo(req, res) {
  var todo = new Todo(req.swagger.params.body.value);
  console.log('save : ' + todo.title + ' by creator ' + todo.creator);
  if(todo.creator === undefined){
    return res.status(400).send({
      message: 'No creator found for new Todo'
    });
  }
  todo.save(function(err, persistedTodo) {
    if (err) {
      return res.status(400).send({
        message: helper.getErrorMessage(err)
      });
    } else {

      //Should be a way to populate a object reference without doing another query but for the swagger validation
      //the creator needs populating
      Todo.findById(persistedTodo._id).populate('creator', 'name username').exec(function(err, retrievedTodo) {
        if (err) {
          return res.status(400).send({
            message: helper.getErrorMessage(err)
          });
        } else {
          res.json(retrievedTodo);
        }
      });
    }
  });


}

function updateTodo(req, res) {
  var todo = new Todo(req.swagger.params.body.value);
  //console.log('updateTodo called with updated Todo : ' + JSON.stringify(todo, null, 2));
  todo.isNew = false;
  todo.save(function(err, updatedTodo) {
    if (err) {
      console.log('err got ' + err);
      return res.status(400).send({
        message: helper.getErrorMessage(err)
      });
    } else {
      //Should be a way to populate a object reference without doing another query but for the swagger validation
      //the creator needs populating
      Todo.findById(updatedTodo._id).populate('creator', 'name username').exec(function(err, retrievedTodo) {
        if (err) {
          return res.status(400).send({
            message: helper.getErrorMessage(err)
          });
        } else {
          res.json(retrievedTodo);
        }
      });
    }
  });
}

function deleteTodo(req, res) {
  var id = req.swagger.params.id.value;
  console.log('deleteTodo called for id ' + id);
  Todo.findByIdAndRemove(id, function(err) {
    if (err) {
      return res.status(400).send({
        message: helper.getErrorMessage(err)
      });
    } else {
      var msg = {"message":"Todo successfully deleted"};
      // this sends back a JSON response which is a single string
      res.json(msg);
    }
  });
};