export class UserInfo {
    userToken: string;
    x_seq: string;
    email : string;
    isAuthenticated : boolean;

    constructor(
        userToken : string,
        x_seq : string,
        email :string,
        isAuthenticated : boolean)
        {
            this.userToken = userToken;
            this.x_seq = x_seq;
            this.email = email;
            this.isAuthenticated = isAuthenticated
        }
}