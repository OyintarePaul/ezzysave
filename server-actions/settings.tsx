"use server";
import bcrypt from "bcrypt";
import { revalidatePath } from "next/cache";
import {
  getCurrentClerkUserId,
  isRecentlyVerified,
  verifyPassword,
} from "@/lib/auth";
import { getPayloadClient } from "@/lib/payload";
import { bankUpdateForm } from "@/lib/schema/bank-update-form";
import { pinUpdateFormSchema } from "@/lib/schema/pin-update-form";
import { ServerActionResponse } from "@/lib/types";
import { createRecipientCode, resolveAccount } from "@/data/paystack";

export async function updatePinAction({
  newPin,
  confirmPin,
  password,
}: {
  newPin: string;
  confirmPin: string;
  password: string;
}): Promise<ServerActionResponse> {
  try {
    const { success, data } = pinUpdateFormSchema.safeParse({
      newPin,
      confirmPin,
      password,
    });

    if (!success) {
      return {
        success: false,
        message: "Invalid input. Please check your entries.",
      };
    }

    const userId = await getCurrentClerkUserId();

    // verify password
    const isCorrectPassowrd = await verifyPassword(userId, password);
    if (!isCorrectPassowrd)
      return {
        success: false,
        message: "Wrong password. Try again.",
      };

    // check if user has recently verified with otp
    const isRecentlyVerifiedResult = await isRecentlyVerified();
    if (!isRecentlyVerifiedResult) {
      return {
        success: false,
        message: "OTP verification is required to perform this action.",
      };
    }

    // hash pin
    const hashedPin = await bcrypt.hash(data.newPin, 10);

    // make update in payload
    const payload = await getPayloadClient();
    const result = await payload.update({
      collection: "customers",
      data: {
        withdrawalPin: hashedPin,
      },
      where: {
        clerkId: {
          equals: userId,
        },
      },
    });

    if (result.docs.length === 0) {
      return { success: false, message: "Customer profile not found." };
    }

    revalidatePath("/dashboard/settings/security");

    return {
      success: true,
      message: "Your withdrawal PIN has been updated successfully.",
    };
  } catch (error) {
    console.error("PIN_UPDATE_ERROR:", error);
    return {
      success: false,
      message: "An unexpected error occurred. Please try again.",
    };
  }
}

export async function verifyAccountNameAction(
  accountNumber: string,
  bankCode: string,
): Promise<ServerActionResponse<string>> {
  try {
    const response = await resolveAccount({ accountNumber, bankCode });
    if (!response.success) {
      return {
        success: false,
        message: response.message,
      };
    }
    return {
      success: true,
      message: response.message,
      data: response.data.account_name,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "An unexpected error occured.",
    };
  }
}

export async function updateBankDetailsAction(formData: {
  accountNumber: string;
  bankCode: string;
  accountName: string;
  password: string;
}): Promise<ServerActionResponse> {
  try {
    // validate
    const { success, data } = bankUpdateForm.safeParse(formData);
    if (!success) {
      return {
        success: false,
        message: "Bad input. Please check your input.",
      };
    }

    // authenticate user and get user id
    const userId = await getCurrentClerkUserId();

    // verify password
    const isCorrectPassowrd = await verifyPassword(userId, data.password);
    if (!isCorrectPassowrd)
      return {
        success: false,
        message: "Incorrect password. Please try again.",
      };

    // check if user has recently verified with otp
    const isRecentlyVerifiedResult = await isRecentlyVerified();
    if (!isRecentlyVerifiedResult) {
      return {
        success: false,
        message: "OTP verification is required to perform this action.",
      };
    }
    // reverify bank details and get account name
    // change bankCode from 001 to bankCode
    const resolveResponse = await resolveAccount({
      accountNumber: data.accountNumber,
      bankCode: data.bankCode,
    });

    if (!resolveResponse.success) {
      return {
        success: false,
        message: resolveResponse.message,
      };
    }

    const accountName = resolveResponse.data.account_name;

    // create recipient code
    const recipientCodeResponse = await createRecipientCode({
      accountNumber: data.accountNumber,
      bankCode: data.bankCode,
      accountName,
    });

    if (!recipientCodeResponse.success) {
      return {
        success: false,
        message: recipientCodeResponse.message,
      };
    }

    // make update in payload
    const payload = await getPayloadClient();
    const result = await payload.update({
      collection: "customers",
      data: {
        bankCode: data.bankCode,
        accountNumber: data.accountNumber,
        accountName,
        recipientCode: recipientCodeResponse.data.recipient_code,
      },
      where: {
        clerkId: {
          equals: userId,
        },
      },
    });

    if (result.docs.length === 0) {
      return { success: false, message: "Customer profile not found." };
    }

    revalidatePath("/dashboard/settings/bank");

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
