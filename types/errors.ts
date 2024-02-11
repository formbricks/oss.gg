import { z } from "zod";

export class ResourceNotFoundError extends Error {
  statusCode = 404;
  constructor(resource: string, id: string) {
    super(`${resource} with ID ${id} not found`);
    this.name = "ResourceNotFoundError";
  }
}

export class InvalidInputError extends Error {
  statusCode = 400;
  constructor(message: string) {
    super(message);
    this.name = "InvalidInputError";
  }
}

export class ValidationError extends Error {
  statusCode = 400;
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

export class UnknownError extends Error {
  statusCode = 500;
  constructor(message: string) {
    super(message);
    this.name = "DatabaseError";
  }
}

export class DatabaseError extends Error {
  statusCode = 500;
  constructor(message: string) {
    super(message);
    this.name = "DatabaseError";
  }
}

export class GithubError extends Error {
  statusCode = 500;
  constructor(message: string) {
    super(message);
    this.name = "GithubError";
  }
}

export class UniqueConstraintError extends Error {
  statusCode = 409;
  constructor(message: string) {
    super(message);
    this.name = "UniqueConstraintError";
  }
}

export class ForeignKeyConstraintError extends Error {
  statusCode = 409;
  constructor(message: string) {
    super(message);
    this.name = "ForeignKeyConstraintError";
  }
}

export class OperationNotAllowedError extends Error {
  statusCode = 403;
  constructor(message: string) {
    super(message);
    this.name = "OperationNotAllowedError";
  }
}

export class AuthenticationError extends Error {
  statusCode = 401;
  constructor(message: string) {
    super(message);
    this.name = "AuthenticationError";
  }
}

export class AuthorizationError extends Error {
  statusCode = 403;
  constructor(message: string) {
    super(message);
    this.name = "AuthorizationError";
  }
}

export type NetworkError = {
  code: "network_error";
  message: string;
  status: number;
  url: URL;
};

export const ZErrorHandler = z.function().args(z.any()).returns(z.void());
