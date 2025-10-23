// js/cep-masks.js
document.addEventListener('DOMContentLoaded', () => {
  // ====== ELEMENTOS (existem só nas páginas que têm formulário) ======
  const form      = document.getElementById('formCadastro');
  const alerta    = document.getElementById('alerta');
  const cepInput  = document.getElementById('cep');
  const endInput  = document.getElementById('endereco');
  const cidInput  = document.getElementById('cidade');
  const estInput  = document.getElementById('estado');
  const cpfInput  = document.getElementById('cpf');
  const telInput  = document.getElementById('telefone');
  const nascInput = document.getElementById('nascimento');

  // Utilitário de mensagem
  function setAlert(msg) {
    if (alerta) {
      alerta.textContent = msg;
      alerta.hidden = !msg;
    } else if (msg) {
      // fallback se a página não tiver <div id="alerta">
      console.warn(msg);
    }
  }

  // ====== VIACEP (busca de endereço) ======
  async function buscarEndereco(cepLimpo) {
    try {
      const res = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
      const data = await res.json();
      if (data.erro) throw new Error('CEP não encontrado.');
      if (endInput) endInput.value = data.logradouro || '';
      if (cidInput) cidInput.value = data.localidade || '';
      if (estInput) estInput.value = data.uf || '';
      setAlert(''); // limpa mensagem
    } catch (err) {
      if (endInput) endInput.value = '';
      if (cidInput) cidInput.value = '';
      if (estInput) estInput.value = '';
      setAlert('CEP inválido ou não encontrado.');
      console.error('ViaCEP:', err);
    }
  }

  if (cepInput) {
    // máscara CEP 00000-000
    cepInput.addEventListener('input', (e) => {
      let v = e.target.value.replace(/\D/g, '').slice(0, 8);
      if (v.length > 5) v = v.slice(0, 5) + '-' + v.slice(5);
      e.target.value = v;
    });

    // busca ao sair do campo (se tiver 8 dígitos)
    cepInput.addEventListener('blur', () => {
      const v = cepInput.value.replace(/\D/g, '');
      if (v.length === 8) buscarEndereco(v);
    });
  }

  // ====== MÁSCARAS CPF/TELEFONE ======
  if (cpfInput) {
    cpfInput.addEventListener('input', (e) => {
      let v = e.target.value.replace(/\D/g, '').slice(0, 11);
      let r = '';
      if (v.length > 0) r = v.slice(0, 3);
      if (v.length > 3) r += '.' + v.slice(3, 6);
      if (v.length > 6) r += '.' + v.slice(6, 9);
      if (v.length > 9) r += '-' + v.slice(9, 11);
      e.target.value = r;
    });
  }

  if (telInput) {
    telInput.addEventListener('input', (e) => {
      let v = e.target.value.replace(/\D/g, '').slice(0, 11);
      let r = '';
      if (v.length > 0) r = '(' + v.slice(0, 2);
      if (v.length > 2) r += ') ' + v.slice(2, 7);
      if (v.length > 7) r += '-' + v.slice(7, 11);
      e.target.value = r;
    });
  }

  // ====== VALIDAÇÕES EXTRAS NO SUBMIT ======
  function maiorDe18(dateStr) {
    const d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) return false;
    const hoje = new Date();
    let idade = hoje.getFullYear() - d.getFullYear();
    const m = hoje.getMonth() - d.getMonth();
    if (m < 0 || (m === 0 && hoje.getDate() < d.getDate())) idade--;
    return idade >= 18;
  }

  function validaCPF(value) {
    const v = (value || '').replace(/\D/g, '');
    if (v.length !== 11 || /^(\d)\1+$/.test(v)) return false;
    let s = 0;
    for (let i = 0; i < 9; i++) s += parseInt(v[i]) * (10 - i);
    let d = 11 - (s % 11); if (d > 9) d = 0;
    if (d !== parseInt(v[9])) return false;
    s = 0;
    for (let i = 0; i < 10; i++) s += parseInt(v[i]) * (11 - i);
    d = 11 - (s % 11); if (d > 9) d = 0;
    return d === parseInt(v[10]);
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      setAlert('');
      const erros = [];

      // checagens adicionais ao HTML5
      if (nascInput && !maiorDe18(nascInput.value)) erros.push('Idade mínima: 18 anos.');
      if (cpfInput && !validaCPF(cpfInput.value)) erros.push('CPF inválido.');

      // padrões extra (consistentes com os patterns do HTML)
      if (telInput && !/^\(\d{2}\)\s?\d{4,5}-\d{4}$/.test(telInput.value)) erros.push('Telefone inválido.');
      if (cepInput && !/^\d{5}-\d{3}$/.test(cepInput.value)) erros.push('CEP inválido.');
      if (estInput && !estInput.value) erros.push('Selecione o estado.');

      if (erros.length) {
        e.preventDefault();
        setAlert(erros.join(' '));
        (form.querySelector(':invalid') || cpfInput || cepInput || telInput)?.focus();
      }
    });
  }

  // ====== MENU MÓVEL (hambúrguer) ======
  const btn  = document.querySelector('.nav-toggle');
  const menu = document.getElementById('menu');

  if (btn && menu) {
    btn.addEventListener('click', () => {
      const aberto = menu.getAttribute('data-open') === 'true';
      menu.setAttribute('data-open', String(!aberto));
      btn.setAttribute('aria-expanded', String(!aberto));
    });

    // Fecha o menu ao clicar em um link (melhor UX no mobile)
    menu.addEventListener('click', (e) => {
      const isLink = e.target.closest('a');
      if (isLink && window.matchMedia('(max-width: 768px)').matches) {
        menu.setAttribute('data-open', 'false');
        btn.setAttribute('aria-expanded', 'false');
      }
    });
  }
});
