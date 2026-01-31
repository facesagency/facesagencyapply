import { test, expect } from '@playwright/test';

test.describe('Faces Agency Registration Form - Automated Fill', () => {
  test('should fill and submit the complete registration form', async ({ page }) => {
    // Navigate to the form
    await page.goto('https://facesagencyapply-5be5a5e3-main.vercel.app/');

    console.log('Step 0: Welcome Page');
    // Wait for the welcome page to load
    await page.waitForLoadState('networkidle');

    // Click "Get Started" or "Proceed" button
    const proceedButton = page.getByRole('button', { name: /get started|proceed|begin/i });
    await proceedButton.click();
    await page.waitForTimeout(1000);

    console.log('Step 1: Main Info');
    // Step 1: Main Info
    await page.fill('input[name="firstName"]', 'Sarah');
    await page.fill('input[name="middleName"]', 'Marie');
    await page.fill('input[name="lastName"]', 'Anderson');

    // Fill date of birth
    await page.fill('input[name="dateOfBirth"]', '1998-05-15');

    // Fill nationality
    await page.fill('input[name="nationality"]', 'Lebanese');

    // Click Next
    await page.getByRole('button', { name: /next/i }).click();
    await page.waitForTimeout(1000);

    console.log('Step 2: Contact Info');
    // Step 2: Contact Info
    await page.fill('input[name="email"]', 'sarah.anderson.test@example.com');
    await page.fill('input[name="mobile"]', '71234567');
    await page.fill('input[name="whatsapp"]', '71234567');
    await page.fill('input[name="otherNumber"]', '70987654');
    await page.fill('input[name="otherNumberPersonName"]', 'Diana Anderson');
    await page.fill('input[name="otherNumberRelationship"]', 'Mother');

    // Instagram (optional)
    const instagramInput = page.locator('input[name="instagram"]');
    if (await instagramInput.isVisible()) {
      await instagramInput.fill('@sarahmodel');
    }

    // Click Next
    await page.getByRole('button', { name: /next/i }).click();
    await page.waitForTimeout(1000);

    console.log('Step 3: Address & Languages');
    // Step 3: Address
    // Click on governorate select
    await page.click('button[role="combobox"]:has-text("Select governorate")');
    await page.waitForTimeout(500);
    await page.click('text="Beirut"');
    await page.waitForTimeout(500);

    // Click on district select
    await page.click('button[role="combobox"]:has-text("Select district")');
    await page.waitForTimeout(500);
    await page.click('[role="option"]:has-text("Beirut")');
    await page.waitForTimeout(500);

    // Click on area select
    await page.click('button[role="combobox"]:has-text("Select area")');
    await page.waitForTimeout(500);
    await page.click('[role="option"]:has-text("Hamra")');
    await page.waitForTimeout(500);

    // Select languages (checkboxes or multi-select)
    const arabicCheckbox = page.locator('text="Arabic"').locator('..').locator('input[type="checkbox"]');
    const englishCheckbox = page.locator('text="English"').locator('..').locator('input[type="checkbox"]');
    const frenchCheckbox = page.locator('text="French"').locator('..').locator('input[type="checkbox"]');

    if (await arabicCheckbox.isVisible()) {
      await arabicCheckbox.check();
      await englishCheckbox.check();
      await frenchCheckbox.check();
    }

    // Click Next
    await page.getByRole('button', { name: /next/i }).click();
    await page.waitForTimeout(1000);

    console.log('Step 4: Appearance');
    // Step 4: Appearance
    await page.click('button[role="combobox"]:has-text("Select eye color")');
    await page.waitForTimeout(500);
    await page.click('[role="option"]:has-text("Brown")');
    await page.waitForTimeout(500);

    await page.click('button[role="combobox"]:has-text("Select hair color")');
    await page.waitForTimeout(500);
    await page.click('[role="option"]:has-text("Brown")');
    await page.waitForTimeout(500);

    await page.click('button[role="combobox"]:has-text("Select hair type")');
    await page.waitForTimeout(500);
    await page.click('[role="option"]:has-text("Straight")');
    await page.waitForTimeout(500);

    await page.click('button[role="combobox"]:has-text("Select hair length")');
    await page.waitForTimeout(500);
    await page.click('[role="option"]:has-text("Long")');
    await page.waitForTimeout(500);

    await page.click('button[role="combobox"]:has-text("Select skin tone")');
    await page.waitForTimeout(500);
    await page.click('[role="option"]:has-text("Medium")');
    await page.waitForTimeout(500);

    // Click Next
    await page.getByRole('button', { name: /next/i }).click();
    await page.waitForTimeout(1000);

    console.log('Step 5: Measurements');
    // Step 5: Measurements
    await page.fill('input[name="height"]', '170');
    await page.fill('input[name="weight"]', '58');
    await page.fill('input[name="pantSize"]', 'S');
    await page.fill('input[name="jacketSize"]', 'M');
    await page.fill('input[name="shoeSize"]', '38');

    // Optional measurements
    const bustInput = page.locator('input[name="bust"]');
    if (await bustInput.isVisible()) {
      await bustInput.fill('86');
      await page.fill('input[name="waist"]', '65');
      await page.fill('input[name="hips"]', '92');
      await page.fill('input[name="shoulders"]', '38');
    }

    // Click Next
    await page.getByRole('button', { name: /next/i }).click();
    await page.waitForTimeout(1000);

    console.log('Step 6: Talents');
    // Step 6: Talents - this will vary based on the UI implementation
    // Assuming checkboxes for talents
    const actingCheckbox = page.locator('text="Acting"').locator('..').locator('input[type="checkbox"]');
    if (await actingCheckbox.isVisible()) {
      await actingCheckbox.check();
    }

    // Click Next
    await page.getByRole('button', { name: /next/i }).click();
    await page.waitForTimeout(1000);

    console.log('Step 7: Availability');
    // Step 7: Availability
    // Fill experience textarea
    const experienceTextarea = page.locator('textarea[name="experience"]');
    if (await experienceTextarea.isVisible()) {
      await experienceTextarea.fill('2 years of experience in commercial modeling and some acting work');
    }

    // Handle Yes/No questions
    const interestedInExtraYes = page.locator('text="Interested in extra work"').locator('..').locator('button:has-text("Yes")');
    if (await interestedInExtraYes.isVisible()) {
      await interestedInExtraYes.click();
    }

    // Click Next
    await page.getByRole('button', { name: /next/i }).click();
    await page.waitForTimeout(1000);

    console.log('Step 8: Review');
    // Step 8: Review & Submit
    // Wait for review page to load
    await page.waitForTimeout(2000);

    // Look for Submit button
    const submitButton = page.getByRole('button', { name: /submit|send application/i });

    // Optionally take a screenshot before submitting
    await page.screenshot({ path: 'tests/screenshots/before-submit.png', fullPage: true });

    console.log('Clicking Submit...');
    await submitButton.click();

    // Wait for submission to complete
    await page.waitForTimeout(5000);

    // Check for success message
    const successMessage = page.locator('text=/thank you|application.*submitted|success/i');
    await expect(successMessage).toBeVisible({ timeout: 10000 });

    // Take final screenshot
    await page.screenshot({ path: 'tests/screenshots/after-submit.png', fullPage: true });

    console.log('Form submitted successfully!');
  });

  test('should handle form validation errors', async ({ page }) => {
    await page.goto('https://facesagencyapply-5be5a5e3-main.vercel.app/');

    // Click proceed without filling welcome
    const proceedButton = page.getByRole('button', { name: /get started|proceed|begin/i });
    await proceedButton.click();
    await page.waitForTimeout(1000);

    // Try to click Next without filling required fields
    await page.getByRole('button', { name: /next/i }).click();

    // Should show validation error
    const errorMessage = page.locator('text=/required|error|validation/i');
    await expect(errorMessage).toBeVisible({ timeout: 3000 });

    console.log('Validation error displayed correctly');
  });
});
