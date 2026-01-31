import { test, expect } from '@playwright/test';

test('Visual form submission with screenshots', async ({ page }) => {
  console.log('\n=== STARTING VISUAL FORM TEST ===\n');

  // Go to the form
  await page.goto('https://facesagencyapply-5be5a5e3-main.vercel.app/');
  await page.waitForLoadState('networkidle');

  // Step 0: Welcome page
  console.log('📸 Step 0: Welcome page');
  await page.screenshot({ path: 'tests/screenshots/step-0-welcome.png', fullPage: true });

  // Click Get Started
  await page.click('button:has-text("Get Started"), button:has-text("Proceed"), button:has-text("Begin")');
  await page.waitForTimeout(1000);

  // Step 1: Main Info
  console.log('📸 Step 1: Main Info');
  await page.screenshot({ path: 'tests/screenshots/step-1-before.png', fullPage: true });

  await page.fill('input[name="firstName"]', 'Sarah');
  await page.fill('input[name="middleName"]', 'Marie');
  await page.fill('input[name="lastName"]', 'TestDemo');
  await page.fill('input[name="dateOfBirth"]', '1998-05-15');
  await page.fill('input[name="nationality"]', 'Lebanese');

  await page.screenshot({ path: 'tests/screenshots/step-1-filled.png', fullPage: true });
  await page.click('button:has-text("Next")');
  await page.waitForTimeout(1000);

  // Step 2: Contact Info
  console.log('📸 Step 2: Contact Info');
  await page.screenshot({ path: 'tests/screenshots/step-2-before.png', fullPage: true });

  await page.fill('input[name="email"]', `test.visual.${Date.now()}@example.com`);
  await page.fill('input[name="mobile"]', '71234567');
  await page.fill('input[name="whatsapp"]', '71234567');
  await page.fill('input[name="otherNumber"]', '70987654');
  await page.fill('input[name="otherNumberPersonName"]', 'Diana TestDemo');
  await page.fill('input[name="otherNumberRelationship"]', 'Mother');

  const instagramInput = page.locator('input[name="instagram"]');
  if (await instagramInput.isVisible()) {
    await instagramInput.fill('@sarahdemo');
  }

  await page.screenshot({ path: 'tests/screenshots/step-2-filled.png', fullPage: true });
  await page.click('button:has-text("Next")');
  await page.waitForTimeout(1000);

  // Step 3: Address & Languages
  console.log('📸 Step 3: Address & Languages');
  await page.screenshot({ path: 'tests/screenshots/step-3-before.png', fullPage: true });

  // Fill address using selects
  await page.click('text="Governorate"');
  await page.waitForTimeout(500);
  await page.click('text="Beirut"');
  await page.waitForTimeout(500);

  await page.screenshot({ path: 'tests/screenshots/step-3-filled.png', fullPage: true });
  await page.click('button:has-text("Next")');
  await page.waitForTimeout(1000);

  // Step 4: Appearance
  console.log('📸 Step 4: Appearance');
  await page.screenshot({ path: 'tests/screenshots/step-4-before.png', fullPage: true });

  await page.screenshot({ path: 'tests/screenshots/step-4-filled.png', fullPage: true });
  await page.click('button:has-text("Next")');
  await page.waitForTimeout(1000);

  // Step 5: Measurements
  console.log('📸 Step 5: Measurements');
  await page.screenshot({ path: 'tests/screenshots/step-5-before.png', fullPage: true });

  await page.fill('input[name="height"]', '170');
  await page.fill('input[name="weight"]', '58');
  await page.fill('input[name="pantSize"]', 'S');
  await page.fill('input[name="jacketSize"]', 'M');
  await page.fill('input[name="shoeSize"]', '38');

  await page.screenshot({ path: 'tests/screenshots/step-5-filled.png', fullPage: true });
  await page.click('button:has-text("Next")');
  await page.waitForTimeout(1000);

  // Step 6: Talents
  console.log('📸 Step 6: Talents');
  await page.screenshot({ path: 'tests/screenshots/step-6-before.png', fullPage: true });

  await page.screenshot({ path: 'tests/screenshots/step-6-filled.png', fullPage: true });
  await page.click('button:has-text("Next")');
  await page.waitForTimeout(1000);

  // Step 7: Availability
  console.log('📸 Step 7: Availability');
  await page.screenshot({ path: 'tests/screenshots/step-7-before.png', fullPage: true });

  await page.screenshot({ path: 'tests/screenshots/step-7-filled.png', fullPage: true });
  await page.click('button:has-text("Next")');
  await page.waitForTimeout(2000);

  // Step 8: Review & Submit
  console.log('📸 Step 8: Review & Submit');
  await page.screenshot({ path: 'tests/screenshots/step-8-review.png', fullPage: true });

  // Click Submit
  const submitButton = page.locator('button:has-text("Submit"), button:has-text("Send Application")');
  await submitButton.click();
  console.log('✅ Submit button clicked!');

  // Wait for success or error
  await page.waitForTimeout(5000);

  // Take final screenshot
  await page.screenshot({ path: 'tests/screenshots/step-9-result.png', fullPage: true });

  // Check for success OR error message
  const pageText = await page.textContent('body');

  if (pageText?.toLowerCase().includes('thank you') || pageText?.toLowerCase().includes('success')) {
    console.log('\n✅ ✅ ✅ FORM SUBMITTED SUCCESSFULLY! ✅ ✅ ✅\n');
  } else if (pageText?.toLowerCase().includes('error') || pageText?.toLowerCase().includes('failed')) {
    console.log('\n❌ FORM SUBMISSION FAILED\n');
    console.log('Error message:', pageText?.substring(0, 500));
  } else {
    console.log('\n⏳ Form processing...\n');
  }

  console.log('\n=== TEST COMPLETE ===');
  console.log('Screenshots saved in tests/screenshots/');
  console.log('Check them to see each step of the form!\n');
});
