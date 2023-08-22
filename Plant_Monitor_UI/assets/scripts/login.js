function toggleSignIn() {
  if (!firebase.auth().currentUser) {
    var provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
    firebase.auth().signInWithPopup(provider).then(function(result) {
    }).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // The email of the user's account used.
      var email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential;
      if (errorCode === 'auth/account-exists-with-different-credential') {
        alert('You have already signed up with a different auth provider for that email.');
        // If you are using multiple auth providers on your app you should handle linking
        // the user's accounts here.
      } else {
        console.error(error);
      }
    });
  } else {
    firebase.auth().signOut();
  }
  document.getElementById('quickstart-sign-in').disabled = true;
}

function initApp() {
  // Listening for auth state changes.
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      document.getElementById('quickstart-sign-in').textContent = "Sign out";
      document.getElementById('quickstart-sign-in').style = "height: 40px; margin-right: 10px; background-color: rgb(120, 128, 135); color: rgb(174, 179, 183);";
    } else {
      // User is signed out.
      document.getElementById('quickstart-sign-in').innerHTML = "<img src=\"./assets/icons/signin.png\" height=\"40\">";
      document.getElementById('quickstart-sign-in').style = "height: 40px; margin-right: 10px; padding: 0; border: none;";
    }
    document.getElementById('quickstart-sign-in').disabled = false;
  });

  document.getElementById('quickstart-sign-in').addEventListener('click', toggleSignIn, false);
}

window.onload = function() {
  initApp();
};