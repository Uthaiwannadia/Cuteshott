document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("finalCanvas");
  const ctx = canvas.getContext("2d");

  const downloadBtn = document.getElementById("downloadBtn");
  const homeBtn = document.getElementById("homeBtn");
  const frame1Btn = document.getElementById("frame1Btn");
  const frame2Btn = document.getElementById("frame2Btn");

  // โหลดรูป 4 ช่องจาก localStorage
  const collageData = localStorage.getItem("final4");

  if (!collageData) {
    alert("ไม่พบรูป 4 ช่อง กรุณากลับไปถ่ายใหม่จากหน้า camera.html");
    return;
  }

  // เก็บ state รูปและกรอบ
  const collageImg = new Image();
  const frameImg = new Image();

  let collageLoaded = false;
  let frameLoaded = false;

  // ใช้ Polaroid2 เป็นกรอบเริ่มต้น
  let currentFrameSrc = "Mymelodyypic/Polaroid2.png";

  function drawAll() {
    if (!collageLoaded || !frameLoaded) return;

    // ล้าง canvas ก่อน
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // วาดรูป 4 ช่อง (พื้นหลัง)
    ctx.drawImage(collageImg, 0, 0, canvas.width, canvas.height);

    // วาดกรอบ polaroid ทับ
    ctx.drawImage(frameImg, 0, 0, canvas.width, canvas.height);
  }

  // โหลดรูป 4 ช่อง
  collageImg.onload = () => {
    collageLoaded = true;
    drawAll();
  };

  // โหลดกรอบ
  frameImg.onload = () => {
    frameLoaded = true;
    drawAll();
  };

  // เริ่มโหลดรูป
  collageImg.src = collageData;
  frameImg.src = currentFrameSrc;

  /* ⭐ เปลี่ยนกรอบเป็น Polaroid2.png (Frame 1) */
  frame1Btn.addEventListener("click", () => {
    currentFrameSrc = "Mymelodyypic/Polaroid2.png";
    frameLoaded = false;
    frameImg.src = currentFrameSrc;
  });

  /* ⭐ เปลี่ยนกรอบเป็น Polaroid4.png (Frame 2) */
  frame2Btn.addEventListener("click", () => {
    currentFrameSrc = "Mymelodyypic/Polaroid4.png";
    frameLoaded = false;
    frameImg.src = currentFrameSrc;
  });

  /* ⭐ ปุ่ม Download */
  downloadBtn.addEventListener("click", () => {
    canvas.toBlob(blob => {
      if (!blob) return;
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'Myphoto.png';
      a.click();
      URL.revokeObjectURL(a.href);
    });
  });

  /* ⭐ ปุ่ม Restart → กลับหน้าแรก (เปลี่ยนได้ตามโปรเจกต์) */
  homeBtn.addEventListener("click", () => {
    window.location.href = "index.html"; // ถ้าเมนูหลักชื่อ menu.html ก็เปลี่ยนตรงนี้
  });
});
