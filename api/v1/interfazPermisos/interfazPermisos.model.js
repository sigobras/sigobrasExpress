const queryBuilder = require("../../libs/queryBuilder");

const DB = {};

DB.obtenerDatos = async ({ id_cargos }) => {
  try {
    const cargos = id_cargos !== "" ? id_cargos.split(",") : [];
    const cargosColumnas = cargos.map((cargo) => {
      return `sum(IF(cargos_id_cargo = ${cargo}, activo, 0)) cargo_${cargo}`;
    });

    const query = new queryBuilder()
      .select([
        ["interfaz_principales.nombre", "interfaz_nombre"],
        "interfaz_secundarias.id",
        ["interfaz_secundarias.nombre", "funcionalidad_nombre"],
        "interfaz_secundarias.nombre_clave",
        ...cargosColumnas
      ])
      .from("interfaz_principales")
      .leftJoin(`
        interfaz_secundarias ON interfaz_secundarias.interfaz_principales_id = interfaz_principales.id
        LEFT JOIN interfaz_permisocargo ON interfaz_permisocargo.interfaz_secundarias_id = interfaz_secundarias.id
      `)
      .groupBy("interfaz_secundarias.id")
      .orderBy("interfaz_principales.id,interfaz_secundarias.id")
      .toString();

    const res = await pool.query(query);
    return res;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

DB.actualizarDatos = async (data) => {
  try {
    const query = new queryBuilder("interfaz_permisocargo")
      .insert(data)
      .merge()
      .toString();

    const res = await pool.query(query);
    return res;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

DB.obtenerPermisoInterfaz = async ({ id_ficha, id_acceso, nombres_clave }) => {
  try {
    const nombres_claveList = nombres_clave.split(",");
    const nombres_claveProcesada = nombres_claveList.map((nombre_clave) => {
      return `sum(if(nombre_clave='${nombre_clave.trim()}', activo, 0)) ${nombre_clave.trim()}`;
    });

    const query = new queryBuilder("fichas_has_accesos")
      .select(nombres_claveProcesada)
      .leftJoin(`
        interfaz_permisocargo ON interfaz_permisocargo.cargos_id_Cargo = fichas_has_accesos.cargos_id_Cargo
        INNER JOIN interfaz_secundarias ON interfaz_secundarias.id = interfaz_secundarias_id
      `)
      .where([
        `Fichas_id_ficha = ${id_ficha}`,
        `Accesos_id_acceso = ${id_acceso}`
      ])
      .toString();

    const res = await pool.query(query);
    return res ? res[0] : {};
  } catch (error) {
    console.log(error);
    throw error;
  }
};

module.exports = DB;
