import Strings from "./Strings.js";
class L10n {
    static get currentLang() {
        return this.lang;
    }
    static setLang(lang) {
        if (Object.keys(Strings).includes(lang)) {
            this.lang = lang;
        }
        else {
            this.lang = "en";
            throw new Error("Undefined lang");
        }
    }
    static getString(string) {
        if (Strings[this.lang][string]) {
            return Strings[this.lang][string];
        }
        return Strings["en"][string];
    }
    static getInterfaceString(string) {
        if (Strings[this.lang].interface[string]) {
            return Strings[this.lang].interface[string];
        }
        return Strings["en"].interface[string];
    }
    static getCountryName(string) {
        if (Strings[this.lang].flag[string]) {
            return Strings[this.lang].flag[string];
        }
        else if (Strings["en"].flag[string]) {
            return Strings["en"].flag[string];
        }
        else {
            return "FLAG_NOT_FOUND";
        }
    }
    static hasLang(lang) {
        if (lang in Strings) {
            return true;
        }
        return false;
    }
    /**
     * Get a list of defined lang codes.
     * @returns A list of lang codes.
     */
    static getLangCodes() {
        return Object.keys(Strings);
    }
    /**
     * Get the lang's full name.
     * @param langCode The lang code
     * @retuns The lang name
     */
    static getLangName(langCode) {
        return Strings[langCode]._name;
    }
    /**
     * Get the lang's version number. Used for comparision between the lang and English.
     * @param lang The lang name
     * @returns The lang version string
     */
    static getLangVersion(lang) {
        return Strings[lang]._version;
    }
}
L10n.lang = "en";
export default L10n;
//# sourceMappingURL=L10n.js.map