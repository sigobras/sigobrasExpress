class BaseModel {
  static update(tableName, values, conditions, allNulls = false) {
    const columnUpdates = Object.entries(values)
      .filter(
        ([key, value]) => allNulls || (value !== undefined && value !== "")
      )
      .map(([key, value]) =>
        allNulls && value === "" ? `${key} = null` : `${key} = '${value}'`
      )
      .join(", ");

    const whereClause = conditions.join(" AND ");

    const query = `UPDATE ${tableName} SET ${columnUpdates} WHERE ${whereClause}`;
    console.log("query", query);
    return query;
  }

  static updateOnDuplicateKey(tableName, dataList) {
    const firstEntry = dataList[0];
    const columns = Object.keys(firstEntry).join(", ");
    const duplicateKeys = Object.keys(firstEntry)
      .map((column) => `${column}=VALUES(${column})`)
      .join(", ");

    const valuesList = dataList
      .map((data) => {
        const values = Object.values(data)
          .map((value) => (value === undefined ? value : `'${value}'`))
          .join(", ");
        return `(${values})`;
      })
      .join(", ");

    const query = `
      INSERT INTO ${tableName} (${columns})
      VALUES ${valuesList}
      ON DUPLICATE KEY UPDATE ${duplicateKeys}`;

    return query;
  }

  static delete(tableName, conditions) {
    if (conditions.length === 0) return "";
    const whereClause = conditions.join(" AND ");
    return `DELETE FROM ${tableName} WHERE ${whereClause}`;
  }

  static insert(tableName, data) {
    const columns = Object.keys(data).join(", ");
    const values = Object.values(data)
      .map((value) => `'${value}'`)
      .join(", ");
    return `INSERT INTO ${tableName}(${columns}) VALUES (${values})`;
  }

  static select(tableName, columnsData, conditions) {
    const columnSelection =
      columnsData && columnsData.length > 0
        ? columnsData
            .map(({ columna, nombre, format }) => {
              nombre = nombre || columna;
              columna =
                format === "fecha"
                  ? `DATE_FORMAT(${columna}, '%Y-%m-%d')`
                  : columna;
              return `${columna} ${nombre}`;
            })
            .join(", ")
        : "*";

    const whereClause =
      conditions && conditions.length
        ? `WHERE ${conditions.join(" AND ")}`
        : "";

    return `SELECT ${columnSelection} FROM ${tableName} ${whereClause}`;
  }
}

module.exports = BaseModel;
