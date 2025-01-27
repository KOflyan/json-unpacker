class GenericException extends Error {
  protected constructor(
    public message: string,
    public name: string = ''
  ) {
    super()
    super.message = message

    if (this.name && this.name.trim().length) {
      return
    }

    this.name = this.constructor.name
      .split(/(?=[A-Z])/)
      .join('_')
      .toUpperCase()
  }
}

export class DelimiterNotSpecifiedException extends GenericException {
  constructor(message = 'Delimiter must be specified') {
    super(message)
  }
}

export class KeyNameContainsDelimiterException extends GenericException {
  constructor(key: string, delimiter: string) {
    super(
      `Key "${key}" already contains the delimiter "${delimiter}" in its name, specify a different delimiter`
    )
  }
}

export class InvalidJsonObjectException extends GenericException {
  constructor(message = 'Invalid json object provided') {
    super(message)
  }
}

export class InvalidPlainJsonObjectException extends GenericException {
  constructor(message = 'Invalid plain json object provided') {
    super(message)
  }
}
