(function() {
    emailjs.init("E-8ZNwtXVxRviFUiw");
})();

async function loadFooter() {
    try {
        const response = await fetch('partials/footer.html');
        const content = await response.text();
        document.body.insertAdjacentHTML('beforeend', content);
    } catch (error) {
        console.error("Impossible de charger le footer:", error);
    }
}

function viderChamps() {
    document.getElementById('contact-name').value = '';
    document.getElementById('contact-msg').value = '';
    document.getElementById('contact-email').value = '';
}

function envoyerMessage(btn) {
    const data = {
        from_name: document.getElementById('contact-name').value,
        reply_to: document.getElementById('contact-email').value,
        message: document.getElementById('contact-msg').value
    };

    if (!data.from_name || !data.reply_to || !data.message) {
        alert("Cristaux de données manquants !");
        return;
    }

    const originalText = btn.innerText;
    btn.innerText = "ENVOI...";
    btn.disabled = true;
    
    emailjs.send('service_s39j1ld', 'template_7nsm0yk', data)
        .then(() => {
            alert("Message transmis !");
            viderChamps();
        })
        .catch((err) => {
            alert("Échec de l'envoi.");
            console.error(err);
        })
        .finally(() => { 
            btn.innerText = originalText; 
            btn.disabled = false;
        });
}

loadFooter();