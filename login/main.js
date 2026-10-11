"use strict";

const USERNAME_MIN_LENGTH = 3;
const USERNAME_MAX_LENGTH = 32;
const PASSWORD_MIN_LENGTH = 8;
const USERNAME_PATTERN = /^[A-Za-z0-9_.]+$/;

function validateUsername(username) {
  const trimmed = username.trim();

  if (trimmed.length === 0) {
    return "O nome não pode ficar em branco.";
  }
  if (trimmed.length < USERNAME_MIN_LENGTH || trimmed.length > USERNAME_MAX_LENGTH) {
    return `O nome deve ter entre ${USERNAME_MIN_LENGTH} e ${USERNAME_MAX_LENGTH} caracteres.`;
  }
  if (!USERNAME_PATTERN.test(trimmed)) {
    return "O nome só pode conter letras, números, '_' e '.' (sem espaços ou acentos).";
  }
  return null;
}

function validatePassword(password) {
  if (password.length < PASSWORD_MIN_LENGTH) {
    return `A senha deve ter pelo menos ${PASSWORD_MIN_LENGTH} caracteres.`;
  }
  return null;
}

async function handleLoginSubmit(event) {
  event.preventDefault();

  const nameInput = document.getElementById("name");
  const passwordInput = document.getElementById("password");

  const username = nameInput.value;
  const password = passwordInput.value;

  const usernameError = validateUsername(username);
  if (usernameError) {
    alert(usernameError);
    nameInput.focus();
    return;
  }

  const passwordError = validatePassword(password);
  if (passwordError) {
    alert(passwordError);
    passwordInput.focus();
    return;
  }

  const submitButton = event.target.querySelector("button[type='submit']");
  const originalLabel = submitButton.textContent;
  submitButton.disabled = true;
  submitButton.textContent = "Entrando...";

  try {
    const { ok, result } = await loginRequest(username.trim(), password);

    if (!ok) {
      alert("Usuário ou senha inválidos.");
      return;
    }

    localStorage.setItem("abrasci_token", result.data.token);
    localStorage.setItem("abrasci_username", result.data.user.username);

    window.location.href = "../index.html"; // @TODO  Trocar pela página pós-login
  } catch (err) {
    alert("Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.");
    console.error("Erro de rede no login:", err);
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = originalLabel;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form.register-fields");
  if (form) {
    form.addEventListener("submit", handleLoginSubmit);
  }
});
