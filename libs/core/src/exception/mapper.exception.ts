export class MapperException extends Error {
    constructor(message?: string) {
        super(message);
        this.name = 'MapperException';
    }
}
