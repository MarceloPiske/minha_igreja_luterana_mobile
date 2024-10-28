import { createAccountWithEmailPassword } from './firebase_user.js';

document.getElementById('signupForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Previne o envio do formulário

    const email = document.getElementById('email').value;
    const confirmEmail = document.getElementById('confirmEmail').value;
    const password = document.getElementById('password').value;
    const terms = document.getElementById('terms').checked;
    const errorMessage = document.getElementById('error-message');

    errorMessage.textContent = ''; // Limpa mensagem de erro

    // Verifica se os e-mails correspondem
    if (email !== confirmEmail) {
        errorMessage.textContent = 'Os e-mails não correspondem.';
        return;
    }

    // Verifica se a checkbox dos termos está marcada
    if (!terms) {
        errorMessage.textContent = 'Você deve aceitar os termos de compromisso.';
        return;
    }

    // Se todos os campos estiverem corretos, chama a função de criação de conta
    create_account_with_email_password(email, password);
});

function create_account_with_email_password(email, password) {
    // Simulação da função de criação de conta
    createAccountWithEmailPassword(email, password);
}
