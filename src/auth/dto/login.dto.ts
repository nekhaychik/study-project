import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    type: String,
    required: true,
  })
  readonly email: string;

  @ApiProperty({
    type: String,
    required: true,
  })
  readonly password: string;
}
