document.addEventListener('DOMContentLoaded', function() {

    // --- SELEÇÃO DOS ELEMENTOS DO FORMULÁRIO ---
    const cepInput = document.getElementById('cep');
    const enderecoInput = document.getElementById('endereco');
    const cidadeInput = document.getElementById('cidade');
    const estadoInput = document.getElementById('estado');
    const cpfInput = document.getElementById('cpf');
    const telefoneInput = document.getElementById('telefone');

    // --- LÓGICA PARA BUSCA DE ENDEREÇO VIA CEP ---
    cepInput.addEventListener('blur', function() {
        // Remove caracteres não numéricos e envia para a API
        const cep = cepInput.value.replace(/\D/g, '');

        if (cep.length === 8) {
            buscarEndereco(cep);
        } else {
            limparFormularioEndereco();
            // Só exibe o alerta se o campo não estiver vazio
            if (cep.length > 0) {
                alert("CEP inválido. Por favor, digite um CEP com 8 dígitos.");
            }
        }
    });

    async function buscarEndereco(cep) {
        try {
            const url = `https://viacep.com.br/ws/${cep}/json/`;
            const response = await fetch(url);
            const data = await response.json();

            if (data.erro) {
                limparFormularioEndereco();
                alert("CEP não encontrado. Verifique o número digitado.");
            } else {
                enderecoInput.value = data.logradouro;
                cidadeInput.value = data.localidade;
                estadoInput.value = data.uf;
            }
        } catch (error) {
            limparFormularioEndereco();
            alert("Não foi possível buscar o CEP. Verifique sua conexão com a internet.");
            console.error("Erro ao buscar CEP:", error);
        }
    }

    function limparFormularioEndereco() {
        enderecoInput.value = "";
        cidadeInput.value = "";
        estadoInput.value = "";
    }

    // --- LÓGICA PARA APLICAR MÁSCARAS DE INPUT ---

    // Máscara para CEP: Formato 00000-000
    cepInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '').slice(0, 8);
        if (value.length > 5) {
            value = value.slice(0, 5) + '-' + value.slice(5);
        }
        e.target.value = value;
    });

    // Máscara para CPF: Formato 000.000.000-00
    cpfInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '').slice(0, 11);
        let result = '';
        if (value.length > 0) result = value.slice(0, 3);
        if (value.length > 3) result += '.' + value.slice(3, 6);
        if (value.length > 6) result += '.' + value.slice(6, 9);
        if (value.length > 9) result += '-' + value.slice(9, 11);
        e.target.value = result;
    });

    // Máscara para Telefone: Formato (00) 00000-0000
    telefoneInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '').slice(0, 11);
        let result = '';
        if (value.length > 0) result = '(' + value.slice(0, 2);
        if (value.length > 2) result += ') ' + value.slice(2, 7);
        if (value.length > 7) result += '-' + value.slice(7, 11);
        e.target.value = result;
    });

});