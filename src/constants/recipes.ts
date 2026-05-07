
export interface Recipe {
  id: string;
  nome: string;
  calorias: number;
  explicacao: string;
  ingredientes: string[];
  modo_preparo: string | string[];
  category: 'Café' | 'Almoço' | 'Jantar' | 'Lanche';
  tags: string[];
  time: string;
  tipo?: 'PERFEITA' | 'QUASE PERFEITA';
  ingredientes_possuidos?: string[];
  ingredientes_faltantes?: string[];
}

export const STATIC_RECIPES: Recipe[] = [
  {
    id: '1',
    nome: 'Frango grelhado com arroz integral e legumes',
    calorias: 420,
    explicacao: 'Uma refeição equilibrada rica em proteínas e fibras, ideal para o almoço.',
    ingredientes: ['frango', 'arroz integral', 'brócolis', 'cenoura'],
    modo_preparo: 'Grelhe o frango temperado, cozinhe o arroz integral e refogue os legumes. Sirva tudo junto.',
    category: 'Almoço',
    tags: ['Proteína', 'Fibras'],
    time: '25min'
  },
  {
    id: '2',
    nome: 'Omelete de legumes',
    calorias: 250,
    explicacao: 'Opção leve e nutritiva para o café da manhã ou jantar.',
    ingredientes: ['ovos', 'tomate', 'cebola', 'cenoura'],
    modo_preparo: 'Bata os ovos, misture os legumes picados e cozinhe em uma frigideira.',
    category: 'Café',
    tags: ['Leve', 'Nutritivo'],
    time: '10min'
  },
  {
    id: '3',
    nome: 'Salmão com batata doce',
    calorias: 480,
    explicacao: 'Prato rico em ômega 3 e energia, ideal para recuperação muscular.',
    ingredientes: ['salmão', 'batata doce', 'azeite'],
    modo_preparo: 'Asse a batata doce e grelhe o salmão temperado.',
    category: 'Jantar',
    tags: ['Ômega 3', 'Energia'],
    time: '30min'
  },
  {
    id: '4',
    nome: 'Macarrão integral com frango',
    calorias: 430,
    explicacao: 'Uma refeição prática e saudável com boa quantidade de energia.',
    ingredientes: ['macarrão integral', 'frango', 'molho de tomate'],
    modo_preparo: 'Cozinhe o macarrão, grelhe o frango e misture com o molho.',
    category: 'Almoço',
    tags: ['Prático', 'Energia'],
    time: '20min'
  },
  {
    id: '5',
    nome: 'Bowl fitness de arroz, feijão e frango',
    calorias: 450,
    explicacao: 'Clássico brasileiro equilibrado para manter energia ao longo do dia.',
    ingredientes: ['arroz', 'feijão', 'frango', 'salada'],
    modo_preparo: 'Prepare os ingredientes separadamente e monte em um bowl.',
    category: 'Almoço',
    tags: ['Equilibrado', 'Clássico'],
    time: '25min'
  },
  {
    id: '6',
    nome: 'Panqueca de banana saudável',
    calorias: 200,
    explicacao: 'Perfeita para um café da manhã saudável e doce sem açúcar.',
    ingredientes: ['banana', 'ovo', 'aveia'],
    modo_preparo: 'Misture tudo e prepare em uma frigideira antiaderente.',
    category: 'Café',
    tags: ['Doce', 'Sem açúcar'],
    time: '10min'
  },
  {
    id: '7',
    nome: 'Salada de atum com legumes',
    calorias: 220,
    explicacao: 'Leve, prática e rica em proteínas.',
    ingredientes: ['atum', 'alface', 'tomate', 'cenoura'],
    modo_preparo: 'Misture todos os ingredientes e tempere a gosto.',
    category: 'Almoço',
    tags: ['Leve', 'Proteína'],
    time: '15min'
  },
  {
    id: '8',
    nome: 'Frango com batata doce',
    calorias: 400,
    explicacao: 'Muito usado em dietas para ganho de massa e energia.',
    ingredientes: ['frango', 'batata doce'],
    modo_preparo: 'Grelhe o frango e asse a batata doce.',
    category: 'Almoço',
    tags: ['Massa Muscular', 'Energia'],
    time: '25min'
  },
  {
    id: '9',
    nome: 'Vitamina de banana com aveia',
    calorias: 180,
    explicacao: 'Ótima para pré-treino, fornece energia rápida.',
    ingredientes: ['banana', 'aveia', 'leite'],
    modo_preparo: 'Bata todos os ingredientes no liquidificador.',
    category: 'Lanche',
    tags: ['Pré-treino', 'Energia'],
    time: '5min'
  },
  {
    id: '10',
    nome: 'Sopa de legumes',
    calorias: 150,
    explicacao: 'Refeição leve ideal para o jantar.',
    ingredientes: ['cenoura', 'batata', 'abobrinha'],
    modo_preparo: 'Cozinhe todos os ingredientes e bata ou sirva em pedaços.',
    category: 'Jantar',
    tags: ['Leve', 'Jantar'],
    time: '30min'
  },
  {
    id: '11',
    nome: 'Tapioca com queijo branco',
    calorias: 230,
    explicacao: 'Opção brasileiríssima e sem glúten para o café.',
    ingredientes: ['goma de tapioca', 'queijo branco', 'orégano'],
    modo_preparo: 'Prepare a tapioca na frigideira e recheie com o queijo.',
    category: 'Café',
    tags: ['Sem glúten', 'Rápido'],
    time: '5min'
  },
  {
    id: '12',
    nome: 'Iogurte natural com frutas e mel',
    calorias: 190,
    explicacao: 'Um lanche refrescante e nutritivo.',
    ingredientes: ['iogurte natural', 'morango', 'mel', 'granola'],
    modo_preparo: 'Coloque o iogurte em uma tigela, adicione as frutas e finalize com mel.',
    category: 'Lanche',
    tags: ['Refrescante', 'Fácil'],
    time: '3min'
  },
  {
    id: '13',
    nome: 'Crepioca fit',
    calorias: 210,
    explicacao: 'Versão proteica da tapioca tradicional.',
    ingredientes: ['ovo', 'goma de tapioca', 'sal'],
    modo_preparo: 'Bata o ovo com a tapioca e prepare como uma panqueca.',
    category: 'Café',
    tags: ['Proteína', 'Prático'],
    time: '7min'
  },
  {
    id: '14',
    nome: 'Grão-de-bico refogado com espinafre',
    calorias: 280,
    explicacao: 'Proteína vegetal e ferro em um prato saboroso.',
    ingredientes: ['grão-de-bico cozido', 'espinafre', 'alho', 'azeite'],
    modo_preparo: 'Refogue o alho no azeite, adicione o espinafre e depois o grão-de-bico.',
    category: 'Almoço',
    tags: ['Veggia', 'Proteína'],
    time: '15min'
  },
  {
    id: '15',
    nome: 'Smoothie de abacate e cacau',
    calorias: 320,
    explicacao: 'Refeição densa em gorduras boas e saborosa como mousse.',
    ingredientes: ['abacate', 'cacau em pó', 'leite vegetal', 'adoçante'],
    modo_preparo: 'Bata tudo no liquidificador até ficar cremoso.',
    category: 'Lanche',
    tags: ['Gordura Boa', 'Low Carb'],
    time: '5min'
  },
  {
    id: '16',
    nome: 'Quinoa real com legumes ao vapor',
    calorias: 260,
    explicacao: 'Um acompanhamento ou prato principal leve e completo.',
    ingredientes: ['quinoa', 'vagem', 'cenoura', 'abobrinha'],
    modo_preparo: 'Cozinhe a quinoa e os legumes no vapor, misture e tempere com ervas.',
    category: 'Almoço',
    tags: ['Fibras', 'Nutritivo'],
    time: '20min'
  },
  {
    id: '17',
    nome: 'Sanduíche de frango desfiado com cottage',
    calorias: 290,
    explicacao: 'Lanche completo com pão integral e recheio proteico.',
    ingredientes: ['pão integral', 'frango desfiado', 'queijo cottage', 'cenoura ralada'],
    modo_preparo: 'Misture o frango com o cottage e cenoura. Monte no pão.',
    category: 'Lanche',
    tags: ['Proteína', 'Sanduíche'],
    time: '10min'
  },
  {
    id: '18',
    nome: 'Peixe branco ao forno com ervas',
    calorias: 240,
    explicacao: 'Proteína leve para uma digestão fácil à noite.',
    ingredientes: ['filé de tilápia', 'limão', 'alecrim', 'azeite'],
    modo_preparo: 'Tempere o peixe com limão e ervas. Leve ao forno por 20 minutos.',
    category: 'Jantar',
    tags: ['Leve', 'Jantar'],
    time: '25min'
  },
  {
    id: '19',
    nome: 'Berinjela recheada com carne moída',
    calorias: 310,
    explicacao: 'Prato baixo em carboidratos e muito suculento.',
    ingredientes: ['berinjela', 'carne moída magra', 'molho de tomate natural'],
    modo_preparo: 'Retire o miolo da berinjela, misture com a carne refogada e asse.',
    category: 'Jantar',
    tags: ['Low Carb', 'Suculento'],
    time: '35min'
  },
  {
    id: '20',
    nome: 'Mingau de aveia noturno (Overnight Oats)',
    calorias: 250,
    explicacao: 'Praticidade para quem tem manhãs corridas.',
    ingredientes: ['aveia em flocos', 'leite de amêndoas', 'chia', 'frutas vermelhas'],
    modo_preparo: 'Misture os ingredientes em um pote e deixe na geladeira durante a noite.',
    category: 'Café',
    tags: ['Prático', 'Fibras'],
    time: '5min'
  },
  {
    id: '21',
    nome: 'Ovos mexidos com espinafre',
    calorias: 180,
    explicacao: 'Início de dia rico em ferro e proteínas.',
    ingredientes: ['ovos', 'espinafre', 'azeite', 'sal'],
    modo_preparo: 'Refogue o espinafre no azeite e adicione os ovos batidos. Mexa até cozinhar.',
    category: 'Café',
    tags: ['Ferro', 'Proteína'],
    time: '8min'
  },
  {
    id: '22',
    nome: 'Espaguete de abobrinha à bolonhesa',
    calorias: 290,
    explicacao: 'Alternativa low carb deliciosa ao macarrão tradicional.',
    ingredientes: ['abobrinha', 'carne moída', 'molho de tomate', 'alho'],
    modo_preparo: 'Faça tiras finas de abobrinha. Refogue a carne com o molho e sirva sobre a abobrinha levemente refogada.',
    category: 'Jantar',
    tags: ['Low Carb', 'Vegetais'],
    time: '20min'
  },
  {
    id: '23',
    nome: 'Bowl de iogurte grego com amêndoas',
    calorias: 240,
    explicacao: 'Lanche proteico e crocante.',
    ingredientes: ['iogurte grego zero', 'amêndoas', 'coco ralado'],
    modo_preparo: 'Misture o iogurte com as amêndoas e o coco em uma tigela.',
    category: 'Lanche',
    tags: ['Proteína', 'Gordura Boa'],
    time: '2min'
  },
  {
    id: '24',
    nome: 'Strogonoff de frango fit',
    calorias: 380,
    explicacao: 'Versão leve usando creme de leite light ou cottage.',
    ingredientes: ['peito de frango', 'cogumelos', 'creme de leite light', 'mostarda'],
    modo_preparo: 'Refogue o frango e cogumelos. Adicione a mostarda e finalize com o creme de leite.',
    category: 'Almoço',
    tags: ['Saudável', 'Proteína'],
    time: '25min'
  },
  {
    id: '25',
    nome: 'Salada de grão-de-bico com bacalhau',
    calorias: 350,
    explicacao: 'Proteína de alta qualidade com fibras.',
    ingredientes: ['grão-de-bico', 'bacalhau desfiado', 'pimentão', 'azeite'],
    modo_preparo: 'Misture todos os ingredientes cozidos e tempere com bastante azeite.',
    category: 'Almoço',
    tags: ['Proteína', 'Festa'],
    time: '20min'
  },
  {
    id: '26',
    nome: 'Omelete de claras com queijo minas',
    calorias: 160,
    explicacao: 'Ultra proteico e baixo em calorias.',
    ingredientes: ['claras de ovo', 'queijo minas frescal', 'ervas finas'],
    modo_preparo: 'Bata as claras e cozinhe na frigideira com o queijo e ervas.',
    category: 'Jantar',
    tags: ['Low Calorie', 'Proteína'],
    time: '10min'
  },
  {
    id: '27',
    nome: 'Muffin de ovo com legumes',
    calorias: 140,
    explicacao: 'Praticidade para carregar como lanche ou café.',
    ingredientes: ['ovos', 'brócolis picado', 'milho', 'queijo'],
    modo_preparo: 'Bata os ovos, misture os legumes e asse em formas de muffin por 15min.',
    category: 'Lanche',
    tags: ['Prático', 'Lanche'],
    time: '20min'
  },
  {
    id: '28',
    nome: 'Cuscuz marroquino com legumes',
    calorias: 310,
    explicacao: 'Acompanhamento exótico e nutritivo.',
    ingredientes: ['cuscuz marroquino', 'pimentão', 'uva passa', 'azeite'],
    modo_preparo: 'Hidrate o cuscuz e misture com os legumes refogados e passas.',
    category: 'Almoço',
    tags: ['Energia', 'Fibras'],
    time: '15min'
  },
  {
    id: '29',
    nome: 'Kibe de forno vegetariano (Abóbora)',
    calorias: 220,
    explicacao: 'Deliciosa variação sem carne.',
    ingredientes: ['trigo para kibe', 'abóbora cozida', 'hortelã', 'cebola'],
    modo_preparo: 'Misture o trigo hidratado com a abóbora e temperos. Asse até dourar.',
    category: 'Jantar',
    tags: ['Vegetariano', 'Leve'],
    time: '40min'
  },
  {
    id: '30',
    nome: 'Smoothie verde detox',
    calorias: 120,
    explicacao: 'Revitalizante e rico em micronutrientes.',
    ingredientes: ['couve', 'maçã', 'limão', 'gengibre'],
    modo_preparo: 'Bata todos os ingredientes com água ou água de coco no liquidificador.',
    category: 'Café',
    tags: ['Detox', 'Vitamínico'],
    time: '5min'
  }
];
