// e2e/database.test.ts
import { test, expect } from '@playwright/test';

test.describe('Database Integration', () => {
  test('should save generated characters to database and load them correctly', async ({ page }) => {
    // Navigate to the app
    await page.goto('/');
    
    // Wait for the page to load
    await expect(page).toHaveTitle(/TTRPG Character Generator/);
    
    // Generate a character
    await page.getByRole('button', { name: 'D&D 5e' }).click();
    await page.getByPlaceholder('Enter a character concept...').fill('A brave warrior who is afraid of the dark');
    await page.getByRole('button', { name: 'Generate Character' }).click();
    
    // Wait for character to be generated and displayed
    await expect(page.getByText('Character Sheet')).toBeVisible({ timeout: 30000 });
    
    // Verify character details are displayed
    await expect(page.getByText('A brave warrior who is afraid of the dark')).toBeVisible();
    await expect(page.getByText('Half-Orc')).toBeVisible();
    await expect(page.getByText('Barbarian')).toBeVisible();
    
    // Navigate to the character compendium
    await page.goto('/');
    
    // Verify the character appears in the compendium
    await expect(page.getByText('Character Compendium')).toBeVisible();
    await expect(page.getByText('A brave warrior who is afraid of the dark')).toBeVisible();
    
    // Click on the character to view it
    await page.getByRole('row').first().click();
    
    // Verify character sheet is displayed with correct data
    await expect(page.getByText('Character Sheet')).toBeVisible();
    await expect(page.getByText('A brave warrior who is afraid of the dark')).toBeVisible();
    await expect(page.getByText('Half-Orc')).toBeVisible();
    await expect(page.getByText('Barbarian')).toBeVisible();
    
    // Take a screenshot for visual verification
    await page.screenshot({ path: 'test-results/database-character.png' });
  });

  test('should persist characters across page reloads', async ({ page }) => {
    // Navigate to the app
    await page.goto('/');
    
    // Wait for the page to load
    await expect(page).toHaveTitle(/TTRPG Character Generator/);
    
    // Check if there are any existing characters
    const compendiumExists = await page.getByText('Character Compendium').isVisible();
    
    if (!compendiumExists) {
      // Generate a character if none exist
      await page.getByRole('button', { name: 'D&D 5e' }).click();
      await page.getByPlaceholder('Enter a character concept...').fill('A wise wizard seeking forbidden knowledge');
      await page.getByRole('button', { name: 'Generate Character' }).click();
      
      // Wait for character to be generated and displayed
      await expect(page.getByText('Character Sheet')).toBeVisible({ timeout: 30000 });
      
      // Navigate back to the main page
      await page.goto('/');
    }
    
    // Get the count of characters in the compendium
    const initialCharacterCount = await page.getByRole('row').count();
    
    // Reload the page
    await page.reload();
    
    // Wait for the page to load
    await expect(page).toHaveTitle(/TTRPG Character Generator/);
    
    // Verify characters are still present
    const finalCharacterCount = await page.getByRole('row').count();
    expect(finalCharacterCount).toBe(initialCharacterCount);
    
    // Take a screenshot for visual verification
    await page.screenshot({ path: 'test-results/database-persistence.png' });
  });
});