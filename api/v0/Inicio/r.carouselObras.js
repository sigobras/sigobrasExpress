const User = require("./m.carouselObras");
const { v4: uuidv4 } = require("uuid");
const multer = require("multer");
const path = require("path");
const { uploadFileToS3 } = require("../../../utils/s3");

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type, only JPEG and PNG is allowed!"), false);
  }
};

const uploadObraImagen = multer({
  fileFilter,
  storage: multer.memoryStorage(),
});

const postObraImagen = async (req, res) => {
  const {
    file,
    body: { codigoObra, descripcion, id_acceso, id_ficha },
  } = req;

  const fileName = file.originalname;
  const fileType = file.mimetype;
  const extension = path.extname(file.originalname);

  if (extension !== ".jpg" && extension !== ".png" && extension !== ".jpeg") {
    res.status(400).json({ message: "Formato de archivo equivocado" });
    return;
  }

  const uniqueID = uuidv4();
  const ruta = `${codigoObra}/IMAGENES/PORTADA/${uniqueID}${extension}`;

  try {
    const fileURL = await uploadFileToS3(file.buffer, ruta, fileType);
    const request = {
      url: fileURL,
      descripcion,
      id_acceso,
      id_ficha,
    };
    const response = await User.postImagenesObra(request);
    res.status(200).json({
      fileName,
      fileURL,
      response,
    });
  } catch (err) {
    res.status(400).json({ error: err.code });
  }
};

const getObraImagen = async (req, res) => {
  try {
    const data = await User.getImagenesObra(req.query);
    res.json(data);
  } catch (err) {
    res.status(404).json({ error: err.code });
  }
};

module.exports = function (app) {
  app.post("/obrasImagenes", uploadObraImagen.single("imagen"), postObraImagen);
  app.get("/obrasImagenes", getObraImagen);
};
