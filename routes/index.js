/*var express = require('express');
var router = express.Router();

// GET home page.
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
*/

//Modulo 6
var express = require('express');
var router = express.Router();

var quizController = require('../controllers/quiz_controller');

/*GET home page*/
router.get('/',function(req, res){
    res.render('index',{title: 'Quiz'});
});

router.get('/quizes/question', quizController.question);
router.get('/quizes/answer', quizController.answer);

/*GET Authors*/
router.get('/author',function(req, res){
    res.render('author',{title: 'Quiz'});
});


module.exports = router;

//FIN Modulo 6
