export const CURRENCY = "AOA"; // altere aqui a moeda das mentorias
export const NIVEIS = ["Ensino secundário", "Licenciatura", "Mestrado", "Doutoramento"];
export const PAISES = [
  "África do Sul", "Alemanha", "Angola", "Argélia", "Argentina", "Austrália", "Áustria",
  "Bélgica", "Brasil", "Cabo Verde", "Canadá", "Chile", "China", "Colômbia", "Coreia do Sul",
  "Cuba", "Dinamarca", "Egito", "Emirados Árabes Unidos", "Espanha", "Estados Unidos",
  "Finlândia", "França", "Gana", "Grécia", "Guiné-Bissau", "Índia", "Indonésia", "Irlanda",
  "Islândia", "Itália", "Japão", "Luxemburgo", "Marrocos", "Moçambique", "Namíbia",
  "Noruega", "Nova Zelândia", "Países Baixos", "Polónia", "Portugal", "Quénia", "Reino Unido",
  "República Democrática do Congo", "Rússia", "São Tomé e Príncipe", "Senegal", "Suécia",
  "Suíça", "Tanzânia", "Timor-Leste", "Tunísia", "Turquia", "Ucrânia", "Uruguai", "Zâmbia",
  "Zimbabué",
];
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
