let BaseModel = {};
BaseModel.update = (tabla, valores, condiciones) => {
  var query = `UPDATE ${tabla} SET `;
  var keys = Object.keys(valores);
  for (let i = 0; i < keys.length; i++) {
    var columna = keys[i];
    if (valores[columna] != undefined && valores[columna] != "") {
      query += `${columna} = '${valores[columna]}',`;
    }
  }
  query = query.slice(0, -1);
  query += " WHERE " + condiciones.join(" AND ");
  return query;
};
BaseModel.updateOnDuplicateKey = (tabla, listData) => {
  var listValues = "";
  var columnas = "";
  var duplicateKeys = "";

  for (let i = 0; i < listData.length; i++) {
    const valores = listData[i];
    var keys = Object.keys(valores);

    var values = "";
    for (let j = 0; j < keys.length; j++) {
      var columna = keys[j];
      if (valores[columna] == undefined) {
        values += `${valores[columna]},`;
      } else {
        values += `'${valores[columna]}',`;
      }
      if (i == 0) {
        columnas += `${columna},`;
        duplicateKeys += `${columna}=values(${columna}),`;
      }
    }
    values = values.slice(0, -1);
    listValues += `(${values}),`;
  }
  columnas = columnas.slice(0, -1);
  duplicateKeys = duplicateKeys.slice(0, -1);
  listValues = listValues.slice(0, -1);
  var query = `
    INSERT INTO ${tabla} (${columnas} )
    VALUES ${listValues}
    on duplicate key update  ${duplicateKeys}`;
  return query;
};
BaseModel.delete = (tabla, condiciones) => {
  if (condiciones.length == 0) return "";
  var query = `DELETE FROM ${tabla}`;
  query += " WHERE " + condiciones.join(" AND ");
  return query;
};
module.exports = BaseModel;