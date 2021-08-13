export class UserInfo {
    userToken: string;
    x_seq: string;
    id: string;
    firstName: string;
    lastName: string;
    email : string;
    isAuthenticated : boolean;

    constructor(
        userToken : string,
        x_seq : string,
        id: string ,
        firstName: string ,
        lastName : string ,
        email :string,
        isAuthenticated : boolean)
        {
            this.userToken = userToken;
            this.x_seq = x_seq;
            this.id = id;
            this.firstName = firstName;
            this.lastName = lastName;
            this.email = email;
            this.isAuthenticated = isAuthenticated
        }
}