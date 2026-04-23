import { supabase } from "@/integrations/supabase/client";

export const ADMIN_EMAILS = [
  "hasilazasenegal@gmail.com",
  "jobken080@gmail.com",
];

interface SendArgs {
  templateName: string;
  recipientEmail: string;
  idempotencyKey: string;
  templateData?: Record<string, unknown>;
}

export async function sendTransactionalEmail(args: SendArgs) {
  try {
    await supabase.functions.invoke("send-transactional-email", {
      body: args,
    });
  } catch (err) {
    console.error("Email send failed", { template: args.templateName, err });
  }
}

export async function notifyAdmins(
  templateName: string,
  baseIdempotencyKey: string,
  templateData?: Record<string, unknown>,
) {
  await Promise.all(
    ADMIN_EMAILS.map((email) =>
      sendTransactionalEmail({
        templateName,
        recipientEmail: email,
        idempotencyKey: `${baseIdempotencyKey}-${email}`,
        templateData,
      }),
    ),
  );
}
