// e2e/example.spec.ts

import { test, expect } from '@playwright/test';

const TODO_NAME = 'Bake a cake';

test('should add, filter then clear', async ({ page }) => {
  // Helper function to get the amount of todos on the page
  const getCountOfTodos = () =>
    page.$$eval('ul.todo-list > li', (el) => el.length);

  // Start from the index page (the baseURL is set via the webServer in the playwright.config.ts)
  await page.goto('http://localhost:3000/');

  // Initially there should be 0 entries
  expect(await getCountOfTodos()).toBe(0);

  // Adding a todo entry (click in the input, enter the todo title and press the Enter key)
  const inputLocator = page.locator('input.new-todo');
  await inputLocator.fill(TODO_NAME);
  await inputLocator.press('Enter');

  await expect(
    page.locator('label').filter({ hasText: TODO_NAME }),
  ).toBeVisible();

  // Here we get the text in the first todo item to see if it's the same which the user has entered
  const textContentOfFirstTodoEntry = await page.$eval(
    'ul.todo-list > li:nth-child(1) label',
    (el) => el.textContent,
  );
  expect(textContentOfFirstTodoEntry, TODO_NAME);

  expect(await getCountOfTodos()).toBe(1);

  // The todo list should be persistent. Here we reload the page and see if the entry is still there
  await page.reload({
    waitUntil: 'networkidle',
  });
  expect(await getCountOfTodos()).toBe(1);

  // Set the entry to completed
  await page.click('input.toggle');

  // Filter for active entries. There should be 0, because we have completed the entry already
  await page.click('"Active"');
  expect(await getCountOfTodos()).toBe(0);

  // If we filter now for completed entries, there should be 1
  await page.click('"Completed"');
  expect(await getCountOfTodos()).toBe(1);

  const itemLocator = page.locator('label').filter({ hasText: TODO_NAME });

  // Clear the list of completed entries, then it should be again 0
  await page.click('"Clear completed"');

  await expect(itemLocator).toBeHidden();

  await expect(await getCountOfTodos()).toBe(0);
});
