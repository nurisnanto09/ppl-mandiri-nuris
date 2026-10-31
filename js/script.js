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

// Support click toggle for dropdown on touch devices
document.addEventListener('click', (e) => {
    const dropdown = document.querySelector('.nav-dropdown');
    const btn = e.target.closest('.nav-dropdown-btn');
    if (btn && dropdown) {
        dropdown.classList.toggle('is-open');
    } else if (dropdown && !dropdown.contains(e.target)) {
        dropdown.classList.remove('is-open');
    }
});

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
});
