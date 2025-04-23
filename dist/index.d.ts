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
    [key: string]: any;
}
export declare class JengaSEO {
    private options;
    constructor(options: TemplateOptions);
    private validateOptions;
    private readDataFile;
    private generateTemplate;
    generate(): void;
}
export declare function cli(): void;
