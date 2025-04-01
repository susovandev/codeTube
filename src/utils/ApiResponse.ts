export class ApiResponse<T> {
  public success: boolean;

  constructor(
    public statusCode: number,
    public message: string = 'Success',
    public data?: T,
  ) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
    this.success = statusCode < 400;
  }
}
