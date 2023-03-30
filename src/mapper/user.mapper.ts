import { configs } from "../config";
import { IPagination } from "../service";
import { IUser } from "../type";

class UserMapper {
  public toResponse(user: IUser): IUser {
    return {
      name: user.name,
      email: user.email,
      password: user.password,
      gender: user.gender,
      status: user.status,
      avatar: user.avatar
        ? `${configs.AWS_S3_BUCKET_URL}/${user.avatar}`
        : null,
    };
  }

  public toManyResponse(users: IPagination<IUser[]>): IPagination<IUser[]> {
    const usersUpdated = users.data.map(this.toResponse);
    return { ...users, data: usersUpdated };
  }
}
export const userMapper = new UserMapper();
