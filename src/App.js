const express = require('express');
const app = express();

const morgan = require('morgan');
const bodyParser = require('body-parser');
const morganBody = require('morgan-body');

const cors =require('cors');

const PORT = process.env.PORT || 9000


//open cors
var whitelist = ['http://localhost:9009']
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}
// app.use(cors(corsOptions))
app.use(cors())
//settings
app.set('port',PORT);

//middleares
app.use(morgan('dev'));
	//entender jason
app.use(bodyParser.json({limit: '1mb'}));
morganBody(app);

//static
app.use('/static', express.static(__dirname + '/public'));
 
//routes 
require('./api/Admin/get/routes/r.get.obras')(app);
require('./api/Admin/get/routes/r.get.users')(app);
require('./api/Admin/post/routes/r.post.obras')(app);
require('./api/Admin/post/routes/r.post.users')(app);
require('./api/Admin/put/routes/r.put.users')(app);
require('./api/Admin/delete/routes/r.delete.obras')(app);


require('./api/Interfaz/post/routes/r.post.interfaz')(app);
require('./api/Interfaz/get/routes/r.get.interfaz')(app);
require('./api/Interfaz/put/routes/r.put.interfaz')(app);

require('./api/Inicio/get/routes/r.get.Inicio')(app);
require('./api/Inicio/post/routes/r.post.Inicio')(app);
require('./api/Inicio/delete/routes/r.del.Inicio')(app);

require('./api/ProcesosFisicos/get/routes/r.get.historial')(app);
require('./api/ProcesosFisicos/get/routes/r.get.historialImagenes')(app);
require('./api/ProcesosFisicos/get/routes/r.get.materiales')(app);
require('./api/ProcesosFisicos/get/routes/r.get.pFisicos')(app);
require('./api/ProcesosFisicos/get/routes/r.get.valGeneral')(app);
require('./api/ProcesosFisicos/get/routes/r.get.gantt')(app);


require('./api/ProcesosFisicos/post/routes/r.post.pFisicos')(app);
require('./api/ProcesosFisicos/put/routes/r.put.pFisicos')(app);


require('./api/ProcesosFinancieros/post/routes/r.post.Pfinancieros')(app);
require('./api/ProcesosFinancieros/get/routes/r.get.Pfinancieros')(app);

require('./api/Reportes/get/routes/r.get.reportes')(app);
require('./api/Reportes/post/routes/r.post.reportes')(app);

require('./api/GestionTareas/get/routes/r.get.GT')(app);
require('./api/GestionTareas/post/routes/r.post.GT')(app);
require('./api/GestionTareas/put/routes/r.put.GT')(app);



app.listen(app.get('port'),()=>{
	console.log('running in port', PORT);
})