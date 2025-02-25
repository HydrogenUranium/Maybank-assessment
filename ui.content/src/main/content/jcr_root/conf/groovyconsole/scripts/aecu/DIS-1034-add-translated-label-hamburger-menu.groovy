import groovy.transform.Field
import java.util.regex.Pattern;

@Field DRY_RUN = true

@Field PROPERTIES = [
        "openHamburgerMenu": "Open Hamburger Menu",
        "closeHamburgerMenu": "Close Hamburger Menu"
]

@Field SCOPE = "/content/experience-fragments"

@Field QUERY = """
SELECT * FROM [nt:unstructured] as node
WHERE ISDESCENDANTNODE(node, '${SCOPE}')
AND node.[sling:resourceType] = 'dhl/components/content/header'
"""

@Field DICTIONARY = [
        "ar_AE": ["Open Hamburger Menu": "افتح قائمة الهامبرغر", "Close Hamburger Menu": "أغلق قائمة الهامبرغر"],
        "en_TH": ["Open Hamburger Menu": "Open Hamburger Menu", "Close Hamburger Menu": "Close Hamburger Menu"],
        "ko_KR": ["Open Hamburger Menu": "햄버거 메뉴 열기", "Close Hamburger Menu": "햄버거 메뉴 닫기"],
        "fr_BE": ["Open Hamburger Menu": "Ouvrir le menu hamburger", "Close Hamburger Menu": "Fermer le menu hamburger"],
        "zh_TW": ["Open Hamburger Menu": "打開漢堡菜單", "Close Hamburger Menu": "關閉漢堡菜單"],
        "zh_HK": ["Open Hamburger Menu": "打開漢堡菜單", "Close Hamburger Menu": "關閉漢堡菜單"],
        "bg": ["Open Hamburger Menu": "Отворете менюто на хамбургера", "Close Hamburger Menu": "Затворете менюто на хамбургера"],
        "it": ["Open Hamburger Menu": "Apri il menu hamburger", "Close Hamburger Menu": "Chiudi il menu hamburger"],
        "ko": ["Open Hamburger Menu": "햄버거 메뉴 열기", "Close Hamburger Menu": "햄버거 메뉴 닫기"],
        "en_ES": ["Open Hamburger Menu": "Open Hamburger Menu", "Close Hamburger Menu": "Close Hamburger Menu"],
        "da_DK": ["Open Hamburger Menu": "Åbn hamburger menuen", "Close Hamburger Menu": "Luk hamburger menuen"],
        "vi_VN": ["Open Hamburger Menu": "Mở menu hamburger", "Close Hamburger Menu": "Đóng menu hamburger"],
        "en_US": ["Open Hamburger Menu": "Open Hamburger Menu", "Close Hamburger Menu": "Close Hamburger Menu"],
        "th": ["Open Hamburger Menu": "เปิดเมนูแฮมเบอร์เกอร์", "Close Hamburger Menu": "ปิดเมนูแฮมเบอร์เกอร์"],
        "sv_SE": ["Open Hamburger Menu": "Öppna hamburgermenyn", "Close Hamburger Menu": "Stäng hamburgermenyn"],
        "en_SG": ["Open Hamburger Menu": "Open Hamburger Menu", "Close Hamburger Menu": "Close Hamburger Menu"],
        "pt": ["Open Hamburger Menu": "Abrir menu de hambúrguer", "Close Hamburger Menu": "Fechar menu de hambúrguer"],
        "en_AT": ["Open Hamburger Menu": "Open Hamburger Menu", "Close Hamburger Menu": "Close Hamburger Menu"],
        "en_NZ": ["Open Hamburger Menu": "Open Hamburger Menu", "Close Hamburger Menu": "Close Hamburger Menu"],
        "de_CH": ["Open Hamburger Menu": "Hamburger-Menü öffnen", "Close Hamburger Menu": "Hamburger-Menü schließen"],
        "sk": ["Open Hamburger Menu": "Otvoriť hamburger menu", "Close Hamburger Menu": "Zatvoriť hamburger menu"],
        "en_IT": ["Open Hamburger Menu": "Open Hamburger Menu", "Close Hamburger Menu": "Close Hamburger Menu"],
        "ms": ["Open Hamburger Menu": "Buka menu hamburger", "Close Hamburger Menu": "Tutup menu hamburger"],
        "el_GR": ["Open Hamburger Menu": "Άνοιγμα μενού χάμπουργκερ", "Close Hamburger Menu": "Κλείσιμο μενού χάμπουργκερ"],
        "en_CH": ["Open Hamburger Menu": "Open Hamburger Menu", "Close Hamburger Menu": "Close Hamburger Menu"],
        "en_ZA": ["Open Hamburger Menu": "Open Hamburger Menu", "Close Hamburger Menu": "Close Hamburger Menu"],
        "hi": ["Open Hamburger Menu": "हैमबर्गर मेनू खोलें", "Close Hamburger Menu": "हैमबर्गर मेनू बंद करें"],
        "cs": ["Open Hamburger Menu": "Otevřít hamburger menu", "Close Hamburger Menu": "Zavřít hamburger menu"],
        "en_KH": ["Open Hamburger Menu": "Open Hamburger Menu", "Close Hamburger Menu": "Close Hamburger Menu"],
        "el": ["Open Hamburger Menu": "Άνοιγμα μενού χάμπουργκερ", "Close Hamburger Menu": "Κλείσιμο μενού χάμπουργκερ"],
        "fr_FR": ["Open Hamburger Menu": "Ouvrir le menu hamburger", "Close Hamburger Menu": "Fermer le menu hamburger"],
        "de_AT": ["Open Hamburger Menu": "Hamburger-Menü öffnen", "Close Hamburger Menu": "Hamburger-Menü schließen"],
        "en_VN": ["Open Hamburger Menu": "Open Hamburger Menu", "Close Hamburger Menu": "Close Hamburger Menu"],
        "fr_CH": ["Open Hamburger Menu": "Ouvrir le menu hamburger", "Close Hamburger Menu": "Fermer le menu hamburger"],
        "hu": ["Open Hamburger Menu": "Hamburger menü megnyitása", "Close Hamburger Menu": "Hamburger menü bezárása"],
        "en_ID": ["Open Hamburger Menu": "Open Hamburger Menu", "Close Hamburger Menu": "Close Hamburger Menu"],
        "en_AU": ["Open Hamburger Menu": "Open Hamburger Menu", "Close Hamburger Menu": "Close Hamburger Menu"],
        "in": ["Open Hamburger Menu": "Open Hamburger Menu", "Close Hamburger Menu": "Close Hamburger Menu"],
        "vi": ["Open Hamburger Menu": "Mở menu hamburger", "Close Hamburger Menu": "Đóng menu hamburger"],
        "fr_CA": ["Open Hamburger Menu": "Ouvrir le menu hamburger", "Close Hamburger Menu": "Fermer le menu hamburger"],
        "en_MY": ["Open Hamburger Menu": "Open Hamburger Menu", "Close Hamburger Menu": "Close Hamburger Menu"],
        "pt_BR": ["Open Hamburger Menu": "Abrir menu de hambúrguer", "Close Hamburger Menu": "Fechar menu de hambúrguer"],
        "it_CH": ["Open Hamburger Menu": "Apri il menu hamburger", "Close Hamburger Menu": "Chiudi il menu hamburger"],
        "de_DE": ["Open Hamburger Menu": "Hamburger-Menü öffnen", "Close Hamburger Menu": "Hamburger-Menü schließen"],
        "es": ["Open Hamburger Menu": "Abrir menú de hamburguesa", "Close Hamburger Menu": "Cerrar menú de hamburguesa"],
        "cs_CZ": ["Open Hamburger Menu": "Otevřít hamburger menu", "Close Hamburger Menu": "Zavřít hamburger menu"],
        "en_DK": ["Open Hamburger Menu": "Open Hamburger Menu", "Close Hamburger Menu": "Close Hamburger Menu"],
        "en_MM": ["Open Hamburger Menu": "Open Hamburger Menu", "Close Hamburger Menu": "Close Hamburger Menu"],
        "en_HK": ["Open Hamburger Menu": "Open Hamburger Menu", "Close Hamburger Menu": "Close Hamburger Menu"],
        "sk_SK": ["Open Hamburger Menu": "Otvoriť hamburger menu", "Close Hamburger Menu": "Zatvoriť hamburger menu"],
        "it_IT": ["Open Hamburger Menu": "Apri il menu hamburger", "Close Hamburger Menu": "Chiudi il menu hamburger"],
        "en_IE": ["Open Hamburger Menu": "Open Hamburger Menu", "Close Hamburger Menu": "Close Hamburger Menu"],
        "en_LK": ["Open Hamburger Menu": "Open Hamburger Menu", "Close Hamburger Menu": "Close Hamburger Menu"],
        "en_NG": ["Open Hamburger Menu": "Open Hamburger Menu", "Close Hamburger Menu": "Close Hamburger Menu"],
        "en_PK": ["Open Hamburger Menu": "Open Hamburger Menu", "Close Hamburger Menu": "Close Hamburger Menu"],
        "nl_BE": ["Open Hamburger Menu": "Open Hamburger Menu", "Close Hamburger Menu": "Close Hamburger Menu"],
        "en_KE": ["Open Hamburger Menu": "Open Hamburger Menu", "Close Hamburger Menu": "Close Hamburger Menu"],
        "pl": ["Open Hamburger Menu": "Otwórz menu hamburgera", "Close Hamburger Menu": "Zamknij menu hamburgera"],
        "zh_CN": ["Open Hamburger Menu": "打开汉堡菜单", "Close Hamburger Menu": "关闭汉堡菜单"],
        "es_ES": ["Open Hamburger Menu": "Abrir menú de hamburguesa", "Close Hamburger Menu": "Cerrar menú de hamburguesa"],
        "en_CZ": ["Open Hamburger Menu": "Open Hamburger Menu", "Close Hamburger Menu": "Close Hamburger Menu"],
        "fr": ["Open Hamburger Menu": "Ouvrir le menu hamburger", "Close Hamburger Menu": "Fermer le menu hamburger"],
        "ja": ["Open Hamburger Menu": "ハンバーガーメニューを開く", "Close Hamburger Menu": "ハンバーガーメニューを閉じる"],
        "en_CN": ["Open Hamburger Menu": "Open Hamburger Menu", "Close Hamburger Menu": "Close Hamburger Menu"],
        "iw": ["Open Hamburger Menu": "פתח תפריט המבורגר", "Close Hamburger Menu": "סגור תפריט המבורגר"],
        "en_IN": ["Open Hamburger Menu": "Open Hamburger Menu", "Close Hamburger Menu": "Close Hamburger Menu"],
        "de": ["Open Hamburger Menu": "Hamburger-Menü öffnen", "Close Hamburger Menu": "Hamburger-Menü schließen"],
        "en_PT": ["Open Hamburger Menu": "Open Hamburger Menu", "Close Hamburger Menu": "Close Hamburger Menu"],
        "en_KR": ["Open Hamburger Menu": "Open Hamburger Menu", "Close Hamburger Menu": "Close Hamburger Menu"],
        "zh": ["Open Hamburger Menu": "打开汉堡菜单", "Close Hamburger Menu": "关闭汉堡菜单"],
        "en": ["Open Hamburger Menu": "Open Hamburger Menu", "Close Hamburger Menu": "Close Hamburger Menu"],
        "en_BD": ["Open Hamburger Menu": "Open Hamburger Menu", "Close Hamburger Menu": "Close Hamburger Menu"],
        "en_PH": ["Open Hamburger Menu": "Open Hamburger Menu", "Close Hamburger Menu": "Close Hamburger Menu"],
        "en_GB": ["Open Hamburger Menu": "Open Hamburger Menu", "Close Hamburger Menu": "Close Hamburger Menu"]
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