const queryBuilder = require("../../../../libs/queryBuilder");
let userModel = {};
userModel.postAvanceActividad = (data, callback) => {
  pool.getConnection(function (err, conn) {
    if (err) {
      callback(err);
    } else {
      conn.query("INSERT INTO AvanceActividades set ?", data, (error, res) => {
        if (error) {
          callback(error);
          conn.destroy();
        } else {
          console.log("affectedRows", res);
          callback(null, res);
          conn.destroy();
        }
      });
    }
  });
};
userModel.postActividad = (data, callback) => {
  pool.getConnection(function (err, conn) {
    if (err) {
      callback(err);
    } else {
      conn.query("INSERT INTO actividades set ?", data, (error, res) => {
        if (error) {
          callback(error);
          conn.destroy();
        } else {
          console.log("affectedRows", res);
          callback(null, res.insertId);
          conn.destroy();
        }
      });
    }
  });
};
userModel.posthistorialActividades = (data, callback) => {
  pool.getConnection(function (err, conn) {
    if (err) {
      callback(err);
    } else {
      conn.query(
        "INSERT INTO historialActividades set ?",
        data,
        (error, res) => {
          if (error) {
            callback(error);
            conn.destroy();
          } else {
            console.log("affectedRows", res);
            callback(null, res.insertId);
            conn.destroy();
          }
        }
      );
    }
  });
};
userModel.postavancePartidaImagen = (data) => {
  return new Promise((resolve, reject) => {
    const query = new queryBuilder("partidasimagenes").insert(data).toString();
    pool.query(query, (error, res) => {
      if (error) {
        console.log(error);
        reject(error);
      }
      resolve(res);
    });
  });
};
userModel.postrecursosEjecucionrealCantidad = (data) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "INSERT INTO recursos_ejecucionreal (fichas_id_ficha,tipo,descripcion,cantidad) VALUES ? ON DUPLICATE key UPDATE cantidad = VALUES(cantidad)",
      [data],
      (error, res) => {
        if (error) {
          reject(error);
        } else {
          resolve(res);
        }
      }
    );
  });
};
userModel.postrecursosEjecucionrealPrecio = (data) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "INSERT INTO recursos_ejecucionreal (fichas_id_ficha,tipo,descripcion,precio) VALUES ? ON DUPLICATE key UPDATE precio = VALUES(precio)",
      [data],
      (error, res) => {
        if (error) {
          reject(error);
        } else {
          resolve(res);
        }
      }
    );
  });
};
userModel.postrecursosEjecucionrealCodigo = (data) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "INSERT INTO recursos_ejecucionreal (fichas_id_ficha,tipo,descripcion,codigo,tipoDocumentoAdquisicion_id_tipoDocumentoAdquisicion) VALUES ? ON DUPLICATE key UPDATE tipoDocumentoAdquisicion_id_tipoDocumentoAdquisicion = VALUES(tipoDocumentoAdquisicion_id_tipoDocumentoAdquisicion),codigo = VALUES(codigo)",
      [data],
      (error, res) => {
        if (error) {
          reject(error);
        } else {
          resolve(res);
        }
      }
    );
  });
};
userModel.postrecursosEjecucionrealUnidad = (data) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "INSERT INTO recursos_ejecucionreal (fichas_id_ficha,tipo,descripcion,unidad) VALUES ? ON DUPLICATE key UPDATE unidad = VALUES(unidad)",
      [data],
      (error, res) => {
        if (error) {
          reject(error);
        } else {
          resolve(res);
        }
      }
    );
  });
};
userModel.postrecursosEjecucionrealdescripcionModificada = (data) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "INSERT INTO recursos_ejecucionreal (fichas_id_ficha,tipo,descripcion,descripcion_modificada) VALUES ? ON DUPLICATE key UPDATE descripcion_modificada = VALUES(descripcion_modificada)",
      [data],
      (error, res) => {
        if (error) {
          reject(error);
        } else {
          resolve(res);
        }
      }
    );
  });
};
userModel.getrecursosEjecucionreal = (id_ficha, descripcion) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT tipo, codigo recurso_codigo, descripcion, cantidad recurso_gasto_cantidad, precio recurso_gasto_precio, unidad recurso_gasto_unidad, descripcion_modificada recurso_gasto_descripcion FROM recursos_ejecucionreal WHERE recursos_ejecucionreal.fichas_id_ficha = ? AND recursos_ejecucionreal.descripcion = ?",
      [id_ficha, descripcion],
      (error, res) => {
        if (error) {
          reject(error);
        } else {
          resolve(res[0]);
        }
      }
    );
  });
};
userModel.postdocumentoAdquisicion = (data) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "insert into documentosAdquisicion set ?",
      [data],
      (error, res) => {
        if (error) {
          reject(error);
        } else {
          resolve(res.insertId);
        }
      }
    );
  });
};
userModel.putrecursosEjecucionrealIdDocumentoAdquisicion = (data) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "INSERT INTO recursos_ejecucionreal (fichas_id_ficha,descripcion,documentosAdquisicion_id_documentoAdquisicion) VALUES ? ON DUPLICATE key UPDATE documentosAdquisicion_id_documentoAdquisicion = VALUES(documentosAdquisicion_id_documentoAdquisicion)",
      [data],
      (error, res) => {
        if (error) {
          reject(error);
        } else {
          resolve(res);
        }
      }
    );
  });
};
userModel.putrecursosNuevosDocumentoAdquisicion = (data) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "INSERT INTO recursosnuevos (fichas_id_ficha,id_recursoNuevo,documentosAdquisicion_id_documentoAdquisicion) VALUES ? ON DUPLICATE key UPDATE documentosAdquisicion_id_documentoAdquisicion = VALUES(documentosAdquisicion_id_documentoAdquisicion)",
      [data],
      (error, res) => {
        if (error) {
          reject(error);
        } else {
          resolve(res);
        }
      }
    );
  });
};
userModel.postRecursosNuevos = (data) => {
  return new Promise((resolve, reject) => {
    pool.query("INSERT INTO recursosnuevos set ?", [data], (error, res) => {
      if (error) {
        reject(error);
      } else {
        resolve(res);
      }
    });
  });
};
userModel.agregarCostoIndirecto = (data) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "insert into costosindirectos (id,nombre,monto,fichas_id_ficha,fecha_inicial,fecha_final) values (?,?,?,?,?,?) on duplicate key update nombre = values (nombre), monto = values(monto);",
      [
        data.id,
        data.nombre,
        data.monto,
        data.fichas_id_ficha,
        data.fecha_inicial,
        data.fecha_final,
      ],
      (error, res) => {
        if (error) {
          reject(error);
        } else {
          resolve(res);
        }
      }
    );
  });
};

userModel.getCostosIndirectos = (data) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT * FROM costosindirectos WHERE fichas_id_ficha = ? AND fecha_inicial = ? ",
      [data.fichas_id_ficha, data.fecha_inicial],
      (error, res) => {
        if (error) {
          reject(error);
        } else {
          resolve(res);
        }
      }
    );
  });
};

userModel.eliminarCostosIndirectos = (data) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "DELETE FROM costosindirectos WHERE id = ?",
      [data.id],
      (error, res) => {
        if (error) {
          reject(error);
        } else {
          resolve(res);
        }
      }
    );
  });
};
//cambios nuevos de apis
userModel.getFechasRevisadas = async ({ id_ficha, fecha }) => {
  try {
    const [rows] = await pool.execute(
      "SELECT COUNT(fecha_revisada) total FROM fechas_revisadas WHERE fichas_id_ficha = ? AND fechas_revisadas.fecha_revisada = ?;",
      [id_ficha, fecha]
    );

    return rows ? rows[0] : {};
  } catch (error) {
    throw error;
  }
};
userModel.postActividad2 = async ({
  fecha,
  valor,
  descripcion,
  id_actividad,
  id_acceso,
}) => {
  try {
    const [rows] = await pool.execute(
      "INSERT INTO avanceactividades (fecha, valor, descripcion, Actividades_id_actividad, accesos_id_acceso) VALUES (?, ?, ?, ?, ?)",
      [fecha, valor, descripcion, id_actividad, id_acceso]
    );

    return rows;
  } catch (error) {
    throw error;
  }
};
userModel.actualizarAvanceFisicoAcumulado = async ({ id_ficha }) => {
  try {
    const [rows] = await pool.execute(
      `
      SELECT SUM(avanceactividades.valor * partidas.costo_unitario) as avance
      FROM
      expedientes_obra eo 
      left join componentes on componentes.expediente_id  = eo.id 
      LEFT JOIN partidas ON partidas.componentes_id_componente = componentes.id_componente
      LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida
      LEFT JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad
      WHERE eo.ficha_id  = 117;
    `,
      [id_ficha]
    );

    const avance = rows[0].avance || 0;

    const [result] = await pool.execute(
      `
      INSERT INTO fichas_datosautomaticos (avancefisico_acumulado, fichas_id_ficha)
      VALUES (?, ?)
      ON DUPLICATE KEY UPDATE avancefisico_acumulado = VALUES(avancefisico_acumulado)
    `,
      [avance, id_ficha]
    );

    return result;
  } catch (error) {
    throw error;
  }
};
userModel.actualizarAvanceFisicoAcumuladoCurvaS = async ({
  id_ficha,
  fecha,
}) => {
  try {
    const [anyo, mes] = fecha.split("-");

    const query = `
    UPDATE
      curva_s
    SET
      fisico_monto = (
      SELECT
        SUM(avanceactividades.valor * partidas.costo_unitario) avance
      FROM
        expedientes_obra eo
      left join
          componentes on
        componentes.expediente_id = eo.id
      LEFT JOIN partidas ON
        partidas.componentes_id_componente = componentes.id_componente
      LEFT JOIN actividades ON
        actividades.Partidas_id_partida = partidas.id_partida
      LEFT JOIN avanceactividades ON
        avanceactividades.Actividades_id_actividad = actividades.id_actividad
      WHERE
        eo.ficha_id = ?
        AND YEAR(avanceactividades.fecha) = ?
        AND MONTH(avanceactividades.fecha) = ?
          )
    WHERE
      fichas_id_ficha = ?
      AND anyo = ?
      AND mes = ?
      `;

    const [rows] = await pool.execute(query, [
      id_ficha,
      anyo,
      mes,
      id_ficha,
      anyo,
      mes,
    ]);

    return rows;
  } catch (error) {
    throw error;
  }
};
userModel.actualizarUltimoDiaMetrado = async ({ id_ficha }) => {
  try {
    const [rows, fields] = await pool.execute(
      `
      UPDATE fichas_datosautomaticos
      SET
          avancefisico_ultimafecha = (
              SELECT DATE_FORMAT(MAX(avanceactividades.fecha), '%Y-%m-%d') fecha
              FROM expedientes_obra eo
      		  left join componentes on componentes.expediente_id = eo.id
              LEFT JOIN partidas ON partidas.componentes_id_componente = componentes.id_componente
              LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida
              LEFT JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad
              WHERE eo.ficha_id = ?
                AND avanceactividades.valor > 0
          )
      WHERE fichas_id_ficha = ?
    `,
      [id_ficha, id_ficha]
    );

    return rows;
  } catch (error) {
    throw error;
  }
};
//recruso edicion
userModel.updateRecursoAvance = ({ id_ficha, tipo, descripcion, cantidad }) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "INSERT INTO recursos_ejecucionreal (fichas_id_ficha,tipo,descripcion,cantidad) VALUES (?,?,?,?) ON DUPLICATE key UPDATE cantidad = VALUES(cantidad)",
      [id_ficha, tipo, descripcion, cantidad],
      (error, res) => {
        if (error) {
          reject(error);
        }
        resolve(res);
      }
    );
    pool.query(
      `
       UPDATE fichas_datosautomaticos
        SET
            avancefisico_ultimafecha = (SELECT
                    DATE_FORMAT(MAX(avanceactividades.fecha), '%Y-%m-%d') fecha
                FROM
                    componentes
                        LEFT JOIN
                    partidas ON partidas.componentes_id_componente = componentes.id_componente
                        LEFT JOIN
                    actividades ON actividades.Partidas_id_partida = partidas.id_partida
                        LEFT JOIN
                    avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad
                WHERE
                    componentes.fichas_id_ficha = ${id_ficha}
                    and avanceactividades.valor >0
                    )
        WHERE
            fichas_id_ficha = ${id_ficha}
       `,
      (error, res) => {
        if (error) {
          reject(error);
        }
      }
    );
  });
};
userModel.updateRecursoPrecio = ({ id_ficha, tipo, descripcion, precio }) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "INSERT INTO recursos_ejecucionreal (fichas_id_ficha,tipo,descripcion,precio) VALUES (?,?,?,?) ON DUPLICATE key UPDATE precio = VALUES(precio)",
      [id_ficha, tipo, descripcion, precio],
      (error, res) => {
        if (error) {
          reject(error);
        }
        resolve(res);
      }
    );
  });
};
userModel.updateRecursoDocumentoAdquisicion = ({
  id_ficha,
  tipo,
  descripcion,
  codigo,
  id_tipoDocumentoAdquisicion,
}) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "INSERT INTO recursos_ejecucionreal (fichas_id_ficha,tipo,descripcion,codigo,id_tipoDocumentoAdquisicion) VALUES (?,?,?,?,?) ON DUPLICATE key UPDATE codigo = VALUES(codigo), id_tipoDocumentoAdquisicion = VALUES(id_tipoDocumentoAdquisicion)",
      [id_ficha, tipo, descripcion, codigo, id_tipoDocumentoAdquisicion],
      (error, res) => {
        if (error) {
          reject(error);
        }
        resolve(res);
      }
    );
  });
};
module.exports = userModel;
