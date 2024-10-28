import {
    getFirestore,
    doc,
    collection,
    getDoc, getDocs,
    setDoc, addDoc,
    updateDoc,
    query, where,
    Timestamp
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

import { init_app } from "./init_firebase_app_8.js";
import { get_local_user_id } from "./utils.js";

const app = init_app()
const db = getFirestore(app);
// Função para obter dados do Firestore
export async function get_collection_by_id(collectionName, id) {
    try {
        // Obtenha a referência da coleção
        const docRef = doc(db, collectionName, id);

        // Obtenha os documentos da coleção
        const docSnap = await getDoc(docRef);

        // Retorne os dados
        return docSnap.data();
    } catch (error) {
        // Trate o erro
        console.error('Erro ao obter dados do Firestore:', error);
        return null;
    }
}

// Função para criar um novo documento em uma coleção
export async function create_user(data, user_id) {
    try {
        const docRef = doc(db, "users", user_id);
        // Definindo os dados do documento
        await setDoc(docRef, data);

        //console.log("Document written with ID: ", docRef.id);
    } catch (e) {
        console.error("Error adding document: ", e);
    }
}
export async function update_user_local(data) {
    // Referência ao documento que você deseja atualizar
    const user_id = await get_local_user_id()
    const docRef = doc(db, "users", user_id);

    // Dados que você deseja atualizar
    const novosDados = data

    try {
        // Atualizando o documento
        await updateDoc(docRef, novosDados);
        //console.log("Documento atualizado com sucesso!");
    } catch (error) {
        console.error("Erro ao atualizar documento: ", error);
    }
}
//Pegar todas as igrejas 
export async function lista_all_doc_in_colection(collection_name) {
    const colecaoRef = collection(db, collection_name);

    try {
        const snapshot = await getDocs(colecaoRef);
        const documentos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return documentos;
    } catch (error) {
        console.error("Erro ao buscar documentos: ", error);
    }
}
export async function filter_churches(colecao, campo, clausula, valor) {
    // Referência à coleção
    if (valor == "today") {
        valor = Timestamp.now();
    }
    const colecaoRef = collection(db, colecao);

    // Criação da query para filtrar os documentos com base no campo e valor
    const q = query(colecaoRef, where(campo, clausula, valor));

    try {
        // Executando a query e obtendo os documentos
        const querySnapshot = await getDocs(q);

        // Processando os resultados
        const documentosFiltrados = [];
        querySnapshot.forEach((doc) => {
            documentosFiltrados.push({ id: doc.id, ...doc.data() });
        });

        //console.log("Documentos filtrados:", documentosFiltrados);
        return documentosFiltrados;
    } catch (error) {
        console.error("Erro ao filtrar documentos: ", error);
    }
}
function getWeekRange(weeksAhead = 0) {
    const currentDate = new Date();
    
    // Calcula o início da semana atual (domingo) 
    const firstDayOfWeek = new Date(currentDate.setDate(currentDate.getDate() - currentDate.getDay()));
    
    // Adiciona as semanas desejadas
    const startOfWeek = new Date(firstDayOfWeek.setDate(firstDayOfWeek.getDate()));
    const endOfWeek =  new Date(firstDayOfWeek.setDate(firstDayOfWeek.getDate() + (weeksAhead * 7)));
    
    // Define o fim da semana como sábado (7 dias após o início da semana)
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    return { startOfWeek, endOfWeek };
}
export async function filter_event_type_and_date(colecao, campo, clausule, value, week) {
    // Referência à coleção
    const colecaoRef = collection(db, colecao);
    const { startOfWeek, endOfWeek } = getWeekRange(week);
    // Criação da query para filtrar os documentos com base no campo e valor
    const q = query(
        colecaoRef,
        where(campo, clausule, value),
        where('date', '>=', startOfWeek),
        where('date', '<=', endOfWeek)
    );

    try {
        // Executando a query e obtendo os documentos
        const querySnapshot = await getDocs(q);

        // Processando os resultados
        const documentosFiltrados = [];
        querySnapshot.forEach((doc) => {
            documentosFiltrados.push({ id: doc.id, ...doc.data() });
        });

        //console.log("Documentos filtrados:", documentosFiltrados);
        return documentosFiltrados;
    } catch (error) {
        console.error("Erro ao filtrar documentos: ", error);
    }
}
export async function addChurchesData(church) {
    const docRef = doc(db, "churches", church.id);
    // Definindo os dados do documento
    await setDoc(docRef, church);
}
window.addChurchesData = addChurchesData
/* const churches = [
    {
        "id": "RPtz39CvhO0EUPvF1VmK",
        "parich": "",
        "youtube_url": "",
        "address": [
            "Rua Tiradentes",
            "Dhiel",
            "Sapucaia do Sul",
            "RS",
            "93214-000",
            458
        ],
        "phone": "(51) 3474-1590",
        "email": "",
        "facebook_url": "https://www.facebook.com/IELBSapucaiadoSul/",
        "welcome_text": "Bem vindo a nossa igreja, que o senhor esteja com vocês!",
        "instagram_url": "",
        "image_path": "https://firebasestorage.googleapis.com/v0/b/minha-igreja-luterana-mobile.appspot.com/o/images%2Ftest_image.JPG?alt=media",
        "name": "Da Paz",
        "district": ""
    },
    {
        "id": "KPp4T39CvhX0EUPvG2YJ",
        "parich": "São João",
        "youtube_url": "https://www.youtube.com/channel/igrejasaojoao",
        "address": [
            "Avenida Brasil",
            "Centro",
            "Porto Alegre",
            "RS",
            "90050-000",
            1020
        ],
        "phone": "(51) 3204-2100",
        "email": "contato@saomjoao.com",
        "facebook_url": "https://www.facebook.com/IgrejaSaoJoao/",
        "welcome_text": "Seja bem-vindo à Igreja São João!",
        "instagram_url": "https://www.instagram.com/igrejasaojoao/",
        "image_path": "https://firebasestorage.googleapis.com/v0/b/minha-igreja-luterana-mobile.appspot.com/o/images%2Figreja_sao_joao.JPG?alt=media",
        "name": "São João",
        "district": "Centro"
    },
    {
        "id": "APrz40CvhM0FUPvH3VlP",
        "parich": "Santa Clara",
        "youtube_url": "",
        "address": [
            "Rua Dom Pedro II",
            "Vila Nova",
            "Gravataí",
            "RS",
            "94010-050",
            301
        ],
        "phone": "(51) 3497-2200",
        "email": "contato@santaclara.com",
        "facebook_url": "https://www.facebook.com/IgrejaSantaClara/",
        "welcome_text": "Acolhemos você com muito carinho na Igreja Santa Clara.",
        "instagram_url": "",
        "image_path": "https://firebasestorage.googleapis.com/v0/b/minha-igreja-luterana-mobile.appspot.com/o/images%2Figreja_santa_clara.JPG?alt=media",
        "name": "Santa Clara",
        "district": "Vila Nova"
    },
    {
        "id": "BRsz41DvhN1GVPvJ4XmL",
        "parich": "Santo Antônio",
        "youtube_url": "https://www.youtube.com/channel/igrejasantoantonio",
        "address": [
            "Rua das Flores",
            "Centro",
            "Canoas",
            "RS",
            "92010-400",
            150
        ],
        "phone": "(51) 3474-3300",
        "email": "contato@santoantonio.com",
        "facebook_url": "https://www.facebook.com/IgrejaSantoAntonio/",
        "welcome_text": "A Igreja Santo Antônio te recebe de braços abertos!",
        "instagram_url": "https://www.instagram.com/igrejasantoantonio/",
        "image_path": "https://firebasestorage.googleapis.com/v0/b/minha-igreja-luterana-mobile.appspot.com/o/images%2Figreja_santo_antonio.JPG?alt=media",
        "name": "Santo Antônio",
        "district": "Centro"
    },
    {
        "id": "CRsz42EvhO2HVPvK5YmM",
        "parich": "São Pedro",
        "youtube_url": "",
        "address": [
            "Rua do Parque",
            "Centro",
            "Novo Hamburgo",
            "RS",
            "93520-000",
            500
        ],
        "phone": "(51) 3594-4700",
        "email": "contato@saopedro.com",
        "facebook_url": "https://www.facebook.com/IgrejaSaoPedro/",
        "welcome_text": "Bem-vindo à Igreja São Pedro!",
        "instagram_url": "",
        "image_path": "https://firebasestorage.googleapis.com/v0/b/minha-igreja-luterana-mobile.appspot.com/o/images%2Figreja_sao_pedro.JPG?alt=media",
        "name": "São Pedro",
        "district": "Centro"
    },
    {
        "id": "DRsz43FvhP3IVPvL6ZnN",
        "parich": "Nossa Senhora da Graça",
        "youtube_url": "",
        "address": [
            "Rua das Palmeiras",
            "Jardim América",
            "Viamão",
            "RS",
            "94480-000",
            1200
        ],
        "phone": "(51) 3481-5000",
        "email": "contato@nsgraça.com",
        "facebook_url": "https://www.facebook.com/IgrejaNSGraça/",
        "welcome_text": "Que a graça de Deus te acompanhe na Igreja Nossa Senhora da Graça!",
        "instagram_url": "https://www.instagram.com/igrejanossasenhoradagraca/",
        "image_path": "https://firebasestorage.googleapis.com/v0/b/minha-igreja-luterana-mobile.appspot.com/o/images%2Figreja_nsgraça.JPG?alt=media",
        "name": "Nossa Senhora da Graça",
        "district": "Jardim América"
    }
];
 */
// Inserir os dados no Firestore

/* PASTORES */
export async function filter_pastor(campo, clausula, valor) {
    // Referência à coleção
    const colecaoRef = collection(db, 'pastor');

    // Criação da query para filtrar os documentos com base no campo e valor
    const q = query(colecaoRef, where(campo, clausula, valor));

    try {
        // Executando a query e obtendo os documentos
        const querySnapshot = await getDocs(q);

        // Processando os resultados
        const documentosFiltrados = [];
        querySnapshot.forEach((doc) => {
            documentosFiltrados.push({ id: doc.id, ...doc.data() });
        });

        //console.log("Documentos filtrados:", documentosFiltrados);
        return documentosFiltrados;
    } catch (error) {
        console.error("Erro ao filtrar documentos: ", error);
    }
}