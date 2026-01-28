let mesProjets = [];

async function chargerProjets() {
    try {
        const response = await fetch('db/projets.json');
        mesProjets = await response.json();
        const container = document.getElementById('liste-projets');

        container.innerHTML = mesProjets.map((p, index) => `
            <div class="project-card" onclick="openModal(${index})">
                <div class="image-wrapper">
                    <img src="img/${p.image}" alt="${p.titre}" class="project-image">
                </div>
                
                <div class="view-button">
                    <div class="lock-diamond">
                        <img src="img/lock.png" class="lock-img" alt="Débloquer">
                    </div>
                </div> 

                <div class="project-info">
                    <h3 class="project-title">${p.titre}</h3>
                    <div class="project-footer">
                        <img src="img/rp.png" class="rp-icon" alt="RP">
                        <span class="year-text">${p.annee}</span>
                    </div>
                </div>
            </div>
        `).join('');

    } catch (error) {
        console.error("Erreur de chargement :", error);
        document.getElementById('liste-projets').innerHTML = "<p class='hc-text-blue'>Erreur lors du chargement des cristaux de données.</p>";
    }
}

function openModal(index) {
    const p = mesProjets[index];
    const modal = document.getElementById('project-modal');
    const modalContent = modal.querySelector('.modal-content');
    
    document.getElementById('modal-image').src = `img/${p.image}`;
    document.getElementById('modal-title').innerText = p.titre;
    document.getElementById('modal-description').innerText = p.description;
    document.getElementById('modal-year').innerText = p.annee;

    const actionsContainer = document.getElementById('modal-actions');
    actionsContainer.innerHTML = "";

    const btn1 = document.createElement('a');
    btn1.href = p.lien;
    btn1.target = "_blank";
    btn1.className = "button is-secondary is-tiny";
    btn1.style.textDecoration = "none";
    btn1.innerText = "VOIR LE GITHUB";
    actionsContainer.appendChild(btn1);

    if (p.lien2) {
        const btn2 = document.createElement('a');
        btn2.href = p.lien2;
        btn2.target = "_self";
        btn2.className = "button is-primary is-tiny";
        btn2.style.textDecoration = "none";
        btn2.innerText = "EN VOIR PLUS...";
        actionsContainer.appendChild(btn2);
    }

    const techContainer = document.getElementById('modal-technos');
    techContainer.innerHTML = p.technos.map(t => `<span class="hc-text-gold" style="border:1px solid var(--hex-gold); padding:2px 5px; font-size:0.7rem; margin:2px;">${t}</span>`).join('');
    
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden'; 
    modalContent.classList.add('animated-border');
}

function closeModal() {
    const modal = document.getElementById('project-modal');
    const modalContent = modal.querySelector('.modal-content');

    modalContent.classList.remove('animated-border');

    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

chargerProjets();