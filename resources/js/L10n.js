import Strings from "./Strings.js";
class L10n {
    static get currentLocale() {
        return this.locale;
    }
    static setLocale(locale) {
        if (Object.keys(Strings).includes(locale)) {
            this.locale = locale;
        }
        else {
            this.locale = "en";
            throw new Error("Undefined locale");
        }
    }
    static getString(string) {
        if (Strings[this.locale][string]) {
            return Strings[this.locale][string];
        }
        return Strings["en"][string];
    }
    static getInterfaceString(string) {
        if (Strings[this.locale].interface[string]) {
            return Strings[this.locale].interface[string];
        }
        return Strings["en"].interface[string];
    }
    static getFlagString(string) {
        if (Strings[this.locale].flag[string]) {
            return Strings[this.locale].flag[string];
        }
        return Strings["en"].flag[string];
    }
    static hasLocale(locale) {
        if (locale in Strings) {
            return true;
        }
        return false;
    }
    static getLocales() {
        return Object.keys(Strings);
    }
    static getLocaleName(locale) {
        return Strings[locale]._name;
    }
    /**
     * Get the locale's version number. Used for comparision between the locale and English.
     * @param locale The locale name
     */
    static getLocaleVersion(locale) {
        return Strings[locale]._version;
    }
}
L10n.locale = "en";
export default L10n;
//# sourceMappingURL=L10n.js.map