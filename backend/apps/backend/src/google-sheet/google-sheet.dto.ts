import { IsEmail } from 'class-validator';

export class AddEmailDto {
  @IsEmail({}, { message: 'Invalid email address' })
  email: string;
}
