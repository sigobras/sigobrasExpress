const User = require('../models/m.get.pFisicos');

module.exports = function(app){
    app.post('/getComponentes',(req,res)=>{
		if (req.body.id_ficha == null ||req.body.id_ficha == "null"||req.body.id_ficha == "") {
			res.json("null");
		} else {
			User.getComponentes(req.body.id_ficha,(err,componentes)=>{
				if(err){ res.status(204).json(err);}
				else{
                    User.getPartidas(componentes[0].id_componente,null,(err,partidas)=>{
                        if(err){ res.status(204).json(err);}
                        else{
                            componentes[0].partidas = partidas
                            res.json(componentes);	
                        }
                    })
                   
				}
			})
		}
    })
    app.post('/getPartidas',(req,res)=>{
		if (req.body.id_componente == null ||req.body.id_componente == "null"||req.body.id_componente == "") {
			res.json("null");
		} else {
			User.getPartidas(req.body.id_componente,null,(err,data)=>{
				if(err){ res.status(204).json(err);}
				else{
					res.json(data);	
				}
			})
		}
    })
    app.post('/getActividades',(req,res)=>{
		if (req.body.id_partida == null ||req.body.id_partida == "null"||req.body.id_partida == "") {
			res.json("null");
		} else {
			User.getActividades(req.body.id_partida,(err,data)=>{
				if(err){ res.status(204).json(err);}
				else{
                    User.getPartidasMayorMetradoAvance(req.body.id_partida,(err,mayorMetrado)=>{
                        if(err){ res.status(204).json(err);}
                        else{
                            mayorMetrado = mayorMetrado||{}
                            res.json(
                                {
                                    "mayor_metrado":{
                                        "mm_avance_metrado": mayorMetrado.avance_metrado||0,
                                        "mm_avance_costo": mayorMetrado.avance_costo||0,
                                        "mm_metrados_saldo": mayorMetrado.metrados_saldo||0,
                                        "mm_metrados_costo_saldo": mayorMetrado.metrados_costo_saldo||0,
                                        "mm_porcentaje": mayorMetrado.porcentaje||0
                                    },
                                    "actividades":data
                                }
                            );
                        }
                    })	
				}
			})
		}
    })
    app.post('/getComponentesPNuevas',(req,res)=>{
        
        if (req.body.id_ficha == null) {
			res.json("null");
		} else {
			User.getComponentesPNuevas(req.body.id_ficha,(err,componentes)=>{
                if(err == "vacio"){
                    res.json(err)
                }
				else if(err){ res.status(204).json(err);}
				else{
                
                    User.getPartidasPNuevas(componentes[0].id_componente,(err,partidas)=>{
                        if(err){ res.status(204).json(err);}
                        else{
                            componentes[0].partidas = partidas
                            res.json(componentes);	
                        }
                    })
                   
				}
			})
		}
    })
    app.post('/getPartidasPNuevas',(req,res)=>{
		if (req.body.id_componente == null ||req.body.id_componente == "null"||req.body.id_componente == "") {
			res.json("null");
		} else {
			User.getPartidasPNuevas(req.body.id_componente,(err,data)=>{
				if(err){ res.status(204).json(err);}
				else{
					res.json(data);	
				}
			})
		}
    })
    app.post('/getActividadesPNuevas',(req,res)=>{
		if (req.body.id_partida == null ||req.body.id_partida == "null"||req.body.id_partida == "") {
			res.json("null");
		} else {
			User.getActividades(req.body.id_partida,(err,data)=>{
				if(err){ res.status(204).json(err);}
				else{
                    User.getPartidasMayorMetradoAvance(req.body.id_partida,(err,mayorMetrado)=>{
                        if(err){ res.status(204).json(err);}
                        else{
                            mayorMetrado = mayorMetrado||{}
                            res.json(
                                {
                                    "mayor_metrado":{
                                        "mm_avance_metrado": mayorMetrado.avance_metrado||0,
                                        "mm_avance_costo": mayorMetrado.avance_costo||0,
                                        "mm_metrados_saldo": mayorMetrado.metrados_saldo||0,
                                        "mm_metrados_costo_saldo": mayorMetrado.metrados_costo_saldo||0,
                                        "mm_porcentaje": mayorMetrado.porcentaje||0
                                    },
                                    "actividades":data
                                }
                            );
                        }
                    })	
				}
			})
		}
    })
    
    app.post('/getActividadesDuracion',(req,res)=>{
        if (req.body.id_ficha == null) {
            res.json("null")
        } else {
            User.getActividadesDuracion(req.body.id_ficha,(err,data)=>{
                if(err){ res.status(204).json(err);}
                else{
                    res.json(data);	
                }
            })
        }			
        
    })
    app.post('/getMaterialesPorObra',(req,res)=>{
        if (req.body.id_ficha == null) {
            res.json("null")
        } else {
            User.getMaterialesPorObra(req.body.id_ficha,(err,data)=>{
                if(err){ res.status(204).json(err);}
                else{
                    res.json(data);	
                }
            })
        }			
        
    })
    app.get('/getPrioridades',(req,res)=>{
		
        User.getPrioridades ((err,data)=>{
            if(err){ res.status(204).json(err);}
            else{
                res.json(data);	
            }
        })
    })
    app.get('/getIconoscategorias',(req,res)=>{
		
        User.getIconoscategorias ((err,data)=>{
            if(err){ res.status(204).json(err);}
            else{
                res.json(data);	
            }
        })
    })
}
