import { ContentItem } from "../github_provider";

export function searchFile(contents: Array<ContentItem>, regex: RegExp): ContentItem | void {
    for (const content of contents) {
        if (content.type === 'file' && regex.test(content.name)) return content;
    }
}

export function findFilesByNames(contents: Array<ContentItem>, files: Array<string>): Array<string> {
    const contentsFilenames = contents.map(c => c.name);
    return files.filter(x => contentsFilenames.includes(x));
}

export function findFilesByExtension(contents: Array<ContentItem>, extension: string): Array<ContentItem> {
    const extensionRegex=new RegExp(`.*\.${extension}$`);
    return contents.filter((file: ContentItem): boolean => {
        return extensionRegex.test(file.name);
    });
}
