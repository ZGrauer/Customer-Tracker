export class User {
    constructor(public firstName: String,
                public lastName: String,
                public email: String,
                public password: String,
                public admin?: Boolean,
                public deleted?: Boolean
                public _id?: String
            ) {}
}
