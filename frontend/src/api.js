const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function getQrInfo(code) {
  const response = await fetch(`${API_BASE_URL}/qr/${encodeURIComponent(code)}`);
  const data = await response.json();
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

  const data = await response.json();
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

  const data = await response.json();
  return { ok: response.ok, data };
}

export async function getAdminSubmissions(token) {
  const response = await fetch(`${API_BASE_URL}/admin/submissions`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  const data = await response.json();
  return { ok: response.ok, data };
}