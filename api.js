"use strict";

const API_BASE = "http://100.102.72.93:3000";  // a porta 3000 é temporária

/**
 * Envia uma requisição de cadastro ao backend.
 *
 * @returns {Promise<{ok: boolean, result: object}>}
 */
async function registerRequest(username, password, confirmPassword) {
  const response = await fetch(`${API_BASE}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username,
      password,
      confirm_password: confirmPassword,
    }),
  });

  const result = await response.json();
  return { ok: response.ok && result.success, result };
}

/**
 * Envia uma requisição de login ao backend.
 *
 * @returns {Promise<{ok: boolean, result: object}>}
 */
async function loginRequest(username, password) {
  const response = await fetch(`${API_BASE}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  const result = await response.json();
  return { ok: response.ok && result.success, result };
}
