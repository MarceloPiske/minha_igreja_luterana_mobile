import {
    get_localstorage_user_by_id,
    convert_timestamp_to_date_string,
    padronizar_telefone,
    addresses_format, capitalize_first_letter,
    get_local_user_data,
    convert_timestemp_in_abrev_date,
    get_last_visualized_church,
    set_last_visualized_church
} from "./utils.js";
import {
    filter_churches, get_collection_by_id,
    filter_event_type_and_date
} from "./firebase_firestorage.js";
import { event_modal } from "./modais_script.js";

//================= Geral para DESENHO ===================
export function active_bar(id) {
    let is_actived = document.querySelector('.active-bar')
    if (is_actived)
        is_actived.classList.remove('active-bar')
    document.getElementById(id).classList.toggle('active-bar')
}
export function insert_page_select(data) {
    /* NOTE Esta função desenha o seletor de páginas */
    const page = document.querySelector('.page-select')
    page.innerHTML = ""
    if (data.nav_pages) {
        for (const i of data.nav_pages) {
            let div = document.createElement('div')
            let a = document.createElement('a')

            a.innerText = i.page
            if (i.active)
                div.classList.add('active-page')
            div.append(a)
            div.addEventListener('click', () => { main_data_insert({ main_id: i.page, e: div }) })
            page.appendChild(div)
        }
        document.querySelector('#pages-container').classList.remove('no-page-select')
    } else {
        document.querySelector('#pages-container').classList.add('no-page-select')
    }
}
export function update_active_nav(e) {
    document.querySelector('.active-page').classList.remove('active-page')
    e.classList.add('active-page')
}
export function create_divisor_element(title) {
    const divisor = document.createElement('div')
    divisor.classList.add('divisor')
    divisor.innerHTML = `
        <div class="line"></div>
        <div class="text">
            <h4>${title}</h4>
        </div>`
    return divisor
}
function create_church_element(data) {
    let elements = []
    let person_church;

    for (const church of data) {
        person_church = document.createElement('div')
        person_church.classList.add('person-church')
        person_church.setAttribute('info', JSON.stringify(church))
        person_church.addEventListener("click", church_modal)
        person_church.innerHTML = `
            <div class="image-content">
                <img src="${church.image_path ? church.image_path : "/src/img/test_image.JPG"}" alt="" loading="lazy">
            </div>
            <div class="title-header-content">
                <h3>${church.name}</h3>
                <span>${addresses_format(church.address)}</span>
            </div>
        `

        elements.push(person_church)
    }
    return elements
}
export function create_pastor_element(data) {
    let type = data.type
    data = data.data

    let elements = []
    let pastor;
    
    for (const pastor_data of data) {
        pastor = document.createElement('div')
        pastor.classList.add('person-pastor')
        pastor.setAttribute('info', JSON.stringify(pastor_data))
        if (type != "list") {
            pastor.addEventListener("click", pastor_modal)
        } else {
            pastor.addEventListener("click", () => { create_pastor_header(pastor_data.id) })
        }

        pastor.innerHTML = `
            <div class="image-content">
                <img src="${pastor_data.image_path}" alt="" loading="lazy">
            </div>
            <div class="title-header-content">
                <h3>${pastor_data.name} ${pastor_data.last_name}</h3>
                
            </div>`
        elements.push(pastor)
    }
    
    return elements
}

/* NOTE desenhos da header */
export async function drawning_header(params) {
    /* NOTE Desenha o header */
    let header_data = ""
    const id = params.id
    switch (id) {
        case 'church':
            header_data = await church_header(params.church_data)
            break;
        case 'pastor':
            header_data = await create_pastor_header(params.pastor_data)
            break
        case 'person':
            header_data = await create_person_header_html()

            break
        case 'search':
            header_data = await create_search_header_html()
            break
        default:
            header_data = ``
            break;
    }

    header_content_insert(header_data)
}
export function header_content_insert(element) {
    const header = document.getElementById('principal-header')
    header.innerHTML = ""
    /* const header_content = document.querySelector('#header-content') */
    header.append(element)
}

//NOTE Desenhar main
//REVIEW - Criar classes para organizar as functions???
export function inset_main_data(data) {
    const content = document.querySelector(".content")
    content.innerHTML = ""
    for (const element of data) {
        content.append(element)
    }
}

export async function main_data_insert(params) {
    /* NOTE função que identifica qual dado deve ser desenhado */
    if (params.e)
        update_active_nav(params.e)
    let data;
    switch (params.main_id) {
        case "PROCURAR":
            data = await busc_html_main()
            break;
        case "IGREJAS PRÓXIMAS":
            data = await nearby_churches()
            break;
        case 'FAVORITOS':
            data = `
                <div class="divisor">
                    <div class="line"></div>
                    <div class="text">
                        <h4>FAVORITAS</h4>
                    </div>
                </div>
                <div class="church-content">
                    <div class="image">
                        <img src="/src/img/test_image.JPG" alt="" loading="lazy">
                    </div>
                    <div class="text-content">
                        <h2>Nome da igreja</h2>
                        <span>local onde a igreja se encontra</span>
                    </div>
                </div>`
            break;
        case "CULTOS":
            data = await create_events("Culto")
            break;
        case "EVENTOS":
            data = await create_events("Event")
            break;
        case "REUNIÕES":
            data = await create_events("Assembly")
            break;
        case "PERSON":
            data = await create_person_main_html()
            break
        case "AGENDA":
            data = await create_pastor_agenda(params.pastor_data)
            break;
        default:
            let div = document.createElement("div")
            div.innerHTML = `<div class="divisor">
                        <div class="line"></div>
                        <div class="text">
                            <h4>TESTE</h4>
                        </div>
                    </div>
                    <div class="church-content">
                        <div class="image">
                            <img src="/src/img/test_image.JPG" alt="" loading="lazy">
                        </div>
                        <div class="text-content">
                            <h2>TESTE</h2>
                            <span>TESTE</span>
                        </div>
                    </div>
                    <div class="church-content">
                        <div class="image">
                            <img src="/src/img/test_image.JPG" alt="" loading="lazy">
                        </div>
                        <div class="text-content">
                            <h2>TESTE</h2>
                            <span>TESTE</span>
                        </div>
                    </div>`
            data = [div]
            break;
    }

    inset_main_data(data)
}
/* NOTE Bloco de codigo independente para tela do pastor */
function trocar_pastores_modal() {
    const pastors_data = JSON.parse(localStorage.getItem("pastors"))

    const mod = document.createElement("div")
    mod.id = "pastor-modal"
    let sec = document.createElement("section")
    sec.classList.add("close-content")
    sec.innerHTML = `
                    <span onclick="document.querySelector('#pastor-modal').remove()" class="material-symbols-sharp">
                        arrow_back
                    </span>`

    mod.appendChild(sec)
    mod.appendChild(create_divisor_element("PASTORES"))
    create_pastor_element({ data: pastors_data, type: "list" }).forEach(p => { mod.appendChild(p) })
    document.querySelector("body").appendChild(mod)
}
window.trocar_pastores_modal = trocar_pastores_modal
async function create_pastor_agenda(pastor_data) {
    if (!pastor_data) {
        pastor_data = get_last_pastor_data()
    }
    const pastor_id = pastor_data.id
    /* {
      "event_id": 1,
      "title": "Culto Dominical",
      "type": "culto",
      "date": "2024-11-05",
      "time": "10:00",
      "location": "Igreja Principal",
      "details": "Culto semanal com a congregação",
      "is_private": false
    }, */
    let agenda = await filter_churches(`pastor/${pastor_id}/agenda`, "is_private", "==", false)
    console.log(agenda);

    return ["a"]
}
async function create_pastor_header(pastor_data) {
    const content_header = document.createElement('div')
    content_header.id = 'header-content'
    console.log(pastor_data);

    content_header.innerHTML = `<div onclick="pastor_modal()" class="image-content">
                <img src="${pastor_data.image_path ? pastor_data.image_path : "/src/img/teste_pastor.png"}" alt="" loading="lazy">
            </div>
            <div class="title-header-content">
                <h2>${pastor_data.name} ${pastor_data.last_name}</h2>
                <span>${pastor_data.presentation_text}</span>
            </div>
            <div class="header-icon-content">
                <span onclick="trocar_pastores_modal()" class="material-symbols-sharp">
                    swap_vert
                </span>
            </div>`

    return content_header
}
function set_last_pastor_data(data) {
    localStorage.setItem("last_pastor", JSON.stringify(data))
}
async function update_local_pastors_data() {
    let user_congregation_id = undefined

    const local_user = await get_localstorage_user_by_id()
    user_congregation_id = local_user.congregation;
    console.log(user_congregation_id);

    let pastors_data = await filter_churches("pastor", "congregations", "array-contains", user_congregation_id)

    localStorage.setItem("pastors", JSON.stringify(pastors_data))

    if (!localStorage.getItem("last_pastor") || localStorage.getItem("last_pastor") == "") {
        set_last_pastor_data(pastors_data[0])
    }
}

function get_last_pastor_data() {
    return JSON.parse(localStorage.getItem("last_pastor"))
}

export async function drawning_pastor_events(bar_id) {
    update_local_pastors_data()
    active_bar(bar_id)
    update_on_header_body(true)
    drawning_header({
        id: bar_id,
        pastor_data: await get_last_pastor_data()
    })


    main_data_insert({
        main_id: 'AGENDA',
        pastor_data: await get_last_pastor_data()
    })
    insert_page_select({
        nav_pages: [
            { 'page': 'AGENDA', 'active': true },
            { 'page': 'SOLICITAR', 'active': false }
        ]
    })
}
/* NOTE bloco de código independente para a tela de IGREJA */
async function church_header(church_data) {
    const content_header = document.createElement('div')
    content_header.id = 'header-content'

    content_header.innerHTML = `<div onclick="church_modal()" class="image-content">
                <img src="${church_data.image_path ? church_data.image_path : "/src/img/test_image.JPG"}" alt="" loading="lazy">
            </div>
            <div class="title-header-content">
                <h2>${church_data.name}</h2>
                <span>${church_data.welcome_text}</span>
            </div>
            <div class="header-icon-content">
                <span onclick="notification_modal('${church_data.id}')" class="material-symbols-sharp">
                    notifications
                </span>
            </div>`
    return content_header
}

async function create_events(type) {
    const local_user = get_local_user_data()
    const user_congregation_id = local_user.congregation
    const cultos = await filter_event_type_and_date(`churches/${user_congregation_id}/events`, "type", "==", type, 3)
    //console.log(cultos);
    let diver = null
    let ev = []
    for (const element of cultos) {
        diver = document.createElement("div")
        diver.classList.add("church-content")
        diver.addEventListener("click", () => event_modal(element))
        diver.innerHTML = `<div class="image">
                            <div id="date-event">
                                <p><strong>${convert_timestamp_to_date_string(element.date).split("/")[0]}</strong></p>
                                <p>${convert_timestemp_in_abrev_date(element.date)}</p>
                            </div>
                            <img src="${element.image_url ? element.image_url : "/src/img/test_image.JPG"}" alt="" loading="lazy">
                        </div>
                        <div class="text-content">
                            <h2>${element.title}</h2>
                            <span>${addresses_format(element.address)}</span>
                        </div>`
        ev.push(diver)
    }

    return [create_divisor_element("PRÓXIMAS PROGRAMAÇÕES"),].concat(ev)
}

export async function drawning_church_events(bar_id) {
    update_on_header_body(true)
    active_bar(bar_id)
    drawning_header({
        id: bar_id,
        church_data: await get_last_visualized_church()
    })
    main_data_insert({ main_id: 'CULTOS' })
    insert_page_select({
        nav_pages: [
            { 'page': 'CULTOS', 'active': true },
            { 'page': 'EVENTOS', 'active': false },
            { 'page': 'REUNIÕES', 'active': false }
        ]
    })
}
/* {
    "id": "1",
    "title": "Culto Dominical",
    "type": "Service",
    "description": "Weekly worship and prayer service.",
    "date": "2024-10-27",
    "location": "Main Church",
    "address": {
        "street": "Rua Tiradentes",
        "city": "Sapucaia do Sul",
        "state": "RS",
        "zip": "93214-000"
    },
    "organizer": "Pastor João",
    "contact": {
        "phone": "(51) 3474-1590",
        "email": "contact@church.com"
    },
    "recurring": true,
    "frequency": "Weekly",
    "image_url": "https://example.com/service.jpg",
    "visibility": "internal",  // Visibility: "internal" or "external"
    "minister": "Pastor João da Silva",  // Responsible minister
    "holy_supper": true,
    "hymns": [
        "Hymn of Victory",
        "Hymn of Praise",
        "Hymn of Worship"
    ],
    "readings": [
        "Psalms 23",
        "Romans 12:1-2",
        "Matthew 5:14-16"
    ],
    "start_event": "2024-10-27T10:00:00Z",  // Event start time in ISO format
    "end_event": "2024-10-27T12:00:00Z",    // Event end time in ISO format
    "message_theme": "The Light of the World",  // Theme of the message
    "announcements": "Bring your Bibles and a friend to the service!"  // Announcements or notices
}
 */

// NOTE Bloco de código independente da tela de ++SEARCH++
async function create_search_header_html() {
    const menu_content = document.createElement('div')
    menu_content.id = "menu-content"
    menu_content.innerHTML = `
                <button class="actived-menu" id="churches">
                    <span class="material-symbols-sharp">church</span>IGREJAS
                </button>
                <!--<button id="pastors">
                    <span class="material-symbols-sharp">face</span>PASTORES
                </button>-->`
    return menu_content
}
async function busc_html_main() {

    const div = document.createElement('div')
    div.classList.add('search-input-content')
    div.innerHTML = `<div class="filter-container">
                        <input type="text" id="filterInput" placeholder="Digite o nome da igreja" onkeypress="search_churches_by_name(event, this.value)">
                        <span class="material-symbols-sharp active-bar">search</span>
                    </div>`
    /* <div id="order-container">
        <span class="material-symbols-sharp">
            filter_list
        </span>
    </div>` */
    let result_div = document.createElement("div")
    //result_div.appendChild(create_divisor_element('RESULTADOS'))
    //create_church_element(churches).forEach(church => result_div.appendChild(church))
    result_div.id = "resultados"
    result_div.innerHTML = "<p>Digite o nome completo da igreja para encontrá-la</p>"
    return [
        div,
        result_div
    ]//.concat(create_church_element(churches))
}

async function nearby_churches() {
    //selecionar igrejas do estado da pessoa
    let estado = "RS" //Criar uma função que pega o estado atual do usuário
    //let churches = await filter_churches("churches", "address", 'array-contains', estado) 
    // Passar essas igrejas para a API de distancia
    //TODO - Provavelmente irei adapitar a função "create_church_element" para mostrar também a distancia
    let but = document.createElement("button")
    but.addEventListener("click", async () => {
        let churches = await filter_churches("churches", "address", 'array-contains', estado)
        inset_main_data([
            create_divisor_element('IGREJAS PRÓXIMAS'),
        ].concat(create_church_element(churches)))
    }
    )
    but.id = "seach_nearby_churches"
    but.innerText = "Procurar igrejas próximas"
    return [
        create_divisor_element('IGREJAS PRÓXIMAS'),
        but
    ]//.concat(create_church_element(churches))
}
export function drawning_search(bar_id) {
    update_on_header_body(true)
    active_bar(bar_id)
    drawning_header({
        id: bar_id
    })
    main_data_insert({ main_id: 'IGREJAS PRÓXIMAS' })
    insert_page_select({
        nav_pages: [
            { 'page': 'IGREJAS PRÓXIMAS', 'active': true },
            { 'page': 'PROCURAR' },
            /* { 'page': 'FAVORITOS' } */
        ]
    })
}
async function search_churches_by_name(event, value) {
    if (event.key == "Enter") {
        let churches = await filter_churches("churches", "name", '==', capitalize_first_letter(value))
        //console.log(churches);

        let church_element = create_church_element(churches)
        let results = document.getElementById("resultados")
        results.innerHTML = ""
        if (churches.length == 0) {
            results.innerHTML = "<p>Verifique se o nome nome da igreja está correto e se atente aos acentos</p>"
        } else {
            church_element.forEach(church => results.appendChild(church))
        }
    }


    //

}
window.search_churches_by_name = search_churches_by_name

/* NOTE bloco de código independente de person */
export function update_on_header_body(add) {
    /* NOTE função que faz o Header aparecer na trasição de telas */
    if (add) {
        document.querySelector('body').classList.add('on-header')
    } else {
        document.querySelector('body').classList.remove('on-header')
    }
}

async function create_person_header_html() {
    const header_content = document.createElement('div')
    header_content.id = 'header-content'

    return await get_localstorage_user_by_id()
        .then((data) => {
            // Faça algo com os dados
            let image_path = data.image_path ? data.image_path : 'src/img/test_person.jpeg'
            let user_name = `${data.name} ${data.last_name}`
            let congregational_positions = "";

            if (data.congregational_positions) {
                congregational_positions = data.congregational_positions
            }

            header_content.innerHTML = `<div class="image-content">
                <img src="${image_path}" alt="" loading="lazy">
            </div>
            <div class="title-header-content">
                <h2>${user_name}</h2>
                <span id="person-position">${congregational_positions}</span>
            </div>
            <div class="header-icon-content">
                <span onclick="logout()" class="material-symbols-sharp">
                    logout
                </span>
            </div>`
            return header_content
        })
        .catch((error) => {
            // Trate o erro
            console.error('Erro ao obter dados do Firestore:', error);
        });
}

async function create_person_main_html() {
    /* NOTE cria uma lista  */ // FIXME Melhorar a parte de desenho
    return await get_localstorage_user_by_id()
        .then((user_data) => {
            //console.log(user_data);
            const personal_data_content = document.createElement('div')
            personal_data_content.id = 'personal-data-content'
            personal_data_content.innerHTML = `<label>Celular</label>
                    <h3>${padronizar_telefone(user_data.phone)}</h3>
                    <label>e-mail</label>
                    <h3>${user_data.email}</h3>
                    <label>Nascimento</label>
                    <h3>${convert_timestamp_to_date_string(user_data.births_date)}</h3>
                    <label>Batismo</label>
                    <h3>${convert_timestamp_to_date_string(user_data.baptism_date)}</h3>`

            const address = document.createElement('div')
            address.id = 'address'
            let h3_address = document.createElement('h3');

            if (user_data.address) {
                h3_address.innerText = addresses_format(user_data.address);
                address.append(h3_address)
            }

            const dados = document.createElement('div')
            dados.id = 'dados'
            let h3;
            if (user_data.congregational_functions) {
                for (const func of user_data.congregational_functions) {
                    h3 = document.createElement('h3')
                    h3.innerText = func
                    dados.append(h3)
                }
            }

            if (user_data.confirmed) {
                h3 = document.createElement('h3')
                h3.innerText = "Confirmado"
                dados.append(h3)
            }
            if (user_data.communicant) {
                h3 = document.createElement('h3')
                h3.innerText = "Comungante"
                dados.append(h3)
            }
            const person_congregational_data_content = document.createElement('div')
            person_congregational_data_content.id = 'person-congregational-data-content'
            person_congregational_data_content.append(dados)


            return [
                create_divisor_element('ENDEREÇO'),
                address,
                create_divisor_element('DADOS PESSOAIS'),
                personal_data_content,
                create_divisor_element('DADOS CONGREGACIONAIS'),
                person_congregational_data_content
            ]
        })
}

export function drawning_person_events(bar_id) {
    update_on_header_body(true)
    active_bar(bar_id)
    drawning_header({
        id: bar_id,
        /* church_data: get_last_church_data() */
    })
    main_data_insert({ main_id: 'PERSON' })
    insert_page_select({ nav_pages: false })
}

//---------------- DESENHO --------------------

