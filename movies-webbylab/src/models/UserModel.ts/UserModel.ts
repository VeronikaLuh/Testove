export interface UserModel {
  userId: number;
  email: string;
  userName: string;
}

export interface UserLogin {
  email: string;
  password: string;
}

export interface UserRegister {
  email: string;
  name: string;
  password: string;
  confirmPassword: string;
}