const userModel = {
  Redondear: (data) => {
    data = Math.round(data * 10000000000) / 10000000000;
    data = Math.round(data * 10000) / 10000;
    return data;
  },

  formatoSoles: (data, decimales = 2, soloPositivos = false) => {
    data = Number(data);
    data = userModel.Redondear(data);
    if (isNaN(data) || data === 0) {
      data = "-";
    }
    if (data < 0 && soloPositivos) {
      return "-";
    }
    if (data < 1) {
      data = data.toLocaleString("es-PE", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 4,
      });
    } else {
      data = data.toLocaleString("es-PE", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    }
    return data;
  },

  formatoSolesPresicion: (data) => {
    data = Number(data);
    data = userModel.Redondear(data);
    return data;
  },

  formatoPorcentaje: (data) => {
    data = Number(data);
    data = userModel.Redondear(data);
    if (isNaN(data)) {
      data = 0;
    } else {
      data = data.toFixed(2);
    }
    return Number(data);
  },

  rome: (N, s, b, a, o, t) => {
    t = (N / 1e3) | 0;
    N %= 1e3;
    for (s = b = "", a = 5; N; b++, a ^= 7)
      for (o = N % a, N = (N / a) ^ 0; o--; )
        s = "IVXLCDM".charAt(o > 2 ? b + N - (N &= ~1) + (o = 1) : b) + s;
    return Array(t + 1).join("M") + s;
  },

  monthNames: [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Setiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ],

  shortMonthNames: [
    "ene",
    "feb",
    "mar",
    "abr",
    "may",
    "jun",
    "jul",
    "ago",
    "sep",
    "oct",
    "nov",
    "dic",
  ],

  weekDay: ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa"],

  ColoresRandom: () => {
    function populate(a) {
      const hexValues = "0123456789abcdef".split("");
      for (let i = 0; i < 6; i++) {
        const x = Math.round(Math.random() * 14);
        const y = hexValues[x];
        a += y;
      }
      return a;
    }

    const newColor1 = populate("#");
    const newColor2 = populate("#");
    const angle = Math.round(Math.random() * 360);

    return `linear-gradient(${angle}deg, ${newColor1}, ${newColor2})`;
  },
  ColoresRandomRGB: () => {
    function populate(a) {
      a += "(";
      for (let i = 0; i < 3; i++) {
        const x = Math.floor(Math.random() * (255 - 200 + 1) + 200);

        a += x;
        if (i < 2) {
          a += ",";
        }
      }
      a += ")";
      return a;
    }
    const newColor1 = populate("rgb");
    const newColor2 = populate("rgb");
    const angle = Math.round(Math.random() * 360);
    return `linear-gradient(${angle}deg, ${newColor1}, ${newColor2})`;
  },

  fechaLargaCorta: (MyDate) => {
    const MyDateString =
      MyDate.getFullYear() +
      "-" +
      ("0" + (MyDate.getMonth() + 1)).slice(-2) +
      "-" +
      ("0" + MyDate.getDate()).slice(-2);
    return MyDateString;
  },

  fechaActual: () => {
    const today = new Date();
    const dd = today.getDate();
    const mm = today.getMonth() + 1; // January is 0!
    const yyyy = today.getFullYear();
    if (dd < 10) {
      dd = "0" + dd;
    }
    if (mm < 10) {
      mm = "0" + mm;
    }
    return yyyy + "-" + mm;
  },

  FechaActualCompleta: () => {
    const fecha = new Date();
    const anio = fecha.getFullYear();
    const mes = fecha.getMonth() + 1;
    const dia = fecha.getDate();

    if (dia < 10) {
      dia = "0" + dia;
    }
    if (mes < 10) {
      mes = "0" + mes;
    }

    return anio + "-" + mes + "-" + dia;
  },

  datetime: () => {
    const today = new Date();
    const date =
      today.getDate() +
      "-" +
      (today.getMonth() + 1) +
      "-" +
      today.getFullYear();
    const time =
      today.getHours() + "-" + today.getMinutes() + "-" + today.getSeconds();
    return date + "_" + time;
  },
};

module.exports = userModel;
