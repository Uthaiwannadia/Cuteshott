const video = document.getElementById("liveVideo");
const canvas = document.getElementById("finalCanvas");
const ctx = canvas.getContext("2d");

const countdownEl = document.querySelector(".countdown-timer");
const captureBtn = document.getElementById("takePhoto");

let shots = [];
let isCounting = false;

// Start camera
async function startCamera() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "user" },
      audio: false,
    });
    video.srcObject = stream;
    video.style.display = "block";
  } catch (err) {
    console.error("Camera access error:", err);
    alert("Unable to access camera.");
  }
}
startCamera();

// Start countdown on capture
captureBtn.addEventListener("click", () => {
  if (isCounting) return;
  isCounting = true;

  let count = 3;
  countdownEl.style.display = "flex";
  countdownEl.textContent = count;

  const timer = setInterval(() => {
    count--;
    if (count > 0) {
      countdownEl.textContent = count;
    } else {
      clearInterval(timer);
      countdownEl.style.display = "none";
      takeShot();
      isCounting = false;
    }
  }, 1000);
});

// Capture a single shot
function takeShot() {
  const tempCanvas = document.createElement("canvas");
  const tmpCtx = tempCanvas.getContext("2d");

  tempCanvas.width = video.videoWidth;
  tempCanvas.height = video.videoHeight;

  // Flip back horizontally so output is not mirrored
tmpCtx.scale(-1, 1);
tmpCtx.drawImage(video, -tempCanvas.width, 0, tempCanvas.width, tempCanvas.height);

  const dataURL = tempCanvas.toDataURL("image/png");
  shots.push(dataURL);

  if (shots.length < 4) {
    return; // keep taking photos
  }

  assemble4Photos();
}

// Assemble 4 images into final canvas
function assemble4Photos() {
  const cw = canvas.width;
  const ch = canvas.height;

  const cols = 2;
  const rows = 2;
  const cellW = cw / cols;
  const cellH = ch / rows;

  ctx.clearRect(0, 0, cw, ch);

  let loadedCount = 0;

  shots.forEach((src, index) => {
    const img = new Image();
    img.src = src;

    img.onload = function () {
      const iw = img.width;
      const ih = img.height;

      const imgRatio = iw / ih;
      const cellRatio = cellW / cellH;

      let sx, sy, sw, sh;

      // Crop with "cover" effect
      if (imgRatio > cellRatio) {
        sh = ih;
        sw = sh * cellRatio;
        sx = (iw - sw) / 2;
        sy = 0;
      } else {
        sw = iw;
        sh = sw / cellRatio;
        sx = 0;
        sy = (ih - sh) / 2;
      }

      const col = index % cols;
      const row = Math.floor(index / cols);

      const dx = col * cellW;
      const dy = row * cellH;

      ctx.drawImage(img, sx, sy, sw, sh, dx, dy, cellW, cellH);

      loadedCount++;
      if (loadedCount === shots.length) {
        const finalImage = canvas.toDataURL("image/png");
        localStorage.setItem("final4", finalImage);
        window.location.href = "finaltake.html";
      }
    };
  });
}