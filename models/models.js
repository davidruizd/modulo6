var path = require ('path');


var url = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
var DB_name = (url[6] || null);
var user 	= (url[2] || null);
var password = (url[3] || null);
var protocol = (url[1] || null);
var dialect = (url[1] || null);
var port 	= (url[5] || null);
var host 	= (url[4] || null);
var storage = process.env.DATABASE_STORAGE;

//Cargar el modulo para acceder a la bbdd
var Sequelize = require('sequelize');

//iniciar conexion con la bbdd
var sequelize = new Sequelize(DB_name, user, password, {
	dialect: protocol,
	protocol: protocol,
	port: port,
	host: host,
	storage: storage,
	omitNull: true
});

//Importar definicion de la tabla
var quiz_path = path.join(__dirname,'quiz');
var Quiz = sequelize.import(quiz_path);

//Importar Comment
var comment_path = path.join(__dirname, 'comment');
var Comment = sequelize.import(comment_path);

//Se genera la relación
Comment.belongsTo(Quiz);
Quiz.hasMany(Comment);

exports.Quiz = Quiz;
exports.Comment = Comment;

//Crear e inicializar tablas
sequelize.sync().then(function() {
	//Si se crea correctamente la tabla, ejecuta:
	Quiz.count().then(function (count) {
		if (count == 0) {
			Quiz.create({
				pregunta: 'Capital de Italia',
				respuesta: 'roma',
				tema: 'Humanidades'
			});
			Quiz.create({
				pregunta: 'Capital de Portugal',
				respuesta: 'lisboa',
				tema: 'Humanidades'
			}).then(function() {
				console.log('Base de datos inicializada');
			});
		}
	});
});