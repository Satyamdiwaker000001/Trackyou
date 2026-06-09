// src/services/api.js
// Centralized API client for the Trackyou frontend.

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

// Helper to get auth headers
function getHeaders() {
  const token = localStorage.getItem('token');
  return {
    "Content-Type": "application/json",
    ...(token ? { "Authorization": `Bearer ${token}` } : {})
  };
}

/**
 * Register a new user.
 */
export async function register({ name, email, password }) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Registration failed");
    }
    return data.token;
  } catch (err) {
    console.error("Register API error:", err);
    throw err;
  }
}

/**
 * Perform login request.
 */
export async function login({ email, password }) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Login failed");
    }
    return data.token;
  } catch (err) {
    console.error("Login API error:", err);
    throw err;
  }
}

/**
 * Get current user profile.
 */
export async function getProfile() {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: getHeaders()
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch profile");
    }
    return data;
  } catch (err) {
    console.error("Profile API error:", err);
    throw err;
  }
}

/**
 * Send test email to current user.
 */
export async function sendTestEmail() {
  try {
    const response = await fetch(`${API_BASE_URL}/user/test-email`, {
      method: "POST",
      headers: getHeaders()
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to send test email");
    }
    return data;
  } catch (err) {
    console.error("Test email API error:", err);
    throw err;
  }
}

/**
 * Fetch all tasks.
 */
export async function fetchTasks() {
  try {
    const response = await fetch(`${API_BASE_URL}/tasks`, {
      headers: getHeaders()
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch tasks");
    }
    return data;
  } catch (err) {
    console.error("Fetch Tasks API error:", err);
    throw err;
  }
}

/**
 * Create a new task.
 */
export async function createTask({ title, description, deadline }) {
  try {
    const response = await fetch(`${API_BASE_URL}/tasks`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ title, description, deadline }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to create task");
    }
    return data;
  } catch (err) {
    console.error("Create Task API error:", err);
    throw err;
  }
}

/**
 * Update task.
 */
export async function updateTask(taskId, updateData) {
  try {
    const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(updateData),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to update task");
    }
    return data;
  } catch (err) {
    console.error("Update Task API error:", err);
    throw err;
  }
}

/**
 * Delete task.
 */
export async function deleteTask(taskId) {
  try {
    const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
      method: "DELETE",
      headers: getHeaders()
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to delete task");
    }
    return data;
  } catch (err) {
    console.error("Delete Task API error:", err);
    throw err;
  }
}

/**
 * Real OAuth login/signup.
 */
export async function oauthLogin(payload) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/oauth`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "OAuth login failed");
    }
    return data.token;
  } catch (err) {
    console.error("Real OAuth API error:", err);
    throw err;
  }
}

/**
 * Mock OAuth login/signup.
 */
export async function oauthMock(provider) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/oauth-mock`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ provider }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Mock OAuth failed");
    }
    return data.token;
  } catch (err) {
    console.error("Mock OAuth API error:", err);
    throw err;
  }
}

// ----------------------
// Project APIs
// ----------------------

export async function fetchProjects() {
  try {
    const response = await fetch(`${API_BASE_URL}/projects`, {
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error("Failed to fetch projects");
    return await response.json();
  } catch (err) {
    console.error("fetchProjects error:", err);
    return [];
  }
}

export async function createProject(projectData) {
  const response = await fetch(`${API_BASE_URL}/projects`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(projectData),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Failed to create project");
  return data;
}

export async function deleteProject(projectId) {
  const response = await fetch(`${API_BASE_URL}/projects/${projectId}`, {
    method: "DELETE",
    headers: getHeaders(),
  });
  if (!response.ok) throw new Error("Failed to delete project");
  return await response.json();
}
