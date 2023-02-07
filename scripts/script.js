class Produto {
    constructor(nome, qtd, valorPago = 0) {
        this.id = uuid.v4();
        this.nome = nome;
        this.qtd = qtd;
        this.valorPago = valorPago;
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

    if (!nome || nome.trim().length === 0) {
        alert("Por favor, preencha o nome do produto.[P/R4F4Q@]");
        inputNome.value = "";
        inputNome.focus();
        return;
    } else if (/^\d+$/.test(nome)) {
        let confirmacao = window.confirm(`O nome ${nome} contém apenas números, deseja inserir dessa forma?`)
        if (!confirmacao) {
            inputNome.value = "";
            inputNome.focus();
            return;
        }
    } else if (!qtd || qtd <= 0) {
        alert("Por favor, preencha a quantidade do produto.");
        qtd = 1;
        inputQtd.value = qtd;
        inputQtd.focus();
        return;
    } else if (qtd.toString().length > 3) {
        alert("Quantidade máxima permitida é 999.");
        qtd = 1;
        inputQtd.value = qtd;
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

        colunaNome.style.position = "relative";
        colunaNome.style.paddingBottom = "5px";

        let spanInfo = document.createElement("span");
        spanInfo.innerHTML = "+info";
        spanInfo.style.fontSize = "10px";
        spanInfo.style.position = "absolute";
        spanInfo.style.right = "0";
        spanInfo.style.bottom = "0";
        spanInfo.style.color = "darkgreen";
        
        
        

        colunaNome.innerHTML = produto.nome.toUpperCase();
        colunaQtd.innerHTML = produto.qtd;

        let botaoAdicionar = document.createElement("button");
        botaoAdicionar.innerHTML = "+";
        botaoAdicionar.style.width = "34px";
        botaoAdicionar.style.display = "inline-block";
        botaoAdicionar.style.verticalAlign = "top";
        botaoAdicionar.addEventListener("click", function () {
            produto.qtd++;
            colunaQtd.innerHTML = produto.qtd;
            localStorage.setItem("lista", JSON.stringify(lista))
        });

        let botaoRemover = document.createElement("button");
        botaoRemover.innerHTML = "-";
        botaoRemover.style.width = "34px";
        botaoRemover.style.display = "inline-block";
        botaoRemover.style.verticalAlign = "top";
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

        let botaoDeletar = document.createElement("button");
        botaoDeletar.innerHTML = "DEL";
        botaoDeletar.style.display = "inline-block";
        botaoDeletar.style.verticalAlign = "top";
        botaoDeletar.style.width = "35px";
        botaoDeletar.style.marginBottom = "3px";
        botaoDeletar.style.fontSize = "12px";
        botaoDeletar.addEventListener("click", function () {
            lista.splice(index, 1);
            localStorage.setItem("lista", JSON.stringify(lista));
            montarLista();
        });

        colunaBotoes.appendChild(botaoAdicionar);
        colunaBotoes.appendChild(botaoRemover);
        colunaBotoes.appendChild(botaoDeletar);

        linha.appendChild(colunaNome);
        linha.appendChild(colunaQtd);
        linha.appendChild(colunaBotoes);
        colunaNome.appendChild(spanInfo);

        tBody.appendChild(linha);

        colunaNome.addEventListener("click", function () {
            let linhaInfo = linha.nextElementSibling;
            if (linhaInfo && linhaInfo.classList.contains("info-produto")) {
                linhaInfo.remove();
                return;
            }

            let novaLinha = document.createElement("tr");
            novaLinha.classList.add("info-produto");

            let colunaDescricao = document.createElement("td");
            colunaDescricao.style.fontSize = "12px"
            colunaDescricao.innerHTML = "Valor Pago";

            let colunaValor = document.createElement("td");
            colunaValor.colSpan = 2;
            let inputValor = document.createElement("input");
            inputValor.type = "text";

            let produtoStorage = JSON.parse(localStorage.getItem("produto_" + produto.id));
            let valorFormatado = new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL"
            }).format(produtoStorage ? produtoStorage.valorPago : 0);
            inputValor.value = valorFormatado;
            colunaValor.appendChild(inputValor);
            

            novaLinha.appendChild(colunaDescricao);
            novaLinha.appendChild(colunaValor);
            linha.after(novaLinha);

            inputValor.addEventListener("blur", function () {
                produto.valorPago = inputValor.value;
                localStorage.setItem("produto_" + produto.id, JSON.stringify(produto));
            });

            inputValor.addEventListener("click", function () {
                inputValor.select();
            });

            document.addEventListener("click", function (event) {
                if (event.target !== inputValor && event.target !== colunaNome) {
                    let linhaInfo = linha.nextElementSibling;
                    if (linhaInfo && linhaInfo.classList.contains("info-produto")) {
                        linhaInfo.remove();
                    }
                }
            });
            inputValor.addEventListener("keydown", function (event) {
                if (event.key === "Tab") {
                    let linhaInfo = linha.nextElementSibling;
                    if (linhaInfo && linhaInfo.classList.contains("info-produto")) {
                        linhaInfo.remove();
                    }
                }
            });
        
            
        });

        window.addEventListener("load", function () {
            let produtoSalvo = localStorage.getItem("produto_" + produto.id);
            if (produtoSalvo) {
                produto = JSON.parse(produtoSalvo);
            }
        });
        
        

        let isMobile = window.matchMedia("only screen and (max-width: 760px)").matches;

        if (isMobile) {
            botaoAdicionar.style.width = "45%";
            botaoRemover.style.width = "45%";
            botaoDeletar.style.width = "45%";
        } else {
            botaoAdicionar.style.width = "34px";
            botaoRemover.style.width = "34px";
            botaoDeletar.style.width = "34px";
        }


    });

    document.querySelector("input[name='qtdProduto']").value = 1;

}

window.onload = function () {
    montarLista();
};

function limparLista() {
    localStorage.removeItem("lista");
    lista = [];
    montarLista();
    document.getElementById("itemLista").focus();
}

if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
        navigator.serviceWorker.register('scripts/sw.js').then(function (registration) {
            console.log('Service Worker registrado com sucesso: ', registration.scope);
        }, function (err) {
            console.log('Service Worker falhou ao ser registrado: ', err);
        });
    });
}

let deferredPrompt;
let setupButton;

window.addEventListener('beforeinstallprompt', (e) => {
    // Prevenir que o Chrome 67 e anteriores mostrem automaticamente o prompt
    e.preventDefault();
    // Armazenar o evento para que possa ser disparado posteriormente.
    deferredPrompt = e;
    console.log("beforeinstallprompt fired");
    setupButton = document.getElementById("setup_button");
    if (setupButton) {
        // Mostrar o botão de configuração
        setupButton.style.display = "inline";
        setupButton.disabled = false;
        setupButton.addEventListener('click', installApp);
    }
});

function installApp() {
    // Mostrar o prompt
    deferredPrompt.prompt();
    setupButton.disabled = true;
    // Aguardar a resposta do usuário ao prompt
    deferredPrompt.userChoice
        .then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                console.log('PWA setup accepted');
                // Ocultar a interface do usuário que mostra nosso botão A2HS
                setupButton.style.display = 'none';
            } else {
                console.log('PWA setup rejected');
            }
            deferredPrompt = null;
        });
}

window.addEventListener('appinstalled', (evt) => {
    console.log("appinstalled fired", evt);
});


window.addEventListener('appinstalled', (evt) => {
    console.log("appinstalled fired", evt);
});

var maxLength = 17;
var field = $('#itemLista');
field.keydown(function (e) {
    if ($(this).val().length >= maxLength) e.preventDefault();
});

/*var maxLength = 15;
var field = $('#qtdProduto');
field.keydown( function(e)
{
    if ( $(this).val().length >= maxLength ) e.preventDefault();
});*/

