const gallery = document.getElementById('gallery');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const closeBtn = document.getElementById('closeBtn');
const filterBtns = document.querySelectorAll('.filter-btn');

// CONFIGURATION: Map your images to their categories here.
const folderPath = 'galleryImages/'; 
const imageDatabase = [
    { filename: 'image (1).webp', category: '3D' },
    { filename: 'image (2).webp', category: '3D' },
    { filename: 'image (3).webp', category: '3D' },
    { filename: 'image (4).webp', category: '3D' },
    { filename: 'image (5).webp', category: '3D' },
    { filename: 'image (6).webp', category: '3D' },
    { filename: 'image (7).webp', category: '3D' },
    { filename: 'image (8).webp', category: '3D' },
    { filename: 'image (9).webp', category: '3D' },
    { filename: 'image (10).webp', category: '3D' },
    { filename: 'image (11).webp', category: '3D' },
    { filename: 'image (12).webp', category: '3D' },
    { filename: 'image (13).webp', category: '3D' },
    { filename: 'image (14).webp', category: '3D' },
    { filename: 'image (15).webp', category: '3D' },
    { filename: 'image (16).webp', category: '3D' },
    { filename: 'image (17).webp', category: '3D' },
    { filename: 'image (18).webp', category: '3D' },
    { filename: 'image (19).webp', category: '3D' },
    { filename: 'image (20).webp', category: '3D' },
    { filename: 'image (21).webp', category: 'Photography' },
    { filename: 'image (22).webp', category: 'Photography' },
    { filename: 'image (23).webp', category: 'Photography' },
    { filename: 'image (24).webp', category: 'Photography' }
];

// Render the gallery
imageDatabase.forEach((item, index) => {
    const fullPath = `${folderPath}${item.filename}`;

    // 1. Create structure
    const container = document.createElement('div');
    container.className = 'img-container';
    container.setAttribute('data-category', item.category); // Assign category tag for CSS filtering

    const img = document.createElement('img');
    
    // Prioritize loading top images, lazy load the rest
    if (index < 4) {
        img.loading = "eager"; 
    } else {
        img.loading = "lazy";
    }

    // Fallback/Placeholder logic
    img.src = fullPath;
    img.onerror = function() {
        this.src = `https://placehold.co/400x${300 + ((index + 1) * 20)}/E6E2DD/2C2C2C?text=${item.category}+Img+${index + 1}`;
        this.onerror = null; 
    };

    const caption = document.createElement('p');
    caption.className = 'date-caption';
    caption.innerText = "Loading Date...";

    // 2. Open Lightbox
    img.onclick = () => {
        lightboxImg.src = img.src; 
        lightbox.style.display = 'flex';
    };

    // 3. Get Date (Non-blocking)
    fetch(fullPath, { method: 'HEAD' })
        .then(res => {
            const dateStr = res.headers.get('Last-Modified');
            caption.innerText = dateStr ? new Date(dateStr).toLocaleDateString() : "Undated";
        })
        .catch(() => {
            caption.innerText = item.category + " Work"; 
        });

    container.appendChild(img);
    container.appendChild(caption);
    gallery.appendChild(container);
});

// 4. Filtering Logic
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Update active button styling
        document.querySelector('.filter-btn.active').classList.remove('active');
        btn.classList.add('active');

        const filterValue = btn.getAttribute('data-filter');
        const allImages = document.querySelectorAll('.img-container');

        allImages.forEach(container => {
            if (filterValue === 'all' || container.getAttribute('data-category') === filterValue) {
                container.style.display = 'block'; // Show item
            } else {
                container.style.display = 'none';  // Hide item
            }
        });
    });
});

// Exit logic
closeBtn.onclick = () => lightbox.style.display = 'none';
lightbox.onclick = (e) => { if (e.target !== lightboxImg) lightbox.style.display = 'none'; };
document.onkeydown = (e) => { if (e.key === "Escape") lightbox.style.display = 'none'; };