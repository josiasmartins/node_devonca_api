export class UserResponseDTO {

    private name: string;
    private password: string;
    private documentNumber: string;
    private image_profile: string;
    private birthday: string;

    constructor(user: any) {
        this.name = user.name;
        this.password = user.password;
        this.documentNumber = user.documentNumber;
        this.image_profile = user.image_profile;
        this.birthday = user.birthday;
    }

}