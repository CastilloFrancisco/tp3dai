class ValidacionesHelper {

  getIntegerOrDefault = (value, defaultValue) => {
    const parsed = parseInt(value, 10);

    if (isNaN(parsed)) {
      return defaultValue;
    }

    return parsed;
  };

  getStringOrDefault = (value, defaultValue) => {
    if (value === undefined || value === null) {
      return defaultValue;
    }

    return String(value);
  };

  getDateOrDefault = (value, defaultValue) => {
    if (value === undefined || value === null) {
      return defaultValue;
    }

    const fecha = new Date(value);

    if (isNaN(fecha.getTime())) {
      return defaultValue;
    }

    return fecha;
  };

  getBooleanOrDefault = (value, defaultValue) => {
    if (typeof value === "boolean") {
      return value;
    }

    if (typeof value === "string") {
      const lower = value.toLowerCase();

      if (lower === "true") return true;
      if (lower === "false") return false;
    }

    return defaultValue;
  };

  isEmail = (value) => {
    if (typeof value !== "string") {
      return false;
    }

    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(value);
  };

}

export default new ValidacionesHelper();