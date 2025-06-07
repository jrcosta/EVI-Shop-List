let store = {};

global.localStorage = {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => { store[key] = value; },
    removeItem: (key) => { delete store[key]; },
    clear: () => { store = {}; },
    key: (i) => Object.keys(store)[i] || null,
    get length() { return Object.keys(store).length; }
};

global.uuid = { v4: () => 'uuid-mock' };

global.$ = function() { return { keydown: function(){}, val: function(){ return ''; } }; };

function createElement() {
    return { style: {}, appendChild: function(){}, addEventListener: function(){}, innerHTML: '', value: '' };
}

const nomeInput = { value: '', focus: function(){}, addEventListener: function(){} };
const qtdInput = { value: '', focus: function(){}, addEventListener: function(){} };

global.document = {
    getElementById: function(id) {
        if (id === 'itemLista') return nomeInput;
        if (id === 'qtdProduto') return qtdInput;
        return createElement();
    },
    querySelector: function() { return createElement(); },
    createElement: createElement
};

global.window = { matchMedia: () => ({ matches: false }), addEventListener: function(){}, confirm: () => true };

const { Produto } = require('../scripts/script.js');

describe('Produto class', function() {
    it('cria objeto com propriedades corretas', function() {
        const p = new Produto('Feijao', 3, 10);
        expect(p.id).toBe('uuid-mock');
        expect(p.nome).toBe('Feijao');
        expect(p.qtd).toBe(3);
        expect(p.valorPago).toBe(10);
    });

    it('valorPago padrao e zero quando nao fornecido', function() {
        const p = new Produto('Arroz', 1);
        expect(p.valorPago).toBe(0);
    });
});
