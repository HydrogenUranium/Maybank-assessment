import groovy.transform.Field

@Field DRY_RUN = false

def getHomePages() {
    return sql2Query("""
        SELECT * FROM [nt:unstructured] AS node
        WHERE ISDESCENDANTNODE('/content/dhl')
        AND node.[cq:template] = '/conf/dhl/settings/wcm/templates/home-page'
    """).stream().map{ it.getParent() };
}


@Field DICTIONARY_CAROUSEL_ROW = [
        "en-IE": ["Vodka Berlin": "Vodka Berlin", "Vodka Korea": "Vodka Korea", "Black apple watch": "Black apple watch", "Black color watch strap": "Black color watch strap", "Pink color watch strap": "Pink color watch strap"],
        "de": ["Vodka Berlin": "Wodka Berlin", "Vodka Korea": "Wodka Korea", "Black apple watch": "Schwarze Apfeluhr", "Black color watch strap": "Schwarzes Uhrenarmband", "Pink color watch strap": "Rosafarbenes Uhrenarmband"],
        "hi": ["Vodka Berlin": "वोदका बर्लिन", "Vodka Korea": "वोदका कोरिया", "Black apple watch": "काला सेब घड़ी", "Black color watch strap": "काले रंग की घड़ी का पट्टा", "Pink color watch strap": "गुलाबी रंग घड़ी का पट्टा"],
        "en-US": ["Vodka Berlin": "Vodka Berlin", "Vodka Korea": "Vodka Korea", "Black apple watch": "Black apple watch", "Black color watch strap": "Black color watch strap", "Pink color watch strap": "Pink color watch strap"],
        "pt": ["Vodka Berlin": "Vodka Berlim", "Vodka Korea": "Vodka Coreia", "Black apple watch": "Relógio de maçã preto", "Black color watch strap": "Pulseira de relógio de cor preta", "Pink color watch strap": "Pulseira de relógio de cor rosa"],
        "en-MM": ["Vodka Berlin": "Vodka Berlin", "Vodka Korea": "Vodka Korea", "Black apple watch": "Black apple watch", "Black color watch strap": "Black color watch strap", "Pink color watch strap": "Pink color watch strap"],
        "en-IN": ["Vodka Berlin": "Vodka Berlin", "Vodka Korea": "Vodka Korea", "Black apple watch": "Black apple watch", "Black color watch strap": "Black color watch strap", "Pink color watch strap": "Pink color watch strap"],
        "en-ZA": ["Vodka Berlin": "Vodka Berlin", "Vodka Korea": "Vodka Korea", "Black apple watch": "Black apple watch", "Black color watch strap": "Black color watch strap", "Pink color watch strap": "Pink color watch strap"],
        "hu": ["Vodka Berlin": "Vodka Berlin", "Vodka Korea": "Vodka Korea", "Black apple watch": "Fekete alma óra", "Black color watch strap": "Fekete színű óraszíj", "Pink color watch strap": "Rózsaszín színű óraszíj"],
        "nl-BE": ["Vodka Berlin": "Wodka Berlijn", "Vodka Korea": "Wodka Korea", "Black apple watch": "Zwarte Apple Watch", "Black color watch strap": "Zwarte kleur horlogeband", "Pink color watch strap": "Roze kleur horlogebandje"],
        "zh-CN": ["Vodka Berlin": "柏林伏特加", "Vodka Korea": "韩国伏特加", "Black apple watch": "黑色苹果手表", "Black color watch strap": "黑色表带", "Pink color watch strap": "粉红色表带"],
        "en-IT": ["Vodka Berlin": "Vodka Berlin", "Vodka Korea": "Vodka Korea", "Black apple watch": "Black apple watch", "Black color watch strap": "Black color watch strap", "Pink color watch strap": "Pink color watch strap"],
        "el-GR": ["Vodka Berlin": "Βότκα Βερολίνο", "Vodka Korea": "Βότκα Κορέα", "Black apple watch": "Μαύρο ρολόι μήλου", "Black color watch strap": "Λουράκι ρολογιού μαύρου χρώματος", "Pink color watch strap": "Λουράκι ρολογιού ροζ χρώματος"],
        "en-MY": ["Vodka Berlin": "Vodka Berlin", "Vodka Korea": "Vodka Korea", "Black apple watch": "Black apple watch", "Black color watch strap": "Black color watch strap", "Pink color watch strap": "Pink color watch strap"],
        "en-ES": ["Vodka Berlin": "Vodka Berlin", "Vodka Korea": "Vodka Korea", "Black apple watch": "Black apple watch", "Black color watch strap": "Black color watch strap", "Pink color watch strap": "Pink color watch strap"],
        "en-AT": ["Vodka Berlin": "Vodka Berlin", "Vodka Korea": "Vodka Korea", "Black apple watch": "Black apple watch", "Black color watch strap": "Black color watch strap", "Pink color watch strap": "Pink color watch strap"],
        "en-AU": ["Vodka Berlin": "Vodka Berlin", "Vodka Korea": "Vodka Korea", "Black apple watch": "Black apple watch", "Black color watch strap": "Black color watch strap", "Pink color watch strap": "Pink color watch strap"],
        "id": ["Vodka Berlin": "Vodka Berlin", "Vodka Korea": "Vodka Korea", "Black apple watch": "Jam tangan apel hitam", "Black color watch strap": "Tali jam tangan warna hitam", "Pink color watch strap": "Tali jam tangan warna merah muda"],
        "en-NG": ["Vodka Berlin": "Vodka Berlin", "Vodka Korea": "Vodka Korea", "Black apple watch": "Black apple watch", "Black color watch strap": "Black color watch strap", "Pink color watch strap": "Pink color watch strap"],
        "en-VN": ["Vodka Berlin": "Vodka Berlin", "Vodka Korea": "Vodka Korea", "Black apple watch": "Black apple watch", "Black color watch strap": "Black color watch strap", "Pink color watch strap": "Pink color watch strap"],
        "de-CH": ["Vodka Berlin": "Wodka Berlin", "Vodka Korea": "Wodka Korea", "Black apple watch": "Schwarze Apfeluhr", "Black color watch strap": "Schwarzes Uhrenarmband", "Pink color watch strap": "Rosafarbenes Uhrenarmband"],
        "ms": ["Vodka Berlin": "Vodka Berlin", "Vodka Korea": "Vodka Korea", "Black apple watch": "Jam tangan epal hitam", "Black color watch strap": "Tali jam tangan warna hitam", "Pink color watch strap": "Tali jam tangan warna merah jambu"],
        "en-BD": ["Vodka Berlin": "Vodka Berlin", "Vodka Korea": "Vodka Korea", "Black apple watch": "Black apple watch", "Black color watch strap": "Black color watch strap", "Pink color watch strap": "Pink color watch strap"],
        "el": ["Vodka Berlin": "Βότκα Βερολίνο", "Vodka Korea": "Βότκα Κορέα", "Black apple watch": "Μαύρο ρολόι μήλου", "Black color watch strap": "Λουράκι ρολογιού μαύρου χρώματος", "Pink color watch strap": "Λουράκι ρολογιού ροζ χρώματος"],
        "en": ["Vodka Berlin": "Vodka Berlin", "Vodka Korea": "Vodka Korea", "Black apple watch": "Black apple watch", "Black color watch strap": "Black color watch strap", "Pink color watch strap": "Pink color watch strap"],
        "it": ["Vodka Berlin": "Vodka Berlino", "Vodka Korea": "Vodka Corea", "Black apple watch": "Orologio Apple nero", "Black color watch strap": "Cinturino dell'orologio di colore nero", "Pink color watch strap": "Cinturino dell'orologio di colore rosa"],
        "es": ["Vodka Berlin": "Vodka Berlín", "Vodka Korea": "Vodka Corea", "Black apple watch": "Apple Watch negro", "Black color watch strap": "Correa de reloj de color negro", "Pink color watch strap": "Correa de reloj de color rosa"],
        "zh": ["Vodka Berlin": "柏林伏特加", "Vodka Korea": "韩国伏特加", "Black apple watch": "黑色苹果手表", "Black color watch strap": "黑色表带", "Pink color watch strap": "粉红色表带"],
        "fr-CA": ["Vodka Berlin": "Vodka Berlin", "Vodka Korea": "Vodka Corée", "Black apple watch": "Montre Apple noire", "Black color watch strap": "Bracelet de montre de couleur noire", "Pink color watch strap": "Bracelet de montre de couleur rose"],
        "en-NZ": ["Vodka Berlin": "Vodka Berlin", "Vodka Korea": "Vodka Korea", "Black apple watch": "Black apple watch", "Black color watch strap": "Black color watch strap", "Pink color watch strap": "Pink color watch strap"],
        "vi": ["Vodka Berlin": "Vodka Berlin", "Vodka Korea": "Vodka Hàn Quốc", "Black apple watch": "Đồng hồ táo đen", "Black color watch strap": "Dây đeo đồng hồ màu đen", "Pink color watch strap": "Dây đeo đồng hồ màu hồng"],
        "fr-BE": ["Vodka Berlin": "Vodka Berlin", "Vodka Korea": "Vodka Corée", "Black apple watch": "Apple Watch noire", "Black color watch strap": "Bracelet de montre de couleur noire", "Pink color watch strap": "Bracelet de montre de couleur rose"],
        "ja": ["Vodka Berlin": "ウォッカベルリン", "Vodka Korea": "ウォッカコリア", "Black apple watch": "ブラックアップルウォッチ", "Black color watch strap": "ブラックカラーの時計ストラップ", "Pink color watch strap": "ピンクカラーの時計ストラップ"],
        "en-SG": ["Vodka Berlin": "Vodka Berlin", "Vodka Korea": "Vodka Korea", "Black apple watch": "Black apple watch", "Black color watch strap": "Black color watch strap", "Pink color watch strap": "Pink color watch strap"],
        "it-CH": ["Vodka Berlin": "Vodka Berlino", "Vodka Korea": "Vodka Corea", "Black apple watch": "Orologio Apple nero", "Black color watch strap": "Cinturino dell'orologio di colore nero", "Pink color watch strap": "Cinturino dell'orologio di colore rosa"],
        "fr-FR": ["Vodka Berlin": "Vodka Berlin", "Vodka Korea": "Vodka Corée", "Black apple watch": "Apple Watch noire", "Black color watch strap": "Bracelet de montre de couleur noire", "Pink color watch strap": "Bracelet de montre de couleur rose"],
        "vi-VN": ["Vodka Berlin": "Vodka Berlin", "Vodka Korea": "Vodka Hàn Quốc", "Black apple watch": "Đồng hồ táo đen", "Black color watch strap": "Dây đeo đồng hồ màu đen", "Pink color watch strap": "Dây đeo đồng hồ màu hồng"],
        "en-GB": ["Vodka Berlin": "Vodka Berlin", "Vodka Korea": "Vodka Korea", "Black apple watch": "Black apple watch", "Black color watch strap": "Black colour watch strap", "Pink color watch strap": "Pink colour watch strap"],
        "en-KE": ["Vodka Berlin": "Vodka Berlin", "Vodka Korea": "Vodka Korea", "Black apple watch": "Black apple watch", "Black color watch strap": "Black color watch strap", "Pink color watch strap": "Pink color watch strap"],
        "en-KH": ["Vodka Berlin": "Vodka Berlin", "Vodka Korea": "Vodka Korea", "Black apple watch": "Black apple watch", "Black color watch strap": "Black color watch strap", "Pink color watch strap": "Pink color watch strap"],
        "bg": ["Vodka Berlin": "Водка Берлин", "Vodka Korea": "Водка Корея", "Black apple watch": "Черен ябълков часовник", "Black color watch strap": "Каишка за часовник в черен цвят", "Pink color watch strap": "Каишка за часовник в розов цвят"],
        "en-CH": ["Vodka Berlin": "Vodka Berlin", "Vodka Korea": "Vodka Korea", "Black apple watch": "Black apple watch", "Black color watch strap": "Black color watch strap", "Pink color watch strap": "Pink color watch strap"],
        "en-KR": ["Vodka Berlin": "Vodka Berlin", "Vodka Korea": "Vodka Korea", "Black apple watch": "Black apple watch", "Black color watch strap": "Black color watch strap", "Pink color watch strap": "Pink color watch strap"],
        "ar-AE": ["Vodka Berlin": "فودكا برلين", "Vodka Korea": "الفودكا كوريا", "Black apple watch": "ساعة أبل سوداء", "Black color watch strap": "حزام ساعة أسود اللون", "Pink color watch strap": "حزام ساعة باللون الوردي"],
        "fr": ["Vodka Berlin": "Vodka Berlin", "Vodka Korea": "Vodka Corée", "Black apple watch": "Apple Watch noire", "Black color watch strap": "Bracelet de montre de couleur noire", "Pink color watch strap": "Bracelet de montre de couleur rose"],
        "en-CN": ["Vodka Berlin": "Vodka Berlin", "Vodka Korea": "Vodka Korea", "Black apple watch": "Black apple watch", "Black color watch strap": "Black color watch strap", "Pink color watch strap": "Pink color watch strap"],
        "de-AT": ["Vodka Berlin": "Wodka Berlin", "Vodka Korea": "Wodka Korea", "Black apple watch": "Schwarze Apfeluhr", "Black color watch strap": "Schwarzes Uhrenarmband", "Pink color watch strap": "Rosafarbenes Uhrenarmband"],
        "fr-CH": ["Vodka Berlin": "Vodka Berlin", "Vodka Korea": "Vodka Corée", "Black apple watch": "Apple Watch noire", "Black color watch strap": "Bracelet de montre de couleur noire", "Pink color watch strap": "Bracelet de montre de couleur rose"],
        "sk": ["Vodka Berlin": "Vodka Berlín", "Vodka Korea": "Vodka Kórea", "Black apple watch": "Čierne jablkové hodinky", "Black color watch strap": "Remienok na hodinky čiernej farby", "Pink color watch strap": "Remienok na hodinky ružovej farby"],
        "en-TH": ["Vodka Berlin": "Vodka Berlin", "Vodka Korea": "Vodka Korea", "Black apple watch": "Black apple watch", "Black color watch strap": "Black color watch strap", "Pink color watch strap": "Pink color watch strap"],
        "en-CZ": ["Vodka Berlin": "Vodka Berlin", "Vodka Korea": "Vodka Korea", "Black apple watch": "Black apple watch", "Black color watch strap": "Black color watch strap", "Pink color watch strap": "Pink color watch strap"],
        "cs-CZ": ["Vodka Berlin": "Vodka Berlin", "Vodka Korea": "Vodka Korea", "Black apple watch": "Černé jablečné hodinky", "Black color watch strap": "Řemínek na hodinky v černé barvě", "Pink color watch strap": "Růžový řemínek na hodinky"],
        "en-PH": ["Vodka Berlin": "Vodka Berlin", "Vodka Korea": "Vodka Korea", "Black apple watch": "Black apple watch", "Black color watch strap": "Black color watch strap", "Pink color watch strap": "Pink color watch strap"],
        "en-PK": ["Vodka Berlin": "Vodka Berlin", "Vodka Korea": "Vodka Korea", "Black apple watch": "Black apple watch", "Black color watch strap": "Black color watch strap", "Pink color watch strap": "Pink color watch strap"],
        "en-LK": ["Vodka Berlin": "Vodka Berlin", "Vodka Korea": "Vodka Korea", "Black apple watch": "Black apple watch", "Black color watch strap": "Black color watch strap", "Pink color watch strap": "Pink color watch strap"],
        "de-DE": ["Vodka Berlin": "Wodka Berlin", "Vodka Korea": "Wodka Korea", "Black apple watch": "Schwarze Apfeluhr", "Black color watch strap": "Schwarzes Uhrenarmband", "Pink color watch strap": "Rosafarbenes Uhrenarmband"],
        "ko": ["Vodka Berlin": "보드카 베를린", "Vodka Korea": "보드카 코리아", "Black apple watch": "블랙 애플 워치", "Black color watch strap": "블랙 컬러 워치 스트랩", "Pink color watch strap": "핑크 컬러 시계 스트랩"],
        "zh-TW": ["Vodka Berlin": "柏林伏特加", "Vodka Korea": "韓國伏特加", "Black apple watch": "黑色蘋果手錶", "Black color watch strap": "黑色錶帶", "Pink color watch strap": "粉紅色錶帶"],
        "zh-HK": ["Vodka Berlin": "柏林伏特加", "Vodka Korea": "韓國伏特加", "Black apple watch": "黑色蘋果手錶", "Black color watch strap": "黑色錶帶", "Pink color watch strap": "粉紅色錶帶"],
        "ko-KR": ["Vodka Berlin": "보드카 베를린", "Vodka Korea": "보드카 코리아", "Black apple watch": "블랙 애플 워치", "Black color watch strap": "블랙 컬러 워치 스트랩", "Pink color watch strap": "핑크 컬러 시계 스트랩"],
        "pt-BR": ["Vodka Berlin": "Vodka Berlim", "Vodka Korea": "Vodka Coreia", "Black apple watch": "Relógio de maçã preto", "Black color watch strap": "Pulseira de relógio de cor preta", "Pink color watch strap": "Pulseira de relógio de cor rosa"],
        "en-HK": ["Vodka Berlin": "Vodka Berlin", "Vodka Korea": "Vodka Korea", "Black apple watch": "Black apple watch", "Black color watch strap": "Black color watch strap", "Pink color watch strap": "Pink color watch strap"],
        "sk-SK": ["Vodka Berlin": "Vodka Berlín", "Vodka Korea": "Vodka Kórea", "Black apple watch": "Čierne jablkové hodinky", "Black color watch strap": "Remienok na hodinky čiernej farby", "Pink color watch strap": "Remienok na hodinky ružovej farby"],
        "en-PT": ["Vodka Berlin": "Vodka Berlin", "Vodka Korea": "Vodka Korea", "Black apple watch": "Black apple watch", "Black color watch strap": "Black color watch strap", "Pink color watch strap": "Pink color watch strap"],
        "es-ES": ["Vodka Berlin": "Vodka Berlín", "Vodka Korea": "Vodka Corea", "Black apple watch": "Apple Watch negro", "Black color watch strap": "Correa de reloj de color negro", "Pink color watch strap": "Correa de reloj de color rosa"],
        "en-DK": ["Vodka Berlin": "Vodka Berlin", "Vodka Korea": "Vodka Korea", "Black apple watch": "Black apple watch", "Black color watch strap": "Black color watch strap", "Pink color watch strap": "Pink color watch strap"],
        "cs": ["Vodka Berlin": "Vodka Berlin", "Vodka Korea": "Vodka Korea", "Black apple watch": "Černé jablečné hodinky", "Black color watch strap": "Řemínek na hodinky v černé barvě", "Pink color watch strap": "Růžový řemínek na hodinky"],
        "it-IT": ["Vodka Berlin": "Vodka Berlino", "Vodka Korea": "Vodka Corea", "Black apple watch": "Orologio Apple nero", "Black color watch strap": "Cinturino dell'orologio di colore nero", "Pink color watch strap": "Cinturino dell'orologio di colore rosa"],
        "th": ["Vodka Berlin": "วอดก้าเบอร์ลิน", "Vodka Korea": "วอดก้าเกาหลี", "Black apple watch": "นาฬิกาแอปเปิ้ลสีดํา", "Black color watch strap": "สายนาฬิกาสีดํา", "Pink color watch strap": "สายนาฬิกาสีชมพู"],
        "sv-SE": ["Vodka Berlin": "Vodka Berlin", "Vodka Korea": "Vodka Korea", "Black apple watch": "Svart äpple klocka", "Black color watch strap": "Svart färg klockarmband", "Pink color watch strap": "Rosa färg klockarmband"],
        "da-DK": ["Vodka Berlin": "Vodka Berlin", "Vodka Korea": "Vodka Korea", "Black apple watch": "Sort æble ur", "Black color watch strap": "Sort farve urrem", "Pink color watch strap": "Lyserød farve urrem"],
        "pl": ["Vodka Berlin": "Wódka Berlin", "Vodka Korea": "Wódka Korea", "Black apple watch": "zegarek jabłkowy", "Black color watch strap": "Pasek do zegarka w kolorze czarnym", "Pink color watch strap": "Pasek do zegarka w kolorze różowym"],
        "he": ["Vodka Berlin": "וודקה ברלין", "Vodka Korea": "וודקה קוריאה", "Black apple watch": "שעון תפוח שחור", "Black color watch strap": "רצועת שעון בצבע שחור", "Pink color watch strap": "רצועת שעון בצבע ורוד"],
        "en-ID": ["Vodka Berlin": "Vodka Berlin", "Vodka Korea": "Vodka Korea", "Black apple watch": "Black apple watch", "Black color watch strap": "Black color watch strap", "Pink color watch strap": "Pink color watch strap"]
]

@Field DICTIONARY_INFO_ROW = [
        "en-IE": ["Letter in envelop": "Letter in envelop", "Virtual Reality": "Virtual Reality", "Calendar": "Calendar", "Syrup Droppers": "Syrup Droppers", "Electrical Trends": "Electrical Trends", "Ring in a box": "Ring in a box", "Globe": "Globe", "Guitar": "Guitar", "Sewing Machine": "Sewing Machine", "Book": "Book", "Helmet with Sensor": "Helmet with Sensor", "Red T-shirt": "Red T-shirt", "Basket ball": "Basket ball"],
        "de": ["Letter in envelop": "Brief im Umschlag", "Virtual Reality": "Virtuelle Realität", "Calendar": "Kalender", "Syrup Droppers": "Sirup-Tropfer", "Electrical Trends": "Elektrische Trends", "Ring in a box": "Ring in einer Schachtel", "Globe": "Kugel", "Guitar": "Gitarre", "Sewing Machine": "Nähmaschine", "Book": "Buch", "Helmet with Sensor": "Helm mit Sensor", "Red T-shirt": "Rotes T-Shirt", "Basket ball": "Basketball"],
        "hi": ["Letter in envelop": "लिफाफे में पत्र", "Virtual Reality": "आभासी वास्तविकता", "Calendar": "कैलेंडर", "Syrup Droppers": "सिरप ड्रॉपर", "Electrical Trends": "विद्युत रुझान", "Ring in a box": "एक बॉक्स में रिंग करें", "Globe": "गोलक", "Guitar": "गिटार", "Sewing Machine": "सिलाई मशीन", "Book": "किताब", "Helmet with Sensor": "सेंसर के साथ हेलमेट", "Red T-shirt": "लाल टी-शर्ट", "Basket ball": "बास्केट बॉल"],
        "en-US": ["Letter in envelop": "Letter in envelop", "Virtual Reality": "Virtual Reality", "Calendar": "Calendar", "Syrup Droppers": "Syrup Droppers", "Electrical Trends": "Electrical Trends", "Ring in a box": "Ring in a box", "Globe": "Globe", "Guitar": "Guitar", "Sewing Machine": "Sewing Machine", "Book": "Book", "Helmet with Sensor": "Helmet with Sensor", "Red T-shirt": "Red T-shirt", "Basket ball": "Basket ball"],
        "pt": ["Letter in envelop": "Carta em envelope", "Virtual Reality": "Realidade virtual", "Calendar": "Calendário", "Syrup Droppers": "Conta-gotas de xarope", "Electrical Trends": "Tendências elétricas", "Ring in a box": "Anel em uma caixa", "Globe": "Globo", "Guitar": "Violão", "Sewing Machine": "Máquina de costura", "Book": "Livro", "Helmet with Sensor": "Capacete com sensor", "Red T-shirt": "Camiseta vermelha", "Basket ball": "Basquete"],
        "en-MM": ["Letter in envelop": "Letter in envelop", "Virtual Reality": "Virtual Reality", "Calendar": "Calendar", "Syrup Droppers": "Syrup Droppers", "Electrical Trends": "Electrical Trends", "Ring in a box": "Ring in a box", "Globe": "Globe", "Guitar": "Guitar", "Sewing Machine": "Sewing Machine", "Book": "Book", "Helmet with Sensor": "Helmet with Sensor", "Red T-shirt": "Red T-shirt", "Basket ball": "Basket ball"],
        "en-IN": ["Letter in envelop": "Letter in envelop", "Virtual Reality": "Virtual Reality", "Calendar": "Calendar", "Syrup Droppers": "Syrup Droppers", "Electrical Trends": "Electrical Trends", "Ring in a box": "Ring in a box", "Globe": "Globe", "Guitar": "Guitar", "Sewing Machine": "Sewing Machine", "Book": "Book", "Helmet with Sensor": "Helmet with Sensor", "Red T-shirt": "Red T-shirt", "Basket ball": "Basket ball"],
        "en-ZA": ["Letter in envelop": "Letter in envelop", "Virtual Reality": "Virtual Reality", "Calendar": "Calendar", "Syrup Droppers": "Syrup Droppers", "Electrical Trends": "Electrical Trends", "Ring in a box": "Ring in a box", "Globe": "Globe", "Guitar": "Guitar", "Sewing Machine": "Sewing Machine", "Book": "Book", "Helmet with Sensor": "Helmet with Sensor", "Red T-shirt": "Red T-shirt", "Basket ball": "Basket ball"],
        "hu": ["Letter in envelop": "Levél borítékban", "Virtual Reality": "Virtuális valóság", "Calendar": "Naptár", "Syrup Droppers": "Szirup csepegtetők", "Electrical Trends": "Elektromos trendek", "Ring in a box": "Gyűrű egy dobozban", "Globe": "Földgömb", "Guitar": "Gitár", "Sewing Machine": "Varrógép", "Book": "Könyv", "Helmet with Sensor": "Sisak érzékelővel", "Red T-shirt": "Piros póló", "Basket ball": "Kosárlabda"],
        "nl-BE": ["Letter in envelop": "Brief in envelop", "Virtual Reality": "Virtual reality", "Calendar": "Kalender", "Syrup Droppers": "Siroop druppelaars", "Electrical Trends": "Elektrische trends", "Ring in a box": "Ring in een doosje", "Globe": "Bol", "Guitar": "Gitaar", "Sewing Machine": "Naaimachine", "Book": "Boek", "Helmet with Sensor": "Helm met sensor", "Red T-shirt": "Rood T-shirt", "Basket ball": "Basketbal"],
        "zh-CN": ["Letter in envelop": "信封中的信件", "Virtual Reality": "虚拟现实", "Calendar": "日历", "Syrup Droppers": "糖浆滴管", "Electrical Trends": "电气趋势", "Ring in a box": "盒中戒指", "Globe": "球", "Guitar": "吉他", "Sewing Machine": "缝纫机", "Book": "书", "Helmet with Sensor": "带传感器的头盔", "Red T-shirt": "红色 T 恤", "Basket ball": "篮球"],
        "en-IT": ["Letter in envelop": "Letter in envelop", "Virtual Reality": "Virtual Reality", "Calendar": "Calendar", "Syrup Droppers": "Syrup Droppers", "Electrical Trends": "Electrical Trends", "Ring in a box": "Ring in a box", "Globe": "Globe", "Guitar": "Guitar", "Sewing Machine": "Sewing Machine", "Book": "Book", "Helmet with Sensor": "Helmet with Sensor", "Red T-shirt": "Red T-shirt", "Basket ball": "Basket ball"],
        "el-GR": ["Letter in envelop": "Επιστολή στο φάκελο", "Virtual Reality": "Εικονική πραγματικότητα", "Calendar": "Ημερολόγιο", "Syrup Droppers": "Σταγονόμετρα σιροπιού", "Electrical Trends": "Ηλεκτρικές τάσεις", "Ring in a box": "Δαχτυλίδι σε κουτί", "Globe": "Σφαίρα", "Guitar": "Κιθάρα", "Sewing Machine": "Ραπτομηχανή", "Book": "Βιβλίο", "Helmet with Sensor": "Κράνος με αισθητήρα", "Red T-shirt": "Κόκκινο μπλουζάκι", "Basket ball": "Καλαθοσφαίριση"],
        "en-MY": ["Letter in envelop": "Letter in envelop", "Virtual Reality": "Virtual Reality", "Calendar": "Calendar", "Syrup Droppers": "Syrup Droppers", "Electrical Trends": "Electrical Trends", "Ring in a box": "Ring in a box", "Globe": "Globe", "Guitar": "Guitar", "Sewing Machine": "Sewing Machine", "Book": "Book", "Helmet with Sensor": "Helmet with Sensor", "Red T-shirt": "Red T-shirt", "Basket ball": "Basket ball"],
        "en-ES": ["Letter in envelop": "Letter in envelop", "Virtual Reality": "Virtual Reality", "Calendar": "Calendar", "Syrup Droppers": "Syrup Droppers", "Electrical Trends": "Electrical Trends", "Ring in a box": "Ring in a box", "Globe": "Globe", "Guitar": "Guitar", "Sewing Machine": "Sewing Machine", "Book": "Book", "Helmet with Sensor": "Helmet with Sensor", "Red T-shirt": "Red T-shirt", "Basket ball": "Basket ball"],
        "en-AT": ["Letter in envelop": "Letter in envelop", "Virtual Reality": "Virtual Reality", "Calendar": "Calendar", "Syrup Droppers": "Syrup Droppers", "Electrical Trends": "Electrical Trends", "Ring in a box": "Ring in a box", "Globe": "Globe", "Guitar": "Guitar", "Sewing Machine": "Sewing Machine", "Book": "Book", "Helmet with Sensor": "Helmet with Sensor", "Red T-shirt": "Red T-shirt", "Basket ball": "Basket ball"],
        "en-AU": ["Letter in envelop": "Letter in envelop", "Virtual Reality": "Virtual Reality", "Calendar": "Calendar", "Syrup Droppers": "Syrup Droppers", "Electrical Trends": "Electrical Trends", "Ring in a box": "Ring in a box", "Globe": "Globe", "Guitar": "Guitar", "Sewing Machine": "Sewing Machine", "Book": "Book", "Helmet with Sensor": "Helmet with Sensor", "Red T-shirt": "Red T-shirt", "Basket ball": "Basket ball"],
        "id": ["Letter in envelop": "Surat dalam amplop", "Virtual Reality": "Realitas Virtual", "Calendar": "Kalender", "Syrup Droppers": "Penetes Sirup", "Electrical Trends": "Tren Listrik", "Ring in a box": "Cincin dalam kotak", "Globe": "Globe", "Guitar": "Gitar", "Sewing Machine": "Mesin jahit", "Book": "Buku", "Helmet with Sensor": "Helm dengan Sensor", "Red T-shirt": "Kaos merah", "Basket ball": "Bola keranjang"],
        "en-NG": ["Letter in envelop": "Letter in envelop", "Virtual Reality": "Virtual Reality", "Calendar": "Calendar", "Syrup Droppers": "Syrup Droppers", "Electrical Trends": "Electrical Trends", "Ring in a box": "Ring in a box", "Globe": "Globe", "Guitar": "Guitar", "Sewing Machine": "Sewing Machine", "Book": "Book", "Helmet with Sensor": "Helmet with Sensor", "Red T-shirt": "Red T-shirt", "Basket ball": "Basket ball"],
        "en-VN": ["Letter in envelop": "Letter in envelop", "Virtual Reality": "Virtual Reality", "Calendar": "Calendar", "Syrup Droppers": "Syrup Droppers", "Electrical Trends": "Electrical Trends", "Ring in a box": "Ring in a box", "Globe": "Globe", "Guitar": "Guitar", "Sewing Machine": "Sewing Machine", "Book": "Book", "Helmet with Sensor": "Helmet with Sensor", "Red T-shirt": "Red T-shirt", "Basket ball": "Basket ball"],
        "de-CH": ["Letter in envelop": "Brief im Umschlag", "Virtual Reality": "Virtuelle Realität", "Calendar": "Kalender", "Syrup Droppers": "Sirup-Tropfer", "Electrical Trends": "Elektrische Trends", "Ring in a box": "Ring in einer Schachtel", "Globe": "Kugel", "Guitar": "Gitarre", "Sewing Machine": "Nähmaschine", "Book": "Buch", "Helmet with Sensor": "Helm mit Sensor", "Red T-shirt": "Rotes T-Shirt", "Basket ball": "Basketball"],
        "ms": ["Letter in envelop": "Surat dalam sampul", "Virtual Reality": "Realiti Maya", "Calendar": "Kalendar", "Syrup Droppers": "Penitis Sirap", "Electrical Trends": "Trend Elektrik", "Ring in a box": "Dering dalam kotak", "Globe": "Dunia", "Guitar": "Gitar", "Sewing Machine": "Mesin jahit", "Book": "Buku", "Helmet with Sensor": "Topi keledar dengan Sensor", "Red T-shirt": "Kemeja-T merah", "Basket ball": "Bola keranjang"],
        "en-BD": ["Letter in envelop": "Letter in envelop", "Virtual Reality": "Virtual Reality", "Calendar": "Calendar", "Syrup Droppers": "Syrup Droppers", "Electrical Trends": "Electrical Trends", "Ring in a box": "Ring in a box", "Globe": "Globe", "Guitar": "Guitar", "Sewing Machine": "Sewing Machine", "Book": "Book", "Helmet with Sensor": "Helmet with Sensor", "Red T-shirt": "Red T-shirt", "Basket ball": "Basket ball"],
        "el": ["Letter in envelop": "Επιστολή στο φάκελο", "Virtual Reality": "Εικονική πραγματικότητα", "Calendar": "Ημερολόγιο", "Syrup Droppers": "Σταγονόμετρα σιροπιού", "Electrical Trends": "Ηλεκτρικές τάσεις", "Ring in a box": "Δαχτυλίδι σε κουτί", "Globe": "Σφαίρα", "Guitar": "Κιθάρα", "Sewing Machine": "Ραπτομηχανή", "Book": "Βιβλίο", "Helmet with Sensor": "Κράνος με αισθητήρα", "Red T-shirt": "Κόκκινο μπλουζάκι", "Basket ball": "Καλαθοσφαίριση"],
        "en": ["Letter in envelop": "Letter in envelop", "Virtual Reality": "Virtual Reality", "Calendar": "Calendar", "Syrup Droppers": "Syrup Droppers", "Electrical Trends": "Electrical Trends", "Ring in a box": "Ring in a box", "Globe": "Globe", "Guitar": "Guitar", "Sewing Machine": "Sewing Machine", "Book": "Book", "Helmet with Sensor": "Helmet with Sensor", "Red T-shirt": "Red T-shirt", "Basket ball": "Basket ball"],
        "it": ["Letter in envelop": "Lettera in busta", "Virtual Reality": "Realtà virtuale", "Calendar": "Calendario", "Syrup Droppers": "Contagocce per sciroppo", "Electrical Trends": "Tendenze elettriche", "Ring in a box": "Anello in una scatola", "Globe": "Globo", "Guitar": "Chitarra", "Sewing Machine": "Macchina per cucire", "Book": "Libro", "Helmet with Sensor": "Casco con sensore", "Red T-shirt": "Maglietta rossa", "Basket ball": "Basket"],
        "es": ["Letter in envelop": "Carta en sobre", "Virtual Reality": "Realidad virtual", "Calendar": "Calendario", "Syrup Droppers": "Goteros de jarabe", "Electrical Trends": "Tendencias eléctricas", "Ring in a box": "Anillo en una caja", "Globe": "Globo", "Guitar": "Guitarra", "Sewing Machine": "Máquina de coser", "Book": "Libro", "Helmet with Sensor": "Casco con sensor", "Red T-shirt": "Camiseta roja", "Basket ball": "Pelota de baloncesto"],
        "zh": ["Letter in envelop": "信封中的信件", "Virtual Reality": "虚拟现实", "Calendar": "日历", "Syrup Droppers": "糖浆滴管", "Electrical Trends": "电气趋势", "Ring in a box": "盒中戒指", "Globe": "球", "Guitar": "吉他", "Sewing Machine": "缝纫机", "Book": "书", "Helmet with Sensor": "带传感器的头盔", "Red T-shirt": "红色 T 恤", "Basket ball": "篮球"],
        "fr-CA": ["Letter in envelop": "Lettre dans l’enveloppe", "Virtual Reality": "Réalité virtuelle", "Calendar": "Calendrier", "Syrup Droppers": "Compte-gouttes à sirop", "Electrical Trends": "Tendances électriques", "Ring in a box": "Anneau dans une boîte", "Globe": "Globe", "Guitar": "Guitare", "Sewing Machine": "Machine à coudre", "Book": "Réserver", "Helmet with Sensor": "Casque avec capteur", "Red T-shirt": "T-shirt rouge", "Basket ball": "Ballon de basket-ball"],
        "en-NZ": ["Letter in envelop": "Letter in envelop", "Virtual Reality": "Virtual Reality", "Calendar": "Calendar", "Syrup Droppers": "Syrup Droppers", "Electrical Trends": "Electrical Trends", "Ring in a box": "Ring in a box", "Globe": "Globe", "Guitar": "Guitar", "Sewing Machine": "Sewing Machine", "Book": "Book", "Helmet with Sensor": "Helmet with Sensor", "Red T-shirt": "Red T-shirt", "Basket ball": "Basket ball"],
        "vi": ["Letter in envelop": "Chữ cái trong phong bì", "Virtual Reality": "Thực tế ảo", "Calendar": "Lịch", "Syrup Droppers": "Giọt xi-rô", "Electrical Trends": "Xu hướng điện", "Ring in a box": "Đổ chuông trong hộp", "Globe": "Cầu", "Guitar": "Ghi-ta", "Sewing Machine": "Máy may", "Book": "Sách", "Helmet with Sensor": "Mũ bảo hiểm có cảm biến", "Red T-shirt": "Áo phông đỏ", "Basket ball": "Bóng rổ"],
        "fr-BE": ["Letter in envelop": "Lettre sous enveloppe", "Virtual Reality": "Réalité virtuelle", "Calendar": "Calendrier", "Syrup Droppers": "Compte-gouttes de sirop", "Electrical Trends": "Tendances électriques", "Ring in a box": "Bague dans une boîte", "Globe": "Globe", "Guitar": "Guitare", "Sewing Machine": "Machine à coudre", "Book": "Livre", "Helmet with Sensor": "Casque avec capteur", "Red T-shirt": "T-shirt rouge", "Basket ball": "Basket-ball"],
        "ja": ["Letter in envelop": "封筒の中の手紙", "Virtual Reality": "バーチャルリアリティ", "Calendar": "暦", "Syrup Droppers": "シロップスポイト", "Electrical Trends": "電気のトレンド", "Ring in a box": "ボックス内のリング", "Globe": "球", "Guitar": "ギター", "Sewing Machine": "ミシン", "Book": "本", "Helmet with Sensor": "センサー付きヘルメット", "Red T-shirt": "レッドTシャツ", "Basket ball": "バスケットボール"],
        "en-SG": ["Letter in envelop": "Letter in envelop", "Virtual Reality": "Virtual Reality", "Calendar": "Calendar", "Syrup Droppers": "Syrup Droppers", "Electrical Trends": "Electrical Trends", "Ring in a box": "Ring in a box", "Globe": "Globe", "Guitar": "Guitar", "Sewing Machine": "Sewing Machine", "Book": "Book", "Helmet with Sensor": "Helmet with Sensor", "Red T-shirt": "Red T-shirt", "Basket ball": "Basket ball"],
        "it-CH": ["Letter in envelop": "Lettera in busta", "Virtual Reality": "Realtà virtuale", "Calendar": "Calendario", "Syrup Droppers": "Contagocce per sciroppo", "Electrical Trends": "Tendenze elettriche", "Ring in a box": "Anello in una scatola", "Globe": "Globo", "Guitar": "Chitarra", "Sewing Machine": "Macchina per cucire", "Book": "Libro", "Helmet with Sensor": "Casco con sensore", "Red T-shirt": "Maglietta rossa", "Basket ball": "Basket"],
        "fr-FR": ["Letter in envelop": "Lettre sous enveloppe", "Virtual Reality": "Réalité virtuelle", "Calendar": "Calendrier", "Syrup Droppers": "Compte-gouttes de sirop", "Electrical Trends": "Tendances électriques", "Ring in a box": "Bague dans une boîte", "Globe": "Globe", "Guitar": "Guitare", "Sewing Machine": "Machine à coudre", "Book": "Livre", "Helmet with Sensor": "Casque avec capteur", "Red T-shirt": "T-shirt rouge", "Basket ball": "Basket-ball"],
        "vi-VN": ["Letter in envelop": "Chữ cái trong phong bì", "Virtual Reality": "Thực tế ảo", "Calendar": "Lịch", "Syrup Droppers": "Giọt xi-rô", "Electrical Trends": "Xu hướng điện", "Ring in a box": "Đổ chuông trong hộp", "Globe": "Cầu", "Guitar": "Ghi-ta", "Sewing Machine": "Máy may", "Book": "Sách", "Helmet with Sensor": "Mũ bảo hiểm có cảm biến", "Red T-shirt": "Áo phông đỏ", "Basket ball": "Bóng rổ"],
        "en-GB": ["Letter in envelop": "Letter in envelop", "Virtual Reality": "Virtual Reality", "Calendar": "Calendar", "Syrup Droppers": "Syrup Droppers", "Electrical Trends": "Electrical Trends", "Ring in a box": "Ring in a box", "Globe": "Globe", "Guitar": "Guitar", "Sewing Machine": "Sewing Machine", "Book": "Book", "Helmet with Sensor": "Helmet with Sensor", "Red T-shirt": "Red T-shirt", "Basket ball": "Basket ball"],
        "en-KE": ["Letter in envelop": "Letter in envelop", "Virtual Reality": "Virtual Reality", "Calendar": "Calendar", "Syrup Droppers": "Syrup Droppers", "Electrical Trends": "Electrical Trends", "Ring in a box": "Ring in a box", "Globe": "Globe", "Guitar": "Guitar", "Sewing Machine": "Sewing Machine", "Book": "Book", "Helmet with Sensor": "Helmet with Sensor", "Red T-shirt": "Red T-shirt", "Basket ball": "Basket ball"],
        "en-KH": ["Letter in envelop": "Letter in envelop", "Virtual Reality": "Virtual Reality", "Calendar": "Calendar", "Syrup Droppers": "Syrup Droppers", "Electrical Trends": "Electrical Trends", "Ring in a box": "Ring in a box", "Globe": "Globe", "Guitar": "Guitar", "Sewing Machine": "Sewing Machine", "Book": "Book", "Helmet with Sensor": "Helmet with Sensor", "Red T-shirt": "Red T-shirt", "Basket ball": "Basket ball"],
        "bg": ["Letter in envelop": "Писмо в обвивка", "Virtual Reality": "Виртуална реалност", "Calendar": "Календар", "Syrup Droppers": "Капкомери за сироп", "Electrical Trends": "Електрически тенденции", "Ring in a box": "Позвънете в кутия", "Globe": "Глобус", "Guitar": "Китара", "Sewing Machine": "Шевна машина", "Book": "Книга", "Helmet with Sensor": "Каска със сензор", "Red T-shirt": "Червена тениска", "Basket ball": "Баскетболна топка"],
        "en-CH": ["Letter in envelop": "Letter in envelop", "Virtual Reality": "Virtual Reality", "Calendar": "Calendar", "Syrup Droppers": "Syrup Droppers", "Electrical Trends": "Electrical Trends", "Ring in a box": "Ring in a box", "Globe": "Globe", "Guitar": "Guitar", "Sewing Machine": "Sewing Machine", "Book": "Book", "Helmet with Sensor": "Helmet with Sensor", "Red T-shirt": "Red T-shirt", "Basket ball": "Basket ball"],
        "en-KR": ["Letter in envelop": "Letter in envelop", "Virtual Reality": "Virtual Reality", "Calendar": "Calendar", "Syrup Droppers": "Syrup Droppers", "Electrical Trends": "Electrical Trends", "Ring in a box": "Ring in a box", "Globe": "Globe", "Guitar": "Guitar", "Sewing Machine": "Sewing Machine", "Book": "Book", "Helmet with Sensor": "Helmet with Sensor", "Red T-shirt": "Red T-shirt", "Basket ball": "Basket ball"],
        "ar-AE": ["Letter in envelop": "رسالة في مغلف", "Virtual Reality": "الواقع الافتراضي", "Calendar": "تقويم", "Syrup Droppers": "قطارات شراب", "Electrical Trends": "الاتجاهات الكهربائية", "Ring in a box": "حلقة في صندوق", "Globe": "كرة", "Guitar": "قيثارة", "Sewing Machine": "ماكينة الخياطة", "Book": "كتاب", "Helmet with Sensor": "خوذة مع مستشعر", "Red T-shirt": "تي شيرت أحمر", "Basket ball": "كرة السلة"],
        "fr": ["Letter in envelop": "Lettre sous enveloppe", "Virtual Reality": "Réalité virtuelle", "Calendar": "Calendrier", "Syrup Droppers": "Compte-gouttes de sirop", "Electrical Trends": "Tendances électriques", "Ring in a box": "Bague dans une boîte", "Globe": "Globe", "Guitar": "Guitare", "Sewing Machine": "Machine à coudre", "Book": "Livre", "Helmet with Sensor": "Casque avec capteur", "Red T-shirt": "T-shirt rouge", "Basket ball": "Basket-ball"],
        "en-CN": ["Letter in envelop": "Letter in envelop", "Virtual Reality": "Virtual Reality", "Calendar": "Calendar", "Syrup Droppers": "Syrup Droppers", "Electrical Trends": "Electrical Trends", "Ring in a box": "Ring in a box", "Globe": "Globe", "Guitar": "Guitar", "Sewing Machine": "Sewing Machine", "Book": "Book", "Helmet with Sensor": "Helmet with Sensor", "Red T-shirt": "Red T-shirt", "Basket ball": "Basket ball"],
        "de-AT": ["Letter in envelop": "Brief im Umschlag", "Virtual Reality": "Virtuelle Realität", "Calendar": "Kalender", "Syrup Droppers": "Sirup-Tropfer", "Electrical Trends": "Elektrische Trends", "Ring in a box": "Ring in einer Schachtel", "Globe": "Kugel", "Guitar": "Gitarre", "Sewing Machine": "Nähmaschine", "Book": "Buch", "Helmet with Sensor": "Helm mit Sensor", "Red T-shirt": "Rotes T-Shirt", "Basket ball": "Basketball"],
        "fr-CH": ["Letter in envelop": "Lettre sous enveloppe", "Virtual Reality": "Réalité virtuelle", "Calendar": "Calendrier", "Syrup Droppers": "Compte-gouttes de sirop", "Electrical Trends": "Tendances électriques", "Ring in a box": "Bague dans une boîte", "Globe": "Globe", "Guitar": "Guitare", "Sewing Machine": "Machine à coudre", "Book": "Livre", "Helmet with Sensor": "Casque avec capteur", "Red T-shirt": "T-shirt rouge", "Basket ball": "Basket-ball"],
        "sk": ["Letter in envelop": "List v obálke", "Virtual Reality": "Virtuálna realita", "Calendar": "Kalendár", "Syrup Droppers": "Kvapkadlá na sirup", "Electrical Trends": "Elektrické trendy", "Ring in a box": "Prsteň v krabici", "Globe": "Glóbus", "Guitar": "Gitara", "Sewing Machine": "Šijací stroj", "Book": "Kniha", "Helmet with Sensor": "Prilba so senzorom", "Red T-shirt": "Červené tričko", "Basket ball": "Basketbalová lopta"],
        "en-TH": ["Letter in envelop": "Letter in envelop", "Virtual Reality": "Virtual Reality", "Calendar": "Calendar", "Syrup Droppers": "Syrup Droppers", "Electrical Trends": "Electrical Trends", "Ring in a box": "Ring in a box", "Globe": "Globe", "Guitar": "Guitar", "Sewing Machine": "Sewing Machine", "Book": "Book", "Helmet with Sensor": "Helmet with Sensor", "Red T-shirt": "Red T-shirt", "Basket ball": "Basket ball"],
        "en-CZ": ["Letter in envelop": "Letter in envelop", "Virtual Reality": "Virtual Reality", "Calendar": "Calendar", "Syrup Droppers": "Syrup Droppers", "Electrical Trends": "Electrical Trends", "Ring in a box": "Ring in a box", "Globe": "Globe", "Guitar": "Guitar", "Sewing Machine": "Sewing Machine", "Book": "Book", "Helmet with Sensor": "Helmet with Sensor", "Red T-shirt": "Red T-shirt", "Basket ball": "Basket ball"],
        "cs-CZ": ["Letter in envelop": "Dopis v obálce", "Virtual Reality": "Virtuální realita", "Calendar": "Kalendář", "Syrup Droppers": "Sirupová kapátka", "Electrical Trends": "Elektrické trendy", "Ring in a box": "Prsten v krabičce", "Globe": "Glóbus", "Guitar": "Kytara", "Sewing Machine": "Šicí stroj", "Book": "Kniha", "Helmet with Sensor": "Přilba se senzorem", "Red T-shirt": "Červené tričko", "Basket ball": "Basketbalový míč"],
        "en-PH": ["Letter in envelop": "Letter in envelop", "Virtual Reality": "Virtual Reality", "Calendar": "Calendar", "Syrup Droppers": "Syrup Droppers", "Electrical Trends": "Electrical Trends", "Ring in a box": "Ring in a box", "Globe": "Globe", "Guitar": "Guitar", "Sewing Machine": "Sewing Machine", "Book": "Book", "Helmet with Sensor": "Helmet with Sensor", "Red T-shirt": "Red T-shirt", "Basket ball": "Basket ball"],
        "en-PK": ["Letter in envelop": "Letter in envelop", "Virtual Reality": "Virtual Reality", "Calendar": "Calendar", "Syrup Droppers": "Syrup Droppers", "Electrical Trends": "Electrical Trends", "Ring in a box": "Ring in a box", "Globe": "Globe", "Guitar": "Guitar", "Sewing Machine": "Sewing Machine", "Book": "Book", "Helmet with Sensor": "Helmet with Sensor", "Red T-shirt": "Red T-shirt", "Basket ball": "Basket ball"],
        "en-LK": ["Letter in envelop": "Letter in envelop", "Virtual Reality": "Virtual Reality", "Calendar": "Calendar", "Syrup Droppers": "Syrup Droppers", "Electrical Trends": "Electrical Trends", "Ring in a box": "Ring in a box", "Globe": "Globe", "Guitar": "Guitar", "Sewing Machine": "Sewing Machine", "Book": "Book", "Helmet with Sensor": "Helmet with Sensor", "Red T-shirt": "Red T-shirt", "Basket ball": "Basket ball"],
        "de-DE": ["Letter in envelop": "Brief im Umschlag", "Virtual Reality": "Virtuelle Realität", "Calendar": "Kalender", "Syrup Droppers": "Sirup-Tropfer", "Electrical Trends": "Elektrische Trends", "Ring in a box": "Ring in einer Schachtel", "Globe": "Kugel", "Guitar": "Gitarre", "Sewing Machine": "Nähmaschine", "Book": "Buch", "Helmet with Sensor": "Helm mit Sensor", "Red T-shirt": "Rotes T-Shirt", "Basket ball": "Basketball"],
        "ko": ["Letter in envelop": "포위하는 편지", "Virtual Reality": "가상 현실", "Calendar": "달력", "Syrup Droppers": "시럽 스포이드", "Electrical Trends": "전기 동향", "Ring in a box": "상자 속의 반지", "Globe": "지구", "Guitar": "기타", "Sewing Machine": "재봉틀", "Book": "책", "Helmet with Sensor": "센서가 있는 헬멧", "Red T-shirt": "빨간 티셔츠", "Basket ball": "바구니 공"],
        "zh-TW": ["Letter in envelop": "信封中的信件", "Virtual Reality": "虛擬實境", "Calendar": "日曆", "Syrup Droppers": "糖漿滴管", "Electrical Trends": "電氣趨勢", "Ring in a box": "盒中戒指", "Globe": "球", "Guitar": "吉他", "Sewing Machine": "縫紉機", "Book": "書", "Helmet with Sensor": "帶感測器的頭盔", "Red T-shirt": "紅色 T 恤", "Basket ball": "籃球"],
        "zh-HK": ["Letter in envelop": "信封中嘅信件", "Virtual Reality": "虛擬現實", "Calendar": "日曆", "Syrup Droppers": "糖漿滴管", "Electrical Trends": "電氣趨勢", "Ring in a box": "盒中戒指", "Globe": "球", "Guitar": "結他", "Sewing Machine": "衣車", "Book": "書", "Helmet with Sensor": "帶傳感器嘅頭盔", "Red T-shirt": "紅色T恤", "Basket ball": "籃球"],
        "ko-KR": ["Letter in envelop": "포위하는 편지", "Virtual Reality": "가상 현실", "Calendar": "달력", "Syrup Droppers": "시럽 스포이드", "Electrical Trends": "전기 동향", "Ring in a box": "상자 속의 반지", "Globe": "지구", "Guitar": "기타", "Sewing Machine": "재봉틀", "Book": "책", "Helmet with Sensor": "센서가 있는 헬멧", "Red T-shirt": "빨간 티셔츠", "Basket ball": "바구니 공"],
        "pt-BR": ["Letter in envelop": "Carta em envelope", "Virtual Reality": "Realidade virtual", "Calendar": "Calendário", "Syrup Droppers": "Conta-gotas de xarope", "Electrical Trends": "Tendências elétricas", "Ring in a box": "Anel em uma caixa", "Globe": "Globo", "Guitar": "Violão", "Sewing Machine": "Máquina de costura", "Book": "Livro", "Helmet with Sensor": "Capacete com sensor", "Red T-shirt": "Camiseta vermelha", "Basket ball": "Basquete"],
        "en-HK": ["Letter in envelop": "Letter in envelop", "Virtual Reality": "Virtual Reality", "Calendar": "Calendar", "Syrup Droppers": "Syrup Droppers", "Electrical Trends": "Electrical Trends", "Ring in a box": "Ring in a box", "Globe": "Globe", "Guitar": "Guitar", "Sewing Machine": "Sewing Machine", "Book": "Book", "Helmet with Sensor": "Helmet with Sensor", "Red T-shirt": "Red T-shirt", "Basket ball": "Basket ball"],
        "sk-SK": ["Letter in envelop": "List v obálke", "Virtual Reality": "Virtuálna realita", "Calendar": "Kalendár", "Syrup Droppers": "Kvapkadlá na sirup", "Electrical Trends": "Elektrické trendy", "Ring in a box": "Prsteň v krabici", "Globe": "Glóbus", "Guitar": "Gitara", "Sewing Machine": "Šijací stroj", "Book": "Kniha", "Helmet with Sensor": "Prilba so senzorom", "Red T-shirt": "Červené tričko", "Basket ball": "Basketbalová lopta"],
        "en-PT": ["Letter in envelop": "Letter in envelop", "Virtual Reality": "Virtual Reality", "Calendar": "Calendar", "Syrup Droppers": "Syrup Droppers", "Electrical Trends": "Electrical Trends", "Ring in a box": "Ring in a box", "Globe": "Globe", "Guitar": "Guitar", "Sewing Machine": "Sewing Machine", "Book": "Book", "Helmet with Sensor": "Helmet with Sensor", "Red T-shirt": "Red T-shirt", "Basket ball": "Basket ball"],
        "es-ES": ["Letter in envelop": "Carta en sobre", "Virtual Reality": "Realidad virtual", "Calendar": "Calendario", "Syrup Droppers": "Goteros de jarabe", "Electrical Trends": "Tendencias eléctricas", "Ring in a box": "Anillo en una caja", "Globe": "Globo", "Guitar": "Guitarra", "Sewing Machine": "Máquina de coser", "Book": "Libro", "Helmet with Sensor": "Casco con sensor", "Red T-shirt": "Camiseta roja", "Basket ball": "Pelota de baloncesto"],
        "en-DK": ["Letter in envelop": "Letter in envelop", "Virtual Reality": "Virtual Reality", "Calendar": "Calendar", "Syrup Droppers": "Syrup Droppers", "Electrical Trends": "Electrical Trends", "Ring in a box": "Ring in a box", "Globe": "Globe", "Guitar": "Guitar", "Sewing Machine": "Sewing Machine", "Book": "Book", "Helmet with Sensor": "Helmet with Sensor", "Red T-shirt": "Red T-shirt", "Basket ball": "Basket ball"],
        "cs": ["Letter in envelop": "Dopis v obálce", "Virtual Reality": "Virtuální realita", "Calendar": "Kalendář", "Syrup Droppers": "Sirupová kapátka", "Electrical Trends": "Elektrické trendy", "Ring in a box": "Prsten v krabičce", "Globe": "Glóbus", "Guitar": "Kytara", "Sewing Machine": "Šicí stroj", "Book": "Kniha", "Helmet with Sensor": "Přilba se senzorem", "Red T-shirt": "Červené tričko", "Basket ball": "Basketbalový míč"],
        "it-IT": ["Letter in envelop": "Lettera in busta", "Virtual Reality": "Realtà virtuale", "Calendar": "Calendario", "Syrup Droppers": "Contagocce per sciroppo", "Electrical Trends": "Tendenze elettriche", "Ring in a box": "Anello in una scatola", "Globe": "Globo", "Guitar": "Chitarra", "Sewing Machine": "Macchina per cucire", "Book": "Libro", "Helmet with Sensor": "Casco con sensore", "Red T-shirt": "Maglietta rossa", "Basket ball": "Basket"],
        "th": ["Letter in envelop": "จดหมายในซองจดหมาย", "Virtual Reality": "ความเป็นจริงเสมือน", "Calendar": "ปฏิทิน", "Syrup Droppers": "หยดน้ําเชื่อม", "Electrical Trends": "แนวโน้มไฟฟ้า", "Ring in a box": "แหวนในกล่อง", "Globe": "โลก", "Guitar": "กีตาร์", "Sewing Machine": "จักรเย็บผ้า", "Book": "หนังสือ", "Helmet with Sensor": "หมวกกันน็อคพร้อมเซนเซอร์", "Red T-shirt": "เสื้อยืดสีแดง", "Basket ball": "บาสเกตบอล"],
        "sv-SE": ["Letter in envelop": "Brev i kuvert", "Virtual Reality": "Virtuell verklighet", "Calendar": "Kalender", "Syrup Droppers": "Sirap Droppare", "Electrical Trends": "Elektriska trender", "Ring in a box": "Ring i en ask", "Globe": "Jordglob", "Guitar": "Gitarr", "Sewing Machine": "Symaskin", "Book": "Bok", "Helmet with Sensor": "Hjälm med sensor", "Red T-shirt": "Röd T-shirt", "Basket ball": "Basketboll"],
        "da-DK": ["Letter in envelop": "Bogstav i kuvert", "Virtual Reality": "Virtuel virkelighed", "Calendar": "Kalender", "Syrup Droppers": "Sirup dråber", "Electrical Trends": "Elektriske tendenser", "Ring in a box": "Ring i en æske", "Globe": "Globus", "Guitar": "Guitar", "Sewing Machine": "Symaskine", "Book": "Bog", "Helmet with Sensor": "Hjelm med sensor", "Red T-shirt": "Rød T-shirt", "Basket ball": "Kurv bold"],
        "pl": ["Letter in envelop": "List w kopercie", "Virtual Reality": "Wirtualna rzeczywistość", "Calendar": "Kalendarz", "Syrup Droppers": "Zakraplacze syropu", "Electrical Trends": "Trendy elektryczne", "Ring in a box": "Pierścionek w pudełku", "Globe": "Globus", "Guitar": "Gitara", "Sewing Machine": "Maszyna do szycia", "Book": "Książka", "Helmet with Sensor": "Kask z czujnikiem", "Red T-shirt": "Czerwona koszulka", "Basket ball": "Piłka do koszykówki"],
        "he": ["Letter in envelop": "מכתב במעטפה", "Virtual Reality": "מציאות מדומה", "Calendar": "לוח שנה", "Syrup Droppers": "טפטפות סירופ", "Electrical Trends": "מגמות חשמליות", "Ring in a box": "טבעת בקופסה", "Globe": "גלובוס", "Guitar": "גיטרה", "Sewing Machine": "מכונת תפירה", "Book": "ספר", "Helmet with Sensor": "קסדה עם חיישן", "Red T-shirt": "חולצת טריקו אדומה", "Basket ball": "כדור סל"],
        "en-ID": ["Letter in envelop": "Letter in envelop", "Virtual Reality": "Virtual Reality", "Calendar": "Calendar", "Syrup Droppers": "Syrup Droppers", "Electrical Trends": "Electrical Trends", "Ring in a box": "Ring in a box", "Globe": "Globe", "Guitar": "Guitar", "Sewing Machine": "Sewing Machine", "Book": "Book", "Helmet with Sensor": "Helmet with Sensor", "Red T-shirt": "Red T-shirt", "Basket ball": "Basket ball"]]


@Field DICTIONARY_VIDEO_ROW = [
        "en-IE": ["Your browser doesn't support video": "Your browser doesn't support video"],
        "de": ["Your browser doesn't support video": "Ihr browser unterstützt keine Videos"],
        "hi": ["Your browser doesn't support video": "आपका ब्रूसर वीडियो का समर्थन नहीं करता है"],
        "en-US": ["Your browser doesn't support video": "Your browser doesn't support video"],
        "pt": ["Your browser doesn't support video": "Seu browser não suporta vídeo"],
        "en-MM": ["Your browser doesn't support video": "Your browser doesn't support video"],
        "en-IN": ["Your browser doesn't support video": "Your browser doesn't support video"],
        "en-ZA": ["Your browser doesn't support video": "Your browser doesn't support video"],
        "hu": ["Your browser doesn't support video": "A browser nem támogatja a videót"],
        "nl-BE": ["Your browser doesn't support video": "Uw scanner ondersteunt geen video"],
        "zh-CN": ["Your browser doesn't support video": "您的 browser 不支持视频"],
        "en-IT": ["Your browser doesn't support video": "Your browser doesn't support video"],
        "el-GR": ["Your browser doesn't support video": "Το browser σας δεν υποστηρίζει βίντεο"],
        "en-MY": ["Your browser doesn't support video": "Your browser doesn't support video"],
        "en-ES": ["Your browser doesn't support video": "Your browser doesn't support video"],
        "en-AT": ["Your browser doesn't support video": "Your browser doesn't support video"],
        "en-AU": ["Your browser doesn't support video": "Your browser doesn't support video"],
        "id": ["Your browser doesn't support video": "browser Anda tidak mendukung video"],
        "en-NG": ["Your browser doesn't support video": "Your browser doesn't support video"],
        "en-VN": ["Your browser doesn't support video": "Your browser doesn't support video"],
        "de-CH": ["Your browser doesn't support video": "Ihr browser unterstützt keine Videos"],
        "ms": ["Your browser doesn't support video": "browser anda tidak menyokong video"],
        "en-BD": ["Your browser doesn't support video": "Your browser doesn't support video"],
        "el": ["Your browser doesn't support video": "Το browser σας δεν υποστηρίζει βίντεο"],
        "en": ["Your browser doesn't support video": "Your browser doesn't support video"],
        "it": ["Your browser doesn't support video": "Il tuo browser non supporta il video"],
        "es": ["Your browser doesn't support video": "Tu browser no es compatible con vídeo"],
        "zh": ["Your browser doesn't support video": "您的 browser 不支持视频"],
        "fr-CA": ["Your browser doesn't support video": "Votre browser ne prend pas en charge la vidéo"],
        "en-NZ": ["Your browser doesn't support video": "Your browser doesn't support video"],
        "vi": ["Your browser doesn't support video": "browser của bạn không hỗ trợ video"],
        "fr-BE": ["Your browser doesn't support video": "Votre browser ne prend pas en charge la vidéo"],
        "ja": ["Your browser doesn't support video": "お使いのブラウザはビデオをサポートしていません"],
        "en-SG": ["Your browser doesn't support video": "Your browser doesn't support video"],
        "it-CH": ["Your browser doesn't support video": "Il tuo browser non supporta il video"],
        "fr-FR": ["Your browser doesn't support video": "Votre browser ne prend pas en charge la vidéo"],
        "vi-VN": ["Your browser doesn't support video": "browser của bạn không hỗ trợ video"],
        "en-GB": ["Your browser doesn't support video": "Your browser doesn't support video"],
        "en-KE": ["Your browser doesn't support video": "Your browser doesn't support video"],
        "en-KH": ["Your browser doesn't support video": "Your browser doesn't support video"],
        "bg": ["Your browser doesn't support video": "Вашият browser не поддържа видео"],
        "en-CH": ["Your browser doesn't support video": "Your browser doesn't support video"],
        "en-KR": ["Your browser doesn't support video": "Your browser doesn't support video"],
        "ar-AE": ["Your browser doesn't support video": "لا يدعم browser الفيديو"],
        "fr": ["Your browser doesn't support video": "Votre browser ne prend pas en charge la vidéo"],
        "en-CN": ["Your browser doesn't support video": "Your browser doesn't support video"],
        "de-AT": ["Your browser doesn't support video": "Ihr browser unterstützt keine Videos"],
        "fr-CH": ["Your browser doesn't support video": "Votre browser ne prend pas en charge la vidéo"],
        "sk": ["Your browser doesn't support video": "Váš browser nepodporuje video"],
        "en-TH": ["Your browser doesn't support video": "Your browser doesn't support video"],
        "en-CZ": ["Your browser doesn't support video": "Your browser doesn't support video"],
        "cs-CZ": ["Your browser doesn't support video": "Váš prohlížeč nepodporuje video"],
        "en-PH": ["Your browser doesn't support video": "Your browser doesn't support video"],
        "en-PK": ["Your browser doesn't support video": "Your browser doesn't support video"],
        "en-LK": ["Your browser doesn't support video": "Your browser doesn't support video"],
        "de-DE": ["Your browser doesn't support video": "Ihr browser unterstützt keine Videos"],
        "ko": ["Your browser doesn't support video": "browser가 비디오를 지원하지 않습니다."],
        "zh-TW": ["Your browser doesn't support video": "您的 browser 不支持視頻"],
        "zh-HK": ["Your browser doesn't support video": "您的browser唔撐視頻"],
        "ko-KR": ["Your browser doesn't support video": "browser가 비디오를 지원하지 않습니다."],
        "pt-BR": ["Your browser doesn't support video": "Seu browser não suporta vídeo"],
        "en-HK": ["Your browser doesn't support video": "Your browser doesn't support video"],
        "sk-SK": ["Your browser doesn't support video": "Váš browser nepodporuje video"],
        "en-PT": ["Your browser doesn't support video": "Your browser doesn't support video"],
        "es-ES": ["Your browser doesn't support video": "Tu browser no es compatible con vídeo"],
        "en-DK": ["Your browser doesn't support video": "Your browser doesn't support video"],
        "cs": ["Your browser doesn't support video": "Váš prohlížeč nepodporuje video"],
        "it-IT": ["Your browser doesn't support video": "Il tuo browser non supporta il video"],
        "th": ["Your browser doesn't support video": "browser ของคุณไม่รองรับวิดีโอ"],
        "sv-SE": ["Your browser doesn't support video": "Din browser stöder inte video"],
        "da-DK": ["Your browser doesn't support video": "Din browser understøtter ikke video"],
        "pl": ["Your browser doesn't support video": "Twój browser nie obsługuje wideo"],
        "he": ["Your browser doesn't support video": "browser שלך אינו תומך וידאו"],
        "en-ID": ["Your browser doesn't support video": "Your browser doesn't support video"]
]


def getLocale(resource) {
    def path = resource.getPath();
    if(path.startsWith("/content/experience-fragments")) {
        path =path.replace("/experience-fragments", "")
        def regex = "^((?:[^/]*\\/){4}[^/]*)";
        def pattern = Pattern.compile(regex);
        def matcher = pattern.matcher(path);
        path = matcher.find() ? matcher.group(1) : path
    }
    path = path.replaceAll('/jcr:content.*', "")
    def page = getPage(path)
    if (page == null){
        println """Page is not found: ${path}"""
        return new Locale("en");
    }
    return page.getLanguage();
}

def translate_CAROUSEL_ROW(phrase, locale) {
    def localeString = locale.toString();
    def language = locale.getLanguage();

    println "Translating phrase: '${phrase}' for locale: '${localeString}' and language: '${language}'";
    if(DICTIONARY_CAROUSEL_ROW.containsKey(localeString) && DICTIONARY_CAROUSEL_ROW[localeString].containsKey(phrase)) {
        return DICTIONARY_CAROUSEL_ROW[localeString][phrase];
    } else if (DICTIONARY_CAROUSEL_ROW.containsKey(language) && DICTIONARY_CAROUSEL_ROW[language].containsKey(phrase)) {
        return DICTIONARY_CAROUSEL_ROW[language][phrase];
    } else {
        return phrase;
    }
}

def translate_INFO_ROW(phrase, locale) {
    def localeString = locale.toString();
    def language = locale.getLanguage();

    if(DICTIONARY_INFO_ROW.containsKey(localeString) && DICTIONARY_INFO_ROW[localeString].containsKey(phrase)) {
        return DICTIONARY_INFO_ROW[localeString][phrase];
    } else if (DICTIONARY_INFO_ROW.containsKey(language) && DICTIONARY_INFO_ROW[language].containsKey(phrase)) {
        return DICTIONARY_INFO_ROW[language][phrase];
    } else {
        return phrase;
    }
}

def translate_VIDEO_ROW(phrase, locale) {
    def localeString = locale.toString();
    def language = locale.getLanguage();

    if(DICTIONARY_VIDEO_ROW.containsKey(localeString) && DICTIONARY_VIDEO_ROW[localeString].containsKey(phrase)) {
        return DICTIONARY_VIDEO_ROW[localeString][phrase];
    } else if (DICTIONARY_VIDEO_ROW.containsKey(language) && DICTIONARY_VIDEO_ROW[language].containsKey(phrase)) {
        return DICTIONARY_VIDEO_ROW[language][phrase];
    } else {
        return phrase;
    }
}


def handleCarouselRow(homePage) {
    def types = ["localization-and-authenticity","more-than-apple-watch"];
    def resourceType ="dhl/components/animated-content/carousel-row";
    def properties = [
            "imgAltText1" : "Vodka Berlin",
            "imgAltText2" : "Vodka Korea",
            "imgAltText3" : "Vodka BuenosAires",
            "imgAltText4" : "Black apple watch",
            "imgAltText5" : "Black color watch strap",
            "imgAltText6" : "Pink color watch strap"
    ]
    def typeConditions = types.collect { "node.type = '${it}'" }.join(" OR ");
    def query = """
        SELECT * FROM [nt:unstructured] AS node WHERE ISDESCENDANTNODE([${homePage.getPath()}])
        and (node.[sling:resourceType]='${resourceType}')
        and (${typeConditions})
    """

    sql2Query(query).each( node -> {
        properties.each((key, value) -> {
            def translatedValue = translate_CAROUSEL_ROW(value, getLocale(node));
            println """set ${key}:${translatedValue} to ${node.getPath()}"""
            node.setProperty(key, translatedValue)
        })
    })
}

def handleInfoRow(homePage) {
    def types = ["change-in-asia", "china-middle-class", "cosmetic", "dependable-delivery", "dhl-medical-express", "electric-trends", "getting-goods-to-customers", "going-global", "guitar", "home-testing-kits","largest-product-markets","looking-healthy","making-fashion","premium-papers","sensors","smart-fabrics","smart-home","sporting-goods"];
    def resourceType ="dhl/components/animated-content/info-row";
    def properties = [
            "imgAltText1" : "Letter in envelop",
            "imgAltText2" : "Virtual Reality",
            "imgAltText3" : "Calendar",
            "imgAltText4" : "Syrup Droppers",
            "imgAltText5" : "Electrical Trends",
            "imgAltText6" : "Ring in a box",
            "imgAltText7" : "Globe",
            "imgAltText8" : "Guitar",
            "imgAltText9" : "Sewing Machine",
            "imgAltText10" : "Book",
            "imgAltText11" : "Helmet with Sensor",
            "imgAltText12" : "Red T-shirt",
            "imgAltText13" : "Basket ball"
    ]
    def typeConditions = types.collect { "node.type = '${it}'" }.join(" OR ");
    def query = """
        SELECT * FROM [nt:unstructured] AS node WHERE ISDESCENDANTNODE([${homePage.getPath()}])
        and (node.[sling:resourceType]='${resourceType}')
        and (${typeConditions})
    """
    sql2Query(query).each( node -> {
        properties.each((key, value) -> {
            def translatedValue = translate_INFO_ROW(value, getLocale(node));
            println """set ${key}:${translatedValue} to ${node.getPath()}"""
            node.setProperty(key, translatedValue)
        })
    })
}

def handleVideoRow(homePage) {
    def resourceType ="dhl/components/animated-content/video-row";
    def properties = [
            "imgAltText" : "Your browser doesn't support video"
    ]
    def query = """
        SELECT * FROM [nt:unstructured] AS node WHERE ISDESCENDANTNODE([${homePage.getPath()}])
        and (node.[sling:resourceType]='${resourceType}')
    
    """

    sql2Query(query).each( node -> {
        properties.each((key, value) -> {
            def translatedValue = translate_VIDEO_ROW(value, getLocale(node));
            println """set ${key}:${translatedValue} to ${node.getPath()}"""
            node.setProperty(key, translatedValue)
        })
    })
}

getHomePages().each( homePage -> {
    handleCarouselRow(homePage);
    handleInfoRow(homePage);
    handleVideoRow(homePage);
    if(DRY_RUN) {
        session.refresh(false);
    } else {
        save();
    }
})