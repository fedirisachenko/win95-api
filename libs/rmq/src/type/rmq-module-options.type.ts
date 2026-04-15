export type RmqModuleOptions = {
    urls: string[];
    exchange?: string;
    exchangeType?: string;
};

export type RmqModuleAsyncOptions = {
    useFactory: (...args: any[]) => RmqModuleOptions | Promise<RmqModuleOptions>;
    inject?: any[];
};
