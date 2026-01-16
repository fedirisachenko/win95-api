export abstract class AbstractNotificationEvent<T = any> {
    protected data: T;

    setData(data: T): void {
        this.data = data;
    }

    getData(): T {
        return this.data;
    }

    abstract send(): Promise<void>;
}