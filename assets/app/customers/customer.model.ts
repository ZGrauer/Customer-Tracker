export class Customer {
    constructor(
                public h1: Number,
                public name: String,
                public status: String,
                public note: String,
                public user: String,
                public initialDt: Date,
                public updateDt: Date,
                public updateUser: String,
                public _id?:String,
                public _userId?:String,
                public _updateUserId?:String
            ) {}
}
