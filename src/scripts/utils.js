import {
    drawning_pastor_events, drawning_person_events,
    drawning_search, drawning_church_events
} from "./drawning_scripts.js";
import { logout } from './firebase_user.js'
import { get_collection_by_id } from './firebase_firestorage.js';

window.drawning_pastor_events = drawning_pastor_events;
window.drawning_person_events = drawning_person_events;
window.drawning_search = drawning_search;
window.drawning_church_events = drawning_church_events;
window.logout = logout;

/* NOTE ======== Local User Functins ============= */
export function get_local_user() {
    return localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : false
}
export function get_local_user_id() {
    return JSON.parse(localStorage.getItem('user')).uid
}
export function updata_local_user_data(data) {
    localStorage.setItem('user_data', JSON.stringify(data))
}
export function get_local_user_data() {
    return localStorage.getItem('user_data') ? JSON.parse(localStorage.getItem('user_data')) : false
}
export async function get_localstorage_user_by_id(user_id) {
    if (!user_id) {
        user_id = get_local_user_id()
    }
    let data = get_local_user_data()
    if (!data) {
        //console.log('não peguei local');
        data = await get_collection_by_id('users', user_id)
        updata_local_user_data(data)
    }
    return data
}
/* ----------------------------------------------- */
/* NOTE ========= Date functions ================= */
export function convert_timestamp_to_date_string(timestamp) {
    // Cria uma instância de Date utilizando os segundos do timestamp
    const date = new Date(timestamp.seconds * 1000);

    // Obtém o dia, mês e ano da data
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Mês é zero-indexado
    const year = date.getFullYear();

    // Retorna a data no formato "dia/mês/ano"
    return `${day}/${month}/${year}`;
}
export function convert_timestemp_in_abrev_date(timestamp) {
        // Array com as abreviações personalizadas dos meses
        const monthAbbreviations = [
            "JAN", "FEV", "MAR", "ABR", "MAI", "JUN", 
            "JUL", "AGO", "SET", "OUT", "NOV", "DEZ"
        ];
    
        // Converte o timestamp para uma instância Date
        const date = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
    
        // Obtém o índice do mês (0-11) e retorna a abreviação correspondente
        const monthIndex = date.getMonth();
        return monthAbbreviations[monthIndex];
}
/* ----------------------------------------------- */
/* NOTE ========= Images functions =============== */
export async function convert_to_png_and_resize(imageFile, width = 128, height = 128) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = function (event) {
            const img = new Image();

            img.onload = function () {
                const canvas = document.createElement('canvas');
                /* canvas.width = width;
                canvas.height = height; */

                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);

                // Converte a imagem para PNG
                canvas.toBlob(function (blob) {
                    const resizedImage = new File([blob], 'resized.png', { type: 'image/png' });
                    resolve(resizedImage);
                }, 'image/png');
            };

            img.src = event.target.result;
            /* callback(img); */
        };

        reader.readAsDataURL(imageFile);
    })
}
/* ----------------------------------------------- */

/* NOTE CEP functions */
export function get_CEP(cep) {
    fetch(`https://viacep.com.br/ws/${cep}/json/`)
        .then(response => response.json())
        .then(data => {
            if (!data.erro) {
                // Preenche os campos com os dados retornados
                document.getElementById('rua').value = data.logradouro;
                document.getElementById('bairro').value = data.bairro;
                document.getElementById('cidade').value = data.localidade;
                document.getElementById('estado').value = data.uf;
            } else {
                alert('CEP não encontrado.');
            }
        })
        .catch(error => {
            console.error('Erro ao buscar o CEP:', error);
            alert('Erro ao buscar o CEP. Tente novamente.');
        });

}

//NOTE - phone functions
export function padronizar_telefone(telefone) {

    // Remove todos os caracteres não numéricos
    telefone = String(telefone).replace(/\D/g, '');

    // Verifica se o número tem 11 dígitos    
    if (telefone.length === 11) {
        // Formata o número para o formato (00) 00000-0000
        return telefone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    } else {
        if (telefone.length === 10) {
            return telefone.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
        } else {
            // Caso o número não tenha 11 dígitos, retorna um aviso ou trata de outra forma
            return "Número inválido. Certifique-se de que o número tenha 11 dígitos.";
        }

    }
}

// NOTE address
export function addresses_format(addresses) {
    let text = "";
    for (const address of addresses) {
        text += address + ", "
    }
    return text.slice(0, -2);
}

function generic_modal_ok_cancel(params) {
    // Seleciona os elementos
    params = {
        alert_text: "Ao confirmar será enviada uma mensagem para a diretoria da igreja que confirmará sua solicitação.",
        final_alert_text: "Solicitação enviada à diretoria da igreja."
    }
    const body = document.querySelector('body')
    const generic_modal = document.createElement('div')
    generic_modal.id = "generic-modal"
    generic_modal.innerHTML = `
        <div class="generic-modal-content">
            <span id="close-generic-modal" class="close">&times;</span>
            <h2>Confirmar Ação</h2>
            <p>${params.alert_text}</p>
            <button id="confirmBtn" class="confirm-btn">Confirmar</button>
            <button id="cancelBtn" class="cancel-btn">Cancelar</button>
        </div>`

    body.appendChild(generic_modal)
    const modal = document.getElementById("generic-modal");
    /* const membroBtn = document.getElementById("membroBtn"); */
    const closeModal = document.getElementById("close-generic-modal");
    const confirmBtn = document.getElementById("confirmBtn");
    const cancelBtn = document.getElementById("cancelBtn");

    // Abre o modal quando o botão "Tornar-se Membro" é clicado
    /* membroBtn.addEventListener("click", function () {
        modal.style.display = "block";
    }); */

    // Fecha o modal ao clicar no botão de fechar (x)
    closeModal.addEventListener("click", function () {
        modal.style.display = "none";
    });

    // Fecha o modal ao clicar no botão "Cancelar"
    cancelBtn.addEventListener("click", function () {
        modal.style.display = "none";
    });

    // Ação ao confirmar
    confirmBtn.addEventListener("click", function () {
        alert(params.final_alert_text);
        modal.style.display = "none";
    });

    // Fecha o modal ao clicar fora dele
    window.addEventListener("click", function (event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });

}
generic_modal_ok_cancel("t")

export function capitalize_first_letter(sentence) {
    return sentence
        .toLowerCase() // Primeiro, converte tudo para minúsculas
        .split(' ')    // Divide a frase em palavras, usando o espaço como separador
        .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitaliza a primeira letra de cada palavra
        .join(' ');    // Junta as palavras de volta em uma frase
}

/* CHURCHE FUNCTIONS */
export async function get_last_visualized_church() {
    let user_congregation_id = undefined
    let church_data = undefined

    if (!localStorage.getItem("last_church") || localStorage.getItem("last_church") != "") {
        const local_user = await get_localstorage_user_by_id()
        user_congregation_id = local_user.congregation;
        //console.log(local_user);

        church_data = await get_collection_by_id("churches", user_congregation_id)
        set_last_visualized_church(church_data)
    }
    
    return JSON.parse(localStorage.getItem("last_church"))
}
export function set_last_visualized_church(data) {
    localStorage.setItem("last_church", JSON.stringify(data))
}


/* NOTE elemento perdido, pastor e igreja */
/* `<div class="person-pastor">
    <div class="image-content">
        <img src="src/img/teste_pastor.png" alt="" loading="lazy">
    </div>
    <div class="title-header-content">
        <h3>Abiel Pinnowl</h3>
        <span>Texto pesonalizado</span>
    </div>

</div>
<div class="person-church">
    <div onclick="church_modal()" class="image-content">
        <img src="src/img/test_image.JPG" alt="" loading="lazy">
    </div>
    <div class="title-header-content">
        <h3>Da paz, Sapucaia do Sul</h3>
        <span>Texto pesonalizado</span>
    </div>
</div>` */




