import { upload_image } from "./firebase_storage.js";
import {
    convert_to_png_and_resize,
    get_local_user,
    get_local_user_id,
    get_CEP
} from "./utils.js";
import { create_user, get_collection_by_id } from "./firebase_firestorage.js";
import { check_login_status, } from "./firebase_user.js";


window.uploadImage = upload_image

document.getElementById('imageUpload').addEventListener('change', function (event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function (e) {
        // Obtém a URL da imagem a partir do FileReader
        const imageUrl = e.target.result;

        // Atualiza o src da imagem de preview
        const imagePreview = document.getElementById('imagePreview');
        imagePreview.src = imageUrl;
    };

    // Lê o arquivo como uma URL de dados
    reader.readAsDataURL(file);


})
document.querySelector('#cep').addEventListener('input', function () {
    const cep = this.value.replace(/\D/g, ''); // Remove caracteres não numéricos

    if (cep.length === 8) {
        get_CEP(cep)
    }
})
document.querySelector('#create-form').addEventListener('submit', async (event) => {
    event.preventDefault(); // Previne o envio do formulário
    // Pegando valores dos inputs
    const name = document.getElementById('name').value;
    const last_name = document.getElementById('last_name').value;
    const phone = document.getElementById('phone').value;
    const email = document.getElementById('email').value;
    // Coleta os valores dos inputs de endereço 
    const rua = document.getElementById('rua').value;
    const numero = document.getElementById('numero').value;
    const bairro = document.getElementById('bairro').value;
    const cidade = document.getElementById('cidade').value;
    const estado = document.getElementById('estado').value;
    const cep = document.getElementById('cep').value;

    // Cria o formato desejado
    const address = [rua, numero, bairro, cidade, estado, cep];

    const births_date = new Date(document.getElementById('births_date').value).getTime() / 1000;
    const baptism_date = new Date(document.getElementById('baptism_date').value).getTime() / 1000;
    const confirmed = document.getElementById('confirmed').checked;
    const communicant = document.getElementById('communicant').checked;
    const user_id = get_local_user_id()
    const file = document.getElementById('imageUpload').files[0]
    let image_path = ""

    if (file) {
        const resizedImage = await convert_to_png_and_resize(file, 128, 128)
        image_path = await upload_image(resizedImage);
    }

    // Criando objeto do usuário
    const usuario = {
        address: address,
        /* favorite_churches: favorite_churches,
        following_churches: following_churches, */
        confirmed: confirmed,
        communicant: communicant,
        /* congregation: congregation, */
        image_path: image_path,
        baptism_date: {
            seconds: baptism_date,
            nanoseconds: 0
        },
        births_date: {
            seconds: births_date,
            nanoseconds: 0
        },
        last_name: last_name,
        name: name,
        phone: phone,
        email: email,
    };
    //console.log(usuario);

    create_user(usuario, user_id)
    // Exibindo o resultado em JSON
    //document.getElementById('result').textContent = JSON.stringify(usuario, null, 2);
})
function criarUsuario() {

}
window.criarUsuario = criarUsuario
window.onload = async () => {
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
                if (window.location.href.includes('/src/html/create_new_user.html'))
                    //console.log('OK');
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
}