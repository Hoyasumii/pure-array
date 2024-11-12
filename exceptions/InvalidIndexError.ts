export class InvalidIndexError extends Error {
  constructor(value: string) {
    super(`index ${value} is not valid`);
    this.name = "Invalid Index Error";
  }
}
