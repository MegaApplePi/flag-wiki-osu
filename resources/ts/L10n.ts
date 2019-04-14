import Strings from "./Strings.js";

abstract class L10n {
  private static locale = "en";

  public static get currentLocale() {
    return this.locale;
  }

  public static setLocale(locale: string): void {
    if (Object.keys(Strings).includes(locale)) {
      this.locale = locale;
    } else {
      this.locale = "en";
      throw new Error("Undefined locale");
    }
  }

  public static getString(string: string): string | string[] {
    if (Strings[this.locale][string]) {
      return Strings[this.locale][string];
    }
    return Strings["en"][string];
  }

  public static getInterfaceString(string: string): string {
    if (Strings[this.locale].interface[string]) {
      return Strings[this.locale].interface[string];
    }
    return Strings["en"].interface[string];
  }

  public static getFlagString(string: string): string {
    if (Strings[this.locale].flag[string]) {
      return Strings[this.locale].flag[string];
    }
    return Strings["en"].flag[string];
  }

  public static hasLocale(locale: string): boolean {
    if (locale in Strings) {
      return true;
    }
    return false;
  }

  public static getLocales(): string[] {
    return Object.keys(Strings);
  }

  public static getLocaleName(locale: string): string {
    return Strings[locale]._name;
  }

  /**
   * Get the locale's version number. Used for comparision between the locale and English.
   * @param locale The locale name
   */
  public static getLocaleVersion(locale: string): string {
    return Strings[locale]._version;
  }
}

export default L10n;
