const API_BASE = 'http://localhost:3002/api';
function getToken() {
  return localStorage.getItem('labelsetu_token');
}
function saveToken(token) {
  localStorage.setItem('labelsetu_token', token);
}
function clearToken() {
  localStorage.removeItem('labelsetu_token');
}

async function apiFetch(path, options = {}) {
  const res = await fetch(API_BASE + path, options);
  const json = await res.json();
  return { status: res.status, json };
}
async function apiGet(path) {
  const token = getToken();
  return apiFetch(path, {
    method: 'GET',
    headers: { 'Authorization': `Bearer ${token}` },
  });
}
async function apiPost(path, body) {
  return apiFetch(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}
async function mockSignup(name, email, password) {
  try {
    const { status,json } = await apiPost('/auth/register', { name, email, password });
    if (status!==201) {
      return { ok: false, error: json.message || 'Registration failed.' };
    }
       await mockLogin(email, password);
    return { ok: true };
  } catch {
    return { ok: false, error: 'Could not reach the server. Please try again.' };
  }
}
async function mockLogin(email, password) {
  try {
    const { status,json } = await apiPost('/auth/login', { email, password });
    if (status!==200) {
      return { ok: false, error: json.message || 'Login failed.' };
    }
    saveToken(json.token);
    return { ok: true };
  } catch {
    return { ok: false, error: 'Could not reach the server. Please try again.' };
  }
}
let _cachedUser = null;

function getCurrentUser() {
  return _cachedUser;
}
function logout() {
  clearToken();
  _cachedUser = null;
  window.location.href = 'login.html';
}
async function requireAuth() {
  const token = getToken();
  if (!token) {
    window.location.href = 'login.html';
    return;
  }
 try {
        const payload = JSON.parse(
            atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/'))
        );
        if (payload.exp * 1000 < Date.now()) {
            clearToken();
            window.location.href = 'login.html';
            return;
        }
        _cachedUser = {
            id: payload.id,
            role: payload.role
        };
    } catch (error) {
        clearToken();
        window.location.href = 'login.html';
    }
}
async function runCheck(file, category) {
  const formData = new FormData();
  formData.append('image', file);
  formData.append('category', category);
  const res = await fetch(`${API_BASE}/scans`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${getToken()}` },
    // DO NOT set Content-Type — browser sets multipart boundary automatically
    body: formData,
  });
  const json = await res.json();
  if (!res.ok) {
  throw new Error(json.message || json.error || 'Upload failed.');
}
return json;
}
async function getScanById(id) {
  const { status, json } = await apiGet(`/scans/${id}`);
  if (status !== 200) return null;
  return json;
}
async function getAllScans() {
  const { status, json } = await apiGet('/scans');
  if (status !== 200) return [];
  return json;
}
function highlightActiveNav() {
  const page = window.location.pathname.split('/').pop();
  document.querySelectorAll('.nav-links a').forEach(a => {
    if (a.getAttribute('href') === page) a.classList.add('active');
  });
}
document.addEventListener('DOMContentLoaded', () => {
  highlightActiveNav();

  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', logout);
  }
});