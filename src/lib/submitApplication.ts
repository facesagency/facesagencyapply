import { syncToHubSpot } from "./hubspot";
import type { RegistrationFormData } from "@/types/registration";

export async function submitApplication(
  formData: RegistrationFormData
): Promise<{ success: boolean; error?: string }> {
  console.log("[submitApplication] ========== Starting ==========");
  console.log("[submitApplication] Received formData:", JSON.stringify(formData, null, 2));

  try {
    console.log("[submitApplication] Calling syncToHubSpot...");
    const hubspotResult = await syncToHubSpot(formData);
    console.log("[submitApplication] syncToHubSpot returned:", JSON.stringify(hubspotResult));

    if (!hubspotResult.success) {
      console.error("[submitApplication] HubSpot sync failed:", hubspotResult.error);
      return {
        success: false,
        error: hubspotResult.error || "Failed to submit application. Please try again.",
      };
    }

    console.log("[submitApplication] Success! Contact ID:", hubspotResult.contactId);
    return { success: true };
  } catch (err) {
    console.error("[submitApplication] ========== UNEXPECTED ERROR ==========");
    console.error("[submitApplication] Error:", err);
    const errorMessage = err instanceof Error ? err.message : String(err);
    return { success: false, error: `Submission error: ${errorMessage}` };
  }
}
