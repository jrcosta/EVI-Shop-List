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

const { adicionarProduto, lista, setInputs } = require('../scripts/script.js');
setInputs(nomeInput, qtdInput);

describe('adicionarProduto', function() {
    beforeEach(function() {
        localStorage.clear();
        lista.splice(0, lista.length);
        nomeInput.value = '';
        qtdInput.value = '';
    });

    it('adiciona produto na lista e salva no localStorage', function() {
        nomeInput.value = 'Arroz';
        qtdInput.value = '2';

        adicionarProduto();

        const salva = JSON.parse(localStorage.getItem('lista'));
        expect(lista.length).toBe(1);
        expect(lista[0].nome).toBe('Arroz');
        expect(salva.length).toBe(1);
        expect(salva[0].nome).toBe('Arroz');
    });
});
