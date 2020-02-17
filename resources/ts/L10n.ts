import Strings from "./Strings.js";

export default class L10n {
  constructor() {
    throw new Error("L10n only contains static members and should not be instantiated.");
  }

  private static lang = "en";

  public static get currentLang() {
    return this.lang;
  }

  public static setLang(lang: string): void {
    if (Object.keys(Strings).includes(lang)) {
      this.lang = lang;
    } else {
      this.lang = "en";
      throw new Error("Undefined lang");
    }
  }

  public static getString(string: string): string | string[] {
    if (Strings[this.lang][string]) {
      return Strings[this.lang][string];
    }
    return Strings["en"][string];
  }

  public static getInterfaceString(string: string): string {
    if (Strings[this.lang].interface[string]) {
      return Strings[this.lang].interface[string];
    }
    return Strings["en"].interface[string];
  }

  public static getCountryName(string: string): string {
    if (Strings[this.lang].flag[string]) {
      return Strings[this.lang].flag[string];
    } else if (Strings["en"].flag[string]) {
      return Strings["en"].flag[string];
    } else {
      return "FLAG_NOT_FOUND";
    }
  }

  public static hasLang(lang: string): boolean {
    if (lang in Strings) {
      return true;
    }
    return false;
  }

  /**
   * Get a list of defined lang codes.
   * @returns A list of lang codes.
   */
  public static getLangCodes(): string[] {
    return Object.keys(Strings);
  }

  /**
   * Get the lang's full name.
   * @param langCode The lang code
   * @retuns The lang name
   */
  public static getLangName(langCode: string): string {
    return Strings[langCode]._name;
  }

  /**
   * Get the lang's version number. Used for comparision between the lang and English.
   * @param lang The lang name
   * @returns The lang version string
   */
  public static getLangVersion(lang: string): string {
    return Strings[lang]._version;
  }
}
