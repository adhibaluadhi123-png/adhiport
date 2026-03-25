const ROWS = 6;
const COLS = 6;
const BLOCK_SIZE = 50;
const COOLDOWN = 1000;
let globalRotation = 0;
let currentSection = 0;
let isAnimating = false;

const sections = [
  {
    title: "Hi, I'm Adithya Biju.",
    subtitle: "Cybersecurity Student • Graphic Designer • Digital Forensics Enthusiast",
    bg: "#8F00FF" // Violet
  },
  {
    title: "About Me",
    subtitle: "Cybersecurity-focused Computer Science student passionate about threat detection.",
    bg: "#4B0082" // Indigo
  },
  {
    title: "Skills",
    subtitle: "Penetration Testing, Digital Forensics, Network Security, and Cryptography.",
    bg: "#0000FF" // Blue
  },
  {
    title: "Experience",
    subtitle: "Cybercrime investigation, evidence collection, and digital analysis.",
    bg: "#008000" // Green
  },
  {
    title: "Projects",
    subtitle: "Projects listed below",
    bg: "#FFFF00" // Yellow
  },
  {
    title: "Education",
    subtitle: "B.Tech in CSE (Cybersecurity) & Certifications",
    bg: "#FFA500" // Orange
  },
  {
    title: "Contact",
    subtitle: "Hit me up. Let's build secure futures together.",
    bg: "#FF0000" // Red
  }
];

function setTargetFaceContent(targetFaceClass) {
  const titles = document.querySelectorAll(`${targetFaceClass} .section-title`);
  const subtitles = document.querySelectorAll(`${targetFaceClass} .section-subtitle`);
  
  if (currentSection === 0) {
    titles.forEach(el => el.innerText = sections[0].title);
    subtitles.forEach(el => {
      el.innerText = sections[0].subtitle;
      el.style.display = 'block';
    });
  } else {
    // Hide text in the puzzle grid for sections > 0
    titles.forEach(el => el.innerText = "");
    subtitles.forEach(el => el.style.display = 'none');
  }
}

function updateOverlays(direction = 1) {
  document.querySelectorAll('.content-section').forEach((sec, idx) => {
    // currentSection corresponds to indices: 0 is Hero, 1 is About (section-1 overlay), etc.
    if (idx + 1 === currentSection) {
      sec.style.display = 'flex';
      gsap.fromTo(sec, 
        { rotateX: -direction * 180, opacity: 0 },
        { rotateX: 0, opacity: 1, duration: 1, delay: 0.1, ease: "power2.inOut" }
      );
      sec.classList.add('active');
    } else {
      if (sec.classList.contains('active')) {
        gsap.fromTo(sec, 
          { rotateX: 0, opacity: 1 },
          { 
          rotateX: direction * 180, 
          opacity: 0, 
          duration: 1, 
          ease: "power2.inOut", 
          onComplete: () => sec.style.display = 'none' 
        });
        sec.classList.remove('active');
      }
    }
  });
}

function createTile(row, col) {
  const tile = document.createElement("div");
  tile.className = "tile";
  
  const contentHTML = `
    <div class="tile-content" style="left: calc(-100% * ${col}); top: calc(-100% * ${row});">
      <div class="content-wrapper">
        <div class="section-title"></div>
        <div class="section-subtitle"></div>
      </div>
    </div>
  `;

  tile.innerHTML = `
  <div class="tile-face tile-front">${contentHTML}</div>
  <div class="tile-face tile-back">${contentHTML}</div>
`;

  const bgPosition = `${col * 20}% ${row * 20}%`;
  tile.querySelector(".tile-front").style.backgroundPosition = bgPosition;
  tile.querySelector(".tile-back").style.backgroundPosition = bgPosition;

  return tile;
}

function createBoard() {
  const board = document.querySelector(".board");
  for (let i = 0; i < ROWS; i++) {
    const row = document.createElement("div");
    row.className = "row";
    for (let j = 0; j < COLS; j++) {
      row.appendChild(createTile(i, j));
    }
    board.appendChild(row);
  }
}

function initializeTileAnimations() {
  const tiles = document.querySelectorAll(".tile");
  tiles.forEach((tile, index) => {
    let lastEnterTime = 0;

    tile.addEventListener("mouseenter", () => {
      const currentTime = Date.now();
      if (currentTime - lastEnterTime > COOLDOWN) {
        lastEnterTime = currentTime;

        let tiltY;
        if (index % 6 === 0) {
          tiltY = -40;
        } else if (index % 6 === 5) {
          tiltY = 40;
        } else if (index % 6 === 1) {
          tiltY = -20;
        } else if (index % 6 === 4) {
          tiltY = 20;
        } else if (index % 6 === 2) {
          tiltY = -10;
        } else {
          tiltY = 10;
        }

        animateTile(tile, tiltY);
      }
    });
  });

  const nextBtn = document.getElementById("next-btn");
  const prevBtn = document.getElementById("prev-btn");
  
  nextBtn.addEventListener("click", () => flipAllTiles(1));
  prevBtn.addEventListener("click", () => flipAllTiles(-1));

  // Initialize text and background
  setTargetFaceContent('.tile-front');
  document.querySelector('.board').style.setProperty('--front-bg', sections[0].bg);
}

function animateTile(tile, tiltY) {
  gsap
    .timeline()
    .set(tile, { rotateX: globalRotation, rotateY: 0 })
    .to(tile, {
      rotateX: globalRotation + 270,
      rotateY: tiltY,
      duration: 0.5,
      ease: "power2.out",
    })
    .to(
      tile,
      {
        rotateX: globalRotation + 360,
        rotateY: 0,
        duration: 0.5,
        ease: "power2.out",
      },
      "-=0.25"
    );
}

function flipAllTiles(direction) {
  if (isAnimating) return;
  isAnimating = true;

  currentSection = (currentSection + direction + sections.length) % sections.length;
  globalRotation += direction * 180;
  
  const targetFaceIsBack = Math.abs((globalRotation / 180) % 2) === 1;
  const targetFace = targetFaceIsBack ? '--back-bg' : '--front-bg';
  const targetFaceClass = targetFaceIsBack ? '.tile-back' : '.tile-front';
  
  document.querySelector('.board').style.setProperty(targetFace, sections[currentSection].bg);
  setTargetFaceContent(targetFaceClass);
  updateOverlays(direction);

  const tiles = document.querySelectorAll(".tile");
  gsap.to(tiles, {
    rotateX: globalRotation,
    duration: 1,
    stagger: {
      amount: 0.5,
      from: "random",
    },
    ease: "power2.inOut"
  });
  
  // Animation duration is 1 + stagger max 0.5 = 1.5s
  setTimeout(() => {
    isAnimating = false;
  }, 1600);
}

function jumpToSection(index) {
  if (isAnimating || currentSection === index) return;
  const direction = index > currentSection ? 1 : -1;
  
  // Need to adjust global rotation properly. 
  // For simplicity if we jump we just rotate 180 in the right direction
  currentSection = index - direction; // Offset so flipAllTiles lands on `index`
  flipAllTiles(direction);
}

function createBlocks() {
  const blockContainer = document.getElementById("blocks");
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;
  const numCols = Math.ceil(screenWidth / BLOCK_SIZE);
  const numRows = Math.ceil(screenHeight / BLOCK_SIZE);
  const numBlocks = numCols * numRows;

  for (let i = 0; i < numBlocks; i++) {
    const block = document.createElement("div");
    block.classList.add("block");
    block.dataset.index = i;
    blockContainer.appendChild(block);
  }

  return { numCols, numBlocks };
}

function highlightBlock(event) {
  const { numCols } = window.blockInfo;
  const blockContainer = document.getElementById("blocks");
  const rect = blockContainer.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  const col = Math.floor(x / BLOCK_SIZE);
  const row = Math.floor(y / BLOCK_SIZE);
  const index = row * numCols + col;

  const block = blockContainer.children[index];
  if (block) {
    block.classList.add("highlight");
    setTimeout(() => {
      block.classList.remove("highlight");
    }, 250);
  }
}

function init() {
  createBoard();
  initializeTileAnimations();
  window.blockInfo = createBlocks();
  document.addEventListener("mousemove", highlightBlock);

  // Custom Graffiti Cursor
  const customCursor = document.createElement("div");
  customCursor.classList.add("graffiti-cursor");
  document.body.appendChild(customCursor);
  
  document.addEventListener("mousemove", (e) => {
    customCursor.style.left = e.clientX + "px";
    customCursor.style.top = e.clientY + "px";
  });

  const interactables = document.querySelectorAll('.nav-arrow, a, .graffiti-card, .menu-toggle, .close-btn');
  interactables.forEach(el => {
    el.addEventListener('mouseenter', () => customCursor.classList.add('hover'));
    el.addEventListener('mouseleave', () => customCursor.classList.remove('hover'));
  });

  const navLinks = document.querySelectorAll('.nav-links a');
  const sideNav = document.getElementById('side-nav');
  const menuBtn = document.getElementById('menu-btn');
  const closeBtn = document.getElementById('close-btn');

  menuBtn.addEventListener('click', () => {
    sideNav.classList.add('open');
  });

  closeBtn.addEventListener('click', () => {
    sideNav.classList.remove('open');
  });

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      sideNav.classList.remove('open');
      const targetIndex = parseInt(link.getAttribute('data-target'));
      jumpToSection(targetIndex);
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  init();
});
