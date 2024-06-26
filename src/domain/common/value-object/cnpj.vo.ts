import { isValidCNPJ, formatCNPJ } from '@brazilian-utils/brazilian-utils';

import { InvalidFieldException } from '../exception';
import { ValueObject } from './value-object';

export class CnpjVO extends ValueObject<string> {
  constructor(cnpj: string) {
    super(cnpj.replace(/\D/g, ''));
    this.validate();
  }

  private validate() {
    const isValid = isValidCNPJ(this._value);

    if (!isValid) throw new InvalidFieldException('cnpj');
  }

  toString() {
    return formatCNPJ(this._value, { pad: true });
  }
}
