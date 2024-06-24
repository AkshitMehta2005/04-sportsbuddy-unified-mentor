document.addEventListener('DOMContentLoaded', () => {
  const loginBtn = document.getElementById('login-btn');
  const registerBtn = document.getElementById('register-btn');
  const registerSubmitBtn = document.getElementById('register-submit-btn');
  const backToLoginBtn = document.getElementById('back-to-login-btn');
  const logoutBtn = document.getElementById('logout-btn');
  const addSportsBtn = document.getElementById('add-sports-btn');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const registerEmailInput = document.getElementById('register-email');
  const registerPasswordInput = document.getElementById('register-password');
  const loginContainer = document.getElementById('login-container');
  const registerContainer = document.getElementById('register-container');
  const content = document.getElementById('content');
  const sportsContainer = document.getElementById('sports-container');

  loginBtn.addEventListener('click', () => {
    const email = emailInput.value;
    const password = passwordInput.value;
    
    if (email && password) {
      auth.signInWithEmailAndPassword(email, password)
        .then(userCredential => {
          console.log('User logged in:', userCredential.user);
          logAction('User logged in');
          showContent();
        })
        .catch(error => {
          console.error('Login failed:', error);
          logAction('Login failed', error.message);
          alert('Login failed: ' + error.message); 
        });
    } else {
      alert('Please enter email and password'); 
    }
  });

  registerBtn.addEventListener('click', () => {
    showRegister();
  });

  backToLoginBtn.addEventListener('click', () => {
    showLogin();
  });

  registerSubmitBtn.addEventListener('click', () => {
    const email = registerEmailInput.value;
    const password = registerPasswordInput.value;
    
    if (email && password) {
      auth.createUserWithEmailAndPassword(email, password)
        .then(userCredential => {
          console.log('User registered:', userCredential.user);
          logAction('User registered');
          showLogin();
        })
        .catch(error => {
          console.error('Registration failed:', error);
          logAction('Registration failed', error.message);
          alert('Registration failed: ' + error.message); 
        });
    } else {
      alert('Please enter email and password'); 
    }
  });

  logoutBtn.addEventListener('click', () => {
    auth.signOut()
      .then(() => {
        logAction('User logged out');
        showLogin();
      })
      .catch(error => {
        console.error('Logout failed:', error);
        logAction('Logout failed', error.message);
        alert('Logout failed: ' + error.message); 
      });
  });

  addSportsBtn.addEventListener('click', () => {
    const title = prompt("Enter sports event title:");
    if (title) {
      db.collection('sports').add({
        title,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
      })
      .then(docRef => {
        logAction('Sports event added', { title, id: docRef.id });
        fetchSportsEvents();
      })
      .catch(error => {
        console.error('Add sports event failed:', error);
        logAction('Add sports event failed', error.message);
        alert('Add sports event failed: ' + error.message); 
      });
    }
  });

  auth.onAuthStateChanged(user => {
    if (user) {
      showContent();
      fetchSportsEvents();
    } else {
      showLogin();
    }
  });

  function showContent() {
    loginContainer.style.display = 'none';
    registerContainer.style.display = 'none';
    content.style.display = 'block';
  }

  function showLogin() {
    loginContainer.style.display = 'block';
    registerContainer.style.display = 'none';
    content.style.display = 'none';
  }

  function showRegister() {
    loginContainer.style.display = 'none';
    registerContainer.style.display = 'block';
    content.style.display = 'none';
  }

  function fetchSportsEvents() {
    sportsContainer.innerHTML = '';
    db.collection('sports').orderBy('timestamp', 'desc').get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          const event = doc.data();
          const div = document.createElement('div');
          div.textContent = event.title;

          const removeBtn = document.createElement('button');
          removeBtn.textContent = 'Remove';
          removeBtn.addEventListener('click', () => {
            removeSportEvent(doc.id);
          });

          div.appendChild(removeBtn);
          sportsContainer.appendChild(div);
        });
      })
      .catch(error => {
        console.error('Fetch sports events failed:', error);
        logAction('Fetch sports events failed', error.message);
        alert('Fetch sports events failed: ' + error.message); 
      });
  }

  function removeSportEvent(id) {
    db.collection('sports').doc(id).delete()
      .then(() => {
        logAction('Sports event removed', { id });
        fetchSportsEvents();
      })
      .catch(error => {
        console.error('Remove sports event failed:', error);
        logAction('Remove sports event failed', error.message);
        alert('Remove sports event failed: ' + error.message); 
      });
  }

  function logAction(action, data) {
    const log = `[${new Date().toISOString()}] ${action} ${data ? JSON.stringify(data) : ''}`;
    console.log(log);
  }
});
