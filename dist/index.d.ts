export interface TemplateOptions {
    data: string;
    output: string;
    baseUrl: string;
    author: string;
    image: string;
    gaId?: string;
}
export interface DocData {
    title: string;
    description: string;
    content: string;
    keywords?: string[];
    [key: string]: any;
}
export declare class JengaSEO {
    private options;
    constructor(options: TemplateOptions);
    private _validateOptions;
    private _validateDocData;
    private _readDataFile;
    private _generateTemplate;
    generate(): void;
}
export declare function cli(): void;
