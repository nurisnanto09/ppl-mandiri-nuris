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

// 4.2 NAVBAR SCROLL EFFECT (ATTACHED PRE-SCROLL -> FLOATING CAPSULE ON SCROLL)
function initNavbarScroll() {
    const navbar = document.querySelector('.top-navbar');
    if (!navbar) return;

    let ticking = false;
    const updateNavbar = () => {
        if (window.scrollY > 20) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        ticking = false;
    };

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(updateNavbar);
            ticking = true;
        }
    }, { passive: true });

    // Cek status scroll awal saat halaman pertama dimuat
    updateNavbar();
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
        const hideLoader = () => {
            if (!loader.classList.contains('loader--hidden')) {
                loader.classList.add('loader--hidden');
                setTimeout(() => {
                    try { loader.remove(); } catch (e) {}
                }, 600);
            }
        };

        if (document.readyState === 'complete') {
            setTimeout(hideLoader, 600);
        } else {
            window.addEventListener('load', () => {
                setTimeout(hideLoader, 600);
            });
        }

        // Fallback pengaman otomatis jika aset eksternal lambat
        setTimeout(hideLoader, 2000);
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
    initNavbarScroll();
    activateTabFromHash();
    initInlinePdfViewers();
});

// Jalankan juga segera jika DOM sudah siap
if (document.readyState !== 'loading') {
    initLoader();
    initNavDropdowns();
    initNavbarScroll();
    initInlinePdfViewers();
}


// 7.1 SWITCHER TAB LEMBAR KERJA (LK) 4 DI HALAMAN ANALISIS
function switchAnalisisLkTab(tabId) {
    const btns = document.querySelectorAll('.lk-tab-btn');
    const panes = document.querySelectorAll('.lk-tab-pane');
    if (!btns.length || !panes.length) return;

    btns.forEach(btn => {
        if (btn.getAttribute('data-tab') === tabId) {
            btn.classList.add('active');
            btn.setAttribute('aria-selected', 'true');
        } else {
            btn.classList.remove('active');
            btn.setAttribute('aria-selected', 'false');
        }
    });

    panes.forEach(pane => {
        if (pane.id === tabId) {
            pane.classList.remove('hidden');
        } else {
            pane.classList.add('hidden');
        }
    });
    setTimeout(refreshVisibleInlinePdfs, 80);
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
    setTimeout(refreshVisibleInlinePdfs, 80);
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

// 9. PDF.JS HTML5 CANVAS ENGINE & ZERO AUTO-DOWNLOAD VIEWER
if (typeof pdfjsLib !== 'undefined') {
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'js/pdf.worker.min.js';
}

// 9.1 GLOBAL PDF MODAL CANVAS VIEWER
let currentModalDoc = null;
let currentModalPage = 1;
let currentModalTotalPages = 1;
let currentModalScale = 1.0;
let modalRenderTask = null;
let currentModalUrl = '';

function openPdfModal(pdfUrl, pdfTitle) {
    if (!pdfUrl) return;
    const cleanUrl = pdfUrl.split('#')[0];
    currentModalUrl = cleanUrl;

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
                        <a id="pdfModalDownload" href="#" download class="btn-secondary text-xs py-1.5 px-3 inline-flex items-center gap-1" title="Unduh Berkas PDF">
                            <i class="ph-bold ph-download-simple"></i>
                            <span class="hidden sm:inline">Unduh PDF</span>
                        </a>
                        <button type="button" onclick="closePdfModal()" class="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 font-bold transition-colors" aria-label="Tutup Pratinjau PDF">
                            <i class="ph-bold ph-x text-base"></i>
                        </button>
                    </div>
                </div>

                <div class="pdf-canvas-toolbar">
                    <div class="flex items-center gap-1.5 sm:gap-2">
                        <button type="button" id="modalPdfPrevBtn" class="px-2.5 py-1 rounded bg-royal-600 hover:bg-royal-500 text-white font-bold text-xs inline-flex items-center gap-1 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
                            <i class="ph-bold ph-caret-left"></i>
                            <span class="hidden xs:inline">Prev</span>
                        </button>
                        <span id="modalPdfPageNum" class="font-mono text-xs px-2.5 py-1 rounded bg-black/40 text-royal-200 font-semibold border border-royal-500/20">
                            Hal 1 / 1
                        </span>
                        <button type="button" id="modalPdfNextBtn" class="px-2.5 py-1 rounded bg-royal-600 hover:bg-royal-500 text-white font-bold text-xs inline-flex items-center gap-1 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
                            <span class="hidden xs:inline">Next</span>
                            <i class="ph-bold ph-caret-right"></i>
                        </button>
                    </div>
                    <div class="flex items-center gap-1.5">
                        <button type="button" id="modalPdfZoomOutBtn" class="w-7 h-7 rounded bg-royal-900/60 hover:bg-royal-800 text-white flex items-center justify-center font-bold text-xs border border-royal-500/30 transition-all" title="Perkecil (-)">
                            <i class="ph-bold ph-minus"></i>
                        </button>
                        <span id="modalPdfZoomVal" class="font-mono text-xs px-2 text-slate-300 font-semibold min-w-[48px] text-center">
                            100%
                        </span>
                        <button type="button" id="modalPdfZoomInBtn" class="w-7 h-7 rounded bg-royal-900/60 hover:bg-royal-800 text-white flex items-center justify-center font-bold text-xs border border-royal-500/30 transition-all" title="Perbesar (+)">
                            <i class="ph-bold ph-plus"></i>
                        </button>
                        <button type="button" id="modalPdfFitBtn" class="px-2 py-1 rounded bg-royal-900/60 hover:bg-royal-800 text-royal-200 hover:text-white text-xs font-semibold border border-royal-500/30 transition-all" title="Sesuaikan Lebar Layar">
                            Fit Layar
                        </button>
                    </div>
                </div>

                <div id="pdfModalViewerContainer" class="pdf-canvas-viewport">
                    <div id="modalPdfLoading" class="pdf-canvas-loading">
                        <div class="w-10 h-10 border-4 border-royal-500 border-t-transparent rounded-full animate-spin"></div>
                        <span class="text-xs text-slate-400 font-mono">Memuat dokumen PDF...</span>
                    </div>
                    <canvas id="pdfModalCanvas" class="pdf-rendered-canvas hidden"></canvas>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        modal.addEventListener('click', (e) => {
            if (e.target === modal) closePdfModal();
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('is-active')) {
                closePdfModal();
            }
        });

        document.getElementById('modalPdfPrevBtn').addEventListener('click', () => {
            if (currentModalDoc && currentModalPage > 1) {
                currentModalPage--;
                renderModalPdfPage();
            }
        });

        document.getElementById('modalPdfNextBtn').addEventListener('click', () => {
            if (currentModalDoc && currentModalPage < currentModalTotalPages) {
                currentModalPage++;
                renderModalPdfPage();
            }
        });

        document.getElementById('modalPdfZoomInBtn').addEventListener('click', () => {
            if (!currentModalDoc) return;
            currentModalScale = Math.min(currentModalScale + 0.25, 3.0);
            renderModalPdfPage();
        });

        document.getElementById('modalPdfZoomOutBtn').addEventListener('click', () => {
            if (!currentModalDoc) return;
            currentModalScale = Math.max(currentModalScale - 0.25, 0.5);
            renderModalPdfPage();
        });

        document.getElementById('modalPdfFitBtn').addEventListener('click', () => {
            if (!currentModalDoc) return;
            currentModalScale = 1.0;
            renderModalPdfPage();
        });
    }

    const titleEl = document.getElementById('pdfModalTitle');
    const downloadEl = document.getElementById('pdfModalDownload');
    const loadingEl = document.getElementById('modalPdfLoading');
    const canvasEl = document.getElementById('pdfModalCanvas');

    if (titleEl) titleEl.textContent = pdfTitle || 'Dokumen PDF';
    if (downloadEl) downloadEl.href = cleanUrl;

    modal.classList.add('is-active');
    document.body.style.overflow = 'hidden';

    if (loadingEl) {
        loadingEl.classList.remove('hidden');
        loadingEl.innerHTML = `
            <div class="w-10 h-10 border-4 border-royal-500 border-t-transparent rounded-full animate-spin"></div>
            <span class="text-xs text-slate-400 font-mono">Memuat dokumen PDF...</span>
        `;
    }
    if (canvasEl) canvasEl.classList.add('hidden');

    currentModalPage = 1;
    currentModalScale = 1.0;

    if (typeof pdfjsLib === 'undefined') {
        if (loadingEl) {
            loadingEl.innerHTML = `
                <div class="text-center p-6 text-slate-300">
                    <p class="mb-3 text-red-400 font-bold">Modul penampil PDF belum siap.</p>
                    <a href="${cleanUrl}" download class="btn-primary py-2 px-4 text-xs inline-flex items-center gap-1.5">
                        <i class="ph-bold ph-download-simple"></i> Unduh File PDF
                    </a>
                </div>
            `;
        }
        return;
    }

    if (modalRenderTask) {
        try { modalRenderTask.cancel(); } catch (e) {}
        modalRenderTask = null;
    }

    pdfjsLib.getDocument(cleanUrl).promise.then(doc => {
        currentModalDoc = doc;
        currentModalTotalPages = doc.numPages;
        renderModalPdfPage();
        showToast('Membuka PDF: ' + (pdfTitle || 'Dokumen'));
    }).catch(err => {
        console.error('Error loading PDF modal:', err);
        if (loadingEl) {
            loadingEl.innerHTML = `
                <div class="text-center p-6 text-slate-300">
                    <i class="ph-bold ph-warning-circle text-3xl text-amber-400 mb-2"></i>
                    <p class="text-sm font-bold text-white mb-2">Gagal memuat dokumen PDF.</p>
                    <p class="text-xs text-slate-400 mb-4">${err.message || ''}</p>
                    <a href="${cleanUrl}" download class="btn-primary py-2 px-4 text-xs inline-flex items-center gap-1.5">
                        <i class="ph-bold ph-download-simple"></i> Unduh Berkas Langsung
                    </a>
                </div>
            `;
        }
    });
}

function renderModalPdfPage() {
    if (!currentModalDoc) return;
    const canvas = document.getElementById('pdfModalCanvas');
    const loading = document.getElementById('modalPdfLoading');
    const pageNumEl = document.getElementById('modalPdfPageNum');
    const zoomValEl = document.getElementById('modalPdfZoomVal');
    const prevBtn = document.getElementById('modalPdfPrevBtn');
    const nextBtn = document.getElementById('modalPdfNextBtn');
    const viewportBox = document.getElementById('pdfModalViewerContainer');

    if (!canvas || !viewportBox) return;

    if (pageNumEl) pageNumEl.textContent = `Hal ${currentModalPage} / ${currentModalTotalPages}`;
    if (zoomValEl) zoomValEl.textContent = `${Math.round(currentModalScale * 100)}%`;
    if (prevBtn) prevBtn.disabled = currentModalPage <= 1;
    if (nextBtn) nextBtn.disabled = currentModalPage >= currentModalTotalPages;

    if (modalRenderTask) {
        try { modalRenderTask.cancel(); } catch (e) {}
        modalRenderTask = null;
    }

    currentModalDoc.getPage(currentModalPage).then(page => {
        const containerWidth = Math.max(280, (viewportBox.clientWidth || 800) - 32);
        const unscaledViewport = page.getViewport({ scale: 1.0 });
        const baseScale = containerWidth / unscaledViewport.width;
        const finalScale = baseScale * currentModalScale;
        const viewport = page.getViewport({ scale: finalScale });

        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = Math.floor(viewport.width * dpr);
        canvas.height = Math.floor(viewport.height * dpr);
        canvas.style.width = Math.floor(viewport.width) + 'px';
        canvas.style.height = Math.floor(viewport.height) + 'px';

        const ctx = canvas.getContext('2d', { alpha: false });
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        const transform = dpr !== 1 ? [dpr, 0, 0, dpr, 0, 0] : null;
        const renderContext = {
            canvasContext: ctx,
            transform: transform,
            viewport: viewport
        };

        modalRenderTask = page.render(renderContext);
        modalRenderTask.promise.then(() => {
            modalRenderTask = null;
            if (loading) loading.classList.add('hidden');
            canvas.classList.remove('hidden');
        }).catch(err => {
            if (err && err.name === 'RenderingCancelledException') return;
            console.error('Render modal page error:', err);
        });
    });
}

function closePdfModal() {
    const modal = document.getElementById('globalPdfModal');
    if (!modal) return;
    if (modalRenderTask) {
        try { modalRenderTask.cancel(); } catch (e) {}
        modalRenderTask = null;
    }
    modal.classList.remove('is-active');
    document.body.style.overflow = '';
}

// 9.2 INLINE PDF CANVAS VIEWER SYSTEM (ZERO AUTO-DOWNLOAD)
const inlinePdfInstances = new Map();

function initInlinePdfViewers() {
    if (typeof pdfjsLib === 'undefined') return;
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'js/pdf.worker.min.js';

    const embeds = document.querySelectorAll('.pdf-canvas-embed');
    embeds.forEach((container, idx) => {
        if (container.dataset.initialized === 'true') return;
        container.dataset.initialized = 'true';

        const rawUrl = container.getAttribute('data-pdf') || '';
        const pdfUrl = rawUrl.split('#')[0];
        const pdfTitle = container.getAttribute('data-title') || 'Dokumen PDF';

        container.innerHTML = `
            <div class="pdf-canvas-toolbar">
                <div class="flex items-center gap-2 overflow-hidden">
                    <span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-royal-500/20 text-royal-300 border border-royal-500/30">
                        <i class="ph-bold ph-file-pdf"></i> PDF
                    </span>
                    <span class="text-xs font-bold text-white truncate max-w-[160px] sm:max-w-[300px]" title="${pdfTitle}">
                        ${pdfTitle}
                    </span>
                </div>
                <div class="flex items-center gap-1.5 sm:gap-2">
                    <div class="flex items-center gap-1">
                        <button type="button" class="pdf-prev-btn px-2 py-1 rounded bg-royal-700/80 hover:bg-royal-600 text-white font-bold text-xs disabled:opacity-40 disabled:cursor-not-allowed transition-all" title="Halaman Sebelumnya">
                            <i class="ph-bold ph-caret-left"></i>
                        </button>
                        <span class="pdf-page-display font-mono text-[11px] px-2 py-0.5 rounded bg-black/40 text-royal-200 border border-royal-500/20 min-w-[64px] text-center">
                            Hal 1 / 1
                        </span>
                        <button type="button" class="pdf-next-btn px-2 py-1 rounded bg-royal-700/80 hover:bg-royal-600 text-white font-bold text-xs disabled:opacity-40 disabled:cursor-not-allowed transition-all" title="Halaman Berikutnya">
                            <i class="ph-bold ph-caret-right"></i>
                        </button>
                    </div>
                    <div class="hidden sm:flex items-center gap-1">
                        <button type="button" class="pdf-zoomout-btn w-6 h-6 rounded bg-royal-900/60 hover:bg-royal-800 text-white flex items-center justify-center text-xs border border-royal-500/30" title="Perkecil">
                            <i class="ph-bold ph-minus"></i>
                        </button>
                        <span class="pdf-zoom-val font-mono text-[11px] text-slate-300 w-9 text-center">100%</span>
                        <button type="button" class="pdf-zoomin-btn w-6 h-6 rounded bg-royal-900/60 hover:bg-royal-800 text-white flex items-center justify-center text-xs border border-royal-500/30" title="Perbesar">
                            <i class="ph-bold ph-plus"></i>
                        </button>
                    </div>
                    <button type="button" class="pdf-fullscreen-btn px-2.5 py-1 rounded bg-royal-600 hover:bg-royal-500 text-white text-xs font-semibold inline-flex items-center gap-1 transition-all" title="Buka Pratinjau Layar Penuh">
                        <i class="ph-bold ph-corners-out"></i>
                        <span class="hidden md:inline">Layar Penuh</span>
                    </button>
                    <a href="${pdfUrl}" download class="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold inline-flex items-center gap-1 transition-all" title="Unduh Berkas PDF Resmi">
                        <i class="ph-bold ph-download-simple"></i>
                        <span class="hidden lg:inline">Unduh</span>
                    </a>
                </div>
            </div>
            <div class="pdf-canvas-viewport">
                <div class="pdf-canvas-loading">
                    <div class="w-8 h-8 border-3 border-royal-500 border-t-transparent rounded-full animate-spin"></div>
                    <span class="text-xs text-slate-400 font-mono">Memuat halaman PDF...</span>
                </div>
                <canvas class="pdf-rendered-canvas hidden"></canvas>
            </div>
        `;

        const state = {
            container,
            pdfUrl,
            pdfTitle,
            pdfDoc: null,
            currentPage: 1,
            totalPages: 1,
            scale: 1.0,
            renderTask: null,
            isLoading: false,
            isLoaded: false
        };

        inlinePdfInstances.set(container, state);

        const prevBtn = container.querySelector('.pdf-prev-btn');
        const nextBtn = container.querySelector('.pdf-next-btn');
        const zoomInBtn = container.querySelector('.pdf-zoomin-btn');
        const zoomOutBtn = container.querySelector('.pdf-zoomout-btn');
        const fsBtn = container.querySelector('.pdf-fullscreen-btn');

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                if (state.pdfDoc && state.currentPage > 1) {
                    state.currentPage--;
                    renderInlinePage(state);
                }
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                if (state.pdfDoc && state.currentPage < state.totalPages) {
                    state.currentPage++;
                    renderInlinePage(state);
                }
            });
        }

        if (zoomInBtn) {
            zoomInBtn.addEventListener('click', () => {
                if (!state.pdfDoc) return;
                state.scale = Math.min(state.scale + 0.25, 2.5);
                renderInlinePage(state);
            });
        }

        if (zoomOutBtn) {
            zoomOutBtn.addEventListener('click', () => {
                if (!state.pdfDoc) return;
                state.scale = Math.max(state.scale - 0.25, 0.6);
                renderInlinePage(state);
            });
        }

        if (fsBtn) {
            fsBtn.addEventListener('click', () => {
                openPdfModal(state.pdfUrl, state.pdfTitle);
            });
        }

        // Check if visible
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !state.isLoaded) {
                        loadInlinePdf(state);
                    }
                });
            }, { rootMargin: '200px' });
            observer.observe(container);
        } else {
            setTimeout(() => loadInlinePdf(state), 500);
        }
    });
}

function loadInlinePdf(state) {
    if (state.isLoading || state.isLoaded) return;
    if (state.container.offsetParent === null) {
        return; // Currently hidden tab
    }

    state.isLoading = true;
    pdfjsLib.getDocument(state.pdfUrl).promise.then(doc => {
        state.pdfDoc = doc;
        state.totalPages = doc.numPages;
        state.isLoaded = true;
        state.isLoading = false;
        renderInlinePage(state);
    }).catch(err => {
        state.isLoading = false;
        console.error('Error loading inline PDF:', err);
        const loading = state.container.querySelector('.pdf-canvas-loading');
        if (loading) {
            loading.innerHTML = `
                <div class="text-center p-4 text-slate-300">
                    <p class="text-xs text-amber-400 font-bold mb-2">Gagal memuat pratinjau PDF.</p>
                    <a href="${state.pdfUrl}" download class="btn-primary py-1.5 px-3 text-xs inline-flex items-center gap-1">
                        <i class="ph-bold ph-download-simple"></i> Unduh File
                    </a>
                </div>
            `;
        }
    });
}

function renderInlinePage(state) {
    if (!state.pdfDoc) return;
    const canvas = state.container.querySelector('.pdf-rendered-canvas');
    const loading = state.container.querySelector('.pdf-canvas-loading');
    const pageDisplay = state.container.querySelector('.pdf-page-display');
    const zoomVal = state.container.querySelector('.pdf-zoom-val');
    const prevBtn = state.container.querySelector('.pdf-prev-btn');
    const nextBtn = state.container.querySelector('.pdf-next-btn');
    const viewportBox = state.container.querySelector('.pdf-canvas-viewport');

    if (!canvas || !viewportBox) return;

    if (pageDisplay) pageDisplay.textContent = `Hal ${state.currentPage} / ${state.totalPages}`;
    if (zoomVal) zoomVal.textContent = `${Math.round(state.scale * 100)}%`;
    if (prevBtn) prevBtn.disabled = state.currentPage <= 1;
    if (nextBtn) nextBtn.disabled = state.currentPage >= state.totalPages;

    if (state.renderTask) {
        try { state.renderTask.cancel(); } catch (e) {}
        state.renderTask = null;
    }

    state.pdfDoc.getPage(state.currentPage).then(page => {
        const containerWidth = Math.max(260, (viewportBox.clientWidth || 800) - 24);
        const unscaledViewport = page.getViewport({ scale: 1.0 });
        const baseScale = containerWidth / unscaledViewport.width;
        const finalScale = baseScale * state.scale;
        const viewport = page.getViewport({ scale: finalScale });

        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = Math.floor(viewport.width * dpr);
        canvas.height = Math.floor(viewport.height * dpr);
        canvas.style.width = Math.floor(viewport.width) + 'px';
        canvas.style.height = Math.floor(viewport.height) + 'px';

        const ctx = canvas.getContext('2d', { alpha: false });
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        const transform = dpr !== 1 ? [dpr, 0, 0, dpr, 0, 0] : null;
        const renderContext = {
            canvasContext: ctx,
            transform: transform,
            viewport: viewport
        };

        state.renderTask = page.render(renderContext);
        state.renderTask.promise.then(() => {
            state.renderTask = null;
            if (loading) loading.classList.add('hidden');
            canvas.classList.remove('hidden');
        }).catch(err => {
            if (err && err.name === 'RenderingCancelledException') return;
            console.error('Inline render page error:', err);
        });
    });
}

function refreshVisibleInlinePdfs() {
    inlinePdfInstances.forEach((state) => {
        if (state.container.offsetParent !== null) {
            if (!state.isLoaded) {
                loadInlinePdf(state);
            } else {
                renderInlinePage(state);
            }
        }
    });
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
        setTimeout(refreshVisibleInlinePdfs, 100);
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
    
    // Cek jika hash mengarah ke tab LK 4 di analisis
    if (hash.startsWith('lk-pane-') || hash.startsWith('section-evaluasi-s')) {
        let lkId = hash;
        if (lkId === 'section-evaluasi-s1') lkId = 'lk-pane-s1';
        if (lkId === 'section-evaluasi-s2') lkId = 'lk-pane-s2';
        if (lkId === 'section-evaluasi-s3') lkId = 'lk-pane-s3';
        if (lkId === 'section-evaluasi-s4') lkId = 'lk-pane-s4';
        
        if (document.querySelector(`.lk-tab-btn[data-tab="${lkId}"]`)) {
            switchAnalisisLkTab(lkId);
            const targetEl = document.getElementById(lkId) || document.getElementById('section-dokumen-lk4');
            if (targetEl) targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
            return;
        }
    }

    const targetPane = document.getElementById(hash);
    if (targetPane && targetPane.classList.contains('cycle-tab-pane')) {
        switchCycleTab(hash);
        targetPane.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}
window.addEventListener('DOMContentLoaded', activateTabFromHash);
window.addEventListener('hashchange', activateTabFromHash);



// ========================================================
// GLOBAL VIDEO PREVIEW MODAL (POP-UP GOOGLE DRIVE & YOUTUBE PREVIEW)
// ========================================================
function openDriveVideoModal(videoSource, videoTitle, weekBadge) {
    let previewUrl = '';
    let externalUrl = '';
    let isYouTube = false;

    // Deteksi YouTube Video (URL / ID)
    const ytMatch = videoSource.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    if (ytMatch || videoSource === 'cnggKrH9JxI') {
        const ytId = ytMatch ? ytMatch[1] : videoSource;
        previewUrl = 'https://www.youtube-nocookie.com/embed/' + ytId + '?autoplay=1&rel=0';
        externalUrl = 'https://youtu.be/' + ytId;
        isYouTube = true;
    } else {
        // Google Drive Video
        let fileId = videoSource;
        const match = videoSource.match(/\/d\/([a-zA-Z0-9_-]+)/);
        if (match) fileId = match[1];
        previewUrl = 'https://drive.google.com/file/d/' + fileId + '/preview';
        externalUrl = 'https://drive.google.com/file/d/' + fileId + '/view?usp=sharing';
    }

    let modal = document.getElementById('globalVideoModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'globalVideoModal';
        modal.className = 'video-modal';
        modal.innerHTML = `
            <div class="video-modal-dialog" role="dialog" aria-modal="true" aria-labelledby="videoModalTitle">
                <div class="video-modal-header">
                    <div class="flex items-center gap-2 max-w-[70%]">
                        <span id="videoModalBadge" class="badge-blue text-[11px] font-mono shrink-0">Video</span>
                        <h3 id="videoModalTitle" class="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white truncate">
                            Pratinjau Video
                        </h3>
                    </div>
                    <div class="flex items-center gap-2 shrink-0">
                        <a id="videoModalDriveLink" href="#" target="_blank" rel="noopener noreferrer" class="btn-secondary text-xs py-1.5 px-3 inline-flex items-center gap-1.5">
                            <i id="videoModalLinkIcon" class="ph-bold ph-google-drive-logo text-emerald-500"></i>
                            <span id="videoModalLinkText" class="hidden sm:inline">Buka Sumber</span>
                            <i class="ph-bold ph-arrow-square-out text-[10px]"></i>
                        </a>
                        <button type="button" onclick="closeDriveVideoModal()" class="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 font-bold transition-colors" aria-label="Tutup Video">
                            <i class="ph-bold ph-x text-base"></i>
                        </button>
                    </div>
                </div>
                <div class="video-modal-body">
                    <iframe id="videoModalIframe" class="w-full h-full border-0" src="" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen" allowfullscreen></iframe>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeDriveVideoModal();
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('is-active')) {
                closeDriveVideoModal();
            }
        });
    }

    const titleEl = document.getElementById('videoModalTitle');
    const badgeEl = document.getElementById('videoModalBadge');
    const linkEl = document.getElementById('videoModalDriveLink');
    const linkIcon = document.getElementById('videoModalLinkIcon');
    const linkText = document.getElementById('videoModalLinkText');
    const iframeEl = document.getElementById('videoModalIframe');

    if (titleEl) titleEl.textContent = videoTitle || 'Pratinjau Video';
    if (badgeEl) badgeEl.textContent = weekBadge || (isYouTube ? 'YouTube Video' : 'Google Drive');
    if (linkEl) {
        linkEl.href = externalUrl;
        if (isYouTube) {
            linkEl.title = 'Buka di YouTube (Tab Baru)';
            if (linkIcon) linkIcon.className = 'ph-bold ph-youtube-logo text-red-500';
            if (linkText) linkText.textContent = 'Buka YouTube';
        } else {
            linkEl.title = 'Buka di Google Drive (Tab Baru)';
            if (linkIcon) linkIcon.className = 'ph-bold ph-google-drive-logo text-emerald-500';
            if (linkText) linkText.textContent = 'Buka di Drive';
        }
    }
    if (iframeEl) iframeEl.src = previewUrl;

    modal.classList.add('is-active');
    document.body.classList.add('modal-open');
}

function closeDriveVideoModal() {
    const modal = document.getElementById('globalVideoModal');
    if (!modal) return;
    const iframeEl = document.getElementById('videoModalIframe');
    if (iframeEl) iframeEl.src = '';
    modal.classList.remove('is-active');
    document.body.classList.remove('modal-open');
}

// ========================================================
// NON-MENGAJAR PER-ACTIVITY INTERACTIVE PHOTO SLIDERS
// ========================================================
const activityGalleries = {
    nm01: [
        { src: 'img/dokumentasi/piket-lobby-1.jpg', caption: 'Pelayanan Tamu Kedinasan & Presensi di Meja Resepsionis Lobby' },
        { src: 'img/dokumentasi/piket-lobby-2.jpg', caption: 'Penerapan Budaya 5S (Senyum, Sapa, Salam, Sopan, Santun) Tamu Sekolah' },
        { src: 'img/dokumentasi/piket-lobby-3.jpg', caption: 'Pengelolaan Administrasi Perizinan & Rekapitulasi Presensi Siswa' }
    ],
    nm02: [
        { src: 'img/dokumentasi/panitia-17an-1.jpg', caption: 'Upacara Peringatan HUT RI Ke-79 Bersama Tim Paskibra SMAN 4' },
        { src: 'img/dokumentasi/panitia-17an-2.jpg', caption: 'Koordinasi Dewan Guru & Panitia Perlombaan Kemerdekaan' },
        { src: 'img/dokumentasi/panitia-17an-3.jpg', caption: 'Pemanduan & Wasit Lomba Ketangkasan Antarkelas yang Sportif' },
        { src: 'img/dokumentasi/panitia-17an-4.jpg', caption: 'Penyerahan Apresiasi & Hadiah Juara Lomba Kemerdekaan' },
        { src: 'img/dokumentasi/panitia-17an-5.jpg', caption: 'Dokumentasi Bersama Seluruh Panitia Pendidik & Pengurus OSIS' }
    ],
    nm03: [
        { src: 'img/dokumentasi/lomba-inovasi-1.jpg', caption: 'Penyusunan Proposal Naskah Inovasi: Patbhe Digital Center' },
        { src: 'img/dokumentasi/lomba-inovasi-2.jpg', caption: 'Produksi & Video Editing Karya Inovasi Tingkat Provinsi DIY' }
    ],
    nm04: [
        { src: 'img/dokumentasi/menata-lab-1.jpg', caption: 'Penataan Ergonomis 36 Unit PC Workstation Lab Komputer' },
        { src: 'img/dokumentasi/menata-lab-2.jpg', caption: 'Pengujian Stabilitas Jaringan LAN & Server Asesmen TKA' }
    ],
    nm05: [
        { src: 'img/dokumentasi/pengawas-asts-1.jpg', caption: 'Pengawasan Ruang Asesmen Sumatif Tengah Semester (ASTS)' },
        { src: 'img/dokumentasi/pengawas-asts-2.jpg', caption: 'Pemeriksaan Kehadiran, Kartu Peserta & Kesiapan Perangkat Ujian' },
        { src: 'img/dokumentasi/pengawas-asts-3.jpg', caption: 'Monitoring Integritas & Kepatuhan Tata Tertib Ujian Berbasis Komputer' },
        { src: 'img/dokumentasi/pengawas-asts-4.jpg', caption: 'Penandatanganan Berita Acara Pelaksanaan Asesmen Bersama Proktor' }
    ],
    nm06: [
        { src: 'img/dokumentasi/proyek-kepemimpinan-1.jpg', caption: 'Fasilitasi Sesi Curah Pendapat & Ideasi Proyek Kepemimpinan' },
        { src: 'img/dokumentasi/proyek-kepemimpinan-2.jpg', caption: 'Bimbingan Teknis Penyusunan Rencana Kerja & Anggaran Aksi' },
        { src: 'img/dokumentasi/proyek-kepemimpinan-3.jpg', caption: 'Simulasi Lapangan & Koordinasi Tim Pelaksana Siswa' },
        { src: 'img/dokumentasi/proyek-kepemimpinan-4.jpg', caption: 'Monitoring Dinamika Kelompok & Pelatihan Problem Solving' },
        { src: 'img/dokumentasi/proyek-kepemimpinan-5.jpg', caption: 'Pendampingan Presentasi Progres di Hadapan Audiens Sekolah' },
        { src: 'img/dokumentasi/proyek-kepemimpinan-6.jpg', caption: 'Refleksi Bersama, Pengukuran Dampak & Evaluasi Pasca Proyek' }
    ]
};

const activityCurrentIdx = { nm01: 0, nm02: 0, nm03: 0, nm04: 0, nm05: 0, nm06: 0 };

function setActivitySlide(actId, idx) {
    const list = activityGalleries[actId];
    if (!list) return;
    if (idx < 0) idx = list.length - 1;
    if (idx >= list.length) idx = 0;
    activityCurrentIdx[actId] = idx;

    const imgEl = document.getElementById(`slide-img-${actId}`);
    const capEl = document.getElementById(`slide-cap-${actId}`);
    const countEl = document.getElementById(`slide-count-${actId}`);

    if (imgEl) {
        imgEl.style.opacity = '0.3';
        setTimeout(() => {
            imgEl.src = list[idx].src;
            imgEl.alt = list[idx].caption;
            imgEl.style.opacity = '1';
        }, 120);
    }
    if (capEl) capEl.textContent = list[idx].caption;
    if (countEl) {
        const cur = String(idx + 1).padStart(2, '0');
        const tot = String(list.length).padStart(2, '0');
        countEl.textContent = `${cur} / ${tot}`;
    }

    // Update active thumbnail styling
    const thumbs = document.querySelectorAll(`.thumb-${actId}`);
    thumbs.forEach((th, i) => {
        if (i === idx) {
            th.classList.add('border-royal-500', 'dark:border-neon', 'ring-2', 'ring-royal-500/40', 'opacity-100');
            th.classList.remove('border-transparent', 'opacity-60');
        } else {
            th.classList.remove('border-royal-500', 'dark:border-neon', 'ring-2', 'ring-royal-500/40', 'opacity-100');
            th.classList.add('border-transparent', 'opacity-60');
        }
    });
}

function nextActivitySlide(actId) {
    setActivitySlide(actId, (activityCurrentIdx[actId] || 0) + 1);
}

function prevActivitySlide(actId) {
    setActivitySlide(actId, (activityCurrentIdx[actId] || 0) - 1);
}

// ========================================================
// SMOOTH SCROLL TO TOP HELPER
// ========================================================
function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ========================================================
// 8. INTERACTIVE 3D PARALLAX TILT UNTUK BANNER ICON 3D
// ========================================================
function initBanner3DInteraction() {
    const banners = document.querySelectorAll('.cycle-hero-banner');
    banners.forEach(banner => {
        const icon = banner.querySelector('.banner-3d-icon');
        if (!icon) return;

        let rafId = null;

        banner.addEventListener('mousemove', (e) => {
            const rect = banner.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            const nx = x / (rect.width / 2);
            const ny = y / (rect.height / 2);

            const tiltX = -ny * 15;
            const tiltY = nx * 18;

            if (rafId) cancelAnimationFrame(rafId);
            rafId = requestAnimationFrame(() => {
                icon.style.animation = 'none';
                icon.style.transform = `perspective(900px) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg) translateY(-20px) scale(1.08)`;
            });
        });

        banner.addEventListener('mouseleave', () => {
            if (rafId) cancelAnimationFrame(rafId);
            icon.style.transform = '';
            icon.style.animation = 'float3DIcon 3.2s ease-in-out infinite';
        });

        // Click / Tap bounce response
        icon.addEventListener('click', () => {
            icon.style.animation = 'none';
            icon.style.transform = 'scale(0.92) rotate(-3deg)';
            setTimeout(() => {
                icon.style.transform = 'scale(1.12) rotate(4deg) translateY(-26px)';
                setTimeout(() => {
                    icon.style.animation = 'float3DIcon 3.2s ease-in-out infinite';
                }, 400);
            }, 150);
        });
    });
}

// Auto init saat DOM siap
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        initBanner3DInteraction();
        initScrollReveal();
    });
} else {
    initBanner3DInteraction();
    initScrollReveal();
}

// ========================================================
// 9. HIGH-PERFORMANCE SCROLL REVEAL ANIMATIONS
// ========================================================
function initScrollReveal() {
    // If user prefers reduced motion, skip animations
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
    }

    // Selectors that should reveal on scroll
    const revealSelectors = [
        '.cycle-hero-banner',
        'main > section',
        '.artifact-card',
        '.bento-card',
        '.siklus-browse-section',
        '.ticker-marquee-wrapper',
        '.cycle-video-card',
        '.page-nav-dock',
        '.section-header',
        '.summary-card',
        '.reveal-on-scroll'
    ];

    const elementsToReveal = document.querySelectorAll(revealSelectors.join(', '));
    if (!elementsToReveal.length) return;

    // Mark HTML as reveal-enabled
    document.documentElement.classList.add('reveal-enabled');

    if (!('IntersectionObserver' in window)) {
        // Fallback for very old browsers without IntersectionObserver
        elementsToReveal.forEach(el => el.classList.add('is-revealed'));
        return;
    }

    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -40px 0px',
        threshold: 0.05
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-revealed');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const vh = window.innerHeight || document.documentElement.clientHeight;

    elementsToReveal.forEach((el) => {
        const rect = el.getBoundingClientRect();
        // If element is already in the viewport on initial page load, reveal instantly
        if (rect.top < vh && rect.bottom > 0) {
            el.classList.add('reveal-item', 'is-revealed', 'is-revealed-instant');
        } else {
            el.classList.add('reveal-item');
            revealObserver.observe(el);
        }
    });
}

// Auto resize PDF viewers on screen orientation change
let resizeTimerPdf;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimerPdf);
    resizeTimerPdf = setTimeout(() => {
        refreshVisibleInlinePdfs();
        if (currentModalDoc && document.getElementById('globalPdfModal')?.classList.contains('is-active')) {
            renderModalPdfPage();
        }
    }, 250);
});
