const User = require('../models/procesosIniciales');

function soloLetras(req,res,next){
	var regla = /^[A-Za-z0-9]+$/
	var usuario =  req.body.usuario
	if(usuario.match(regla)&&req.body.password.match(regla)){
		// console.log("usuario",usuario)
		next()
	}else{
		res.status(400).send("caracteres invalidos")
	}
}


module.exports = function(app){

	//USUARIOS



	app.get('/listaUsuarios',(req,res)=>{
		User.getPersonalTecnico((err,data)=>{
			if(err) {res.status(204).json(err);}
			else {res.json(data);	}
		})

	})
	//cargos


	
	//obras

	
	//accesos
	
	//componentes


	//login
	app.post('/login',soloLetras,(req,res)=>{
		
		User.postLogin(req.body,(err,data)=>{
			
			if(err){
				res.status(204).json(err);
			}else{
				res.status(200).json(data);
			}
			
		})
	})
	//estados
	
	
	app.post('/ActualizarEstado',(req,res)=>{
		
		User.postHistorialEstados(req.body,(err,id_historial)=>{							
			if(err){ res.status(204).json(err);}
			else{
				console.log("id",id_historial);
				

				User.getestadoIdHistorialEstados(id_historial,(err,estado)=>{							
					if(err){ res.status(204).json(err);}
					else{
						
						res.json(estado);	
					}

				})
			}

		})
	})
	app.post('/getDatosGenerales',(req,res)=>{
		if(req.body.id_ficha == null){
			res.json("null");
		}else{
			User.getDatosGenerales(req.body.id_ficha,(err,data)=>{							
				if(err){ res.status(204).json(err);}
				else{
					res.json(data);	
				}
	
			})
		}
		
		
	})

	
	app.post('/convertirJson',(req,res)=>{
		req.body =JSON.stringify(req.body)
		
		console.log("iniciand",req.body);
		res.json(req.body)	
		
			
	})

	app.post('/getMenu',(req,res)=>{
		if(req.body.id_ficha == null||req.body.id_acceso == null){
			res.json("null");	
		}else{
			User.getMenu(req.body,(err,data)=>{							
				if(err){ res.status(204).json(err);}
				else{
					res.json(data);	
				}
	
			})
		}
	
	
		
	})
	
	

	
	//mish
	app.post('/postmetas',(req,res)=>{
		if(req.body.fichas_id_ficha == null){
			res.json("null");	
		}else{
			// res.json("bien")
			//uso del modelo
			User.postmetas(req.body,(err,data)=>{							
				if(err){ res.status(204).json(err);}
				else{
					res.json(data);	
				}
	
			})
		}
	
		
	})
	
	
	app.post('/postCostosyGanancias',(req,res)=>{
		if(req.body.nombre == null){
			res.json("null");	
		}else{
			 //vist del resultado
			User.PostCostosyGanancias(req.body,(err,data)=>{							
				if(err){ res.status(204).json(err);}
				else{
					res.json(data);	
				}
	
			})
		}
	
		
	})
	
	app.post('/postHistorialCyG',(req,res)=>{
		if(req.body.monto == null){
			res.json("null");	
		}else{
			 //vist del resultado
			User.PostHistorialCyG(req.body,(err,data)=>{							
				if(err){ res.status(204).json(err);}
				else{
					res.json(data);	
				}
	
			})
		}
	
		
	}) 
	
	app.get('/getGananciasyCostos',(req,res)=>{
		
			//res.json("GananciasyCostos") //vist del resultado
			User.getGananciasyCostos(req.body,(err,data)=>{							
				if(err){ res.status(204).json(err);}
				else{
					res.json(data);	
				}
	
			})
		
	
		
	})

	app.post('/postcronogramamensual',(req,res)=>{
		
		//res.json("postcronogramamensual") //vista del resultado
		User.postcronogramamensual(req.body,(err,data)=>{							
			if(err){ res.status(204).json(err);}
			else{
				res.json(data);	
			}

		})
	})

	app.post('/getcronogramamensual',(req,res)=>{
		
		//res.json("postcronogramamensual") //vista del resultado
		User.getcronogramamensual(req.body.id_ficha,(err,data)=>{							
			if(err){ res.status(204).json(err);}
			else{
				res.json(data);	
			}

		})
	})

	app.post('/postActividadMayorMetrado',(req,res)=>{
		var actividad = req.body.actividad
		if (actividad.partidas_id_partida == null) {
			res.json("null")
		}else{
			User.postActividadMayorMetrado(actividad,(err,id_actividad)=>{
				if(err){ res.status(204).json(err);}
				else{
					var historialActividad = {						
						"estado":"Mayor Metrado",
						"actividades_id_actividad":id_actividad
					}
					User.posthistorialActividades(historialActividad,(err,data)=>{
						if(err){ res.status(204).json(err);}
						else{
							var avanceActividad = req.body.avanceActividad
							avanceActividad.Actividades_id_actividad = id_actividad
							var id_ficha = avanceActividad.id_ficha
							
							User.getIdHistorial(id_ficha,(err,data)=>{
								console.log("idhistorial");
								if(err||data.length==0){ res.status(204).json(err);}
								else{
									delete avanceActividad.id_ficha
									avanceActividad.historialEstados_id_historialEstado = data[0].id_historialEstado
									
									
									User.postAvanceActividad(avanceActividad,(err,data)=>{
										console.log("avance");
										
										if(err){ res.status(204).json(err);}
										else{
											User.getAvanceById(id_actividad,(err,data)=>{
												if(err){ res.status(204).json(err);}
												else{
													res.json(data);	
												}
											})
											
										}
									})
								}
							})
						}
					})
				}
			})
		}			
		
	})

	app.post('/postNuevaActividadMayorMetrado',(req,res)=>{
		if (req.body.partidas_id_partida == null) {
			res.json("null")
		} else {
			User.postActividadMayorMetrado(req.body,(err,id_actividad)=>{
				if(err){ res.status(204).json(err);}
				else{
					var historialActividad = {						
						"estado":"Mayor Metrado",
						"actividades_id_actividad":id_actividad
					}
					User.posthistorialActividades(historialActividad,(err,data)=>{
						if(err){ res.status(204).json(err);}
						else{
							User.getAvanceById(id_actividad,(err,data)=>{
								if(err){ res.status(204).json(err);}
								else{
									res.json(data);	
								}
							})
						}
					})





					
				}
			})
		}			
		
	})


	
	
	
	
}