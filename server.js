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
    console.log("Erro ao conectar:", err);
  } else {
    console.log("🔥 MySQL conectado!");
  }
});

// 📌 LISTAR CLIENTES
app.get("/clientes", (req, res) => {
  db.query("SELECT * FROM clientes", (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

// 📌 CADASTRAR CLIENTE (CORRIGIDO)
app.post("/clientes", (req, res) => {
  console.log("CHEGOU NO BACKEND:", req.body);

  const {
    nome,
    sistema,
    custo,
    venda,
    dia_vencimento_gdoor,
    dia_vencimento_cetech,
  } = req.body;

  const gdoor =
    dia_vencimento_gdoor !== undefined &&
    dia_vencimento_gdoor !== null &&
    dia_vencimento_gdoor !== ""
      ? parseInt(dia_vencimento_gdoor)
      : null;

  const cetech =
    dia_vencimento_cetech !== undefined &&
    dia_vencimento_cetech !== null &&
    dia_vencimento_cetech !== ""
      ? parseInt(dia_vencimento_cetech)
      : null;

  const sql = `
    INSERT INTO clientes 
    (nome, sistema, custo, venda, dia_vencimento_gdoor, dia_vencimento_cetech) 
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(sql, [nome, sistema, custo, venda, gdoor, cetech], (err) => {
    if (err) {
      console.log("ERRO:", err);
      return res.status(500).json(err);
    }

    console.log("SALVO COM SUCESSO");
    res.json({ ok: true });
  });
});

// 📌 EXCLUIR
app.delete("/clientes/:id", (req, res) => {
  db.query("DELETE FROM clientes WHERE id = ?", [req.params.id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ ok: true });
  });
});

// 📌 EDITAR (AGORA ATUALIZA DATAS TAMBÉM)
app.put("/clientes/:id", (req, res) => {
  const {
    nome,
    sistema,
    custo,
    venda,
    dia_vencimento_gdoor,
    dia_vencimento_cetech,
  } = req.body;

  const gdoor =
    dia_vencimento_gdoor !== undefined &&
    dia_vencimento_gdoor !== null &&
    dia_vencimento_gdoor !== ""
      ? parseInt(dia_vencimento_gdoor)
      : null;

  const cetech =
    dia_vencimento_cetech !== undefined &&
    dia_vencimento_cetech !== null &&
    dia_vencimento_cetech !== ""
      ? parseInt(dia_vencimento_cetech)
      : null;

  db.query(
    `UPDATE clientes 
     SET nome=?, sistema=?, custo=?, venda=?, 
     dia_vencimento_gdoor=?, dia_vencimento_cetech=? 
     WHERE id=?`,
    [nome, sistema, custo, venda, gdoor, cetech, req.params.id],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ ok: true });
    },
  );
});

// 🚀 INICIAR
app.listen(3000, () => {
  console.log("🚀 Servidor rodando em http://localhost:3000");
});
