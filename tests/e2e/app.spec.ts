import { test, expect, Page } from "@playwright/test";

async function clearStorage(page: Page) {
  await page.evaluate(() => localStorage.clear());
}

async function signUpUser(page: Page, email: string, password: string) {
  await page.goto("/signup");
  await page.getByTestId("auth-signup-email").fill(email);
  await page.getByTestId("auth-signup-password").fill(password);
  await page.getByTestId("auth-signup-submit").click();
  await page.waitForURL("**/dashboard");
}

async function seedUserAndSession(page: Page, email: string, password: string) {
  await page.evaluate(
    ({ email, password }) => {
      const id = "test-user-id";
      const users = [
        { id, email, password, createdAt: new Date().toISOString() },
      ];
      localStorage.setItem("habit-tracker-users", JSON.stringify(users));
      localStorage.setItem(
        "habit-tracker-session",
        JSON.stringify({ userId: id, email }),
      );
    },
    { email, password },
  );
}

test.describe("Habit Tracker app", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await clearStorage(page);
  });

  test("shows the splash screen and redirects unauthenticated users to /login", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(page.getByTestId("splash-screen")).toBeVisible();
    await page.waitForURL("**/login", { timeout: 5000 });
    expect(page.url()).toContain("/login");
  });

  test("redirects authenticated users from / to /dashboard", async ({
    page,
  }) => {
    await seedUserAndSession(page, "auth@example.com", "pass123");
    await page.goto("/");
    await page.waitForURL("**/dashboard", { timeout: 5000 });
    expect(page.url()).toContain("/dashboard");
  });

  test("prevents unauthenticated access to /dashboard", async ({ page }) => {
    await page.goto("/dashboard");
    await page.waitForURL("**/login", { timeout: 5000 });
    expect(page.url()).toContain("/login");
  });

  test("signs up a new user and lands on the dashboard", async ({ page }) => {
    await signUpUser(page, "newuser@example.com", "securepassword");
    await expect(page.getByTestId("dashboard-page")).toBeVisible();
    await expect(page.getByTestId("empty-state")).toBeVisible();
  });

  test("logs in an existing user and loads only that user's habits", async ({
    page,
  }) => {
    // Create two users with habits
    await page.evaluate(() => {
      const user1 = {
        id: "u1",
        email: "user1@example.com",
        password: "pass1",
        createdAt: new Date().toISOString(),
      };
      const user2 = {
        id: "u2",
        email: "user2@example.com",
        password: "pass2",
        createdAt: new Date().toISOString(),
      };
      localStorage.setItem(
        "habit-tracker-users",
        JSON.stringify([user1, user2]),
      );
      const habits = [
        {
          id: "h1",
          userId: "u1",
          name: "User1 Habit",
          description: "",
          frequency: "daily",
          createdAt: new Date().toISOString(),
          completions: [],
        },
        {
          id: "h2",
          userId: "u2",
          name: "User2 Habit",
          description: "",
          frequency: "daily",
          createdAt: new Date().toISOString(),
          completions: [],
        },
      ];
      localStorage.setItem("habit-tracker-habits", JSON.stringify(habits));
    });

    await page.goto("/login");
    await page.getByTestId("auth-login-email").fill("user1@example.com");
    await page.getByTestId("auth-login-password").fill("pass1");
    await page.getByTestId("auth-login-submit").click();
    await page.waitForURL("**/dashboard");

    await expect(page.getByTestId("habit-card-user1-habit")).toBeVisible();
    await expect(page.getByTestId("habit-card-user2-habit")).not.toBeVisible();
  });

  test("creates a habit from the dashboard", async ({ page }) => {
    await signUpUser(page, "creator@example.com", "pass123");
    await page.waitForURL("**/dashboard");

    await page.getByTestId("create-habit-button").click();
    await page.getByTestId("habit-name-input").fill("Drink Water");
    await page.getByTestId("habit-description-input").fill("8 glasses a day");
    await page.getByTestId("habit-save-button").click();

    await expect(page.getByTestId("habit-card-drink-water")).toBeVisible();
  });

  test("completes a habit for today and updates the streak", async ({
    page,
  }) => {
    await signUpUser(page, "streaker@example.com", "pass123");
    await page.waitForURL("**/dashboard");

    // Create a habit
    await page.getByTestId("create-habit-button").click();
    await page.getByTestId("habit-name-input").fill("Drink Water");
    await page.getByTestId("habit-save-button").click();

    await expect(page.getByTestId("habit-streak-drink-water")).toContainText(
      "0",
    );

    // Complete it
    await page.getByTestId("habit-complete-drink-water").click();

    await expect(page.getByTestId("habit-streak-drink-water")).toContainText(
      "1",
    );
  });

  test("persists session and habits after page reload", async ({ page }) => {
    await signUpUser(page, "persist@example.com", "pass123");
    await page.waitForURL("**/dashboard");

    // Create a habit
    await page.getByTestId("create-habit-button").click();
    await page.getByTestId("habit-name-input").fill("Drink Water");
    await page.getByTestId("habit-save-button").click();

    await expect(page.getByTestId("habit-card-drink-water")).toBeVisible();

    // Reload
    await page.reload();
    await page.waitForURL("**/dashboard");

    await expect(page.getByTestId("dashboard-page")).toBeVisible();
    await expect(page.getByTestId("habit-card-drink-water")).toBeVisible();
  });

  test("logs out and redirects to /login", async ({ page }) => {
    await signUpUser(page, "logout@example.com", "pass123");
    await page.waitForURL("**/dashboard");

    await page.getByTestId("auth-logout-button").click();
    await page.waitForURL("**/login", { timeout: 5000 });
    expect(page.url()).toContain("/login");
  });

  test("loads the cached app shell when offline after the app has been loaded once", async ({
    page,
  }) => {
    // First load the app while online so service worker can cache
    await signUpUser(page, "offline@example.com", "pass123");
    await page.waitForURL("**/dashboard");
    await expect(page.getByTestId("dashboard-page")).toBeVisible();

    // Wait for service worker to install
    await page.waitForTimeout(2000);

    // Go offline
    await page.context().setOffline(true);

    // Try to navigate — app shell should load without hard crash
    await page.goto("/dashboard");

    // The page should not be a browser error page (net::ERR_INTERNET_DISCONNECTED)
    // It should render something from the cache
    const body = await page.locator("body").textContent();
    expect(body).not.toBeNull();
    expect(body!.length).toBeGreaterThan(0);

    // Go back online
    await page.context().setOffline(false);
  });
});
