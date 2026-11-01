/**
 * E-PORTFOLIO PPG PRAJABATAN INFORMATIKA UNY
 * Author: Nur Isnanto Nugroho, S.Pd.
 * 
 * Progressive Enhancement Helper Scripts (Non-Intrusive)
 */

// 1. PENGALIH TEMA TOGGLE (LIGHT / DARK MODE)
function toggleTheme() {
    const htmlEl = document.documentElement;
    const isDark = htmlEl.classList.toggle('dark');
    
    try {
        localStorage.setItem('theme_preference', isDark ? 'dark' : 'light');
    } catch (e) {
        // Fallback jika storage privat
    }

    const themeText = document.getElementById('themeText');
    if (themeText) {
        themeText.textContent = isDark ? 'Dark' : 'Light';
    }
    
    showToast(isDark ? 'Mode Gelap (Dark) Aktif' : 'Mode Terang (Light) Aktif');
}

// 2. SALIN KE PAPAN KLIP
function copyToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
            showToast('Disalin ke clipboard: ' + text);
        }).catch(() => {
            fallbackCopy(text);
        });
    } else {
        fallbackCopy(text);
    }
}

function fallbackCopy(text) {
    const temp = document.createElement('textarea');
    temp.value = text;
    temp.style.position = 'fixed';
    temp.style.left = '-9999px';
    document.body.appendChild(temp);
    temp.select();
    try {
        document.execCommand('copy');
        showToast('Disalin ke clipboard: ' + text);
    } catch (e) {
        alert('Teks: ' + text);
    }
    document.body.removeChild(temp);
}

// 3. TOAST NOTIFIKASI
let toastTimer = null;
function showToast(message) {
    const toast = document.getElementById('toastBox');
    const toastMsg = document.getElementById('toastMessage');
    if (!toast || !toastMsg) return;

    toastMsg.textContent = message;
    toast.classList.add('show-toast');

    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
        toast.classList.remove('show-toast');
    }, 3000);
}

// 4. MOBILE MENU & DROPDOWN TOGGLE
function toggleMobileMenu() {
    const menu = document.getElementById('mobileMenu');
    const navbar = document.querySelector('.top-navbar');
    if (menu) {
        const isShown = menu.classList.toggle('show');
        if (navbar) {
            navbar.classList.toggle('menu-open', isShown);
        }
    }
}

// 4.1 INTERAKSI DROPDOWN MENU (HOVER OTOMATIS & TOUCH FRIENDLY)
function initNavDropdowns() {
    const dropdowns = document.querySelectorAll('.nav-dropdown');
    if (!dropdowns.length) return;

    dropdowns.forEach(dropdown => {
        let closeTimeout;

        // Buka otomatis saat kursor mouse mendekat / masuk (tanpa perlu klik)
        dropdown.addEventListener('mouseenter', () => {
            if (closeTimeout) clearTimeout(closeTimeout);
            dropdown.classList.add('is-open');
        });

        // Tutup halus dengan jeda toleransi gerakan kursor
        dropdown.addEventListener('mouseleave', () => {
            closeTimeout = setTimeout(() => {
                dropdown.classList.remove('is-open');
            }, 250);
        });

        // Dukungan perangkat layar sentuh (mobile/tablet) saat tombol ditekan
        const btn = dropdown.querySelector('.nav-dropdown-btn');
        if (btn) {
            btn.addEventListener('click', (e) => {
                // Cegah lonjakan halaman jika berupa button biasa
                e.stopPropagation();
                const isOpen = dropdown.classList.contains('is-open');
                // Tutup dropdown lain jika ada
                dropdowns.forEach(d => d.classList.remove('is-open'));
                if (!isOpen) {
                    dropdown.classList.add('is-open');
                }
            });
        }
    });

    // Tutup dropdown jika mengklik di luar area menu
    document.addEventListener('click', (e) => {
        dropdowns.forEach(dropdown => {
            if (!dropdown.contains(e.target)) {
                dropdown.classList.remove('is-open');
            }
        });
    });
}

// 5. LOADING SCREEN (ROTATING 3D TEXT RING & BOUNCING BOX)
function initLoader() {
    const ring = document.getElementById('loaderRing');
    if (ring && ring.children.length === 0) {
        const text = 'PORTOFOLIO ✦ PORTOFOLIO ✦ PORTOFOLIO ✦ ';
        const chars = text.split('');
        const total = chars.length;
        chars.forEach((ch, i) => {
            const span = document.createElement('span');
            span.textContent = ch;
            span.style.setProperty('--angle', (i * (360 / total)) + 'deg');
            ring.appendChild(span);
        });
    }

    const loader = document.getElementById('loader');
    if (loader) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                loader.classList.add('loader--hidden');
                setTimeout(() => {
                    try { loader.remove(); } catch (e) {}
                }, 600);
            }, 1200);
        });

        // Fallback otomatis jika aset sudah selesai di-cache
        setTimeout(() => {
            if (loader && !loader.classList.contains('loader--hidden')) {
                loader.classList.add('loader--hidden');
                setTimeout(() => {
                    try { loader.remove(); } catch (e) {}
                }, 600);
            }
        }, 2800);
    }
}

// 6. INISIALISASI
document.addEventListener('DOMContentLoaded', () => {
    try {
        const savedTheme = localStorage.getItem('theme_preference');
        if (savedTheme === 'dark') {
            document.documentElement.classList.add('dark');
            const themeText = document.getElementById('themeText');
            if (themeText) themeText.textContent = 'Dark';
        }
    } catch (e) {}

    initLoader();
    initNavDropdowns();
});

// Jalankan juga segera jika DOM sudah siap
if (document.readyState !== 'loading') {
    initNavDropdowns();
}

// 7. SIKLUS TAB SWITCHER
function switchCycleTab(tabId) {
    const tabBtns = document.querySelectorAll('.cycle-tab-btn');
    const tabPanels = document.querySelectorAll('.cycle-tab-pane');

    tabBtns.forEach(btn => {
        if (btn.getAttribute('data-tab') === tabId) {
            btn.classList.add('active');
            btn.setAttribute('aria-selected', 'true');
        } else {
            btn.classList.remove('active');
            btn.setAttribute('aria-selected', 'false');
        }
    });

    tabPanels.forEach(panel => {
        if (panel.id === tabId) {
            panel.classList.remove('hidden');
            panel.classList.add('block');
        } else {
            panel.classList.add('hidden');
            panel.classList.remove('block');
        }
    });
}

// 8. VIDEO INTERACTIVE PLAY
function playCycleVideo(boxId, videoTitle) {
    const box = document.getElementById(boxId);
    if (!box) return;
    const overlay = box.querySelector('.video-overlay');
    const iframe = box.querySelector('.video-iframe');
    
    if (overlay) {
        overlay.classList.add('opacity-0', 'pointer-events-none');
        setTimeout(() => overlay.classList.add('hidden'), 300);
    }
    if (iframe) {
        iframe.classList.remove('hidden');
    }
    showToast('Memutar: ' + (videoTitle || 'Video Praktik Pembelajaran'));
}
