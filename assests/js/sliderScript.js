// متغيرات عامة
let currentSlideIndex = 0;
let slides = document.querySelectorAll('.slide');
let indicators = document.querySelectorAll('.indicator');
let isAutoPlaying = true;
let autoPlayInterval;
let allSlides = [...slides]; // نسخة من جميع الشرائح

// تشغيل تلقائي للشرائح
function startAutoPlay() {
    if (isAutoPlaying) {
        autoPlayInterval = setInterval(() => {
            changeSlide(1);
        }, 4000);
    }
}

// إيقاف التشغيل التلقائي
function stopAutoPlay() {
    clearInterval(autoPlayInterval);
}

// تغيير الشريحة
function changeSlide(direction) {
    const currentSlide = slides[currentSlideIndex];
    
    // إزالة الفئة النشطة من الشريحة الحالية
    currentSlide.classList.remove('active');
    indicators[currentSlideIndex].classList.remove('active');
    
    // تحديث الفهرس
    currentSlideIndex += direction;
    
    // التحقق من الحدود
    if (currentSlideIndex >= slides.length) {
        currentSlideIndex = 0;
    } else if (currentSlideIndex < 0) {
        currentSlideIndex = slides.length - 1;
    }
    
    // إضافة الفئة النشطة للشريحة الجديدة
    slides[currentSlideIndex].classList.add('active');
    indicators[currentSlideIndex].classList.add('active');
    
    // تأثير الحركة
    if (direction > 0) {
        slides[currentSlideIndex].classList.add('slide-in-right');
    } else {
        slides[currentSlideIndex].classList.add('slide-in-left');
    }
    
    // إزالة فئات الحركة بعد انتهاء الانتقال
    setTimeout(() => {
        slides[currentSlideIndex].classList.remove('slide-in-right', 'slide-in-left');
    }, 800);
}

// الانتقال إلى شريحة محددة
function currentSlide(n) {
    const targetIndex = n - 1;
    const direction = targetIndex > currentSlideIndex ? 1 : -1;
    
    slides[currentSlideIndex].classList.remove('active');
    indicators[currentSlideIndex].classList.remove('active');
    
    currentSlideIndex = targetIndex;
    
    slides[currentSlideIndex].classList.add('active');
    indicators[currentSlideIndex].classList.add('active');
    
    // تأثير الحركة
    if (direction > 0) {
        slides[currentSlideIndex].classList.add('slide-in-right');
    } else {
        slides[currentSlideIndex].classList.add('slide-in-left');
    }
    
    setTimeout(() => {
        slides[currentSlideIndex].classList.remove('slide-in-right', 'slide-in-left');
    }, 800);
    
    // إعادة تشغيل التشغيل التلقائي
    stopAutoPlay();
    startAutoPlay();
}

// فلترة الشرائح حسب الفئة
function filterSlides(category) {
    // تحديث أزرار الفلتر
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // إيقاف التشغيل التلقائي مؤقتاً
    stopAutoPlay();
    
    // إخفاء جميع الشرائح
    slides.forEach(slide => {
        slide.classList.remove('active');
    });
    
    // إخفاء جميع المؤشرات
    indicators.forEach(indicator => {
        indicator.style.display = 'none';
    });
    
    // تحديد الشرائح المطلوبة
    let filteredSlides;
    if (category === 'all') {
        filteredSlides = allSlides;
    } else {
        filteredSlides = allSlides.filter(slide => 
            slide.getAttribute('data-category') === category
        );
    }
    
    // تحديث مصفوفة الشرائح
    slides = filteredSlides;
    
    // إظهار المؤشرات المناسبة
    for (let i = 0; i < slides.length; i++) {
        if (indicators[i]) {
            indicators[i].style.display = 'block';
        }
    }
    
    // إخفاء المؤشرات الزائدة
    for (let i = slides.length; i < indicators.length; i++) {
        if (indicators[i]) {
            indicators[i].style.display = 'none';
        }
    }
    
    // إعادة تعيين الفهرس وإظهار أول شريحة
    currentSlideIndex = 0;
    if (slides.length > 0) {
        slides[0].classList.add('active');
        if (indicators[0]) {
            indicators[0].classList.add('active');
        }
    }
    
    // إعادة تشغيل التشغيل التلقائي
    setTimeout(() => {
        startAutoPlay();
    }, 1000);
}

// التحكم بلوحة المفاتيح
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        changeSlide(1);
        stopAutoPlay();
        startAutoPlay();
    } else if (e.key === 'ArrowRight') {
        changeSlide(-1);
        stopAutoPlay();
        startAutoPlay();
    } else if (e.key === ' ') {
        e.preventDefault();
        isAutoPlaying = !isAutoPlaying;
        if (isAutoPlaying) {
            startAutoPlay();
        } else {
            stopAutoPlay();
        }
    }
});

// إيقاف التشغيل التلقائي عند التحويم
document.querySelector('.wow-slider').addEventListener('mouseenter', () => {
    stopAutoPlay();
});

// إعادة تشغيل التشغيل التلقائي عند مغادرة المؤشر
document.querySelector('.wow-slider').addEventListener('mouseleave', () => {
    if (isAutoPlaying) {
        startAutoPlay();
    }
});

// دعم اللمس للأجهزة المحمولة
let touchStartX = 0;
let touchEndX = 0;

document.querySelector('.slider-container').addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
});

document.querySelector('.slider-container').addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 50;
    const swipeDistance = touchEndX - touchStartX;
    
    if (Math.abs(swipeDistance) > swipeThreshold) {
        if (swipeDistance > 0) {
            // السحب إلى اليمين - الشريحة السابقة
            changeSlide(-1);
        } else {
            // السحب إلى اليسار - الشريحة التالية
            changeSlide(1);
        }
        
        stopAutoPlay();
        startAutoPlay();
    }
}

// تأثيرات إضافية عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    // تأثير ظهور تدريجي للعنوان
    const title = document.querySelector('.main-title');
    title.style.opacity = '0';
    title.style.transform = 'translateY(-30px)';
    
    setTimeout(() => {
        title.style.transition = 'all 1s ease';
        title.style.opacity = '1';
        title.style.transform = 'translateY(0)';
    }, 300);
    
    // تأثير ظهور تدريجي للـ slider
    const slider = document.querySelector('.wow-slider');
    slider.style.opacity = '0';
    slider.style.transform = 'scale(0.9)';
    
    setTimeout(() => {
        slider.style.transition = 'all 1s ease';
        slider.style.opacity = '1';
        slider.style.transform = 'scale(1)';
    }, 600);
    
    // تأثير ظهور تدريجي للفلاتر
    const filters = document.querySelector('.category-filters');
    filters.style.opacity = '0';
    filters.style.transform = 'translateY(30px)';
    
    setTimeout(() => {
        filters.style.transition = 'all 1s ease';
        filters.style.opacity = '1';
        filters.style.transform = 'translateY(0)';
    }, 900);
    
    // بدء التشغيل التلقائي
    startAutoPlay();
});

// تحسين الأداء - تحميل الصور بشكل تدريجي
function lazyLoadImages() {
    const images = document.querySelectorAll('img');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// تشغيل تحميل الصور التدريجي
lazyLoadImages();

// إضافة تأثيرات صوتية (اختيارية)
function playSlideSound() {
    // يمكن إضافة أصوات للانتقالات هنا
    // const audio = new Audio('slide-sound.mp3');
    // audio.volume = 0.1;
    // audio.play().catch(() => {});
}

// تحديث المؤشرات عند تغيير الشرائح
function updateIndicators() {
    indicators.forEach((indicator, index) => {
        indicator.classList.toggle('active', index === currentSlideIndex);
    });
}

// إضافة تأثيرات الجسيمات (اختيارية)
function createParticles() {
    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'particles';
    particlesContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: -1;
    `;
    
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: absolute;
            width: 2px;
            height: 2px;
            background: rgba(255,255,255,0.1);
            border-radius: 50%;
            animation: float ${Math.random() * 3 + 2}s infinite linear;
            left: ${Math.random() * 100}%;
            animation-delay: ${Math.random() * 2}s;
        `;
        particlesContainer.appendChild(particle);
    }
    
    document.body.appendChild(particlesContainer);
}

// إضافة CSS للجسيمات
const particleCSS = `
@keyframes float {
    0% {
        transform: translateY(100vh) rotate(0deg);
        opacity: 0;
    }
    10% {
        opacity: 1;
    }
    90% {
        opacity: 1;
    }
    100% {
        transform: translateY(-100px) rotate(360deg);
        opacity: 0;
    }
}
`;

const style = document.createElement('style');
style.textContent = particleCSS;
document.head.appendChild(style);

// تشغيل تأثير الجسيمات
createParticles();

