import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
export function init_app() {
    const firebaseConfig = {
        apiKey: "AIzaSyClQU3sNkdx3yRrFsuR9Q-dh0PI8z2apYc",
        authDomain: "minha-igreja-luterana-mobile.firebaseapp.com",
        projectId: "minha-igreja-luterana-mobile",
        storageBucket: "minha-igreja-luterana-mobile.appspot.com",
        messagingSenderId: "241577367376",
        appId: "1:241577367376:web:667f47a1b232adeb30fe55",
        measurementId: "G-PS0SCBV5Z1"
      };
    
    // Inicializar Firebase
    if (!getApps().length > 0) {
        // Nenhum app foi inicializado, então inicialize o app
        //console.log("App inicializado:");
        return initializeApp(firebaseConfig);        
    } else {
        //console.log("App já inicializado:");
        return getApps()[0] 
    }
}
