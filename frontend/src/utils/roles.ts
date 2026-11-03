import { Role } from "../types";

export const homeFor = (role: Role) => (role === "candidato" ? "/painel" : role === "mentor" ? "/mentor" : "/admin");
