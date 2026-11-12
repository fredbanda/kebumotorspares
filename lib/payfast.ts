import crypto from "crypto";

export type PayFastMode = "live" | "sandbox";

export function getPayFastConfig() {
  const merchantId = process.env.PAYFAST_MERCHANT_ID;
  const merchantKey = process.env.PAYFAST_MERCHANT_KEY;
  const passphrase = process.env.PAYFAST_PASSPHRASE || "";
  const mode = (process.env.PAYFAST_MODE || "live") as PayFastMode;

  if (!merchantId || !merchantKey) {
    throw new Error("PayFast merchant credentials are not configured");
  }

  const baseUrl =
    mode === "sandbox"
      ? "https://sandbox.payfast.co.za/eng/process"
      : "https://www.payfast.co.za/eng/process";

  const validateUrl =
    mode === "sandbox"
      ? "https://sandbox.payfast.co.za/eng/query/validate"
      : "https://www.payfast.co.za/eng/query/validate";

  return { merchantId, merchantKey, passphrase, mode, baseUrl, validateUrl };
}

export function encodePayFastValue(value: string) {
  return encodeURIComponent(value.trim()).replace(/%20/g, "+");
}

export function buildPayFastSignature(
  data: Record<string, string>,
  passphrase = ""
) {
  const pfOutput = Object.keys(data)
    .filter((key) => data[key] !== undefined && data[key] !== "" && key !== "signature")
    .sort()
    .map((key) => `${key}=${encodePayFastValue(String(data[key]))}`)
    .join("&");

  const stringToSign = passphrase
    ? `${pfOutput}&passphrase=${encodePayFastValue(passphrase)}`
    : pfOutput;

  return crypto.createHash("md5").update(stringToSign).digest("hex");
}

export function verifyPayFastSignature(
  data: Record<string, string>,
  passphrase = ""
) {
  const received = (data.signature || "").toLowerCase();
  if (!received) return false;
  const calculated = buildPayFastSignature(data, passphrase);
  return received === calculated.toLowerCase();
}
