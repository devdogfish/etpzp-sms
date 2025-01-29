
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
