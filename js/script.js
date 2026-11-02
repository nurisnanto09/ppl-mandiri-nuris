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

// 9. PDF MODAL VIEWER SYSTEM
function openPdfModal(pdfUrl, pdfTitle) {
    let modal = document.getElementById('globalPdfModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'globalPdfModal';
        modal.className = 'pdf-modal';
        modal.innerHTML = `
            <div class="pdf-modal-dialog" role="dialog" aria-modal="true" aria-labelledby="pdfModalTitle">
                <div class="pdf-modal-header">
                    <div class="flex items-center gap-2.5 overflow-hidden">
                        <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase font-mono bg-royal-500 text-white dark:bg-neon dark:text-black">
                            <i class="ph-bold ph-file-pdf"></i> DOKUMEN RESMI PDF
                        </span>
                        <h3 id="pdfModalTitle" class="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white truncate">
                            Dokumen PDF
                        </h3>
                    </div>
                    <div class="flex items-center gap-2 shrink-0">
                        <a id="pdfModalOpenTab" href="#" target="_blank" rel="noopener noreferrer" class="btn-secondary text-xs py-1.5 px-3 inline-flex items-center gap-1" title="Buka di Tab Baru">
                            <i class="ph-bold ph-arrow-square-out"></i>
                            <span class="hidden sm:inline">Buka Penuh</span>
                        </a>
                        <a id="pdfModalDownload" href="#" download class="btn-secondary text-xs py-1.5 px-3 inline-flex items-center gap-1" title="Unduh File">
                            <i class="ph-bold ph-download-simple"></i>
                            <span class="hidden sm:inline">Unduh</span>
                        </a>
                        <button type="button" onclick="closePdfModal()" class="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 font-bold transition-colors" aria-label="Tutup Pratinjau PDF">
                            <i class="ph-bold ph-x text-base"></i>
                        </button>
                    </div>
                </div>
                <div class="pdf-modal-body">
                    <iframe id="pdfModalIframe" class="w-full h-full border-0" src="" title="PDF Viewer"></iframe>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closePdfModal();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('is-active')) {
                closePdfModal();
            }
        });
    }

    const titleEl = document.getElementById('pdfModalTitle');
    const openTabEl = document.getElementById('pdfModalOpenTab');
    const downloadEl = document.getElementById('pdfModalDownload');
    const iframeEl = document.getElementById('pdfModalIframe');

    if (titleEl) titleEl.textContent = pdfTitle || 'Pratinjau Dokumen PDF';
    if (openTabEl) openTabEl.href = pdfUrl;
    if (downloadEl) downloadEl.href = pdfUrl;
    if (iframeEl) iframeEl.src = pdfUrl;

    modal.classList.add('is-active');
    document.body.style.overflow = 'hidden';
    showToast('Membuka PDF: ' + (pdfTitle || 'Dokumen'));
}

function closePdfModal() {
    const modal = document.getElementById('globalPdfModal');
    if (!modal) return;
    const iframeEl = document.getElementById('pdfModalIframe');
    if (iframeEl) iframeEl.src = '';
    modal.classList.remove('is-active');
    document.body.style.overflow = '';
}

// 10. TOGGLE INLINE PDF EMBED VIEWER
function togglePdfEmbed(embedId, triggerBtn) {
    const box = document.getElementById(embedId);
    if (!box) return;
    const isHidden = box.classList.contains('hidden');
    if (isHidden) {
        box.classList.remove('hidden');
        if (triggerBtn) {
            triggerBtn.innerHTML = '<i class="ph-bold ph-eye-slash"></i> Sembunyikan Pratinjau PDF';
        }
        showToast('Menampilkan Pratinjau Dokumen');
    } else {
        box.classList.add('hidden');
        if (triggerBtn) {
            triggerBtn.innerHTML = '<i class="ph-bold ph-file-pdf"></i> Tampilkan Pratinjau PDF';
        }
        showToast('Pratinjau PDF Disembunyikan');
    }
}

// 11. HASH-BASED TAB ACTIVATION
function activateTabFromHash() {
    const hash = window.location.hash ? window.location.hash.substring(1) : '';
    if (!hash) return;
    const targetPane = document.getElementById(hash);
    if (targetPane && targetPane.classList.contains('cycle-tab-pane')) {
        switchCycleTab(hash);
        targetPane.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}
window.addEventListener('DOMContentLoaded', activateTabFromHash);
window.addEventListener('hashchange', activateTabFromHash);

