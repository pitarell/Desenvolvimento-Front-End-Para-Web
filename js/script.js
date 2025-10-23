/*! Amicão – script unificado (menu, máscaras, ViaCEP, validações, interesses) */
(function () {
  'use strict';

  /* ===================== MENU HAMBÚRGUER ===================== */
  (function initMenu() {
    var btn  = document.querySelector('.nav-toggle');
    var menu = document.getElementById('menu');
    if (!btn || !menu) return;

    if (!menu.hasAttribute('data-open')) menu.setAttribute('data-open', 'false');
    btn.setAttribute('aria-expanded', 'false');

    function toggle(force) {
      var aberto = menu.getAttribute('data-open') === 'true';
      var novo = typeof force === 'boolean' ? force : !aberto;
      menu.setAttribute('data-open', String(novo));
      btn.setAttribute('aria-expanded', String(novo));
    }

    btn.addEventListener('click', function () { toggle(); });

    btn.addEventListener('keydown', function (e) {
      var k = e.key || e.code;
      if (k === 'Enter' || k === ' ' || k === 'Spacebar') { e.preventDefault(); toggle(); }
    });

    menu.addEventListener('click', function (e) {
      var link = e.target.closest && e.target.closest('a');
      if (!link) return;
      if (window.matchMedia('(max-width: 768px)').matches) toggle(false);
    });

    document.addEventListener('click', function (e) {
      if (!window.matchMedia('(max-width: 768px)').matches) return;
      if (!menu.contains(e.target) && !btn.contains(e.target) && menu.getAttribute('data-open') === 'true') toggle(false);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menu.getAttribute('data-open') === 'true') toggle(false);
    });
  })();


  /* ===================== FORMULÁRIO (cadastro) ===================== */
  (function initForm() {
    var form = document.getElementById('formCadastro');
    if (!form) return; // só roda na página de cadastro

    var alerta    = document.getElementById('alerta');
    var cepInput  = document.getElementById('cep');
    var endInput  = document.getElementById('endereco');
    var cidInput  = document.getElementById('cidade');
    var estInput  = document.getElementById('estado');
    var cpfInput  = document.getElementById('cpf');
    var telInput  = document.getElementById('telefone');
    var nascInput = document.getElementById('nascimento');

    // Interesses
    var chkVol     = document.getElementById('intVoluntario');
    var chkAdotar  = document.getElementById('intAdotar');
    var chkOutras  = document.getElementById('intOutras');
    var outrasBox  = document.getElementById('outras-info');

    function setAlert(msg) {
      if (!alerta) return;
      alerta.textContent = msg || '';
      alerta.hidden = !msg;
    }

    // ---------- ViaCEP ----------
    function buscarEndereco(cepLimpo) {
      return fetch('https://viacep.com.br/ws/' + cepLimpo + '/json/')
        .then(function (res) { return res.json(); })
        .then(function (data) {
          if (data.erro) throw new Error('CEP não encontrado');
          if (endInput) endInput.value = data.logradouro || '';
          if (cidInput) cidInput.value = data.localidade || '';
          if (estInput) estInput.value = data.uf || '';
          setAlert('');
        })
        .catch(function (err) {
          if (endInput) endInput.value = '';
          if (cidInput) cidInput.value = '';
          if (estInput) estInput.value = '';
          setAlert('CEP inválido ou não encontrado.');
          console.error('ViaCEP:', err);
        });
    }

    if (cepInput) {
      // máscara CEP
      cepInput.addEventListener('input', function (e) {
        var v = e.target.value.replace(/\D/g, '').slice(0, 8);
        if (v.length > 5) v = v.slice(0, 5) + '-' + v.slice(5);
        e.target.value = v;
      });
      // busca ViaCEP
      cepInput.addEventListener('blur', function () {
        var v = cepInput.value.replace(/\D/g, '');
        if (v.length === 8) buscarEndereco(v);
      });
    }

    // ---------- Máscara CPF ----------
    if (cpfInput) {
      cpfInput.addEventListener('input', function (e) {
        var v = e.target.value.replace(/\D/g, '').slice(0, 11);
        var r = '';
        if (v.length > 0) r = v.slice(0, 3);
        if (v.length > 3) r += '.' + v.slice(3, 6);
        if (v.length > 6) r += '.' + v.slice(6, 9);
        if (v.length > 9) r += '-' + v.slice(9, 11);
        e.target.value = r;
      });
    }

    // ---------- Máscara Telefone ----------
    if (telInput) {
      telInput.addEventListener('input', function (e) {
        var v = e.target.value.replace(/\D/g, '').slice(0, 11);
        var r = '';
        if (v.length > 0) r = '(' + v.slice(0, 2);
        if (v.length > 2) r += ') ' + v.slice(2, 7);
        if (v.length > 7) r += '-' + v.slice(7, 11);
        e.target.value = r;
      });
    }

    // ---------- Validações ----------
    function maiorDe18(dateStr) {
      var d = new Date(dateStr);
      if (isNaN(d.getTime())) return false;
      var hoje = new Date();
      var idade = hoje.getFullYear() - d.getFullYear();
      var m = hoje.getMonth() - d.getMonth();
      if (m < 0 || (m === 0 && hoje.getDate() < d.getDate())) idade--;
      return idade >= 18;
    }

    function validaCPF(value) {
      var v = (value || '').replace(/\D/g, '');
      if (v.length !== 11 || /^(\d)\1+$/.test(v)) return false;
      var s = 0, d, i;
      for (i = 0; i < 9; i++) s += parseInt(v[i], 10) * (10 - i);
      d = 11 - (s % 11); if (d > 9) d = 0; if (d !== parseInt(v[9], 10)) return false;
      s = 0;
      for (i = 0; i < 10; i++) s += parseInt(v[i], 10) * (11 - i);
      d = 11 - (s % 11); if (d > 9) d = 0;
      return d === parseInt(v[10], 10);
    }

    // ---------- Interesses (mostrar/ocultar textarea) ----------
    if (chkOutras && outrasBox) {
      outrasBox.hidden = !chkOutras.checked;
      outrasBox.required = chkOutras.checked;
      chkOutras.setAttribute('aria-expanded', String(chkOutras.checked));

      chkOutras.addEventListener('change', function () {
        var ativo = chkOutras.checked;
        outrasBox.hidden = !ativo;
        outrasBox.required = ativo;
        chkOutras.setAttribute('aria-expanded', String(ativo));
        if (ativo) outrasBox.focus();
      });
    }

    // ---------- Submit ----------
    form.addEventListener('submit', function (e) {
      setAlert('');
      var erros = [];

      // Interesses
      var marcouInteresse =
        (chkVol && chkVol.checked) ||
        (chkAdotar && chkAdotar.checked) ||
        (chkOutras && chkOutras.checked);
      if (!marcouInteresse) erros.push('Selecione pelo menos um interesse.');

      if (chkOutras && chkOutras.checked) {
        var txt = (outrasBox && outrasBox.value ? outrasBox.value.trim() : '');
        if (txt.length < 10) erros.push('Descreva as outras informações (mínimo de 10 caracteres).');
      }

      // Campos principais
      if (nascInput && !maiorDe18(nascInput.value)) erros.push('Idade mínima: 18 anos.');
      if (cpfInput && !validaCPF(cpfInput.value)) erros.push('CPF inválido.');
      if (telInput && !/^\(\d{2}\)\s?\d{4,5}-\d{4}$/.test(telInput.value)) erros.push('Telefone inválido.');
      if (cepInput && !/^\d{5}-\d{3}$/.test(cepInput.value)) erros.push('CEP inválido.');
      if (estInput && !estInput.value) erros.push('Selecione o estado.');

      if (erros.length) {
        e.preventDefault();
        setAlert(erros.join(' '));
        var alvo =
          form.querySelector(':invalid') ||
          (chkOutras && chkOutras.checked ? outrasBox : null) ||
          cpfInput || cepInput || telInput;
        if (alvo && typeof alvo.focus === 'function') alvo.focus();
      }
    });
  })();
})();
