import { format, parse } from "date-fns";
import { da, es } from "date-fns/locale";

// Crear un mapa de nombres cortos para los meses en español
const mesesCortos = [
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
];

export interface FormatCurrencyOptions {
  style?: string;
}

export const formatCurrency = (
  value: string,
  style: FormatCurrencyOptions["style"] = undefined
): string => {
  const asNumber = value ? value.replace(/[^0-9-]+/g, "") : "0";
  let lastTwo: string, rest: string;

  const count = asNumber.length;
  if (count < 2) {
    return asNumber;
  } else {
    lastTwo = asNumber.slice(-2);
    rest = asNumber.slice(0, -2)
      ? asNumber.slice(0, -2).replace(/^(-?)0+/, "$1")
      : "0";
  }

  return `$${
    rest.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") || "0"
  }.${lastTwo}`;
};

export const CurrencyMxs = (value: number, currency = "MXN") => {
  // Determinar el estilo dependiendo del valor de `currency`
  const isCurrency = currency && currency !== "none";

  return new Intl.NumberFormat("es-MX", {
    style: isCurrency ? "currency" : "decimal",
    currency: isCurrency ? currency : undefined,
    minimumFractionDigits: isCurrency ? 2 : 0, // Ajusta los decimales según el caso
    maximumFractionDigits: isCurrency ? 2 : 0,
  }).format(value);
};

export interface FormatDateOptions {
  withTime?: boolean;
}

export const formatDate = (
  fecha: string,
  withTime: boolean = false
): string => {
  const utcDate = new Date(
    Date.UTC(
      parseInt(fecha.substring(0, 4)), // Año
      parseInt(fecha.substring(5, 7)) - 1, // Mes (0-indexado)
      parseInt(fecha.substring(8, 10)), // Día
      withTime ? parseInt(fecha.substring(11, 13)) : 0, // Horas
      withTime ? parseInt(fecha.substring(14, 16)) : 0, // Minutos
      withTime ? parseInt(fecha.substring(17, 19)) : 0 // Segundos
    )
  );

  // Formatear día, mes y año manualmente
  const dia: string = utcDate.getUTCDate().toString().padStart(2, "0");
  const mes: string = mesesCortos[utcDate.getUTCMonth()]; // Obtener el mes corto sin puntos
  const año: number = utcDate.getUTCFullYear();

  if (withTime) {
    // Obtener horas y minutos correctamente formateados
    const horas: string = utcDate.getUTCHours().toString().padStart(2, "0");
    const minutos: string = utcDate.getUTCMinutes().toString().padStart(2, "0");
    return `${dia} ${mes}, ${año} ${horas}:${minutos}`;
  }

  return `${dia} ${mes}, ${año}`;
};

// start = 2024-11-04 14:22:00  transformar a 04 nov. 2024 14:22
// end = 2024-11-14 14:22:00 transformar a 14 nov, 2024 14:22
interface DateWithTimeInput {
  date: string | null | undefined;
}

interface DateParts {
  day: string;
  month: string;
  year: string;
  hour: string;
  minute: string;
}

const dateWhithTime = (date: DateWithTimeInput["date"]): string | null => {
  if (!date) return null;

  const startDate: string[] = `${date}`.split(" ");
  const firsDate: string[] = `${startDate[0]}`.split("-");
  const firstTime: string[] = `${startDate[1]}`.split(":");
  return `${firsDate[2]} ${mesesCortos[parseInt(firsDate[1]) - 1]}. ${
    firsDate[0]
  } ${firstTime[0]}:${firstTime[1]}`;
};

export interface FormatDateTimeInput {
  dateStart: string | null | undefined;
  dateEnd: string | null | undefined;
}

export interface FormatDateTimeResult {
  init: string | null;
  end: string | null;
  formatted: string;
}

export const formatDateTime = (
  dateStart: FormatDateTimeInput["dateStart"],
  dateEnd: FormatDateTimeInput["dateEnd"]
): string => {
  const init: string | null = dateWhithTime(dateStart);
  const end: string | null = dateWhithTime(dateEnd);
  return `${init || "Sin fecha"} - ${end || "Sin fecha"}`;
};
