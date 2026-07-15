import { syncToHubSpot, FormData } from "./hubspot";

const ID_SERVER = 'https://symphony-unending-zoologist.ngrok-free.dev';

export async function submitApplication(formData: FormData): Promise<{ success: boolean; error?: string }> {
  console.log("[submitApplication] ========== Starting ==========");

  try {
    // Step 1: Get next F-XXXX talent ID from the ID server
    let talentId = '';
    try {
      const idRes = await fetch(`${ID_SERVER}/next-id`, {
        headers: { 'ngrok-skip-browser-warning': 'true' }
      });
      const idData = await idRes.json();
      talentId = idData.talentId || '';
      console.log('[submitApplication] Got talentId:', talentId);
    } catch (idErr) {
      // Server offline: the submission continues WITHOUT an ID, but the contact
      // is flagged so the morning catch-up can find and repair it. Never silent.
      console.error('[submitApplication] Failed to get talent ID (server offline?):', idErr);
    }

    // Step 2: Sync to HubSpot (family-rule upsert). If the ID server was offline,
    // flag the contact via needs_id so it is findable and repairable.
    const result = await syncToHubSpot(formData, talentId);
    console.log("[submitApplication] syncToHubSpot returned:", JSON.stringify(result));

    if (!result.success) {
      return { success: false, error: result.error || "Failed to submit application. Please try again." };
    }

    if (!talentId && result.contactId) {
      // Best-effort flag; failure here must not break the applicant's submission
      try {
        await fetch('/api/hubspot-submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'update',
            contactId: result.contactId,
            properties: { needs_id: 'true' }
          })
        });
        console.warn('[submitApplication] Contact flagged with needs_id=true');
      } catch (flagErr) {
        console.error('[submitApplication] Could not flag missing ID:', flagErr);
      }
    }

    // Step 3: Trigger folder creation (only when we actually have an ID;
    // flagged contacts get their folder during the repair run)
    if (talentId) {
      try {
        await fetch(`${ID_SERVER}/webhook`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true'
          },
          body: JSON.stringify({
            firstname: formData.firstName,
            lastname: formData.lastName,
            faces_gender: formData.gender,
            talent_id: talentId,
            faces_date_of_birth: formData.dateOfBirth
          })
        });
      } catch (webhookErr) {
        console.error('[submitApplication] Webhook error:', webhookErr);
      }
    }

    return { success: true };
  } catch (err) {
    console.error("[submitApplication] UNEXPECTED ERROR:", err);
    const errorMessage = err instanceof Error ? err.message : String(err);
    return { success: false, error: `Submission error: ${errorMessage}` };
  }
}
