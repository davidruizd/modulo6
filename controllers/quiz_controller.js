var models = require('../models/models.js');

exports.load = function(req,res,next,quizId) {
	//Busca la pregunta asociada al id y carga 
	//todos los comentarios relacionados a tal id
	models.Quiz.find(
		{ 	where: { id: Number(quizId) },
			include: [{ model: models.Comment }]
		}).then (
		function (quiz) {
			if (quiz) {
				req.quiz = quiz;
				next();
			} else {
				next(new Error('No existe quizId=' + quizId));
			}
		}
	).catch(function(error) { next(error); });
};

//GET /quizes
exports.index = function (req, res) {
	if (req.query.search) {
		var search = req.query.search;
		search = search.replace('/ /g', '%');
		search = '%' + search + '%';
		models.Quiz.findAll({ where: ["pregunta like ?", search], order: 'pregunta ASC' }).then(function(quizes) {
			res.render ('quizes/index.ejs', {quizes:quizes, errors: []});
		}).catch(function(error) { next(error); });
	} else {
		models.Quiz.findAll().then(function(quizes) {
			res.render ('quizes/index.ejs', {quizes:quizes, errors: []});
		}).catch(function(error) { next(error); });
	}
	
};

//GET /quizes/:quizId
exports.show = function (req,res) {
	res.render('quizes/show', {quiz:req.quiz, errors: []});
};


//GET /quizes/:quizId/answer
exports.answer = function (req, res) {
	if (req.query.respuesta.toLowerCase() == req.quiz.respuesta) {
		res.render('quizes/answer', {quiz:req.quiz, respuesta: 'Correcto', errors: []});
	} else {
		res.render('quizes/answer', {quiz:req.quiz, respuesta: 'Incorrecto', errors: []});
	}	
};

//GET /quizes/new
exports.new = function (req, res) {
	var quiz = models.Quiz.build(
		{pregunta: 'Pregunta', respuesta: 'Respuesta', errors: []} );
	res.render('quizes/new', {quiz:quiz, errors: []});	
};

//POST /quizes/create
exports.create = function(req, res) {
	var quiz = models.Quiz.build(req.body.quiz);
	quiz.validate().then( function(err) {
		if (err) {
			res.render('quizes/new', {quiz:quiz, errors: err.erros});
		} else {
			quiz.save({fields: ["pregunta", "respuesta", "tema"]}).then(function() {
				res.redirect('/quizes');
			});
		}
	});		
};

//GET /quizes/quizId/edit
exports.edit = function(req,res) {
	var quiz = req.quiz;
	res.render('quizes/edit', {quiz:quiz, errors: [] });
};

//PUT /quizes/quizId
exports.update = function(req,res) {
	req.quiz.pregunta = req.body.quiz.pregunta;
	req.quiz.respuesta = req.body.quiz.respuesta;
	req.quiz.tema = req.body.quiz.tema;

	req.quiz.validate().then( function(err) {
		if (err) {
			res.render ('/quizes/edit', {quiz: req.quiz, errors: err.errors});
		} else {
			req.quiz.save ({ fields: ['pregunta', 'respuesta','tema']}).then( function() {
				res.redirect('/quizes');
			});
		}
	});
};

// DELETE /quizes/:quizId
exports.destroy = function(req,res) {
	req.quiz.destroy().then( function() {
		res.redirect('/quizes');
	}).catch(function(error) { next(error); });
};

//GET /quizes/author
exports.author = function (req, res) {
	res.render('quizes/author', {errors: []});
};