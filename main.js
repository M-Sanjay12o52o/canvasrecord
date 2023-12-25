var canvas = document.querySelector("canvas");
var ctx = canvas.getContext("2d");
var video = document.querySelector("video");

var isDrawing = false;
var lastX = 0;
var lastY = 0;
var inputText = "";
var clickX = 0;
var clickY = 0;
var mode = "draw"; // Initial mode is drawing

function draw(event) {
  if (mode === "draw" && isDrawing) {
    const x = event.clientX - canvas.offsetLeft;
    const y = event.clientY - canvas.offsetTop;

    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(x, y);
    ctx.stroke();

    [lastX, lastY] = [x, y];
  }
}

function handleTextInput(event) {
  if (mode === "text") {
    if (event.key === "Enter") {
      mode = "draw"; // Switch back to drawing mode on pressing Enter
    } else if (event.key === "Backspace") {
      inputText = inputText.slice(0, -1);
    } else {
      inputText += event.key;
    }

    drawText();
  }
}

function drawText() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.font = "48px serif";
  ctx.fillStyle = "black";
  ctx.fillText(inputText, clickX, clickY);
}

canvas.addEventListener("mousedown", function (event) {
  if (mode === "draw") {
    isDrawing = true;
    [lastX, lastY] = [
      event.clientX - canvas.offsetLeft,
      event.clientY - canvas.offsetTop,
    ];
  } else if (mode === "text") {
    clickX = event.clientX - canvas.offsetLeft;
    clickY = event.clientY - canvas.offsetTop;
  }
});

canvas.addEventListener("mousemove", draw);

canvas.addEventListener("mouseup", function () {
  isDrawing = false;
});

document.addEventListener("keydown", handleTextInput);

// Toggle button logic
var toggleButton = document.getElementById("toggleButton");

toggleButton.addEventListener("click", function () {
  mode = mode === "draw" ? "text" : "draw";
  toggleButton.textContent =
    mode === "draw" ? "Switch to Text" : "Switch to Draw";
});

var videoStream = canvas.captureStream(30);
var mediaRecorder = new MediaRecorder(videoStream);

var chunks = [];
mediaRecorder.ondataavailable = function (e) {
  chunks.push(e.data);
};

mediaRecorder.onstop = function (e) {
  var blob = new Blob(chunks, { type: "video/mp4" });
  chunks = [];
  var videoURL = URL.createObjectURL(blob);
  video.src = videoURL;
};
mediaRecorder.ondataavailable = function (e) {
  chunks.push(e.data);
};

mediaRecorder.start();
// setInterval(draw, 300);
setTimeout(function () {
  mediaRecorder.stop();
}, 5000);
