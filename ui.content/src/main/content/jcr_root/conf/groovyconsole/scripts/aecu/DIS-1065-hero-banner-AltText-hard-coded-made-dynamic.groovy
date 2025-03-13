import groovy.transform.Field

@Field DRY_RUN = false

def getHomePages() {
    return sql2Query("""
        SELECT * FROM [nt:unstructured] AS node
        WHERE ISDESCENDANTNODE('/content/dhl')
        AND node.[cq:template] = '/conf/dhl/settings/wcm/templates/home-page'
    """).stream().map{ it.getParent() };
}

@Field DICTIONARY_HERO_BANNER = [
        "en-IE": ["Cosmetics": "Cosmetics", "Consumer Electronic": "Consumer Electronic", "Luxurious watch and earrings": "Luxurious watch and earrings", "Medical Devices": "Medical Devices", "Musical Instrument": "Musical Instrument", "Office Stationaries": "Office Stationaries", "Parcel Packaging": "Parcel Packaging", "Smart Sports Watch": "Smart Sports Watch", "Text Tiles": "Text Tiles"],
        "de": ["Cosmetics": "Kosmetik", "Consumer Electronic": "Unterhaltungselektronik", "Luxurious watch and earrings": "Luxuriöse Uhr und Ohrringe", "Medical Devices": "Medizinprodukte", "Musical Instrument": "Musikinstrument", "Office Stationaries": "Büromaterial", "Parcel Packaging": "Paketverpackung", "Smart Sports Watch": "Smarte Sportuhr", "Text Tiles": "Textkacheln"],
        "hi": ["Cosmetics": "सौंदर्य प्रसाधन", "Consumer Electronic": "उपभोक्ता इलेक्ट्रॉनिक", "Luxurious watch and earrings": "शानदार घड़ी और झुमके", "Medical Devices": "चिकित्सा उपकरण", "Musical Instrument": "बाजा", "Office Stationaries": "कार्यालय स्टेशनरी", "Parcel Packaging": "पार्सल पैकेजिंग", "Smart Sports Watch": "स्मार्ट स्पोर्ट्स वॉच", "Text Tiles": "टेक्स्ट टाइल्स"],
        "en-US": ["Cosmetics": "Cosmetics", "Consumer Electronic": "Consumer Electronic", "Luxurious watch and earrings": "Luxurious watch and earrings", "Medical Devices": "Medical Devices", "Musical Instrument": "Musical Instrument", "Office Stationaries": "Office Stationaries", "Parcel Packaging": "Parcel Packaging", "Smart Sports Watch": "Smart Sports Watch", "Text Tiles": "Text Tiles"],
        "pt": ["Cosmetics": "Cosméticos", "Consumer Electronic": "Eletrônicos de consumo", "Luxurious watch and earrings": "Relógio e brincos luxuosos", "Medical Devices": "Dispositivos médicos", "Musical Instrument": "Instrumento musical", "Office Stationaries": "Estacionários de escritório", "Parcel Packaging": "Embalagem de encomendas", "Smart Sports Watch": "Relógio esportivo inteligente", "Text Tiles": "Blocos de texto"],
        "en-MM": ["Cosmetics": "Cosmetics", "Consumer Electronic": "Consumer Electronic", "Luxurious watch and earrings": "Luxurious watch and earrings", "Medical Devices": "Medical Devices", "Musical Instrument": "Musical Instrument", "Office Stationaries": "Office Stationaries", "Parcel Packaging": "Parcel Packaging", "Smart Sports Watch": "Smart Sports Watch", "Text Tiles": "Text Tiles"],
        "en-IN": ["Cosmetics": "Cosmetics", "Consumer Electronic": "Consumer Electronic", "Luxurious watch and earrings": "Luxurious watch and earrings", "Medical Devices": "Medical Devices", "Musical Instrument": "Musical Instrument", "Office Stationaries": "Office Stationaries", "Parcel Packaging": "Parcel Packaging", "Smart Sports Watch": "Smart Sports Watch", "Text Tiles": "Text Tiles"],
        "en-ZA": ["Cosmetics": "Cosmetics", "Consumer Electronic": "Consumer Electronic", "Luxurious watch and earrings": "Luxurious watch and earrings", "Medical Devices": "Medical Devices", "Musical Instrument": "Musical Instrument", "Office Stationaries": "Office Stationaries", "Parcel Packaging": "Parcel Packaging", "Smart Sports Watch": "Smart Sports Watch", "Text Tiles": "Text Tiles"],
        "hu": ["Cosmetics": "Kozmetika", "Consumer Electronic": "Fogyasztói elektronika", "Luxurious watch and earrings": "Luxus óra és fülbevaló", "Medical Devices": "Orvosi eszközök", "Musical Instrument": "Hangszer", "Office Stationaries": "Irodai helyhez kötött", "Parcel Packaging": "Csomag csomagolás", "Smart Sports Watch": "Okos sportóra", "Text Tiles": "Szöveg csempék"],
        "nl-BE": ["Cosmetics": "Cosmetica", "Consumer Electronic": "Consumentenelektronica", "Luxurious watch and earrings": "Luxe horloge en oorbellen", "Medical Devices": "Medische hulpmiddelen", "Musical Instrument": "Muziekinstrument", "Office Stationaries": "Kantoorbenodigdheden", "Parcel Packaging": "Pakket verpakking", "Smart Sports Watch": "Slim sporthorloge", "Text Tiles": "Tekst tegels"],
        "zh-CN": ["Cosmetics": "化妆品", "Consumer Electronic": "消费电子", "Luxurious watch and earrings": "奢华手表和耳环", "Medical Devices": "医疗设备", "Musical Instrument": "乐器", "Office Stationaries": "办公文具", "Parcel Packaging": "包裹包装", "Smart Sports Watch": "智能运动手表", "Text Tiles": "文本平铺"],
        "en-IT": ["Cosmetics": "Cosmetics", "Consumer Electronic": "Consumer Electronic", "Luxurious watch and earrings": "Luxurious watch and earrings", "Medical Devices": "Medical Devices", "Musical Instrument": "Musical Instrument", "Office Stationaries": "Office Stationaries", "Parcel Packaging": "Parcel Packaging", "Smart Sports Watch": "Smart Sports Watch", "Text Tiles": "Text Tiles"],
        "el-GR": ["Cosmetics": "Καλλυντικά", "Consumer Electronic": "Ηλεκτρονικά είδη ευρείας κατανάλωσης", "Luxurious watch and earrings": "Πολυτελές ρολόι και σκουλαρίκια", "Medical Devices": "Ιατροτεχνολογικά", "Musical Instrument": "Μουσικό όργανο", "Office Stationaries": "Γραφική ύλη γραφείου", "Parcel Packaging": "Συσκευασία δεμάτων", "Smart Sports Watch": "Έξυπνο αθλητικό ρολόι", "Text Tiles": "Πλακίδια κειμένου"],
        "en-MY": ["Cosmetics": "Cosmetics", "Consumer Electronic": "Consumer Electronic", "Luxurious watch and earrings": "Luxurious watch and earrings", "Medical Devices": "Medical Devices", "Musical Instrument": "Musical Instrument", "Office Stationaries": "Office Stationaries", "Parcel Packaging": "Parcel Packaging", "Smart Sports Watch": "Smart Sports Watch", "Text Tiles": "Text Tiles"],
        "en-ES": ["Cosmetics": "Cosmetics", "Consumer Electronic": "Consumer Electronic", "Luxurious watch and earrings": "Luxurious watch and earrings", "Medical Devices": "Medical Devices", "Musical Instrument": "Musical Instrument", "Office Stationaries": "Office Stationaries", "Parcel Packaging": "Parcel Packaging", "Smart Sports Watch": "Smart Sports Watch", "Text Tiles": "Text Tiles"],
        "en-AT": ["Cosmetics": "Cosmetics", "Consumer Electronic": "Consumer Electronic", "Luxurious watch and earrings": "Luxurious watch and earrings", "Medical Devices": "Medical Devices", "Musical Instrument": "Musical Instrument", "Office Stationaries": "Office Stationaries", "Parcel Packaging": "Parcel Packaging", "Smart Sports Watch": "Smart Sports Watch", "Text Tiles": "Text Tiles"],
        "en-AU": ["Cosmetics": "Cosmetics", "Consumer Electronic": "Consumer Electronic", "Luxurious watch and earrings": "Luxurious watch and earrings", "Medical Devices": "Medical Devices", "Musical Instrument": "Musical Instrument", "Office Stationaries": "Office Stationaries", "Parcel Packaging": "Parcel Packaging", "Smart Sports Watch": "Smart Sports Watch", "Text Tiles": "Text Tiles"],
        "id": ["Cosmetics": "Kosmetik", "Consumer Electronic": "Elektronik Konsumen", "Luxurious watch and earrings": "Jam tangan dan anting-anting mewah", "Medical Devices": "Alat Kesehatan", "Musical Instrument": "Alat musik", "Office Stationaries": "Alat tulis kantor", "Parcel Packaging": "Kemasan Paket", "Smart Sports Watch": "Jam Tangan Olahraga Cerdas", "Text Tiles": "Ubin Teks"],
        "en-NG": ["Cosmetics": "Cosmetics", "Consumer Electronic": "Consumer Electronic", "Luxurious watch and earrings": "Luxurious watch and earrings", "Medical Devices": "Medical Devices", "Musical Instrument": "Musical Instrument", "Office Stationaries": "Office Stationaries", "Parcel Packaging": "Parcel Packaging", "Smart Sports Watch": "Smart Sports Watch", "Text Tiles": "Text Tiles"],
        "en-VN": ["Cosmetics": "Cosmetics", "Consumer Electronic": "Consumer Electronic", "Luxurious watch and earrings": "Luxurious watch and earrings", "Medical Devices": "Medical Devices", "Musical Instrument": "Musical Instrument", "Office Stationaries": "Office Stationaries", "Parcel Packaging": "Parcel Packaging", "Smart Sports Watch": "Smart Sports Watch", "Text Tiles": "Text Tiles"],
        "de-CH": ["Cosmetics": "Kosmetik", "Consumer Electronic": "Unterhaltungselektronik", "Luxurious watch and earrings": "Luxuriöse Uhr und Ohrringe", "Medical Devices": "Medizinprodukte", "Musical Instrument": "Musikinstrument", "Office Stationaries": "Büromaterial", "Parcel Packaging": "Paketverpackung", "Smart Sports Watch": "Smarte Sportuhr", "Text Tiles": "Textkacheln"],
        "ms": ["Cosmetics": "Kosmetik", "Consumer Electronic": "Elektronik Pengguna", "Luxurious watch and earrings": "Jam tangan dan anting-anting mewah", "Medical Devices": "Peranti Perubatan", "Musical Instrument": "Alat muzik", "Office Stationaries": "Alat tulis pejabat", "Parcel Packaging": "Pembungkusan Bungkusan", "Smart Sports Watch": "Jam Tangan Sukan Pintar", "Text Tiles": "Jubin Teks"],
        "en-BD": ["Cosmetics": "Cosmetics", "Consumer Electronic": "Consumer Electronic", "Luxurious watch and earrings": "Luxurious watch and earrings", "Medical Devices": "Medical Devices", "Musical Instrument": "Musical Instrument", "Office Stationaries": "Office Stationaries", "Parcel Packaging": "Parcel Packaging", "Smart Sports Watch": "Smart Sports Watch", "Text Tiles": "Text Tiles"],
        "el": ["Cosmetics": "Καλλυντικά", "Consumer Electronic": "Ηλεκτρονικά είδη ευρείας κατανάλωσης", "Luxurious watch and earrings": "Πολυτελές ρολόι και σκουλαρίκια", "Medical Devices": "Ιατροτεχνολογικά", "Musical Instrument": "Μουσικό όργανο", "Office Stationaries": "Γραφική ύλη γραφείου", "Parcel Packaging": "Συσκευασία δεμάτων", "Smart Sports Watch": "Έξυπνο αθλητικό ρολόι", "Text Tiles": "Πλακίδια κειμένου"],
        "en": ["Cosmetics": "Cosmetics", "Consumer Electronic": "Consumer Electronic", "Luxurious watch and earrings": "Luxurious watch and earrings", "Medical Devices": "Medical Devices", "Musical Instrument": "Musical Instrument", "Office Stationaries": "Office Stationaries", "Parcel Packaging": "Parcel Packaging", "Smart Sports Watch": "Smart Sports Watch", "Text Tiles": "Text Tiles"],
        "it": ["Cosmetics": "Cosmesi", "Consumer Electronic": "Elettronica di consumo", "Luxurious watch and earrings": "Orologio e orecchini di lusso", "Medical Devices": "Dispositivi medici", "Musical Instrument": "Strumento musicale", "Office Stationaries": "Cancelleria per ufficio", "Parcel Packaging": "Imballaggio dei pacchi", "Smart Sports Watch": "Orologio sportivo intelligente", "Text Tiles": "Riquadri di testo"],
        "es": ["Cosmetics": "Cosméticos", "Consumer Electronic": "Electrónica de consumo", "Luxurious watch and earrings": "Reloj y pendientes de lujo", "Medical Devices": "Dispositivos médicos", "Musical Instrument": "Instrumento musical", "Office Stationaries": "Papelería de oficina", "Parcel Packaging": "Embalaje de paquetes", "Smart Sports Watch": "Reloj deportivo inteligente", "Text Tiles": "Mosaicos de texto"],
        "zh": ["Cosmetics": "化妆品", "Consumer Electronic": "消费电子", "Luxurious watch and earrings": "奢华手表和耳环", "Medical Devices": "医疗设备", "Musical Instrument": "乐器", "Office Stationaries": "办公文具", "Parcel Packaging": "包裹包装", "Smart Sports Watch": "智能运动手表", "Text Tiles": "文本平铺"],
        "fr-CA": ["Cosmetics": "Cosmétiques", "Consumer Electronic": "Électronique grand public", "Luxurious watch and earrings": "Montre et boucles d’oreilles luxueuses", "Medical Devices": "Instruments médicaux", "Musical Instrument": "Instrument de musique", "Office Stationaries": "Papeterie de bureau", "Parcel Packaging": "Emballage de colis", "Smart Sports Watch": "Montre de sport intelligente", "Text Tiles": "Tuiles de texte"],
        "en-NZ": ["Cosmetics": "Cosmetics", "Consumer Electronic": "Consumer Electronic", "Luxurious watch and earrings": "Luxurious watch and earrings", "Medical Devices": "Medical Devices", "Musical Instrument": "Musical Instrument", "Office Stationaries": "Office Stationaries", "Parcel Packaging": "Parcel Packaging", "Smart Sports Watch": "Smart Sports Watch", "Text Tiles": "Text Tiles"],
        "vi": ["Cosmetics": "Phấn sáp", "Consumer Electronic": "Điện tử tiêu dùng", "Luxurious watch and earrings": "Đồng hồ và hoa tai sang trọng", "Medical Devices": "Thiết bị y tế", "Musical Instrument": "Nhạc cụ", "Office Stationaries": "Văn phòng phẩm", "Parcel Packaging": "Bao bì bưu kiện", "Smart Sports Watch": "Đồng hồ thể thao thông minh", "Text Tiles": "Gạch văn bản"],
        "fr-BE": ["Cosmetics": "Cosmétique", "Consumer Electronic": "Électronique grand public", "Luxurious watch and earrings": "Montre et boucles d’oreilles de luxe", "Medical Devices": "Dispositifs médicaux", "Musical Instrument": "Instrument de musique", "Office Stationaries": "Papeterie de bureau", "Parcel Packaging": "Emballage de colis", "Smart Sports Watch": "Montre de sport intelligente", "Text Tiles": "Mosaïques de texte"],
        "ja": ["Cosmetics": "コスメ", "Consumer Electronic": "コンシューマエレクトロニクス", "Luxurious watch and earrings": "高級感のある時計とイヤリング", "Medical Devices": "医療機器", "Musical Instrument": "楽器", "Office Stationaries": "オフィスステーショナリー", "Parcel Packaging": "パーセル包装", "Smart Sports Watch": "スマートスポーツウォッチ", "Text Tiles": "テキストタイル"],
        "en-SG": ["Cosmetics": "Cosmetics", "Consumer Electronic": "Consumer Electronic", "Luxurious watch and earrings": "Luxurious watch and earrings", "Medical Devices": "Medical Devices", "Musical Instrument": "Musical Instrument", "Office Stationaries": "Office Stationaries", "Parcel Packaging": "Parcel Packaging", "Smart Sports Watch": "Smart Sports Watch", "Text Tiles": "Text Tiles"],
        "it-CH": ["Cosmetics": "Cosmesi", "Consumer Electronic": "Elettronica di consumo", "Luxurious watch and earrings": "Orologio e orecchini di lusso", "Medical Devices": "Dispositivi medici", "Musical Instrument": "Strumento musicale", "Office Stationaries": "Cancelleria per ufficio", "Parcel Packaging": "Imballaggio dei pacchi", "Smart Sports Watch": "Orologio sportivo intelligente", "Text Tiles": "Riquadri di testo"],
        "fr-FR": ["Cosmetics": "Cosmétique", "Consumer Electronic": "Électronique grand public", "Luxurious watch and earrings": "Montre et boucles d’oreilles de luxe", "Medical Devices": "Dispositifs médicaux", "Musical Instrument": "Instrument de musique", "Office Stationaries": "Papeterie de bureau", "Parcel Packaging": "Emballage de colis", "Smart Sports Watch": "Montre de sport intelligente", "Text Tiles": "Mosaïques de texte"],
        "vi-VN": ["Cosmetics": "Phấn sáp", "Consumer Electronic": "Điện tử tiêu dùng", "Luxurious watch and earrings": "Đồng hồ và hoa tai sang trọng", "Medical Devices": "Thiết bị y tế", "Musical Instrument": "Nhạc cụ", "Office Stationaries": "Văn phòng phẩm", "Parcel Packaging": "Bao bì bưu kiện", "Smart Sports Watch": "Đồng hồ thể thao thông minh", "Text Tiles": "Gạch văn bản"],
        "en-GB": ["Cosmetics": "Cosmetics", "Consumer Electronic": "Consumer Electronic", "Luxurious watch and earrings": "Luxurious watch and earrings", "Medical Devices": "Medical Devices", "Musical Instrument": "Musical Instrument", "Office Stationaries": "Office Stationaries", "Parcel Packaging": "Parcel Packaging", "Smart Sports Watch": "Smart Sports Watch", "Text Tiles": "Text Tiles"],
        "en-KE": ["Cosmetics": "Cosmetics", "Consumer Electronic": "Consumer Electronic", "Luxurious watch and earrings": "Luxurious watch and earrings", "Medical Devices": "Medical Devices", "Musical Instrument": "Musical Instrument", "Office Stationaries": "Office Stationaries", "Parcel Packaging": "Parcel Packaging", "Smart Sports Watch": "Smart Sports Watch", "Text Tiles": "Text Tiles"],
        "en-KH": ["Cosmetics": "Cosmetics", "Consumer Electronic": "Consumer Electronic", "Luxurious watch and earrings": "Luxurious watch and earrings", "Medical Devices": "Medical Devices", "Musical Instrument": "Musical Instrument", "Office Stationaries": "Office Stationaries", "Parcel Packaging": "Parcel Packaging", "Smart Sports Watch": "Smart Sports Watch", "Text Tiles": "Text Tiles"],
        "bg": ["Cosmetics": "Козметика", "Consumer Electronic": "Потребителска електроника", "Luxurious watch and earrings": "Луксозен часовник и обеци", "Medical Devices": "Медицински изделия", "Musical Instrument": "Музикален инструмент", "Office Stationaries": "Офис канцеларски материали", "Parcel Packaging": "Опаковки за колети", "Smart Sports Watch": "Интелигентен спортен часовник", "Text Tiles": "Текстови плочки"],
        "en-CH": ["Cosmetics": "Cosmetics", "Consumer Electronic": "Consumer Electronic", "Luxurious watch and earrings": "Luxurious watch and earrings", "Medical Devices": "Medical Devices", "Musical Instrument": "Musical Instrument", "Office Stationaries": "Office Stationaries", "Parcel Packaging": "Parcel Packaging", "Smart Sports Watch": "Smart Sports Watch", "Text Tiles": "Text Tiles"],
        "en-KR": ["Cosmetics": "Cosmetics", "Consumer Electronic": "Consumer Electronic", "Luxurious watch and earrings": "Luxurious watch and earrings", "Medical Devices": "Medical Devices", "Musical Instrument": "Musical Instrument", "Office Stationaries": "Office Stationaries", "Parcel Packaging": "Parcel Packaging", "Smart Sports Watch": "Smart Sports Watch", "Text Tiles": "Text Tiles"],
        "ar-AE": ["Cosmetics": "مستحضرات التجميل", "Consumer Electronic": "الالكترونيات الاستهلاكية", "Luxurious watch and earrings": "ساعة وأقراط فاخرة", "Medical Devices": "الأجهزة الطبية", "Musical Instrument": "آلة موسيقية", "Office Stationaries": "قرطاسية المكاتب", "Parcel Packaging": "تغليف الطرود", "Smart Sports Watch": "ساعة رياضية ذكية", "Text Tiles": "بلاط النص"],
        "fr": ["Cosmetics": "Cosmétique", "Consumer Electronic": "Électronique grand public", "Luxurious watch and earrings": "Montre et boucles d’oreilles de luxe", "Medical Devices": "Dispositifs médicaux", "Musical Instrument": "Instrument de musique", "Office Stationaries": "Papeterie de bureau", "Parcel Packaging": "Emballage de colis", "Smart Sports Watch": "Montre de sport intelligente", "Text Tiles": "Mosaïques de texte"],
        "en-CN": ["Cosmetics": "Cosmetics", "Consumer Electronic": "Consumer Electronic", "Luxurious watch and earrings": "Luxurious watch and earrings", "Medical Devices": "Medical Devices", "Musical Instrument": "Musical Instrument", "Office Stationaries": "Office Stationaries", "Parcel Packaging": "Parcel Packaging", "Smart Sports Watch": "Smart Sports Watch", "Text Tiles": "Text Tiles"],
        "de-AT": ["Cosmetics": "Kosmetik", "Consumer Electronic": "Unterhaltungselektronik", "Luxurious watch and earrings": "Luxuriöse Uhr und Ohrringe", "Medical Devices": "Medizinprodukte", "Musical Instrument": "Musikinstrument", "Office Stationaries": "Büromaterial", "Parcel Packaging": "Paketverpackung", "Smart Sports Watch": "Smarte Sportuhr", "Text Tiles": "Textkacheln"],
        "fr-CH": ["Cosmetics": "Cosmétique", "Consumer Electronic": "Électronique grand public", "Luxurious watch and earrings": "Montre et boucles d’oreilles de luxe", "Medical Devices": "Dispositifs médicaux", "Musical Instrument": "Instrument de musique", "Office Stationaries": "Papeterie de bureau", "Parcel Packaging": "Emballage de colis", "Smart Sports Watch": "Montre de sport intelligente", "Text Tiles": "Mosaïques de texte"],
        "sk": ["Cosmetics": "Kozmetika", "Consumer Electronic": "Spotrebná elektronika", "Luxurious watch and earrings": "Luxusné hodinky a náušnice", "Medical Devices": "Zdravotnícke pomôcky", "Musical Instrument": "Hudobný nástroj", "Office Stationaries": "Kancelárske potreby", "Parcel Packaging": "Balenie balíkov", "Smart Sports Watch": "Inteligentné športové hodinky", "Text Tiles": "Textové dlaždice"],
        "en-TH": ["Cosmetics": "Cosmetics", "Consumer Electronic": "Consumer Electronic", "Luxurious watch and earrings": "Luxurious watch and earrings", "Medical Devices": "Medical Devices", "Musical Instrument": "Musical Instrument", "Office Stationaries": "Office Stationaries", "Parcel Packaging": "Parcel Packaging", "Smart Sports Watch": "Smart Sports Watch", "Text Tiles": "Text Tiles"],
        "en-CZ": ["Cosmetics": "Cosmetics", "Consumer Electronic": "Consumer Electronic", "Luxurious watch and earrings": "Luxurious watch and earrings", "Medical Devices": "Medical Devices", "Musical Instrument": "Musical Instrument", "Office Stationaries": "Office Stationaries", "Parcel Packaging": "Parcel Packaging", "Smart Sports Watch": "Smart Sports Watch", "Text Tiles": "Text Tiles"],
        "cs-CZ": ["Cosmetics": "Kosmetika", "Consumer Electronic": "Spotřební elektronika", "Luxurious watch and earrings": "Luxusní hodinky a náušnice", "Medical Devices": "Zdravotnické prostředky", "Musical Instrument": "Hudební nástroj", "Office Stationaries": "Kancelářské potřeby", "Parcel Packaging": "Balení balíků", "Smart Sports Watch": "Chytré sportovní hodinky", "Text Tiles": "Textové dlaždice"],
        "en-PH": ["Cosmetics": "Cosmetics", "Consumer Electronic": "Consumer Electronic", "Luxurious watch and earrings": "Luxurious watch and earrings", "Medical Devices": "Medical Devices", "Musical Instrument": "Musical Instrument", "Office Stationaries": "Office Stationaries", "Parcel Packaging": "Parcel Packaging", "Smart Sports Watch": "Smart Sports Watch", "Text Tiles": "Text Tiles"],
        "en-PK": ["Cosmetics": "Cosmetics", "Consumer Electronic": "Consumer Electronic", "Luxurious watch and earrings": "Luxurious watch and earrings", "Medical Devices": "Medical Devices", "Musical Instrument": "Musical Instrument", "Office Stationaries": "Office Stationaries", "Parcel Packaging": "Parcel Packaging", "Smart Sports Watch": "Smart Sports Watch", "Text Tiles": "Text Tiles"],
        "en-LK": ["Cosmetics": "Cosmetics", "Consumer Electronic": "Consumer Electronic", "Luxurious watch and earrings": "Luxurious watch and earrings", "Medical Devices": "Medical Devices", "Musical Instrument": "Musical Instrument", "Office Stationaries": "Office Stationaries", "Parcel Packaging": "Parcel Packaging", "Smart Sports Watch": "Smart Sports Watch", "Text Tiles": "Text Tiles"],
        "de-DE": ["Cosmetics": "Kosmetik", "Consumer Electronic": "Unterhaltungselektronik", "Luxurious watch and earrings": "Luxuriöse Uhr und Ohrringe", "Medical Devices": "Medizinprodukte", "Musical Instrument": "Musikinstrument", "Office Stationaries": "Büromaterial", "Parcel Packaging": "Paketverpackung", "Smart Sports Watch": "Smarte Sportuhr", "Text Tiles": "Textkacheln"],
        "ko": ["Cosmetics": "화장품", "Consumer Electronic": "소비자 전자 제품", "Luxurious watch and earrings": "럭셔리한 시계와 귀걸이", "Medical Devices": "의료 기기", "Musical Instrument": "악기", "Office Stationaries": "사무용 문구류", "Parcel Packaging": "소포 포장", "Smart Sports Watch": "스마트 스포츠 시계", "Text Tiles": "텍스트 타일"],
        "zh-TW": ["Cosmetics": "化妝品", "Consumer Electronic": "消費電子", "Luxurious watch and earrings": "奢華手錶和耳環", "Medical Devices": "醫療設備", "Musical Instrument": "樂器", "Office Stationaries": "辦公文具", "Parcel Packaging": "包裹包裝", "Smart Sports Watch": "智慧運動手錶", "Text Tiles": "文本平鋪"],
        "zh-HK": ["Cosmetics": "化妝品", "Consumer Electronic": "消費電子", "Luxurious watch and earrings": "奢華手錶同耳環", "Medical Devices": "醫療設備", "Musical Instrument": "樂器", "Office Stationaries": "辦公文具", "Parcel Packaging": "包裹包裝", "Smart Sports Watch": "智能運動手錶", "Text Tiles": "文本平舖"],
        "ko-KR": ["Cosmetics": "화장품", "Consumer Electronic": "소비자 전자 제품", "Luxurious watch and earrings": "럭셔리한 시계와 귀걸이", "Medical Devices": "의료 기기", "Musical Instrument": "악기", "Office Stationaries": "사무용 문구류", "Parcel Packaging": "소포 포장", "Smart Sports Watch": "스마트 스포츠 시계", "Text Tiles": "텍스트 타일"],
        "pt-BR": ["Cosmetics": "Cosméticos", "Consumer Electronic": "Eletrônicos de consumo", "Luxurious watch and earrings": "Relógio e brincos luxuosos", "Medical Devices": "Dispositivos médicos", "Musical Instrument": "Instrumento musical", "Office Stationaries": "Estacionários de escritório", "Parcel Packaging": "Embalagem de encomendas", "Smart Sports Watch": "Relógio esportivo inteligente", "Text Tiles": "Blocos de texto"],
        "en-HK": ["Cosmetics": "Cosmetics", "Consumer Electronic": "Consumer Electronic", "Luxurious watch and earrings": "Luxurious watch and earrings", "Medical Devices": "Medical Devices", "Musical Instrument": "Musical Instrument", "Office Stationaries": "Office Stationaries", "Parcel Packaging": "Parcel Packaging", "Smart Sports Watch": "Smart Sports Watch", "Text Tiles": "Text Tiles"],
        "sk-SK": ["Cosmetics": "Kozmetika", "Consumer Electronic": "Spotrebná elektronika", "Luxurious watch and earrings": "Luxusné hodinky a náušnice", "Medical Devices": "Zdravotnícke pomôcky", "Musical Instrument": "Hudobný nástroj", "Office Stationaries": "Kancelárske potreby", "Parcel Packaging": "Balenie balíkov", "Smart Sports Watch": "Inteligentné športové hodinky", "Text Tiles": "Textové dlaždice"],
        "en-PT": ["Cosmetics": "Cosmetics", "Consumer Electronic": "Consumer Electronic", "Luxurious watch and earrings": "Luxurious watch and earrings", "Medical Devices": "Medical Devices", "Musical Instrument": "Musical Instrument", "Office Stationaries": "Office Stationaries", "Parcel Packaging": "Parcel Packaging", "Smart Sports Watch": "Smart Sports Watch", "Text Tiles": "Text Tiles"],
        "es-ES": ["Cosmetics": "Cosméticos", "Consumer Electronic": "Electrónica de consumo", "Luxurious watch and earrings": "Reloj y pendientes de lujo", "Medical Devices": "Dispositivos médicos", "Musical Instrument": "Instrumento musical", "Office Stationaries": "Papelería de oficina", "Parcel Packaging": "Embalaje de paquetes", "Smart Sports Watch": "Reloj deportivo inteligente", "Text Tiles": "Mosaicos de texto"],
        "en-DK": ["Cosmetics": "Cosmetics", "Consumer Electronic": "Consumer Electronic", "Luxurious watch and earrings": "Luxurious watch and earrings", "Medical Devices": "Medical Devices", "Musical Instrument": "Musical Instrument", "Office Stationaries": "Office Stationaries", "Parcel Packaging": "Parcel Packaging", "Smart Sports Watch": "Smart Sports Watch", "Text Tiles": "Text Tiles"],
        "cs": ["Cosmetics": "Kosmetika", "Consumer Electronic": "Spotřební elektronika", "Luxurious watch and earrings": "Luxusní hodinky a náušnice", "Medical Devices": "Zdravotnické prostředky", "Musical Instrument": "Hudební nástroj", "Office Stationaries": "Kancelářské potřeby", "Parcel Packaging": "Balení balíků", "Smart Sports Watch": "Chytré sportovní hodinky", "Text Tiles": "Textové dlaždice"],
        "it-IT": ["Cosmetics": "Cosmesi", "Consumer Electronic": "Elettronica di consumo", "Luxurious watch and earrings": "Orologio e orecchini di lusso", "Medical Devices": "Dispositivi medici", "Musical Instrument": "Strumento musicale", "Office Stationaries": "Cancelleria per ufficio", "Parcel Packaging": "Imballaggio dei pacchi", "Smart Sports Watch": "Orologio sportivo intelligente", "Text Tiles": "Riquadri di testo"],
        "th": ["Cosmetics": "เครื่องสําอาง", "Consumer Electronic": "เครื่องใช้ไฟฟ้า", "Luxurious watch and earrings": "นาฬิกาและต่างหูสุดหรู", "Medical Devices": "อุปกรณ์การแพทย์", "Musical Instrument": "เครื่องดนตรี", "Office Stationaries": "เครื่องเขียนสํานักงาน", "Parcel Packaging": "บรรจุภัณฑ์พัสดุ", "Smart Sports Watch": "สมาร์ทสปอร์ตวอทช์", "Text Tiles": "ไทล์ข้อความ"],
        "sv-SE": ["Cosmetics": "Kosmetika", "Consumer Electronic": "Konsumentelektronik", "Luxurious watch and earrings": "Lyxig klocka och örhängen", "Medical Devices": "Medicintekniska", "Musical Instrument": "Musikinstrument", "Office Stationaries": "Kontorsmaterial", "Parcel Packaging": "Paketförpackning", "Smart Sports Watch": "Smart sportklocka", "Text Tiles": "Text Paneler"],
        "da-DK": ["Cosmetics": "Kosmetik", "Consumer Electronic": "Forbruger elektronisk", "Luxurious watch and earrings": "Luksuriøst ur og øreringe", "Medical Devices": "Medicinsk udstyr", "Musical Instrument": "Musikinstrument", "Office Stationaries": "Kontorer", "Parcel Packaging": "Emballage til pakker", "Smart Sports Watch": "Smart sportsur", "Text Tiles": "Tekst Fliser"],
        "pl": ["Cosmetics": "Kosmetyka", "Consumer Electronic": "Elektronika użytkowa", "Luxurious watch and earrings": "Luksusowy zegarek i kolczyki", "Medical Devices": "Wyroby medyczne", "Musical Instrument": "Instrument muzyczny", "Office Stationaries": "Artykuły biurowe", "Parcel Packaging": "Pakowanie paczek", "Smart Sports Watch": "Inteligentny zegarek sportowy", "Text Tiles": "Kafelki tekstu"],
        "he": ["Cosmetics": "קוסמטיקה", "Consumer Electronic": "צרכן אלקטרוני", "Luxurious watch and earrings": "שעון ועגילים יוקרתיים", "Medical Devices": "מכשור רפואי", "Musical Instrument": "כלי נגינה", "Office Stationaries": "משרדי מכתבים", "Parcel Packaging": "אריזת חבילות", "Smart Sports Watch": "שעון ספורט חכם", "Text Tiles": "אריחי טקסט"],
        "en-ID": ["Cosmetics": "Cosmetics", "Consumer Electronic": "Consumer Electronic", "Luxurious watch and earrings": "Luxurious watch and earrings", "Medical Devices": "Medical Devices", "Musical Instrument": "Musical Instrument", "Office Stationaries": "Office Stationaries", "Parcel Packaging": "Parcel Packaging", "Smart Sports Watch": "Smart Sports Watch", "Text Tiles": "Text Tiles"]
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
def translate_HERO_BANNER(phrase, locale) {
    def localeString = locale.toString();
    def language = locale.getLanguage();

    if(DICTIONARY_HERO_BANNER.containsKey(localeString) && DICTIONARY_HERO_BANNER[localeString].containsKey(phrase)) {
        return DICTIONARY_HERO_BANNER[localeString][phrase];
    } else if (DICTIONARY_HERO_BANNER.containsKey(language) && DICTIONARY_HERO_BANNER[language].containsKey(phrase)) {
        return DICTIONARY_HERO_BANNER[language][phrase];
    } else {
        return phrase;
    }
}


def handleHeroBannerElectronics(homePage) {
    def types = ["cosmetics", "consumerElectronics", "fastFashion", "luxuryGoods", "medicalDevices", "musicalInstruments", "officeSupplies", "packagingMarketingOpportunities", "sportingGoods", "textiles"];
    def resourceType ="dhl/components/animated-content/hero-banner";
    def properties = [
            "imgAltText1" : "Cosmetics",
            "imgAltText2" : "Consumer Electronics",
            "imgAltText3" : "Luxurious watch and earrings",
            "imgAltText4" : "Medical Devices",
            "imgAltText5" : "Musical Instrument",
            "imgAltText6" : "Office Stationaries",
            "imgAltText7" : "Parcel Packaging",
            "imgAltText8" : "Smart Sports Watch",
            "imgAltText9" : "Text Tiles"
    ]
    def typeConditions = types.collect { "node.type = '${it}'" }.join(" OR ");

    def query = """
        SELECT * FROM [nt:unstructured] AS node WHERE ISDESCENDANTNODE([${homePage.getPath()}])
        and (node.[sling:resourceType]='${resourceType}')
        and (${typeConditions})
    """
    sql2Query(query).each( node -> {
        properties.each((key, value) -> {
            def translatedValue = translate_HERO_BANNER(value, getLocale(node));
            println """set ${key}:${translatedValue} to ${node.getPath()}"""
            node.setProperty(key, translatedValue)
        })
    })
}


getHomePages().each( homePage -> {
    handleHeroBannerElectronics(homePage);

    if(DRY_RUN) {
        session.refresh(false);
    } else {
        save();
    }
})
