const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");

const app = express();

app.use(cors());
app.use(express.json());

// 🔌 CONEXÃO COM MYSQL
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "28042015",
  database: "cetech",
});

db.connect((err) => {
  if (err) {
    console.log("❌ Erro ao conectar:", err);
  } else {
    console.log("🔥 MySQL conectado!");
  }
});

// 📌 LISTAR CLIENTES
app.get("/clientes", (req, res) => {
  db.query("SELECT * FROM clientes ORDER BY id DESC", (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

// 📌 CADASTRAR CLIENTE
app.post("/clientes", (req, res) => {
  console.log("📥 BODY:", req.body);

  const {
    nome,
    sistema,
    custo,
    venda,
    dia_vencimento_gdoor,
    dia_vencimento_cetech,
  } = req.body;

  const sql = `
    INSERT INTO clientes 
    (nome, sistema, custo, venda, dia_vencimento_gdoor, dia_vencimento_cetech) 
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [nome, sistema, custo, venda, dia_vencimento_gdoor, dia_vencimento_cetech],
    (err) => {
      if (err) {
        console.log("❌ ERRO:", err);
        return res.status(500).json(err);
      }

      console.log("✅ SALVO COM SUCESSO");
      res.json({ ok: true });
    },
  );
});

// 📌 EXCLUIR
app.delete("/clientes/:id", (req, res) => {
  db.query("DELETE FROM clientes WHERE id = ?", [req.params.id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ ok: true });
  });
});

// 📌 EDITAR (CORRIGIDO COM OS DIAS)
app.put("/clientes/:id", (req, res) => {
  const { id } = req.params;

  const {
    nome,
    sistema,
    custo,
    venda,
    dia_vencimento_gdoor,
    dia_vencimento_cetech,
  } = req.body;

  const sql = `
    UPDATE clientes SET
      nome = ?,
      sistema = ?,
      custo = ?,
      venda = ?,
      dia_vencimento_gdoor = ?,
      dia_vencimento_cetech = ?
    WHERE id = ?
  `;

  db.query(
    sql,
    [
      nome,
      sistema,
      custo,
      venda,
      dia_vencimento_gdoor,
      dia_vencimento_cetech,
      id,
    ],
    (err) => {
      if (err) {
        console.log("❌ ERRO UPDATE:", err);
        return res.status(500).json(err);
      }

      console.log("✏️ ATUALIZADO COM SUCESSO");
      res.json({ ok: true });
    },
  );
});

// 🚀 INICIAR
app.listen(3000, () => {
  console.log("🚀 Servidor rodando em http://localhost:3000");
});
