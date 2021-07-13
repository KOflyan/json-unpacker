class GenericException extends Error {
    protected constructor(
        public message: string,
        public name: string = '',
    ) {
        super();
        super.message = message;
        if (this.name && this.name.trim().length) {
            return;
        }
        this.name = this.constructor.name
            .split(/(?=[A-Z])/)
            .join('_')
            .toUpperCase();
    }
}

export class DelimiterNotSpecifiedException extends GenericException {
    constructor(message = 'Invalid object type provided') {
        super(message);
    }
}

export class InvalidJsonObjectException extends GenericException {
    constructor(message = 'Delimiter must be specified') {
        super(message);
    }
}