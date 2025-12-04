document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("finalCanvas");
  const ctx = canvas.getContext("2d");

  const W = canvas.width;
  const H = canvas.height;

  const keys = ["pic1", "pic2", "pic3", "pic4"];

  // ⭐ ปุ่มกรอบ 1 และ กรอบ 2 ปุ่มเฟรม
  const frame1Btn = document.getElementById("frame1Btn");
  const frame2Btn = document.getElementById("frame2Btn");

  // ⭐ ปุ่ม Download / Home เหมือนเดิม
  const downloadBtn = document.getElementById("downloadBtn");
  const homeBtn = document.getElementById("homeBtn");

  // ⭐ เก็บรูปที่โหลดแล้ว + สถานะ
  let loadedImages = [];
  let collageReady = false;

  // ⭐ กรอบปัจจุบัน (เริ่มต้นใช้ Polaroid2 เหมือนโค้ดก่อนหน้า)
  let currentFrameSrc = "Mymelodyypic/Polaroid2.png";

  // ⭐ ใช้ภาพกรอบตัวเดียว เปลี่ยน src เวลาเปลี่ยนกรอบ
  const frameImg = new Image();
  frameImg.onload = () => {
    if (!collageReady) return;
    drawBaseCollage();            // วาดพื้น + รูป 4 ช่องใหม่
    ctx.drawImage(frameImg, 0, 0, W, H); // วาดกรอบทับ
  };

  function loadImage(src) {
    return new Promise((resolve) => {
      if (!src) return resolve(null);
      const img = new Image();
      img.onload = () => resolve(img);
      img.src = src;
    });
  }

  // ⭐ ฟังก์ชันวาดพื้นหลัง + รูป 4 ช่อง
  function drawBaseCollage() {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, W, H);

    const paddingX = 42;
    const paddingY = 15;
    const gapX = 10;
    const gapY = 14;

    const slotW = (W - paddingX * 2 - gapX) / 2;
    const slotH = slotW * 1.7;

    const positions = [
      { x: paddingX, y: paddingY },
      { x: paddingX + slotW + gapX, y: paddingY },
      { x: paddingX, y: paddingY + slotH + gapY },
      { x: paddingX + slotW + gapX, y: paddingY + slotH + gapY },
    ];

    // วาดแบบ object-fit: cover
    loadedImages.forEach((img, i) => {
      if (!img) return;

      const { x, y } = positions[i];

      const iw = img.width;
      const ih = img.height;

      const slotR = slotW / slotH;
      const imgR = iw / ih;

      let sx, sy, sw, sh;

      if (imgR > slotR) {
        // รูปกว้างเกิน → ครอปด้านข้าง
        sh = ih;
        sw = ih * slotR;
        sx = (iw - sw) / 2;
        sy = 0;
      } else {
        // รูปสูงเกิน → ครอปด้านบนล่าง
        sw = iw;
        sh = iw / slotR;
        sx = 0;
        sy = (ih - sh) / 2;
      }

      ctx.drawImage(img, sx, sy, sw, sh, x, y, slotW, slotH);
    });
  }

  // ⭐ โหลดรูป 4 ช่องจาก localStorage
  Promise.all(keys.map(k => loadImage(localStorage.getItem(k))))
    .then(images => {
      loadedImages = images;
      collageReady = true;

      // ⭐ ปุ่มเฟรม
      frameImg.src = currentFrameSrc;
    });

  // ⭐ ปุ่มเฟรม
  frame1Btn.addEventListener("click", () => {
    currentFrameSrc = "Mymelodyypic/Polaroid2.png";
    if (collageReady) {
      frameImg.src = currentFrameSrc;
    }
  });

  // ⭐ ปุ่มเฟรม
  frame2Btn.addEventListener("click", () => {
    currentFrameSrc = "Mymelodyypic/Polaroid4.png";
    if (collageReady) {
      frameImg.src = currentFrameSrc;
    }
  });

  // ⭐ Download
  downloadBtn.addEventListener("click", () => {
    const link = document.createElement("a");
    link.download = "Myphoto.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  });

  // ⭐ Restart
  homeBtn.addEventListener("click", () => {
    localStorage.removeItem("pic1");
    localStorage.removeItem("pic2");
    localStorage.removeItem("pic3");
    localStorage.removeItem("pic4");
    window.location.href = "index.html";
  });
});