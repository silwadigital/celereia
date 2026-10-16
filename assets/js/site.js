/* Célere IA — interações do site. Sem dependências externas. */
(function () {
  "use strict";
  document.documentElement.classList.add("js");

  const RM = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const WA = "556199449988"; // contato principal: +55 61 9944-9988
  const wait = t => new Promise(r => setTimeout(r, t));
  const brl = v => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
  const waLink = msg => "https://wa.me/" + WA + "?text=" + encodeURIComponent(msg);
  const $ = (s, c) => (c || document).querySelector(s);
  const $$ = (s, c) => [...(c || document).querySelectorAll(s)];

  /* ano no rodapé */
  const ano = $("#ano"); if (ano) ano.textContent = new Date().getFullYear();

  /* menu móvel */
  const burger = $(".burger"), menu = $("#menu");
  if (burger && menu) {
    const fecha = () => { menu.classList.remove("aberto"); burger.setAttribute("aria-expanded", "false"); burger.setAttribute("aria-label", "Abrir menu"); };
    burger.addEventListener("click", () => {
      const aberto = menu.classList.toggle("aberto");
      burger.setAttribute("aria-expanded", String(aberto));
      burger.setAttribute("aria-label", aberto ? "Fechar menu" : "Abrir menu");
    });
    $$("a", menu).forEach(a => a.addEventListener("click", fecha));
    document.addEventListener("keydown", e => { if (e.key === "Escape" && menu.classList.contains("aberto")) { fecha(); burger.focus(); } });
  }

  /* WhatsApp flutuante: aparece depois do hero */
  const flut = $(".wa-flut"), hero = $(".hero");
  if (flut && hero && "IntersectionObserver" in window) {
    new IntersectionObserver(([e]) => flut.classList.toggle("on", !e.isIntersecting), { threshold: 0 }).observe(hero);
  } else if (flut) flut.classList.add("on");

  /* revelação ao rolar: dispara uma vez, stagger curto */
  const rev = $$("[data-reveal]");
  if ("IntersectionObserver" in window && rev.length) {
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.classList.add("in"); io.unobserve(e.target);
    }), { rootMargin: "0px 0px -8% 0px", threshold: 0.1 });
    rev.forEach(el => {
      const grupo = el.parentElement ? $$(":scope > [data-reveal]", el.parentElement) : [];
      const i = grupo.indexOf(el);
      if (i > 0) el.style.setProperty("--d", Math.min(i, 6) * 50 + "ms");
      io.observe(el);
    });
  } else rev.forEach(el => el.classList.add("in"));

  /* dores */
  const cont = $("#contador"), dores = $$(".dor");
  dores.forEach(b => b.addEventListener("click", () => {
    b.setAttribute("aria-pressed", String(b.getAttribute("aria-pressed") !== "true"));
    const n = dores.filter(x => x.getAttribute("aria-pressed") === "true").length;
    cont.textContent = n === 0 ? "Nenhuma situação marcada ainda."
      : "Você marcou " + n + " de " + dores.length + ". A calculadora abaixo mostra quanto isso pode custar.";
  }));

  /* calculadora */
  const ids = ["leads", "sem", "conv", "ticket"], cta = $("#c-cta");
  function calcular() {
    const v = ids.map(i => Math.max(0, +$("#c-" + i + "-n").value || 0));
    const mes = v[0] * (Math.min(v[1], 100) / 100) * (Math.min(v[2], 100) / 100) * v[3];
    $("#c-mes").textContent = brl(mes);
    $("#c-ano").textContent = brl(mes * 12);
    if (cta) cta.href = waLink("Olá! Fiz a conta no site da Célere IA: posso estar deixando cerca de " + brl(mes) + " por mês na mesa. Quero conversar com um consultor.");
  }
  if ($("#c-leads")) {
    ids.forEach(i => {
      const r = $("#c-" + i), n = $("#c-" + i + "-n");
      n.value = r.value;
      r.addEventListener("input", () => { n.value = r.value; calcular(); });
      n.addEventListener("input", () => {
        const lim = Math.min(+n.max, Math.max(+n.min, +n.value || 0));
        r.value = Math.min(+r.max, Math.max(+r.min, lim)); calcular();
      });
      n.addEventListener("blur", () => { n.value = Math.min(+n.max, Math.max(+n.min, +n.value || +n.min)); calcular(); });
    });
    calcular();
  }

  /* ---------- demonstrações ---------- */
  const SCRIPTS = {
    academia: [["l","Vi o anúncio da aula experimental. Como funciona?"],["a","Oi! A aula é gratuita. Qual o seu objetivo: condicionamento, força ou luta?"],["l","Luta! Sempre quis fazer jiu-jitsu"],["a","Ótimo! Tenho turma iniciante na terça ou na quinta, às 19h. Qual fica melhor?"],["l","Terça!"],["x","Aula experimental agendada"]],
    escola: [["l","Oi, quanto custa a matrícula para o 6º ano?"],["a","Olá! Sou a assistente do colégio. Para te passar o valor certo: o aluno vem de outra escola?"],["l","Sim, está na rede pública"],["a","Temos uma condição especial de transição. Vocês pensam em começar já em fevereiro?"],["l","Isso, em fevereiro"],["a","Perfeito! A decisão é só sua ou de mais alguém da família?"],["l","Minha e do meu marido"],["a","Vou agendar a visita para vocês dois: quinta às 9h ou sábado às 10h?"],["l","Sábado às 10h"],["x","Lead qualificado e visita agendada"]],
    followup: [["l","Quanto custa a aula?"],["a","Oi! A aula experimental é gratuita. Quer agendar um horário?"],["d","1 hora depois"],["a","Ficou alguma dúvida sobre os horários?"],["d","24 horas depois"],["a","Separei uma vaga para você na quinta, às 19h. Quer garantir?"],["l","Quero sim!"],["x","Lead recuperado pelo follow-up"]]
  };
  const el = (tag, cls, txt) => { const e = document.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; };

  function Chat(box) {
    const ms = $(".ms", box), st = $(".st", box), sc = SCRIPTS[box.dataset.script] || [];
    let tok = 0;
    const add = (k, x) => ms.appendChild(el("div", k === "x" ? "ok" : k === "d" ? "div" : "b " + k, x));
    return {
      start: async () => {
        const my = ++tok;
        if (RM) { ms.replaceChildren(); sc.forEach(s => add(s[0], s[1])); return; }
        while (my === tok) {
          ms.replaceChildren(); await wait(600);
          for (const [k, x] of sc) {
            if (my !== tok) return;
            if (k === "a") {
              const d = el("div", "dig"); d.append(el("i"), el("i"), el("i"));
              ms.appendChild(d); st.textContent = "digitando..."; await wait(1100); d.remove(); st.textContent = "online";
              if (my !== tok) return;
            }
            add(k, x); await wait(k === "l" ? 1400 : k === "d" ? 800 : 1200);
          }
          await wait(4500);
        }
      },
      stop: () => { tok++; }
    };
  }

  function contar(vs, dur) {
    return new Promise(res => {
      const t0 = performance.now();
      (function f(n) {
        const p = Math.min((n - t0) / dur, 1), e = 1 - Math.pow(1 - p, 3);
        vs.forEach(v => v.textContent = Math.round(v.dataset.v * e));
        p < 1 ? requestAnimationFrame(f) : res();
      })(t0);
    });
  }

  function Relatorio(box) {
    const ms = $(".ms", box); let tok = 0;
    const linhas = [["Leads recebidos",48],["Qualificados pelo SDR",21],["Visitas agendadas",9],["Recuperados no follow-up",5],["Perdidos",7]];
    function monta() {
      const r = el("div", "rel"); r.appendChild(el("div", "tt", "Relatório do dia (exemplo)"));
      linhas.forEach(([t, v]) => { const l = el("div", "r"); l.appendChild(el("span", null, t)); const b = el("b", null, "0"); b.dataset.v = v; l.appendChild(b); r.appendChild(l); });
      r.appendChild(el("div", "ft", "Principal motivo de perda: preço.")); return r;
    }
    return {
      start: async () => {
        const my = ++tok;
        while (my === tok) {
          ms.replaceChildren(); await wait(500); if (my !== tok) return;
          ms.appendChild(monta());
          const vs = $$("[data-v]", ms);
          if (RM) { vs.forEach(v => v.textContent = v.dataset.v); return; }
          await contar(vs, 1300);
          await wait(6000);
        }
      },
      stop: () => { tok++; }
    };
  }

  function Dash(box) {
    const ns = $$("[data-v]", box), bs = $$(".barra", box); let tok = 0;
    const set = (b, w) => b.style.transform = "scaleX(" + w / 100 + ")";
    return {
      start: async () => {
        const my = ++tok;
        while (my === tok) {
          ns.forEach(n => n.textContent = "0");
          bs.forEach(b => { b.style.transition = "none"; set(b, 0); });
          await wait(400); if (my !== tok) return;
          if (RM) { ns.forEach(n => n.textContent = n.dataset.v); bs.forEach(b => set(b, b.dataset.w)); return; }
          bs.forEach((b, i) => { b.style.transition = ""; setTimeout(() => set(b, b.dataset.w), i * 60); });
          await contar(ns, 1300);
          await wait(7000);
        }
      },
      stop: () => { tok++; }
    };
  }

  function Copiloto(box) {
    const O = [
      ["Achei caro. Vou pensar e te falo.","Objeção detectada: preço","“Faz sentido comparar. Quanto custa hoje um lead que ninguém respondeu?”","propor piloto de 30 dias com meta de agendamentos."],
      ["Tenho medo do robô responder errado.","Objeção detectada: confiança","“Ele só responde com o que você aprovar e passa para um humano quando precisa.”","mostrar a demo com as perguntas do próprio cliente."],
      ["Preciso falar com meu sócio antes.","Objeção detectada: decisor","“Claro! Que tal 20 minutos com ele ainda esta semana?”","agendar a reunião antes de desligar."]
    ];
    const cli = $("[data-cliente]", box), tx = $("[data-transc]", box), sg = $("[data-sug]", box);
    let tok = 0;
    const fala = t => { const b = el("b", null, "Cliente: "); tx.replaceChildren(b, document.createTextNode(t)); };
    const mostra = q => { $("[data-o]", box).textContent = q[1]; $("[data-d]", box).textContent = q[2]; $("[data-p]", box).textContent = q[3]; };
    return {
      start: async () => {
        const my = ++tok;
        if (RM) { fala(O[0][0]); mostra(O[0]); sg.classList.add("on"); return; }
        for (let i = 0; my === tok; i = (i + 1) % O.length) {
          const q = O[i];
          sg.classList.remove("on"); fala(""); cli.classList.add("fala");
          await wait(500);
          for (let c = 1; c <= q[0].length; c++) { if (my !== tok) return; fala(q[0].slice(0, c)); await wait(38); }
          cli.classList.remove("fala"); await wait(500); if (my !== tok) return;
          mostra(q); sg.classList.add("on");
          await wait(6000);
        }
      },
      stop: () => { tok++; cli.classList.remove("fala"); }
    };
  }

  const FAB = { chat: Chat, relatorio: Relatorio, dash: Dash, copiloto: Copiloto };
  const demos = new Map();
  $$("[data-demo]").forEach(b => { const f = FAB[b.dataset.demo]; if (f) demos.set(b, { ctl: f(b), visivel: false, rodando: false }); });
  const ativo = b => { const p = b.closest(".painel"); return !p || !p.hidden; };
  function atualiza(b) {
    const d = demos.get(b), deve = d.visivel && ativo(b) && !document.hidden;
    if (deve && !d.rodando) { d.rodando = true; d.ctl.start(); }
    else if (!deve && d.rodando) { d.rodando = false; d.ctl.stop(); }
  }
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(es => es.forEach(e => { demos.get(e.target).visivel = e.isIntersecting; atualiza(e.target); }), { threshold: 0.25 });
    demos.forEach((d, b) => io.observe(b));
  } else demos.forEach((d, b) => { d.visivel = true; atualiza(b); });
  document.addEventListener("visibilitychange", () => demos.forEach((d, b) => atualiza(b)));

  /* abas acessíveis */
  const abas = $$(".aba");
  function seleciona(aba, foco) {
    abas.forEach(a => {
      const on = a === aba;
      a.setAttribute("aria-selected", String(on)); a.tabIndex = on ? 0 : -1;
      document.getElementById(a.getAttribute("aria-controls")).hidden = !on;
    });
    if (foco) aba.focus();
    demos.forEach((d, b) => atualiza(b));
  }
  abas.forEach((a, i) => {
    a.addEventListener("click", () => seleciona(a));
    a.addEventListener("keydown", e => {
      let j = null;
      if (e.key === "ArrowRight") j = (i + 1) % abas.length;
      if (e.key === "ArrowLeft") j = (i - 1 + abas.length) % abas.length;
      if (e.key === "Home") j = 0;
      if (e.key === "End") j = abas.length - 1;
      if (j !== null) { e.preventDefault(); seleciona(abas[j], true); }
    });
  });
})();
