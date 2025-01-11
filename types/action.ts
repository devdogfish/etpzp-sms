export type SuccessResult<T> = { success: true; message: string; data: T };
export type ErrorResult = {
  success: false;
  message: string;
  data?: [];
};
// this is for any custom actions
export type ActionResult<T> = SuccessResult<T> | ErrorResult;

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
