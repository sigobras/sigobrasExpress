const User = require('../models/m.get.curvaS');
module.exports = (app) => {
    app.post('/getAnyosEjecutados', async (req, res) => {
        try {
            var data = await User.getAnyosEjecutados(req.body.id_ficha)
            res.json(data)
        } catch (error) {
            res.status(200).json(error)
        }
    });
    app.post('/getPeriodosEjecutados', async (req, res) => {
        try {
            // revision de registro en el anyo requerido
            var data = await User.getRegistrosAnyoCurvaS(req.body.anyo, req.body.id_ficha)
            if (data.length == 0) {
                var data = await User.getPeriodosEjecutados(req.body.anyo, req.body.id_ficha)
                for (let i = 0; i < data.length; i++) {
                    var fecha_final = ""
                    const element = data[i];
                    if (i < data.length - 1) {
                        fecha_final = data[i + 1].fecha_inicial

                    } else {
                        Date.prototype.formatMMDDYYYY = function () {
                            return this.getFullYear() +
                                "-" + (this.getMonth() + 1) +
                                "-" + this.getDate();
                        }

                        fecha_final = (new Date(parseInt(req.body.anyo) + 1, 0, 1)).formatMMDDYYYY()
                    }
                    var req_montoEjecutado = await User.getMontoEjecutadoPeriodo(element.fecha_inicial, fecha_final, req.body.id_ficha)
                    data[i].ejecutado_monto = req_montoEjecutado[0].ejecutado_monto
                }
                res.json({ data, message: "consulta exitosa" })
            } else {
                res.json({ data: [], message: "se encontraron registros anteriores" })
            }

        } catch (error) {
            console.log(error);
            res.status(200).json(error)
        }
    });
    app.post('/postDataCurvaS', async (req, res) => {
        try {
            var dataProcesada = []
            req.body.forEach(element => {
                dataProcesada.push([
                    element.fecha_inicial,
                    element.programado_monto,
                    element.financiero_monto,
                    element.ejecutado_monto,
                    element.observacion,
                    element.estado_codigo,
                    element.fichas_id_ficha
                ])
            });
            var data = await User.postDataCurvaS(dataProcesada)
            console.log(data);
            if (data.affectedRows > 0) {
                res.json({ message: "registro exitoso" })
            } else {
                res.json({ message: "hubo un problema con el registro" })
            }
        } catch (error) {
            console.log(error);
            res.status(200).json(error)
        }
    });
    app.post('/getDataCurvaS', async (req, res) => {
        try {

            var data = await User.getDataCurvaS(req.body.id_ficha)
            res.json(data)
        } catch (error) {
            res.status(200).json(error)
        }
    });
    app.post('/putFinancieroCurvaS', async (req, res) => {
        try {
            var data = await User.putFinancieroCurvaS(req.body.id, req.body.financiero_monto)
            res.json(data)
        } catch (error) {
            res.status(200).json(error)
        }
    });
    app.post('/putEjecutadoMonto', async (req, res) => {
        try {
            var req_fecha_final = await User.getFechaFinalCurvaS(req.body.fecha_inicial)
            // se genera fecha final
            var fecha_final = ""
            if (req_fecha_final[0]) {
                fecha_final = req_fecha_final[0].fecha_final
            } else {
                var fecha = req.body.fecha_inicial.split("-")
                var anyo = fecha[0]
                console.log("anyo", anyo);
                fecha_final = (Number(anyo) + 1) + "-01-01"
            }
            //se obtiene el monto ejecutado de ese periodo
            req_montoEjecutado = await User.getMontoEjecutadoPeriodo(req.body.fecha_inicial, fecha_final, req.body.id_ficha)
            //se actualiza el monto ejecutado en la curva s
            req_updataeMontoEjecutado = await User.putEjecutadoCurvaS(req_montoEjecutado[0].ejecutado_monto,req.body.fecha_inicial)
            res.json(req_montoEjecutado[0])
        } catch (error) {
            console.log(error);
            res.status(200).json(error)
        }
    });
}