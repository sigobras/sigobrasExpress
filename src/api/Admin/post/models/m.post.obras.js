const pool = require('../../../../db/connection');
let userModel = {};
userModel.postFicha = (data,callback)=>{
    
    pool.getConnection(function(err ,conn){
        if(err){ callback(err);}
        else{
            conn.query('INSERT INTO fichas SET ?', data,(error,res)=>{
                if(error){
                    console.log(error);
                    
                    callback(error.code);
                }else{
                    // console.log("affectedRows",res); 
                    callback(null,res.insertId);
                    conn.destroy()
                }
                
                
            })
        }
        
                
    })

}
userModel.postPlazoEjecucion = (data,callback)=>{
    
    pool.getConnection(function(err ,conn){
        if(err){ callback(err);}
        else{
            conn.query('Insert into PlazoEjecucion set ?',data, (error,res)=>{
                if(error){
                    console.log(error);                    
                    callback(error.code);
                }else{
                    console.log("res",res); 
                    callback(null,res);
                    conn.destroy()
                }
                
                
            })
        }                
    })
}
userModel.postHistorialEstado = (data,callback)=>{
    
    pool.getConnection(function(err ,conn){
        if(err){ callback(err);}
        else{
            conn.query('INSERT INTO historialEstados SET ?', data,(error,res)=>{
                if(error){
                    callback(error);
                }else{
                    // console.log("affectedRows",res); 
                    callback(null,res.insertId);
                    conn.destroy()
                }
                
                
            })
        }                
    })
}
userModel.postComponentes = (data,callback)=>{
    // console.log("postcomponentes");
     
    pool.getConnection(function(err,conn){
        if(err){ 
            callback(err);
        }
        else{     
            conn.query('INSERT INTO componentes (numero,nombre,presupuesto,fichas_id_ficha) values ?',[data],(error,res)=>{
                if(error) {
                    callback(error.code);
                    console.log(error);            
                }
                else{
                    // console.log("affectedRowsa",res); 
                    callback(null,res.insertId);
                    conn.destroy()
                }
                
            })  
        }      
    })
}
userModel.postPartidas = (data,callback)=>{
    // console.log("postPartidas");
    console.log("partidaData",data);
    if(data.length == 0){
        callback("partidadata vacia");
    }else{
         pool.getConnection(function(err,conn){
        if(err){ callback(err);}
        else{     
            conn.query('INSERT INTO partidas (tipo,item,descripcion,unidad_medida,metrado,costo_unitario,equipo,rendimiento,Componentes_id_componente,prioridades_id_prioridad,iconosCategorias_id_iconoCategoria) VALUES ?',[data],(error,res)=>{
                if(error){
                    console.log(error);                    
                    callback(error.code);
                }else{
                    // console.log("res",res); 
                    callback(null,res.insertId);
                    conn.destroy()
                } 
                
            })  
            }      
        })
    }
   
}
userModel.postActividades = (data,callback)=>{
    
    pool.getConnection(function(err ,conn){
        if(err){ callback(err);}
        else{
            conn.query('insert into actividades (tipo,nombre,veces,largo,ancho,alto,parcial,partidas_id_partida) values ?',[data],(err,res)=>{ 
                if(err){
                    console.log(err);
                    callback(err.code);
                }else{      
                    callback(null,res.insertId);
                    conn.destroy()
                }
                
                
            })
        }
        
                
    })
}
userModel.postRecursos = (data,callback)=>{
    console.log("postrecursos");
    pool.getConnection(function(err,conn){
        // console.log(data)
        if(err){ callback(err);}
        else{       
            conn.query('INSERT INTO recursos (tipo,codigo,descripcion,unidad,cuadrilla,cantidad,precio,parcial,Partidas_id_partida) VALUES ?',[data],(error,res)=>{
                if(error){
                    console.log("error",error);                     
                    callback(error.code);
                }else{
                    // console.log("res",res); 
                    callback(null,res.affectedRows);
                    conn.destroy()
                }
            })
        }
    })
}
userModel.postTipoObra = (data,callback)=>{
    
    pool.getConnection(function(err ,conn){
        if(err){                        
            callback(err);
        }
        else{            
            conn.query("INSERT INTO tipoObras (nombre, codigo) VALUES ?",[data],(error,res)=>{
                if(error){
                    console.log(error);                    
                    callback(error.code);
                }else{
                    console.log("res",res); 
                    callback(null,res);
                    conn.destroy()
                }
                
                
            })
        }                
    })
}
userModel.postUnidadEjecutora = (data,callback)=>{
    
    pool.getConnection(function(err ,conn){
        if(err){                        
            callback(err);
        }
        else{            
            conn.query("INSERT INTO UnidadEjecutoras (nombre) VALUES ?",[data],(error,res)=>{
                if(error){
                    console.log(error);                    
                    callback(error.code);
                }else{
                    console.log("res",res); 
                    callback(null,res);
                    conn.destroy()
                }
                
                
            })
        }                
    })
}
userModel.postmeta = (data,callback)=>{
    
    pool.getConnection(function(err ,conn){
        if(err){                        
            callback(err);
        }
        else{     
            //insertar datos query
            conn.query("insert into metas set ?",[data],(error,res)=>{ 
                if(error){
                    console.log(error);                    
                    callback(error.code);
                }else{
                   
                    console.log("res",res); 
                    callback(null,res);
                    conn.destroy()
                }
                
                
            })
        }                
    })
}
userModel.postEstado = (data,callback)=>{
    
    pool.getConnection(function(err ,conn){
        if(err){ callback(err);}
        else{
            // console.log("postestados",data);
            
            conn.query('INSERT INTO estados SET ?', data,(error,res)=>{
                if(error){
                    callback(error);
                }else{
                    console.log("affectedRows",res); 
                    callback(null,res.insertId);
                    conn.destroy()
                }
                
                
            })
        }                
    })
}
userModel.postHistorialPartidas = (data,callback)=>{
    
    pool.getConnection(function(err ,conn){
        if(err){ callback(err);}
        else{
            conn.query('Insert into historialpartidas (estado,partidas_id_partida) values ?',[data], (error,res)=>{
                if(error){
                    console.log(error);                    
                    callback(error.code);
                }else{
                    console.log("res",res); 
                    callback(null,res);
                    conn.destroy()
                }
                
                
            })
        }                
    })
}
userModel.postHistorialComponentes = (data,callback)=>{
    
    pool.getConnection(function(err ,conn){
        if(err){ callback(err);}
        else{
            conn.query('Insert into historialcomponentes (estado,componentes_id_componente) values ?',[data], (error,res)=>{
                if(error){
                    console.log(error);                    
                    callback(error.code);
                }else{
                    console.log("res",res); 
                    callback(null,res);
                    conn.destroy()
                }
                
                
            })
        }                
    })
}
userModel.posthistorialActividad = (data,callback)=>{
    
    pool.getConnection(function(err ,conn){
        if(err){ callback(err);}
        else{
            conn.query('insert into historialActividades(estado,actividades_id_actividad)values ?',[data],(err,res)=>{ 
                if(err){
                    console.log(err);
                    callback(err.code);
                }else{      
                    callback(null,res);
                    conn.destroy()
                }
                
                
            })
        }
        
                
    })
}
userModel.postAvanceActividadPorObra = (data,callback)=>{
    
    pool.getConnection(function(err ,conn){
        if(err){ callback(err);}
        else{
            conn.query('Insert into avanceActividades (actividades_id_actividad,fecha,valor,accesos_id_acceso) values ?',[data],(err,res)=>{ 
                if(err){
                    console.log(err);
                    callback(err.code);
                }else{      
                    callback(null,res);
                    conn.destroy()
                }
                
                
            })
        }
        
                
    })
}
userModel.getPrioridad  = (callback)=>{    
    pool.getConnection(function(err ,conn){
        if(err){ 
            callback(err);
        }        
        else{
            conn.query("select * from prioridades limit 1",(err,res)=>{ 
                if(err){
                    console.log(err);                    
                    callback(err.code);                 
                }
                else if(res.length == 0){
                    callback(null,"vacio");    
                    conn.destroy()    
                }else{   
                    callback(null,res[0]);
                    conn.destroy()
                }
            })
        }
        
                
    })
}
userModel.getIconocategoria  = (callback)=>{    
    pool.getConnection(function(err ,conn){
        if(err){ 
            callback(err);
            conn.destroy()
        }        
        else{
            conn.query("select * from iconoscategorias limit 1",(err,res)=>{ 
                if(err){
                    console.log(err);                    
                    callback(err.code);                 
                }
                else if(res.length == 0){
                    callback(null,"vacio");    
                    conn.destroy()    
                }else{   
                    callback(null,res[0]);
                    conn.destroy()
                }
            })
        }
        
                
    })
}


module.exports = userModel;
