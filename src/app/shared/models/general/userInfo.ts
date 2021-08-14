export class UserInfo {
    userToken: string;
    x_seq: string;
    email : string;

    constructor(
        userToken : string,
        x_seq : string,
        email :string)
        {
            this.userToken = userToken;
            this.x_seq = x_seq;
            this.email = email;
        }
}