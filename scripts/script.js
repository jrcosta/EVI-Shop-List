class Produto {
    constructor(nome, qtd) {
        this.nome = nome;
        this.qtd = qtd;
    }
    }
    
let lista = JSON.parse(localStorage.getItem("lista")) || [];
let inputNome = document.getElementById("itemLista");
let inputQtd = document.getElementById("qtdProduto");
//let lista = [];

inputQtd.addEventListener("keyup", function (event) {
    event.preventDefault();
    if (event.keyCode === 13) {
        document.getElementById("buttonADC").click();
    }
});

inputNome.addEventListener("keyup", function (event) {
    event.preventDefault();
    if (event.keyCode === 13) {
        document.getElementById("buttonADC").click();
    }
});


function adicionarProduto() {
    let nome = inputNome.value;
    let qtd = inputQtd.value;

    if (!nome) {
        alert("Por favor, preencha o nome do produto.");
        inputNome.focus();
        return;
    } else if(!qtd){
        alert("Por favor, preencha a quantidade do produto.");
        inputQtd.focus();
        return;
    }

    let produto = new Produto(nome, qtd);

    let jaExiste = lista.find(p => p.nome === nome);
    if (jaExiste) {
        let confirmacao = window.confirm(`Já existe ${jaExiste.qtd} unidades de ${nome} na lista. Deseja adicionar mais ${qtd} unidades?`);
        if (confirmacao) {
            jaExiste.qtd = parseInt(jaExiste.qtd, 10) + parseInt(qtd, 10);
        }
    } else {
        lista.push(produto);
    }

    document.getElementById("itemLista").value = "";
    document.getElementById("qtdProduto").value = "";
    document.getElementById("itemLista").focus();

    localStorage.setItem("lista", JSON.stringify(lista));

    montarLista();
}

function montarLista() {
    let tBody = document.querySelector("tbody");
    tBody.innerHTML = "";

    lista.forEach((produto, index) => {
        let linha = document.createElement("tr");
        let colunaNome = document.createElement("td");
        let colunaQtd = document.createElement("td");
        let colunaBotoes = document.createElement("td");

        colunaNome.innerHTML = produto.nome.toUpperCase();
        colunaQtd.innerHTML = produto.qtd;

        let botaoAdicionar = document.createElement("button");
        botaoAdicionar.innerHTML = "+";
        botaoAdicionar.addEventListener("click", function () {
            produto.qtd++;
            colunaQtd.innerHTML = produto.qtd;
            localStorage.setItem("lista", JSON.stringify(lista))
        });

        let botaoRemover = document.createElement("button");
        botaoRemover.innerHTML = "-";
        botaoRemover.addEventListener("click", function () {
            produto.qtd--;
            colunaQtd.innerHTML = produto.qtd;
            localStorage.setItem("lista", JSON.stringify(lista))

            if (produto.qtd === 0) {
                lista.splice(index, 1);
                localStorage.setItem("lista", JSON.stringify(lista));
                montarLista();
            }
        });

        colunaBotoes.appendChild(botaoAdicionar);
        colunaBotoes.appendChild(botaoRemover);

        linha.appendChild(colunaNome);
        linha.appendChild(colunaQtd);
        linha.appendChild(colunaBotoes);

        tBody.appendChild(linha);
    });

    document.querySelector("input[name='qtdProduto']").value = 1;

}

window.onload = function () {
    montarLista();   
};

function limparLista(){
    localStorage.removeItem("lista");
    lista = [];
    montarLista();
    document.getElementById("itemLista").focus();
} 

const toggleButton = document.getElementById("fullscreen-toggle");

toggleButton.addEventListener("click", function() {
  if (document.fullscreenElement) {
    document.exitFullscreen();
  } else {
    document.documentElement.requestFullscreen();
  }
});

if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('scripts/sw.js').then(function(registration) {
            console.log('Service Worker registrado com sucesso: ', registration.scope);
        }, function(err) {
            console.log('Service Worker falhou ao ser registrado: ', err);
        });
    });
}

