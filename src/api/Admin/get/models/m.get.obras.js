const pool = require('../../../../db/connection');
let userModel = {};
userModel.getObras = (callback)=>{
    
    pool.getConnection(function(err,conn){
        if(err){ callback(err);}       
        conn.query('select *from fichas left join (SELECT historialestados.Fichas_id_ficha, estados.nombre estado_nombre FROM historialestados INNER JOIN (SELECT MAX(historialestados.id_historialEstado) id_historialEstado FROM historialestados LEFT JOIN estados ON estados.id_Estado = historialestados.Estados_id_Estado GROUP BY historialestados.Fichas_id_ficha) he ON he.id_historialEstado = historialestados.id_historialEstado INNER JOIN estados ON estados.id_Estado = historialestados.Estados_id_Estado) estado ON estado.Fichas_id_ficha = fichas.id_ficha', (error,res)=>{
            if(error) callback(error);            
            callback(null,res);
            conn.destroy()
        })        
    })
    
}
userModel.getEstados = (callback)=>{
    
    pool.getConnection(function(err ,conn){
        if(err){ callback(err);}
        else{
            conn.query('SELECT * FROM estados', (error,res)=>{
                if(error){
                    callback(error);
                }else{
                    console.log("affectedRows",res); 
                    callback(null,res);
                    conn.destroy()
                }
                
                
            })
        }                
    })
}

userModel.getComponentesById = (id_ficha,callback)=>{
    
    pool.getConnection(function(err,conn){
        if(err){ callback(err);}       
        conn.query('SELECT componentes.numero, componentes.nombre, componentes.id_componente, componentes.presupuesto FROM componentes WHERE componentes.Fichas_id_ficha = ?',id_ficha, (error,res)=>{
            if(error) callback(error);            
            callback(null,res);
            conn.destroy()
        })        
    })
}

userModel.getTipoObras = (callback)=>{
    
    pool.getConnection(function(err ,conn){
        if(err){                        
            callback(err);
        }
        else{            
            
            
            conn.query("select * from tipoobras",(error,res)=>{
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

userModel.getUnidadEjecutora = (callback)=>{
    
    pool.getConnection(function(err ,conn){
        if(err){                        
            callback(err);
        }
        else{                       
            conn.query("select * from UnidadEjecutoras",(error,res)=>{
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
userModel.getPartidasPorObra = (id_ficha,callback)=>{
    
    pool.getConnection(function(err ,conn){
        if(err){                        
            callback(err);
        }
        else{                       
            conn.query("select partidas.* from componentes left join partidas on partidas.componentes_id_componente = componentes.id_componente where componentes.fichas_id_ficha = ? ",id_ficha,(error,res)=>{
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


module.exports = userModel;