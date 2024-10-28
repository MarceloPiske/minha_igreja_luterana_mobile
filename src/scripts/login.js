import {
    loginWithEmailAndPassword, loginAnonymously, loginWithGoogle, check_login_status
} from './firebase_user.js';
import {
    get_collection_by_id
} from './firebase_firestorage.js';
import {
    get_local_user,
    updata_local_user_data
} from './utils.js'


function ann_login() {
    loginAnonymously()
}

function google_login() {
    loginWithGoogle()
}


document.getElementById('form-login').addEventListener('submit', (event) => {
    event.preventDefault(); // Previne o envio do formulário
    const email = document.querySelector('#email').value
    const password = document.querySelector('#password').value

    loginWithEmailAndPassword(email, password).catch(
        document.getElementById("message-error").innerText = "Erro de login"
    )

})
document.getElementById('anonymous-but').addEventListener('click', ann_login)
document.getElementById('google-but').addEventListener('click', google_login)

document.addEventListener('DOMContentLoaded', async function () {
    // Verifica o estado do usuário ao carregar a página
    
    if (await check_login_status()) {
        // Redirecione para a página principal ou dashboard
        if (!window.location.href.includes("index.html") && window.location.pathname != "/") {
            //console.log(window.location.pathname);

            //Verificar se o user já foi criado no storage.
            //console.log('passei aqui');
            
            const user_id = get_local_user()
            if (await get_collection_by_id('users', user_id.uid))
                window.location.href = "/";
            else 
                window.location.href = "/src/html/create_new_user.html"

        }

        //console.log(user);
    } else {
        // Nenhum usuário autenticado, redirecione para a página de login
        if (!window.location.href.includes("/src/html/login.html")) {
            window.location.href = "/src/html/login.html";
        }
    }
});