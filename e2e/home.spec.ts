import { expect, test } from "@playwright/test";

test.describe("Home page", () => {
  test("has Next.js content and links", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByText("Get started by editing")).toBeVisible();
    await expect(page.getByRole("link", { name: /deploy now/i })).toBeVisible();
    await expect(
      page.getByRole("link", { name: /read our docs/i }),
    ).toBeVisible();
  });

  test("docs link has correct href", async ({ page }) => {
    await page.goto("/");
    const docsLink = page.getByRole("link", { name: /read our docs/i });
    await expect(docsLink).toHaveAttribute("href", /nextjs\.org\/docs/);
  });
});
