export class User {
    constructor(public firstName: string,
                public lastName: string,
                public email: string,
                public password: string,
                public admin?: Boolean,
                public deleted?: Boolean,
                public _id?: string
            ) {}
}
