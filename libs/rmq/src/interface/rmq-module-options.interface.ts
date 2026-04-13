export interface RmqModuleOptions {
    urls: string[];
    exchange?: string;
    exchangeType?: string;
}

export interface RmqModuleAsyncOptions {
    useFactory: (...args: any[]) => RmqModuleOptions | Promise<RmqModuleOptions>;
    inject?: any[];
}
