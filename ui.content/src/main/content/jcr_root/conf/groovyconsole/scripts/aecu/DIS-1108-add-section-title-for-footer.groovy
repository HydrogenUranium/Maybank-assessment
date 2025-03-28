import groovy.transform.Field
import java.util.regex.Pattern;

@Field DRY_RUN = false

@Field PROPERTIES = [
        "sectionTitle": "Footer"
]

@Field SCOPE = "/content/experience-fragments"

@Field QUERY = """
SELECT * FROM [nt:unstructured] as node
WHERE ISDESCENDANTNODE(node, '${SCOPE}')
AND node.[sling:resourceType] = 'dhl/components/content/footer'
"""

@Field DICTIONARY = ["en-IE": ["Footer": "Footer"],
                     "en-US": ["Footer": "Footer"],
                     "pt": ["Footer": "Rodapé"],
                     "en-MM": ["Footer": "Footer"],
                     "en-IL": ["Footer": "Footer"],
                     "en-IN": ["Footer": "Footer"],
                     "en-ZA": ["Footer": "Footer"],
                     "nl-BE": ["Footer": "Voettekst"],
                     "zh-CN": ["Footer": "页脚"],
                     "hu": ["Footer": "Lábléc"],
                     "en-IT": ["Footer": "Footer"],
                     "en-MY": ["Footer": "Footer"],
                     "en-ES": ["Footer": "Footer"],
                     "en-AT": ["Footer": "Footer"],
                     "en-AU": ["Footer": "Footer"],
                     "id": ["Footer": "Footer"],
                     "en-NG": ["Footer": "Footer"],
                     "en-VN": ["Footer": "Footer"],
                     "de-CH": ["Footer": "Fußzeile"],
                     "en-BD": ["Footer": "Footer"],
                     "en": ["Footer": "Footer"],
                     "it": ["Footer": "Piè di pagina"],
                     "en-JP": ["Footer": "Footer"],
                     "es": ["Footer": "Pie de página"],
                     "zh": ["Footer": "页脚"],
                     "fr-CA": ["Footer": "Pied de page"],
                     "en-NZ": ["Footer": "Footer"],
                     "vi": ["Footer": "Chân"],
                     "fr-BE": ["Footer": "Pied de page"],
                     "ja": ["Footer": "フッター"],
                     "en-SG": ["Footer": "Footer"],
                     "it-CH": ["Footer": "Piè di pagina"],
                     "fr-FR": ["Footer": "Pied de page"],
                     "en-GB": ["Footer": "Footer"],
                     "en-KE": ["Footer": "Footer"],
                     "en-KH": ["Footer": "Footer"],
                     "en-CA": ["Footer": "Footer"],
                     "en-CH": ["Footer": "Footer"],
                     "en-KR": ["Footer": "Footer"],
                     "ar-AE": ["Footer": "تذييل الصفحه"],
                     "en-CN": ["Footer": "Footer"],
                     "de-AT": ["Footer": "Fußzeile"],
                     "fr-CH": ["Footer": "Pied de page"],
                     "sk": ["Footer": "Päta"],
                     "en-TH": ["Footer": "Footer"],
                     "en-CZ": ["Footer": "Footer"],
                     "en-PH": ["Footer": "Footer"],
                     "en-PK": ["Footer": "Footer"],
                     "en-LK": ["Footer": "Footer"],
                     "zh-HK": ["Footer": "頁腳"],
                     "zh-TW": ["Footer": "頁腳"],
                     "pt-BR": ["Footer": "Rodapé"],
                     "ko-KR": ["Footer": "바닥글"],
                     "en-HK": ["Footer": "Footer"],
                     "en-TW": ["Footer": "Footer"],
                     "en-PT": ["Footer": "Footer"],
                     "en-DK": ["Footer": "Footer"],
                     "cs": ["Footer": "Zápatí"],
                     "th": ["Footer": "ท้ายกระดาษ"],
                     "sv-SE": ["Footer": "Sidfot"],
                     "da-DK": ["Footer": "Sidefod"],
                     "he": ["Footer": "כותרת תחתונה"],
                     "en-ID": ["Footer": "Footer"]]

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