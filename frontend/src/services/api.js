// src/services/api.js
// Centralized API client for the Trackyou frontend.
// Implements login and other future endpoints.

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

/**
 * Perform login request.
 * @param {{email:string, password:string}} credentials
 * @returns {Promise<string|null>} JWT token on success, null on failure.
 */
export async function login({ email, password }) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      console.error("Login request failed with status", response.status);
      return null;
    }

    const data = await response.json();
    // Assuming backend returns { token: "..." }
    return data.token || null;
  } catch (err) {
    console.error("Error during login API call", err);
    return null;
  }
}

// Placeholder for future API utilities (e.g., fetchTasks, createTask, etc.)
export async function fetchTasks() {
  // TODO: implement task fetching
  return [];
}
