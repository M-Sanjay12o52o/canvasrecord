var canvas = document.querySelector("canvas");
var ctx = canvas.getContext("2d");

var video = document.querySelector("video");

var inputText = "";
var isTyping = true;
var clickX = 0;
var clickY = 0;

function drawText() {
  // ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.font = "48px serif";
  ctx.fillStyle = "black";
  ctx.fillText(inputText, clickX, clickY);
}

document.addEventListener("keydown", function (event) {
  if (isTyping) {
    // Check if the user is currently typing
    if (event.key === "Enter") {
      // If Enter is pressed, stop typing
      isTyping = false;
    } else if (event.key === "Backspace") {
      // If Backspace is pressed, remove the last character
      inputText = inputText.slice(0, -1);
    } else {
      // Otherwise, add the pressed key to the input text
      inputText += event.key;
    }

    drawText(); // Redraw the canvas with updated text
  }
});

canvas.addEventListener("click", function (event) {
  isTyping = true;
  clickX = event.clientX - canvas.offsetLeft;
  clickY = event.clientY - canvas.offsetTop;
  drawText();
});

// var colors = ["red", "blue", "yellow", "orange", "black", "white", "green"];
// // function draw() {
// //   ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
// //   ctx.fillRect(0, 0, canvas.width, canvas.height);
// // }

// function draw() {
//   console.log("ctx: ", ctx);
//   ctx.font = "48px serif";
//   ctx.fillText("Hello world", 10, 50);
// }

// draw();

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
setInterval(draw, 300);
setTimeout(function () {
  mediaRecorder.stop();
}, 5000);
