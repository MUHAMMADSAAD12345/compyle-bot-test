import { User } from '../../users/entities/user.entity';
export declare class AuthResponseDto {
    user: Partial<User>;
    accessToken: string;
    refreshToken: string;
}
