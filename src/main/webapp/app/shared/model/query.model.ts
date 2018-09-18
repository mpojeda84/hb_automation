export interface IQuery {
    id?: string;
    key?: string;
    value?: string;
    env?: string;
}

export class Query implements IQuery {
    constructor(public id?: string, public key?: string, public value?: string, public env?: string) {}
}
