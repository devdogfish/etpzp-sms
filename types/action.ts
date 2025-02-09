// this is for useActionState() forms
export type ActionResponse<T> = {
  success: boolean;
  message: string[];
  errors?: {
    [K in keyof T]?: string[];
  };
  inputs?: {
    [K in keyof T]?: string;
  };
};

export type DraftActionResponse<T> = {
  success: boolean;
  message: string[];
  draftId?: T;
};

export type DataActionResponse<T> = {
  success: boolean;
  message: string[];
  data?: T;
};

export type UpdateSettingResponse = {
  success: boolean;
  name?: string;
  input: string;
  error?: string;
  data?: any;
};
