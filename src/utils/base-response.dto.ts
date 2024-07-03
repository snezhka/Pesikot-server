export class BaseResponseDto<T> {
  constructor(obj: T) {
    Object.assign(this, obj);
  }
}