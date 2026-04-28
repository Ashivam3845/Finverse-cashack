// Simple client-side auth using localStorage
// Passwords are stored as a simple hash (for demo purposes)
// In production, always use a proper backend auth system

const USERS_KEY = 'finflow_users';

type StoredUser = {
  name: string;
  email: string;
  passwordHash: string;
};

function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return hash.toString(36);
}

function getUsers(): StoredUser[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveUsers(users: StoredUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function registerUser(name: string, email: string, password: string): { success: boolean; error?: string } {
  const users = getUsers();
  if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
    return { success: false, error: 'Email already registered in the network.' };
  }
  users.push({ name, email: email.toLowerCase(), passwordHash: simpleHash(password) });
  saveUsers(users);
  return { success: true };
}

export function loginUser(email: string, password: string): { success: boolean; user?: { name: string; email: string }; error?: string } {
  const users = getUsers();
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (!user) {
    return { success: false, error: 'No account found with this email.' };
  }
  if (user.passwordHash !== simpleHash(password)) {
    return { success: false, error: 'Invalid credentials. Access denied.' };
  }
  return { success: true, user: { name: user.name, email: user.email } };
}
