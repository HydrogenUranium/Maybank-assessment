import groovy.transform.Field
import java.util.regex.Pattern;

@Field DRY_RUN = true

@Field PROPERTIES = [
        "wcagContentLabel": "Skip to main content",
        "wcagFooterLabel": "Skip to footer"
]

@Field SCOPE = "/content/experience-fragments"

@Field QUERY = """
SELECT * FROM [nt:unstructured] as node
WHERE ISDESCENDANTNODE(node, '${SCOPE}')
AND node.[sling:resourceType] = 'dhl/components/content/header'
"""

@Field DICTIONARY = [
        "ar_AE": ["Skip to main content": "تخطي إلى المحتوى الرئيسي", "Skip to footer": "تخطي إلى التذييل"],
        "en_TH": ["Skip to main content": "Skip to main content", "Skip to footer": "Skip to footer"],
        "ko_KR": ["Skip to main content": "주요 내용으로 건너뛰기", "Skip to footer": "바닥글로 건너뛰기"],
        "fr_BE": ["Skip to main content": "Passer au contenu principal", "Skip to footer": "Passer au pied de page"],
        "zh_TW": ["Skip to main content": "跳到主要內容", "Skip to footer": "跳到頁腳"],
        "zh_HK": ["Skip to main content": "跳到主要內容", "Skip to footer": "跳到頁腳"],
        "bg": ["Skip to main content": "Прескочи към основното съдържание", "Skip to footer": "Прескочи към долния колонтитул"],
        "it": ["Skip to main content": "Salta al contenuto principale", "Skip to footer": "Salta al piè di pagina"],
        "ko": ["Skip to main content": "주요 내용으로 건너뛰기", "Skip to footer": "바닥글로 건너뛰기"],
        "en_ES": ["Skip to main content": "Skip to main content", "Skip to footer": "Skip to footer"],
        "da_DK": ["Skip to main content": "Spring til hovedindhold", "Skip to footer": "Spring til sidefod"],
        "es_PR": ["Skip to main content": "Saltar al contenido principal", "Skip to footer": "Saltar al pie de página"],
        "vi_VN": ["Skip to main content": "Bỏ qua nội dung chính", "Skip to footer": "Bỏ qua chân trang"],
        "en_US": ["Skip to main content": "Skip to main content", "Skip to footer": "Skip to footer"],
        "th": ["Skip to main content": "ข้ามไปยังเนื้อหาหลัก", "Skip to footer": "ข้ามไปยังส่วนท้าย"],
        "sv_SE": ["Skip to main content": "Hoppa till huvudinnehållet", "Skip to footer": "Hoppa till sidfoten"],
        "en_SG": ["Skip to main content": "Skip to main content", "Skip to footer": "Skip to footer"],
        "pt": ["Skip to main content": "Pular para o conteúdo principal", "Skip to footer": "Pular para o rodapé"],
        "en_AT": ["Skip to main content": "Skip to main content", "Skip to footer": "Skip to footer"],
        "en_NZ": ["Skip to main content": "Skip to main content", "Skip to footer": "Skip to footer"],
        "de_CH": ["Skip to main content": "Zum Hauptinhalt springen", "Skip to footer": "Zum Fußzeile springen"],
        "sk": ["Skip to main content": "Preskočiť na hlavný obsah", "Skip to footer": "Preskočiť na pätu stránky"],
        "en_IT": ["Skip to main content": "Skip to main content", "Skip to footer": "Skip to footer"],
        "ms": ["Skip to main content": "Langkau ke kandungan utama", "Skip to footer": "Langkau ke bahagian bawah"],
        "el_GR": ["Skip to main content": "Μετάβαση στο κύριο περιεχόμενο", "Skip to footer": "Μετάβαση στο υποσέλιδο"],
        "en_CH": ["Skip to main content": "Skip to main content", "Skip to footer": "Skip to footer"],
        "en_ZA": ["Skip to main content": "Skip to main content", "Skip to footer": "Skip to footer"],
        "hi": ["Skip to main content": "मुख्य सामग्री पर जाएं", "Skip to footer": "फुटर पर जाएं"],
        "cs": ["Skip to main content": "Přeskočit na hlavní obsah", "Skip to footer": "Přeskočit na zápatí"],
        "en_KH": ["Skip to main content": "Skip to main content", "Skip to footer": "Skip to footer"],
        "el": ["Skip to main content": "Μετάβαση στο κύριο περιεχόμενο", "Skip to footer": "Μετάβαση στο υποσέλιδο"],
        "fr_FR": ["Skip to main content": "Passer au contenu principal", "Skip to footer": "Passer au pied de page"],
        "de_AT": ["Skip to main content": "Zum Hauptinhalt springen", "Skip to footer": "Zum Fußzeile springen"],
        "en_VN": ["Skip to main content": "Skip to main content", "Skip to footer": "Skip to footer"],
        "fr_CH": ["Skip to main content": "Passer au contenu principal", "Skip to footer": "Passer au pied de page"],
        "hu": ["Skip to main content": "Ugrás a fő tartalomra", "Skip to footer": "Ugrás a lábléchez"],
        "en_ID": ["Skip to main content": "Skip to main content", "Skip to footer": "Skip to footer"],
        "en_AU": ["Skip to main content": "Skip to main content", "Skip to footer": "Skip to footer"],
        "in": ["Skip to main content": "Skip to main content", "Skip to footer": "Skip to footer"],
        "vi": ["Skip to main content": "Bỏ qua nội dung chính", "Skip to footer": "Bỏ qua chân trang"],
        "fr_CA": ["Skip to main content": "Passer au contenu principal", "Skip to footer": "Passer au pied de page"],
        "en_MY": ["Skip to main content": "Skip to main content", "Skip to footer": "Skip to footer"],
        "pt_BR": ["Skip to main content": "Pular para o conteúdo principal", "Skip to footer": "Pular para o rodapé"],
        "it_CH": ["Skip to main content": "Salta al contenuto principale", "Skip to footer": "Salta al piè di pagina"],
        "de_DE": ["Skip to main content": "Zum Hauptinhalt springen", "Skip to footer": "Zum Fußzeile springen"],
        "es": ["Skip to main content": "Saltar al contenido principal", "Skip to footer": "Saltar al pie de página"],
        "cs_CZ": ["Skip to main content": "Přeskočit na hlavní obsah", "Skip to footer": "Přeskočit na zápatí"],
        "en_DK": ["Skip to main content": "Skip to main content", "Skip to footer": "Skip to footer"],
        "en_MM": ["Skip to main content": "Skip to main content", "Skip to footer": "Skip to footer"],
        "en_TW": ["Skip to main content": "Skip to main content", "Skip to footer": "Skip to footer"],
        "en_HK": ["Skip to main content": "Skip to main content", "Skip to footer": "Skip to footer"],
        "sk_SK": ["Skip to main content": "Preskočiť na hlavný obsah", "Skip to footer": "Preskočiť na pätu stránky"],
        "it_IT": ["Skip to main content": "Salta al contenuto principale", "Skip to footer": "Salta al piè di pagina"],
        "en_IE": ["Skip to main content": "Skip to main content", "Skip to footer": "Skip to footer"],
        "en_LK": ["Skip to main content": "Skip to main content", "Skip to footer": "Skip to footer"],
        "en_NG": ["Skip to main content": "Skip to main content", "Skip to footer": "Skip to footer"],
        "en_PK": ["Skip to main content": "Skip to main content", "Skip to footer": "Skip to footer"],
        "nl_BE": ["Skip to main content": "Ga naar de hoofdinhoud", "Skip to footer": "Ga naar de voettekst"],
        "en_KE": ["Skip to main content": "Skip to main content", "Skip to footer": "Skip to footer"],
        "pl": ["Skip to main content": "Przejdź do głównej treści", "Skip to footer": "Przejdź do stopki"],
        "zh_CN": ["Skip to main content": "跳到主要内容", "Skip to footer": "跳到页脚"],
        "es_ES": ["Skip to main content": "Saltar al contenido principal", "Skip to footer": "Saltar al pie de página"],
        "en_CZ": ["Skip to main content": "Skip to main content", "Skip to footer": "Skip to footer"],
        "fr": ["Skip to main content": "Passer au contenu principal", "Skip to footer": "Passer au pied de page"],
        "ja": ["Skip to main content": "メインコンテンツにスキップ", "Skip to footer": "フッターにスキップ"],
        "en_CN": ["Skip to main content": "Skip to main content", "Skip to footer": "Skip to footer"],
        "iw": ["Skip to main content": "דלג לתוכן הראשי", "Skip to footer": "דלג לכותרת התחתונה"],
        "en_IN": ["Skip to main content": "Skip to main content", "Skip to footer": "Skip to footer"],
        "de": ["Skip to main content": "Zum Hauptinhalt springen", "Skip to footer": "Zum Fußzeile springen"],
        "en_PT": ["Skip to main content": "Skip to main content", "Skip to footer": "Skip to footer"],
        "en_KR": ["Skip to main content": "Skip to main content", "Skip to footer": "Skip to footer"],
        "zh": ["Skip to main content": "跳到主要内容", "Skip to footer": "跳到页脚"],
        "en": ["Skip to main content": "Skip to main content", "Skip to footer": "Skip to footer"],
        "en_BD": ["Skip to main content": "Skip to main content", "Skip to footer": "Skip to footer"],
        "en_PH": ["Skip to main content": "Skip to main content", "Skip to footer": "Skip to footer"],
        "en_GB": ["Skip to main content": "Skip to main content", "Skip to footer": "Skip to footer"]
]

def getLocale(resource) {
    def path = resource.getPath();
    if(path.startsWith("/content/experience-fragments")) {
        path = path.replace("/experience-fragments", "")
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

def translate(phrase, locale) {
    def localeString = locale.toString();
    def language = locale.getLanguage();
    if(DICTIONARY.containsKey(localeString) && DICTIONARY[localeString].containsKey(phrase)) {
        return DICTIONARY[localeString][phrase];
    } else if (DICTIONARY.containsKey(language) && DICTIONARY[language].containsKey(phrase)) {
        return DICTIONARY[language][phrase];
    } else {
        return phrase;
    }
}

sql2Query(QUERY).each({
    PROPERTIES.forEach((key, value) -> {
        def translatedValue = translate(value, getLocale(it))
        it.setProperty(key, translatedValue);
        println("""Set ${key}:${translatedValue} in ${it.getPath()}""")
    })

    if(DRY_RUN) {
        session.refresh(false);
    } else {
        save();
    }
})