const symbols = ['1', '2', '3', '4', '5', '6']; // we can map to images later
let allCombos = [];
let currentGuess = [];
let difficulty = 2;


function startSolver() {
    difficulty = parseInt(document.getElementById('difficulty').value);
    generateAllCombos();

    // ✅ Clear table and UI BEFORE showing guess
    const tbody = document.querySelector('#historyTable tbody');
    tbody.innerHTML = '';
    document.getElementById('historyTable').style.display = 'none';
    document.getElementById('guessBox').innerText = 'First guess will appear here'; // Move this earlier

    // Generate and show new guess
    currentGuess = allCombos[Math.floor(Math.random() * allCombos.length)];
    showGuess(currentGuess);

    // Show solver UI and reset inputs
    document.getElementById('solver').style.display = 'block';
    document.getElementById('correctPlace').value = '0';
    document.getElementById('wrongPlace').value = '0';
}


function generateAllCombos() {
    // Generate all combinations without repetition
    allCombos = [];

    function buildCombo(path, remaining) {
        if (path.length === difficulty) {
            allCombos.push(path);
            return;
        }

        for (let i = 0; i < remaining.length; i++) {
            buildCombo([...path, remaining[i]], remaining.slice(0, i).concat(remaining.slice(i + 1)));
        }
    }

    buildCombo([], symbols);
}


function showGuess(guess) {
    const guessBox = document.getElementById('guessBox');
    guessBox.innerHTML = 'Try: ';
    guess.forEach(symbol => {
        const img = document.createElement('img');
        img.src = `${"images/" + symbol}.png`;
        img.alt = symbol;
        img.width = 40;
        img.height = 40;
        img.style.margin = '0 5px';
        guessBox.appendChild(img);
    });
}


function nextGuess() {
    let correct = parseInt(document.getElementById('correctPlace').value) || 0;
    let misplaced = parseInt(document.getElementById('wrongPlace').value) || 0;

    // ✅ Input Validation
    if (correct == difficulty) {
        alert(`Congrats! Puzzle already solved. 😉`);
        return;
    }

    if ((correct + misplaced) > difficulty) {
        alert(`❌ Invalid clue. Total clues (${correct + misplaced}) cannot be more than ${difficulty}.`);
        return;
    }

    // Filter all possible combinations based on the feedback
    allCombos = allCombos.filter(candidate => {
        let tempGuess = [...currentGuess];
        let tempAnswer = [...candidate];
        let correctCount = 0;
        let wrongPlaceCount = 0;

        // Correctly placed
        for (let i = 0; i < difficulty; i++) {
            if (tempGuess[i] === tempAnswer[i]) {
                correctCount++;
                tempGuess[i] = tempAnswer[i] = null;
            }
        }

        // Misplaced but correct symbols
        for (let i = 0; i < difficulty; i++) {
            if (tempGuess[i] != null) {
                let index = tempAnswer.indexOf(tempGuess[i]);

                if (index !== -1) {
                    wrongPlaceCount++;
                    tempAnswer[index] = null;
                }
            }
            }

            return correctCount === correct && wrongPlaceCount === misplaced;
    });

    

    // Log this guess to table
    const tbody = document.querySelector('#historyTable tbody');
    const row = document.createElement('tr');
    const guessCell = document.createElement('td');

    currentGuess.forEach(symbol => {
        const img = document.createElement('img');
        img.src = `${"images/" + symbol}.png`;
        img.alt = symbol;
        img.width = 30;
        img.height = 30;
        img.style.margin = '0 3px';
        guessCell.appendChild(img);
    });

    guessCell.style.padding = '8px';
    row.appendChild(guessCell);

    const clueCell = document.createElement('td');
    clueCell.textContent = `${correct}, ${misplaced}`;
    clueCell.style.padding = '8px';
    row.appendChild(clueCell);

    tbody.appendChild(row);
    document.getElementById('historyTable').style.display = 'table';

    // Check if no possible combinations remain
    if (allCombos.length === 0) {
        document.getElementById('guessBox').innerText = "❌ No combinations left. Check your clues!";
        return;
    }

    // Show new guess
    currentGuess = allCombos[Math.floor(Math.random() * allCombos.length)];
    showGuess(currentGuess);

    // ✅ Clear input fields
    document.getElementById('correctPlace').value = '0';
    document.getElementById('wrongPlace').value = '0';
}
