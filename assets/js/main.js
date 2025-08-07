(function() {
    "use strict";

    function toggleScrolled() {
        const selectBody = document.querySelector('body');
        const selectHeader = document.querySelector('#header');
        if (!selectHeader) return;
        if (
            !selectHeader.classList.contains('scroll-up-sticky') &&
            !selectHeader.classList.contains('sticky-top') &&
            !selectHeader.classList.contains('fixed-top')
        ) return;
        if (window.scrollY > 100) {
            selectBody.classList.add('scrolled');
        } else {
            selectBody.classList.remove('scrolled');
        }
    }

    document.addEventListener('scroll', toggleScrolled);
    window.addEventListener('load', toggleScrolled);

    function initSwiper() {
        document.querySelectorAll(".init-swiper").forEach(function(swiperElement) {
            let config;
            const configEl = swiperElement.querySelector(".swiper-config");
            if (!configEl) return;
            try {
                config = JSON.parse(configEl.textContent.trim());
            } catch (err) {
                console.error('Invalid swiper config', err);
                return;
            }
            if (swiperElement.classList.contains("swiper-tab")) {
                initSwiperWithCustomPagination(swiperElement, config);
            } else {
                new Swiper(swiperElement, config);
            }
        });
    }

    window.addEventListener("load", initSwiper);

    const openToggle = document.querySelector('.mobile-nav-open');
    const closeToggle = document.querySelector('.navmenu-close');

    function openMobileNav() {
        document.body.classList.add('mobile-nav-active');
        if (openToggle) {
            openToggle.setAttribute('aria-expanded', 'true');
        }
    }

    function closeMobileNav() {
        document.body.classList.remove('mobile-nav-active');
        if (openToggle) {
            openToggle.setAttribute('aria-expanded', 'false');
            openToggle.focus();
        }
    }

    if (openToggle) {
        openToggle.addEventListener('click', openMobileNav);
        openToggle.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openMobileNav();
            }
        });
    }

    if (closeToggle) {
        closeToggle.addEventListener('click', closeMobileNav);
        closeToggle.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                closeMobileNav();
            }
        });
    }

    document.querySelectorAll('#navmenu a').forEach(navmenu => {
        navmenu.addEventListener('click', () => {
            if (document.body.classList.contains('mobile-nav-active')) {
                closeMobileNav();
            }
        });
    });

    document.querySelectorAll('.navmenu .toggle-dropdown').forEach(navmenu => {
        navmenu.addEventListener('click', function(e) {
            e.preventDefault();
            const parent = this.parentNode;
            const sibling = parent.nextElementSibling;
            if (parent) parent.classList.toggle('active');
            if (sibling) sibling.classList.toggle('dropdown-active');
            e.stopImmediatePropagation();
        });
    });

    const preloader = document.querySelector('#preloader');
    if (preloader) {
        window.addEventListener('load', () => {
            preloader.remove();
        });
    }

    let scrollTop = document.querySelector('.scroll-top');

    function toggleScrollTop() {
        if (scrollTop) {
            if (window.scrollY > 100) {
                scrollTop.classList.add('active');
            } else {
                scrollTop.classList.remove('active');
            }
        }
    }

    if (scrollTop) {
        scrollTop.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    window.addEventListener('load', toggleScrollTop);
    document.addEventListener('scroll', toggleScrollTop);

    function aosInit() {
        AOS.init({ duration: 600, easing: 'ease-in-out', once: true, mirror: false });
    }

    window.addEventListener('load', aosInit);

    document.querySelectorAll('.isotope-layout').forEach(function(isotopeItem) {
        const container = isotopeItem.querySelector('.isotope-container');
        if (!container) return;
        const layout = isotopeItem.getAttribute('data-layout') || 'masonry';
        const filter = isotopeItem.getAttribute('data-default-filter') || '*';
        const sort = isotopeItem.getAttribute('data-sort') || 'original-order';
        let initIsotope;
        imagesLoaded(container, function() {
            initIsotope = new Isotope(container, { itemSelector: '.isotope-item', layoutMode: layout, filter: filter, sortBy: sort });
        });
        isotopeItem.querySelectorAll('.isotope-filters li').forEach(function(filters) {
            filters.addEventListener('click', function() {
                const active = isotopeItem.querySelector('.isotope-filters .filter-active');
                if (active) active.classList.remove('filter-active');
                this.classList.add('filter-active');
                if (initIsotope) initIsotope.arrange({ filter: this.getAttribute('data-filter') });
                AOS.refresh();
            });
        });
    });

    window.addEventListener('scroll', function() {
        const header = document.getElementById('header');
        if (!header) return;
        if (window.scrollY > 50) {
            header.classList.add('hide-main');
        } else {
            header.classList.remove('hide-main');
        }
    });

    document.addEventListener('DOMContentLoaded', function() {
        const navUl = document.querySelector('.mobile-nav-active .navmenu > ul');
        if (navUl) navUl.style.position = 'relative';
    });
})();
document.addEventListener('DOMContentLoaded', async () => {
    let allEquip;
    try {
        const res = await fetch('assets/data/equipamentos.json');
        allEquip = await res.json();
    } catch (err) {
        console.error('Erro ao carregar JSON de equipamentos', err);
        return;
    }
    const ctn = document.getElementById('equipamentos-container');
    const pg = document.getElementById('pagination');
    const btnFiltro = document.getElementById('filtro-btn');
    const btnClose = document.getElementById('close-filtro');
    const btnSearch = document.getElementById('pesquisar-btn');
    const mobFilt = document.getElementById('mobile-filters');
    const catD = Array.from(document.querySelectorAll('.desktop-cat'));
    const avD = Array.from(document.querySelectorAll('.desktop-avail'));
    const reD = Array.from(document.querySelectorAll('.desktop-rent'));
    const pd = document.getElementById('aluguer-periodos');
    const catM = Array.from(document.querySelectorAll('.mobile-cat'));
    const avM = Array.from(document.querySelectorAll('.mobile-avail'));
    const reM = Array.from(document.querySelectorAll('.mobile-rent'));
    const pm = document.getElementById('aluguer-periodos-mob');
    let page = 1;
    const perPage = 6;
    let filtered = allEquip.slice();

    function normalize(str) {
        return (str || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
    }

    function toggle(div, arrA, arrR) {
        if (!div) return;
        arrA.forEach(i => {
            i.addEventListener('change', () => {
                div.hidden = i.value === 'Aluguer' ? false : true;
                if (i.value !== 'Aluguer') arrR.forEach(r => (r.checked = false));
            });
        });
    }

    toggle(pd, avD, reD);
    toggle(pm, avM, reM);

    function renderPage() {
        if (!ctn) return;
        ctn.innerHTML = '';
        const start = (page - 1) * perPage;
        filtered.slice(start, start + perPage).forEach((e, i) => {
            const col = document.createElement('div');
            col.className = 'col-12 col-md-6 col-lg-4';
            const card = document.createElement('div');
            card.className = 'card equipamento-card';
            card.setAttribute('data-aos', 'zoom-in');
            card.setAttribute('data-aos-delay', String(i * 100));

            const catTop = document.createElement('div');
            catTop.className = 'card-category-top';
            catTop.textContent = e.category;

            const img = document.createElement('img');
            img.src = e.image;
            img.className = 'card-img-top';
            img.alt = e.name;

            const body = document.createElement('div');
            body.className = 'card-body d-flex flex-column';

            const h5 = document.createElement('h5');
            h5.className = 'card-title';
            h5.textContent = e.name;

            const pDesig = document.createElement('p');
            pDesig.className = 'card-designacao mb-2';
            pDesig.textContent = e.designação || '';

            const pDet = document.createElement('p');
            pDet.className = 'card-detalhe mb-2';
            pDet.textContent = e.detalhe || '';

            const pId = document.createElement('p');
            pId.className = 'card-id text-muted small mb-2';
            pId.textContent = e.id;

            const link = document.createElement('a');
            link.href = `detalhes.html?id=${e.id}`;
            link.className = 'btn btn-primary mt-auto';
            link.textContent = 'Mais detalhes';

            body.append(h5, pDesig, pDet, pId, link);
            card.append(catTop, img, body);
            col.appendChild(card);
            ctn.appendChild(col);
        });
    }

    function renderPagination() {
        if (!pg) return;
        pg.innerHTML = '';
        const cnt = Math.ceil(filtered.length / perPage);
        function mk(disabled, label, fn, extraClass) {
            const li = document.createElement('li');
            li.className = `page-item ${extraClass || ''}` + (disabled ? ' disabled' : '');
            const a = document.createElement('a');
            a.className = 'page-link';
            a.href = '#';
            a.textContent = label;
            if (!disabled) {
                a.addEventListener('click', (e) => {
                    e.preventDefault();
                    fn();
                });
            }
            li.appendChild(a);
            return li;
        }
        pg.appendChild(mk(page === 1, '«', () => {
            page--;
            renderPage();
            renderPagination();
            document.querySelector('#equipamentos-container')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 'prev'));
        for (let i = 1; i <= cnt; i++) {
            pg.appendChild(mk(false, String(i), () => {
                page = i;
                renderPage();
                renderPagination();
                document.querySelector('#equipamentos-container')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, i === page ? 'active' : ''));
        }
        pg.appendChild(mk(page === cnt, '»', () => {
            page++;
            renderPage();
            renderPagination();
            document.querySelector('#equipamentos-container')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 'next'));
    }

    function vals(selC, selA, selR) {
        const cats = selC.filter(i => i.checked).map(i => i.value);
        const avEl = document.querySelector(selA);
        const av = avEl ? avEl.value : null;
        const rents = selR.filter(i => i.checked).map(i => i.value.toLowerCase());
        return { cats, av, rents };
    }

    function apply({ cats, av, rents }) {
        page = 1;
        filtered = allEquip.filter(e => {
            if (cats.length && !cats.some(cat => normalize(cat) === normalize(e.category))) return false;
            if (av === 'Venda') return e.sale;
            if (av === 'Aluguer') {
                return rents.length ? rents.some(r => e.rental[r]) : Object.values(e.rental).some(v => v);
            }
            return true;
        });
        renderPage();
        renderPagination();
        updateTags();
    }

    catD.concat(avD, reD).forEach(i => i.addEventListener('change', () => apply(vals(catD, '.desktop-avail:checked', reD))));
    catM.concat(avM, reM).forEach(i => i.addEventListener('change', () => apply(vals(catM, '.mobile-avail:checked', reM))));

    if (btnFiltro) {
        btnFiltro.addEventListener('click', () => {
            mobFilt.classList.add('open');
            document.body.style.overflow = 'hidden';
            const filtrosContent = mobFilt.querySelector('.mobile-filters-content');
            if (filtrosContent) filtrosContent.scrollTop = 0;
            window.scrollTo({ top: 0, behavior: 'auto' });
        });
    }

    if (btnClose) {
        btnClose.addEventListener('click', () => {
            mobFilt.classList.remove('open');
            document.body.style.overflow = '';
        });
    }

    if (btnSearch) {
        btnSearch.addEventListener('click', () => {
            apply(vals(catM, '.mobile-avail:checked', reM));
            mobFilt.classList.remove('open');
            document.body.style.overflow = '';
        });
    }

    function updateTags() {
        const tagsContainer = document.getElementById('selected-tags-container');
        if (!tagsContainer) return;
        tagsContainer.innerHTML = '';
        const selectedCats = Array.from(document.querySelectorAll('.mobile-cat:checked'));
        const selectedAvail = document.querySelector('.mobile-avail:checked');
        if (selectedCats.length > 0 || selectedAvail) {
            tagsContainer.classList.remove('d-none');
        } else {
            tagsContainer.classList.add('d-none');
        }
        selectedCats.forEach(cat => {
            const tag = document.createElement('span');
            tag.className = 'selected-tag';
            tag.textContent = cat.value;
            const closeBtn = document.createElement('button');
            closeBtn.className = 'close-btn';
            closeBtn.textContent = 'X';
            closeBtn.onclick = () => {
                cat.checked = false;
                apply(vals(catM, '.mobile-avail:checked', reM));
            };
            tag.appendChild(closeBtn);
            tagsContainer.appendChild(tag);
        });
        if (selectedAvail) {
            const tag = document.createElement('span');
            tag.className = 'selected-tag';
            tag.textContent = selectedAvail.value;
            const closeBtn = document.createElement('button');
            closeBtn.className = 'close-btn';
            closeBtn.textContent = 'X';
            closeBtn.onclick = () => {
                selectedAvail.checked = false;
                apply(vals(catM, '.mobile-avail:checked', reM));
            };
            tag.appendChild(closeBtn);
            tagsContainer.appendChild(tag);
        }
    }

    function renderTagsAndPagination() {
        renderPage();
        renderPagination();
        updateTags();
    }

    apply({ cats: [], av: null, rents: [] });
});
document.addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(location.search);
    const eqId = params.get('id');
    const mainImg = document.getElementById('pd-main-img');
    const availUL = document.getElementById('pd-availability-list');
    const btnPdf = document.getElementById('btn-pdf');
    const btnFunc = document.getElementById('btn-funcao');
    const btnTech = document.getElementById('btn-tecnica');
    const panelF = document.getElementById('content-funcao');
    const panelT = document.getElementById('content-tecnica');

    function showBothPanels() {
        if (panelF) { panelF.classList.add('active'); panelF.hidden = false; }
        if (panelT) { panelT.classList.add('active'); panelT.hidden = false; }
        if (btnFunc) btnFunc.setAttribute('aria-selected', 'true');
        if (btnTech) btnTech.setAttribute('aria-selected', 'true');
    }

    function showFunctionPanel() {
        if (panelF) { panelF.classList.add('active'); panelF.hidden = false; }
        if (panelT) { panelT.classList.remove('active'); panelT.hidden = true; }
        if (btnFunc) btnFunc.setAttribute('aria-selected', 'true');
        if (btnTech) btnTech.setAttribute('aria-selected', 'false');
    }

    window.addEventListener('beforeprint', showBothPanels);
    window.addEventListener('afterprint', showFunctionPanel);
    if (btnPdf) btnPdf.addEventListener('click', () => window.print());

    let data;
    try {
        const res = await fetch('assets/data/equipamentos.json');
        data = await res.json();
    } catch (err) {
        console.error('Erro ao carregar dados:', err);
        return;
    }
    const eq = data.find(item => item.id === eqId);
    if (!eq) {
        const titleText = document.getElementById('pd-title-text');
        if (titleText) titleText.textContent = 'Equipamento não encontrado';
        return;
    }
    if (mainImg) { mainImg.src = eq.image; mainImg.alt = eq.name || 'Imagem Principal'; }
    const catText = document.getElementById('pd-category-text');
    if (catText) catText.textContent = eq.category;
    const titleText = document.getElementById('pd-title-text');
    if (titleText) titleText.textContent = eq.name;

    const funcList = document.getElementById('pd-functions-list');
    if (funcList) {
        funcList.innerHTML = '';
        eq.functions.forEach(f => {
            const div = document.createElement('div');
            div.className = 'pd-function-item';
            const h6 = document.createElement('h6');
            div.append(h6, Object.assign(document.createElement('p'), { className: 'pd-funcao-descricao', textContent: f.descricao }));
            funcList.appendChild(div);
        });
    }

    const appText = document.getElementById('pd-application-text');
    if (appText) appText.textContent = eq.application;

    if (btnFunc) btnFunc.addEventListener('click', () => {
        btnFunc.classList.add('active');
        btnTech.classList.remove('active');
        panelF.classList.add('active'); panelF.hidden = false;
        panelT.classList.remove('active'); panelT.hidden = true;
        btnFunc.setAttribute('aria-selected', 'true');
        btnTech.setAttribute('aria-selected', 'false');
    });
    if (btnTech) btnTech.addEventListener('click', () => {
        btnTech.classList.add('active');
        btnFunc.classList.remove('active');
        panelT.classList.add('active'); panelT.hidden = false;
        panelF.classList.remove('active'); panelF.hidden = true;
        btnTech.setAttribute('aria-selected', 'true');
        btnFunc.setAttribute('aria-selected', 'false');
    });

    panelF.hidden = false;
    panelT.hidden = true;

    const techTable = document.getElementById('pd-tech-table');
    const logTable = document.getElementById('pd-logistics-table');
    if (techTable) techTable.innerHTML = '';
    if (logTable) logTable.innerHTML = '';

    Object.entries(eq.technical_data).forEach(([k,v]) => {
        if (techTable) {
            if (v && typeof v === 'object') {
                Object.entries(v).forEach(([sk,sv]) => {
                    techTable.insertAdjacentHTML('beforeend', `<tr><th>${sk.replace(/_/g,' ')}</th><td>${sv}</td></tr>`);
                });
            } else {
                techTable.insertAdjacentHTML('beforeend', `<tr><th>${k.replace(/_/g,' ')}</th><td>${v}</td></tr>`);
            }
        }
    });
    Object.entries(eq.logistics).forEach(([k,v]) => {
        if (logTable) logTable.insertAdjacentHTML('beforeend', `<tr><th>${k.replace(/_/g,' ')}</th><td>${v}</td></tr>`);
    });

    if (availUL) {
        availUL.innerHTML = '';
        if (eq.sale) availUL.insertAdjacentHTML('beforeend', `<li><i class='bi bi-check-circle-fill me-2'></i>Para venda</li>`);
        Object.entries(eq.rental).filter(([,ok]) => ok).forEach(([periodo]) => {
            const labels = { diario: 'Diário', bidiario: 'Bidiário', semanal: 'Semanal', mensal: 'Mensal' };
            availUL.insertAdjacentHTML('beforeend', `<li><i class='bi bi-check-circle-fill me-2'></i>Para aluguer ${labels[periodo] || periodo}</li>`);
        });
    }

    const btnQuote = document.getElementById('btn-quote');
    if (btnQuote) btnQuote.addEventListener('click', () => { window.location.href = 'contacto.html'; });

    const track = document.querySelector('.thumbs-track');
    if (track && eq.images) {
        eq.images.forEach((src,idx) => {
            const li = document.createElement('li');
            li.className = 'thumb-slide' + (idx===0?' active':'');
            const img = document.createElement('img');
            img.src = src; img.alt = `Miniatura ${idx+1}`; img.loading='lazy';
            li.appendChild(img);
            li.addEventListener('click', () => {
                if (mainImg) {
                    mainImg.style.opacity = '0';
                    mainImg.addEventListener('transitionend', function h(e){ if(e.propertyName==='opacity'){
                        mainImg.removeEventListener('transitionend',h);
                        mainImg.src = src;
                        mainImg.style.opacity = '1';
                    }});
                }
                document.querySelectorAll('.thumb-slide').forEach(s=>s.classList.remove('active'));
                li.classList.add('active');
            });
            track.appendChild(li);
        });
    }

    let currentIndex = 0;
    const prevBtn = document.querySelector('.thumb-btn.prev');
    const nextBtn = document.querySelector('.thumb-btn.next');

    function updateCarousel() {
        const viewport = window.innerWidth;
        const visible = viewport<768?1:viewport<992?2:3;
        const slide = document.querySelector('.thumb-slide');
        if (!slide||!track) return;
        const style = getComputedStyle(slide);
        const w = slide.offsetWidth + parseFloat(style.marginRight);
        track.style.transform = `translateX(-${currentIndex*w}px)`;
        if (prevBtn) prevBtn.disabled = currentIndex<=0;
        if (nextBtn) nextBtn.disabled = currentIndex>=eq.images.length-visible;
    }
    if (prevBtn) prevBtn.addEventListener('click', () => { if (currentIndex>0) currentIndex--; updateCarousel(); });
    if (nextBtn) nextBtn.addEventListener('click', () => { const vis = window.innerWidth<768?1:window.innerWidth<992?2:3; if (currentIndex<eq.images.length-vis) currentIndex++; updateCarousel(); });
    window.addEventListener('resize', updateCarousel);
    updateCarousel();
});
(function(){
    const banner = document.getElementById('cookie-consent-banner');
    const acceptBtn = document.getElementById('cookie-accept-btn');
    const rejectBtn = document.getElementById('cookie-reject-btn');
    const consentKey = 'all4esthetic_cookie_consent_v1';
    function showCookieBanner(){ if(!localStorage.getItem(consentKey)&&banner){ banner.classList.add('show'); banner.setAttribute('aria-hidden','false'); banner.focus(); }}
    function hideCookieBanner(){ if(banner){ banner.classList.remove('show'); banner.setAttribute('aria-hidden','true'); }}
    if(acceptBtn) acceptBtn.addEventListener('click',()=>{ localStorage.setItem(consentKey,'accepted'); hideCookieBanner(); });
    if(rejectBtn) rejectBtn.addEventListener('click',()=>{ localStorage.setItem(consentKey,'rejected'); hideCookieBanner(); });
    document.addEventListener('DOMContentLoaded', showCookieBanner);
    if(banner) banner.addEventListener('keydown', e=>{ if(e.key==='Escape') hideCookieBanner(); });
})();
document.addEventListener('DOMContentLoaded', function(){
    function handleHash(){ const hash=window.location.hash; if(!hash) return; const id=hash.substring(1); const modalEl=document.getElementById(id); if(!modalEl) return; bootstrap.Modal.getOrCreateInstance(modalEl).show(); }
    handleHash(); window.addEventListener('hashchange', handleHash);
    ['termsModalCustom','legalNoticeModalCustom','privacyModalCustom'].forEach(id => {
        const m = document.getElementById(id);
        if (m) {
            m.addEventListener('hide.bs.modal', () => {
                history.replaceState(null, '', location.pathname + location.search);
            });
        }
    });
});
