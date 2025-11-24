export class InvalidCredentialsError extends Error {

}


export class AccessDeniedError extends Error {
  constructor(message = 'No autorizado') {
    super(message);
    this.name = 'AccessDeniedError';
  }
}

export class ValidationError extends Error {
  constructor(message = 'Datos inválidos') {
    super(message);
    this.name = 'ValidationError';
  }
}

export class NotFoundError extends Error {
  constructor(message = 'Recurso no encontrado') {
    super(message);
    this.name = 'NotFoundError';
  }
}