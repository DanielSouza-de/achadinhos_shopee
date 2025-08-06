let produtosGlobais = []; // variável global para guardar os produtos

async function carregarProdutos() {
    try {
        const response = await fetch('https://docs.google.com/spreadsheets/d/e/2PACX-1vTkosGNU0G0ctx_TDbyUjdFY09ueal3gMSBnsLtrgsWByYgDgnKHtb9HCeUii1NYdjfoKdfIav2LaV-/pub?output=csv');
        const csvText = await response.text();

        const linhas = csvText.trim().split('\n');
        const cabecalhos = linhas.shift().split(',');

        produtosGlobais = linhas.map(linha => {
            const valores = linha.split(',');
            const produto = {};
            cabecalhos.forEach((chave, index) => {
                produto[chave.trim()] = valores[index].trim();
            });
            return produto;
        });

        const lista = document.querySelector('.projects-list ul');
        lista.innerHTML = '';

        produtosGlobais.forEach((produto) => {
            const li = document.createElement('li');
            li.className = 'projects-list-item';

            li.innerHTML = `
                <a href="${produto.link}" class="project-link" target="_blank" rel="noopener noreferrer">
                    <img src="${produto.imagem}" alt="${produto.nome}" class="product-image" />
                    <div class="item-text-box">
                        <span class="item-text">${produto.nome}</span>
                    </div>
                </a>
            `;

            lista.appendChild(li);
        });

    } catch (error) {
        console.error('Erro ao carregar produtos:', error);
    }
}

function configurarBusca() {
    const input = document.getElementById("search");
    const suggestions = document.getElementById("suggestions");

    input.addEventListener("input", () => {
        const termo = input.value.toLowerCase();
        suggestions.innerHTML = "";

        if (termo.length > 1) {
            const encontrados = produtosGlobais.filter(p =>
                p.nome.toLowerCase().includes(termo)
            );

            encontrados.forEach(p => {
                const li = document.createElement("li");
                li.textContent = p.nome;
                li.addEventListener("click", () => {
                    window.open(p.link, "_blank");
                    suggestions.innerHTML = "";
                    input.value = p.nome; // opcional: coloca o nome no input
                });
                suggestions.appendChild(li);
            });
        }
    });

    // Fecha sugestões ao clicar fora
    document.addEventListener("click", (e) => {
        if (!e.target.closest(".search-box")) {
            suggestions.innerHTML = "";
        }
    });
}

carregarProdutos().then(() => {
    configurarBusca();
});