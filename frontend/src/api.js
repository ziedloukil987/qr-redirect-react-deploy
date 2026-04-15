const API_BASE_URL = "/api";

async function parseJsonSafely(response) {
  const text = await response.text();

  try {
    return JSON.parse(text);
  } catch (error) {
    throw new Error(`Expected JSON but received: ${text.slice(0, 200)}`);
  }
}

export async function getQrInfo(code) {
  const response = await fetch(`${API_BASE_URL}/qr/${encodeURIComponent(code)}`);
  const data = await parseJsonSafely(response);
  return { ok: response.ok, data };
}

export async function submitQrForm(code, payload) {
  const response = await fetch(
    `${API_BASE_URL}/qr/${encodeURIComponent(code)}/submit`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    }
  );

  const data = await parseJsonSafely(response);
  return { ok: response.ok, data };
}

export async function adminLogin(password) {
  const response = await fetch(`${API_BASE_URL}/admin/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ password })
  });

  const data = await parseJsonSafely(response);
  return { ok: response.ok, data };
}

export async function getAdminSubmissions(token) {
  const response = await fetch(`${API_BASE_URL}/admin/submissions`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  const data = await parseJsonSafely(response);
  return { ok: response.ok, data };
}

export async function exportAdminSubmissions(token) {
  const response = await fetch(`${API_BASE_URL}/admin/submissions/export`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Export failed: ${text.slice(0, 200)}`);
  }

  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "submissions.csv";
  document.body.appendChild(a);
  a.click();
  a.remove();

  window.URL.revokeObjectURL(url);
}