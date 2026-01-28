async function chargerStatsPromo() {
    try {
        const response = await fetch('db/stats.json');
        const data = await response.json();

        const positionRelative = (data.rang / data.total_promo) * 100;

        let tierName = "";
        let tierIcon = "";
        if (data.rang <= 3) { tierName = "CHALLENGER"; tierIcon = "challenger.png"; }
        else if (data.rang <= 5) { tierName = "GRANDMASTER"; tierIcon = "grandmaster.png"; }
        else if (data.rang <= 10) { tierName = "MASTER"; tierIcon = "master.png"; }
        else if (data.rang <= 25) { tierName = "DIAMANT"; tierIcon = "diamond.png"; }
        else { tierName = "PLATINE"; tierIcon = "platinum.png"; }

        const statsContainer = document.querySelector('.hero-stats');
        const lolTierIcon = `${data.lol_rank.tier.toLowerCase()}.png`;

        const rankHTML = `
            <div class="ranks-wrapper">
                
                <div class="iut-rank-container" style="position: relative; cursor: help;">
                    <div class="stat-item rank-display iut-rank">
                        <img src="img/${tierIcon}" alt="${tierName}" class="rank-icon" style="width: 75px; height: auto; filter: drop-shadow(0 0 8px var(--hex-gold));">
                        <div class="rank-info">
                            <span class="hc-text-gold rank-label" style="display: block; font-size: 0.8rem; letter-spacing: 2px; font-weight: bold;">RANG IUT</span>
                            <span class="hc-text-blue rank-tier" style="font-family: 'Beaufort', serif; font-size: 1.8rem; line-height: 1;">${tierName}</span>
                        </div>
                    </div>

                    <div class="rank-tooltip">
                        <div class="tooltip-header">HIÉRARCHIE ACADÉMIQUE</div>
                        <div class="tooltip-content">
                            <p class="hc-text-gold tooltip-title" style="font-size: 0.9rem; margin-bottom: 10px; font-family: 'Beaufort', serif;">SYSTÈME DE CLASSEMENT :</p>
                            <ul style="list-style: none; padding: 0; margin: 0; font-size: 0.8rem; line-height: 1.6;" class="hc-text-blue">
                                <li><b style="color: var(--hex-gold)">CHALLENGER :</b> Top 3 de la promotion</li>
                                <li><b style="color: var(--hex-gold)">GRANDMASTER :</b> Top 5</li>
                                <li><b style="color: var(--hex-gold)">MASTER :</b> Top 10</li>
                                <li><b style="color: var(--hex-gold)">DIAMANT :</b> Top 25</li>
                                <li><b style="color: var(--hex-gold)">PLATINE :</b> Reste de la promotion</li>
                            </ul>
                            <hr class="tooltip-divider" style="border: 0; border-top: 1px solid rgba(196,176,123, 0.2); margin: 15px 0;">
                            <div class="tooltip-footer" style="font-size: 0.7rem; color: #a0a0a0; text-align: center;">
                                Basé sur les résultats du Semestre actuel
                            </div>
                        </div>
                    </div>
                </div>

                <div class="lol-rank-container">
                    <a href="https://mobalytics.gg/lol/profile/euw/gooning2gothmomy-botom/overview" target="_blank" class="lol-rank-link stat-item rank-display">
                        <img src="img/${lolTierIcon}" alt="LoL Rank" class="rank-icon lol-icon">
                        <div class="rank-info">
                            <span class="hc-text-gold rank-label">RANG SOLOQ</span>
                            <span class="hc-text-blue rank-tier">
                                ${data.lol_rank.tier} ${data.lol_rank.rank}
                                <span class="lp-text">
                                    ${data.lol_rank.lp} LP
                                </span>
                            </span>
                        </div>
                    </a>

                    <div class="rank-tooltip">
                        <div class="tooltip-header">ARCHIVES DE COMBAT</div>
                        <div class="tooltip-content">
                            <p class="hc-text-gold tooltip-title">COMPÉTENCES ACQUISES :</p>
                            <p class="hc-text-blue tooltip-desc">
                                "La SoloQ forge une forte résilience face au stress et une capacité d'analyse rapide en environnement complexe. 
                                Elle développe également la communication stratégique et la coopération d'équipe pour atteindre des objectifs communs."
                            </p>
                            <hr class="tooltip-divider">
                            <div class="tooltip-footer">
                                Niveau d'Honneur : 5 | Esprit d'Équipe : Excellent
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="stats-details">
                <div class="stat-item">
                    <span class="hc-text-gold stat-label">POSITION :</span> 
                    <span class="hc-text-blue stat-value">#${data.rang} / ${data.total_promo} (TOP ${Math.round(positionRelative)}%)</span>
                </div>
                <div class="stat-item">
                    <span class="hc-text-gold stat-label">MOYENNE :</span> 
                    <span class="hc-text-blue stat-value stat-moyenne">${data.moyenne} / 20</span>
                </div>
                <div class="stat-item stat-sync">
                    Dernière synchronisation : ${data.derniere_maj}
                </div>
            </div>
        `;

        statsContainer.innerHTML = rankHTML;

        const lolRankContainer = document.querySelector('.lol-rank-container');
        const rankLink = lolRankContainer.querySelector('.lol-rank-link');
        
        const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

        if (isTouchDevice) {
            let tooltipVisible = false;

            rankLink.addEventListener('click', function(e) {
                if (!tooltipVisible) {
                    e.preventDefault();
                    lolRankContainer.classList.add('tooltip-visible');
                    tooltipVisible = true;

                    setTimeout(() => {
                        document.addEventListener('click', function hideTooltip(event) {
                            if (!lolRankContainer.contains(event.target)) {
                                lolRankContainer.classList.remove('tooltip-visible');
                                tooltipVisible = false;
                                document.removeEventListener('click', hideTooltip);
                            }
                        });
                    }, 100);
                }
            });
        }

    } catch (error) {
        console.error("Erreur lors de la récupération des stats", error);
    }
}

chargerStatsPromo();