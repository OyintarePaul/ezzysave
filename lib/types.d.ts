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

export interface GetBanksResponse {
  status: boolean;
  message: string;
  data: Bank[];
  meta: PaystackMeta;
}

export interface Bank {
  name: string;
  slug: string;
  code: string;
  longcode: string;
  gateway: string | null;
  pay_with_bank: boolean;
  active: boolean;
  is_deleted: boolean;
  country: string;
  currency: string;
  type: string;
  id: number;
  createdAt: string;
  updatedAt: string;
}

export interface PaystackMeta {
  next: string;
  previous: string | null;
  perPage: number;
}
