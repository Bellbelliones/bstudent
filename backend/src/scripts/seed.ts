import bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";
import { pool } from "../config/db";

async function user(nome: string, email: string, senha: string, role: string) {
  const hash = await bcrypt.hash(senha, 10);
  const r = await pool.query(
    `INSERT INTO utilizador (nome,email,senha_hash,role) VALUES ($1,$2,$3,$4)
     ON CONFLICT (email) DO UPDATE SET nome=EXCLUDED.nome RETURNING id`,
    [nome, email, hash, role]
  );
  await pool.query(`INSERT INTO ${role} (utilizador_id) VALUES ($1) ON CONFLICT (utilizador_id) DO NOTHING`, [r.rows[0].id]);
  return r.rows[0].id as string;
}

async function main() {
  const seeds = path.resolve(__dirname, "../../../database/seeds");
  for (const f of fs.readdirSync(seeds).filter((x) => x.endsWith(".sql")).sort()) {
    await pool.query(fs.readFileSync(path.join(seeds, f), "utf8"));
  }
  const adminId = await user("Administrador BStudent", "admin@bstudent.com", "Admin12345", "administrador");
  await user("Marta Domingos", "candidato@bstudent.com", "Candidato12345", "candidato");
  await user("Paulo Neto", "mentor@bstudent.com", "Mentor12345", "mentor");

  const cat = async (nome: string) => (await pool.query("SELECT id FROM categoria WHERE nome=$1", [nome])).rows[0].id;
  if (!(await pool.query("SELECT 1 FROM bolsa LIMIT 1")).rowCount) {
    // Dados de demonstração (fictícios)
    const bolsas = [
      ["Bolsa Excelência em Engenharia", "Apoio completo para licenciatura em engenharia, com propinas e alojamento.", "Portugal", "Licenciatura", "Engenharia", 21],
      ["Mestrado em Dados e Inteligência Artificial", "Mestrado de dois anos com estágio em laboratório de investigação.", "Alemanha", "Mestrado", "Tecnologia", 9],
      ["Bolsa Saúde Global", "Programa para estudantes de ciências da saúde com foco em saúde pública.", "Brasil", "Licenciatura", "Saúde", 35],
      ["Programa de Liderança e Negócios", "Mestrado em gestão com mentoria de executivos e bolsa parcial.", "Reino Unido", "Mestrado", "Negócios", 60],
      ["Bolsa Artes e Cultura Lusófona", "Licenciatura em artes e comunicação para estudantes de países lusófonos.", "Portugal", "Licenciatura", "Artes e Humanidades", 14],
    ] as const;
    for (const [t, d, p, n, c, dias] of bolsas) {
      await pool.query(
        "INSERT INTO bolsa (titulo,descricao,pais,nivel_academico,categoria_id,data_limite,criado_por) VALUES ($1,$2,$3,$4,$5,CURRENT_DATE + $6::int,$7)",
        [t, d, p, n, await cat(c), dias, adminId]
      );
    }
    const mentor = (await pool.query("SELECT m.id FROM mentor m JOIN utilizador u ON u.id=m.utilizador_id WHERE u.email='mentor@bstudent.com'")).rows[0].id;
    const mentorias = [
      ["Carta de motivação para bolsas de engenharia", "Duas sessões para estruturar e rever a sua carta de motivação.", 12000, "online", "Engenharia"],
      ["Preparação de candidatura a mestrados em tecnologia", "Revisão de CV, projetos e entrevista para programas de dados e IA.", 25000, "online", "Tecnologia"],
      ["Entrevista para bolsas de negócios", "Simulação de entrevista com feedback individual.", 18000, "hibrida", "Negócios"],
    ] as const;
    for (const [t, d, preco, mod, c] of mentorias) {
      await pool.query(
        "INSERT INTO mentoria (mentor_id,categoria_id,titulo,descricao,preco,modalidade) VALUES ($1,$2,$3,$4,$5,$6)",
        [mentor, await cat(c), t, d, preco, mod]
      );
    }
  }
  console.log("Seed concluído.\n admin@bstudent.com / Admin12345\n candidato@bstudent.com / Candidato12345\n mentor@bstudent.com / Mentor12345");
  await pool.end();
}
main().catch((e) => { console.error(e); process.exit(1); });
