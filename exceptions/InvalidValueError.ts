export class InvalidValueError extends Error {
  constructor(item: string) {
    super(`The item could not be saved due to these malfunctions: ${item}`);
    this.name = "Invalid Value Error";
  }
}
