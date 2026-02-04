const video = document.getElementById('mapVideo');
const nextBtn = document.getElementById('nextBtn');
const prevBtn = document.getElementById('prevBtn');
const overlay = document.getElementById('info-overlay');

const checkpoints = [0, 4.41, 7.41, 8.75, 10.29]; 
const content = [
    { title: "Start point", desc: "Starting our global visual tour.", img: "https://picsum.photos/400/250?random=1" },
    { title: "2", desc: "Arriving at the first designated location.", img: "https://picsum.photos/400/250?random=2" },
    { title: "3", desc: "Halfway through the map animation.", img: "https://picsum.photos/400/250?random=3" },
    { title: "4", desc: "Approaching the penultimate destination.", img: "https://picsum.photos/400/250?random=4" },
    { title: "Finish", desc: "The journey concludes at the final frame.", img: "https://picsum.photos/400/250?random=5" }
];

let currentStep = 0;
let isMoving = false;
let rewindInterval = null;
let hasTriggeredEntry = false; 
const leadTime = 0.65; 

function updateUI() {
    prevBtn.style.display = currentStep === 0 ? "none" : "flex";
    nextBtn.style.display = currentStep === checkpoints.length - 1 ? "none" : "flex";
}

function updateOverlayContent(step) {
    document.getElementById('overlay-title').innerText = content[step].title;
    document.getElementById('overlay-desc').innerText = content[step].desc;
    document.getElementById('overlay-img').src = content[step].img;
}

nextBtn.addEventListener('click', () => {
    if (isMoving) {
        finishMovement(true); 
        return;
    }
    if (currentStep < checkpoints.length - 1) {
        currentStep++;
        video.play();
        startSequence(1);
    }
});

prevBtn.addEventListener('click', () => {
    if (isMoving) {
        finishMovement(true); 
        return;
    }
    if (currentStep > 0) {
        currentStep--;
        startSequence(-1);
    }
});

function startSequence(direction) {
    isMoving = true;
    hasTriggeredEntry = false; 
    overlay.classList.remove('active');
    
    setTimeout(() => {
        updateUI();
        updateOverlayContent(currentStep);
        if (direction === -1) {
            video.pause();
            startReverse();
        }
    }, 300);
}

function startReverse() {
    const fps = 24;
    rewindInterval = setInterval(() => {
        const target = checkpoints[currentStep];
        
        if (!hasTriggeredEntry && video.currentTime <= target + leadTime) {
            hasTriggeredEntry = true;
            overlay.classList.add('active');
        }

        if (video.currentTime <= target + 0.04) {
            finishMovement(false);
        } else {
            video.currentTime -= (1 / fps);
        }
    }, 1000 / fps);
}

video.addEventListener('timeupdate', () => {
    if (isMoving && !rewindInterval) {
        const target = checkpoints[currentStep];

        if (!hasTriggeredEntry && video.currentTime >= target - leadTime) {
            hasTriggeredEntry = true;
            overlay.classList.add('active');
        }

        if (video.currentTime >= target) {
            finishMovement(false);
        }
    }
});

function finishMovement(isInstant) {
    if (rewindInterval) {
        clearInterval(rewindInterval);
        rewindInterval = null;
    }
    
    video.pause();
    video.currentTime = checkpoints[currentStep]; 
    isMoving = false;
    overlay.classList.add('active');
}

// Init
updateOverlayContent(0);
overlay.classList.add('active');
updateUI();

// Note: Keyboard navigation will still trigger even if section is out of view
window.addEventListener('keydown', (e) => {
    if (e.key === "ArrowRight") nextBtn.click();
    if (e.key === "ArrowLeft") prevBtn.click();
});