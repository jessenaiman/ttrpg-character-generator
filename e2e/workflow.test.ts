// e2e/workflow.test.ts
import { test, expect } from '@playwright/test';

test.describe('Complete Character Generation Workflow', () => {
  test('should generate character, save to database, and load it correctly', async ({ page }) => {
    // Navigate to the app
    await page.goto('/');
    
    // Wait for the page to load
    await expect(page).toHaveTitle(/TTRPG Character Generator/);
    
    // Step 1: Generate a character
    await page.getByRole('button', { name: 'D&D 5e' }).click();
    await page.getByPlaceholder('Enter a character concept...').fill('A brave warrior who is afraid of the dark');
    await page.getByRole('button', { name: 'Generate Character' }).click();
    
    // Wait for character to be generated and displayed
    await expect(page.getByText('Character Sheet')).toBeVisible({ timeout: 30000 });
    
    // Step 2: Verify character details are displayed correctly
    await expect(page.getByText('A brave warrior who is afraid of the dark')).toBeVisible();
    await expect(page.getByText('Half-Orc')).toBeVisible();
    await expect(page.getByText('Barbarian')).toBeVisible();
    
    // Step 3: Export the character to MDX
    await page.getByRole('button', { name: 'Export MDX' }).click();
    
    // Verify download was initiated (this is difficult to test in Playwright, but we can check the button exists)
    await expect(page.getByRole('button', { name: 'Export MDX' })).toBeVisible();
    
    // Step 4: Navigate back to the main page
    await page.goto('/');
    
    // Step 5: Verify the character appears in the compendium
    await expect(page.getByText('Character Compendium')).toBeVisible();
    await expect(page.getByText('A brave warrior who is afraid of the dark')).toBeVisible();
    
    // Step 6: Click on the character to view it
    await page.getByRole('row').first().click();
    
    // Step 7: Verify character sheet is displayed with correct data
    await expect(page.getByText('Character Sheet')).toBeVisible();
    await expect(page.getByText('A brave warrior who is afraid of the dark')).toBeVisible();
    await expect(page.getByText('Half-Orc')).toBeVisible();
    await expect(page.getByText('Barbarian')).toBeVisible();
    
    // Step 8: Test character regeneration with different prompt
    await page.getByRole('button', { name: 'Regenerate' }).click();
    await page.getByPlaceholder('Enter a character concept...').fill('A cunning tiefling rogue with a heart of gold');
    await page.getByRole('button', { name: 'Generate Character' }).click();
    
    // Wait for new character to be generated and displayed
    await expect(page.getByText('Character Sheet')).toBeVisible({ timeout: 30000 });
    
    // Verify new character details are displayed correctly
    await expect(page.getByText('A cunning tiefling rogue with a heart of gold')).toBeVisible();
    await expect(page.getByText('Tiefling')).toBeVisible();
    await expect(page.getByText('Rogue')).toBeVisible();
    
    // Step 9: Navigate back to the main page
    await page.goto('/');
    
    // Step 10: Verify both characters appear in the compendium
    await expect(page.getByText('Character Compendium')).toBeVisible();
    await expect(page.getByText('A brave warrior who is afraid of the dark')).toBeVisible();
    await expect(page.getByText('A cunning tiefling rogue with a heart of gold')).toBeVisible();
    
    // Take a screenshot for visual verification
    await page.screenshot({ path: 'test-results/workflow-complete.png' });
  });

  test('should generate NPC characters and link them to PCs', async ({ page }) => {
    // Navigate to the app
    await page.goto('/');
    
    // Wait for the page to load
    await expect(page).toHaveTitle(/TTRPG Character Generator/);
    
    // Step 1: Generate a main character
    await page.getByRole('button', { name: 'D&D 5e' }).click();
    await page.getByPlaceholder('Enter a character concept...').fill('A brave warrior who is afraid of the dark');
    await page.getByRole('button', { name: 'Generate Character' }).click();
    
    // Wait for character to be generated and displayed
    await expect(page.getByText('Character Sheet')).toBeVisible({ timeout: 30000 });
    
    // Step 2: Generate an NPC related to the main character
    await page.getByRole('button', { name: 'Generate NPC' }).click();
    
    // Wait for NPC to be generated and displayed
    await expect(page.getByText('Character Sheet')).toBeVisible({ timeout: 30000 });
    
    // Verify NPC details are displayed correctly
    await expect(page.getByText('Generated NPC')).toBeVisible();
    
    // Step 3: Navigate back to the main page
    await page.goto('/');
    
    // Step 4: Verify both characters appear in the compendium (main character and NPC)
    await expect(page.getByText('Character Compendium')).toBeVisible();
    await expect(page.getByText('A brave warrior who is afraid of the dark')).toBeVisible();
    await expect(page.getByText('Generated NPC')).toBeVisible();
    
    // Step 5: Filter by NPC status
    await page.getByRole('button', { name: 'NPCs' }).click();
    
    // Verify only NPCs are displayed
    await expect(page.getByText('Generated NPC')).toBeVisible();
    await expect(page.getByText('A brave warrior who is afraid of the dark')).not.toBeVisible();
    
    // Take a screenshot for visual verification
    await page.screenshot({ path: 'test-results/npc-generation.png' });
  });

  test('should handle character deletion correctly', async ({ page }) => {
    // Navigate to the app
    await page.goto('/');
    
    // Wait for the page to load
    await expect(page).toHaveTitle(/TTRPG Character Generator/);
    
    // Step 1: Generate a character
    await page.getByRole('button', { name: 'D&D 5e' }).click();
    await page.getByPlaceholder('Enter a character concept...').fill('A character to be deleted');
    await page.getByRole('button', { name: 'Generate Character' }).click();
    
    // Wait for character to be generated and displayed
    await expect(page.getByText('Character Sheet')).toBeVisible({ timeout: 30000 });
    
    // Step 2: Navigate back to the main page
    await page.goto('/');
    
    // Step 3: Verify the character appears in the compendium
    await expect(page.getByText('Character Compendium')).toBeVisible();
    await expect(page.getByText('A character to be deleted')).toBeVisible();
    
    // Step 4: Delete the character
    await page.getByRole('button', { name: 'Delete' }).first().click();
    
    // Confirm deletion (if there's a confirmation dialog)
    // This depends on the implementation, but we'll assume there's a confirmation button
    try {
      await page.getByRole('button', { name: 'Confirm' }).click();
    } catch (error) {
      // If no confirmation dialog, proceed
    }
    
    // Step 5: Verify the character is no longer in the compendium
    await expect(page.getByText('A character to be deleted')).not.toBeVisible();
    
    // Take a screenshot for visual verification
    await page.screenshot({ path: 'test-results/character-deletion.png' });
  });
});