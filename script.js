const gallery = document.getElementById('gallery');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const closeBtn = document.getElementById('closeBtn');

// CONFIGURATION
const totalImages = 20;
const folderPath = 'images/'; 
// NOTE: Ensure you have a folder named 'images' with files named "image (1).png", etc.

for (let i = 1; i <= totalImages; i++) {
    // Construct filename
    const fullPath = `${folderPath}image (${i}).webp`;

    // 1. Create structure
    const container = document.createElement('div');
    container.className = 'img-container';

    const img = document.createElement('img');
    
    // Fallback/Placeholder logic (Optional: prevents broken images if you don't have files yet)
    // If you have real files, the 'onerror' will just be ignored.
    img.src = fullPath;
    img.onerror = function() {
        this.src = `https://placehold.co/400x${300 + (i * 20)}/E6E2DD/2C2C2C?text=Img+${i}`;
        this.onerror = null; 
    };

    const caption = document.createElement('p');
    caption.className = 'date-caption';
    caption.innerText = "Loading Date...";

    // 2. Open Lightbox
    img.onclick = () => {
        // Use the actual current source (incase it fell back to placeholder)
        lightboxImg.src = img.src; 
        lightbox.style.display = 'flex';
    };

    // 3. Get Date (Non-blocking)
    // Note: This requires a running local server (e.g. VS Code Live Server) to fetch headers
    fetch(fullPath, { method: 'HEAD' })
        .then(res => {
            const dateStr = res.headers.get('Last-Modified');
            caption.innerText = dateStr ? new Date(dateStr).toLocaleDateString() : "Undated";
        })
        .catch(() => {
            // If fetch fails (e.g. placeholder or local file restriction), show a default
            caption.innerText = "Digital Sketch"; 
        });

    container.appendChild(img);
    container.appendChild(caption);
    gallery.appendChild(container);
}

// Exit logic
closeBtn.onclick = () => lightbox.style.display = 'none';
lightbox.onclick = (e) => { if (e.target !== lightboxImg) lightbox.style.display = 'none'; };
document.onkeydown = (e) => { if (e.key === "Escape") lightbox.style.display = 'none'; };