import Strings from "./Strings.js";
export default class L10n {
    constructor() {
        throw new Error("L10n only contains static members and should not be instantiated.");
    }
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
        if (Strings[this.lang].interface) {
            if (Strings[this.lang].interface[string]) {
                return Strings[this.lang].interface[string];
            }
        }
        return Strings["en"].interface[string];
    }
    static getCountryName(string) {
        if (Strings[this.lang].flag) {
            if (Strings[this.lang].flag[string]) {
                return Strings[this.lang].flag[string];
            }
            else if (Strings["en"].flag[string]) {
                return Strings["en"].flag[string];
            }
        }
        return "FLAG_NOT_FOUND";
    }
    // NOTE using the English file, assuming that it will always be updated
    static getFlagCodes() {
        return Object.keys(Strings["en"].flag);
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
//# sourceMappingURL=L10n.js.map