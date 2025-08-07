;(function(){
	"use strict";
	function toggleScrolled(){
		const body = document.body;
		const header = document.querySelector("#header");
		if (!header ||
			(!header.classList.contains("scroll-up-sticky") &&
			 header.classList.contains("sticky-top") === false &&
			 header.classList.contains("fixed-top") === false)
		) return;
		window.scrollY > 100
			? body.classList.add("scrolled")
			: body.classList.remove("scrolled");
	}
	document.addEventListener("scroll", toggleScrolled);
	window.addEventListener("load", toggleScrolled);

	function initSwiper(){
		document.querySelectorAll(".init-swiper").forEach(swiperEl=>{
			const cfgEl = swiperEl.querySelector(".swiper-config");
			if (!cfgEl) return;
			let cfg;
			try { cfg = JSON.parse(cfgEl.textContent.trim()); }
			catch { return; }
			swiperEl.classList.contains("swiper-tab")
				? initSwiperWithCustomPagination(swiperEl, cfg)
				: new Swiper(swiperEl, cfg);
		});
	}
	window.addEventListener("load", initSwiper);

	const openToggle = document.querySelector(".mobile-nav-open");
	const closeToggle = document.querySelector(".navmenu-close");
	function openMobileNav(){
		document.body.classList.add("mobile-nav-active");
		openToggle && openToggle.setAttribute("aria-expanded","true");
	}
	function closeMobileNav(){
		document.body.classList.remove("mobile-nav-active");
		openToggle && openToggle.setAttribute("aria-expanded","false");
		openToggle && openToggle.focus();
	}
	openToggle && openToggle.addEventListener("click", openMobileNav);
	openToggle && openToggle.addEventListener("keydown", e=>{
		if (e.key==="Enter"||e.key===" "){ e.preventDefault(); openMobileNav(); }
	});
	closeToggle && closeToggle.addEventListener("click", closeMobileNav);
	closeToggle && closeToggle.addEventListener("keydown", e=>{
		if (e.key==="Enter"||e.key===" "){ e.preventDefault(); closeMobileNav(); }
	});

	document.querySelectorAll("#navmenu a").forEach(a=>
		a.addEventListener("click", ()=> document.body.classList.contains("mobile-nav-active") && closeMobileNav())
	);
	document.querySelectorAll(".navmenu .toggle-dropdown").forEach(t=>
		t.addEventListener("click", e=>{
			e.preventDefault();
			const p = t.parentNode, s = p.nextElementSibling;
			p && p.classList.toggle("active");
			s && s.classList.toggle("dropdown-active");
			e.stopImmediatePropagation();
		})
	);

	const preloader = document.querySelector("#preloader");
	preloader && window.addEventListener("load", ()=> preloader.remove());

	const scrollTopBtn = document.querySelector(".scroll-top");
	function toggleScrollTop(){
		scrollTopBtn && (window.scrollY>100
			? scrollTopBtn.classList.add("active")
			: scrollTopBtn.classList.remove("active"));
	}
	scrollTopBtn && scrollTopBtn.addEventListener("click", e=>{
		e.preventDefault();
		window.scrollTo({ top:0, behavior:"smooth" });
	});
	window.addEventListener("load", toggleScrollTop);
	document.addEventListener("scroll", toggleScrollTop);

	window.addEventListener("load", ()=> AOS.init({ duration:600, easing:"ease-in-out", once:true, mirror:false }));

	document.querySelectorAll(".isotope-layout").forEach(iso=>{
		const container = iso.querySelector(".isotope-container");
		if (!container) return;
		const layout = iso.getAttribute("data-layout") || "masonry";
		const filter = iso.getAttribute("data-default-filter") || "*";
		const sort   = iso.getAttribute("data-sort")           || "original-order";
		let isoInstance;
		imagesLoaded(container, ()=>{
			isoInstance = new Isotope(container, { itemSelector:".isotope-item", layoutMode:layout, filter, sortBy:sort });
		});
		iso.querySelectorAll(".isotope-filters li").forEach(f=>
			f.addEventListener("click", function(){
				iso.querySelector(".filter-active")?.classList.remove("filter-active");
				this.classList.add("filter-active");
				isoInstance && isoInstance.arrange({ filter:this.getAttribute("data-filter") });
				AOS.refresh();
			})
		);
	});

	window.addEventListener("scroll", ()=>{
		const header = document.getElementById("header");
		if (!header) return;
		window.scrollY>50
			? header.classList.add("hide-main")
			: header.classList.remove("hide-main");
	});
})();

document.addEventListener("DOMContentLoaded", async ()=>{
	let allEquip = [];
	try { allEquip = await (await fetch("assets/data/equipamentos.json")).json(); }
	catch {}
	const ctn       = document.getElementById("equipamentos-container");
	const pg        = document.getElementById("pagination");
	const btnFiltro = document.getElementById("filtro-btn");
	const btnClose  = document.getElementById("close-filtro");
	const btnSearch = document.getElementById("pesquisar-btn");
	const mobFilt   = document.getElementById("mobile-filters");
	const catD      = [...document.querySelectorAll(".desktop-cat")];
	const avD       = [...document.querySelectorAll(".desktop-avail")];
	const reD       = [...document.querySelectorAll(".desktop-rent")];
	const pd        = document.getElementById("aluguer-periodos");
	const catM      = [...document.querySelectorAll(".mobile-cat")];
	const avM       = [...document.querySelectorAll(".mobile-avail")];
	const reM       = [...document.querySelectorAll(".mobile-rent")];
	const pm        = document.getElementById("aluguer-periodos-mob");
	let page = 1, perPage = 6, filtered = [...allEquip];

	function normalize(s){
		return (s||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().trim();
	}
	function toggle(div, arrA, arrR){
		if (!div) return;
		arrA.forEach(i=>
			i.addEventListener("change", ()=>{
				div.hidden = i.value!=="Aluguer";
				if (i.value!=="Aluguer") arrR.forEach(r=>r.checked=false);
			})
		);
	}
	toggle(pd, avD, reD);
	toggle(pm, avM, reM);

	function renderPage(){
		if (!ctn) return;
		ctn.innerHTML = "";
		const start = (page-1)*perPage;
		filtered.slice(start, start+perPage).forEach((e,i)=>{
			const col = document.createElement("div");
			col.className="col-12 col-md-6 col-lg-4";
			const card = document.createElement("div");
			card.className="card equipamento-card";
			card.dataset.aos="zoom-in";
			card.dataset.aosDelay=i*100;
			card.innerHTML=`
				<div class="card-category-top">${e.category}</div>
				<img src="${e.image}" alt="${e.name}" class="card-img-top"/>
				<div class="card-body d-flex flex-column">
					<h5 class="card-title">${e.name}</h5>
					<p class="card-designacao mb-2">${e.designação||""}</p>
					<p class="card-detalhe mb-2">${e.detalhe||""}</p>
					<p class="card-id text-muted small mb-2">${e.id}</p>
					<a href="detalhes.html?id=${e.id}" class="btn btn-primary mt-auto">Mais detalhes</a>
				</div>`;
			col.append(card);
			ctn.append(col);
		});
	}

	function renderPagination(){
		if (!pg) return;
		pg.innerHTML="";
		const cnt = Math.max(1,Math.ceil(filtered.length/perPage));
		function mk(dis,label,fn,extra=""){
			const li = document.createElement("li");
			li.className=`page-item ${extra}` + (dis?" disabled":"");
			const a = Object.assign(document.createElement("a"),{ className:"page-link", href:"#", textContent: label });
			if (!dis) a.addEventListener("click",e=>{ e.preventDefault(); fn(); });
			li.append(a);
			return li;
		}
		pg.append(
			mk(page===1,"«",()=>{
				page--; renderPage(); renderPagination(); ctn.scrollIntoView({behavior:"smooth",block:"start"});
			}),
			...Array.from({length:cnt},(_,i)=>
				mk(false,String(i+1),()=>{
					page=i+1; renderPage(); renderPagination(); ctn.scrollIntoView({behavior:"smooth",block:"start"});
				}, i+1===page?"active":"")
			),
			mk(page===cnt,"»",()=>{
				page++; renderPage(); renderPagination(); ctn.scrollIntoView({behavior:"smooth",block:"start"});
			})
		);
	}

	function vals(selC,selA,selR){
		const cats = selC.filter(i=>i.checked).map(i=>i.value);
		const avEl= document.querySelector(selA);
		const av = avEl?avEl.value:null;
		const rents = selR.filter(i=>i.checked).map(i=>i.value.toLowerCase());
		return {cats,av,rents};
	}

	function apply({cats,av,rents}){
		page=1;
		filtered=allEquip.filter(e=>{
			if (cats.length && !cats.some(c=>normalize(c)===normalize(e.category))) return false;
			if (av==="Venda") return e.sale;
			if (av==="Aluguer")
				return rents.length? rents.some(r=>e.rental[r]) : Object.values(e.rental).some(Boolean);
			return true;
		});
		renderPage(); renderPagination(); updateTags();
	}

	catD.concat(avD,reD).forEach(i=>
		i.addEventListener("change",()=>apply(vals(catD,".desktop-avail:checked",reD)))
	);
	catM.concat(avM,reM).forEach(i=>
		i.addEventListener("change",()=>apply(vals(catM,".mobile-avail:checked",reM)))
	);

	btnFiltro && btnFiltro.addEventListener("click",()=>{
		mobFilt.classList.add("open");
		document.body.style.overflow="hidden";
		mobFilt.querySelector(".mobile-filters-content")?.scrollTo(0,0);
		window.scrollTo({top:0});
	});
	btnClose && btnClose.addEventListener("click",()=>{
		mobFilt.classList.remove("open");
		document.body.style.overflow="";
	});
	btnSearch && btnSearch.addEventListener("click",()=>{
		apply(vals(catM,".mobile-avail:checked",reM));
		mobFilt.classList.remove("open");
		document.body.style.overflow="";
	});

	function updateTags(){
		const tags = document.getElementById("selected-tags-container");
		if (!tags) return;
		tags.innerHTML="";
		const addTag=(txt,cb)=>{
			const span=Object.assign(document.createElement("span"),{ className:"selected-tag", textContent:txt });
			const x=Object.assign(document.createElement("button"),{ className:"close-btn", textContent:"X" });
			x.onclick=cb;
			span.append(x);
			tags.append(span);
		};
		const selCats=[...document.querySelectorAll(".mobile-cat:checked")];
		const selAvail=document.querySelector(".mobile-avail:checked");
		selCats.forEach(c=>addTag(c.value,()=>{
			c.checked=false;
			apply(vals(catM,".mobile-avail:checked",reM));
		}));
		selAvail && addTag(selAvail.value,()=>{
			selAvail.checked=false;
			apply(vals(catM,".mobile-avail:checked",reM));
		});
		tags.classList.toggle("d-none", !selCats.length && !selAvail);
	}

	apply({cats:[],av:null,rents:[]});
});

document.addEventListener("DOMContentLoaded", async ()=>{
	const params = new URLSearchParams(location.search);
	const id = params.get("id");
	if (!id) return;
	let data = [];
	try { data = await (await fetch("assets/data/equipamentos.json")).json(); }
	catch {}
	const eq = data.find(e=>e.id===id);
	if (!eq) return;

	const mainImg = document.getElementById("pd-main-img");
	mainImg.src = eq.image;
	mainImg.alt = eq.name;
	document.getElementById("pd-category-text").textContent = eq.category;
	document.getElementById("pd-title-text").textContent = eq.name;

	const funcList = document.getElementById("pd-functions-list");
	funcList.innerHTML = "";
	eq.functions.forEach(f=>{
		const item= document.createElement("div");
		item.className="pd-function-item";
		const p= Object.assign(document.createElement("p"),{
			className:"pd-funcao-descricao", textContent:f.descricao
		});
		item.append(document.createElement("h6"), p);
		funcList.append(item);
	});
	document.getElementById("pd-application-text").textContent = eq.application;

	const techTable = document.getElementById("pd-tech-table");
	const logTable  = document.getElementById("pd-logistics-table");
	techTable.innerHTML = logTable.innerHTML = "";
	Object.entries(eq.technical_data).forEach(([k,v])=>{
		if (typeof v==="object")
			Object.entries(v).forEach(([sk,sv])=>
				techTable.insertAdjacentHTML("beforeend",
					`<tr><th>${sk.replace(/_/g," ")}</th><td>${sv}</td></tr>`
				)
			);
		else
			techTable.insertAdjacentHTML("beforeend",
				`<tr><th>${k.replace(/_/g," ")}</th><td>${v}</td></tr>`
			);
	});
	Object.entries(eq.logistics).forEach(([k,v])=>
		logTable.insertAdjacentHTML("beforeend",
			`<tr><th>${k.replace(/_/g," ")}</th><td>${v}</td></tr>`
		)
	);

	const availUL = document.getElementById("pd-availability-list");
	availUL.innerHTML="";
	eq.sale && availUL.insertAdjacentHTML("beforeend",
		"<li><i class='bi bi-check-circle-fill me-2'></i>Para venda</li>"
	);
	const labels={diario:"Diário", bidiario:"Bidiário", semanal:"Semanal", mensal:"Mensal"};
	Object.entries(eq.rental).filter(([,ok])=>ok).forEach(([p])=>
		availUL.insertAdjacentHTML("beforeend",
			`<li><i class='bi bi-check-circle-fill me-2'></i>Para aluguer ${labels[p]||p}</li>`
		)
	);

	const track = document.querySelector(".thumbs-track");
	if (track && eq.images){
		eq.images.forEach((src,idx)=>{
			const li=Object.assign(document.createElement("li"),{
				className:"thumb-slide"+(idx?"":" active")
			});
			const img=Object.assign(document.createElement("img"),{
				src, alt:`Miniatura ${idx+1}`, loading:"lazy"
			});
			li.append(img);
			li.addEventListener("click",()=>{
				mainImg.style.opacity="0";
				mainImg.addEventListener("transitionend",function h(e){
					if (e.propertyName==="opacity"){
						mainImg.removeEventListener("transitionend",h);
						mainImg.src=src;
						mainImg.style.opacity="1";
					}
				},{once:true});
				document.querySelectorAll(".thumb-slide").forEach(s=>s.classList.remove("active"));
				li.classList.add("active");
			});
			track.append(li);
		});
	}
	let currentIndex=0;
	const prevBtn=document.querySelector(".thumb-btn.prev");
	const nextBtn=document.querySelector(".thumb-btn.next");
	function updateCarousel(){
		const vp=innerWidth;
		const vis=vp<768?1:vp<992?2:3;
		const slide=document.querySelector(".thumb-slide");
		if (!slide||!track) return;
		const w=slide.offsetWidth+parseFloat(getComputedStyle(slide).marginRight);
		track.style.transform=`translateX(-${currentIndex*w}px)`;
		prevBtn&&(prevBtn.disabled=currentIndex<=0);
		nextBtn&&(nextBtn.disabled=currentIndex>=eq.images.length-vis);
	}
	prevBtn&&prevBtn.addEventListener("click",()=>{if(currentIndex>0)currentIndex--;updateCarousel();});
	nextBtn&&nextBtn.addEventListener("click",()=>{
		const vis=innerWidth<768?1:innerWidth<992?2:3;
		if(currentIndex<eq.images.length-vis)currentIndex++;
		updateCarousel();
	});
	addEventListener("resize",updateCarousel);
	updateCarousel();

	document.getElementById("btn-pdf")?.addEventListener("click",()=>window.print());
	document.getElementById("btn-quote")?.addEventListener("click",()=>location.href="contacto.html");

	const btnFunc=document.getElementById("btn-funcao");
	const btnTech=document.getElementById("btn-tecnica");
	const panelF =document.getElementById("content-funcao");
	const panelT =document.getElementById("content-tecnica");
	function setPanels(showTech){
		if(showTech){
			btnTech.classList.add("active");
			btnFunc.classList.remove("active");
			panelT.classList.add("active"); panelF.classList.remove("active");
			panelT.hidden=false; panelF.hidden=true;
			btnTech.setAttribute("aria-selected","true");
			btnFunc.setAttribute("aria-selected","false");
		} else {
			btnFunc.classList.add("active");
			btnTech.classList.remove("active");
			panelF.classList.add("active"); panelT.classList.remove("active");
			panelF.hidden=false; panelT.hidden=true;
			btnFunc.setAttribute("aria-selected","true");
			btnTech.setAttribute("aria-selected","false");
		}
	}
	btnFunc&&btnFunc.addEventListener("click",()=>setPanels(false));
	btnTech&&btnTech.addEventListener("click",()=>setPanels(true));
	setPanels(false);
});

(function(){
	const banner=document.getElementById("cookie-consent-banner");
	const accept=document.getElementById("cookie-accept-btn");
	const reject=document.getElementById("cookie-reject-btn");
	const key="all4esthetic_cookie_consent_v1";
	function show(){
		if(!localStorage.getItem(key)&&banner){
			banner.classList.add("show");
			banner.setAttribute("aria-hidden","false");
			banner.focus();
		}
	}
	function hide(){
		banner&&(banner.classList.remove("show"),banner.setAttribute("aria-hidden","true"));
	}
	accept&&accept.addEventListener("click",()=>{localStorage.setItem(key,"accepted");hide();});
	reject&&reject.addEventListener("click",()=>{localStorage.setItem(key,"rejected");hide();});
	document.addEventListener("DOMContentLoaded",show);
	banner&&banner.addEventListener("keydown",e=>{if(e.key==="Escape")hide();});
})();


 document.addEventListener("DOMContentLoaded", function () {
    const hash = window.location.hash;
    if (hash === "#modalHistoria" || hash === "#modalEquipa" || hash === "#modalVisao") {
      const targetModal = document.querySelector(hash);
      if (targetModal) {
        const modal = new bootstrap.Modal(targetModal);
        modal.show();
        history.replaceState(null, null, window.location.pathname);
      }
    }
  });