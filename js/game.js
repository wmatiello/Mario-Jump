const mario = document.querySelector('.mario');
const pipe = document.querySelector('.pipe');
const clouds = document.querySelector('.clouds');
const gameOverScreen = document.querySelector('.game-over-screen');
const reload = document.querySelector('#restar-button');
const scoreDisplay = document.querySelector('#Score'); 
const nameInputScreen = document.querySelector('#name-input');
const playerNameInput = document.querySelector('#player-name');
const startGameButton = document.querySelector('#start-game');

let loop; 
let isGameOver = false; 
let score = 0;
let playerName = "";

// Função para o pulo do Mario
const jump = () => {
    mario.classList.add('jump');

    setTimeout(() => {
        mario.classList.remove('jump');
    }, 500); 
};

// Atualizar a pontuação
const updateScore = () => {
    score += 1; 
    scoreDisplay.textContent = score; 
};

// Lógica para iniciar o jogo ao clicar no botão
startGameButton.addEventListener('click', () => {
    playerName = playerNameInput.value.trim();

    if (playerName !== "") {
        nameInputScreen.style.display = 'none'; 
        startGameLoop(); 
    } else {
        alert("Por favor, insira seu nome antes de começar!");
    }
});

// Loop principal do jogo
const startGameLoop = () => {
    loop = setInterval(() => {
        console.log('loop');    
        
        const pipePosition = pipe.offsetLeft;
        const marioPosition = +window.getComputedStyle(mario).bottom.replace('px', '');
        const cloudsPosition = clouds.offsetLeft;

        if (pipePosition <= 120 && pipePosition > 0 && marioPosition <= 100) {
            // Colisão com o tubo
            pipe.style.animation = 'none';
            pipe.style.left = `${pipePosition}px`;
            mario.style.animation = 'none';
            mario.style.bottom = `${marioPosition}px`;
            clouds.style.animation = 'none';  
            clouds.style.left = `${cloudsPosition}px`;  

            mario.src = './imagens/game-over.png';
            mario.style.width = '75px';
            mario.style.marginLeft = '50px';

            gameOverScreen.style.display = 'block';
            clearInterval(loop);
            isGameOver = true; 
        } else if (!isGameOver) {
            updateScore();
        }

    }, 10);
};

// Função para reiniciar o jogo
const restartGame = () => {
    location.reload(); 
};

// Evento para controle de pulo e reinício
document.addEventListener('keydown', (event) => {
    if (event.code === 'Space') {
        jump(); 
    } else if (event.code === 'Enter' && isGameOver) {
        restartGame(); 
    }
});

// Mostrar a tela de nome ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    nameInputScreen.style.display = 'flex'; 
});
