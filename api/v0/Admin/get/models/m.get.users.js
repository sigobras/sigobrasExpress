let userModel = {};

userModel.getUsuarios = () => {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT usuarios.*, accesos.usuario FROM usuarios LEFT JOIN (SELECT MAX(id_acceso) id_acceso,accesos.Usuarios_id_usuario id_usuario FROM accesos GROUP BY accesos.Usuarios_id_usuario) acceso_max ON acceso_max.id_usuario = usuarios.id_usuario LEFT JOIN accesos ON accesos.id_acceso = acceso_max.id_acceso GROUP BY usuarios.id_usuario",
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
userModel.getUsuariosConAcceso = (id_ficha) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "select * from (SELECT usuarios.*, accesos.usuario, accesos.id_acceso,max(if(fichas_id_ficha =?,true,false)) seleccionado FROM usuarios INNER JOIN (SELECT MAX(id_acceso) id_acceso, accesos.Usuarios_id_usuario id_usuario FROM accesos GROUP BY accesos.Usuarios_id_usuario) acceso_max ON acceso_max.id_usuario = usuarios.id_usuario LEFT JOIN accesos ON accesos.id_acceso = acceso_max.id_acceso left join fichas_has_accesos on fichas_has_accesos.Accesos_id_acceso = accesos.id_acceso GROUP BY usuarios.id_usuario) usuarios_seleccionados where NOT seleccionado",
      [id_ficha],
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

userModel.getCargos = () => {
  return new Promise((resolve, reject) => {
    pool.query("select *from cargos", (error, res) => {
      if (error) {
        reject(error);
      } else {
        resolve(res);
      }
    });
  });
};
userModel.getCargosLimitado = () => {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT * FROM cargos WHERE cargos_tipo_id = 3;",
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
userModel.getUsuariosAcceso = () => {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT usuarios.id_usuario, usuarios.nombre, usuarios.apellido_paterno, usuarios.apellido_materno, usuarios.dni, usuarios.direccion, usuarios.email, usuarios.celular, usuarios.cpt FROM usuarios INNER JOIN accesos ON accesos.Usuarios_id_usuario = usuarios.id_usuario",
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
userModel.getUsuariosAcceso = () => {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT usuarios.id_usuario, usuarios.nombre, usuarios.apellido_paterno, usuarios.apellido_materno, usuarios.dni, usuarios.direccion, usuarios.email, usuarios.celular, usuarios.cpt FROM usuarios INNER JOIN accesos ON accesos.Usuarios_id_usuario = usuarios.id_usuario",
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
userModel.getUsuarioData = (id_usuario) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT * FROM usuarios WHERE id_usuario = ?",
      [id_usuario],
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

module.exports = userModel;
