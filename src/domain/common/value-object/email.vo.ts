import { isValidEmail } from '@brazilian-utils/brazilian-utils';
import { InvalidFieldException } from '../exception';
import { ValueObject } from './value-object';

export class EmailVO extends ValueObject<string> {
  constructor(email: string) {
    super(email);
    this.validate();
  }

  private validate() {
    const isValid = isValidEmail(this._value);
    if (!isValid) throw new InvalidFieldException('e-mail');
  }
}
