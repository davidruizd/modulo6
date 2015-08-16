var models = require('../models/models.js');

exports.show = function (req,res) {
	//Busca todas las preguntas y se empieza a filtrar.
	var preguntas;
	models.Quiz.findAll({ include: [{ model: models.Comment }] }).then(function(preguntas) {

		var preguntasTotales=preguntas.length;
		var comentariosTotales=0;
		var comentariosMedios=0;
		var noComent=0;
		var siComent=0;

		//para cada pregunta encontrada se analizan comentarios
		for (i in preguntas){
			if (preguntas[i].Comments.length > 0) {
				//si 1 pregunta tiene comentarios se aumenta en 1
				//el nº de preguntas con comentario
				siComent++;
				//Por cada comentario que tiene la pregunta se incrementa
				//en 1 los comentarios totales.
				for (coment in preguntas[i].Comments){
					comentariosTotales++;
				}
			} else {
				//si por el contrario no hay comentario, se incremente en 1
				// noComent
				noComent++;
			}
		};
		comentariosMedios = (comentariosTotales/preguntasTotales).toFixed(2);
		
		res.render('quizes/statistics', 
					{	preguntasTotales: preguntasTotales, 
						comentariosTotales: comentariosTotales,
						comentariosMedios: comentariosMedios,
						noComent: noComent,
						siComent: siComent,
						errors: []
					});
	});
	
};