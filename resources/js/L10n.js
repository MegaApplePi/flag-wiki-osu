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
            throw new Error("Invalid locale");
        }
    }
    static getString(string) {
        if (Strings[this.locale][string]) {
            return Strings[this.locale][string];
        }
        return Strings["en"][string];
    }
    static hasLocale(locale) {
        if (locale in Strings) {
            return true;
        }
        return false;
    }
}
L10n.locale = "en";
export default L10n;
//# sourceMappingURL=L10n.js.map