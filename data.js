/* ============================================================
   СПУТНИК · SPUTNIK — Apprendre le russe depuis zéro
   data.js — tout le contenu pédagogique
   Convention prononciation : la SYLLABE ACCENTUÉE est en MAJUSCULES.
   Le "о" non accentué se lit "a" (аканье) — c'est voulu dans les transcriptions.
   ============================================================ */

const DATA = {};

/* -------------------- 1. L'ALPHABET (33 lettres) -------------------- */
/* group: 1=amies · 2=faux amis · 3=nouvelles · 4=chuintantes · 5=iotées & signes */

DATA.alphabet = [
  // — Groupe 1 : les vieilles connaissances (même forme, même son) —
  { up:"А", low:"а", name:"a",        tr:"a",   son:"« a » de papa",                 ex:"арбуз",  exFr:"pastèque", exTr:"ar-BOUZ",  group:1 },
  { up:"К", low:"к", name:"ka",       tr:"k",   son:"« k » de kilo",                 ex:"кот",    exFr:"chat",     exTr:"kot",      group:1 },
  { up:"М", low:"м", name:"em",       tr:"m",   son:"« m » de maman",                ex:"мама",   exFr:"maman",    exTr:"MA-ma",    group:1 },
  { up:"О", low:"о", name:"o",        tr:"o",   son:"« o » de porte (a si non accentué)", ex:"окно", exFr:"fenêtre", exTr:"ak-NO",  group:1 },
  { up:"Т", low:"т", name:"té",       tr:"t",   son:"« t » de table",                ex:"торт",   exFr:"gâteau",   exTr:"tort",     group:1 },

  // — Groupe 2 : les faux amis (air latin, son piégeux) —
  { up:"В", low:"в", name:"vé",       tr:"v",   son:"« v » de valise (≠ B latin)",   ex:"вода",   exFr:"eau",      exTr:"va-DA",    group:2, piege:"Ressemble à B mais se dit « v »." },
  { up:"Е", low:"е", name:"yé",       tr:"ié",  son:"« yé » — mouille la consonne",  ex:"нет",    exFr:"non",      exTr:"niét",     group:2, piege:"Ce n'est pas « e » mais « yé »." },
  { up:"Н", low:"н", name:"en",       tr:"n",   son:"« n » de non (≠ H latin)",      ex:"нос",    exFr:"nez",      exTr:"nos",      group:2, piege:"Ressemble à H mais se dit « n »." },
  { up:"Р", low:"р", name:"er",       tr:"r",   son:"« r » roulé espagnol (≠ P)",    ex:"рука",   exFr:"main",     exTr:"rou-KA",   group:2, piege:"Ressemble à P mais c'est un « r » roulé." },
  { up:"С", low:"с", name:"es",       tr:"s",   son:"« s » de sac (≠ C latin)",      ex:"суп",    exFr:"soupe",    exTr:"soup",     group:2, piege:"Ressemble à C mais se dit « s »." },
  { up:"У", low:"у", name:"ou",       tr:"ou",  son:"« ou » de loup (≠ Y latin)",    ex:"утро",   exFr:"matin",    exTr:"OU-tra",   group:2, piege:"Ressemble à y mais se dit « ou »." },
  { up:"Х", low:"х", name:"kha",      tr:"kh",  son:"« kh » de la jota (≠ X latin)", ex:"хлеб",   exFr:"pain",     exTr:"khliép",   group:2, piege:"Ressemble à X mais c'est le « kh » raclé." },

  // — Groupe 3 : les nouvelles (forme neuve, son connu) —
  { up:"Б", low:"б", name:"bé",       tr:"b",   son:"« b » de bateau",               ex:"банан",  exFr:"banane",   exTr:"ba-NAN",   group:3 },
  { up:"Г", low:"г", name:"gué",      tr:"g",   son:"« g » dur de gare",             ex:"город",  exFr:"ville",    exTr:"GO-rat",   group:3 },
  { up:"Д", low:"д", name:"dé",       tr:"d",   son:"« d » de dame",                 ex:"дом",    exFr:"maison",   exTr:"dom",      group:3 },
  { up:"З", low:"з", name:"zé",       tr:"z",   son:"« z » de zèbre",                ex:"зима",   exFr:"hiver",    exTr:"zi-MA",    group:3 },
  { up:"И", low:"и", name:"i",        tr:"i",   son:"« i » de midi",                 ex:"имя",    exFr:"prénom",   exTr:"I-mia",    group:3 },
  { up:"Л", low:"л", name:"el",       tr:"l",   son:"« l » de lune",                 ex:"луна",   exFr:"lune",     exTr:"lou-NA",   group:3 },
  { up:"П", low:"п", name:"pé",       tr:"p",   son:"« p » de papa",                 ex:"папа",   exFr:"papa",     exTr:"PA-pa",    group:3 },
  { up:"Ф", low:"ф", name:"ef",       tr:"f",   son:"« f » de fleur",                ex:"фрукт",  exFr:"fruit",    exTr:"froukt",   group:3 },
  { up:"Э", low:"э", name:"é",        tr:"è",   son:"« è » de tête (sans mouiller)", ex:"это",    exFr:"ceci",     exTr:"E-ta",     group:3 },
  { up:"Й", low:"й", name:"i bref",   tr:"y",   son:"« y » de yoga, très bref",      ex:"мой",    exFr:"mon",      exTr:"moy",      group:3 },

  // — Groupe 4 : les chuintantes —
  { up:"Ж", low:"ж", name:"jé",       tr:"j",   son:"« j » de journal (dur)",        ex:"жара",   exFr:"chaleur",  exTr:"ja-RA",    group:4 },
  { up:"Ц", low:"ц", name:"tsé",      tr:"ts",  son:"« ts » de tsar",                ex:"цирк",   exFr:"cirque",   exTr:"tsirk",    group:4 },
  { up:"Ч", low:"ч", name:"tché",     tr:"tch", son:"« tch » de tchèque",            ex:"час",    exFr:"heure",    exTr:"tchas",    group:4 },
  { up:"Ш", low:"ш", name:"cha",      tr:"ch",  son:"« ch » de chat (dur)",          ex:"школа",  exFr:"école",    exTr:"CHKO-la",  group:4 },
  { up:"Щ", low:"щ", name:"chtcha",   tr:"chtch",son:"« chtch » mouillé, long",      ex:"щи",     exFr:"soupe aux choux", exTr:"chtchi", group:4 },

  // — Groupe 5 : voyelles iotées & signes —
  { up:"Ё", low:"ё", name:"yo",       tr:"io",  son:"« yo » — toujours accentué",    ex:"ёж",     exFr:"hérisson", exTr:"yoch",     group:5 },
  { up:"Ы", low:"ы", name:"y",        tr:"y",   son:"« i » guttural, langue en arrière", ex:"сын", exFr:"fils",    exTr:"syn",      group:5, piege:"Son sans équivalent français : « i » sombre." },
  { up:"Ю", low:"ю", name:"you",      tr:"iou", son:"« you » de youpi",              ex:"юг",     exFr:"sud",      exTr:"youg",     group:5 },
  { up:"Я", low:"я", name:"ya",       tr:"ia",  son:"« ya » de yack",                ex:"яблоко", exFr:"pomme",    exTr:"YA-bla-ka",group:5 },
  { up:"Ъ", low:"ъ", name:"signe dur",tr:"″",   son:"muet : sépare avant une voyelle iotée", ex:"подъезд", exFr:"entrée (d'immeuble)", exTr:"pad-YÉST", group:5, piege:"Aucun son propre : marque une coupure." },
  { up:"Ь", low:"ь", name:"signe mou",tr:"′",   son:"muet : mouille la consonne d'avant", ex:"день", exFr:"jour",  exTr:"dién'",    group:5, piege:"Aucun son propre : adoucit la consonne." },
];

DATA.alphabetGroups = [
  { id:1, titre:"Les vieilles connaissances", desc:"Même forme, même son qu'en français. Cadeau de bienvenue." },
  { id:2, titre:"Les faux amis",              desc:"Elles ont l'air latines… et se prononcent tout autrement. Le vrai piège." },
  { id:3, titre:"Les nouvelles têtes",        desc:"Formes inédites, mais des sons que tu connais déjà." },
  { id:4, titre:"Les chuintantes",            desc:"Les sons « ch / j / tch / ts ». La musique du russe." },
  { id:5, titre:"Voyelles iotées & signes",   desc:"Le « y » collé aux voyelles, et les deux signes sans son." },
];

/* -------------------- 2. PRONONCIATION (les règles d'or) -------------------- */

DATA.pronunciation = [
  { id:"stress", icon:"🎯", titre:"L'accent tonique est roi",
    corps:"Chaque mot russe a UNE syllabe accentuée, frappée fort. Elle change tout : la voyelle accentuée est pleine, les autres se réduisent. L'accent est **mobile et imprévisible** — il fait partie du mot, apprends-le avec.",
    exemples:[
      {ru:"молоко́", tr:"ma-la-KO", fr:"lait — 3 « o » écrits, un seul chante"},
      {ru:"хорошо́", tr:"kha-ra-SHO", fr:"bien"},
      {ru:"спаси́бо", tr:"spa-SI-ba", fr:"merci"},
    ]},
  { id:"akanye", icon:"🅾️", titre:"Le « o » non accentué devient « a »",
    corps:"C'est l'аканье. Dès qu'un « о » n'est PAS accentué, il se prononce « a » (voire un « e » sourd loin de l'accent). Règle n°1 qui trahit les débutants.",
    exemples:[
      {ru:"вода́", tr:"va-DA", fr:"eau (pas « vo-da »)"},
      {ru:"окно́", tr:"ak-NO", fr:"fenêtre"},
      {ru:"собáка", tr:"sa-BA-ka", fr:"chien"},
    ]},
  { id:"ikanye", icon:"🇪", titre:"Le « e » et « я » non accentués → « i »",
    corps:"Loin de l'accent, « е » et « я » glissent vers un « i » léger (иканье).",
    exemples:[
      {ru:"жена́", tr:"ji-NA", fr:"épouse"},
      {ru:"язы́к", tr:"i-ZYK", fr:"langue / langage"},
      {ru:"пятёрка", tr:"pi-TIOR-ka", fr:"un cinq (note)"},
    ]},
  { id:"final", icon:"🔚", titre:"Les sonores s'assourdissent en fin de mot",
    corps:"En finale, б→p, в→f, г→k, д→t, ж→ch, з→s. La consonne perd sa voix.",
    exemples:[
      {ru:"хлеб", tr:"khliép", fr:"pain (b → p)"},
      {ru:"город", tr:"GO-rat", fr:"ville (d → t)"},
      {ru:"муж", tr:"mouch", fr:"mari (ж → ch)"},
    ]},
  { id:"soft", icon:"🫧", titre:"Consonnes molles vs dures",
    corps:"Une consonne suivie de е, ё, и, ю, я ou du signe mou « ь » est MOLLE : on la mouille en rapprochant la langue du palais, comme un léger « y ». « ня » ≈ « gn » de agneau.",
    exemples:[
      {ru:"нет", tr:"niét", fr:"non (n mouillé)"},
      {ru:"день", tr:"dién'", fr:"jour (n final mouillé)"},
      {ru:"мать", tr:"mat'", fr:"mère (t final mouillé)"},
    ]},
  { id:"vo", icon:"🅾️", titre:"« Г » se dit parfois « v »",
    corps:"Dans les terminaisons -ого / -его (génitif), le г se prononce « v ». Un classique.",
    exemples:[
      {ru:"его́", tr:"yi-VO", fr:"lui / son (à lui)"},
      {ru:"сего́дня", tr:"si-VO-dnia", fr:"aujourd'hui"},
      {ru:"кра́сного", tr:"KRAS-na-va", fr:"rouge (génitif)"},
    ]},
];

/* -------------------- 3. VOCABULAIRE THÉMATIQUE -------------------- */

DATA.vocab = [
  { id:"salut", titre:"Salutations & politesse", icon:"👋", mots:[
    {ru:"Привет", tr:"pri-VIÈT", fr:"Salut (informel)"},
    {ru:"Здравствуйте", tr:"ZDRAST-vouy-tié", fr:"Bonjour (formel/pluriel)"},
    {ru:"Доброе утро", tr:"DO-bra-yé OU-tra", fr:"Bonjour (le matin)"},
    {ru:"Добрый день", tr:"DO-bryï dién'", fr:"Bonjour (la journée)"},
    {ru:"Добрый вечер", tr:"DO-bryï VIÉ-tchir", fr:"Bonsoir"},
    {ru:"Спокойной ночи", tr:"spa-KOÏ-naï NO-tchi", fr:"Bonne nuit"},
    {ru:"Пока", tr:"pa-KA", fr:"Salut ! (au revoir informel)"},
    {ru:"До свидания", tr:"da svi-DA-nia", fr:"Au revoir"},
    {ru:"Спасибо", tr:"spa-SI-ba", fr:"Merci"},
    {ru:"Пожалуйста", tr:"pa-JAL-sta", fr:"S'il te plaît / De rien"},
    {ru:"Извините", tr:"iz-vi-NI-tié", fr:"Excusez-moi"},
    {ru:"Да", tr:"da", fr:"Oui"},
    {ru:"Нет", tr:"niét", fr:"Non"},
    {ru:"Как дела?", tr:"kak di-LA", fr:"Comment ça va ?"},
    {ru:"Хорошо", tr:"kha-ra-SHO", fr:"Bien"},
  ]},
  { id:"gens", titre:"Les gens & la famille", icon:"👨‍👩‍👧", mots:[
    {ru:"человек", tr:"tchi-la-VIÉK", fr:"une personne"},
    {ru:"мужчина", tr:"mou-CHTCHI-na", fr:"un homme"},
    {ru:"женщина", tr:"JÉN-chtchi-na", fr:"une femme"},
    {ru:"мама", tr:"MA-ma", fr:"maman"},
    {ru:"папа", tr:"PA-pa", fr:"papa"},
    {ru:"мать", tr:"mat'", fr:"mère"},
    {ru:"отец", tr:"a-TIÉTS", fr:"père"},
    {ru:"сын", tr:"syn", fr:"fils"},
    {ru:"дочь", tr:"dotch", fr:"fille (de qqn)"},
    {ru:"брат", tr:"brat", fr:"frère"},
    {ru:"сестра", tr:"sis-TRA", fr:"sœur"},
    {ru:"друг", tr:"drouk", fr:"ami"},
    {ru:"муж", tr:"mouch", fr:"mari"},
    {ru:"жена", tr:"ji-NA", fr:"épouse"},
    {ru:"ребёнок", tr:"ri-BIO-nak", fr:"enfant"},
  ]},
  { id:"nombres", titre:"Les nombres", icon:"🔢", mots:[
    {ru:"ноль", tr:"nol'", fr:"0"},
    {ru:"один", tr:"a-DIN", fr:"1"},
    {ru:"два", tr:"dva", fr:"2"},
    {ru:"три", tr:"tri", fr:"3"},
    {ru:"четыре", tr:"tchi-TY-ri", fr:"4"},
    {ru:"пять", tr:"piat'", fr:"5"},
    {ru:"шесть", tr:"chést'", fr:"6"},
    {ru:"семь", tr:"siém'", fr:"7"},
    {ru:"восемь", tr:"VO-sim'", fr:"8"},
    {ru:"девять", tr:"DIÉ-vit'", fr:"9"},
    {ru:"десять", tr:"DIÉ-sit'", fr:"10"},
    {ru:"двадцать", tr:"DVA-tsat'", fr:"20"},
    {ru:"сто", tr:"sto", fr:"100"},
    {ru:"тысяча", tr:"TY-si-tcha", fr:"1000"},
  ]},
  { id:"bouffe", titre:"Manger & boire", icon:"🍽️", mots:[
    {ru:"вода", tr:"va-DA", fr:"eau"},
    {ru:"чай", tr:"tchaï", fr:"thé"},
    {ru:"кофе", tr:"KO-fié", fr:"café"},
    {ru:"хлеб", tr:"khliép", fr:"pain"},
    {ru:"молоко", tr:"ma-la-KO", fr:"lait"},
    {ru:"мясо", tr:"MIA-sa", fr:"viande"},
    {ru:"рыба", tr:"RY-ba", fr:"poisson"},
    {ru:"сыр", tr:"syr", fr:"fromage"},
    {ru:"яблоко", tr:"YA-bla-ka", fr:"pomme"},
    {ru:"суп", tr:"soup", fr:"soupe"},
    {ru:"пиво", tr:"PI-va", fr:"bière"},
    {ru:"вино", tr:"vi-NO", fr:"vin"},
    {ru:"завтрак", tr:"ZAF-trak", fr:"petit-déjeuner"},
    {ru:"ужин", tr:"OU-jyn", fr:"dîner"},
    {ru:"вкусно", tr:"FKOUS-na", fr:"c'est bon (goût)"},
  ]},
  { id:"ville", titre:"En ville", icon:"🏙️", mots:[
    {ru:"город", tr:"GO-rat", fr:"ville"},
    {ru:"улица", tr:"OU-li-tsa", fr:"rue"},
    {ru:"дом", tr:"dom", fr:"maison / immeuble"},
    {ru:"магазин", tr:"ma-ga-ZIN", fr:"magasin"},
    {ru:"ресторан", tr:"ris-ta-RAN", fr:"restaurant"},
    {ru:"метро", tr:"mi-TRO", fr:"métro"},
    {ru:"вокзал", tr:"vag-ZAL", fr:"gare"},
    {ru:"аэропорт", tr:"a-e-ra-PORT", fr:"aéroport"},
    {ru:"туалет", tr:"tou-a-LIÉT", fr:"toilettes"},
    {ru:"больница", tr:"bal'-NI-tsa", fr:"hôpital"},
    {ru:"аптека", tr:"ap-TIÉ-ka", fr:"pharmacie"},
    {ru:"банк", tr:"bank", fr:"banque"},
    {ru:"площадь", tr:"PLO-chtchit'", fr:"place (publique)"},
    {ru:"парк", tr:"park", fr:"parc"},
  ]},
  { id:"temps", titre:"Le temps qui passe", icon:"📅", mots:[
    {ru:"день", tr:"dién'", fr:"jour"},
    {ru:"неделя", tr:"ni-DIÉ-lia", fr:"semaine"},
    {ru:"месяц", tr:"MIÉ-sits", fr:"mois"},
    {ru:"год", tr:"got", fr:"année"},
    {ru:"сегодня", tr:"si-VO-dnia", fr:"aujourd'hui"},
    {ru:"завтра", tr:"ZAF-tra", fr:"demain"},
    {ru:"вчера", tr:"ftchi-RA", fr:"hier"},
    {ru:"сейчас", tr:"si-TCHAS", fr:"maintenant"},
    {ru:"утро", tr:"OU-tra", fr:"matin"},
    {ru:"вечер", tr:"VIÉ-tchir", fr:"soir"},
    {ru:"ночь", tr:"notch", fr:"nuit"},
    {ru:"понедельник", tr:"pa-ni-DIÉL'-nik", fr:"lundi"},
    {ru:"суббота", tr:"sou-BO-ta", fr:"samedi"},
    {ru:"время", tr:"VRIÉ-mia", fr:"temps / heure"},
  ]},
  { id:"verbes", titre:"Verbes essentiels", icon:"⚡", mots:[
    {ru:"быть", tr:"byt'", fr:"être"},
    {ru:"иметь", tr:"i-MIÉT'", fr:"avoir"},
    {ru:"делать", tr:"DIÉ-lat'", fr:"faire"},
    {ru:"говорить", tr:"ga-va-RIT'", fr:"parler"},
    {ru:"знать", tr:"znat'", fr:"savoir"},
    {ru:"хотеть", tr:"kha-TIÉT'", fr:"vouloir"},
    {ru:"мочь", tr:"motch", fr:"pouvoir"},
    {ru:"идти", tr:"it-TI", fr:"aller (à pied)"},
    {ru:"есть", tr:"iést'", fr:"manger"},
    {ru:"пить", tr:"pit'", fr:"boire"},
    {ru:"любить", tr:"liou-BIT'", fr:"aimer"},
    {ru:"жить", tr:"jyt'", fr:"vivre"},
    {ru:"работать", tr:"ra-BO-tat'", fr:"travailler"},
    {ru:"читать", tr:"tchi-TAT'", fr:"lire"},
    {ru:"понимать", tr:"pa-ni-MAT'", fr:"comprendre"},
  ]},
  { id:"adj", titre:"Adjectifs & descriptions", icon:"🎨", mots:[
    {ru:"большой", tr:"bal'-CHOÏ", fr:"grand"},
    {ru:"маленький", tr:"MA-lin'-kiï", fr:"petit"},
    {ru:"хороший", tr:"kha-RO-chiï", fr:"bon / bien"},
    {ru:"плохой", tr:"pla-KHOÏ", fr:"mauvais"},
    {ru:"новый", tr:"NO-vyï", fr:"nouveau"},
    {ru:"старый", tr:"STA-ryï", fr:"vieux"},
    {ru:"красивый", tr:"kra-SI-vyï", fr:"beau"},
    {ru:"горячий", tr:"ga-RIA-tchiï", fr:"chaud"},
    {ru:"холодный", tr:"kha-LO-dnyï", fr:"froid"},
    {ru:"красный", tr:"KRAS-nyï", fr:"rouge"},
    {ru:"белый", tr:"BIÉ-lyï", fr:"blanc"},
    {ru:"чёрный", tr:"TCHIOR-nyï", fr:"noir"},
    {ru:"дорогой", tr:"da-ra-GOÏ", fr:"cher / précieux"},
    {ru:"быстрый", tr:"BYS-tryï", fr:"rapide"},
  ]},
  { id:"outils", titre:"Petits mots utiles", icon:"🧩", mots:[
    {ru:"я", tr:"ya", fr:"je"},
    {ru:"ты", tr:"ty", fr:"tu"},
    {ru:"он", tr:"on", fr:"il"},
    {ru:"она", tr:"a-NA", fr:"elle"},
    {ru:"мы", tr:"my", fr:"nous"},
    {ru:"вы", tr:"vy", fr:"vous"},
    {ru:"это", tr:"E-ta", fr:"c'est / ceci"},
    {ru:"кто", tr:"kto", fr:"qui"},
    {ru:"что", tr:"chto", fr:"quoi / que"},
    {ru:"где", tr:"gdié", fr:"où"},
    {ru:"когда", tr:"kag-DA", fr:"quand"},
    {ru:"почему", tr:"pa-tchi-MOU", fr:"pourquoi"},
    {ru:"и", tr:"i", fr:"et"},
    {ru:"но", tr:"no", fr:"mais"},
    {ru:"очень", tr:"O-tchin'", fr:"très"},
  ]},
];

/* -------------------- 4. PHRASES PAR SITUATION -------------------- */

DATA.phrases = [
  { id:"presenter", titre:"Se présenter", icon:"🙋", items:[
    {ru:"Меня зовут Тома.", tr:"mi-NIA za-VOUT Toma", fr:"Je m'appelle Thomas."},
    {ru:"Как вас зовут?", tr:"kak vas za-VOUT", fr:"Comment vous appelez-vous ?"},
    {ru:"Очень приятно.", tr:"O-tchin' pri-YAT-na", fr:"Enchanté."},
    {ru:"Я из Франции.", tr:"ya iz FRAN-tsyi", fr:"Je viens de France."},
    {ru:"Я не говорю по-русски.", tr:"ya ni ga-va-RIOU pa-ROUS-ki", fr:"Je ne parle pas russe."},
    {ru:"Я немного понимаю.", tr:"ya nim-NO-ga pa-ni-MA-you", fr:"Je comprends un peu."},
    {ru:"Вы говорите по-английски?", tr:"vy ga-va-RI-tié pa-an-GLIÏ-ski", fr:"Vous parlez anglais ?"},
  ]},
  { id:"cafe", titre:"Au café / restaurant", icon:"☕", items:[
    {ru:"Один кофе, пожалуйста.", tr:"a-DIN KO-fié pa-JAL-sta", fr:"Un café, s'il vous plaît."},
    {ru:"Меню, пожалуйста.", tr:"mi-NIOU pa-JAL-sta", fr:"Le menu, s'il vous plaît."},
    {ru:"Сколько это стоит?", tr:"SKOL'-ka E-ta STO-it", fr:"Combien ça coûte ?"},
    {ru:"Счёт, пожалуйста.", tr:"chtchiot pa-JAL-sta", fr:"L'addition, s'il vous plaît."},
    {ru:"Это очень вкусно.", tr:"E-ta O-tchin' FKOUS-na", fr:"C'est très bon."},
    {ru:"Я вегетарианец.", tr:"ya vi-gi-ta-ri-A-nits", fr:"Je suis végétarien."},
    {ru:"Воду без газа.", tr:"VO-dou biz GA-za", fr:"De l'eau plate."},
  ]},
  { id:"chemin", titre:"Demander son chemin", icon:"🧭", items:[
    {ru:"Где метро?", tr:"gdié mi-TRO", fr:"Où est le métro ?"},
    {ru:"Где туалет?", tr:"gdié tou-a-LIÉT", fr:"Où sont les toilettes ?"},
    {ru:"Как пройти в центр?", tr:"kak praï-TI f tsentr", fr:"Comment aller au centre ?"},
    {ru:"Это далеко?", tr:"E-ta da-li-KO", fr:"C'est loin ?"},
    {ru:"Направо.", tr:"na-PRA-va", fr:"À droite."},
    {ru:"Налево.", tr:"na-LIÉ-va", fr:"À gauche."},
    {ru:"Прямо.", tr:"PRIA-ma", fr:"Tout droit."},
  ]},
  { id:"achats", titre:"Faire des achats", icon:"🛍️", items:[
    {ru:"Сколько стоит?", tr:"SKOL'-ka STO-it", fr:"Combien ça coûte ?"},
    {ru:"Это дорого.", tr:"E-ta DO-ra-ga", fr:"C'est cher."},
    {ru:"У вас есть...?", tr:"ou vas iést'", fr:"Avez-vous… ?"},
    {ru:"Я возьму это.", tr:"ya vaz'-MOU E-ta", fr:"Je prends ça."},
    {ru:"Можно картой?", tr:"MOJ-na KAR-taï", fr:"Je peux payer par carte ?"},
    {ru:"Дайте, пожалуйста.", tr:"DAÏ-tié pa-JAL-sta", fr:"Donnez-moi, s'il vous plaît."},
  ]},
  { id:"urgence", titre:"En cas de pépin", icon:"🚨", items:[
    {ru:"Помогите!", tr:"pa-ma-GHI-tié", fr:"Au secours !"},
    {ru:"Мне нужен врач.", tr:"mnié NOU-jyn vratch", fr:"J'ai besoin d'un médecin."},
    {ru:"Вызовите полицию.", tr:"VY-za-vi-tié pa-LI-tsyou", fr:"Appelez la police."},
    {ru:"Я потерялся.", tr:"ya pa-ti-RIAL-sia", fr:"Je me suis perdu."},
    {ru:"Я не понимаю.", tr:"ya ni pa-ni-MA-you", fr:"Je ne comprends pas."},
    {ru:"Повторите, пожалуйста.", tr:"paf-ta-RI-tié pa-JAL-sta", fr:"Répétez, s'il vous plaît."},
  ]},
  { id:"smalltalk", titre:"Papoter", icon:"💬", items:[
    {ru:"Как дела?", tr:"kak di-LA", fr:"Comment ça va ?"},
    {ru:"Всё хорошо.", tr:"fsio kha-ra-SHO", fr:"Tout va bien."},
    {ru:"Как тебя зовут?", tr:"kak ti-BIA za-VOUT", fr:"Comment tu t'appelles ?"},
    {ru:"Сколько тебе лет?", tr:"SKOL'-ka ti-BIÉ liét", fr:"Quel âge as-tu ?"},
    {ru:"Мне двадцать один год.", tr:"mnié DVA-tsat' a-DIN got", fr:"J'ai 21 ans."},
    {ru:"Что нового?", tr:"chto NO-va-va", fr:"Quoi de neuf ?"},
    {ru:"До скорого!", tr:"da SKO-ra-va", fr:"À bientôt !"},
  ]},
];

/* -------------------- 5. GRAMMAIRE (leçons progressives) -------------------- */
/* blocks: {type:'p'|'exs'|'tip'|'table', ...} */

DATA.grammar = [
  { id:"g_zero", titre:"Ce que le russe n'a PAS", icon:"🎁", niveau:"A0",
    blocks:[
      {type:"p", texte:"Bonne nouvelle pour commencer. Le russe supprime trois choses qui te compliquent la vie en français/anglais."},
      {type:"tip", texte:"Pas d'articles : ni « le/la/un/une ». « стол » = table, la table, une table. Le contexte décide."},
      {type:"tip", texte:"Pas de « être » au présent : « Я студент » = « Je [suis] étudiant ». Le verbe est sous-entendu."},
      {type:"tip", texte:"Pas de « do/does » ni de temps composés à rallonge. La conjugaison est directe."},
      {type:"exs", items:[
        {ru:"Я студент.", tr:"ya stou-DIÉNT", fr:"Je suis étudiant."},
        {ru:"Это книга.", tr:"E-ta KNI-ga", fr:"C'est un livre."},
        {ru:"Он дома.", tr:"on DO-ma", fr:"Il est à la maison."},
      ]},
    ]},
  { id:"g_genre", titre:"Les 3 genres : masc / fém / neutre", icon:"⚧", niveau:"A1",
    blocks:[
      {type:"p", texte:"Chaque nom a un genre, lisible sur sa DERNIÈRE lettre. Règle simple à 90 %."},
      {type:"table", head:["Fin du mot","Genre","Exemple"], rows:[
        ["consonne","masculin","стол (table), дом (maison)"],
        ["-й","masculin","музей (musée)"],
        ["-а / -я","féminin","мама, неделя (semaine)"],
        ["-о / -е","neutre","окно (fenêtre), море (mer)"],
        ["-ь","masc. OU fém.","à apprendre au cas par cas (день masc., ночь fém.)"],
      ]},
      {type:"tip", texte:"Le genre commande ensuite l'adjectif et le passé du verbe. C'est la clé de voûte, apprends-le AVEC chaque mot."},
    ]},
  { id:"g_pluriel", titre:"Le pluriel", icon:"➕", niveau:"A1",
    blocks:[
      {type:"p", texte:"Au nominatif pluriel, la terminaison dépend du genre."},
      {type:"table", head:["Genre","Singulier → Pluriel","Exemple"], rows:[
        ["masc.","consonne → -ы / -и","стол → столы (tables)"],
        ["fém.","-а → -ы / -и","карта → карты (cartes)"],
        ["neutre","-о → -а","окно → окна (fenêtres)"],
      ]},
      {type:"tip", texte:"Règle d'orthographe : après г к х ж ш щ ч, on écrit -и (jamais -ы). книга → книги."},
    ]},
  { id:"g_pron", titre:"Les pronoms personnels", icon:"🧍", niveau:"A1",
    blocks:[
      {type:"table", head:["Russe","Prononc.","Français"], rows:[
        ["я","ya","je"],["ты","ty","tu"],["он / она / оно","on / a-NA / a-NO","il / elle / (neutre)"],
        ["мы","my","nous"],["вы","vy","vous"],["они","a-NI","ils / elles"],
      ]},
      {type:"tip", texte:"« вы » = vous de politesse ET vous pluriel, exactement comme en français."},
    ]},
  { id:"g_present1", titre:"Le présent (1re conjugaison, -ешь)", icon:"⏱️", niveau:"A1",
    blocks:[
      {type:"p", texte:"La majorité des verbes en -ать/-ять suivent ce modèle. Exemple : работать (travailler) → radical рабо́та-."},
      {type:"table", head:["Pronom","Forme","Prononc."], rows:[
        ["я","работаю","ra-BO-ta-you"],["ты","работаешь","ra-BO-ta-yich"],["он/она","работает","ra-BO-ta-yit"],
        ["мы","работаем","ra-BO-ta-yim"],["вы","работаете","ra-BO-ta-yi-tié"],["они","работают","ra-BO-ta-yout"],
      ]},
      {type:"tip", texte:"Terminaisons à mémoriser : -ю, -ешь, -ет, -ем, -ете, -ют."},
    ]},
  { id:"g_present2", titre:"Le présent (2e conjugaison, -ишь)", icon:"⏱️", niveau:"A1",
    blocks:[
      {type:"p", texte:"Les verbes en -ить suivent ce modèle. Exemple : говорить (parler) → радикал говор-."},
      {type:"table", head:["Pronom","Forme","Prononc."], rows:[
        ["я","говорю","ga-va-RIOU"],["ты","говоришь","ga-va-RICH"],["он/она","говорит","ga-va-RIT"],
        ["мы","говорим","ga-va-RIM"],["вы","говорите","ga-va-RI-tié"],["они","говорят","ga-va-RIAT"],
      ]},
      {type:"tip", texte:"Terminaisons : -ю/-у, -ишь, -ит, -им, -ите, -ят/-ат."},
    ]},
  { id:"g_cas_intro", titre:"Les 6 cas : le grand saut", icon:"🎢", niveau:"A2",
    blocks:[
      {type:"p", texte:"LE cœur du russe. La terminaison d'un nom change selon sa FONCTION dans la phrase. En français c'est la place des mots qui décide ; en russe, c'est la terminaison. Résultat : l'ordre des mots devient libre."},
      {type:"table", head:["Cas","Question","Rôle principal"], rows:[
        ["Nominatif","кто? что?","le SUJET"],
        ["Génitif","кого? чего?","possession, « de », négation, après un nombre"],
        ["Datif","кому? чему?","le destinataire, « à »"],
        ["Accusatif","кого? что?","le COD (objet direct)"],
        ["Instrumental","кем? чем?","le moyen, « avec / par »"],
        ["Prépositionnel","о ком? о чём?","localisation, après о, в, на"],
      ]},
      {type:"tip", texte:"Ne panique pas : on les prend un par un. Vois-les comme des « costumes » que le mot enfile selon son job dans la phrase."},
    ]},
  { id:"g_accusatif", titre:"L'accusatif (le COD)", icon:"🎯", niveau:"A2",
    blocks:[
      {type:"p", texte:"C'est l'objet de l'action : « Je lis LE LIVRE ». Masculin inanimé et neutre ne changent pas. Le féminin -а devient -у."},
      {type:"exs", items:[
        {ru:"Я читаю книгу.", tr:"ya tchi-TA-you KNI-gou", fr:"Je lis un livre. (книга → книгу)"},
        {ru:"Я люблю музыку.", tr:"ya liou-BLIOU MOU-zy-kou", fr:"J'aime la musique. (музыка → музыку)"},
        {ru:"Я вижу дом.", tr:"ya VI-jou dom", fr:"Je vois la maison. (masc. inchangé)"},
      ]},
      {type:"tip", texte:"Masc. ANIMÉ (une personne, un animal) prend la forme du génitif : « Я вижу брата » (je vois mon frère)."},
    ]},
  { id:"g_prepositionnel", titre:"Le prépositionnel (où ?)", icon:"📍", niveau:"A2",
    blocks:[
      {type:"p", texte:"Toujours après une préposition, surtout в (dans) et на (sur/à) pour dire OÙ. Terminaison quasi universelle : -е."},
      {type:"exs", items:[
        {ru:"Я живу в Москве.", tr:"ya ji-VOU v mask-VIÉ", fr:"J'habite à Moscou. (Москва → Москве)"},
        {ru:"Книга на столе.", tr:"KNI-ga na sta-LIÉ", fr:"Le livre est sur la table. (стол → столе)"},
        {ru:"Я думаю о тебе.", tr:"ya DOU-ma-you a ti-BIÉ", fr:"Je pense à toi."},
      ]},
      {type:"tip", texte:"в + prépositionnel = localisation (« dans, à »). в + accusatif = mouvement (« vers »)."},
    ]},
  { id:"g_genitif", titre:"Le génitif (de / négation)", icon:"🚫", niveau:"A2",
    blocks:[
      {type:"p", texte:"Le cas le plus utilisé. Il dit « de » (possession, origine), sert pour la négation d'existence, après beaucoup de prépositions et après les nombres 2-4 (singulier) et 5+ (pluriel)."},
      {type:"exs", items:[
        {ru:"Это книга брата.", tr:"E-ta KNI-ga BRA-ta", fr:"C'est le livre du frère. (брат → брата)"},
        {ru:"У меня нет времени.", tr:"ou mi-NIA niét VRIÉ-mi-ni", fr:"Je n'ai pas le temps."},
        {ru:"Чашка чая.", tr:"TCHACH-ka TCHA-ya", fr:"Une tasse de thé."},
      ]},
      {type:"tip", texte:"La possession se dit « У меня есть… » (litt. « chez moi il y a… ») = j'ai. Négation : « У меня нет… » + génitif."},
    ]},
  { id:"g_passe", titre:"Le passé (facile !)", icon:"⏪", niveau:"A1",
    blocks:[
      {type:"p", texte:"Étonnamment simple : on retire -ть de l'infinitif et on ajoute une terminaison qui s'accorde… avec le GENRE, pas la personne."},
      {type:"table", head:["Sujet","Terminaison","Exemple (работать)"], rows:[
        ["il / masc.","-л","работал (ra-BO-tal)"],
        ["elle / fém.","-ла","работала (ra-BO-ta-la)"],
        ["neutre","-ло","работало"],
        ["pluriel","-ли","работали (ra-BO-ta-li)"],
      ]},
      {type:"tip", texte:"« Я читал » = j'ai lu (dit par un homme) ; « Я читала » = par une femme. Le genre du LOCUTEUR compte."},
    ]},
  { id:"g_futur", titre:"Le futur", icon:"⏩", niveau:"A2",
    blocks:[
      {type:"p", texte:"Deux voies. Futur composé : быть conjugué + infinitif imperfectif (action en cours/répétée). Futur simple : on conjugue directement le verbe perfectif au présent (action ponctuelle terminée)."},
      {type:"exs", items:[
        {ru:"Я буду читать.", tr:"ya BOU-dou tchi-TAT'", fr:"Je vais lire / je lirai (durée)."},
        {ru:"Я прочитаю книгу.", tr:"ya pra-tchi-TA-you KNI-gou", fr:"Je lirai (finirai) le livre."},
        {ru:"Завтра будет дождь.", tr:"ZAF-tra BOU-dit dojd'", fr:"Demain il pleuvra."},
      ]},
      {type:"tip", texte:"быть au futur : буду, будешь, будет, будем, будете, будут."},
    ]},
  { id:"g_aspect", titre:"L'aspect : perfectif vs imperfectif", icon:"⚔️", niveau:"B1",
    blocks:[
      {type:"p", texte:"LA singularité russe. Chaque verbe existe en paire. L'IMPERFECTIF décrit le processus, l'habitude, la répétition (« lire, être en train de lire »). Le PERFECTIF décrit le résultat, l'action unique et achevée (« avoir lu jusqu'au bout »)."},
      {type:"table", head:["Imperfectif","Perfectif","Sens"], rows:[
        ["читать","прочитать","lire"],
        ["делать","сделать","faire"],
        ["писать","написать","écrire"],
        ["говорить","сказать","dire / parler"],
      ]},
      {type:"exs", items:[
        {ru:"Я читал книгу.", tr:"ya tchi-TAL KNI-gou", fr:"Je lisais un livre (processus)."},
        {ru:"Я прочитал книгу.", tr:"ya pra-tchi-TAL KNI-gou", fr:"J'ai lu le livre (fini !)."},
      ]},
      {type:"tip", texte:"Réflexe : processus/durée/habitude → imperfectif. Résultat/une fois/fini → perfectif. Souvent un préfixe (про-, с-, на-) rend le verbe perfectif."},
    ]},
  { id:"g_mouvement", titre:"Aller à pied vs en véhicule", icon:"🚶", niveau:"A2",
    blocks:[
      {type:"p", texte:"Le russe distingue le déplacement à pied et le déplacement en transport. Deux verbes différents pour « aller »."},
      {type:"exs", items:[
        {ru:"Я иду домой.", tr:"ya i-DOU da-MOÏ", fr:"Je rentre (à pied)."},
        {ru:"Я еду в Москву.", tr:"ya YÉ-dou v mask-VOU", fr:"Je vais à Moscou (en transport)."},
        {ru:"Куда ты идёшь?", tr:"kou-DA ty i-DIOCH", fr:"Où vas-tu (à pied) ?"},
      ]},
      {type:"tip", texte:"идти = à pied · ехать = par un moyen de transport. Ne les confonds jamais, un Russe le remarque immédiatement."},
    ]},
];

/* -------------------- 6. CLAVIER CYRILLIQUE (disposition ЙЦУКЕН) -------------------- */
DATA.keyboardRows = [
  ["й","ц","у","к","е","н","г","ш","щ","з","х","ъ"],
  ["ф","ы","в","а","п","р","о","л","д","ж","э"],
  ["я","ч","с","м","и","т","ь","б","ю"],
];

if (typeof module !== "undefined") module.exports = DATA;
