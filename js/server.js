const express = require('express');
const fs = require('fs');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

let highScores = [];

// Carregar dados do arquivo `data.json` ao iniciar o servidor
const loadData = () => {
  if (fs.existsSync('data.json')) {
    const data = fs.readFileSync('data.json', 'utf8');
    highScores = JSON.parse(data).highScores || [];
    console.log("Dados carregados no início:", highScores);
  }
};

// Salvar dados em `data.json`
const saveData = () => {
  fs.writeFileSync('data.json', JSON.stringify({ highScores }, null, 2));
  console.log("Dados salvos:", highScores);
};

// Carrega os dados iniciais
loadData();

// Endpoint para obter as pontuações altas
app.get('/highscores', (req, res) => {
  res.json(highScores);
});

// Endpoint para adicionar uma nova pontuação
app.post('/highscores', (req, res) => {
  const newScore = req.body;

  // Gera um novo ID baseado no último ID da lista, ou começa com 1
  const newId = highScores.length > 0 ? highScores[highScores.length - 1].id + 1 : 1;

  // Cria um objeto para o novo jogador
  const playerWithId = {
    id: newId,
    name: newScore.name,
    score: newScore.score
  };

  // Adiciona o novo jogador à lista e salva no arquivo JSON
  highScores.push(playerWithId);
  saveData();

  res.status(201).json({ message: "Novo jogador adicionado", player: playerWithId });
});

// Endpoint para atualizar a pontuação de um jogador específico
app.put('/highscores/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const playerIndex = highScores.findIndex(player => player.id === id);

  if (playerIndex !== -1) {
    const player = highScores[playerIndex];

    // Verifica se a nova pontuação é maior que a atual
    if (req.body.score > player.score) {
      player.score = req.body.score;
      saveData();
      res.status(200).json({ message: "Pontuação atualizada com sucesso", player });
    } else {
      res.status(400).json({ message: "A nova pontuação não é maior que a pontuação atual", currentScore: player.score });
    }
  } else {
    res.status(404).json({ message: "Jogador não encontrado" });
  }
});

// Endpoint para deletar um jogador
app.delete('/highscores/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const playerIndex = highScores.findIndex(player => player.id === id);

  if (playerIndex !== -1) {
    highScores.splice(playerIndex, 1); // Remove o jogador do array
    saveData(); // Salva as alterações no JSON
    res.status(200).json({ message: "Jogador removido com sucesso" });
  } else {
    res.status(404).json({ message: "Jogador não encontrado" });
  }
});

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
