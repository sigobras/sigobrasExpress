const User = require('../models/m.get.Inicio');
const Tools = require('../../../../Tools/format')
const User2 = require('../../../ProcesosFisicos/get/models/m.get.valGeneral');
var fs = require('fs');
var formidable = require('formidable');
module.exports = (app) => {
	app.post('/PGlistaObras', async (req, res) => {
		try {
			var obras = await User.getObras(req.body.id_acceso)
			res.json(obras)
		} catch (error) {
			res.status(200).json(error)
		}
	});
	app.post('/getComponentesPgerenciales', async (req, res) => {
		try {
			var data = await User.getComponentesPgerenciales(req.body.id_ficha)
			res.json(data)
		} catch (error) {
			res.status(200).json(error)
		}
	});
	//desfasado
	app.post('/getCargosById', async (req, res) => {
		try {
			var cargos = await User.getCargosById_ficha(req.body.id_ficha)
			for (let i = 0; i < cargos.length; i++) {
				const cargo = cargos[i];
				var data = await User.getUsuariosByCargo(req.body.id_ficha, cargo.id_cargo)
				cargo.data = data
			}
			res.json(cargos)
		} catch (error) {
			res.status(200).json(error)
		}
	});
	app.post('/getCargosById2', async (req, res) => {
		try {
			var cargos = await User.getCargosById_ficha(req.body.id_ficha)
			res.json(cargos)
		} catch (error) {
			res.status(200).json(error)
		}
	});
	app.post('/getUsuariosByCargo', async (req, res) => {
		try {
			var cargos = await User.getUsuariosByCargo(req.body.id_ficha, req.body.id_cargo, req.body.estado)
			res.json(cargos)
		} catch (error) {
			res.status(200).json(error)
		}
	});
	app.post('/postUsuarioObra', async (req, res) => {
		try {
			var responseUsuario = await User.postUsuario(req.body)
			var responseAcceso = await User.postAcceso(req.body.id_cargo, responseUsuario.insertId)
			var responseAccesoFicha = await User.postAccesoFicha(req.body.id_ficha, responseAcceso.insertId)
			res.json({
				message: "registro exitoso"
			})
		} catch (error) {
			console.log(error);
			res.status(204).json(error.code)
		}
	})
	app.post('/putUsuarioMemo', async (req, res) => {
		try {
			var dir = __dirname + '/../../../../public/'
			//crear ruta si no existe
			if (!fs.existsSync(dir)) {
				fs.mkdirSync(dir);
			}
			var form = new formidable.IncomingForm();
			//se configura la ruta de guardar
			form.uploadDir = dir;

			var formFiles = await new Promise((resolve, reject) => {
				form.parse(req, (err, fields, files) => {
					if (err) {
						return reject(err);
					}
					return resolve({ fields, files: files.memorandum });
				});
			});
			console.log(formFiles.fields);
			//se genera el nombre del archivo
			var link = ""
			if (formFiles.files) {
				var extensionArchivo = "." + formFiles.files.name.split('.').pop()
				var archivo_name = "memorandum" + extensionArchivo
				//se verifica y crea las carpetas de obra 
				var obraFolder = formFiles.fields.obra_codigo + "/PERSONAL/TECNICOS/" + formFiles.fields.id_acceso + "/"
				if (!fs.existsSync(dir + obraFolder)) {
					fs.mkdirSync(dir + obraFolder, { recursive: true });
				}
				obraFolder += archivo_name
				// renombre y mueve de lugar el archivo
				fs.rename(formFiles.files.path, dir + obraFolder, (err) => { })
				link = "/static/" + obraFolder
			}
			var request = await User.putUsuarioMemo(link, formFiles.fields.id_acceso, formFiles.fields.id_ficha)
			console.log(request);
			res.json({
				message: "registro exitoso"
			})
		} catch (error) {
			console.log(error);
			res.status(204).json(error.code)
		}
	})
}
