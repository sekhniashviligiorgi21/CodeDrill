//---------------------------------- DOM Elements --------------------------------
const screens = {
    mode: document.getElementById('mode-screen'),
    level: document.getElementById('level-screen'),
    game: document.getElementById('game-screen'),
    postGame: document.getElementById('post-game-screen')
};

const rules = document.getElementById('rules');
const header = document.getElementById('header');
const challengeBox = document.getElementById('challenge');
const aiBox = document.getElementById('gemini');

//---------------------------------- Default CodeMirror --------------------------------
const editor = CodeMirror.fromTextArea(document.getElementById("editor"), {
    mode: "python",
    theme: "dracula",
    lineNumbers: true,
    tabSize: 4, // Python standard is 4 spaces
    indentWithTabs: false,
    lineWrapping: true
});
editor.setValue("# Write your Python code here...\n");

//---------------------------------- Utility: View Routing --------------------------------
function showScreen(screenKey) {
    Object.values(screens).forEach(screen => screen.classList.add('hidden'));
    if (screens[screenKey]) {
        screens[screenKey].classList.remove('hidden');
    }
}

//------------------------------------- Timer Function --------------------------------
let seconds = 300;
let timerInterval;

function formatTime(sec) {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

function updateTime() {
    document.getElementById("time").innerText = formatTime(seconds);
    if (seconds <= 0) {
        clearInterval(timerInterval);
        document.getElementById("time").innerText = "00:00";
        document.getElementById("submit").click();
    }
}

function timer() {
    if (timerInterval) clearInterval(timerInterval);
    seconds = 300;
    updateTime();

    timerInterval = setInterval(() => {
        seconds -= 1;
        updateTime();
    }, 1000);
}

//------------------------------------ Play Again function --------------------------
function playagain() {
    document.getElementById("submit").disabled = false;
    challengeBox.innerHTML = '';
    aiBox.innerHTML = '';
    aiBox.classList.add('hidden');
    
    showScreen('level');
}

//------------------------------------- Singleplayer API Logic --------------------------------
async function level(levelType) {
    rules.classList.add('hidden');
    showScreen('game');
    
    // Crucial fix: CodeMirror needs a refresh when its container goes from hidden -> visible
    setTimeout(() => editor.refresh(), 50); 
    
    timer();

    document.getElementById("reset").onclick = () => location.reload();
    document.getElementById("PG").onclick = playagain;

    challengeBox.innerHTML = '<p>Loading challenge...</p>';

    const response = await fetch(`https://code-clash-backend-mqjr.onrender.com/singleplayer/${levelType}`);
    const challenge = await response.json();
    
    challengeBox.innerHTML = `
        <h3>${challenge.title}</h3>
        <p>You should write code to ${challenge.description}</p>
        <p><strong>Example: </strong><br> Input: <code>${challenge.input_example}</code> <br> Output: <code>${challenge.output_example}</code></p>
    `;

    const submitBtn = document.getElementById("submit");
    submitBtn.onclick = async function() {
        submitBtn.disabled = true;
        submitBtn.textContent = "Analyzing...";
        clearInterval(timerInterval); // Stop timer on submit
        
        const code = editor.getValue();
        const res = await fetch("https://code-clash-backend-mqjr.onrender.com/analyzing-code", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({code: code, challenge_title: challenge.title})
        });
        
        const result = await res.json();
        submitBtn.textContent = "Code Analyzed";
        
        challengeBox.innerHTML += `
            <div style="margin-top: 1.5rem; padding: 1rem; background: rgba(0, 255, 170, 0.1); border-radius: 8px;">
                <h3>AI Feedback:</h3>
                <p style="margin-top: 0.5rem; font-weight: bold; color: #00ffaa;">Score: ${result.Score}</p>
            </div>
        `;
        screens.postGame.classList.remove('hidden');
    };
}

//-------------------------------------- vsAI API Logic ----------------------------------------
async function vsAI(lvl) {
    rules.classList.add('hidden');
    showScreen('game');
    setTimeout(() => editor.refresh(), 50);
    timer();

    document.getElementById("reset").onclick = () => location.reload();
    document.getElementById("PG").onclick = playagain;

    challengeBox.innerHTML = '<p>Loading challenge...</p>';

    const response = await fetch(`https://code-clash-backend-mqjr.onrender.com/vsAI/${lvl}`);
    const challenge = await response.json();
    
    challengeBox.innerHTML = `
        <h3>${challenge.title}</h3>
        <p>You should write code to ${challenge.description}</p>
        <p><strong>Example: </strong><br> Input: <code>${challenge.input_example}</code> <br> Output: <code>${challenge.output_example}</code></p>
    `;

    const submitBtn = document.getElementById("submit");
    submitBtn.onclick = async function() {
        submitBtn.disabled = true;
        submitBtn.textContent = "Analyzing Code...";
        clearInterval(timerInterval);
        
        const userCode = editor.getValue();
        
        // 1. Analyze User Code
        const res = await fetch("https://code-clash-backend-mqjr.onrender.com/analyzing-code", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({code: userCode, challenge_title: challenge.title})
        });
        
        const result = await res.json();
        challengeBox.innerHTML += `
            <div style="margin-top: 1.5rem; padding: 1rem; background: rgba(0, 255, 170, 0.1); border-radius: 8px;">
                <h3>Your Result:</h3>
                <p style="margin-top: 0.5rem; font-weight: bold; color: #00ffaa;">Score: ${result.Score}</p>
            </div>
        `;

        // 2. Fetch AI Code
        submitBtn.textContent = "Loading AI Code...";
        const aiRes = await fetch(`https://code-clash-backend-mqjr.onrender.com/writing-${lvl}-code`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({code: userCode, challenge_title: challenge.title})
        });
        const aiData = await aiRes.json();
        
        aiBox.classList.remove('hidden');
        aiBox.innerHTML = `
            <h3>AI's Solution:</h3>
            <pre><code>${aiData["AI's code"]}</code></pre>
        `;
        
        submitBtn.textContent = "Challenge Complete";
        screens.postGame.classList.remove('hidden');
    };
}


//------------------------- Mode Event Listeners ----------------------------------
document.getElementById("singleplayer").onclick = function() {
    header.innerText = "Singleplayer";
    showScreen('level');
    
    // Rebind level buttons for Singleplayer
    document.getElementById("easy").onclick = () => level("easy");
    document.getElementById("medium").onclick = () => level("medium");
    document.getElementById("hard").onclick = () => level("hard");
};

document.getElementById("AI").onclick = function() {
    header.innerText = "vs AI";
    showScreen('level');
    
    // Rebind level buttons for vs AI
    document.getElementById("easy").onclick = () => vsAI("easy");
    document.getElementById("medium").onclick = () => vsAI("medium");
    document.getElementById("hard").onclick = () => vsAI("hard");
};