export type ServerActionResponse<T = undefined> = {
  message: string; // Present in both cases
} & (
  | {
      success: true;
      data?: T; // T can be passed as a specific type or left as undefined
    }
  | {
      success: false;
      data?: never; // Ensures data isn't used accidentally on failure
    }
);

export type ActionResponse<T = undefined> = {
  message: string; // Present in both cases
} & (
  | {
      success: true;
      data: T; // T can be passed as a specific type or left as undefined
    }
  | {
      success: false;
      data?: never; // Ensures data isn't used accidentally on failure
    }
);
