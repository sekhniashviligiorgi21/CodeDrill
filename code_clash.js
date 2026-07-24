//-------------------------------------timer function--------------------------------
let seconds = 300;
let timerInterval;
function updateTime(){
    document.getElementById("time").innerText=seconds + " seconds left."
    if (seconds <= 0) {
        clearInterval(timerInterval)
        document.getElementById("time").innerText="Time's up!"
        document.getElementById("submit").click()
    }
}
function timer(){
    if(timerInterval)
        clearInterval(timerInterval)
    seconds=300
    updateTime()

    timerInterval=setInterval(()=>{
        seconds -= 1;
        updateTime();
        if (seconds <= 0) {
            clearInterval(timerInterval)
            document.getElementById("submit").click()
        }
    }, 1000)
}

//------------------------------------Play Again function--------------------------
function playagain(){
    document.getElementById("submit").disabled=false;
    document.getElementById("time").style.display="none"
    document.getElementById("reset").style.display="none"
    document.getElementById("PG").style.display="none"
    document.querySelector(".CodeMirror").style.display="none"
    document.getElementById("submit").style.display="none"
    document.getElementById("choose_level").style.display="block"
    document.getElementById("easy").style.display="block"
    document.getElementById("medium").style.display="block"
    document.getElementById("hard").style.display="block"
    document.getElementById("challenge").innerHTML=``
    document.getElementById("gemini").innerHTML=``
    document.getElementById("gemini").style.display="none"
}

//-------------------------------------Singleplayer function--------------------------------
async function level(level){
    document.getElementById("submit").style.display="block"
    document.getElementById("time").style.display="block"
    timer()
    document.getElementById("reset").style.display="block"
    document.getElementById("reset").onclick = () => location.reload();
    document.getElementById("PG").style.display="block"
    document.getElementById("PG").onclick = function(){
        playagain()
    }
    document.querySelector(".CodeMirror").style.display="block"
    document.getElementById("choose_level").style.display="none"
    document.getElementById("easy").style.display="none"
    document.getElementById("medium").style.display="none"
    document.getElementById("hard").style.display="none"
    const response = await
    fetch(`https://code-clash-oo71.onrender.com/singleplayer/${level}`);
    const challenge = await response.json()
    document.getElementById("challenge").innerHTML=`
        <h2>${challenge.title}</h2>
        <p>You should write code to ${challenge.description}</p>
        <p><strong>Example: </strong>${challenge.input_example} --> ${challenge.output_example}</p>
    `
    document.getElementById("submit").onclick=async function(){
        document.getElementById("submit").disabled = true;
        document.getElementById("submit").textContent="Analyzing code...";
        const code=editor.getValue()
        const res = await fetch("https://code-clash-oo71.onrender.com/analyzing-code",{
            method:"POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({code: code, challenge_title: challenge.title})
        })
        document.getElementById("submit").textContent="Code analyzed!!!";
        const result=await res.json()
        document.getElementById("challenge").innerHTML+=`
            <h3>AI feedback:</h3>
            <p>Score: ${result.Score}</p>
        `;
        document.getElementById("submit").textContent="SUBMIT";
    };
    }

//----------------------------------Default Code------------------------------------------
const editor = CodeMirror.fromTextArea(document.getElementById("editor"), {
  mode: "python",
  theme: "dracula",
  lineNumbers: true,
  tabSize: 2,
  indentWithTabs: true,
  lineWrapping: true
});

editor.setValue("# Write your Python code here...");
document.getElementById("gemini").style.display="none"
document.getElementById("PG").style.display="none"
document.getElementById("header").style.display="block"
document.getElementById("rules").style.display="block"
document.getElementById("choose_mode").style.display="block"
document.getElementById("choose_level").style.display="none"
document.getElementById("singleplayer").style.display="block"
document.getElementById("time").style.display="none"
document.getElementById("AI").style.display="block"
document.getElementById("easy").style.display="none"
document.getElementById("medium").style.display="none"
document.getElementById("hard").style.display="none"
document.getElementById("submit").style.display="none"
document.querySelector(".CodeMirror").style.display="none"
document.getElementById("reset").style.display="none"

//--------------------------------------SinglePlayer mode----------------------------------------
document.getElementById("singleplayer").onclick=async function(){
    document.getElementById("header").innerText="singleplayer mode"
    document.getElementById("rules").style.display="none"
    document.getElementById("choose_level").style.display="block"
    document.getElementById("choose_mode").style.display="none"
    document.getElementById("singleplayer").style.display="none"
    document.getElementById("AI").style.display="none"

//-------------------------Easy Level------------------------------
    document.getElementById("easy").style.display="block"
    document.getElementById("easy").onclick=async function(){
        level("easy")
        }
//-------------------------Medium Level------------------------------
    document.getElementById("medium").style.display="block"
    document.getElementById("medium").onclick=async function(){
        level("medium")
        }
//-------------------------Hard Level------------------------------
    document.getElementById("hard").style.display="block"
        document.getElementById("hard").onclick=async function(){
        level("hard")
        }
}


//------------------------vsAI function-------------------------------------
async function vsAI(lvl){
    document.getElementById("submit").style.display="block"
    document.getElementById("time").style.display="block"
    timer()
    document.getElementById("reset").style.display="block"
    document.getElementById("reset").onclick = () => location.reload();
    document.getElementById("PG").style.display="block"
    document.getElementById("PG").onclick = function(){
        playagain()}
    document.querySelector(".CodeMirror").style.display="block"
    document.getElementById("choose_level").style.display="none"
    document.getElementById("easy").style.display="none"
    document.getElementById("medium").style.display="none"
    document.getElementById("hard").style.display="none"
    const response = await
    fetch(`https://code-clash-oo71.onrender.com/vsAI/${lvl}`);
    const challenge = await response.json();
    document.getElementById("challenge").innerHTML=`
        <h2>${challenge.title}</h2>
        <p>You should write code to ${challenge.description}</p>
        <p><strong>Example: </strong>${challenge.input_example} --> ${challenge.output_example}</p>
    `
    document.getElementById("submit").onclick=async function(){
        document.getElementById("submit").disabled = true;
        document.getElementById("submit").textContent="Analyzing code...";
        const userCode=editor.getValue()
        const res = await fetch("https://code-clash-oo71.onrender.com/analyzing-code",{
            method:"POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({code: userCode, challenge_title: challenge.title})
        })
        document.getElementById("submit").textContent="Code analyzed!!!";
        const result=await res.json()
        document.getElementById("challenge").innerHTML+=`
            <h3>AI feedback:</h3>
            <p>Score: ${result.Score}</p>
        `;
        document.getElementById("submit").textContent="AI code loading...";
        const aiRes = await
        fetch(`https://code-clash-oo71.onrender.com/writing-${lvl}-code`,{
            method:"POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({code: userCode, challenge_title: challenge.title})
        })
        const aiData = await aiRes.json()
        document.getElementById("gemini").style.display="block"
        document.getElementById("gemini").innerHTML=`
            <h3>AI's code for this challenge:</h3>
            <pre>${aiData["AI's code"]}</pre>
        `
        document.getElementById("submit").textContent="SUBMIT";
    };
}


//-------------------------vsAI easy----------------------------------
document.getElementById("AI").onclick=async function(){
    document.getElementById("header").innerText="vsAI mode"
    document.getElementById("rules").style.display="none"
    document.getElementById("choose_level").style.display="block"
    document.getElementById("choose_mode").style.display="none"
    document.getElementById("singleplayer").style.display="none"
    document.getElementById("AI").style.display="none"
//-------------------------Easy Level------------------------------
    document.getElementById("easy").style.display="block"
    document.getElementById("easy").onclick=async function(){
        vsAI("easy")
        }
//-------------------------Medium Level------------------------------
    document.getElementById("medium").style.display="block"
    document.getElementById("medium").onclick=async function(){
        vsAI("medium")
        }
//-------------------------Hard Level------------------------------
    document.getElementById("hard").style.display="block"
        document.getElementById("hard").onclick=async function(){
        vsAI("hard")
        }
}