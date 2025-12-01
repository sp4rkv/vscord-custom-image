import { CONFIG_KEYS, KNOWN_EXTENSIONS, KNOWN_LANGUAGES } from "../constants";
import { type TextDocument } from "vscode";
import { getConfig } from "../config";
import { basename } from "node:path";

export const toLower = <S extends string>(str: S) => str.toLocaleLowerCase() as Lowercase<S>;
export const toUpper = <S extends string>(str: S) => str.toLocaleUpperCase() as Uppercase<S>;
export const toTitle = <S extends string>(str: S) =>
    toLower(str).replace(/^.{1}/, (c) => toUpper(c)) as Capitalize<Lowercase<S>>;

export const fileExtensionEquals = (filename: string, key: string) => {
    if (filename.endsWith(key)) return true;

    const match = /^\/(.*)\/([mgiy]+)$/.exec(key);
    if (!match) return false;

    return new RegExp(match[1], match[2]).test(filename);
};

export const resolveLangName = (document: TextDocument): string => {
    const config = getConfig();

    const ADDITIONAL_FILE_MAPPING = Object.fromEntries(
        Object.entries(config.get(CONFIG_KEYS.Behaviour.AdditionalFileMapping)!).map(([key, value]) => [
            key,
            { image: value }
        ])
    );

    const filename = basename(document.fileName);
    const findKnownExtension =
        KNOWN_LANGUAGES.find((key) => key.language === document.languageId) ??
        Object.keys(ADDITIONAL_FILE_MAPPING).find((extension) => fileExtensionEquals(filename, extension)) ??
        Object.keys(KNOWN_EXTENSIONS).find((extension) => fileExtensionEquals(filename, extension));

    return typeof findKnownExtension === "string" ? findKnownExtension : (findKnownExtension?.image ?? "text");
};

export const getArticle = (word: string): string => {
    const vowels = ["a", "e", "i", "o", "u"];
    return vowels.includes(word.charAt(0).toLowerCase()) ? "an" : "a";
};
