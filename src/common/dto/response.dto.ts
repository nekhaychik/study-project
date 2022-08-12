// success: true => message, data
// success: false => errorMessage, error

import { ApiProperty } from '@nestjs/swagger';

// Interfaces
import { IResponse } from '../interfaces/response.interface';

export class ResponseError implements IResponse {
  constructor(infoMessage: string, data?: any) {
    this.success = false;
    this.message = infoMessage;
    this.data = data;
    console.warn(
      new Date().toString() +
        ' - [Response]: ' +
        infoMessage +
        (data ? ' - ' + JSON.stringify(data) : ''),
    );
  }

  @ApiProperty({
    type: Boolean,
    nullable: false,
  })
  success: boolean;

  @ApiProperty({
    type: String,
    nullable: false,
  })
  public message: string;

  @ApiProperty({
    type: Object,
    nullable: false,
  })
  public data: any[];

  public errorMessage: any;
  error: any;
}

export class ResponseSuccess implements IResponse {
  constructor(infoMessage: string, data?: any, notLog?: boolean) {
    this.success = true;
    this.message = infoMessage;
    this.data = data;
    if (!notLog) {
      try {
        const offuscateRequest = JSON.parse(JSON.stringify(data));
        if (offuscateRequest && offuscateRequest.token)
          offuscateRequest.token = '*******';
        console.log(
          new Date().toString() +
            ' - [Response]: ' +
            JSON.stringify(offuscateRequest),
        );
      } catch (error) {}
    }
  }

  @ApiProperty({
    type: Boolean,
    nullable: false,
  })
  success: boolean;

  @ApiProperty({
    type: String,
    nullable: false,
  })
  message: string;

  @ApiProperty({
    type: Object,
    nullable: false,
  })
  data: any[];

  errorMessage: any;

  error: any;
}
