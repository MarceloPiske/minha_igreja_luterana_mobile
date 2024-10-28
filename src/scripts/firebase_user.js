// Importando os módulos necessários do Firebase v9+
import {
    getAuth,
    signInWithPopup,
    GoogleAuthProvider,
    signInWithEmailAndPassword,
    signInAnonymously,
    createUserWithEmailAndPassword,
    sendEmailVerification
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

import { init_app } from "./init_firebase_app_8.js";
import { get_local_user } from "./utils.js";

const app = init_app()
const auth = getAuth(app);

export async function check_login_status() {
    // Verifica o estado do usuário ao carregar a página
    
    await auth.onAuthStateChanged((user) => {
        if (user) {
            // Usuário está autenticado, armazene informações no localStorage
            localStorage.setItem('user', JSON.stringify({
                uid: user.uid,
                email: user.email,
                displayName: user.displayName
            }));
            //console.log("Usuário logado", user)
        } else {
            //console.log("nenhum usuário logado");
        }
    });
    
    return get_local_user()
    
}
/* NOTE - LOGIN */
export async function loginWithEmailAndPassword(email, password) {
    //console.log(email, password);

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        // Redirecione o usuário para a página desejada após o login
        //console.log("Usuário logado com sucesso:", user);
    } catch (error) {
        // Trate o erro de login
        console.error("Erro ao logar:", error);
    }
}

export function loginAnonymously() {
    signInAnonymously(auth)
        .then((userCredential) => {
            // Sucesso no login anônimo
            const user = userCredential.user;
            //console.log("Login anônimo realizado com sucesso!", user);
        })
        .catch((error) => {
            // Erro no login anônimo
            const errorCode = error.code;
            const errorMessage = error.message;
            console.error("Erro ao fazer login anônimo:", errorCode, errorMessage);
        });
}

export function loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
        .then((result) => {
            // Sucesso no login via Google
            const user = result.user;
            //console.log("Login via Google realizado com sucesso!", user);
            location.reload(true);
        })
        .catch((error) => {
            // Erro no login via Google
            const errorCode = error.code;
            const errorMessage = error.message;
            console.error("Erro ao fazer login com Google:", errorCode, errorMessage);
        });
}

export function logout() {
    auth.signOut()
        .then(() => {
            //console.log("Usuário deslogado com sucesso!");
            localStorage.clear();
            window.location.href = "/src/html/login.html"; // Redireciona para a página de login
        })
        .catch((error) => {
            console.error("Erro ao deslogar:", error);
        });
}

export function createAccountWithEmailPassword(email, password) {
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Conta criada com sucesso
            const user = userCredential.user;
            //console.log("Conta criada com sucesso!", user);

            // Aqui você pode redirecionar o usuário, enviar um e-mail de verificação, etc.
            // Por exemplo, enviar e-mail de verificação:
            sendEmailVerification()
                .then(() => {
                    //console.log("E-mail de verificação enviado!");
                })
                .catch((error) => {
                    console.error("Erro ao enviar e-mail de verificação:", error);
                });

        })
        .catch((error) => {
            // Erro na criação da conta
            const errorCode = error.code;
            const errorMessage = error.message;
            console.error("Erro ao criar conta:", errorCode, errorMessage);

            // Aqui você pode exibir uma mensagem de erro para o usuário
        });
}
