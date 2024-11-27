const codeEditor = document.querySelector(".code-editor");
const output = document.getElementById("output");


const displayOutput = (content) => {
  output.innerHTML = "";
  output.textContent = content;
};


const runCode = () => {;
  const code = codeEditor.value;

  if (!code.trim()) {
    displayOutput("Please enter some code first!");
    return;
  }

  try {
    
    const safeEval = (code) => {
      try {
     
        let output = "";
        const mockConsole = {
          log: (...args) => {
            output +=
              args
                .map((arg) =>
                  typeof arg === "object"
                    ? JSON.stringify(arg, null, 2)
                    : String(arg)
                )
                .join(" ") + "\n";
          },
        };

        
        const fn = new Function("console", code);
        fn(mockConsole);
        return output || "Code executed successfully!";
      } catch (error) {
        throw new Error(`Execution Error: ${error.message}`);
      }
    };

    const result = safeEval(code);
    displayOutput(result);
  } catch (error) {
    displayOutput(`Error: ${error.message}`);
  }
};


codeEditor.addEventListener("keydown", (e) => {
 
  if (e.key === "Tab") {
    e.preventDefault();
    const start = codeEditor.selectionStart;
    const end = codeEditor.selectionEnd;
    codeEditor.value =
      codeEditor.value.substring(0, start) +
      "    " +
      codeEditor.value.substring(end);
    codeEditor.selectionStart = codeEditor.selectionEnd = start + 4;
  }
});

const handleSaveFile = () => {
  
  if (codeEditor.value.trim()) {
    const blob = new Blob([codeEditor.value], { type: "text/javascript" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "code.js";
    document.body.appendChild(link);
    link.click();

    // Cleanup
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }
};
