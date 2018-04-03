export class Customer {
    constructor(
                public h1: Number,
                public name: string,
                public status: string,
                public note: string,
                public user: string,
                public initialDt: Date,
                public updateDt: Date,
                public updateUser: string,
                public _id?:string,
                public _userId?:string,
                public _updateUserId?:string,
                public loeTotalHours?:Number
            ) {}
}