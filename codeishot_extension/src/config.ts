/**
 * This file handles all configurations for the extension
 */

const headers = {
  accept: "application/json",
  contentType: "application/json",
  userAgent: "codeishot/1.0.0",
  // 'X-CSRFTOKEN': csrfToken,
};

const UI_BASE_URL: string = process.env.UI_BASE_URL || "https://codeishot.com";
const UI_BASE_URL_LOGIN: string =
  process.env.UI_BASE_URL || "https://codeishot.com/login?type=vscode";

export { headers, UI_BASE_URL, UI_BASE_URL_LOGIN };
