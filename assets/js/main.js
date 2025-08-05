(function() {
	"use strict";

	function toggleScrolled() {
		const selectBody = document.querySelector('body');
		const selectHeader = document.querySelector('#header');
		if (!selectHeader.classList.contains('scroll-up-sticky') && !selectHeader.classList.contains('sticky-top') && !selectHeader.classList.contains('fixed-top')) return;
		window.scrollY > 100 ? selectBody.classList.add('scrolled') : selectBody.classList.remove('scrolled');
	}

	document.addEventListener('scroll', toggleScrolled);
	window.addEventListener('load', toggleScrolled);

	function initSwiper() {
		document.querySelectorAll(".init-swiper").forEach(function(swiperElement) {
			let config = JSON.parse(
				swiperElement.querySelector(".swiper-config").innerHTML.trim()
			);

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
		openToggle.setAttribute('aria-expanded', 'true');
	}

	function closeMobileNav() {
		document.body.classList.remove('mobile-nav-active');
		openToggle.setAttribute('aria-expanded', 'false');
		openToggle.focus();
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
			this.parentNode.classList.toggle('active');
			this.parentNode.nextElementSibling.classList.toggle('dropdown-active');
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
			window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
		}
	}

	if(scrollTop) {
		scrollTop.addEventListener('click', (e) => {
			e.preventDefault();
			window.scrollTo({
				top: 0,
				behavior: 'smooth'
			});
		});
	}

	window.addEventListener('load', toggleScrollTop);
	document.addEventListener('scroll', toggleScrollTop);

	function aosInit() {
		AOS.init({
			duration: 600,
			easing: 'ease-in-out',
			once: true,
			mirror: false
		});
	}
	window.addEventListener('load', aosInit);

	document.querySelectorAll('.isotope-layout').forEach(function(isotopeItem) {
		let layout = isotopeItem.getAttribute('data-layout') ?? 'masonry';
		let filter = isotopeItem.getAttribute('data-default-filter') ?? '*';
		let sort = isotopeItem.getAttribute('data-sort') ?? 'original-order';

		let initIsotope;
		imagesLoaded(isotopeItem.querySelector('.isotope-container'), function() {
			initIsotope = new Isotope(isotopeItem.querySelector('.isotope-container'), {
				itemSelector: '.isotope-item',
				layoutMode: layout,
				filter: filter,
				sortBy: sort
			});
		});

		isotopeItem.querySelectorAll('.isotope-filters li').forEach(function(filters) {
			filters.addEventListener('click', function() {
				isotopeItem.querySelector('.isotope-filters .filter-active').classList.remove('filter-active');
				this.classList.add('filter-active');
				initIsotope.arrange({
					filter: this.getAttribute('data-filter')
				});
				if (typeof aosInit === 'function') {
					aosInit();
				}
			}, false);
		});

	});

	window.addEventListener("scroll", function () {
		const header = document.getElementById("header");
		if (window.scrollY > 50) {
			header.classList.add("hide-main");
		} else {
			header.classList.remove("hide-main");
		}
	});

	document.addEventListener('DOMContentLoaded', function(){
		const navUl = document.querySelector('.mobile-nav-active .navmenu > ul');
		if(navUl){
			navUl.style.position = 'relative';
		}
	});

})();

document.addEventListener('DOMContentLoaded', async () => {
	const allEquip = await (await fetch('assets/data/equipamentos.json')).json();
	const ctn = document.getElementById('equipamentos-container');
	const pg = document.getElementById('pagination');
	const btnFiltro = document.getElementById('filtro-btn');
	const btnClose = document.getElementById('close-filtro');
	const btnSearch = document.getElementById('pesquisar-btn');
	const mobFilt = document.getElementById('mobile-filters');
	const catD = [...document.querySelectorAll('.desktop-cat')];
	const avD = [...document.querySelectorAll('.desktop-avail')];
	const reD = [...document.querySelectorAll('.desktop-rent')];
	const pd = document.getElementById('aluguer-periodos');
	const catM = [...document.querySelectorAll('.mobile-cat')];
	const avM = [...document.querySelectorAll('.mobile-avail')];
	const reM = [...document.querySelectorAll('.mobile-rent')];
	const pm = document.getElementById('aluguer-periodos-mob');

	let page = 1, perPage = 6, filtered = [...allEquip];

	function normalize(str) {
		return (str || "")
			.normalize('NFD')
			.replace(/[\u0300-\u036f]/g, '')
			.toLowerCase()
			.trim();
	}

	function toggle(div, arrA, arrR) {
		arrA.forEach(i => {
			i.addEventListener('change', () => {
				div.hidden = i.value === 'Aluguer' ? false : true;
				if (i.value !== 'Aluguer') arrR.forEach(r => r.checked = false);
			});
		});
	}

	toggle(pd, avD, reD);
	toggle(pm, avM, reM);

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

	function vals(selC, selA, selR) {
		const cats = selC.filter(i => i.checked).map(i => i.value);
		const av = document.querySelector(selA)?.value;
		const rents = selR.filter(i => i.checked).map(i => i.value.toLowerCase());
		return { cats, av, rents };
	}

	catD.concat(avD, reD).forEach(i => i.addEventListener('change', () => apply({ ...vals(catD, '.desktop-avail:checked', reD) })));
	catM.concat(avM, reM).forEach(i => i.addEventListener('change', () => apply({ ...vals(catM, '.mobile-avail:checked', reM) })));

	btnFiltro.addEventListener('click', () => {
		mobFilt.classList.add('open');
		document.body.style.overflow = 'hidden';
		const filtrosContent = mobFilt.querySelector('.mobile-filters-content');
		if (filtrosContent) filtrosContent.scrollTop = 0;
		window.scrollTo({ top: 0, behavior: 'auto' });
	});

	btnClose.addEventListener('click', () => {
		mobFilt.classList.remove('open');
		document.body.style.overflow = '';
	});

	btnSearch.addEventListener('click', () => {
		apply({ ...vals(catM, '.mobile-avail:checked', reM) });
		mobFilt.classList.remove('open');
		document.body.style.overflow = '';
	});

	function renderPage() {
		ctn.innerHTML = '';
		const start = (page - 1) * perPage;
		filtered.slice(start, start + perPage).forEach((e, i) => {
			const col = document.createElement('div');
			col.className = 'col-12 col-md-6 col-lg-4';
			col.innerHTML = `
				<div class="card equipamento-card" data-aos="zoom-in" data-aos-delay="${i * 100}">
					<div class="card-category-top">${e.category}</div>
					<img src="${e.image}" class="card-img-top" alt="${e.name}">
					<div class="card-body d-flex flex-column">
						<h5 class="card-title">${e.name}</h5>
						<p class="card-designacao mb-2">${e.designação || ''}</p>
						<p class="card-detalhe mb-2">${e.detalhe || ''}</p>
						<p class="card-id text-muted small mb-2">${e.id}</p>
						<a href="detalhes.html?id=${e.id}" class="btn btn-primary mt-auto">Mais detalhes</a>
					</div>
				</div>`;
			ctn.appendChild(col);
		});
	}

	function updateTags() {
		const tagsContainer = document.getElementById('selected-tags-container');
		tagsContainer.innerHTML = '';
		const selectedCats = document.querySelectorAll('.mobile-cat:checked');
		const selectedAvail = document.querySelector('.mobile-avail:checked');

		if (selectedCats.length > 0 || selectedAvail) {
			tagsContainer.classList.remove('d-none');
		} else {
			tagsContainer.classList.add('d-none');
		}

		selectedCats.forEach(cat => {
			const tag = document.createElement('span');
			tag.className = 'selected-tag';
			tag.innerText = cat.value;
			const closeBtn = document.createElement('button');
			closeBtn.className = 'close-btn';
			closeBtn.innerHTML = 'X';
			closeBtn.onclick = () => {
				cat.checked = false;
				apply({ cats: [...document.querySelectorAll('.mobile-cat:checked')].map(c => c.value), av: selectedAvail ? selectedAvail.value : null, rents: [] });
			};
			tag.appendChild(closeBtn);
			tagsContainer.appendChild(tag);
		});

		if (selectedAvail) {
			const tag = document.createElement('span');
			tag.className = 'selected-tag';
			tag.innerText = selectedAvail.value;
			const closeBtn = document.createElement('button');
			closeBtn.className = 'close-btn';
			closeBtn.innerHTML = 'X';
			closeBtn.onclick = () => {
				selectedAvail.checked = false;
				apply({ cats: [...document.querySelectorAll('.mobile-cat:checked')].map(c => c.value), av: null, rents: [] });
			};
			tag.appendChild(closeBtn);
			tagsContainer.appendChild(tag);
		}
	}

	function renderPagination() {
		pg.innerHTML = '';
		const cnt = Math.ceil(filtered.length / perPage);
		const mk = (disabled, label, fn, extraClass = '') => {
			const li = document.createElement('li');
			li.className = `page-item ${extraClass}` + (disabled ? ' disabled' : '');
			li.innerHTML = `<a class="page-link" href="#">${label}</a>`;
			if (!disabled) li.onclick = e => { e.preventDefault(); fn(); };
			return li;
		};
		pg.appendChild(mk(page === 1, '«', () => {
			page--;
			renderPage();
			renderPagination();
			const firstCard = document.querySelector('#equipamentos-container');
			if (firstCard) {
				firstCard.scrollIntoView({ behavior: "smooth", block: "start" });
			}
		}, 'prev'));
		for (let i = 1; i <= cnt; i++) {
			pg.appendChild(mk(false, i, () => {
				page = i;
				renderPage();
				renderPagination();
				const firstCard = document.querySelector('#equipamentos-container');
				if (firstCard) {
					firstCard.scrollIntoView({ behavior: "smooth", block: "start" });
				}
			}, i === page ? 'active' : ''));
		}
		pg.appendChild(mk(page === cnt, '»', () => {
			page++;
			renderPage();
			renderPagination();
			const firstCard = document.querySelector('#equipamentos-container');
			if (firstCard) {
				firstCard.scrollIntoView({ behavior: "smooth", block: "start" });
			}
		}, 'next'));
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

	window.addEventListener('beforeprint', () => {
		panelF.classList.add('active');
		panelF.hidden = false;
		panelT.classList.add('active');
		panelT.hidden = false;
		btnFunc.setAttribute('aria-selected', 'true');
		btnTech.setAttribute('aria-selected', 'true');
	});

	window.addEventListener('afterprint', () => {
		panelF.classList.add('active');
		panelF.hidden = false;
		panelT.classList.remove('active');
		panelT.hidden = true;
		btnFunc.setAttribute('aria-selected', 'true');
		btnTech.setAttribute('aria-selected', 'false');
	});

	btnPdf.addEventListener('click', () => window.print());

	try {
		const res = await fetch('assets/data/equipamentos.json');
		const data = await res.json();
		const eq = data.find((item) => item.id === eqId);
		if (!eq) {
			document.getElementById('pd-title-text').textContent = 'Equipamento não encontrado';
			return;
		}

		mainImg.src = eq.image;
		mainImg.alt = eq.name || 'Imagem Principal';
		document.getElementById('pd-category-text').textContent = eq.category;
		document.getElementById('pd-title-text').textContent = eq.name;

		const funcList = document.getElementById('pd-functions-list');
		funcList.innerHTML = '';
		eq.functions.forEach((f) => {
			const div = document.createElement('div');
			div.classList.add('pd-function-item');
			div.innerHTML = `<h6>${f.nome}</h6><p class="pd-funcao-descricao">${f.descricao}</p>`;
			funcList.appendChild(div);
		});

		document.getElementById('pd-application-text').textContent = eq.application;

		btnFunc.addEventListener('click', () => {
			btnFunc.classList.add('active');
			btnTech.classList.remove('active');
			btnFunc.setAttribute('aria-selected', 'true');
			btnTech.setAttribute('aria-selected', 'false');
			panelF.classList.add('active');
			panelF.hidden = false;
			panelT.classList.remove('active');
			panelT.hidden = true;
		});
		btnTech.addEventListener('click', () => {
			btnTech.classList.add('active');
			btnFunc.classList.remove('active');
			btnTech.setAttribute('aria-selected', 'true');
			btnFunc.setAttribute('aria-selected', 'false');
			panelT.classList.add('active');
			panelT.hidden = false;
			panelF.classList.remove('active');
			panelF.hidden = true;
		});

		panelF.hidden = false;
		panelT.hidden = true;

		const techTable = document.getElementById('pd-tech-table');
		const logTable = document.getElementById('pd-logistics-table');
		techTable.innerHTML = '';
		logTable.innerHTML = '';

		Object.entries(eq.technical_data).forEach(([k, v]) => {
			if (typeof v === 'object' && v !== null) {
				Object.entries(v).forEach(([sk, sv]) => {
					techTable.insertAdjacentHTML(
						'beforeend',
						`<tr><th>${sk.replace(/_/g, ' ')}</th><td>${sv}</td></tr>`
					);
				});
			} else {
				techTable.insertAdjacentHTML(
					'beforeend',
					`<tr><th>${k.replace(/_/g, ' ')}</th><td>${v}</td></tr>`
				);
			}
		});

		Object.entries(eq.logistics).forEach(([k, v]) => {
			logTable.insertAdjacentHTML(
				'beforeend',
				`<tr><th>${k.replace(/_/g, ' ')}</th><td>${v}</td></tr>`
			);
		});

		availUL.innerHTML = '';
		if (eq.sale) {
			availUL.insertAdjacentHTML(
				'beforeend',
				`<li><i class="bi bi-check-circle-fill me-2"></i>Para venda</li>`
			);
		}
		Object.entries(eq.rental)
			.filter(([, ok]) => ok)
			.forEach(([periodo]) => {
				const labels = { diario: 'Diário', bidiario: 'Bidiário', semanal: 'Semanal', mensal: 'Mensal' };
				const text = labels[periodo] || periodo;
				availUL.insertAdjacentHTML(
					'beforeend',
					`<li><i class="bi bi-check-circle-fill me-2"></i>Para aluguer ${text}</li>`
				);
			});

		document.getElementById('btn-quote').addEventListener('click', () => {
			location.href = 'contacto.html';
		});

		const track = document.querySelector('.thumbs-track');
		eq.images.forEach((src, idx) => {
			const li = document.createElement('li');
			li.className = 'thumb-slide' + (idx === 0 ? ' active' : '');
			li.innerHTML = `<img src="${src}" alt="Miniatura ${idx + 1}" loading="lazy">`;
			li.addEventListener('click', () => {
				mainImg.style.opacity = 0;
				mainImg.addEventListener('transitionend', function h(e) {
					if (e.propertyName !== 'opacity') return;
					mainImg.removeEventListener('transitionend', h);
					mainImg.src = src;
					mainImg.style.opacity = 1;
				});
				document.querySelectorAll('.thumb-slide').forEach((s) => s.classList.remove('active'));
				li.classList.add('active');
			});
			track.appendChild(li);
		});

		let currentIndex = 0;
		const prevBtn = document.querySelector('.thumb-btn.prev');
		const nextBtn = document.querySelector('.thumb-btn.next');

		function updateCarousel() {
			const viewportWidth = window.innerWidth;
			const visible = viewportWidth < 768 ? 1 : viewportWidth < 992 ? 2 : 3;
			const slide = document.querySelector('.thumb-slide');
			if (!slide) return;

			const style = getComputedStyle(slide);
			const w = slide.offsetWidth + parseFloat(style.marginRight);
			track.style.transform = `translateX(-${currentIndex * w}px)`;

			prevBtn.disabled = currentIndex <= 0;
			nextBtn.disabled = currentIndex >= eq.images.length - visible;
		}

		prevBtn.addEventListener('click', () => {
			if (currentIndex > 0) currentIndex--;
			updateCarousel();
		});
		nextBtn.addEventListener('click', () => {
			const vis = window.innerWidth < 768 ? 1 : window.innerWidth < 992 ? 2 : 3;
			if (currentIndex < eq.images.length - vis) currentIndex++;
			updateCarousel();
		});

		window.addEventListener('resize', updateCarousel);
		updateCarousel();
	} catch (err) {
		console.error('Erro ao carregar dados:', err);
	}
});

(function() {
  const banner = document.getElementById('cookie-consent-banner');
  const acceptBtn = document.getElementById('cookie-accept-btn');
  const rejectBtn = document.getElementById('cookie-reject-btn');
  const consentKey = 'all4esthetic_cookie_consent_v1';

  function showCookieBanner() {
    if (!localStorage.getItem(consentKey)) {
      banner.classList.add('show');
      banner.setAttribute('aria-hidden', 'false');
      banner.focus();
    }
  }

  function hideCookieBanner() {
    banner.classList.remove('show');
    banner.setAttribute('aria-hidden', 'true');
  }

  acceptBtn.addEventListener('click', function() {
    localStorage.setItem(consentKey, 'accepted');
    hideCookieBanner();
  });

  rejectBtn.addEventListener('click', function() {
    localStorage.setItem(consentKey, 'rejected');
    hideCookieBanner();
  });

  document.addEventListener('DOMContentLoaded', showCookieBanner);

  banner.addEventListener('keydown', function(e){
    if(e.key === "Escape") hideCookieBanner();
  });
})();


