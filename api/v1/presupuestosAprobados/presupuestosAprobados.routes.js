const express = require("express");
var fs = require("fs");
const { uploadFileToS3 } = require("../../../utils/s3");

const multer = require("multer");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const { codigo } = req.body;
    const dir = `${publicFolder}${codigo}/modificacion_presupuesto/`;
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    return cb(null, dir);
  },
  filename: (req, file, cb) => {
    var extensionArchivo = file.originalname.split(".").pop();
    const { resolucion } = req.body;
    var fileName = `${resolucion}.${extensionArchivo}`;
    cb(null, fileName);
  },
});
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type, only JPEG and PNG is allowed!"), false);
  }
};
const upload = multer({ storage });
const uploadTest = multer({
  fileFilter,
  storage: multer.memoryStorage(),
});

const Controller = require("./presupuestosAprobados.controller");
const ControllerAccesos = require("../accesos/accesos.controller");
const procesarErrores = require("../../libs/errorHandler").procesarErrores;

const obrasRouter = express.Router();
//resumen
obrasRouter.get(
  "/",
  procesarErrores(async (req, res) => {
    var response = await Controller.obtenerPresupuestosAprobados(req.query);
    res.json(response);
  })
);
obrasRouter.post(
  "/",
  upload.single("archivo"),
  procesarErrores(async (req, res) => {
    var codigo = req.body.codigo;
    delete req.body.codigo;
    await Controller.guardarPresupuestoAprobado({
      ...req.body,
      archivo: req.file
        ? `/static/${codigo}/modificacion_presupuesto/${req.file.filename}`
        : "",
    });
    res.json({ message: "Registro exitoso" });
  })
);
obrasRouter.put(
  "/:id",
  upload.single("archivo"),
  procesarErrores(async (req, res) => {
    var codigo = req.body.codigo;
    delete req.body.codigo;
    await Controller.actualizarPresupuestoAprobado({
      ...req.params,
      ...req.body,
      archivo: req.file
        ? `/static/${codigo}/modificacion_presupuesto/${req.file.filename}`
        : "",
    });
    res.json({ message: "Registro exitoso" });
  })
);
obrasRouter.delete(
  "/:id",
  procesarErrores(async (req, res) => {
    var response = await Controller.eliminarPresupuesto(req.params);
    res.json(response);
  })
);
obrasRouter.post("/test", uploadTest.single("file"), async (req, res) => {
  const { file } = req;
  const fileName = file.originalname;
  const fileType = file.mimetype;

  try {
    const fileURL = await uploadFileToS3(
      file.buffer,
      "test/" + fileName,
      fileType
    );
    //database logic
    console.log("working", { fileURL });
    res.status(200).json({
      fileName,
      fileURL,
    });
  } catch (err) {
    return res.status(500).send(err);
  }
});
module.exports = obrasRouter;
