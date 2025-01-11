export type SuccessResult<T> = { success: true; message: string; data: T };
export type ErrorResult<T> = {
  success: false;
  message: string;
  data?: T;
};
// this is for any custom actions
export type ActionResult<T> = SuccessResult<T> | ErrorResult<T>;

// this is for useActionState() forms
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
