/* ===== Vitrio – lógica do aplicativo ===== */
'use strict';

/* ---------- 1. DADOS ---------- */

// Ingredientes padrão por categoria
const FONTE = {
  'Proteínas': 'ovo:🥚,frango:🍗,carne:🥩,carne moída:🍖,linguiça:🌭,presunto:🥓,atum:🐟,peixe:🐠,bacon:🥓,sardinha:🐟,camarão:🦐,salsicha:🌭,peito de peru:🦃',
  'Vegetais': 'tomate:🍅,cebola:🧅,alho:🧄,batata:🥔,cenoura:🥕,alface:🥬,brócolis:🥦,couve:🥬,abóbora:🎃,pepino:🥒,pimentão:🫑,milho:🌽,mandioca:🍠,berinjela:🍆,abobrinha:🥒,espinafre:🥬,repolho:🥬,beterraba:🍠,vagem:🥬,ervilha:🟢,cogumelo:🍄,chuchu:🥒,couve-flor:🥦,rúcula:🌿,quiabo:🥒,salsinha:🌿,cebolinha:🌿,coentro:🌿,gengibre:🫚,batata-doce:🍠',
  'Frutas': 'banana:🍌,limão:🍋,maçã:🍎,laranja:🍊,morango:🍓,abacate:🥑,abacaxi:🍍,mamão:🍈,uva:🍇,manga:🥭,maracujá:🍈,pera:🍐,melancia:🍉',
  'Laticínios': 'queijo:🧀,leite:🥛,manteiga:🧈,creme de leite:🥛,leite condensado:🥫,iogurte:🥣,requeijão:🧀,mussarela:🧀,ricota:🧀,parmesão:🧀,nata:🥛',
  'Grãos e massas': 'arroz:🍚,feijão:🫘,macarrão:🍝,aveia:🌾,lentilha:🫘,grão-de-bico:🧆,pão:🍞,tapioca:🫓,fubá:🌽,cuscuz:🌽,farinha de mandioca:🌾,granola:🥣,massa de lasanha:🍝',
  'Temperos e básicos': 'sal:🧂,óleo:🫗,azeite:🫒,açúcar:🍬,orégano:🌿,pimenta:🌶️,vinagre:🍶,canela:🍂,cominho:🌿,colorau:🌶️,louro:🍃,molho de soja:🍶,mostarda:🌭,extrato de tomate:🍅,noz-moscada:🌰',
  'Outros': 'farinha:🌾,fermento:🥄,chocolate em pó:🍫,mel:🍯,maionese:🥫,molho de tomate:🥫,amido de milho:🌽,coco ralado:🥥,amendoim:🥜,castanha:🌰,bicarbonato:🧂,gelatina:🍮,uva-passa:🍇'
};
// Monta as listas de ingredientes e o mapa de emojis
const CATEGORIAS = {}, EMOJI = {};
for (const [cat, texto] of Object.entries(FONTE)) {
  CATEGORIAS[cat] = texto.split(',').map((p) => { const [nome, e] = p.split(':'); EMOJI[nome] = e; return nome; });
}
const emoji = (i) => EMOJI[i] || '🍽️';

// Receitas (ingredientes separados por vírgula, passos por "|")
const RECEITAS = [
  r(1, 'Omelete de tomate', 'Café da manhã', 15, 'Fácil', 2, 4.8, '🍳', 'ovo,tomate,queijo,sal', 'Bata os ovos com uma pitada de sal.|Corte o tomate em cubos pequenos.|Misture o tomate aos ovos.|Aqueça uma frigideira untada.|Despeje a mistura e cubra com o queijo.|Cozinhe até dourar, dobre ao meio e sirva.'),
  r(2, 'Arroz com ovo frito', 'Almoço', 20, 'Fácil', 2, 4.5, '🍚', 'arroz,ovo,óleo,sal,alho', 'Doure o alho picado em um fio de óleo.|Junte o arroz lavado e refogue por 1 minuto.|Cubra com água, tempere com sal e cozinhe até secar.|Frite os ovos em outra frigideira.|Sirva o arroz com o ovo por cima.'),
  r(3, 'Arroz e feijão', 'Almoço', 40, 'Fácil', 4, 4.7, '🫘', 'arroz,feijão,cebola,alho,óleo,sal', 'Cozinhe o feijão (de molho ou na pressão) até ficar macio.|Refogue cebola e alho no óleo.|Junte o feijão cozido e deixe apurar o caldo.|Prepare o arroz refogado com alho e sal.|Sirva o arroz com o feijão.'),
  r(4, 'Macarrão ao molho de tomate', 'Jantar', 30, 'Fácil', 3, 4.6, '🍝', 'macarrão,tomate,cebola,alho,óleo,sal', 'Cozinhe o macarrão em água com sal até ficar al dente.|Refogue cebola e alho no óleo.|Junte o tomate picado e cozinhe por 15 minutos.|Tempere com sal e amasse o tomate.|Misture o molho ao macarrão e sirva.'),
  r(5, 'Frango assado com batatas', 'Jantar', 90, 'Difícil', 4, 4.9, '🍗', 'frango,batata,cebola,alho,sal,óleo', 'Tempere o frango com alho, sal e um fio de óleo.|Deixe descansar por 30 minutos.|Corte batatas e cebola em pedaços grandes.|Arrume tudo em uma assadeira.|Asse a 200 °C por cerca de 1 hora, virando uma vez.|Deixe descansar 10 minutos antes de servir.'),
  r(6, 'Salada de atum', 'Almoço', 10, 'Fácil', 2, 4.3, '🥗', 'atum,alface,tomate,cebola,sal', 'Lave e rasgue a alface.|Corte o tomate e a cebola em fatias finas.|Escorra o atum.|Monte a salada e tempere com sal.'),
  r(7, 'Purê de batata', 'Jantar', 30, 'Fácil', 4, 4.7, '🥔', 'batata,manteiga,leite,sal', 'Descasque e corte as batatas.|Cozinhe em água com sal até ficarem macias.|Escorra e amasse ainda quentes.|Junte a manteiga e o leite morno aos poucos.|Misture até ficar cremoso.'),
  r(8, 'Panqueca simples', 'Café da manhã', 25, 'Fácil', 3, 4.6, '🥞', 'farinha,ovo,leite,sal,óleo', 'Bata ovos, leite, farinha e sal até ficar sem grumos.|Aqueça uma frigideira untada com óleo.|Despeje uma concha de massa e espalhe.|Doure dos dois lados.|Repita com o restante e sirva.'),
  r(9, 'Bolo de cenoura', 'Sobremesa', 60, 'Médio', 8, 4.9, '🥕', 'cenoura,ovo,farinha,açúcar,óleo,fermento', 'Bata no liquidificador a cenoura, os ovos e o óleo.|Misture em uma tigela com o açúcar e a farinha.|Acrescente o fermento e mexa delicadamente.|Despeje em forma untada.|Asse a 180 °C por cerca de 40 minutos.|Espere esfriar para desenformar.'),
  r(10, 'Sopa de legumes', 'Jantar', 40, 'Fácil', 4, 4.4, '🍲', 'batata,cenoura,cebola,alho,sal,óleo', 'Refogue cebola e alho no óleo.|Junte batata e cenoura em cubos.|Cubra com água e tempere com sal.|Cozinhe até os legumes ficarem macios.|Bata uma parte no liquidificador para engrossar, se quiser.'),
  r(11, 'Macarrão com queijo', 'Jantar', 25, 'Fácil', 3, 4.7, '🧀', 'macarrão,queijo,leite,manteiga,sal', 'Cozinhe o macarrão e escorra.|Derreta a manteiga em uma panela.|Junte o leite e o queijo ralado, mexendo até derreter.|Tempere com sal.|Misture o macarrão ao molho e sirva.'),
  r(12, 'Batata frita', 'Lanche', 30, 'Fácil', 2, 4.8, '🍟', 'batata,óleo,sal', 'Corte as batatas em palitos.|Lave e seque bem.|Frite em óleo quente até dourar.|Escorra em papel toalha e tempere com sal.'),
  r(13, 'Tortilha de batata', 'Almoço', 35, 'Médio', 3, 4.6, '🍳', 'batata,ovo,cebola,óleo,sal', 'Fatie batata e cebola finamente.|Frite em óleo até ficarem macias e escorra.|Bata os ovos com sal e misture à batata.|Cozinhe em frigideira em fogo baixo até firmar.|Vire com ajuda de um prato e doure o outro lado.'),
  r(14, 'Carne acebolada', 'Almoço', 30, 'Fácil', 3, 4.5, '🥩', 'carne,cebola,alho,óleo,sal', 'Corte a carne em tiras e tempere com alho e sal.|Doure em frigideira bem quente com óleo.|Fatie a cebola em rodelas.|Junte a cebola e cozinhe até murchar.|Sirva quente.'),
  r(15, 'Frango ensopado', 'Jantar', 50, 'Médio', 4, 4.6, '🥘', 'frango,batata,cenoura,cebola,alho,sal', 'Tempere o frango com alho e sal.|Doure o frango em panela com a cebola.|Junte batata e cenoura em pedaços.|Cubra com água e cozinhe em fogo médio por 30 minutos.|Ajuste o sal e sirva com o caldo.'),
  r(16, 'Arroz de forno com queijo', 'Jantar', 40, 'Médio', 4, 4.5, '🍽️', 'arroz,queijo,tomate,manteiga,sal', 'Cozinhe o arroz com sal.|Misture o arroz com a manteiga e o tomate picado.|Coloque em um refratário e cubra com queijo.|Leve ao forno a 200 °C até gratinar.'),
  r(17, 'Banana caramelizada', 'Sobremesa', 10, 'Fácil', 2, 4.7, '🍌', 'banana,açúcar,manteiga', 'Corte as bananas ao meio.|Derreta a manteiga em fogo médio.|Junte o açúcar e as bananas.|Cozinhe 2 minutos de cada lado até caramelizar.'),
  r(18, 'Limonada', 'Lanche', 5, 'Fácil', 4, 4.4, '🍋', 'limão,açúcar', 'Esprema os limões.|Misture o suco com o açúcar e 1 litro de água.|Mexa até dissolver e sirva gelada.'),
  r(19, 'Bolinho de arroz', 'Lanche', 30, 'Médio', 4, 4.6, '🍘', 'arroz,ovo,queijo,farinha,óleo,sal', 'Misture o arroz cozido, o ovo, o queijo picado e o sal.|Acrescente farinha até a massa soltar das mãos.|Modele bolinhos.|Frite em óleo quente até dourar.|Escorra e sirva.'),
  r(20, 'Salada de batata com ovo', 'Almoço', 30, 'Fácil', 3, 4.5, '🥔', 'batata,ovo,cebola,alface,sal', 'Cozinhe batatas e ovos separadamente.|Corte as batatas em cubos e os ovos em pedaços.|Pique a cebola bem fina.|Misture tudo sobre as folhas de alface.|Tempere com sal.'),
  r(21, 'Vitamina de banana', 'Café da manhã', 5, 'Fácil', 2, 4.6, '🥤', 'banana,leite,açúcar', 'Corte a banana em pedaços.|Bata no liquidificador com o leite e o açúcar.|Sirva em seguida.'),
  r(22, 'Ovos mexidos com presunto', 'Café da manhã', 10, 'Fácil', 1, 4.5, '🍳', 'ovo,presunto,manteiga,sal', 'Pique o presunto.|Derreta a manteiga na frigideira.|Junte os ovos batidos com sal e o presunto.|Mexa em fogo baixo até firmar.'),
  r(23, 'Panqueca de banana com aveia', 'Café da manhã', 15, 'Fácil', 2, 4.7, '🥞', 'banana,ovo,aveia', 'Amasse a banana.|Misture o ovo e a aveia.|Doure colheradas da massa em frigideira antiaderente.|Vire quando dourar e sirva.'),
  r(24, 'Vitamina de morango', 'Café da manhã', 5, 'Fácil', 2, 4.6, '🍓', 'morango,leite,açúcar', 'Lave os morangos.|Bata com leite e açúcar no liquidificador.|Sirva gelada.'),
  r(25, 'Queijo quente', 'Lanche', 10, 'Fácil', 1, 4.8, '🥪', 'pão,queijo,manteiga', 'Passe manteiga por fora do pão.|Recheie com queijo.|Doure dos dois lados na frigideira até derreter.'),
  r(26, 'Sanduíche de atum', 'Lanche', 10, 'Fácil', 2, 4.4, '🥪', 'pão,atum,maionese,tomate,alface', 'Misture o atum escorrido com a maionese.|Lave e fatie tomate e alface.|Monte o sanduíche e sirva.'),
  r(27, 'Strogonoff de frango', 'Jantar', 40, 'Médio', 4, 4.8, '🍛', 'frango,creme de leite,cebola,molho de tomate,óleo,sal', 'Corte o frango em cubos e tempere com sal.|Doure o frango com a cebola picada no óleo.|Junte o molho de tomate e cozinhe por 10 minutos.|Desligue e misture o creme de leite.'),
  r(28, 'Macarrão à bolonhesa', 'Jantar', 35, 'Médio', 4, 4.7, '🍝', 'macarrão,carne moída,molho de tomate,cebola,alho,sal', 'Refogue cebola e alho.|Junte a carne moída e doure.|Acrescente o molho de tomate e o sal e cozinhe por 15 minutos.|Cozinhe o macarrão e sirva com o molho.'),
  r(29, 'Brigadeiro', 'Sobremesa', 20, 'Fácil', 10, 4.9, '🍫', 'leite condensado,chocolate em pó,manteiga', 'Misture tudo em uma panela.|Mexa em fogo baixo até desgrudar do fundo.|Deixe esfriar e enrole bolinhas.'),
  r(30, 'Pudim de leite', 'Sobremesa', 75, 'Médio', 8, 4.8, '🍮', 'leite condensado,leite,ovo,açúcar', 'Faça uma calda dourada com o açúcar e cubra a forma.|Bata no liquidificador o leite condensado, o leite e os ovos.|Despeje na forma e asse em banho-maria a 180 °C por 50 minutos.|Esfrie e leve à geladeira antes de desenformar.'),
  r(31, 'Salada de frutas', 'Sobremesa', 10, 'Fácil', 3, 4.5, '🍎', 'maçã,banana,laranja,mel', 'Corte maçã e banana em cubos.|Descasque a laranja e corte em pedaços.|Misture tudo com o mel e sirva gelada.'),
  r(32, 'Sopa de abóbora', 'Jantar', 35, 'Fácil', 4, 4.6, '🎃', 'abóbora,cebola,alho,azeite,sal', 'Refogue cebola e alho no azeite.|Junte a abóbora em cubos e cubra com água.|Cozinhe até amolecer e bata no liquidificador.|Ajuste o sal e sirva.'),
  r(33, 'Brócolis refogado', 'Almoço', 15, 'Fácil', 2, 4.3, '🥦', 'brócolis,alho,azeite,sal', 'Cozinhe o brócolis por 3 minutos e escorra.|Doure o alho no azeite.|Junte o brócolis e o sal e refogue por 2 minutos.'),
  r(34, 'Couve refogada', 'Almoço', 10, 'Fácil', 3, 4.5, '🥬', 'couve,alho,azeite,sal', 'Corte a couve em tiras finas.|Doure o alho no azeite.|Junte a couve e o sal e refogue por 3 minutos.'),
  r(35, 'Mandioca frita', 'Lanche', 40, 'Fácil', 3, 4.7, '🍟', 'mandioca,óleo,sal', 'Cozinhe a mandioca até ficar macia e retire o miolo duro.|Corte em palitos e seque bem.|Frite em óleo quente até dourar e tempere com sal.'),
  r(36, 'Feijão com linguiça', 'Almoço', 60, 'Médio', 5, 4.7, '🫘', 'feijão,linguiça,cebola,alho,óleo,sal', 'Cozinhe o feijão até ficar macio.|Frite a linguiça fatiada e retire.|Refogue cebola e alho na gordura.|Junte o feijão e a linguiça e deixe apurar por 10 minutos.'),
  r(37, 'Peixe assado com limão', 'Jantar', 35, 'Médio', 2, 4.6, '🐟', 'peixe,limão,azeite,alho,sal', 'Tempere o peixe com sal, alho e suco de limão.|Regue com azeite e coloque em uma assadeira.|Asse a 200 °C por cerca de 25 minutos.'),
  r(38, 'Guacamole', 'Lanche', 10, 'Fácil', 4, 4.6, '🥑', 'abacate,limão,tomate,cebola,sal', 'Amasse o abacate com o suco de limão.|Pique tomate e cebola bem pequenos.|Misture tudo e tempere com sal.'),
  r(39, 'Sopa de lentilha', 'Jantar', 45, 'Médio', 4, 4.5, '🍲', 'lentilha,cenoura,cebola,alho,azeite,sal', 'Refogue cebola e alho no azeite.|Junte a cenoura picada e a lentilha lavada.|Cubra com água e cozinhe por 30 minutos.|Tempere com sal e sirva.'),
  r(40, 'Grão-de-bico temperado', 'Almoço', 25, 'Fácil', 3, 4.4, '🧆', 'grão-de-bico,cebola,tomate,azeite,orégano', 'Refogue a cebola no azeite.|Junte o tomate picado e cozinhe 5 minutos.|Acrescente o grão-de-bico cozido e o orégano.|Cozinhe por 10 minutos e sirva.'),
  r(41, 'Pizza de frigideira', 'Jantar', 35, 'Médio', 2, 4.7, '🍕', 'farinha,fermento,molho de tomate,queijo,orégano', 'Misture farinha, fermento e água até formar uma massa.|Abra a massa e doure de um lado na frigideira.|Vire, cubra com molho, queijo e orégano.|Tampe até o queijo derreter.'),
  r(42, 'Mingau de aveia', 'Café da manhã', 10, 'Fácil', 1, 4.4, '🥣', 'aveia,leite,mel', 'Cozinhe a aveia no leite, mexendo.|Quando engrossar, desligue.|Adoce com mel e sirva.'),
  r(43, 'Tapioca com queijo', 'Café da manhã', 5, 'Fácil', 1, 4.6, '🫓', 'tapioca,queijo', 'Espalhe a tapioca em frigideira quente.|Quando firmar, coloque o queijo.|Dobre ao meio e sirva.'),
  r(44, 'Bruschetta de tomate', 'Lanche', 15, 'Fácil', 3, 4.5, '🍅', 'pão,tomate,alho,azeite,orégano', 'Torre as fatias de pão.|Esfregue o alho no pão.|Cubra com tomate picado, azeite e orégano.')
];
function r(id, nome, categoria, tempo, dificuldade, porcoes, avaliacao, emoji, ing, passos) {
  return { id, nome, categoria, tempo, dificuldade, porcoes, avaliacao, emoji, ingredientes: ing.split(','), modoPreparo: passos.split('|') };
}

// Receitas em variações: mesma técnica, ingredientes diferentes.
// n = nome, c = categoria, t = tempo, d = dificuldade, p = porções, base = ingredientes fixos,
// itens = variações ("a+b" usa dois ingredientes; "chave=Nome" muda o nome exibido), passos separados por "|"
const FAMILIAS = [
  { n: 'Omelete de {x}', c: 'Café da manhã', t: 10, d: 'Fácil', p: 1, e: '🍳', base: 'ovo,sal', itens: ['queijo', 'presunto', 'cebola', 'brócolis', 'pimentão', 'milho', 'espinafre', 'cogumelo'],
    passos: 'Bata os ovos com uma pitada de sal.|Pique {x} em pedaços pequenos.|Aqueça uma frigideira untada e despeje os ovos.|Distribua {x} por cima e dobre ao meio.|Cozinhe até firmar e sirva.' },
  { n: 'Vitamina de {x}', c: 'Café da manhã', t: 5, d: 'Fácil', p: 2, e: '🥤', base: 'leite,açúcar', itens: ['mamão', 'abacate', 'manga', 'maçã'],
    passos: 'Descasque e corte {x} em pedaços.|Bata no liquidificador com leite e açúcar.|Sirva gelada.' },
  { n: 'Suco de {x}', c: 'Lanche', t: 5, d: 'Fácil', p: 3, e: '🧃', base: 'açúcar', itens: ['abacaxi', 'maracujá', 'melancia', 'uva', 'laranja'],
    passos: 'Lave e prepare {x}.|Bata com 1 copo de água e açúcar a gosto.|Coe, se preferir, e sirva com gelo.' },
  { n: 'Panqueca de {x}', c: 'Jantar', t: 30, d: 'Médio', p: 3, e: '🥞', base: 'farinha,ovo,leite,sal', itens: ['queijo', 'presunto', 'carne moída', 'frango', 'espinafre'],
    passos: 'Bata ovo, leite, farinha e sal até ficar liso.|Doure discos finos de massa na frigideira.|Recheie com {x}, enrole e sirva.' },
  { n: 'Cuscuz com {x}', c: 'Café da manhã', t: 15, d: 'Fácil', p: 2, e: '🌽', base: 'cuscuz,sal,manteiga', itens: ['ovo', 'queijo', 'linguiça'],
    passos: 'Hidrate o cuscuz com água e sal.|Cozinhe no vapor por 10 minutos.|Sirva com {x} e manteiga.' },
  { n: 'Iogurte com {x} e {y}', c: 'Café da manhã', t: 5, d: 'Fácil', p: 1, e: '🥣', base: 'iogurte', itens: ['granola+morango', 'granola+banana', 'aveia+mel'],
    passos: 'Coloque o iogurte em uma tigela.|Acrescente {x} e {y}.|Sirva em seguida.' },
  { n: 'Sanduíche de {x} e {y}', c: 'Lanche', t: 10, d: 'Fácil', p: 1, e: '🥪', base: 'pão', itens: ['queijo+presunto', 'ovo+tomate', 'frango+alface', 'mussarela+tomate', 'ricota+tomate', 'peito de peru+alface'],
    passos: 'Corte o pão ao meio.|Monte com {x} e {y}.|Se quiser, aqueça na frigideira por 2 minutos de cada lado.' },
  { n: 'Bolinho de {x}', c: 'Lanche', t: 30, d: 'Médio', p: 4, e: '🧆', base: 'ovo,farinha,sal,óleo', itens: ['batata', 'milho', 'abobrinha', 'mandioca', 'frango'],
    passos: 'Cozinhe e amasse {x}.|Misture com ovo, farinha e sal até dar liga.|Modele bolinhos e frite em óleo quente até dourar.' },
  { n: 'Torrada com {x}', c: 'Lanche', t: 5, d: 'Fácil', p: 1, e: '🍞', base: 'pão', itens: ['abacate', 'requeijão', 'ricota'],
    passos: 'Toste as fatias de pão.|Cubra com {x}.|Sirva em seguida.' },
  { n: 'Salada de {x} e {y}', c: 'Almoço', t: 10, d: 'Fácil', p: 2, e: '🥗', base: 'sal,azeite', itens: ['tomate+pepino', 'alface+tomate', 'cenoura+beterraba', 'rúcula+tomate', 'repolho+cenoura', 'vagem+batata', 'atum+milho', 'frango+milho'],
    passos: 'Lave bem {x} e {y}.|Corte em pedaços pequenos.|Misture em uma tigela.|Tempere com sal e azeite e sirva.' },
  { n: 'Refogado de {x}', c: 'Almoço', t: 15, d: 'Fácil', p: 2, e: '🥘', base: 'alho,azeite,sal', itens: ['abobrinha', 'vagem', 'repolho', 'couve-flor', 'chuchu', 'cogumelo', 'quiabo', 'espinafre'],
    passos: 'Corte {x} em pedaços.|Doure o alho no azeite.|Junte {x} e o sal e refogue até ficar macio.' },
  { n: 'Arroz com {x}', c: 'Almoço', t: 30, d: 'Fácil', p: 4, e: '🍚', base: 'arroz,alho,óleo,sal', itens: ['cenoura', 'ervilha', 'milho', 'brócolis', 'linguiça', 'bacon', 'cogumelo', 'camarão'],
    passos: 'Doure o alho no óleo.|Junte {x} picado e refogue.|Acrescente o arroz lavado, sal e água quente.|Cozinhe até secar.' },
  { n: 'Carne moída com {x}', c: 'Almoço', t: 30, d: 'Fácil', p: 3, e: '🍖', base: 'carne moída,cebola,alho,sal,óleo', itens: ['batata', 'cenoura', 'ervilha', 'abobrinha', 'chuchu', 'vagem'],
    passos: 'Refogue cebola e alho no óleo.|Junte a carne moída e doure bem.|Acrescente {x}, sal e um pouco de água.|Cozinhe até ficar macio.' },
  { n: 'Sopa de {x}', c: 'Jantar', t: 35, d: 'Fácil', p: 4, e: '🍲', base: 'cebola,alho,sal,azeite', itens: ['cenoura', 'mandioca', 'couve-flor', 'ervilha', 'chuchu', 'beterraba', 'batata-doce', 'espinafre'],
    passos: 'Refogue cebola e alho no azeite.|Junte {x} picado e cubra com água.|Cozinhe até ficar macio.|Bata no liquidificador, ajuste o sal e sirva.' },
  { n: 'Frango com {x}', c: 'Jantar', t: 40, d: 'Médio', p: 3, e: '🍗', base: 'frango,sal,alho,óleo', itens: ['limão', 'cogumelo', 'milho', 'ervilha', 'abóbora', 'pimentão'],
    passos: 'Corte o frango em cubos e tempere com alho e sal.|Doure no óleo quente.|Junte {x} e um pouco de água.|Cozinhe até tudo ficar macio e sirva.' },
  { n: 'Macarrão com {x}', c: 'Jantar', t: 25, d: 'Fácil', p: 3, e: '🍝', base: 'macarrão,sal,azeite', itens: ['alho', 'brócolis', 'atum', 'cogumelo', 'abobrinha', 'camarão', 'frango', 'linguiça'],
    passos: 'Cozinhe o macarrão em água com sal e escorra.|Refogue {x} no azeite até cozinhar.|Misture ao macarrão e sirva quente.' },
  { n: 'Polenta com {x}', c: 'Jantar', t: 30, d: 'Fácil', p: 3, e: '🌽', base: 'fubá,sal,manteiga', itens: ['queijo', 'linguiça', 'carne moída'],
    passos: 'Cozinhe o fubá em água com sal, mexendo até engrossar.|Junte a manteiga.|Sirva com {x}.' },
  { n: 'Bolo de {x}', c: 'Sobremesa', t: 60, d: 'Médio', p: 8, e: '🍰', base: 'farinha,ovo,açúcar,óleo,fermento', itens: ['banana', 'laranja', 'limão', 'maçã', 'fubá', 'chocolate em pó=chocolate'],
    passos: 'Bata no liquidificador {x}, os ovos, o óleo e o açúcar.|Misture à farinha e acrescente o fermento.|Despeje em forma untada.|Asse a 180 °C por cerca de 40 minutos.' },
  { n: 'Mousse de {x}', c: 'Sobremesa', t: 15, d: 'Fácil', p: 4, e: '🍮', base: 'leite condensado,creme de leite', itens: ['maracujá', 'limão', 'morango', 'chocolate em pó=chocolate'],
    passos: 'Bata {x}, leite condensado e creme de leite no liquidificador.|Distribua em taças.|Leve à geladeira por 3 horas.' }
];
(function gerarVariacoes() {
  let id = RECEITAS.length + 1;
  FAMILIAS.forEach((f) => f.itens.forEach((it) => {
    const par = it.split('+').map((p) => p.split('='));
    const chaves = par.map((p) => p[0]);
    const [x, y] = par.map((p) => p[1] || p[0]);
    const sub = (s) => s.replace(/\{x\}/g, x).replace(/\{y\}/g, y || '');
    RECEITAS.push({
      id, nome: sub(f.n), categoria: f.c, tempo: f.t, dificuldade: f.d, porcoes: f.p,
      avaliacao: +(4.1 + ((id * 37) % 9) / 10).toFixed(1), emoji: f.e,
      ingredientes: [...new Set([...f.base.split(','), ...chaves])], modoPreparo: sub(f.passos).split('|')
    });
    id++;
  }));
})();

// Cores de fundo suaves para as "fotos" dos pratos
const FUNDOS = ['#fde8d8', '#e6f0e0', '#fdf1cf', '#f3e6d6', '#e3efe9'];

// Trocas seguras: se falta o ingrediente da esquerda, um da lista serve no lugar
const TROCAS = {
  'manteiga': ['óleo', 'azeite'], 'óleo': ['azeite'], 'azeite': ['óleo'], 'açúcar': ['mel'], 'mel': ['açúcar'],
  'limão': ['vinagre'], 'queijo': ['mussarela', 'requeijão', 'ricota', 'parmesão'], 'mussarela': ['queijo'],
  'creme de leite': ['requeijão', 'nata'], 'cebola': ['cebolinha'], 'molho de tomate': ['extrato de tomate', 'tomate'],
  'tomate': ['molho de tomate'], 'presunto': ['peito de peru'], 'peito de peru': ['presunto'], 'frango': ['peito de peru'],
  'alface': ['rúcula', 'couve', 'espinafre'], 'rúcula': ['alface'], 'couve': ['espinafre'], 'espinafre': ['couve'],
  'batata': ['batata-doce', 'mandioca'], 'mandioca': ['batata'], 'salsinha': ['cebolinha', 'coentro'], 'coentro': ['salsinha'],
  'leite': ['iogurte'], 'farinha': ['amido de milho'], 'pão': ['tapioca'], 'macarrão': ['massa de lasanha']
};

/* ---------- 2. ESTADO + localStorage ---------- */

const store = {
  get(k, def) { try { return JSON.parse(localStorage.getItem('vitrio_' + k)) ?? def; } catch { return def; } },
  set(k, v) { try { localStorage.setItem('vitrio_' + k, JSON.stringify(v)); } catch { /* armazenamento indisponível */ } }
};
const state = {
  selecionados: store.get('selecionados', []),
  personalizados: store.get('personalizados', []),
  favoritos: store.get('favoritos', []),
  mostrarTodas: store.get('mostrarTodas', false),
  view: 'inicio',
  fechadas: [], // categorias recolhidas na tela de ingredientes
  minhas: store.get('minhas', []), // receitas criadas pelo usuário
  proxId: store.get('proxId', 1000),
  validades: store.get('validades', {}), // ingrediente -> data de validade (meia-noite)
  trocas: store.get('trocas', true),
  salvos: store.get('salvos', 0),
  resgate: false
};

/* ---------- 3. UTILITÁRIOS ---------- */

const $ = (s) => document.querySelector(s);
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
const salvar = () => { store.set('selecionados', state.selecionados); store.set('personalizados', state.personalizados); store.set('favoritos', state.favoritos); store.set('mostrarTodas', state.mostrarTodas); store.set('minhas', state.minhas); store.set('proxId', state.proxId); store.set('validades', state.validades); store.set('trocas', state.trocas); store.set('salvos', state.salvos); };
const plural = (n, um, varios) => `${n} ${n === 1 ? um : varios}`;

/* ---------- 4. COMPATIBILIDADE ---------- */

function compatibilidade(receita) {
  const tem = [], trocas = [], falta = [];
  receita.ingredientes.forEach((i) => {
    if (state.selecionados.includes(i)) return tem.push(i);
    const por = state.trocas && (TROCAS[i] || []).find((a) => state.selecionados.includes(a) && !receita.ingredientes.includes(a));
    if (por) trocas.push({ de: i, por }); else falta.push(i);
  });
  const pct = Math.round(((tem.length + trocas.length) / receita.ingredientes.length) * 100);
  let tier;
  if (pct === 100) tier = { id: 'ok', icon: '🟢', titulo: 'Você pode fazer agora' };
  else if (pct >= 75) tier = { id: 'warn', icon: '🟡', titulo: 'Falta pouco' };
  else if (pct >= 50) tier = { id: 'mid', icon: '🟠', titulo: 'Faltam alguns ingredientes' };
  else tier = { id: 'low', icon: '⚪', titulo: 'Outras receitas' };
  const urgentes = [...tem, ...trocas.map((t) => t.por)].filter((i) => { const d = diasPara(i); return d !== null && d <= 3; });
  return { tem, trocas, falta, pct, tier, urgentes };
}

/* ---------- 5. NAVEGAÇÃO ---------- */

function ir(view) {
  state.view = view;
  document.querySelectorAll('.view').forEach((v) => (v.hidden = v.id !== 'view-' + view));
  document.querySelectorAll('.nav button').forEach((b) => { const on = b.dataset.go === view; b.classList.toggle('active', on); if (on) b.setAttribute('aria-current', 'page'); else b.removeAttribute('aria-current'); });
  if (view === 'ingredientes') renderIngredientes();
  if (view === 'receitas') renderReceitas();
  if (view === 'favoritos') renderFavoritos();
  if (view === 'criar') renderCriar();
  window.scrollTo({ top: 0 });
}

/* ---------- 6. INGREDIENTES ---------- */

function todasCategorias() {
  const cats = {};
  for (const [c, lista] of Object.entries(CATEGORIAS)) cats[c] = [...lista];
  cats['Outros'] = [...cats['Outros'], ...state.personalizados];
  return cats;
}

function renderIngredientes() {
  const n = state.selecionados.length;

  // Resumo no topo + barra fixa de ação
  $('#picked-chips').innerHTML = n
    ? state.selecionados.map((i) => `<button class="chip chosen" data-remove="${esc(i)}" aria-label="Remover ${esc(i)}">${emoji(i)} ${esc(cap(i))}${urgTag(i)}<span aria-hidden="true">×</span></button>`).join('')
    : '<span class="muted" style="margin:0">Nenhum ingrediente ainda. Toque nos ingredientes abaixo.</span>';
  $('#clear-btn').hidden = n === 0;
  const pode = RECEITAS.filter((x) => compatibilidade(x).pct >= 50).length;
  $('#picked-count').textContent = plural(n, 'ingrediente selecionado', 'ingredientes selecionados');
  $('#find-btn').textContent = pode ? `Ver ${plural(pode, 'receita', 'receitas')}` : 'Encontrar receitas';
  $('#cta-bar').hidden = n === 0;
  renderValidade();

  // Categorias recolhíveis (abertas durante a busca)
  const q = norm($('#search').value);
  let html = '', achados = 0;
  for (const [cat, lista] of Object.entries(todasCategorias())) {
    const vis = lista.filter((i) => norm(i).includes(q));
    if (!vis.length) continue;
    achados += vis.length;
    const marcados = lista.filter((i) => state.selecionados.includes(i)).length;
    const aberta = q || !state.fechadas.includes(cat);
    html += `<details class="cat" data-cat="${cat}" ${aberta ? 'open' : ''}><summary><span>${cat}</span><small>${marcados ? plural(marcados, 'marcado', 'marcados') : lista.length + ' itens'}</small></summary><div class="chips">` +
      vis.map((i) => { const on = state.selecionados.includes(i); return `<button class="chip ${on ? 'on' : ''}" data-toggle="${esc(i)}" aria-pressed="${on}">${emoji(i)} ${esc(cap(i))}</button>`; }).join('') +
      '</div></details>';
  }
  $('#categories').innerHTML = html || '<div class="empty"><h3>Ingrediente não encontrado</h3><p>Use “+ Adicionar ingrediente” para incluí-lo.</p></div>';
  $('#live').textContent = q ? plural(achados, 'ingrediente encontrado', 'ingredientes encontrados') : '';
}

function alternarIngrediente(nome) {
  const i = state.selecionados.indexOf(nome);
  if (i >= 0) state.selecionados.splice(i, 1); else state.selecionados.push(nome);
  salvar();
  renderIngredientes();
  const b = document.querySelector(`[data-toggle="${CSS.escape(nome)}"]`);
  if (b) b.focus();
}

function adicionarPersonalizado() {
  const input = $('#add-input');
  const nome = input.value.trim().toLowerCase();
  if (!nome) return;
  const existe = Object.values(CATEGORIAS).flat().includes(nome) || state.personalizados.includes(nome);
  if (!existe) state.personalizados.push(nome);
  if (!state.selecionados.includes(nome)) state.selecionados.push(nome);
  input.value = '';
  $('#search').value = '';
  salvar();
  renderIngredientes();
}

/* ---------- 7. RECEITAS ---------- */

function receitasFiltradas() {
  const tempo = +$('#f-tempo').value, dif = $('#f-dif').value, minComp = +$('#f-comp').value, cat = $('#f-cat').value, q = norm($('#f-q').value);
  return RECEITAS
    .map((rec) => ({ rec, c: compatibilidade(rec) }))
    .filter(({ rec, c }) =>
      (state.mostrarTodas || c.pct >= 50 || !state.selecionados.length) &&
      (!tempo || rec.tempo <= tempo) &&
      (!dif || rec.dificuldade === dif) &&
      (!cat || rec.categoria === cat) &&
      (!minComp || c.pct >= minComp) &&
      (!state.resgate || c.urgentes.length) &&
      (!q || norm(rec.nome).includes(q)))
    .sort((a, b) => state.resgate ? b.c.urgentes.length - a.c.urgentes.length || b.c.pct - a.c.pct : b.c.pct - a.c.pct || b.rec.avaliacao - a.rec.avaliacao);
}

function cardReceita({ rec, c }) {
  const fav = state.favoritos.includes(rec.id);
  const tem = state.selecionados.length > 0;
  const swaps = c.trocas.map((t) => `<span class="swap">🔁 ${esc(cap(t.de))} → ${esc(t.por)}</span>`).join('');
  const falta = (c.falta.length
    ? `<div class="missing"><b>Falta:</b> ${c.falta.map((i) => `<span>${emoji(i)} ${esc(cap(i))}</span>`).join('')}</div>`
    : `<div class="missing ok">✓ ${c.trocas.length ? 'Dá para fazer com trocas' : 'Você tem tudo!'}</div>`)
    + (swaps ? `<div class="missing">${swaps}</div>` : '')
    + (c.urgentes.length ? `<div class="save">🔥 Salva: ${c.urgentes.map((i) => esc(cap(i))).join(', ')}</div>` : '');
  return `<article class="rcard" aria-labelledby="r${rec.id}">
    <div class="thumb" style="background:${FUNDOS[rec.id % FUNDOS.length]}" aria-hidden="true">${rec.emoji}</div>
    <div class="rbody">
      <h3 id="r${rec.id}">${esc(rec.nome)}</h3>
      <div class="meta"><span>⏱ ${rec.tempo} min</span><span>👨‍🍳 ${rec.dificuldade}</span>${rec.propria ? '<span>👩‍🍳 Sua receita</span>' : `<span>⭐ ${rec.avaliacao.toFixed(1)}</span>`}</div>
      ${tem ? `<div class="badge t-${c.tier.id}">${c.tier.icon} ${c.pct}% compatível · ${c.tem.length + c.trocas.length} de ${rec.ingredientes.length} ingredientes</div>
      <div class="bar" aria-hidden="true"><i class="t-${c.tier.id}" style="width:${c.pct}%"></i></div>${falta}` : ''}
      <div class="rfoot">
        <button class="btn btn-primary" data-open="${rec.id}">Ver receita<span class="sr-only"> de ${esc(rec.nome)}</span></button>
        <button class="fav ${fav ? 'on' : ''}" data-fav="${rec.id}" aria-label="${fav ? 'Remover dos favoritos' : 'Favoritar'}: ${esc(rec.nome)}" aria-pressed="${fav}">${fav ? '♥' : '♡'}</button>
      </div>
    </div>
  </article>`;
}

function renderReceitas() {
  const out = $('#results');
  renderResgate();
  $('#f-all').checked = state.mostrarTodas;
  $('#f-trocas').checked = state.trocas;
  const ativos = ['#f-tempo', '#f-dif', '#f-comp', '#f-cat'].filter((s) => $(s).value).length + (state.mostrarTodas ? 1 : 0);
  $('#f-count').textContent = ativos ? `(${ativos})` : '';

  if (!state.selecionados.length && !state.mostrarTodas && !$('#f-q').value) {
    $('#results-summary').textContent = '';
    out.innerHTML = `<div class="empty"><h3>Selecione alguns ingredientes para encontrar receitas.</h3><p>Ou marque “Mostrar todas as receitas” nos filtros para ver o catálogo completo.</p><button class="btn btn-primary" data-go="ingredientes">Adicionar ingredientes</button></div>`;
    return;
  }
  const lista = receitasFiltradas();
  $('#results-summary').innerHTML = `${plural(lista.length, 'receita encontrada', 'receitas encontradas')} com ${plural(state.selecionados.length, 'ingrediente', 'ingredientes')} · <a href="#" data-go="ingredientes">editar ingredientes</a>`;

  if (!lista.length) {
    out.innerHTML = `<div class="empty"><h3>Não encontramos uma receita com esses ingredientes.</h3><p>Tente adicionar mais ingredientes ou limpar os filtros.</p><button class="btn btn-primary" data-go="ingredientes">Adicionar ingredientes</button></div>`;
    return;
  }
  // Agrupa por classificação (a lista já está ordenada por compatibilidade)
  const grupos = [];
  lista.forEach((item) => {
    const t = state.selecionados.length ? item.c.tier : { titulo: 'Todas as receitas', icon: '' };
    let g = grupos.find((x) => x.t.titulo === t.titulo);
    if (!g) grupos.push((g = { t, itens: [] }));
    g.itens.push(item);
  });
  out.innerHTML = grupos.map((g) => `<section><h3 class="tier">${g.t.icon} ${g.t.titulo} <small>(${g.itens.length})</small></h3><div class="grid">${g.itens.map(cardReceita).join('')}</div></section>`).join('');
}

/* ---------- 8. FAVORITOS ---------- */

function renderFavoritos() {
  const itens = RECEITAS.filter((rec) => state.favoritos.includes(rec.id)).map((rec) => ({ rec, c: compatibilidade(rec) }));
  $('#favs').innerHTML = itens.length
    ? `<div class="grid">${itens.map(cardReceita).join('')}</div>`
    : `<div class="empty"><h3>Você ainda não tem receitas favoritas.</h3><p>Toque no ♡ de uma receita para salvá-la aqui.</p><button class="btn btn-primary" data-go="receitas">Ver receitas</button></div>`;
}

function alternarFavorito(id) {
  const i = state.favoritos.indexOf(id);
  if (i >= 0) state.favoritos.splice(i, 1); else state.favoritos.push(id);
  salvar();
  if (state.view === 'receitas') renderReceitas();
  if (state.view === 'favoritos') renderFavoritos();
  if (!$('#modal').hidden) abrirReceita(id, true);
  const btn = document.querySelector(`[data-fav="${id}"]`);
  if (btn) { btn.classList.add('pop'); if ($('#modal').hidden) btn.focus(); }
}

/* ---------- 9. MODAL DA RECEITA ---------- */

let abertoPor = null; // elemento que abriu o modal (para devolver o foco)

function abrirReceita(id, manterFoco) {
  const rec = RECEITAS.find((x) => x.id === id);
  const c = compatibilidade(rec);
  const fav = state.favoritos.includes(id);
  $('#modal-body').innerHTML = `
    <div class="m-thumb" style="background:${FUNDOS[rec.id % FUNDOS.length]}" aria-hidden="true">${rec.emoji}</div>
    <div class="m-content">
      <h2 id="m-title">${esc(rec.nome)}</h2>
      <div class="m-info"><span>⏱ ${rec.tempo} minutos</span><span>👨‍🍳 ${rec.dificuldade}</span><span>🍽 ${plural(rec.porcoes, 'porção', 'porções')}</span>${rec.propria ? '<span>👩‍🍳 Sua receita</span>' : `<span>⭐ ${rec.avaliacao.toFixed(1)}</span>`}</div>
      <h3>Ingredientes</h3>
      <ul class="ing-list">${rec.ingredientes.map((i) => c.trocas.find((t) => t.de === i) ? `<li class="swapli">🔁 ${emoji(i)} ${esc(cap(i))}${qtd(rec, i)} <b>→ use ${esc(c.trocas.find((t) => t.de === i).por)}</b></li>` : c.tem.includes(i) ? `<li class="has">✓ ${emoji(i)} ${esc(cap(i))}${qtd(rec, i)} <span class="sr-only">(você tem)</span></li>` : `<li class="lack">✕ ${emoji(i)} ${esc(cap(i))}${qtd(rec, i)} <span class="sr-only">(falta)</span></li>`).join('')}</ul>
      <p><b>Você possui ${c.tem.length + c.trocas.length} de ${rec.ingredientes.length} ingredientes${c.trocas.length ? ' (contando trocas)' : ''}.</b></p>
      <h3>Modo de preparo</h3>
      <ol>${rec.modoPreparo.map((p) => `<li>${esc(p)}</li>`).join('')}</ol>
      <div class="m-actions">
        <button class="btn btn-primary" data-cook="${id}">👩‍🍳 Cozinhar agora</button>
        <button class="btn ${fav ? 'btn-primary' : 'btn-outline'}" data-fav="${id}" aria-pressed="${fav}">${fav ? '♥ Salva nos favoritos' : '♡ Favoritar'}</button>
        ${rec.propria ? `<button class="btn btn-outline" data-edit="${id}">Editar</button><button class="btn btn-ghost" data-del="${id}">Excluir</button>` : ''}
      </div>
    </div>`;
  if ($('#modal').hidden) abertoPor = document.activeElement;
  $('#modal').hidden = false;
  document.body.style.overflow = 'hidden';
  // Bloqueia o fundo para teclado e leitores de tela enquanto o modal está aberto
  document.querySelector('main').inert = true;
  document.querySelector('.topbar').inert = true;
  (manterFoco ? $('.m-actions button') : $('#modal-close')).focus();
}
function fecharModal() {
  if ($('#modal').hidden) return;
  $('#modal').hidden = true;
  document.body.style.overflow = '';
  document.querySelector('main').inert = false;
  document.querySelector('.topbar').inert = false;
  if (abertoPor && document.contains(abertoPor)) abertoPor.focus();
}
/* ---------- 10. EVENTOS ---------- */

document.addEventListener('click', (e) => {
  if (e.target.id === 'modal') return fecharModal();
  const t = e.target.closest('[data-go],[data-toggle],[data-remove],[data-open],[data-fav]');
  if (!t) return;
  if (t.dataset.go) { e.preventDefault(); fecharModal(); ir(t.dataset.go); }
  else if (t.dataset.toggle) alternarIngrediente(t.dataset.toggle);
  else if (t.dataset.remove) alternarIngrediente(t.dataset.remove);
  else if (t.dataset.open) abrirReceita(+t.dataset.open);
  else if (t.dataset.fav) alternarFavorito(+t.dataset.fav);
});

// Lembra quais categorias o usuário recolheu
document.addEventListener('toggle', (e) => {
  const d = e.target, cat = d.dataset && d.dataset.cat;
  if (!cat || $('#search').value) return;
  state.fechadas = state.fechadas.filter((c) => c !== cat);
  if (!d.open) state.fechadas.push(cat);
}, true);

$('#search').addEventListener('input', renderIngredientes);
$('#add-toggle').addEventListener('click', (e) => {
  const row = $('#add-row');
  row.hidden = !row.hidden;
  e.currentTarget.setAttribute('aria-expanded', String(!row.hidden));
  if (!row.hidden) $('#add-input').focus();
});
$('#add-btn').addEventListener('click', adicionarPersonalizado);
$('#add-input').addEventListener('keydown', (e) => { if (e.key === 'Enter') adicionarPersonalizado(); });
$('#basics-btn').addEventListener('click', () => {
  ['sal', 'óleo', 'açúcar', 'alho'].forEach((i) => { if (!state.selecionados.includes(i)) state.selecionados.push(i); });
  salvar(); renderIngredientes();
});
$('#clear-btn').addEventListener('click', () => { state.selecionados = []; salvar(); renderIngredientes(); });
$('#find-btn').addEventListener('click', () => ir('receitas'));
$('#f-q').addEventListener('input', renderReceitas);
$('#filters').addEventListener('change', (e) => {
  if (e.target.id === 'f-all') { state.mostrarTodas = e.target.checked; salvar(); }
  if (e.target.id === 'f-trocas') { state.trocas = e.target.checked; salvar(); }
  renderReceitas();
});
$('#f-clear').addEventListener('click', () => {
  ['#f-tempo', '#f-dif', '#f-comp', '#f-cat', '#f-q'].forEach((s) => ($(s).value = ''));
  state.mostrarTodas = false; salvar(); renderReceitas();
});
$('#modal-close').addEventListener('click', fecharModal);
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') fecharModal(); });

/* ---------- 12. CRIAR / EDITAR RECEITA ---------- */

const ICONES = ['🍽️', '🍳', '🥗', '🍝', '🍲', '🍛', '🍕', '🥪', '🍰', '🍪', '🥘', '🍗', '🥩', '🐟', '🥞', '🍚', '🥤', '🍮'];
// Quantidade opcional de um ingrediente (ex.: "2 unidades"), usada no detalhe da receita
const qtd = (rec, i) => (rec.quantidades && rec.quantidades[i] ? ` <small class="qtd">— ${esc(rec.quantidades[i])}</small>` : '');
// Rascunho do formulário: ings = [{nome, qtd}], passos = [texto]
let rascunho = { id: null, ings: [], passos: [''] };

const todosIngredientes = () => [...Object.values(CATEGORIAS).flat(), ...state.personalizados];
// "Feijao" → "feijão" (reaproveita o ingrediente já existente, sem acento ou maiúscula)
function canonico(texto) {
  const n = norm(texto);
  return todosIngredientes().find((i) => norm(i) === n) || texto.trim().toLowerCase().replace(/\s+/g, ' ');
}

function limparErros() {
  $('#c-errors').hidden = true;
  document.querySelectorAll('#recipe-form .err').forEach((e) => (e.textContent = ''));
  document.querySelectorAll('#recipe-form [aria-invalid]').forEach((e) => e.removeAttribute('aria-invalid'));
}

// Desenha as listas de ingredientes e de passos; "foco" é o seletor do elemento que deve receber o foco
function renderListasForm(foco) {
  $('#c-ings').innerHTML = rascunho.ings.length
    ? rascunho.ings.map((g, i) => `<li><span>${emoji(g.nome)} <b>${esc(cap(g.nome))}</b>${g.qtd ? ` <small>— ${esc(g.qtd)}</small>` : ''}</span><button type="button" class="icon-btn" data-rm-ing="${i}" aria-label="Remover ${esc(g.nome)}">×</button></li>`).join('')
    : '<li><small>Nenhum ingrediente adicionado ainda.</small></li>';
  const n = rascunho.passos.length;
  $('#c-steps').innerHTML = rascunho.passos.map((p, i) => `<li>
    <label for="passo${i}">Passo ${i + 1}</label>
    <textarea id="passo${i}" data-passo="${i}" rows="2" maxlength="400" aria-describedby="e-steps">${esc(p)}</textarea>
    <div class="step-btns">
      <button type="button" class="icon-btn" data-mv="${i}:-1" aria-label="Mover passo ${i + 1} para cima" ${i === 0 ? 'disabled' : ''}>↑</button>
      <button type="button" class="icon-btn" data-mv="${i}:1" aria-label="Mover passo ${i + 1} para baixo" ${i === n - 1 ? 'disabled' : ''}>↓</button>
      <button type="button" class="icon-btn" data-rm-passo="${i}" aria-label="Remover passo ${i + 1}" ${n === 1 ? 'disabled' : ''}>×</button>
    </div></li>`).join('');
  if (foco) { const el = document.querySelector(foco); if (el) el.focus(); }
}

function renderCriar() {
  if (!$('#c-emojis').children.length) {
    $('#c-emojis').innerHTML = ICONES.map((e, i) => `<label><input type="radio" name="c-emoji" value="${e}" ${i === 0 ? 'checked' : ''}><span>${e}</span></label>`).join('');
  }
  $('#ing-sugestoes').innerHTML = todosIngredientes().map((i) => `<option value="${esc(i)}">`).join('');
  renderListasForm();
  $('#c-mine').innerHTML = state.minhas.length
    ? `<ul class="mine-list">${state.minhas.map((r) => `<li><span class="m-emo" aria-hidden="true">${r.emoji}</span><div class="m-txt"><b>${esc(r.nome)}</b><small>${r.categoria} · ${r.tempo} min · ${r.dificuldade}</small></div><div class="m-btns">
        <button type="button" class="btn btn-outline btn-sm" data-open="${r.id}" aria-label="Ver ${esc(r.nome)}">Ver</button>
        <button type="button" class="btn btn-outline btn-sm" data-edit="${r.id}" aria-label="Editar ${esc(r.nome)}">Editar</button>
        <button type="button" class="btn btn-ghost btn-sm" data-del="${r.id}" aria-label="Excluir ${esc(r.nome)}">Excluir</button></div></li>`).join('')}</ul>`
    : '<div class="empty"><h3>Você ainda não criou nenhuma receita.</h3><p>Preencha o formulário acima e toque em “Salvar receita”.</p></div>';
}

function resetarForm() {
  rascunho = { id: null, ings: [], passos: [''] };
  $('#recipe-form').reset();
  limparErros();
  $('#c-title').textContent = 'Criar minha receita';
  $('#c-save').textContent = 'Salvar receita';
  renderListasForm();
}

function addIngrediente() {
  const campo = $('#c-ing'), nome = campo.value.trim();
  if (!nome) { $('#e-ings').textContent = 'Digite o nome de um ingrediente.'; campo.setAttribute('aria-invalid', 'true'); campo.focus(); return; }
  const chave = canonico(nome);
  campo.removeAttribute('aria-invalid');
  if (rascunho.ings.some((g) => g.nome === chave)) { $('#e-ings').textContent = `${cap(chave)} já está na lista.`; campo.focus(); return; }
  $('#e-ings').textContent = '';
  rascunho.ings.push({ nome: chave, qtd: $('#c-qtd').value.trim() });
  campo.value = ''; $('#c-qtd').value = '';
  renderListasForm('#c-ing');
  $('#c-live').textContent = `${cap(chave)} adicionado. ${plural(rascunho.ings.length, 'ingrediente', 'ingredientes')} na lista.`;
}

function salvarReceita(e) {
  e.preventDefault();
  if ($('#c-ing').value.trim()) addIngrediente(); // ingrediente digitado e ainda não adicionado
  limparErros();
  const nome = $('#c-nome').value.trim(), tempo = parseInt($('#c-tempo').value, 10), porc = parseInt($('#c-porc').value, 10);
  const passos = rascunho.passos.map((p) => p.trim()).filter(Boolean);

  // Validação: cada erro aparece junto do campo e num resumo no topo
  const erros = [];
  const falha = (campo, span, msg) => { erros.push({ campo, msg }); $('#' + span).textContent = msg; $('#' + campo).setAttribute('aria-invalid', 'true'); };
  if (!nome) falha('c-nome', 'e-nome', 'Informe o nome da receita.');
  if (!(tempo >= 1 && tempo <= 600)) falha('c-tempo', 'e-tempo', 'Informe o tempo em minutos (de 1 a 600).');
  if (!(porc >= 1 && porc <= 50)) falha('c-porc', 'e-porc', 'Informe as porções (de 1 a 50).');
  if (!rascunho.ings.length) falha('c-ing', 'e-ings', 'Adicione pelo menos um ingrediente.');
  if (!passos.length) falha('passo0', 'e-steps', 'Escreva pelo menos um passo do modo de preparo.');
  if (erros.length) {
    const box = $('#c-errors');
    box.innerHTML = `<b>${plural(erros.length, 'campo precisa', 'campos precisam')} de atenção:</b><ul>${erros.map((x) => `<li><a href="#" data-focus="${x.campo}">${x.msg}</a></li>`).join('')}</ul>`;
    box.hidden = false; box.focus();
    return;
  }

  const quantidades = {};
  rascunho.ings.forEach((g) => { if (g.qtd) quantidades[g.nome] = g.qtd; });
  const conhecidos = todosIngredientes();
  rascunho.ings.forEach((g) => { if (!conhecidos.includes(g.nome)) state.personalizados.push(g.nome); });

  const editando = rascunho.id !== null;
  const id = editando ? rascunho.id : state.proxId++;
  const rec = {
    id, nome, categoria: $('#c-cat').value, tempo, dificuldade: document.querySelector('input[name="c-dif"]:checked').value,
    porcoes: porc, avaliacao: 5, emoji: document.querySelector('input[name="c-emoji"]:checked').value,
    ingredientes: rascunho.ings.map((g) => g.nome), quantidades, modoPreparo: passos, propria: true
  };
  const trocar = (lista) => { const i = lista.findIndex((r) => r.id === id); if (i >= 0) lista[i] = rec; else lista.push(rec); };
  trocar(state.minhas); trocar(RECEITAS);
  salvar();
  resetarForm(); renderCriar();
  $('#c-status').innerHTML = `<span>Receita “${esc(nome)}” ${editando ? 'atualizada' : 'salva'}! Ela já aparece em Receitas.</span><button type="button" class="btn btn-outline btn-sm" data-open="${id}">Ver receita</button>`;
  window.scrollTo({ top: 0 });
}

function editarReceita(id) {
  const r = state.minhas.find((x) => x.id === id);
  if (!r) return;
  fecharModal(); ir('criar'); resetarForm();
  rascunho = { id, ings: r.ingredientes.map((n) => ({ nome: n, qtd: (r.quantidades && r.quantidades[n]) || '' })), passos: [...r.modoPreparo] };
  $('#c-nome').value = r.nome; $('#c-cat').value = r.categoria; $('#c-tempo').value = r.tempo; $('#c-porc').value = r.porcoes;
  document.querySelector(`input[name="c-dif"][value="${r.dificuldade}"]`).checked = true;
  const em = [...document.querySelectorAll('input[name="c-emoji"]')].find((x) => x.value === r.emoji);
  if (em) em.checked = true;
  $('#c-title').textContent = 'Editar receita'; $('#c-save').textContent = 'Salvar alterações'; $('#c-status').innerHTML = '';
  renderListasForm(); $('#c-nome').focus();
}

function excluirReceita(id) {
  const r = state.minhas.find((x) => x.id === id);
  if (!r || !confirm(`Excluir a receita “${r.nome}”? Esta ação não pode ser desfeita.`)) return;
  state.minhas = state.minhas.filter((x) => x.id !== id);
  const i = RECEITAS.findIndex((x) => x.id === id);
  if (i >= 0) RECEITAS.splice(i, 1);
  state.favoritos = state.favoritos.filter((f) => f !== id);
  if (rascunho.id === id) resetarForm();
  salvar(); fecharModal(); ir(state.view);
  $('#c-status').textContent = `Receita “${r.nome}” excluída.`;
  if (state.view === 'criar') $('#c-title').focus();
}

// Eventos do formulário (delegação: as listas são redesenhadas a cada mudança)
document.addEventListener('click', (e) => {
  const t = e.target.closest('[data-edit],[data-del],[data-rm-ing],[data-mv],[data-rm-passo],[data-focus]');
  if (!t) return;
  const d = t.dataset;
  if (d.edit) editarReceita(+d.edit);
  else if (d.del) excluirReceita(+d.del);
  else if (d.rmIng !== undefined) {
    const nome = rascunho.ings[+d.rmIng].nome;
    rascunho.ings.splice(+d.rmIng, 1);
    renderListasForm('#c-ing');
    $('#c-live').textContent = `${cap(nome)} removido.`;
  } else if (d.mv) {
    const [i, dir] = d.mv.split(':').map(Number), j = i + dir;
    [rascunho.passos[i], rascunho.passos[j]] = [rascunho.passos[j], rascunho.passos[i]];
    renderListasForm('#passo' + j);
    $('#c-live').textContent = `Passo movido para a posição ${j + 1}.`;
  } else if (d.rmPasso !== undefined) {
    rascunho.passos.splice(+d.rmPasso, 1);
    renderListasForm('#passo' + Math.max(0, +d.rmPasso - 1));
  } else if (d.focus) { e.preventDefault(); const el = $('#' + d.focus); if (el) el.focus(); }
});
$('#recipe-form').addEventListener('submit', salvarReceita);
$('#c-ing-btn').addEventListener('click', addIngrediente);
['#c-ing', '#c-qtd'].forEach((s) => $(s).addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); addIngrediente(); } }));
$('#c-step-btn').addEventListener('click', () => { rascunho.passos.push(''); renderListasForm('#passo' + (rascunho.passos.length - 1)); });
$('#c-steps').addEventListener('input', (e) => { if (e.target.dataset.passo !== undefined) rascunho.passos[+e.target.dataset.passo] = e.target.value; });
$('#c-cancel').addEventListener('click', () => { resetarForm(); $('#c-status').innerHTML = ''; window.scrollTo({ top: 0 }); });

// Carrega as receitas do usuário junto com as do app
state.minhas.forEach((r) => RECEITAS.push(r));

/* ---------- 13. NOVIDADES: resgate, trocas e modo cozinhar ---------- */

// Validade: o app prioriza o que vence logo
const DIA = 864e5, hoje0 = () => new Date().setHours(0, 0, 0, 0);
function diasPara(i) { const v = state.validades[i]; return v == null ? null : Math.round((v - hoje0()) / DIA); }
const rotuloDias = (d) => d < 0 ? 'vencido' : d === 0 ? 'vence hoje' : d === 1 ? 'vence amanhã' : `vence em ${d} dias`;
function urgTag(i) { const d = diasPara(i); return d !== null && d <= 3 ? ` <small class="urg">⏳ ${rotuloDias(d)}</small>` : ''; }
const urgentesGeral = () => state.selecionados.filter((i) => { const d = diasPara(i); return d !== null && d <= 3; }).sort((a, b) => diasPara(a) - diasPara(b));

function renderValidade() {
  const box = $('#validade-list');
  $('#validade-wrap').hidden = !state.selecionados.length;
  if (box.contains(document.activeElement)) return;
  const base = [['', 'Sem data'], [0, 'Hoje'], [1, 'Amanhã'], [3, '3 dias'], [7, '1 semana']];
  box.innerHTML = state.selecionados.map((i) => {
    const d = diasPara(i), o = d !== null && !base.some((x) => x[0] === d) ? [...base, [d, rotuloDias(d)]] : base;
    return `<label>${emoji(i)} ${esc(cap(i))}<select data-val="${esc(i)}">${o.map(([v, t]) => `<option value="${v}" ${(d === null ? '' : d) === v ? 'selected' : ''}>${t}</option>`).join('')}</select></label>`;
  }).join('');
}
function renderResgate() {
  const u = urgentesGeral(), box = $('#rescue');
  box.hidden = !u.length;
  if (!u.length) { state.resgate = false; return; }
  box.innerHTML = `<b>⏳ Salve antes de vencer</b><p>${u.map((i) => `${emoji(i)} ${esc(cap(i))} <small>(${rotuloDias(diasPara(i))})</small>`).join(' · ')}</p><button class="btn ${state.resgate ? 'btn-primary' : 'btn-outline'} btn-sm" data-resgate aria-pressed="${state.resgate}">${state.resgate ? '✓ Mostrando só receitas que salvam' : 'Mostrar só receitas que salvam'}</button>`;
}
function renderSalvos() {
  const el = $('#salvos');
  el.hidden = !state.salvos;
  el.textContent = `🌱 Você já salvou ${plural(state.salvos, 'ingrediente', 'ingredientes')} do lixo.`;
}

// Modo cozinhar: um passo por vez, cronômetros automáticos, voz e tela sempre acesa
const cook = { rec: null, i: 0, voz: false, timers: [], tick: null, lock: null, uid: 0 };
const achaTempos = (txt) => [...txt.matchAll(/(\d+)\s*(minutos?|min|horas?|h)\b/gi)].map((m) => ({ s: (/^h/i.test(m[2]) ? 3600 : 60) * +m[1], rot: m[0] }));
const mmss = (s) => (s >= 3600 ? Math.floor(s / 3600) + ':' : '') + String(Math.floor((s % 3600) / 60)).padStart(s >= 3600 ? 2 : 1, '0') + ':' + String(s % 60).padStart(2, '0');
function bipe() {
  try { const a = new (window.AudioContext || window.webkitAudioContext)(), o = a.createOscillator(); o.frequency.value = 880; o.connect(a.destination); o.start(); setTimeout(() => { o.stop(); a.close(); }, 700); } catch { /* sem áudio */ }
  if (navigator.vibrate) navigator.vibrate([300, 150, 300]);
}
function falar(t) { if (cook.voz && 'speechSynthesis' in window) { speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(t); u.lang = 'pt-BR'; speechSynthesis.speak(u); } }

function abrirCozinhar(id) {
  cook.rec = RECEITAS.find((x) => x.id === id); cook.i = 0; cook.timers = [];
  fecharModal();
  $('#cook').hidden = false; document.body.style.overflow = 'hidden';
  document.querySelector('main').inert = true; document.querySelector('.topbar').inert = true;
  try { if (navigator.wakeLock) navigator.wakeLock.request('screen').then((l) => (cook.lock = l)).catch(() => {}); } catch { /* sem wake lock */ }
  cook.tick = setInterval(() => {
    cook.timers.forEach((t) => { if (!t.feito && Date.now() >= t.fim) { t.feito = true; bipe(); falar('Tempo esgotado: ' + t.rot); } });
    renderTimers();
  }, 1000);
  renderCook();
}
function fecharCozinhar() {
  if ($('#cook').hidden) return;
  clearInterval(cook.tick); cook.timers = [];
  if ('speechSynthesis' in window) speechSynthesis.cancel();
  if (cook.lock) { cook.lock.release().catch(() => {}); cook.lock = null; }
  $('#cook').hidden = true; document.body.style.overflow = '';
  document.querySelector('main').inert = false; document.querySelector('.topbar').inert = false;
}
function renderTimers() {
  const box = $('#cook-timers'); if (!box) return;
  box.innerHTML = cook.timers.map((t) => `<div class="ctimer ${t.feito ? 'done' : ''}" role="${t.feito ? 'alert' : 'timer'}"><span>${t.feito ? '✅ Pronto!' : '⏲ ' + mmss(Math.max(0, Math.ceil((t.fim - Date.now()) / 1000)))} <small>${esc(t.rot)}</small></span><button class="icon-btn" data-cook-act="x" data-id="${t.id}" aria-label="Remover cronômetro">×</button></div>`).join('');
}
function renderCook() {
  const rec = cook.rec, n = rec.modoPreparo.length, fim = cook.i >= n;
  let h = `<div class="cook-top"><b id="cook-title">${esc(rec.nome)}</b><button class="icon-btn" data-cook-act="sair" aria-label="Sair do modo cozinhar">×</button></div><div class="bar" aria-hidden="true"><i class="t-ok" style="width:${Math.min(100, (cook.i / n) * 100)}%"></i></div>`;
  if (!fim) {
    const p = rec.modoPreparo[cook.i];
    h += `<div class="cook-step" aria-live="polite"><small>Passo ${cook.i + 1} de ${n}</small><p>${esc(p)}</p>${achaTempos(p).map((t, k) => `<button class="btn btn-outline" data-cook-act="timer" data-k="${k}">⏲ Iniciar ${esc(t.rot)}</button>`).join('')}</div>`;
  } else {
    const usados = compatibilidade(rec).tem;
    h += `<div class="cook-step"><h2>Bom apetite! 🎉</h2><p>Quer dar baixa nos ingredientes que usou?</p>${usados.map((i) => `<label class="baixa"><input type="checkbox" value="${esc(i)}" checked> ${emoji(i)} ${esc(cap(i))}${urgTag(i)}</label>`).join('') || '<p class="muted">Nenhum ingrediente da sua lista foi usado.</p>'}<button class="btn btn-primary btn-lg" data-cook-act="baixa">Concluir</button></div>`;
  }
  h += `<div id="cook-timers"></div><div class="cook-nav"><button class="btn btn-outline" data-cook-act="ant" ${cook.i === 0 ? 'disabled' : ''}>← Anterior</button><button class="btn btn-ghost" data-cook-act="voz" aria-pressed="${cook.voz}">${cook.voz ? '🔊 Voz ligada' : '🔈 Ler em voz alta'}</button>${fim ? '' : `<button class="btn btn-primary" data-cook-act="prox">${cook.i === n - 1 ? 'Finalizar' : 'Próximo →'}</button>`}</div>`;
  $('#cook-box').innerHTML = h; renderTimers();
  if (!fim) falar(rec.modoPreparo[cook.i]);
}

document.addEventListener('click', (e) => {
  const t = e.target.closest('[data-cook],[data-resgate],[data-cook-act]');
  if (!t) return;
  if (t.dataset.cook) abrirCozinhar(+t.dataset.cook);
  else if (t.hasAttribute('data-resgate')) { state.resgate = !state.resgate; renderReceitas(); }
  else {
    const a = t.dataset.cookAct;
    if (a === 'sair') fecharCozinhar();
    else if (a === 'prox') { cook.i++; renderCook(); }
    else if (a === 'ant') { cook.i = Math.max(0, cook.i - 1); renderCook(); }
    else if (a === 'voz') { cook.voz = !cook.voz; if (!cook.voz && 'speechSynthesis' in window) speechSynthesis.cancel(); renderCook(); }
    else if (a === 'timer') { const tp = achaTempos(cook.rec.modoPreparo[cook.i])[+t.dataset.k]; cook.timers.push({ id: ++cook.uid, rot: tp.rot, fim: Date.now() + tp.s * 1000, feito: false }); renderTimers(); }
    else if (a === 'x') { cook.timers = cook.timers.filter((x) => x.id !== +t.dataset.id); renderTimers(); }
    else if (a === 'baixa') {
      document.querySelectorAll('#cook-box .baixa input:checked').forEach((c) => {
        const d = diasPara(c.value); if (d !== null && d <= 3) state.salvos++;
        state.selecionados = state.selecionados.filter((i) => i !== c.value); delete state.validades[c.value];
      });
      salvar(); fecharCozinhar(); renderSalvos(); ir(state.view);
    }
  }
});
document.addEventListener('change', (e) => {
  const s = e.target.closest('[data-val]'); if (!s) return;
  if (s.value === '') delete state.validades[s.dataset.val]; else state.validades[s.dataset.val] = hoje0() + +s.value * DIA;
  salvar(); renderIngredientes();
});
document.addEventListener('keydown', (e) => {
  if ($('#cook').hidden) return;
  if (e.key === 'Escape') fecharCozinhar();
  else if (e.key === 'ArrowRight' && cook.i < cook.rec.modoPreparo.length) { cook.i++; renderCook(); }
  else if (e.key === 'ArrowLeft' && cook.i > 0) { cook.i--; renderCook(); }
});

/* ---------- 11. INÍCIO ---------- */
renderSalvos();
ir('inicio');