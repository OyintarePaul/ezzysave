// export type ServerActionResponse<T> =
//   | {
//       success: true;
//       message?: string;
//       data: T;
//     }
//   | {
//       success: false;
//       message?: string;
//     };

export type ServerActionResponse<T = undefined> = (
  | {
      success: true;
      data?: T;
    }
  | {
      success: false;
    }
) & {
  message?: string;
};
