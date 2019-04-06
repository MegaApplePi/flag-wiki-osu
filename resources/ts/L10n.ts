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
      throw new Error("Invalid locale");
    }
  }

  public static getString(string: string): string | string[] {
    if (Strings[this.locale][string]) {
      return Strings[this.locale][string];
    }
    return Strings["en"][string];
  }

  public static hasLocale(locale: string): boolean {
    if (locale in Strings) {
      return true;
    }
    return false;
  }
}

export default L10n;
