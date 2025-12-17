document.addEventListener('DOMContentLoaded', () => {
    // 1. Tilt Effect
    const tiltElements = document.querySelectorAll('[data-tilt]');
    tiltElements.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -5;
            const rotateY = ((x - centerX) / centerX) * 5;
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
        });
    });

    // 2. Carousel Logic
    const carouselData = [
        {
            title: "Albanian Riviera",
            price: "$450",
            subtitle: "7 Days • Flight Included",
            image: "https://images.unsplash.com/photo-1540206351-d6465b3ac5c1?q=80&w=2664&auto=format&fit=crop",
            tags: [
                { icon: "star", text: "Dupe Alert", color: "#FFD700" },
                { icon: "verified_user", text: "Visa Free", color: "#60A5FA" }
            ]
        },
        {
            title: "Zanzibar",
            price: "₦395,000",
            subtitle: "Island Getaway • 4 Nights",
            image: "https://images.unsplash.com/photo-1586500036706-41963de24d8b?q=80&w=2574&auto=format&fit=crop",
            tags: [
                { icon: "beach_access", text: "Paradise", color: "#38BDF8" }
            ]
        },
        {
            title: "Bali",
            price: "€420", // Using Euro for variety
            subtitle: "Spiritual • 6 Nights",
            image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=2738&auto=format&fit=crop",
            tags: [
                { icon: "self_improvement", text: "Zen", color: "#A3E635" },
                { icon: "flight", text: "Direct", color: "#fff" }
            ]
        }
    ];

    let currentIndex = 0;
    const domImage = document.getElementById('carouselImage');
    const domTitle = document.getElementById('carouselTitle');
    const domPrice = document.getElementById('carouselPrice');
    const domSubtitle = document.getElementById('carouselSubtitle');
    const domTags = document.getElementById('carouselTags');

    function updateCarousel() {
        const data = carouselData[currentIndex];

        // Fade Out
        domImage.style.opacity = 0;

        setTimeout(() => {
            // Update Data
            domImage.style.backgroundImage = `url('${data.image}')`;
            domTitle.innerText = data.title;
            domPrice.innerText = data.price;
            domSubtitle.innerText = data.subtitle;

            // Build Tags
            domTags.innerHTML = data.tags.map(tag => `
                <div class="badge-glass" style="border-color: ${tag.color};">
                    <span class="material-icons" style="font-size: 14px; color: ${tag.color};">${tag.icon}</span>
                    <span style="color: ${tag.color};">${tag.text}</span>
                </div>
            `).join('');

            // Fade In
            domImage.style.opacity = 1;

            // Next Index
            currentIndex = (currentIndex + 1) % carouselData.length;
        }, 500); // Wait for fade out
    }

    // Initialize CSS transition
    if (domImage) {
        domImage.style.transition = "opacity 0.5s ease";
        // Start loop
        setInterval(updateCarousel, 4000); // Chang every 4 seconds
        // Initial render
        updateCarousel();
    }
    // 3. Floating Navbar Logic
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 4. Modal Logic
    const modal = document.getElementById('appModal');
    const closeBtn = document.querySelector('.modal-close');
    // Select all download triggers (navbar pills, hero button, footer link)
    const downloadTriggers = document.querySelectorAll('.download-pill, a[href="#download"], .footer-link[href="#"]');

    // Open
    downloadTriggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            // Check if it's potentially a download link (text content check is loose but effective here)
            if (trigger.textContent.includes('Download') || trigger.textContent.includes('Get the App') || trigger.textContent.includes('Start Your Voyage')) {
                e.preventDefault();
                modal.classList.remove('hidden');
            }
        });
    });

    // Close
    closeBtn.addEventListener('click', () => {
        modal.classList.add('hidden');
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.add('hidden');
        }
    });

    // 5. Cursor Map Trail
    // 5. Advanced Cursor Trail (Dash & X)
    let mouseX = 0, mouseY = 0;
    let trailX = 0, trailY = 0;
    let lastDropX = 0, lastDropY = 0;
    let dropCounter = 0;

    // Track real mouse position
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function createTrailItem(x, y, angle) {
        dropCounter++;
        const el = document.createElement('div');

        // Decide: Dash or X? (Drop an X every 5th item)
        if (dropCounter % 5 === 0) {
            el.classList.add('trail-element', 'trail-x');
            el.textContent = 'x';
            // Optional: Rotate X
            // el.style.transform = `rotate(${angle}rad)`; 
        } else {
            el.classList.add('trail-element', 'trail-dash');
            // Rotate the dash to follow the path
            el.style.setProperty('--trail-angle', `${angle}rad`);
        }

        // Position center
        el.style.left = `${x}px`;
        el.style.top = `${y}px`;

        document.body.appendChild(el);

        // Cleanup
        setTimeout(() => {
            el.remove();
        }, 1500);
    }

    function animateTrail() {
        // Stop if modal is open
        if (!modal.classList.contains('hidden')) {
            requestAnimationFrame(animateTrail);
            return;
        }

        // Smoothing: Move trail 15% towards mouse
        trailX += (mouseX - trailX) * 0.15;
        trailY += (mouseY - trailY) * 0.15;

        // Distance check
        const dist = Math.hypot(trailX - lastDropX, trailY - lastDropY);

        if (dist > 25) {
            const angle = Math.atan2(trailY - lastDropY, trailX - lastDropX);
            createTrailItem(trailX, trailY, angle);
            lastDropX = trailX;
            lastDropY = trailY;
        }

        requestAnimationFrame(animateTrail);
    }

    // Initialize positions to avoid initial jump
    trailX = mouseX;
    trailY = mouseY;
    lastDropX = mouseX;
    lastDropY = mouseY;

    animateTrail();
});
