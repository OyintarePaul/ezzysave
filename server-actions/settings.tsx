"use server";
import { createRecipientCode, resolveAccount } from "@/data/paystack";
import { getCurrentClerkUserId, verifyPassword } from "@/lib/auth";
import { getPayloadClient } from "@/lib/payload";
import { bankUpdateForm } from "@/lib/schema/bank-update-form";
import { ServerActionResponse } from "@/lib/types";
import bcrypt from "bcrypt";
import { revalidatePath } from "next/cache";

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
    const id = await getCurrentClerkUserId();

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

    revalidatePath("/dashboard/settings/security");
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
): Promise<ServerActionResponse<string>> {
  try {
    const response = await resolveAccount({ accountNumber, bankCode });
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
    console.log(error)
    return {
      success: false,
      message: "An unexpected error occured.",
    };
  }
}

export async function updateBankDetails(formData: {
  accountNumber: string;
  bankCode: string;
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
    const id = await getCurrentClerkUserId();

    // verify password
    const verified = await verifyPassword(id, data.currentPassword);
    if (!verified)
      return {
        success: false,
        message: "Password is wrong",
      };

    // reverify bank details and get account name
    // change bankCode from 001 to bankCode
    const resolveResponse = await resolveAccount({
      accountNumber: data.accountNumber,
      bankCode: data.bankCode,
    });

    const accountName = resolveResponse.account_name;

    // create recipient code
    const recipientCodeRes = await createRecipientCode({
      accountNumber: data.accountNumber,
      bankCode: data.bankCode,
      accountName,
    });

    const recipientCode = recipientCodeRes.recipient_code;

    // make update in payload
    const payload = await getPayloadClient();
    await payload.update({
      collection: "customers",
      data: {
        bankCode: data.bankCode,
        accountNumber: data.accountNumber,
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
