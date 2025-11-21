import { autores } from './autores.js';

function criarAccordion() {
  const accordionContainer = document.getElementById("accordionFlushExample");
  accordionContainer.innerHTML = ""; // Limpa o conteúdo antes de recriar
  let totalLivrosGeral = 0;

  autores.forEach((autor, i) => {
    const item = document.createElement("div");
    item.classList.add("accordion-item");

    const h2 = document.createElement("h2");
    h2.classList.add("autores");

    const button = document.createElement("button");
    button.classList.add("accordion-button", "collapsed");
    button.type = "button";
    button.setAttribute("data-bs-toggle", "collapse");
    button.setAttribute("data-bs-target", `#flush-collapse${i + 1}`);
    button.setAttribute("aria-expanded", "false");
    button.setAttribute("aria-controls", `flush-collapse${i + 1}`);
    button.innerHTML = autor.bandeira
      ? `<img src="${autor.bandeira}" class="flag-icon"> ${autor.nome}`
      : autor.nome;

    h2.appendChild(button);

    const divCollapse = document.createElement("div");
    divCollapse.id = `flush-collapse${i + 1}`;
    divCollapse.classList.add("accordion-collapse", "collapse");
    divCollapse.setAttribute("data-bs-parent", "#accordionFlushExample");

    const divBody = document.createElement("div");
    divBody.classList.add("accordion-body");

    const divImages = document.createElement("div");
    divImages.classList.add("image-gallery");

    let colecoes = {};
    let totalLivros = 0;

    autor.imagens.forEach(imagem => {
      if (imagem.colecao) {
        if (!colecoes[imagem.colecao]) {
          colecoes[imagem.colecao] = [];
        }
        colecoes[imagem.colecao].push(imagem);
      } else {
        const imgContainer = document.createElement("div");
        imgContainer.classList.add("image-container");

        const img = document.createElement("img");
        img.src = imagem.url;
        img.alt = "Livro sem coleção";
        img.addEventListener("click", () => abrirModal(imagem.sinopse, imagem.nome));

        const imgName = document.createElement("div");
        imgName.classList.add("image-name");
        imgName.textContent = imagem.nome;

        imgContainer.appendChild(img);
        imgContainer.appendChild(imgName);
        divImages.appendChild(imgContainer);
        totalLivros++;
      }
    });

    for (let colecao in colecoes) {
      const colecaoContainer = document.createElement("div");
      colecaoContainer.classList.add("colecao");

      const carrosselContainer = document.createElement("div");
      carrosselContainer.classList.add("carrossel-container");

      colecoes[colecao].forEach(imagem => {
        const imgContainer = document.createElement("div");
        imgContainer.classList.add("image-container");

        const img = document.createElement("img");
        img.src = imagem.url;
        img.alt = colecao;
        img.addEventListener("click", () => abrirModal(imagem.sinopse, imagem.nome));

        const imgName = document.createElement("div");
        imgName.classList.add("image-name");
        imgName.textContent = imagem.nome;

        imgContainer.appendChild(img);
        imgContainer.appendChild(imgName);
        carrosselContainer.appendChild(imgContainer);
        totalLivros++;
      });

      colecaoContainer.appendChild(carrosselContainer);
      divImages.appendChild(colecaoContainer);
    }

    if (totalLivros > 5) {
      divImages.classList.add("carrossel-container");
    }

    divBody.appendChild(divImages);
    divCollapse.appendChild(divBody);
    item.appendChild(h2);
    item.appendChild(divCollapse);
    accordionContainer.appendChild(item);

    totalLivrosGeral += totalLivros;
  });

  // Atualiza a contagem total no topo
  document.getElementById("livro-contagem").textContent = `Total de livros na lista: ${totalLivrosGeral}`;
}

function abrirModal(sinopse, nomeLivro) {
  document.getElementById("modal-sinopse").textContent = sinopse;
  document.getElementById("bookModalLabel").textContent = `Sinopse: ${nomeLivro}`;
  const modal = new bootstrap.Modal(document.getElementById('bookModal'));
  modal.show();
}

function adicionarCampoDeBusca() {
  const searchInput = document.getElementById("searchInput");

  searchInput.addEventListener("input", function () {
    const termo = this.value.toLowerCase().trim();
    const accordionItems = document.querySelectorAll("#accordionFlushExample .accordion-item");

    accordionItems.forEach(item => {
      const nomeAutor = item.querySelector("button.accordion-button").textContent.toLowerCase();
      const nomesLivros = Array.from(item.querySelectorAll(".image-name")).map(el => el.textContent.toLowerCase());

      const encontrouAutor = nomeAutor.includes(termo);
      const encontrouLivro = nomesLivros.some(nome => nome.includes(termo));

      if (termo === "" || encontrouAutor || encontrouLivro) {
        item.style.display = "";
      } else {
        item.style.display = "none";
      }
    });
  });
}

function adicionarFiltroPorLetra() {
  const letras = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  const letraMenu = document.querySelector(".letras-menu");

  letras.forEach(letra => {
    const btn = document.createElement("button");
    btn.textContent = letra;
    btn.classList.add("dropdown-item");
    btn.addEventListener("click", () => {
      filtrarPorLetra(letra);
    });
    letraMenu.appendChild(btn);
  });
}

function filtrarPorLetra(letra) {
  const accordionItems = document.querySelectorAll("#accordionFlushExample .accordion-item");

  accordionItems.forEach(item => {
    const nomeAutor = item.querySelector("button.accordion-button").textContent.trim();
    if (nomeAutor.toUpperCase().startsWith(letra)) {
      item.style.display = "";
    } else {
      item.style.display = "none";
    }
  });

  // Limpa o campo de busca
  document.getElementById("searchInput").value = "";
}

// Atualize o onload
window.onload = () => {
  criarAccordion();
  adicionarCampoDeBusca();
  adicionarFiltroPorLetra();
};