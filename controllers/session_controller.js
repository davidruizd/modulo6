//GET /login
exports.new = function(req,res) {
	var errors = req.session.errors || {};
	req.session.errors = {};

	res.render('sessions/new', {errors: errors});
};

//POST /login

exports.create = function(req,res) {

	var login = req.body.login;
	var password = req.body.password;

	var userController = require('./user_controller');
	//se autentican los datos y si son correctos se crea el usuario
	userController.autenticar(login,password, function(error,user) {
		if (error) {
			req.session.errors = [{'message': 'Se ha producido un error: '+error}];
			res.redirect('/login');
			return;
		}
		//Si no ocurre ningun erorr se crea la sesion de usuario
		req.session.user = {id: user.id, username: user.username};
		//Redireccion a la página desde la que se hizo el login.
		res.redirect(req.session.redir);
	});
};

// GET /logout
exports.destroy  = function(req, res) {
	//Destruye la session y manda al usuario de vuelta a la página anterior
	delete req.session.user;
	res.redirect(req.session.redir);
};

//MW de control
exports.loginRequired = function(req,res,next) {
	if (req.session.user) {
		next();
	} else {
		res.redirect('/login');
	}
};