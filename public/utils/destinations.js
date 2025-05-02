/**
 * 日本と海外の観光地英語変換辞書
 * server.jsとscript.jsの両方で使用するための共有ファイル
 */

//日本の観光地の辞書リスト
 const japaneseDestinations = {
    // 北海道エリア
    '北海道': 'Hokkaido',
    '札幌': 'Sapporo',
    '函館': 'Hakodate',
    '小樽': 'Otaru',
    '旭川': 'Asahikawa',
    '富良野': 'Furano',
    '美瑛': 'Biei',
    '知床': 'Shiretoko',
    '洞爺湖': 'Lake Toya',
    '積丹半島': 'Shakotan Peninsula',
    '登別': 'Noboribetsu',
    '釧路湿原': 'Kushiro Marshland',
    '層雲峡': 'Sounkyo Gorge',
    'ニセコ': 'Niseko',
    '支笏湖': 'Lake Shikotsu',
    '摩周湖': 'Lake Mashu',
    '阿寒湖': 'Lake Akan',
    '帯広': 'Obihiro',
    '稚内': 'Wakkanai',
    '網走': 'Abashiri',

    // 東北エリア
    '青森': 'Aomori',
    '弘前': 'Hirosaki',
    '八甲田山': 'Mount Hakkoda',
    '秋田': 'Akita',
    '田沢湖': 'Lake Tazawa',
    '仙台': 'Sendai',
    '松島': 'Matsushima',
    '鳴子温泉': 'Naruko Onsen',
    '蔵王': 'Zao',
    '山形': 'Yamagata',
    '福島': 'Fukushima',
    '会津若松': 'Aizuwakamatsu',
    '岩手': 'Iwate',
    '平泉': 'Hiraizumi',
    '十和田湖': 'Lake Towada',
    '八幡平': 'Hachimantai',
    '角館': 'Kakunodate',
    '銀山温泉': 'Ginzan Onsen',
    '猪苗代湖': 'Lake Inawashiro',
    '五色沼': 'Goshikinuma',

    // 関東エリア
    '東京': 'Tokyo',
    '横浜': 'Yokohama',
    '鎌倉': 'Kamakura',
    '箱根': 'Hakone',
    '日光': 'Nikko',
    '草津温泉': 'Kusatsu Onsen',
    '伊香保温泉': 'Ikaho Onsen',
    '四万温泉': 'Shima Onsen',
    '川越': 'Kawagoe',
    '秩父': 'Chichibu',
    '水上': 'Minakami',
    '浅草': 'Asakusa',
    '渋谷': 'Shibuya',
    '新宿': 'Shinjuku',
    '上野': 'Ueno',
    '銀座': 'Ginza',
    '江ノ島': 'Enoshima',
    '横須賀': 'Yokosuka',
    '成田': 'Narita',
    '幕張': 'Makuhari',
    'お台場': 'Odaiba',
    'みなとみらい': 'Minato Mirai',
    '木更津': 'Kisarazu',
    '筑波山': 'Mount Tsukuba',
    '足利': 'Ashikagi',

    // 中部エリア
    '金沢': 'Kanazawa',
    '富山': 'Toyama',
    '高山': 'Takayama',
    '白川郷': 'Shirakawa-go',
    '能登半島': 'Noto Peninsula',
    '立山黒部': 'Tateyama Kurobe',
    '福井': 'Fukui',
    '永平寺': 'Eiheiji Temple',
    '東尋坊': 'Tojinbo',
    '妙高高原': 'Myoko Kogen',
    '兼六園': 'Kenrokuen Garden',
    '黒部峡谷': 'Kurobe Gorge',
    '氷見': 'Himi',
    '五箇山': 'Gokayama',
    '飛騨': 'Hida',
    '加賀': 'Kaga',
    '芦原温泉': 'Awara Onsen',
    '越前': 'Echizen',
    '雨晴海岸': 'Amaharashi Coast',
    '白米千枚田': 'Shiroyone Senmaida',

    // 中部・甲信越エリア
    '富士山': 'Mount Fuji',
    '河口湖': 'Lake Kawaguchiko',
    '山中湖': 'Lake Yamanakako',
    '松本': 'Matsumoto',
    '上高地': 'Kamikochi',
    '諏訪湖': 'Lake Suwa',
    '軽井沢': 'Karuizawa',
    '志賀高原': 'Shiga Kogen',
    '安曇野': 'Azumino',
    '清里高原': 'Kiyosato Highlands',
    '戸隠': 'Togakushi',
    '湯田中渋温泉郷': 'Yudanaka Shibu Onsen',
    '草津': 'Kusatsu',
    '長野': 'Nagano',
    '八ヶ岳': 'Yatsugatake',
    '白樺湖': 'Lake Shirakaba',
    '野沢温泉': 'Nozawa Onsen',
    '浅間山': 'Mount Asama',
    '妙高': 'Myoko',
    '昇仙峡': 'Shosenkyo Gorge',

    // 東海エリア
    '名古屋': 'Nagoya',
    '伊勢': 'Ise',
    '熱海': 'Atami',
    '伊豆': 'Izu',
    '下呂温泉': 'Gero Onsen',
    '飛騨高山': 'Hida Takayama',
    '静岡': 'Shizuoka',
    '浜松': 'Hamamatsu',
    '犬山': 'Inuyama',
    '鳳来寺山': 'Mount Horaiji',
    '伊豆半島': 'Izu Peninsula',
    '伊良湖岬': 'Cape Irago',
    '三河湾': 'Mikawa Bay',
    '常滑': 'Tokoname',
    '長良川': 'Nagara River',
    '焼津': 'Yaizu',
    '三保の松原': 'Miho no Matsubara',
    '城ヶ崎海岸': 'Jogasaki Coast',
    '修善寺': 'Shuzenji',
    '御殿場': 'Gotemba',

    // 近畿エリア
    '京都': 'Kyoto',
    '大阪': 'Osaka',
    '神戸': 'Kobe',
    '奈良': 'Nara',
    '姫路': 'Himeji',
    '和歌山': 'Wakayama',
    '白浜': 'Shirahama',
    '城崎温泉': 'Kinosaki Onsen',
    '有馬温泉': 'Arima Onsen',
    '竹田城跡': 'Takeda Castle Ruins',
    '天橋立': 'Amanohashidate',
    '伏見稲荷': 'Fushimi Inari',
    '嵐山': 'Arashiyama',
    '比叡山': 'Mount Hiei',
    '高野山': 'Mount Koya',
    '明石': 'Akashi',
    '吉野山': 'Mount Yoshino',
    '法隆寺': 'Horyuji Temple',
    '橿原': 'Kashihara',

    // 中国エリア
    '広島': 'Hiroshima',
    '宮島': 'Miyajima',
    '岡山': 'Okayama',
    '鳥取砂丘': 'Tottori Sand Dunes',
    '出雲': 'Izumo',
    '松江': 'Matsue',
    '萩': 'Hagi',
    '津和野': 'Tsuwano',
    '尾道': 'Onomichi',
    '倉敷': 'Kurashiki',
    '安芸の宮島': 'Aki no Miyajima',
    '原爆ドーム': 'Atomic Bomb Dome',
    '後楽園': 'Korakuen Garden',
    '大山': 'Mount Daisen',
    '三朝温泉': 'Misasa Onsen',
    '秋吉台': 'Akiyoshidai',
    '石見銀山': 'Iwami Ginzan',
    '境港': 'Sakaiminato',
    '鞆の浦': 'Tomonoura',
    '湯原温泉': 'Yubara Onsen',

    // 四国エリア
    '高知': 'Kochi',
    '松山': 'Matsuyama',
    '道後温泉': 'Dogo Onsen',
    '高松': 'Takamatsu',
    '直島': 'Naoshima',
    '祖谷渓': 'Iya Valley',
    '四万十川': 'Shimanto River',
    '栗林公園': 'Ritsurin Garden',
    '小豆島': 'Shodoshima',
    '室戸岬': 'Cape Muroto',
    '足摺岬': 'Cape Ashizuri',
    '屋島': 'Yashima',
    '琴平': 'Kotohira',
    '大歩危小歩危': 'Oboke Koboke',
    '竜串海岸': 'Ryugu Coast',
    '中津渓谷': 'Nakatsu Valley',
    '内子': 'Uchiko',
    '淡路島': 'Awaji Island',
    '砥部': 'Tobe',
    '四国カルスト': 'Shikoku Karst',

    // 九州エリア
    '福岡': 'Fukuoka',
    '長崎': 'Nagasaki',
    '熊本': 'Kumamoto',
    '阿蘇': 'Aso',
    '別府': 'Beppu',
    '由布院': 'Yufuin',
    '佐賀': 'Saga',
    '鹿児島': 'Kagoshima',
    '屋久島': 'Yakushima',
    '嬉野温泉': 'Ureshino Onsen',
    '天草': 'Amakusa',
    '黒川温泉': 'Kurokawa Onsen',
    '杵築': 'Kitsuki',
    '耶馬渓': 'Yabakei',
    '太宰府': 'Dazaifu',
    '指宿': 'Ibusuki',
    '桜島': 'Sakurajima',
    '長崎ハウステンボス': 'Huis Ten Bosch Nagasaki',
    '柳川': 'Yanagawa',
    '日田': 'Hita',

    // 沖縄エリア
    '沖縄': 'Okinawa',
    '石垣島': 'Ishigaki Island',
    '竹富島': 'Taketomi Island',
    '宮古島': 'Miyako Island',
    '座間味島': 'Zamami Island',
    '西表島': 'Iriomote Island',
    '那覇': 'Naha',
    '美ら海水族館': 'Churaumi Aquarium',
    '古宇利島': 'Kouri Island',
    '瀬底島': 'Sesoko Island',
    '波照間島': 'Hateruma Island',
    '伊良部島': 'Irabu Island',
    '小浜島': 'Kohama Island',
    '与那国島': 'Yonaguni Island',
    '久米島': 'Kume Island',
    '国際通り': 'Kokusai Street',
    '首里城': 'Shuri Castle',
    '万座毛': 'Cape Manzamo',
    '渡嘉敷島': 'Tokashiki Island',
    '黒島': 'Kuroshima'
};

const internationalDestinations = {
    // アジア地域
    // 韓国
    'ソウル': 'Seoul',
    '釜山': 'Busan',
    '済州島': 'Jeju Island',
    '慶州': 'Gyeongju',
    '南怡島': 'Nami Island',
    '明洞': 'Myeongdong',
    
    // 台湾
    '台北': 'Taipei',
    '九份': 'Jiufen',
    '高雄': 'Kaohsiung',
    '台中': 'Taichung',
    '阿里山': 'Alishan',
    '日月潭': 'Sun Moon Lake',
    '花蓮': 'Hualien',
    '墾丁': 'Kenting',
    
    // 中国
    '北京': 'Beijing',
    '上海': 'Shanghai',
    '香港': 'Hong Kong',
    '西安': 'Xian',
    '桂林': 'Guilin',
    '成都': 'Chengdu',
    '杭州': 'Hangzhou',
    '麗江': 'Lijiang',
    '広州': 'Guangzhou',
    '澳門': 'Macau',
    
    // タイ
    'バンコク': 'Bangkok',
    'プーケット': 'Phuket',
    'チェンマイ': 'Chiang Mai',
    'パタヤ': 'Pattaya',
    'クラビ': 'Krabi',
    'アユタヤ': 'Ayutthaya',
    'サムイ島': 'Koh Samui',
    'ピピ島': 'Phi Phi Islands',
    
    // ベトナム
    'ハノイ': 'Hanoi',
    'ホーチミン': 'Ho Chi Minh City',
    'ダナン': 'Da Nang',
    'ハロン湾': 'Halong Bay',
    'ホイアン': 'Hoi An',
    'サパ': 'Sapa',
    'フエ': 'Hue',
    'フーコック島': 'Phu Quoc Island',
    
    // シンガポール
    'シンガポール': 'Singapore',
    'セントーサ島': 'Sentosa Island',
    'マリーナベイ': 'Marina Bay',
    'オーチャードロード': 'Orchard Road',
    'ガーデンズバイザベイ': 'Gardens by the Bay',
    
    // マレーシア
    'クアラルンプール': 'Kuala Lumpur',
    'ペナン': 'Penang',
    'ランカウイ': 'Langkawi',
    'コタキナバル': 'Kota Kinabalu',
    'マラッカ': 'Malacca',
    'ジョホールバル': 'Johor Bahru',
    
    // インドネシア
    'バリ島': 'Bali',
    'ジャカルタ': 'Jakarta',
    'ジョグジャカルタ': 'Yogyakarta',
    'ボロブドゥール': 'Borobudur',
    'コモド島': 'Komodo Island',
    'ロンボク島': 'Lombok',
    'ギリ島': 'Gili Islands',
    'ウブド': 'Ubud',
    
    // フィリピン
    'マニラ': 'Manila',
    'セブ島': 'Cebu',
    'ボラカイ島': 'Boracay',
    'パラワン': 'Palawan',
    'エルニド': 'El Nido',
    'ボホール': 'Bohol',
    
    // インド
    'デリー': 'Delhi',
    'アグラ': 'Agra',
    'ジャイプール': 'Jaipur',
    'ムンバイ': 'Mumbai',
    'バラナシ': 'Varanasi',
    'ゴア': 'Goa',
    'ケララ': 'Kerala',
    
    // ミャンマー
    'ヤンゴン': 'Yangon',
    'バガン': 'Bagan',
    'マンダレー': 'Mandalay',
    'インレー湖': 'Inle Lake',
    
    // カンボジア
    'シェムリアップ': 'Siem Reap',
    'アンコールワット': 'Angkor Wat',
    'プノンペン': 'Phnom Penh',
    'シアヌークビル': 'Sihanoukville',
    
    // ラオス
    'ビエンチャン': 'Vientiane',
    'ルアンパバーン': 'Luang Prabang',
    'バンビエン': 'Vang Vieng',
    
    // オセアニア地域
    // オーストラリア
    'シドニー': 'Sydney',
    'メルボルン': 'Melbourne',
    'ゴールドコースト': 'Gold Coast',
    'ケアンズ': 'Cairns',
    'グレートバリアリーフ': 'Great Barrier Reef',
    'エアーズロック': 'Uluru (Ayers Rock)',
    'パース': 'Perth',
    'ブリスベン': 'Brisbane',
    'タスマニア': 'Tasmania',
    'グレートオーシャンロード': 'Great Ocean Road',
    
    // ニュージーランド
    'オークランド': 'Auckland',
    'クイーンズタウン': 'Queenstown',
    'ロトルア': 'Rotorua',
    'クライストチャーチ': 'Christchurch',
    'ミルフォードサウンド': 'Milford Sound',
    'ホビトン': 'Hobbiton',
    'テカポ湖': 'Lake Tekapo',
    'ワナカ': 'Wanaka',
    
    // 南太平洋
    'グアム': 'Guam',
    'サイパン': 'Saipan',
    'フィジー': 'Fiji',
    'タヒチ': 'Tahiti',
    'ボラボラ島': 'Bora Bora',
    'ニューカレドニア': 'New Caledonia',
    'パラオ': 'Palau',
    
    // 北米地域
    // アメリカ
    'ニューヨーク': 'New York',
    'ロサンゼルス': 'Los Angeles',
    'サンフランシスコ': 'San Francisco',
    'ラスベガス': 'Las Vegas',
    'ハワイ': 'Hawaii',
    'オーランド': 'Orlando',
    'グランドキャニオン': 'Grand Canyon',
    'ワシントンD.C.': 'Washington D.C.',
    'シカゴ': 'Chicago',
    'マイアミ': 'Miami',
    'ボストン': 'Boston',
    'イエローストーン': 'Yellowstone',
    'シアトル': 'Seattle',
    'ヨセミテ': 'Yosemite',
    'サンディエゴ': 'San Diego',
    
    // カナダ
    'バンクーバー': 'Vancouver',
    'トロント': 'Toronto',
    'モントリオール': 'Montreal',
    'ナイアガラの滝': 'Niagara Falls',
    'ケベックシティ': 'Quebec City',
    'カナディアンロッキー': 'Canadian Rockies',
    'ビクトリア': 'Victoria',
    'カルガリー': 'Calgary',
    'バンフ': 'Banff',
    'ジャスパー': 'Jasper',
    
    // 中南米地域
    'メキシコシティ': 'Mexico City',
    'カンクン': 'Cancun',
    'リオデジャネイロ': 'Rio de Janeiro',
    'サンパウロ': 'Sao Paulo',
    'ブエノスアイレス': 'Buenos Aires',
    'マチュピチュ': 'Machu Picchu',
    'イグアスの滝': 'Iguazu Falls',
    'クスコ': 'Cusco',
    'ガラパゴス諸島': 'Galapagos Islands',
    'ハバナ': 'Havana',
    
    // ヨーロッパ地域
    // イギリス
    'ロンドン': 'London',
    'エディンバラ': 'Edinburgh',
    'マンチェスター': 'Manchester',
    'リバプール': 'Liverpool',
    'バース': 'Bath',
    'オックスフォード': 'Oxford',
    'ケンブリッジ': 'Cambridge',
    
    // フランス
    'パリ': 'Paris',
    'ニース': 'Nice',
    'モンサンミッシェル': 'Mont Saint-Michel',
    'マルセイユ': 'Marseille',
    'リヨン': 'Lyon',
    'ストラスブール': 'Strasbourg',
    'ボルドー': 'Bordeaux',
    'アヴィニョン': 'Avignon',
    
    // イタリア
    'ローマ': 'Rome',
    'ベネチア': 'Venice',
    'フィレンツェ': 'Florence',
    'ミラノ': 'Milan',
    'ナポリ': 'Naples',
    'アマルフィ海岸': 'Amalfi Coast',
    'シチリア': 'Sicily',
    'チンクエテッレ': 'Cinque Terre',
    'ピサ': 'Pisa',
    'バチカン市国': 'Vatican City',
    
    // スペイン
    'マドリード': 'Madrid',
    'バルセロナ': 'Barcelona',
    'セビリア': 'Seville',
    'グラナダ': 'Granada',
    'バレンシア': 'Valencia',
    'マラガ': 'Malaga',
    'トレド': 'Toledo',
    'イビサ': 'Ibiza',
    
    // ドイツ
    'ベルリン': 'Berlin',
    'ミュンヘン': 'Munich',
    'フランクフルト': 'Frankfurt',
    'ケルン': 'Cologne',
    'ハンブルク': 'Hamburg',
    'ドレスデン': 'Dresden',
    'ノイシュヴァンシュタイン城': 'Neuschwanstein Castle',
    
    // オーストリア
    'ウィーン': 'Vienna',
    'ザルツブルク': 'Salzburg',
    'インスブルック': 'Innsbruck',
    'ハルシュタット': 'Hallstatt',
    
    // スイス
    'チューリッヒ': 'Zurich',
    'ジュネーブ': 'Geneva',
    'インターラーケン': 'Interlaken',
    'ルツェルン': 'Lucerne',
    'マッターホルン': 'Matterhorn',
    'ベルン': 'Bern',
    
    // オランダ
    'アムステルダム': 'Amsterdam',
    'ロッテルダム': 'Rotterdam',
    'キューケンホフ': 'Keukenhof',
    'ハーグ': 'The Hague',
    
    // ベルギー
    'ブリュッセル': 'Brussels',
    'ブルージュ': 'Bruges',
    'アントワープ': 'Antwerp',
    'ゲント': 'Ghent',
    
    // ポルトガル
    'リスボン': 'Lisbon',
    'ポルト': 'Porto',
    'シントラ': 'Sintra',
    'マデイラ': 'Madeira',
    'アルガルヴェ': 'Algarve',
    
    // ギリシャ
    'アテネ': 'Athens',
    'サントリーニ': 'Santorini',
    'ミコノス': 'Mykonos',
    'クレタ': 'Crete',
    'ロードス': 'Rhodes',
    'メテオラ': 'Meteora',
    
    // 北欧
    'ストックホルム': 'Stockholm',
    'コペンハーゲン': 'Copenhagen',
    'オスロ': 'Oslo',
    'ヘルシンキ': 'Helsinki',
    'レイキャビク': 'Reykjavik',
    'ブルーラグーン': 'Blue Lagoon',
    'ノルウェーフィヨルド': 'Norwegian Fjords',
    'オーロラ': 'Northern Lights',
    
    // ロシア・東欧
    'モスクワ': 'Moscow',
    'サンクトペテルブルク': 'Saint Petersburg',
    'プラハ': 'Prague',
    'ブダペスト': 'Budapest',
    'ワルシャワ': 'Warsaw',
    'クラクフ': 'Krakow',
    'ドブロブニク': 'Dubrovnik',
    'ザグレブ': 'Zagreb',
    
    // 中東地域
    'ドバイ': 'Dubai',
    'アブダビ': 'Abu Dhabi',
    'イスタンブール': 'Istanbul',
    'カッパドキア': 'Cappadocia',
    'エルサレム': 'Jerusalem',
    'ぺトラ遺跡': 'Petra',
    'ドーハ': 'Doha',
    'アンマン': 'Amman',
    
    // アフリカ地域
    'カイロ': 'Cairo',
    'ルクソール': 'Luxor',
    'マラケシュ': 'Marrakech',
    'ケープタウン': 'Cape Town',
    'ビクトリアの滝': 'Victoria Falls',
    'セレンゲティ国立公園': 'Serengeti National Park',
    'モロッコ': 'Morocco',
    'チュニジア': 'Tunisia'
};

// 旅行タイプに基づいて辞書を選択する関数
function getDestinationDictionary(destinationType) {
    return destinationType === '国内' ? japaneseDestinations : internationalDestinations;
}

// 旅行タイプに基づいてリストを取得する関数（サーバーでのシステムプロンプト用）
function getDestinationList(destinationType) {
    const dictionary = getDestinationDictionary(destinationType);
    return Object.keys(dictionary).join('、');
}

// 国内・海外両方の辞書を統合する関数
function combineDestinationDictionaries() {
    return {...japaneseDestinations, ...internationalDestinations};
}

// 日本語地名の変換関数
function getEnglishDestination(japaneseDestination, destinationType) {
    const dictionary = getDestinationDictionary(destinationType);
    
    // 完全一致を優先
    if (dictionary[japaneseDestination]) {
        return dictionary[japaneseDestination];
    }
    
    // 部分一致を検索
    for (const key in dictionary) {
        if (japaneseDestination.includes(key)) {
            return dictionary[key];
        }
    }
    
    // 対応する英語名が見つからない場合はデフォルト値を返す
    return destinationType === '国内' ? 'Japan travel scenic' : 'international travel destination';
}

// 辞書の地名かどうかチェックする関数
function isValidDestination(destination, destinationType) {
    const dictionary = getDestinationDictionary(destinationType);
    
    // 部分一致をチェック
    for (const key in dictionary) {
        if (destination.includes(key)) {
            return true;
        }
    }
    return false;
}

// Node.js環境用のエクスポート
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        japaneseDestinations,
        internationalDestinations,
        getDestinationDictionary,
        getDestinationList,
        combineDestinationDictionaries,
        getEnglishDestination,
        isValidDestination
    };
}

// destinations.jsの最後に追加
export { 
    japaneseDestinations, 
    internationalDestinations, 
    getDestinationDictionary, 
    getDestinationList, 
    combineDestinationDictionaries, 
    getEnglishDestination, 
    isValidDestination 
};
