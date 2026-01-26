"use server";
import { getCurrentUser, verifyPassword } from "@/lib/auth";
import { getPayloadClient } from "@/lib/payload";
import { createRecipientCode, resolveAccount } from "@/lib/paystack";
import bcrypt from "bcrypt";

interface ActionResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

export async function updatePinAction({
  pin,
  confirmPin,
  password,
}: {
  pin: string;
  confirmPin: string;
  password: string;
}): Promise<ActionResponse<null>> {
  try {
    // authenticate user and get user id
    const { id } = await getCurrentUser();

    // verify password
    const verified = await verifyPassword(id, password);
    if (!verified)
      return {
        success: false,
        message: "Password is wrong",
      };

    // make sure pin is exactly 4 digits
    if (pin.length != 4)
      return {
        success: false,
        message: "Pin must be 4 digits",
      };

    // comfirm equality of pin and comfirm pin
    if (pin !== confirmPin)
      return {
        success: false,
        message: "Pin mismatch",
      };

    // hash pin
    const hashedPin = await bcrypt.hash(pin, 10);

    // make update in payload
    const payload = await getPayloadClient();
    await payload.update({
      collection: "customers",
      data: {
        withdrawalPin: hashedPin,
      },
      where: {
        clerkId: {
          equals: id,
        },
      },
    });

    // return
    return {
      success: true,
      message: "Pin updated successfully.",
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "An unexpected error occured. Please try again.",
    };
  }
}

export async function verifyAccountName(
  accountNumber: string,
  bankCode: string,
): Promise<ActionResponse<string>> {
  try {
    const response = await resolveAccount(accountNumber, bankCode);
    if (!response.status) {
      return {
        success: false,
        message: "Account not found",
      };
    }
    return {
      success: true,
      data: response.data.account_name,
    };
  } catch (error) {
    return {
      success: false,
      message: "An unexpected error occured.",
    };
  }
}

export async function updateBankDetails(
  accountNumber: string,
  bankCode: string,
  password: string,
): Promise<ActionResponse<null>> {
  try {
    // authenticate user and get user id
    const { id } = await getCurrentUser();

    // verify password
    const verified = await verifyPassword(id, password);
    if (!verified)
      return {
        success: false,
        message: "Password is wrong",
      };

    // reverify bank details and get account name
    // change bankCode from 001 to bankCode
    const resolveResponse = await resolveAccount(accountNumber, bankCode);
    if (!resolveResponse.status) {
      return {
        success: false,
        message: "Unable to verify bank details.",
      };
    }

    const accountName = resolveResponse.data.account_name;

    // create recipient code
    const recipientCodeRes = await createRecipientCode(
      accountNumber,
      bankCode,
      accountName,
    );

    if (!recipientCodeRes.status) {
      return {
        success: false,
        message: "An unexpected error occured.",
      };
    }
    const recipientCode = recipientCodeRes.data.recipient_code;

    // make update in payload
    const payload = await getPayloadClient();
    await payload.update({
      collection: "customers",
      data: {
        bankCode,
        accountNumber,
        accountName,
        recipientCode,
      },
      where: {
        clerkId: {
          equals: id,
        },
      },
    });

    // return
    return {
      success: true,
      message: "Account Details updated successfully.",
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "An unexpected error occured. Please try again.",
    };
  }
}
