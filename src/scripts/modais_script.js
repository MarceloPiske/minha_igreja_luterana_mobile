//================= MODAIS ====================

import {
    get_local_user_data,
    updata_local_user_data,
    convert_timestamp_to_date_string,
    convert_timestemp_in_abrev_date,
    addresses_format
} from "./utils.js"
import { create_divisor_element, create_pastor_element } from "./drawning_scripts.js"
import {
    filter_pastor,
    update_user_local,
    filter_churches
} from "./firebase_firestorage.js"

function create_notificate_elements(data) {
    /* {
    "notification_id": "notif_001",
    "event_id": "12345",
    "title": "Youth Gathering",
    "image_url": "https://example.com/youth-gathering.jpg",
    "address": "123 Main St, Cityville, ST, 12345",
    "date": "2024-11-05",
    "congregation_id": "congregation_001",
    "visualized": false,
    "created_at": "2024-10-25T10:00:00Z",
    "type": "event",
    "priority": "high",
    "message": "Join us for our youth gathering with games, worship, and fellowship!",
    "read": false,
    "expires_at": "2024-11-06T23:59:59Z"
} */
    const church_content = document.createElement("div")
    church_content.classList.add("church-content")
    church_content.innerHTML = `<div class="image">
                                    <div id="date-event">
                                        <p><strong>${convert_timestamp_to_date_string(data.date).split("/")[0]}</strong></p>
                                        <p>${convert_timestemp_in_abrev_date(data.date)}</p>
                                    </div>
                                    <img src="${data.image_url ? data.image_url : "/src/img/test_image.JPG"}" alt="" loading="lazy">
                                </div>
                                <div class="text-content">
                                    <h2>${data.title}</h2>
                                    <span>${data.message}</span>
                                </div>`
    return church_content
}
//===================== Utils ==============
// Função para calcular o início do dia atual (00:00)
function getTodayDate() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
}
// Função para calcular o início e o fim da semana atual
function getWeekRange(date) {
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay());  // Domingo da semana atual
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);  // Sábado da semana atual
    endOfWeek.setHours(23, 59, 59, 999);

    return { startOfWeek, endOfWeek };
}

// Função para calcular o início e o fim da próxima semana
function getNextWeekRange() {
    const today = getTodayDate();
    const startOfNextWeek = new Date(today);
    startOfNextWeek.setDate(today.getDate() + (7 - today.getDay()));  // Domingo da próxima semana
    startOfNextWeek.setHours(0, 0, 0, 0);

    const endOfNextWeek = new Date(startOfNextWeek);
    endOfNextWeek.setDate(startOfNextWeek.getDate() + 6);  // Sábado da próxima semana
    endOfNextWeek.setHours(23, 59, 59, 999);

    return { startOfNextWeek, endOfNextWeek };
}

// Função para classificar os eventos
function classifyEvents(events) {
    const today = getTodayDate();
    const { startOfWeek, endOfWeek } = getWeekRange(today);
    const { startOfNextWeek, endOfNextWeek } = getNextWeekRange();

    const categorizedEvents = {
        hoje: [],
        esta_semana: [],
        proxima_semana: []
    };

    events.forEach(event => {
        const eventDate = event.date.toDate();  // Converte o Timestamp para Date

        if (eventDate.toDateString() === today.toDateString()) {
            categorizedEvents.hoje.push(event);
        } else if (eventDate >= startOfWeek && eventDate <= endOfWeek) {
            categorizedEvents.esta_semana.push(event);
        } else if (eventDate >= startOfNextWeek && eventDate <= endOfNextWeek) {
            categorizedEvents.proxima_semana.push(event);
        }
    });

    return categorizedEvents;
}
// NOTE Bloco de codigo para notificações
export async function notification_modal(data) {
    const notifications = await filter_churches(`churches/${data}/alerts`, "date", ">=", "today")
    
    const categorized_events = classifyEvents(notifications);
    //console.log(categorized_events);

    let return_events = []
    const body = document.querySelector('body')
    const modal = document.createElement('div')
    modal.classList.add('background-modal')
    
    if (categorized_events.hoje.length != 0) {
        return_events.push(create_divisor_element("HOJE"))
        for (const el of categorized_events.hoje) {
            return_events.push(create_notificate_elements(el))
        }
    }
    if(categorized_events.esta_semana.length != 0){
        return_events.push(create_divisor_element("ESTA SEMANA"))
        for (const el of categorized_events.esta_semana) {
            return_events.push(create_notificate_elements(el))
        }
    }
    if(categorized_events.proxima_semana.length != 0){
        return_events.push(create_divisor_element("PRÓXIMA SEMANA"))
        for (const el of categorized_events.proxima_semana) {
            return_events.push(create_notificate_elements(el))
        }
    }
    if (return_events.length == 0) {
        return_events.push(create_divisor_element("SEM NOTIFICAÇÕES"))
    }
    /* modal.addEventListener('click', function(){this.remove()}) */
    modal.innerHTML = `<section class="modal-content">
            <section class="close-content">
                <span onclick="document.querySelector('.background-modal').remove()" class="material-symbols-sharp">
                    arrow_back
                </span>
            </section>
            <section id="notification-sections">
                
            </section>
        </section>`

    body.append(modal)
    const not_sec = document.getElementById("notification-sections")
    return_events.forEach(av => {not_sec.appendChild(av)})
    
}
window.notification_modal = notification_modal

// NOTE Bloco de código para visualizar dados dos eventos
export function event_modal(programation) {
    const body = document.querySelector('body')
    const modal = document.createElement('div')
    modal.classList.add('background-modal')
    modal.innerHTML = `
        <section class="event-modal-content">
            <section class="event-data-content">
                <section class="close-content">
                    <span onclick="document.querySelector('.background-modal').remove()" class="material-symbols-sharp">
                        arrow_back
                    </span>
                </section>
                <section class="title-event-content">
                    <h2>Culto de domingo</h2>
                    <span>das 08:30 às 10:00</span>
                </section>
                <section class="date-event-content">
                    <h3>23</h3>
                    <h3>AGOSTO</h3>
                </section>
            </section>
            
            <section class="event-content">
                <div class="divisor">
                    <div class="line"></div>
                    <div class="text">
                        <h4>RECADOS</h4>
                    </div>
                </div>
                <p>Traga seu Hinario, e lembresse de deixar seu celular no silencioso!
                    Obrigado!
                </p>
                <div class="divisor">
                    <div class="line"></div>
                    <div class="text">
                        <h4>TEMA DA MENSAGEM</h4>
                    </div>
                </div>
                <P>O Amor de Cristo por toda a humanidade</P>
                <div class="divisor">
                    <div class="line"></div>
                    <div class="text">
                        <h4>TEXTOS</h4>
                    </div>
                </div>
                <P>Salmos 103.34-38</P>
                <P>Gálatas 20.1-6</P>
                <P>Mateus 13.4-6</P>
                <div class="divisor">
                    <div class="line"></div>
                    <div class="text">
                        <h4>HINOS</h4>
                    </div>
                </div>
                <P>Fortalece a Tua Igreja</P>
                <P>Buscai ao Senhor e Vievei</P>
                <P>Fico Feliz</P>
                <P>Tudo que no Mundo Você Tem</P>
                <div class="divisor">
                    <div class="line"></div>
                    <div class="text">
                        <h4>OFICIANTES</h4>
                    </div>
                </div>
                <p>Abiel</p>
            </section>
        </section>`

    body.append(modal)
}
// NOTE Bloco de código para visualizar modal de igrejas
function inset_main_modal_data(parent, data) {
    const content = document.querySelector(".content")
    parent.innerHTML = ""
    for (const element of data) {
        parent.append(element)
    }
}

async function church_modal() {
    let church = null
    const user_data = get_local_user_data()
    if (this) {
        church = JSON.parse(this.getAttribute('info'))
    } else {
        church = await filter_churches("churches", "id", "==", user_data.congregation)
        church = church[0]
    }

    const body = document.querySelector('body')
    const modal = document.createElement('div')
    modal.classList.add('background-modal')

    const favorite_churches = user_data.favorite_churches

    const church_data_content = document.createElement("section")
    church_data_content.classList.add('church-data-content')

    const header = document.createElement("header")
    header.style.backgroundImage = `url(${church.image_path})`

    // SOCIAL MEDIA - BLOCO DE CODIGOS
    const church_social_media = document.createElement('section')
    church_social_media.classList.add('church-social-media')
    if (church.instagram_url) {
        let insta_link = document.createElement('i')
        insta_link.classList.add('bx', 'bxl-instagram')
        insta_link.addEventListener('click', () => {
            window.open(church.instagram_url, '_blank')
        })
        church_social_media.append(insta_link)
    }
    if (church.youtube_url) {
        let youtube_link = document.createElement('i')
        youtube_link.classList.add('bx', 'bxl-youtube')
        youtube_link.addEventListener('click', () => {
            window.open(church.youtube_url, '_blank')
        })
        church_social_media.append(youtube_link)
    }
    if (church.facebook_url) {
        let face_link = document.createElement('i')
        face_link.classList.add('bx', 'bxl-facebook-square')
        face_link.addEventListener('click', () => {
            window.open(church.facebook_url, '_blank')
        })
        church_social_media.append(face_link)
    }

    header.innerHTML = `
                <section class="close-content">
                    <span onclick="document.querySelector('.background-modal').remove()" class="material-symbols-sharp">
                        arrow_back
                    </span>
                </section>
                <section class="church-name">
                    <h1>${church.name}</h1>
                </section>
                
                <section id="follow-and-notification">
                    <span id="followIcon" class="material-symbols-sharp">${favorite_churches.includes(church.id) ? "notifications_active" : "notifications"}</span>
                    <span class="text" id="followText">${favorite_churches.includes(church.id) ? "Seguindo" : "Seguir"}</span>
                </section>`
    header.append(church_social_media)

    /* +++++++++ MAIN +++++++===*/
    const calendar = document.createElement("div")
    calendar.innerText = "Clique para acessar o calendário"
    calendar.title = "Ao clicar deve direcionar ao calendário da igreja, na aba igreja, mas ainda não esta pronto"

    const main = document.createElement('main')
    const title = document.createElement('h3')
    title.innerText = "Bem Vindo a Nossa Igreja!"

    const welcome_text = document.createElement('p')
    welcome_text.innerText = church.welcome_text

    const church_contact = document.createElement('div')
    church_contact.classList.add('church-contact')
    if (church.email)
        church_contact.innerHTML += `<div>
                                        <span class="material-symbols-sharp">
                                            mail
                                        </span>
                                        ${church.email}
                                    </div>`
    if (church.phone)
        church_contact.innerHTML += `<div>
                                        <span class="material-symbols-sharp">
                                            call
                                        </span>
                                        ${church.phone}
                                    </div>`
    const map_content = document.createElement('div')
    map_content.classList.add('map-content')
    map_content.innerHTML = `<iframe height="450" frameborder="0" style="border:0"
                        src="https://www.google.com/maps/embed/v1/place?key=IzaSyBycuFYdCGNBhYOC5sUqkgJB1s1Q_N_zU8&amp;q=458%2C+Rua+Tiradentes%2C+Sapucaia+do+Sul%2C+RS"
                        allowfullscreen=""></iframe>`


    let pastor = await filter_pastor("congregations", 'array-contains', church.id)
   
    let elements_to_insert = [
        title,
        welcome_text,
        create_divisor_element("CALENDÁRIO"),
        calendar,
        create_divisor_element("CONTATO"),
        church_contact,
        create_divisor_element("PASTORES"),
    ]
    
    if(pastor.length != 0){
        elements_to_insert = elements_to_insert.concat(create_pastor_element({"data": pastor}))
    }
    
    elements_to_insert.push(create_divisor_element("LOCALIZAÇÃO"))
    elements_to_insert.push(map_content)
    inset_main_modal_data(main, elements_to_insert)

    church_data_content.append(header, main)
    modal.append(church_data_content)
    body.append(modal)
    //Botão de seguir
    document.getElementById("follow-and-notification").addEventListener("click", function () {
        const button = document.getElementById("follow-and-notification");
        const icon = document.getElementById("followIcon");
        const text = document.getElementById("followText");
        let user_data = get_local_user_data()
        //console.log(user_data);

        if (icon.textContent == "notifications_active") {
            button.classList.remove("following");
            icon.textContent = "notifications";
            text.textContent = "Seguir";


            if (user_data.favorite_churches) {
                if ((user_data.favorite_churches.includes(church.id))) {
                    //console.log("remover");
                    let index = user_data.favorite_churches.indexOf(church.id)
                    if (index !== -1) {
                        user_data.favorite_churches.splice(index, 1);
                        updata_local_user_data(user_data) //ANCHOR - Fazer update no firebase
                        update_user_local(user_data)
                    }
                }
            }
        } else {
            button.classList.add("following");
            icon.textContent = "notifications_active";
            text.textContent = "Seguindo";


            if (user_data.favorite_churches) {
                if ((!user_data.favorite_churches.includes(church.id))) {
                    //console.log("adicionar");
                    user_data.favorite_churches.push(church.id)
                }
            } else {
                //console.log("Criar!");
                user_data['favorite_churches'] = [church.id]

            }
            updata_local_user_data(user_data) //ANCHOR - Fazer update no firebase
            update_user_local(user_data)
        }
    });
}

window.church_modal = church_modal
// NOTE Bloco de código para visualizar modal do pastor
function pastor_modal() {
    const body = document.querySelector('body')
    const modal = document.createElement('div')
    const pastor_data = JSON.parse(this.getAttribute('info'))
    //console.log(pastor_data);

    modal.classList.add('background-modal')
    modal.innerHTML = `<section class="pastor-data-content">
            <header>
                <section class="close-content">
                    <span onclick="document.querySelector('.background-modal').remove()" class="material-symbols-sharp">
                        arrow_back
                    </span>
                </section>
                <section class="pastor-image">
                    <img src="${pastor_data.image_path}" alt="">
                    <section class="pastor-name">
                    <h1>${pastor_data.name} ${pastor_data.last_name}</h1>
                </section>
                </section>
                
                <section class="pastor-social-media">
                    <i class='bx bxl-youtube'></i>
                    <i class='bx bxl-instagram'></i>
                    <i class='bx bxl-facebook-square'></i>
                </section>
                <!--<section id="follow-and-notification">
                    <span class="material-symbols-sharp">
                        notifications_active
                    </span>
                    <span class="following"> Seguindo</span>
                </section>-->
            </header>
            <main id="main-pastor-modal">
                <p>
                    ${pastor_data.presentation_text}
                </p>
                <div class="divisor">
                    <div class="line"></div>
                    <div class="text">
                        <h4>CONTATO</h4>
                    </div>
                </div>
                <div class="pastor-contact">
                    <div>
                        <span class="material-symbols-sharp">
                            mail
                        </span>
                        ${pastor_data.email ? pastor_data.email : "Não há contato registrado"}
                    </div>

                    <div>
                        <span class="material-symbols-sharp">
                            call
                        </span>
                        ${pastor_data.phone_number ? pastor_data.phone_number : "Não há contato registrado"}
                    </div>
                </div>
                <!--<div class="divisor">
                    <div class="line"></div>
                    <div class="text">
                        <h4>IGREJAS</h4>
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
                </div>-->
            </main>
        </section>`

    body.append(modal)
    //NOTE - Aguardar um função que chama igrejas e desenhalas
    const chur_div = document.createElement("div")
    chur_div.classList.add("divisor")
    chur_div.innerHTML = `<div class="line"></div>
    <div class="text">
        <h4>IGREJAS</h4>
    </div>`
    //document.getElementById("main-pastor-modal").append(chur_div)
}
window.pastor_modal = pastor_modal
//----------------- MODAIS -------------------
