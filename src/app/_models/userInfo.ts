export class UserInfo {
    userToken: string;
    x_seq : string;
    id: string;
    name: string;
    surname: string;
    email : string;

    constructor(){
        this.userToken = null;
        this.id = null;
        this.name = null;
        this.surname = null;
        this.email = null;
    }
}