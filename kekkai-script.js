const imageSources = ['1.png', '2.png', '3.png', '4.png', '5.png', '6.png'];
let secret = [];
let currentGuess = [];
let difficulty = 2;
let wrongGuesses = 0;
let gameOver = false;


function startGame() {
    difficulty = parseInt(document.getElementById('difficulty').value);
    secret = [];
    currentGuess = [];
    wrongGuesses = 0;
    gameOver = false;

    document.getElementById('menu').style.display = 'none';
    document.getElementById('guesses').style.display = 'none';
    document.querySelector('#guessTable tbody').innerHTML = '';
    document.querySelector('#guessTable tfoot').innerHTML = '';
    document.getElementById('currentGuess').innerHTML = '';
    document.getElementById('buttons').innerHTML = '';

    document.getElementById('guessHeader').textContent = `Level ${difficulty}`;

    // ✅ Unique symbols only
    const shuffled = [...imageSources].sort(() => 0.5 - Math.random());
    secret = shuffled.slice(0, difficulty);

    const buttonRow = document.createElement('div');
    buttonRow.className = 'button-row';
    imageSources.forEach(src => {
        const btn = document.createElement('button');
        btn.className = 'symbol-btn';
        const img = document.createElement('img');
        img.src = "images/" + src;
        btn.onclick = () => addSymbol(src);
        btn.appendChild(img);
        buttonRow.appendChild(btn);
    });

    document.getElementById('buttons').appendChild(buttonRow);

    const restartBtn = document.createElement('button');
    restartBtn.className = 'image-button';
    restartBtn.innerHTML = `<img src="images/restart.png" width="50" height="30" title="Restart" alt="Restart">`;
    restartBtn.onclick = () => location.reload();
    document.getElementById('buttons').appendChild(restartBtn);
}


function addSymbol(src) {
    if (currentGuess.length >= difficulty || gameOver) return;

    currentGuess.push(src);
    updateCurrentGuess();

    if (currentGuess.length === difficulty) {
        evaluateGuess();
        currentGuess = [];
        updateCurrentGuess();
    }
}


function updateCurrentGuess() {
    const div = document.getElementById('currentGuess');
    div.innerHTML = currentGuess.map(src => `<img src="${"images/" + src}">`).join('');
}


function evaluateGuess() {
    let correctPlace = 0;
    let correctSymbol = 0;
    const tempSecret = [...secret];
    const tempGuess = [...currentGuess];

    for (let i = 0; i < difficulty; i++) {
        if (tempGuess[i] === tempSecret[i]) {
            correctPlace++;
            tempSecret[i] = null;
            tempGuess[i] = null;
        }
    }

    for (let i = 0; i < difficulty; i++) {
        if (tempGuess[i] !== null) {
            const index = tempSecret.indexOf(tempGuess[i]);

            if (index !== -1) {
                correctSymbol++;
                tempSecret[index] = null;
            }
        }
    }

    const tbody = document.querySelector('#guessTable tbody');
    const row = document.createElement('tr');
    const guessCell = document.createElement('td');
    const clueCell = document.createElement('td');

    guessCell.innerHTML = currentGuess.map(src => `<img src="${"images/" + src}" width="30" height="30">`).join(' ');
    clueCell.textContent = `✅ ${correctPlace}, 🔄 ${correctSymbol}`;
    row.appendChild(guessCell);
    row.appendChild(clueCell);
    tbody.appendChild(row);

    document.getElementById('guesses').style.display = 'block';

    if (correctPlace === difficulty) {
        gameOver = true;
        setTimeout(() => {
        const msg = document.getElementById('gameMessage');
        msg.innerHTML = 'You win! 🏆<hr>You successfully cracked the code!<br>' +
        'You only used ' + (wrongGuesses + 1) + ' attempts.<br>' +
        '<br>Press the restart button at the bottom of the page to play again<hr>' + 
        '<button onclick="hideGameMessage()" class="image-button">' +
        '<img src="images/close.png" alt="Close">' + 
        '</button>';

        msg.style.display = 'block';
        }, 100)
    } else {
        wrongGuesses++;

        if (wrongGuesses >= 10) {
            gameOver = true;

            const tfoot = document.querySelector('#guessTable tfoot');
            const footRow = document.createElement('tr');
            const footCell = document.createElement('td');

            footCell.colSpan = 2;
            footCell.innerHTML = `Correct answer: ` +
                secret.map(src => `<img src="${"images/" + src}" width="30" height="30">`).join('');
            footRow.appendChild(footCell);
            tfoot.appendChild(footRow);

            setTimeout(() => {
                const msg = document.getElementById('gameMessage');
                msg.innerHTML = 'Game Over! 💀<hr>You lose! You used all 10 attempts.<br>' +
                'You need to pay attention on the clue.<br>' +
                '<br>Press the restart button at the bottom of the page to play again<hr>' + 
                `The correct answer was:<br>` +
                secret.map(src => `<img src="${"images/" + src}" width="30" height="30">`).join('') + 
                '<br><button onclick="hideGameMessage()" class="image-button">' +
                '<img src="images/close.png" alt="Close">' + 
                '</button>';

                msg.style.display = 'block';
            }, 100);
        }
    }
}

function hideGameMessage() {
    document.getElementById('gameMessage').style.display = 'none';
}
