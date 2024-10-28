import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-storage.js";

import { init_app } from "./init_firebase_app_8.js";

const app = init_app()
const storage = getStorage(app);
// Função para fazer o upload da imagem
export async function upload_image(file) {

    if (!file) {
        alert('Por favor, selecione uma imagem.');
        return;
    }

    // Criar uma referência ao caminho do arquivo no Firebase Storage
    const user_id = JSON.parse(localStorage.getItem('user')).uid
    const storageRef = ref(storage, 'images/' + user_id + '.png');

    try {
        // Fazer o upload do arquivo
        const snapshot = await uploadBytes(storageRef, file);
        //console.log('Upload concluído:', snapshot);

        // Obtém a URL de download do arquivo
        const downloadURL = await getDownloadURL(snapshot.ref);
        //console.log('URL de download:', downloadURL);

        return downloadURL

    } catch (error) {
        console.error('Erro ao fazer upload da imagem:', error);
    }
}
