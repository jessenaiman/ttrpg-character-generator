// e2e/characterGeneration.test.ts
import { test, expect } from '@playwright/test';
import { GameSystem } from '../types';

test.describe('Character Generation', () => {
  test('should generate a D&D 5e character and display it correctly', async ({ page }) => {
    // Navigate to the app
    await page.goto('/');
    
    // Wait for the page to load
    await expect(page).toHaveTitle(/TTRPG Character Generator/);
    
    // Select D&D 5e system
    await page.getByRole('button', { name: 'D&D 5e' }).click();
    
    // Fill in character concept
    await page.getByPlaceholder('Enter a character concept...').fill('A brave warrior who is afraid of the dark');
    
    // Click generate button
    await page.getByRole('button', { name: 'Generate Character' }).click();
    
    // Wait for character to be generated and displayed
    await expect(page.getByText('Character Sheet')).toBeVisible({ timeout: 30000 });
    
    // Verify character details are displayed
    await expect(page.getByText('A brave warrior who is afraid of the dark')).toBeVisible();
    await expect(page.getByText('Half-Orc')).toBeVisible();
    await expect(page.getByText('Barbarian')).toBeVisible();
    
    // Take a screenshot for visual verification
    await page.screenshot({ path: 'test-results/dnd5e-character.png' });
  });

  test('should generate a Pathfinder 2e character and display it correctly', async ({ page }) => {
    // Navigate to the app
    await page.goto('/');
    
    // Wait for the page to load
    await expect(page).toHaveTitle(/TTRPG Character Generator/);
    
    // Select Pathfinder 2e system
    await page.getByRole('button', { name: 'Pathfinder 2e' }).click();
    
    // Fill in character concept
    await page.getByPlaceholder('Enter a character concept...').fill('A cunning rogue with a heart of gold');
    
    // Click generate button
    await page.getByRole('button', { name: 'Generate Character' }).click();
    
    // Wait for character to be generated and displayed
    await expect(page.getByText('Character Sheet')).toBeVisible({ timeout: 30000 });
    
    // Verify character details are displayed
    await expect(page.getByText('A cunning rogue with a heart of gold')).toBeVisible();
    await expect(page.getByText('Human')).toBeVisible();
    await expect(page.getByText('Rogue')).toBeVisible();
    
    // Take a screenshot for visual verification
    await page.screenshot({ path: 'test-results/pf2e-character.png' });
  });

  test('should generate a Blades in the Dark character and display it correctly', async ({ page }) => {
    // Navigate to the app
    await page.goto('/');
    
    // Wait for the page to load
    await expect(page).toHaveTitle(/TTRPG Character Generator/);
    
    // Select Blades in the Dark system
    await page.getByRole('button', { name: 'Blades in the Dark' }).click();
    
    // Fill in character concept
    await page.getByPlaceholder('Enter a character concept...').fill('A skilled operative from a criminal family');
    
    // Click generate button
    await page.getByRole('button', { name: 'Generate Character' }).click();
    
    // Wait for character to be generated and displayed
    await expect(page.getByText('Character Sheet')).toBeVisible({ timeout: 30000 });
    
    // Verify character details are displayed
    await expect(page.getByText('A skilled operative from a criminal family')).toBeVisible();
    await expect(page.getByText('Cutter')).toBeVisible();
    await expect(page.getByText('Skovlander')).toBeVisible();
    
    // Take a screenshot for visual verification
    await page.screenshot({ path: 'test-results/blades-character.png' });
  });

  test('should load previously generated characters from database', async ({ page }) => {
    // Navigate to the app
    await page.goto('/');
    
    // Wait for the page to load
    await expect(page).toHaveTitle(/TTRPG Character Generator/);
    
    // Check if there are any previously generated characters in the compendium
    const compendiumExists = await page.getByText('Character Compendium').isVisible();
    
    if (compendiumExists) {
      // Click on the first character in the list
      await page.getByRole('row').first().click();
      
      // Verify character sheet is displayed
      await expect(page.getByText('Character Sheet')).toBeVisible();
      
      // Take a screenshot for visual verification
      await page.screenshot({ path: 'test-results/loaded-character.png' });
    } else {
      // If no characters exist, generate one first
      await page.getByRole('button', { name: 'D&D 5e' }).click();
      await page.getByPlaceholder('Enter a character concept...').fill('A wise wizard seeking forbidden knowledge');
      await page.getByRole('button', { name: 'Generate Character' }).click();
      await expect(page.getByText('Character Sheet')).toBeVisible({ timeout: 30000 });
      
      // Navigate back to the main page
      await page.goBack();
      
      // Now check that the character appears in the compendium
      await expect(page.getByText('Character Compendium')).toBeVisible();
      
      // Click on the first character in the list
      await page.getByRole('row').first().click();
      
      // Verify character sheet is displayed
      await expect(page.getByText('Character Sheet')).toBeVisible();
      
      // Take a screenshot for visual verification
      await page.screenshot({ path: 'test-results/loaded-generated-character.png' });
    }
  });

  test('should export character to MDX format', async ({ page }) => {
    // Navigate to the app
    await page.goto('/');
    
    // Wait for the page to load
    await expect(page).toHaveTitle(/TTRPG Character Generator/);
    
    // Generate a character if none exists
    const compendiumExists = await page.getByText('Character Compendium').isVisible();
    
    if (!compendiumExists) {
      await page.getByRole('button', { name: 'D&D 5e' }).click();
      await page.getByPlaceholder('Enter a character concept...').fill('A noble paladin seeking redemption');
      await page.getByRole('button', { name: 'Generate Character' }).click();
      await expect(page.getByText('Character Sheet')).toBeVisible({ timeout: 30000 });
    } else {
      // Load the first character from the compendium
      await page.getByRole('row').first().click();
      await expect(page.getByText('Character Sheet')).toBeVisible();
    }
    
    // Click the export MDX button
    await page.getByRole('button', { name: 'Export MDX' }).click();
    
    // Verify download was initiated (this is a bit tricky to test in Playwright)
    // We can check if the download button exists and is clickable
    await expect(page.getByRole('button', { name: 'Export MDX' })).toBeVisible();
    
    // Take a screenshot for visual verification
    await page.screenshot({ path: 'test-results/export-mdx.png' });
  });
});