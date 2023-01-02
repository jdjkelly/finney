type Err<T> = {
  err: T;
  ok?: never;
};

type Ok<U> = {
  err?: never;
  ok: U;
};

export type Result<T, U> = Err<T> | Ok<U>;

export type UnwrapResult = <T, U>(e: Result<T, U>) => U;

export const unwrap: UnwrapResult = <T, U>({ err, ok }: Result<T, U>) => {
  if (ok !== undefined && err !== undefined) {
    throw new Error(
      `Received both Err and Ok values at runtime when opening a Result\nErr: ${JSON.stringify(
        err
      )}\nOk: ${JSON.stringify(ok)}`
    );
  }
  if (ok !== undefined) return ok;
  if (err == undefined) throw new Error('Received no Err or Ok values at runtime when opening Result');

  throw err;
};

export const isErr = <T, U>(e: Result<T, U>): e is Err<T> => {
  return e.err !== undefined;
};

export const isOk = <T, U>(e: Result<T, U>): e is Ok<U> => {
  return e.ok !== undefined;
};

export const err = <T>(value: T): Err<T> => ({ err: value });

export const ok = <U>(value: U): Ok<U> => ({ ok: value });
