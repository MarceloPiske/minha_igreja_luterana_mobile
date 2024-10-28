import { check_login_status } from "./firebase_user.js";
import { 
    update_on_header_body,
    active_bar,
    insert_page_select,
    main_data_insert
 } from "./drawning_scripts.js";

//================== Ao carregar a página ter algo ativado ===========
localStorage.setItem("last_page_activated", "AGENDA") /* FIXME - 
Aqui eu devo utilizar o indexedDB para identificar qual foi a ultima abaativa, na hora de fazer load para uma melhor UX */
localStorage.setItem("last_menu_activated", "pastor")

window.onload = async () => {
    //document.documentElement.requestFullscreen();
    /* FIXME - Ao carregar identificar qual a ultima aba acessada pelo usuário */
    const last_page_activated = localStorage.getItem('last_page_activated')
    const last_menu_activated = localStorage.getItem('last_menu_activated')

    
    drawning_pastor_events(last_menu_activated)
    //console.log("log",await check_login_status());
    
    if (await check_login_status()) {
        // Redirecione para a página principal ou dashboard
        if (!window.location.href.includes("index.html") && window.location.pathname != "/") {
            //console.log(window.location.pathname);

            //Verificar se o user já foi criado no storage.
            //console.log('passei aqui');
            
            const user_id = get_local_user_data()
            //if (get_collection_by_id('users', user_id))
                //window.location.href = "/";
            /* else */ 
                ///window.location.href = "/src/html/create_new_user.html"

        }

        //console.log(user);
    } else {
        // Nenhum usuário autenticado, redirecione para a página de login
        if (!window.location.href.includes("/src/html/login.html")) {
            //window.location.href = "/src/html/login.html";
        }
    }
}