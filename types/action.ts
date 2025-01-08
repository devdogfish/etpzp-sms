declare type SuccessResult<T> = { success: true; data: T };
declare type ErrorResult = {
  success: false;
  error: { message: string; code: string };
};
declare type ActionResult<T> = SuccessResult<T> | ErrorResult;

export type ActionResponse<T> = {
  success: boolean;
  message: string;
  errors?: {
    [K in keyof T]?: string[];
  };
  inputs?: {
    [K in keyof T]?: string;
  };
};
