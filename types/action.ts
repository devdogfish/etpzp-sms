declare type SuccessResult<T> = { success: true; data: T };
declare type ErrorResult = { success: false; error: { message: string; code: string } };
declare type ActionResult<T> = SuccessResult<T> | ErrorResult;