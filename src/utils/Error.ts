import IError from "../interfaces/IError";

export class CustomError extends Error implements IError{
    private _message: string;
    private _statusCode: number;
    private _statusMessage: string;

    constructor(m: string, statusCode?: number, statusMessage?: string) {
        super(m);
        Object.setPrototypeOf(this, CustomError.prototype);
        this._message = m;
        this._statusCode = statusCode || 401;
        this._statusMessage = statusMessage || "";
    }

    get statusCode(){
        return this._statusCode;
    }

    get statusMessage(){
        return this._statusMessage;
    }

    set statusCode(status: number){
        this._statusCode = status;
    }

    set statusMessage(msg: string){
        this._statusMessage = msg;
    }

    displayMessage(): string {
        console.log("An error has occured", this._message, this._statusCode, this._statusMessage);
        return `Error with status: ${this._statusCode}; Message: ${this._statusMessage}`;
    }
}
