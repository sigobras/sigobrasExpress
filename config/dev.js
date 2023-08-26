module.exports = {
  jwt: {
    secreto: process.env.JWT_SECRET,
    tiempoDeExpiración: "24h",
  },
};
