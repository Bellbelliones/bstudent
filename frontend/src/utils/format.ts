export const CURRENCY = "AOA"; // altere aqui a moeda das mentorias
export const NIVEIS = ["Ensino secundário", "Licenciatura", "Mestrado", "Doutoramento"];
export const MODALIDADES = [
  { value: "online", label: "Online" },
  { value: "presencial", label: "Presencial" },
  { value: "hibrida", label: "Híbrida" },
];

export const formatMoney = (v: number | string) =>
  new Intl.NumberFormat("pt-AO", { style: "currency", currency: CURRENCY, maximumFractionDigits: 0 }).format(Number(v));

export const formatDate = (iso: string) =>
  new Date(iso.slice(0, 10) + "T00:00:00").toLocaleDateString("pt-PT", { day: "2-digit", month: "short", year: "numeric" });

export const daysLeft = (iso: string) =>
  Math.ceil((new Date(iso.slice(0, 10) + "T00:00:00").getTime() - new Date().setHours(0, 0, 0, 0)) / 86400000);

export const modalidadeLabel = (v: string) => MODALIDADES.find((m) => m.value === v)?.label ?? v;
