const tools = require("../../../../../utils/format");

let userModel = {};
userModel.getObras = (id_acceso) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT costo_directo.presupuesto costo_directo, fichas.id_ficha, fichas.g_meta, fichas.g_total_presu, SUM(avanceactividades.valor * partidas.costo_unitario) presu_avance, SUM(avanceactividades.valor * partidas.costo_unitario) / costo_directo.presupuesto * 100 porcentaje_avance, fichas.codigo, estado.nombre estado_nombre, tipoobras.nombre tipo_obra, MAX(IF(avanceactividades.valor IS NULL, '1990-01-01', avanceactividades.fecha)) ultima_fecha_avance, fichas.confirmacion_super_inf FROM fichas LEFT JOIN tipoobras ON tipoobras.id_tipoObra = fichas.tipoObras_id_tipoObra LEFT JOIN (SELECT componentes.fichas_id_ficha, SUM(componentes.presupuesto) presupuesto FROM componentes GROUP BY componentes.fichas_id_ficha) costo_directo ON costo_directo.fichas_id_ficha = fichas.id_ficha LEFT JOIN (SELECT Fichas_id_ficha, nombre, codigo FROM historialestados INNER JOIN (SELECT MAX(id_historialEstado) id_historialEstado FROM historialestados GROUP BY fichas_id_ficha) historial ON historial.id_historialEstado = historialestados.id_historialEstado LEFT JOIN estados ON estados.id_Estado = historialestados.Estados_id_Estado) estado ON estado.Fichas_id_ficha = fichas.id_ficha LEFT JOIN componentes ON componentes.Fichas_id_ficha = fichas.id_ficha LEFT JOIN partidas ON partidas.componentes_id_componente = componentes.id_componente LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida LEFT JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad LEFT JOIN fichas_has_accesos ON fichas_has_accesos.Fichas_id_ficha = fichas.id_ficha LEFT JOIN historialactividades ON historialactividades.actividades_id_actividad = actividades.id_actividad WHERE  fichas_has_accesos.habilitado AND fichas_has_accesos.Accesos_id_acceso = ? AND historialactividades.estado IS NULL GROUP BY fichas.id_ficha ORDER BY ultima_fecha_avance DESC",
      [id_acceso],
      (err, res) => {
        if (err) {
          reject(err);
        }
        resolve(res);
      }
    );
  });
};
userModel.listaObrasByIdAcceso = ({
  id_acceso,
  id_tipoObra,
  id_unidadEjecutora,
  idsectores,
  idmodalidad_ejecutora,
  Estados_id_Estado,
}) => {
  return new Promise((resolve, reject) => {
    var query = `
    SELECT
        fichas.id_ficha,
        fichas.codigo,
        fichas.g_meta,
        fichas.g_total_presu,
        id_tipoObra,
        DATE_FORMAT(MAX(avanceactividades.fecha), '%Y-%m-%d') ultima_fecha,
        unidadejecutoras.nombre unidad_ejecutora_nombre,
        sectores.nombre sector_nombre,
        modalidad_ejecutora.nombre modalidad_ejecutora_nombre,
        estado.nombre estado_nombre,
        DATE_FORMAT(fichas.fecha_inicial, '%Y-%m-%d') fecha_inicial,
        fichas.codigo_unificado,
        fichas.meta_final,
        fichas.poblacion_beneficiaria,
        fichas_tipo_administracion.nombre tipoadministracion_nombre
    FROM
        fichas
            LEFT JOIN
        tipoobras ON tipoobras.id_tipoObra = fichas.tipoObras_id_tipoObra
            LEFT JOIN
        unidadejecutoras ON unidadejecutoras.id_unidadEjecutora = fichas.unidadEjecutoras_id_unidadEjecutora
            LEFT JOIN
        sectores ON sectores.idsectores = fichas.sectores_idsectores
            LEFT JOIN
        modalidad_ejecutora ON modalidad_ejecutora.idmodalidad_ejecutora = fichas.modalidad_ejecutora
            LEFT JOIN
        fichas_tipo_administracion ON fichas_tipo_administracion.id = fichas.fichas_tipo_administracion_id
            LEFT JOIN
        (SELECT
            Fichas_id_ficha,
                nombre,
                codigo,
                historialestados.Estados_id_Estado
        FROM
            historialestados
        INNER JOIN (SELECT
            MAX(id_historialEstado) id_historialEstado
        FROM
            historialestados
        GROUP BY fichas_id_ficha) historial ON historial.id_historialEstado = historialestados.id_historialEstado
        LEFT JOIN estados ON estados.id_Estado = historialestados.Estados_id_Estado) estado ON estado.Fichas_id_ficha = fichas.id_ficha
            LEFT JOIN
        fichas_has_accesos ON fichas_has_accesos.Fichas_id_ficha = fichas.id_ficha
            LEFT JOIN
        componentes ON componentes.fichas_id_ficha = fichas.id_ficha
            LEFT JOIN
        partidas ON partidas.componentes_id_componente = componentes.id_componente
            LEFT JOIN
        actividades ON actividades.Partidas_id_partida = partidas.id_partida
            LEFT JOIN
        avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad
            AND avanceactividades.valor != 0
    WHERE
        fichas_has_accesos.habilitado
        AND fichas_has_accesos.Accesos_id_acceso = ${id_acceso}
    `;
    var condiciones = [];
    if (id_tipoObra != 0 && id_tipoObra != undefined) {
      condiciones.push(`(id_tipoObra = ${id_tipoObra})`);
    }
    if (id_unidadEjecutora != 0 && id_unidadEjecutora != undefined) {
      condiciones.push(`(id_unidadEjecutora = ${id_unidadEjecutora})`);
    }
    if (idsectores != 0 && idsectores != undefined) {
      condiciones.push(`(idsectores = ${idsectores})`);
    }
    if (idmodalidad_ejecutora != 0 && idmodalidad_ejecutora != undefined) {
      condiciones.push(`(idmodalidad_ejecutora = ${idmodalidad_ejecutora})`);
    }
    if (Estados_id_Estado != 0 && Estados_id_Estado != undefined) {
      condiciones.push(`(Estados_id_Estado = ${Estados_id_Estado})`);
    }
    if (condiciones.length > 0) {
      query += " AND " + condiciones.join(" AND ");
    }
    query += `
    GROUP BY fichas.unidadEjecutoras_id_unidadEjecutora , sectores_idsectores , id_ficha
    ORDER BY unidadejecutoras.poblacion desc ,fichas.unidadEjecutoras_id_unidadEjecutora , sectores_idsectores
              `;
    // console.log(query)
    // resolve(query)
    pool.query(query, (err, res) => {
      if (err) {
        reject(err);
      }
      resolve(res);
    });
  });
};
userModel.listaObrasSeguimientoByIdAcceso = ({ id_acceso }) => {
  return new Promise((resolve, reject) => {
    var query = `
    SELECT
        fichas.id_ficha,
        fichas.g_total_presu,
        fichas.codigo,
        DATE_FORMAT(MAX(plazos_historial.fecha_final),
                '%Y-%m-%d') plazo_ultima_fecha,
        DATE_FORMAT(MAX(curva_s.fecha_inicial), '%Y-%m-%d') programado_ultima_fecha,
        DATE_FORMAT(MAX(IF(curva_s.financiero_monto > 0,
                    curva_s.financiero_fecha_update,
                    FALSE)),
                '%Y-%m-%d') financiero_ultima_fecha
    FROM
        fichas
            LEFT JOIN
        plazos_historial ON plazos_historial.fichas_id_ficha = fichas.id_ficha
            LEFT JOIN
        curva_s ON curva_s.fichas_id_ficha = fichas.id_ficha
            LEFT JOIN
        fichas_has_accesos ON fichas_has_accesos.Fichas_id_ficha = fichas.id_ficha
          LEFT JOIN
        unidadejecutoras ON unidadejecutoras.id_unidadEjecutora = fichas.unidadEjecutoras_id_unidadEjecutora
            LEFT JOIN
        sectores ON sectores.idsectores = fichas.sectores_idsectores
    WHERE
        fichas_has_accesos.habilitado
            AND fichas_has_accesos.Accesos_id_acceso = ${id_acceso}

    `;
    var condiciones = [];
    // if (Estados_id_Estado != 0 && Estados_id_Estado != undefined) {
    //   condiciones.push(`(Estados_id_Estado = ${Estados_id_Estado})`)
    // }
    if (condiciones.length > 0) {
      query += " AND " + condiciones.join(" AND ");
    }
    query += `
    GROUP BY fichas.id_ficha
    ORDER BY unidadejecutoras.poblacion desc ,fichas.unidadEjecutoras_id_unidadEjecutora , sectores_idsectores
              `;
    // console.log(query)
    // resolve(query)
    pool.query(query, (err, res) => {
      if (err) {
        reject(err);
      }
      resolve(res);
    });
  });
};
userModel.getAvanceFinancieroCortes = (id_ficha) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT SUM(monto) avance_financiero FROM historialestados WHERE historialestados.Fichas_id_ficha = ? GROUP BY historialestados.Fichas_id_ficha",
      [id_ficha],
      (error, res) => {
        if (error) {
          reject(error);
        } else if (res.length == 0) {
          reject("vacio");
        }
        resolve(res[0]);
      }
    );
  });
};
userModel.getComponentesPgerenciales = (id_ficha) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT fichas.id_ficha, componentes.numero, componentes.nombre, componentes.presupuesto, SUM(avanceactividades.valor * partidas.costo_unitario) comp_avance, SUM(avanceactividades.valor * partidas.costo_unitario) / componentes.presupuesto * 100 porcentaje_avance_componentes FROM fichas LEFT JOIN componentes ON componentes.Fichas_id_ficha = fichas.id_ficha LEFT JOIN partidas ON partidas.componentes_id_componente = componentes.id_componente LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida LEFT JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad left join historialactividades on historialactividades.actividades_id_actividad = actividades.id_actividad WHERE fichas.id_ficha = ? and historialactividades.estado is null GROUP BY componentes.id_componente",
      id_ficha,
      (err, res) => {
        if (err) {
          reject(err);
        } else if (res.length == 0) {
          reject("vacio");
        } else {
          var costo_directo = {
            numero: "",
            nombre: "COSTO DIRECTO",
            presupuesto: 0,
            comp_avance: 0,
            porcentaje_avance_componentes: 0,
          };
          for (let i = 0; i < res.length; i++) {
            const fila = res[i];

            //calculo de costo directo
            costo_directo.presupuesto += fila.presupuesto;
            costo_directo.comp_avance += fila.comp_avance;
            costo_directo.porcentaje_avance_componentes +=
              fila.porcentaje_avance_componentes;

            //formateo
            fila.presupuesto = tools.formatoSoles(fila.presupuesto);
            fila.comp_avance = tools.formatoSoles(fila.comp_avance);
            fila.porcentaje_avance_componentes = tools.formatoSoles(
              fila.porcentaje_avance_componentes
            );
          }
          costo_directo.porcentaje_avance_componentes =
            (costo_directo.comp_avance / costo_directo.presupuesto) * 100;
          costo_directo.presupuesto = tools.formatoSoles(
            costo_directo.presupuesto
          );
          costo_directo.comp_avance = tools.formatoSoles(
            costo_directo.comp_avance
          );
          costo_directo.porcentaje_avance_componentes = tools.formatoSoles(
            costo_directo.porcentaje_avance_componentes
          );

          res.push(costo_directo);
          resolve(res);
        }
      }
    );
  });
};
userModel.getCargosById_ficha = (id_ficha) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT cargos.nombre cargo_nombre, cargos.id_cargo FROM fichas_has_accesos LEFT JOIN accesos ON accesos.id_acceso = fichas_has_accesos.Accesos_id_acceso INNER JOIN cargos ON cargos.id_Cargo = accesos.Cargos_id_Cargo WHERE fichas_has_accesos.Fichas_id_ficha = ? AND cargos_tipo_id = 3 GROUP BY cargos.id_Cargo ORDER BY cargos.nivel",
      [id_ficha],
      (err, res) => {
        if (err) {
          reject(err);
        }
        resolve(res);
      }
    );
  });
};
userModel.getUsuariosByCargo = (id_ficha, id_cargo, estado = true) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT usuarios.*, CONCAT(usuarios.apellido_paterno, ' ', usuarios.apellido_materno, ' ', usuarios.nombre) nombre_usuario, cargos.nombre cargo_nombre, fichas_has_accesos.memorandum, accesos.id_acceso FROM fichas LEFT JOIN fichas_has_accesos ON fichas_has_accesos.Fichas_id_ficha = fichas.id_ficha LEFT JOIN accesos ON accesos.id_acceso = fichas_has_accesos.Accesos_id_acceso INNER JOIN usuarios ON usuarios.id_usuario = accesos.Usuarios_id_usuario LEFT JOIN cargos ON cargos.id_Cargo = accesos.Cargos_id_Cargo WHERE fichas_has_accesos.Fichas_id_ficha = ? AND (0 = ? OR accesos.Cargos_id_Cargo = ?) AND fichas_has_accesos.habilitado = ?  AND cargos_tipo_id = 3 ORDER BY cargos.nivel , accesos.id_acceso DESC",
      [id_ficha, id_cargo, id_cargo, estado],
      (err, res) => {
        if (err) {
          reject(err);
        }
        resolve(res);
      }
    );
  });
};
userModel.getUsuariosByCargoAdmin = ({
  id_ficha,
  id_cargo,
  textoBuscado,
  estado,
}) => {
  var query = `
    SELECT
      accesos.*,
      CONCAT(accesos.apellido_paterno,
              ' ',
              accesos.apellido_materno,
              ' ',
              accesos.nombre) nombre_usuario,
      cargos.nombre cargo_nombre,
      accesos.id_acceso,
      cargos.id_cargo
    FROM
      fichas_has_accesos
    LEFT JOIN
      accesos ON accesos.id_acceso = fichas_has_accesos.Accesos_id_acceso
    LEFT JOIN
      cargos ON cargos.id_Cargo = fichas_has_accesos.cargos_id_Cargo
    `;

  var condiciones = [];
  if (id_ficha != 0) {
    condiciones.push(`(fichas_has_accesos.Fichas_id_ficha = ${id_ficha})`);
  }
  if (id_cargo != 0) {
    condiciones.push(`(accesos.Cargos_id_Cargo =  ${id_cargo})`);
  }
  if (estado != "") {
    condiciones.push(`(fichas_has_accesos.habilitado =  ${estado})`);
  }
  if (textoBuscado != "") {
    condiciones.push(
      `((accesos.nombre like \'%${textoBuscado}%\') || (accesos.apellido_paterno like \'%${textoBuscado}%\')  || (accesos.apellido_materno like \'%${textoBuscado}%\'))`
    );
  }
  if (condiciones.length > 0) {
    query += " WHERE " + condiciones.join(" AND ");
  }
  query += " GROUP BY accesos.id_acceso,id_cargo ORDER BY accesos.id_acceso  ";
  return new Promise((resolve, reject) => {
    pool.query(query, (err, res) => {
      if (err) {
        reject(err);
      }
      resolve(res);
    });
  });
};
userModel.getUsuariosByFichas = ({ id_acceso, id_ficha, id_cargo }) => {
  var query =
    "SELECT fichas_has_accesos.id, CONCAT(fichas.codigo, ' - ', cargos.nombre, ' - ', usuarios.apellido_paterno, ' ', usuarios.apellido_materno, ' ', usuarios.nombre) nombre FROM fichas_has_accesos fichas_has_accesos1 LEFT JOIN fichas ON fichas.id_ficha = fichas_has_accesos1.Fichas_id_ficha LEFT JOIN fichas_has_accesos ON fichas_has_accesos.Fichas_id_ficha = fichas.id_ficha LEFT JOIN accesos ON accesos.id_acceso = fichas_has_accesos.Accesos_id_acceso LEFT JOIN usuarios ON usuarios.id_usuario = accesos.Usuarios_id_usuario LEFT JOIN cargos ON cargos.id_Cargo = accesos.Cargos_id_Cargo";
  var condiciones = [];
  if (true) {
    condiciones.push(`(fichas_has_accesos.habilitado) and (accesos.estado)`);
  }
  if (true) {
    condiciones.push(`(fichas_has_accesos1.Accesos_id_acceso = ${id_acceso})`);
  }
  if (true) {
    condiciones.push(`(fichas_has_accesos.Accesos_id_acceso != ${id_acceso})`);
  }
  if (id_ficha.length > 0) {
    condiciones.push(`(fichas.id_ficha IN (${id_ficha}))`);
  }
  if (id_cargo.length > 0) {
    condiciones.push(`(cargos.id_Cargo IN (${id_cargo}))`);
  }

  if (condiciones.length > 0) {
    query += " WHERE " + condiciones.join(" AND ");
  }
  // return query
  return new Promise((resolve, reject) => {
    pool.query(query, (err, res) => {
      if (err) {
        reject(err);
      }
      resolve(res);
    });
  });
};
userModel.getExisteUsuario = ({ usuario }) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "select count(accesos.id_acceso)acceso from accesos where accesos.usuario = ?",
      [usuario],
      (error, res) => {
        if (error) {
          reject(error);
        }
        resolve(res ? res[0] : {});
      }
    );
  });
};
userModel.postUsuario = (data) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "INSERT INTO usuarios (nombre, apellido_paterno, apellido_materno, dni, direccion, email, celular, cpt) VALUES (?,?,?,?,?,?,?,?);",
      [
        data.nombre,
        data.apellido_paterno,
        data.apellido_materno,
        data.dni,
        data.direccion,
        data.email,
        data.celular,
        data.cpt,
      ],
      (error, res) => {
        if (error) {
          reject(error);
        }
        resolve(res);
      }
    );
  });
};
userModel.postAcceso = (
  id_cargo,
  id_usuario,
  usuario = "USER",
  password = "USER123"
) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "INSERT INTO accesos (usuario, password, estado, Cargos_id_Cargo, Usuarios_id_usuario) VALUES (?,?, 1, ?,?);",
      [usuario, password, id_cargo, id_usuario],
      (error, res) => {
        if (error) {
          reject(error);
        }
        resolve(res);
      }
    );
  });
};
userModel.postAccesoFicha = (id_ficha, id_acceso) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "INSERT INTO `fichas_has_accesos` (`Fichas_id_ficha`, `Accesos_id_acceso`) VALUES (?,?)",
      [id_ficha, id_acceso],
      (error, res) => {
        if (error) {
          reject(error);
        }
        resolve(res);
      }
    );
  });
};
userModel.putUsuarioMemo = (memorandum, id_acceso, id_ficha) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "UPDATE fichas_has_accesos SET memorandum = ? WHERE fichas_has_accesos.Accesos_id_acceso = ? AND fichas_has_accesos.Fichas_id_ficha = ?",
      [memorandum, id_acceso, id_ficha],
      (error, res) => {
        if (error) {
          reject(error);
        }
        resolve(res);
      }
    );
  });
};
userModel.ultimoFinancieroData = ({ id_ficha }) => {
  return new Promise((resolve, reject) => {
    var query = `
     SELECT
    curva_s.*,
    CONCAT(accesos.nombre,
            ' ',
            accesos.apellido_paterno) usuario_nombre,
    cargos.nombre cargo_nombre
FROM
    curva_s
        LEFT JOIN
    accesos ON accesos.id_acceso = curva_s.ultimo_editor_idacceso
        LEFT JOIN
    fichas_has_accesos ON fichas_has_accesos.Accesos_id_acceso = accesos.id_acceso
        LEFT JOIN
    cargos ON cargos.id_Cargo = fichas_has_accesos.Cargos_id_Cargo
    WHERE
        curva_s.fichas_id_ficha = ${id_ficha}
    ORDER BY financiero_fecha_update DESC
    LIMIT 1
    `;
    pool.query(query, (error, res) => {
      if (error) {
        console.log(error);
        reject(error);
      }
      resolve(res ? res[0] : {});
    });
  });
};

module.exports = userModel;
