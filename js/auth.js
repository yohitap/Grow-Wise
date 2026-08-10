

'use strict';

const Auth = {
  API_URL: 'http://localhost:5000/api',
  AUTH_KEY: 'growwise.auth',
  USERS_KEY: 'growwise.users',

  mode: 'signin',
  els: {},

  init() {
    this.els.title = document.getElementById('auth-title');
    this.els.subtitle = document.getElementById('auth-subtitle');
    this.els.tabs = document.querySelectorAll('.auth__tab');
    this.els.message = document.getElementById('auth-message');
    this.els.signinForm = document.getElementById('signin-form');
    this.els.signupForm = document.getElementById('signup-form');
    this.els.signedIn = document.getElementById('signed-in-panel');
    this.els.demoNote = document.getElementById('demo-note');

    if (this.isAuthed()) {
      this.renderSignedIn();
      return;
    }

    this.bindTabs();
    this.signinForm.addEventListener('submit', (e) => this.handleSignIn(e));
    this.signupForm.addEventListener('submit', (e) => this.handleSignUp(e));
  },

  getUsers() {
    try {
      return JSON.parse(localStorage.getItem(this.USERS_KEY)) || {};
    } catch (e) {
      return {};
    }
  },

  saveUsers(users) {
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
  },

  isAuthed() {
    try {
      return !!JSON.parse(localStorage.getItem(this.AUTH_KEY));
    } catch (e) {
      return false;
    }
  },

  renderSignedIn() {
    const session = this.getSession();
    const user = session && session.user ? session.user : { name: 'Gardener', email: '' };
    const avatar = (user.name || 'G').charAt(0).toUpperCase();

    this.els.title.textContent = "You're signed in";
    this.els.subtitle.textContent = 'Your garden, favorites and reminders are saved to this account.';

    this.els.tabs.forEach((t) => (t.style.display = 'none'));
    this.els.signinForm.classList.remove('is-active');
    this.els.signupForm.classList.remove('is-active');
    if (this.els.demoNote) this.els.demoNote.style.display = 'none';

    this.els.signedIn.innerHTML = `
      <div class="auth__signedin-avatar">${avatar}</div>
      <span class="auth__signedin-badge">✓ Signed in</span>
      <div class="auth__signedin-name">${this.escape(user.name || 'Gardener')}</div>
      <div class="auth__signedin-email">${this.escape(user.email || '')}</div>
      <div class="auth__signedin-actions">
        <a href="dashboard.html" class="btn btn--primary">Go to My Dashboard →</a>
        <button class="btn btn--secondary" id="signedin-signout" type="button">Sign Out</button>
      </div>`;
    this.els.signedIn.classList.add('is-visible');

    document.getElementById('signedin-signout').addEventListener('click', () => {
      localStorage.removeItem(this.AUTH_KEY);
      window.location.reload();
    });
  },

  escape(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  },

  redirect() {
    window.location.href = 'dashboard.html';
  },

  bindTabs() {
    this.els.tabs.forEach((tab) =>
      tab.addEventListener('click', () => this.setMode(tab.dataset.tab))
    );
  },

  setMode(mode) {
    this.mode = mode;
    this.els.tabs.forEach((t) =>
      t.classList.toggle('is-active', t.dataset.tab === mode)
    );
    this.els.signinForm.classList.toggle('is-active', mode === 'signin');
    this.els.signupForm.classList.toggle('is-active', mode === 'signup');
    this.els.title.textContent =
      mode === 'signin' ? 'Welcome back, Gardener' : 'Join GrowWise';
    this.els.subtitle.textContent =
      mode === 'signin'
        ? 'Sign in to sync your garden, favorites and reminders.'
        : 'Create a free account and start growing smarter.';
    this.clearMessage();
  },

  showMessage(text, type) {
    this.els.message.textContent = text;
    this.els.message.className = `auth__message is-visible auth__message--${type}`;
  },

  clearMessage() {
    this.els.message.className = 'auth__message';
  },

  async handleSignIn(e) {
    e.preventDefault();
    const email = document.getElementById('signin-email').value.trim().toLowerCase();
    const password = document.getElementById('signin-password').value;
    if (!email || !password) return this.showMessage('Please fill in both fields.', 'error');

    try {
      const res = await fetch(`${this.API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if (res.ok) {
        const data = await res.json();
        this.setSession(data.user, data.token);
        return this.redirect();
      }
      throw new Error('backend rejected');
    } catch (err) {
      this.demoSignIn(email, password);
    }
  },

  async handleSignUp(e) {
    e.preventDefault();
    const name = document.getElementById('signup-name').value.trim();
    const email = document.getElementById('signup-email').value.trim().toLowerCase();
    const password = document.getElementById('signup-password').value;

    if (!name || !email || password.length < 6) {
      return this.showMessage('Please enter your name, a valid email and a 6+ character password.', 'error');
    }

    try {
      const res = await fetch(`${this.API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      if (res.ok) {
        const data = await res.json();
        this.setSession(data.user, data.token);
        return this.redirect();
      }
      throw new Error('backend rejected');
    } catch (err) {
      this.demoSignUp(name, email, password);
    }
  },

  demoSignIn(email, password) {
    const users = this.getUsers();
    const user = users[email];
    if (!user || user.password !== password) {
      return this.showMessage('No account found with those details. Try creating one.', 'error');
    }
    this.setSession({ id: user.id, name: user.name, email }, 'demo-token');
    this.showMessage('Signed in! Redirecting…', 'success');
    window.setTimeout(() => this.redirect(), 600);
  },

  demoSignUp(name, email, password) {
    const users = this.getUsers();
    if (users[email]) {
      return this.showMessage('An account with this email already exists. Sign in instead.', 'error');
    }
    users[email] = { id: 'u' + Date.now(), name, password };
    this.saveUsers(users);
    this.setSession({ id: users[email].id, name, email }, 'demo-token');
    this.showMessage('Account created! Redirecting…', 'success');
    window.setTimeout(() => this.redirect(), 600);
  },

  setSession(user, token) {
    localStorage.setItem(this.AUTH_KEY, JSON.stringify({ user, token }));
  },

  getSession() {
    try {
      return JSON.parse(localStorage.getItem(this.AUTH_KEY));
    } catch (e) {
      return null;
    }
  },

  signOut() {
    localStorage.removeItem(this.AUTH_KEY);
    window.location.href = 'login.html';
  }
};

Auth.init = Auth.init.bind(Auth);
document.addEventListener('DOMContentLoaded', () => Auth.init());

window.GrowWiseAuth = Auth;