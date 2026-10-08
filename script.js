/* ===== Utilitários e sessão (localStorage) ===== */
const $ = (id) => document.getElementById(id);

const Sessao = {
  usuarios: () => JSON.parse(localStorage.getItem("usuarios") || "[]"),
  salvarUsuarios: (lista) => localStorage.setItem("usuarios", JSON.stringify(lista)),
  atual: () => JSON.parse(localStorage.getItem("usuarioAtual") || "null"),
  entrar: (usuario) => localStorage.setItem("usuarioAtual", JSON.stringify(usuario)),
  sair: () => localStorage.removeItem("usuarioAtual"),
};

/* ===== Mensagem central ===== */
function mostrarAviso(texto) {
  document.querySelector(".toast")?.remove();
  const aviso = document.createElement("div");
  aviso.className = "toast";
  aviso.textContent = texto;
  document.body.appendChild(aviso);
  setTimeout(() => aviso.remove(), 1800);
}

/* ===== Função para baixar arquivo TXT ===== */
function baixarArquivoTxt(nomeArquivo, conteudo) {
  const blob = new Blob([conteudo], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = nomeArquivo;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/* ===== Footer: data atual ===== */
function iniciarFooter() {
  const elemData = $("dataAtual");
  if (elemData) {
    elemData.textContent = new Date().toLocaleDateString("pt-BR", {
      weekday: "long", day: "numeric", month: "long", year: "numeric",
    });
  }
}

/* ===== Dados de informações ===== */
const DADOS_INFO = {
  empresa: {
    titulo: "Empresa",
    conteudo: "<p><strong>Empresa:</strong> Diários online</p><p style='margin-top:0.5rem; color:var(--cinza-300);'>Sua plataforma privada para guardar momentos com segurança.</p>"
  },
  clientes: {
    titulo: "Clientes",
    conteudo: "<p><strong>Clientes:</strong> Estudantes, professores e demais usuários.</p>"
  },
  telefones: {
    titulo: "Telefones",
    conteudo: "<p><strong>Telefones:</strong> 32 99999-9999</p>"
  },
  email: {
    titulo: "Email",
    conteudo: "<p><strong>Email:</strong> <a href=\"#\" class=\"link-email\" data-email=\"diariochaves@gmail.com\">diariochaves@gmail.com</a></p><p style='margin-top:0.5rem; color:var(--cinza-300);'>Clique no email para escrever uma mensagem.</p>"
  }
};

/* ===== Janela Modal Central ===== */
function abrirModal(html) {
  const modal = $("modal");
  const modalConteudo = $("modalConteudo");
  if (modal && modalConteudo) {
    modalConteudo.innerHTML = html;
    modal.hidden = false;
  }
}

function fecharModal() {
  const modal = $("modal");
  if (modal) {
    modal.hidden = true;
  }
}

/* ===== Menu e Sidebar Lateral ===== */
function iniciarMenu() {
  const btnSobre = $("btn-sobre");
  const btnContato = $("btn-contato");
  const sidebarLeft = $("sidebarLeft");
  const sidebarOverlay = $("sidebarOverlay");
  const sidebarFechar = $("sidebarFechar");

  // Painel que mostra as informações dentro da própria sidebar
  const sidebarContent = sidebarLeft ? sidebarLeft.querySelector(".sidebar-content") : null;
  const painelInfo = document.createElement("div");
  painelInfo.className = "sidebar-info";
  painelInfo.hidden = true;
  if (sidebarContent) sidebarContent.appendChild(painelInfo);

  // Ao clicar no email mostrado no painel, abre o Outlook
  painelInfo.addEventListener("click", (e) => {
    const linkEmail = e.target.closest("[data-email]");
    if (!linkEmail) return;
    e.preventDefault();
    const destino = encodeURIComponent(linkEmail.dataset.email);
    window.open("https://outlook.live.com/mail/0/deeplink/compose?to=" + destino, "_blank");
  });

  function limparInfo() {
    painelInfo.hidden = true;
    painelInfo.innerHTML = "";
    document.querySelectorAll("[data-info]").forEach((l) => l.classList.remove("ativo"));
  }

  function abrirSidebar(secao) {
    const secaoSobre = $("sidebar-secao-sobre");
    const secaoContato = $("sidebar-secao-contato");

    limparInfo();

    // Exibe apenas a seção selecionada e esconde a outra
    if (secaoSobre) secaoSobre.style.display = secao === "sobre" ? "block" : "none";
    if (secaoContato) secaoContato.style.display = secao === "contato" ? "block" : "none";

    if (sidebarLeft && sidebarOverlay) {
      sidebarLeft.classList.add("active");
      sidebarOverlay.classList.add("active");
    }
  }

  function fecharSidebar() {
    if (sidebarLeft && sidebarOverlay) {
      sidebarLeft.classList.remove("active");
      sidebarOverlay.classList.remove("active");
    }
    limparInfo();
  }

  if (btnSobre) {
    btnSobre.addEventListener("click", (e) => {
      e.preventDefault();
      abrirSidebar("sobre");
    });
  }

  if (btnContato) {
    btnContato.addEventListener("click", (e) => {
      e.preventDefault();
      abrirSidebar("contato");
    });
  }

  if (sidebarFechar) sidebarFechar.addEventListener("click", fecharSidebar);
  if (sidebarOverlay) sidebarOverlay.addEventListener("click", fecharSidebar);

  // Clicks nos links da sidebar
  document.querySelectorAll("[data-info]").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const chave = link.dataset.info;

      // Todas as opções (inclusive Email) aparecem DENTRO da sidebar
      const info = DADOS_INFO[chave];
      if (info) {
        limparInfo();
        link.classList.add("ativo");
        painelInfo.innerHTML = `<h3>${info.titulo}</h3>${info.conteudo}`;
        painelInfo.hidden = false;
      }
    });
  });

  const btnModalFechar = $("modalFechar");
  if (btnModalFechar) btnModalFechar.addEventListener("click", fecharModal);

  const modal = $("modal");
  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) fecharModal();
    });
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      fecharSidebar();
      fecharModal();
    }
  });
}

/* ===== Cabeçalho ===== */
function iniciarCabecalho() {
  const usuario = Sessao.atual();
  const pagina = document.body.dataset.page;
  if (pagina === "diario" && usuario) {
    const userName = $("userName");
    if (userName) userName.textContent = usuario.nome;
    const linkInicio = $("linkInicio");
    if (linkInicio) linkInicio.href = "final.html";
    
    const itemLogin = $("itemLogin");
    if (itemLogin) {
      const sair = itemLogin.querySelector("a");
      if (sair) {
        sair.textContent = "Sair";
        sair.href = "index.html";
        sair.addEventListener("click", () => Sessao.sair());
      }
    }
  }
}

/* ===== Formulários ===== */
function campoVazio(...ids) {
  return ids.some((id) => {
    const el = $(id);
    return !el || !el.value.trim();
  });
}

function iniciarLogin() {
  const form = $("formLogin");
  if (!form) return;
  
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const msg = $("mensagem");

    if (campoVazio("email", "senha")) {
      if (msg) msg.textContent = "Preencha todos os campos.";
      return;
    }

    const email = $("email").value.trim().toLowerCase();
    const senha = $("senha").value;
    const usuarios = Sessao.usuarios();
    const cadastrado = usuarios.find((u) => u.email === email);

    if (cadastrado && cadastrado.senha && cadastrado.senha !== senha) {
      if (msg) msg.textContent = "Senha incorreta.";
      return;
    }

    const usuarioAtual = {
      nome: cadastrado ? cadastrado.nome : email.split("@")[0],
      email: email
    };

    Sessao.entrar(usuarioAtual);
    window.location.href = "final.html";
  });
}

/* Validações do cadastro */
function cpfValido(valor) {
  valor = valor.trim();
  if (!valor) return true; // CPF continua opcional
  if (/[^\d.\-\s]/.test(valor)) return false; // letras ou símbolos
  return valor.replace(/\D/g, "").length <= 11; // no máximo 11 dígitos
}

function emailValido(valor) {
  // precisa ter "@" e ".com" (aceita também .com.br)
  return /^[^\s@]+@[^\s@]+\.com(\.[a-z]{2})?$/i.test(valor.trim());
}

const SENHA_MIN = 6; // quantidade mínima de caracteres da senha

function senhaValida(valor) {
  return valor.length >= SENHA_MIN;
}

function mostrarErro(idCampo, idErro, mostrar) {
  const campo = $(idCampo);
  const erro = $(idErro);
  if (erro) erro.hidden = !mostrar;
  if (campo) campo.classList.toggle("invalido", mostrar);
}

function iniciarCadastro() {
  const form = $("formCadastro");
  if (!form) return;

  // Some o aviso assim que a pessoa volta a digitar no campo
  [["cpf", "erroCpf"], ["email", "erroEmail"], ["senha", "erroSenha"]].forEach(([campo, erro]) => {
    const el = $(campo);
    if (el) el.addEventListener("input", () => mostrarErro(campo, erro, false));
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const msg = $("mensagem");

    const cpfOk = cpfValido($("cpf") ? $("cpf").value : "");
    const emailOk = emailValido($("email").value);
    mostrarErro("cpf", "erroCpf", !cpfOk);
    mostrarErro("email", "erroEmail", !emailOk);
    const senhaOk = senhaValida($("senha").value);
    mostrarErro("senha", "erroSenha", !senhaOk);

    if (campoVazio("nome", "senha")) {
      if (msg) msg.textContent = "Preencha os campos obrigatórios.";
      return;
    }
    if (msg) msg.textContent = "";
    if (!cpfOk || !emailOk || !senhaOk) return;

    const usuario = {
      nome: $("nome").value.trim(),
      email: $("email").value.trim().toLowerCase(),
      senha: $("senha").value,
      cpf: $("cpf") ? $("cpf").value.trim() : "",
      endereco: $("endereco") ? $("endereco").value.trim() : ""
    };

    const lista = Sessao.usuarios().filter((u) => u.email !== usuario.email);
    lista.push(usuario);
    Sessao.salvarUsuarios(lista);

    // Formata o conteúdo do arquivo TXT
    const conteudoTxt = `Nome: ${usuario.nome}\nCPF:  ${usuario.cpf}\nEndereço: ${usuario.endereco}\nEmail: ${usuario.email}\nSenha: ${usuario.senha}`;

    // Dispara o download do arquivo .txt
    baixarArquivoTxt(`cadastro_${usuario.nome.replace(/\s+/g, "_").toLowerCase()}.txt`, conteudoTxt);

    // Não faz login automático: o usuário deve entrar pela tela de login
    // Aguarda o navegador disparar o download antes de redirecionar
    setTimeout(() => {
      window.location.href = "login.html";
    }, 500);
  });
}

/* ===== Notas: armazenamento e utilitários ===== */
function chaveNotas() {
  const u = Sessao.atual();
  return u ? "notas_" + u.email : null;
}

function novoId() {
  return Date.now() + "-" + Math.random().toString(36).slice(2, 8);
}

function lerNotas() {
  const chave = chaveNotas();
  if (!chave) return [];
  const notas = JSON.parse(localStorage.getItem(chave) || "[]");
  let alterou = false;
  // Notas antigas (sem id) recebem um id para poderem ser excluídas
  notas.forEach((n, i) => {
    if (!n.id) { n.id = "legado-" + i; alterou = true; }
  });
  if (alterou) localStorage.setItem(chave, JSON.stringify(notas));
  return notas;
}

function salvarNotas(notas) {
  const chave = chaveNotas();
  if (chave) localStorage.setItem(chave, JSON.stringify(notas));
}

function partesData(n) {
  const m = (n.data || "").match(/(\d{2})\/(\d{2})\/(\d{4})(?:\D+(\d{1,2}):(\d{2})(?::(\d{2}))?)?/);
  return m ? { dia: +m[1], mes: +m[2], ano: +m[3], h: +(m[4] || 0), min: +(m[5] || 0), s: +(m[6] || 0) } : null;
}

function tsDaNota(n) {
  const p = partesData(n);
  return p ? new Date(p.ano, p.mes - 1, p.dia, p.h, p.min, p.s).getTime() : 0;
}

function escapar(txt) {
  const d = document.createElement("div");
  d.textContent = txt;
  return d.innerHTML;
}

/* ===== Emojis de humor (5 opções que podem ser trocadas) ===== */
const EMOJIS_PADRAO = ["😄", "🙂", "😐", "😔", "😡"];
const ROTULOS_HUMOR = ["Feliz", "Bem", "Neutro", "Triste", "Irritado"];
const PESO_LEGADO = { "😄": 5, "🙂": 4, "😐": 3, "😔": 2, "😡": 1 };
const REGEX_EMOJI = /\p{Extended_Pictographic}|\p{Regional_Indicator}/u;
const EMOJIS_PALETA = ["😀","😃","😄","😁","😆","😅","😂","🤣","🙂","😉","😊","😍","🥰","😘","😎","🤩",
  "🥳","😏","😌","😴","🤔","😐","😑","😶","🙄","😬","😢","😭","😔","😞","😟","😡","😠","🤯","😱","😨",
  "😰","🥺","😇","🤗","🤭","🤫","❤️","🧡","💛","💚","💙","💜","🖤","💔","🔥","⭐","🌈","☀️","🌙","⚡",
  "🎉","🎵","🍀","🌸","🐶","🐱","👍","👏","🙏","💪"];

function lerEmojis() {
  try {
    const e = JSON.parse(localStorage.getItem("emojisHumor") || "null");
    if (Array.isArray(e) && e.length === 5 && e.every((x) => typeof x === "string" && x)) return e;
  } catch (erro) { /* usa o padrão */ }
  return EMOJIS_PADRAO.slice();
}

function primeiroEmoji(texto) {
  texto = texto.trim();
  if (!texto) return "";
  if (window.Intl && Intl.Segmenter) {
    return [...new Intl.Segmenter(undefined, { granularity: "grapheme" }).segment(texto)][0].segment;
  }
  return Array.from(texto)[0];
}

function botoesHumorHtml() {
  return lerEmojis().map((e, i) =>
    `<button type="button" class="mood" data-mood="${e}" data-peso="${5 - i}" aria-label="${ROTULOS_HUMOR[i]}">${e}</button>`
  ).join("");
}

function desenharHumores() {
  const cont = $("moods");
  if (!cont) return;
  const idx = Array.from(cont.children).findIndex((b) => b.classList.contains("ativo"));
  cont.innerHTML = botoesHumorHtml();
  if (idx >= 0 && cont.children[idx]) cont.children[idx].classList.add("ativo");
}

function pesoDaNota(n) {
  return n.peso || PESO_LEGADO[n.humor] || 3;
}

/* ===== Diário ===== */
function desenharNotas() {
  const lista = $("listaNotas");
  if (!lista) return;
  lista.innerHTML = "";
  const notas = lerNotas();
  if (!notas.length) {
    lista.innerHTML = '<li class="vazio">Nenhuma nota ainda. Escreva a primeira acima.</li>';
    return;
  }
  // Mais recentes primeiro (considera a data da nota, inclusive de dias anteriores)
  notas
    .map((n, i) => ({ n, i }))
    .sort((a, b) => tsDaNota(b.n) - tsDaNota(a.n) || b.i - a.i)
    .forEach(({ n }) => {
      const li = document.createElement("li");
      li.className = "nota";
      const data = document.createElement("small");
      data.textContent = `${n.humor} ${n.data}`;
      const texto = document.createElement("p");
      texto.textContent = n.texto;
      const excluir = document.createElement("button");
      excluir.type = "button";
      excluir.className = "nota-excluir";
      excluir.dataset.id = n.id;
      excluir.textContent = "✕";
      excluir.title = "Excluir nota";
      excluir.setAttribute("aria-label", "Excluir nota");
      li.append(data, texto, excluir);
      lista.appendChild(li);
    });
}

function confirmarExclusao(id) {
  abrirModal(`
    <h2 class="confirmar-titulo">Deseja excluir essa nota?</h2>
    <div class="confirmar-botoes">
      <button type="button" class="btn" id="btnExcluirSim">Sim</button>
      <button type="button" class="btn" id="btnExcluirNao">Não</button>
    </div>`);

  $("btnExcluirSim").addEventListener("click", () => {
    salvarNotas(lerNotas().filter((n) => n.id !== id));
    fecharModal();
    desenharNotas();
    mostrarAviso("Nota excluída!");
  });
  $("btnExcluirNao").addEventListener("click", fecharModal);
}

function iniciarDiario() {
  if (!Sessao.atual()) return;
  desenharHumores();

  const moods = $("moods");
  if (moods) {
    moods.addEventListener("click", (e) => {
      const botao = e.target.closest(".mood");
      if (!botao) return;
      moods.querySelectorAll(".mood").forEach((b) => b.classList.toggle("ativo", b === botao));
    });
  }

  const lista = $("listaNotas");
  if (lista) {
    lista.addEventListener("click", (e) => {
      const botao = e.target.closest(".nota-excluir");
      if (botao) confirmarExclusao(botao.dataset.id);
    });
  }

  const btnSalvar = $("btnSalvar");
  if (btnSalvar) {
    btnSalvar.addEventListener("click", () => {
      const notaElem = $("nota");
      const msg = $("mensagem");
      const texto = notaElem ? notaElem.value.trim() : "";
      const ativo = moods ? moods.querySelector(".mood.ativo") : null;
      if (!ativo || !texto) {
        if (msg) msg.textContent = "Escolha um humor e escreva sua nota.";
        return;
      }
      const notas = lerNotas();
      notas.push({
        id: novoId(),
        humor: ativo.dataset.mood,
        peso: Number(ativo.dataset.peso),
        texto,
        data: new Date().toLocaleString("pt-BR"),
      });
      salvarNotas(notas);
      if (notaElem) notaElem.value = "";
      if (msg) msg.textContent = "";
      mostrarAviso("Nota salva!");
      desenharNotas();
    });
  }

  desenharNotas();
}

/* ===== Tema ===== */
function aplicarTema() {
  document.body.classList.toggle("tema-claro", localStorage.getItem("tema") === "claro");
}

/* ===== Configurações ===== */
function salvarEmojis(lista) {
  localStorage.setItem("emojisHumor", JSON.stringify(lista));
  desenharHumores();
  abrirConfiguracoes();
  mostrarAviso("Emojis salvos!");
}

function abrirConfiguracoes() {
  const claro = localStorage.getItem("tema") === "claro";
  const campos = lerEmojis().map((e, i) =>
    `<input type="text" class="emoji-input" value="${e}" maxlength="16" aria-label="Emoji ${i + 1}: ${ROTULOS_HUMOR[i]}">`
  ).join("");

  abrirModal(`
    <h2>Configurações</h2>
    <label>Cor do site</label>
    <button type="button" class="btn" id="btnTema">${claro ? "Voltar para o site escuro" : "Mudar site para branco"}</button>
    <label>Emojis do humor <small>(do mais feliz ao mais irritado)</small></label>
    <div class="emoji-config">${campos}</div>
    <button type="button" class="btn" id="btnPaleta">😊 Escolher emoji</button>
    <div class="emoji-paleta" id="paleta" hidden>${EMOJIS_PALETA.map((e) => `<button type="button" data-emoji="${e}">${e}</button>`).join("")}</div>
    <small class="dica">Dica: você também pode digitar com o teclado de emojis (Windows: Win + . | Mac: Ctrl + Cmd + Espaço).</small>
    <p class="msg" id="msgEmojis" role="alert"></p>
    <button type="button" class="btn" id="btnSalvarEmojis">Salvar emojis</button>
    <button type="button" class="btn" id="btnRestaurarEmojis">Restaurar padrão</button>`);

  $("btnTema").addEventListener("click", () => {
    localStorage.setItem("tema", document.body.classList.contains("tema-claro") ? "escuro" : "claro");
    aplicarTema();
    abrirConfiguracoes();
  });

  // Paleta de emojis: o emoji clicado vai para o campo selecionado
  const camposEmoji = Array.from(document.querySelectorAll(".emoji-input"));
  let alvo = camposEmoji[0];
  const marcarAlvo = (c) => {
    alvo = c;
    camposEmoji.forEach((x) => x.classList.toggle("alvo", x === c));
  };
  marcarAlvo(alvo);
  camposEmoji.forEach((c) => c.addEventListener("focus", () => marcarAlvo(c)));
  $("btnPaleta").addEventListener("click", () => { $("paleta").hidden = !$("paleta").hidden; });
  $("paleta").addEventListener("click", (e) => {
    const botao = e.target.closest("[data-emoji]");
    if (!botao) return;
    alvo.value = botao.dataset.emoji;
    const proximo = camposEmoji[camposEmoji.indexOf(alvo) + 1];
    if (proximo) marcarAlvo(proximo);
  });

  $("btnSalvarEmojis").addEventListener("click", () => {
    const msg = $("msgEmojis");
    const novos = [];
    for (const campo of document.querySelectorAll(".emoji-input")) {
      const e = primeiroEmoji(campo.value);
      if (!e || !REGEX_EMOJI.test(e)) {
        msg.textContent = "Preencha os 5 campos apenas com emojis.";
        return;
      }
      novos.push(e);
    }
    if (new Set(novos).size < 5) {
      msg.textContent = "Os 5 emojis precisam ser diferentes.";
      return;
    }
    salvarEmojis(novos);
  });

  $("btnRestaurarEmojis").addEventListener("click", () => salvarEmojis(EMOJIS_PADRAO.slice()));
}

/* ===== Calendário ===== */
const MESES = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
               "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
const DIAS_SEMANA = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
let calAno, calMes;

function abrirCalendario() {
  const hoje = new Date();
  calAno = hoje.getFullYear();
  calMes = hoje.getMonth();
  desenharCalendario();
}

function desenharCalendario() {
  const humorDoDia = {};
  lerNotas().forEach((n) => {
    const p = partesData(n);
    if (p && p.mes - 1 === calMes && p.ano === calAno) humorDoDia[p.dia] = n.humor;
  });

  const hoje = new Date();
  const hojeZero = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
  const primeiroDia = new Date(calAno, calMes, 1).getDay();
  const totalDias = new Date(calAno, calMes + 1, 0).getDate();

  let linhas = "<tr>" + "<td></td>".repeat(primeiroDia);
  for (let d = 1; d <= totalDias; d++) {
    const ehHoje = d === hoje.getDate() && calMes === hoje.getMonth() && calAno === hoje.getFullYear();
    const futuro = new Date(calAno, calMes, d) > hojeZero;
    const emoji = humorDoDia[d] ? `<small>${humorDoDia[d]}</small>` : "";
    const classes = [ehHoje ? "hoje" : "", futuro ? "futuro" : ""].join(" ").trim();
    // Dias de hoje e anteriores são clicáveis para adicionar nota
    const conteudo = futuro
      ? `${d}${emoji}`
      : `<button type="button" class="cal-dia" data-dia="${d}" aria-label="Adicionar nota no dia ${d}">${d}${emoji}</button>`;
    linhas += `<td class="${classes}">${conteudo}</td>`;
    if ((primeiroDia + d) % 7 === 0 && d < totalDias) linhas += "</tr><tr>";
  }
  linhas += "</tr>";

  abrirModal(`
    <h2>Calendário</h2>
    <p class="cal-ano">${calAno}</p>
    <p class="cal-mes">${MESES[calMes]}</p>
    <div class="cal-nav">
      <button type="button" class="btn" data-nav="-1">‹ Anterior</button>
      <button type="button" class="btn" data-nav="1">Próximo ›</button>
    </div>
    <table class="cal">
      <thead><tr>${DIAS_SEMANA.map((s) => `<th>${s}</th>`).join("")}</tr></thead>
      <tbody>${linhas}</tbody>
    </table>
    <p class="cal-dica">Clique em um dia para adicionar uma nota.</p>`);
}

function abrirNotaDoDia(dia) {
  const agora = new Date();
  const hojeZero = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate());
  if (new Date(calAno, calMes, dia) > hojeZero) return; // não permite dias futuros

  const dataTxt = `${String(dia).padStart(2, "0")}/${String(calMes + 1).padStart(2, "0")}/${calAno}`;
  const doDia = lerNotas().filter((n) => {
    const p = partesData(n);
    return p && p.dia === dia && p.mes - 1 === calMes && p.ano === calAno;
  });
  const existentes = doDia.length
    ? `<h2 style="margin-top:1.5rem">Notas deste dia</h2>
       <ul class="entries">${doDia.map((n) => `<li><small>${escapar(n.humor)} ${escapar(n.data)}</small><p>${escapar(n.texto)}</p></li>`).join("")}</ul>`
    : "";

  abrirModal(`
    <h2>Nota de ${dataTxt}</h2>
    <div class="moods" id="modalMoods" role="radiogroup" aria-label="Humor do dia">${botoesHumorHtml()}</div>
    <label for="notaDia">Nota do dia</label>
    <textarea id="notaDia" rows="5" placeholder="Escreva aqui o que quiser guardar..."></textarea>
    <p class="msg" id="msgDia" role="alert"></p>
    <button type="button" class="btn" id="btnSalvarDia">Salvar nota</button>
    <button type="button" class="btn btn-secondary" id="btnVoltarCal">Voltar ao calendário</button>
    ${existentes}`);

  const humores = $("modalMoods");
  humores.addEventListener("click", (e) => {
    const botao = e.target.closest(".mood");
    if (!botao) return;
    humores.querySelectorAll(".mood").forEach((b) => b.classList.toggle("ativo", b === botao));
  });

  $("btnVoltarCal").addEventListener("click", desenharCalendario);

  $("btnSalvarDia").addEventListener("click", () => {
    const ativo = humores.querySelector(".mood.ativo");
    const texto = $("notaDia").value.trim();
    if (!ativo || !texto) {
      $("msgDia").textContent = "Escolha um humor e escreva sua nota.";
      return;
    }
    const quando = new Date(calAno, calMes, dia, agora.getHours(), agora.getMinutes(), agora.getSeconds());
    const notas = lerNotas();
    notas.push({
      id: novoId(),
      humor: ativo.dataset.mood,
      peso: Number(ativo.dataset.peso),
      texto,
      data: quando.toLocaleString("pt-BR"),
    });
    salvarNotas(notas);
    desenharNotas();
    mostrarAviso("Nota salva!");
    desenharCalendario();
  });
}

/* ===== Estatísticas ===== */
function abrirEstatisticas() {
  const notas = lerNotas();
  if (!notas.length) {
    abrirModal("<h2>Estatísticas</h2><p>Nenhuma nota ainda. Salve uma nota com humor para ver a média.</p>");
    return;
  }
  const emojis = lerEmojis(); // posição 0 = peso 5 ... posição 4 = peso 1
  const contagem = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  let soma = 0;
  notas.forEach((n) => {
    const p = pesoDaNota(n);
    contagem[p]++;
    soma += p;
  });

  const media = soma / notas.length;
  const emojiMedio = emojis[5 - Math.min(5, Math.max(1, Math.round(media)))];

  const barras = [5, 4, 3, 2, 1].map((p) => `
    <div class="barra-linha">
      <span>${emojis[5 - p]}</span>
      <div class="barra"><span style="width:${(contagem[p] / notas.length) * 100}%"></span></div>
      <span>${contagem[p]}</span>
    </div>`).join("");

  abrirModal(`
    <h2>Estatísticas</h2>
    <p class="media">Humor médio: <strong>${media.toFixed(1)} / 5</strong> ${emojiMedio}</p>
    <p class="media">Dias registrados: <strong>${notas.length}</strong></p>
    ${barras}`);
}

function iniciarPaineis() {
  if ($("btnConfig")) $("btnConfig").addEventListener("click", abrirConfiguracoes);
  if ($("btnCalendario")) $("btnCalendario").addEventListener("click", abrirCalendario);
  if ($("btnEstatisticas")) $("btnEstatisticas").addEventListener("click", abrirEstatisticas);

  const modalConteudo = $("modalConteudo");
  if (modalConteudo) {
    modalConteudo.addEventListener("click", (e) => {
      const botaoDia = e.target.closest("[data-dia]");
      if (botaoDia) {
        abrirNotaDoDia(Number(botaoDia.dataset.dia));
        return;
      }
      const botao = e.target.closest("[data-nav]");
      if (!botao) return;
      calMes += Number(botao.dataset.nav);
      if (calMes < 0) { calMes = 11; calAno--; }
      if (calMes > 11) { calMes = 0; calAno++; }
      desenharCalendario();
    });
  }
}

function iniciarImagens() {
  document.querySelectorAll(".img-slot img").forEach((img) => {
    const remover = () => img.remove();
    img.addEventListener("error", remover);
    if (img.complete && img.naturalWidth === 0) remover();
  });
}

/* ===== Inicialização principal (após carregar o DOM) ===== */
document.addEventListener("DOMContentLoaded", () => {
  const pagina = document.body.dataset.page;

  if (pagina === "diario" && !Sessao.atual()) {
    window.location.href = "login.html";
    return;
  }

  aplicarTema();
  iniciarFooter();
  iniciarMenu();
  iniciarCabecalho();

  if (pagina === "home") iniciarImagens();
  if (pagina === "login") iniciarLogin();
  if (pagina === "cadastro") iniciarCadastro();
  if (pagina === "diario") {
    iniciarDiario();
    iniciarPaineis();
  }
});