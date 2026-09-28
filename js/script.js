document.addEventListener("DOMContentLoaded", () => {
  // 1. Navigation par onglets
  const navButtons = document.querySelectorAll(".nav-btn");
  const sections = document.querySelectorAll(".view-section");

  navButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetId = btn.getAttribute("data-target");

      navButtons.forEach((b) => b.classList.remove("active"));
      sections.forEach((s) => s.classList.remove("active"));

      btn.classList.add("active");
      document.getElementById(targetId).classList.add("active");
    });
  });

  // 2. Gestion de la sauvegarde du questionnaire
  const form = document.getElementById("checkin-form");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const entry = {
      id: Date.now(),
      date: new Date().toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      }),
      bio: {
        energy: document.getElementById("bio-energy").value,
        sensory: document.getElementById("bio-sensory").value,
        sleep: document.getElementById("bio-sleep").value,
      },
      psycho: {
        mood: document.getElementById("psycho-mood").value,
        executive: document.getElementById("psycho-executive").value,
        anxiety: document.getElementById("psycho-anxiety").value,
      },
      social: {
        battery: document.getElementById("social-battery").value,
        masking: document.getElementById("social-masking").value,
      },
    };

    saveEntry(entry);
    form.reset();
    renderDashboard();

    // Redirection automatique vers le dashboard après envoi
    document.querySelector('[data-target="section-dashboard"]').click();
  });

  function getStoredEntries() {
    return JSON.parse(localStorage.getItem("bps_tracker_entries") || "[]");
  }

  function saveEntry(entry) {
    const entries = getStoredEntries();
    entries.unshift(entry); // Ajouter au début
    localStorage.setItem("bps_tracker_entries", JSON.stringify(entries));
  }

  // 3. Rendu du Tableau de Bord
  function renderDashboard() {
    const entries = getStoredEntries();
    const latestStatusContainer = document.getElementById("latest-status");
    const historyList = document.getElementById("history-list");

    if (entries.length === 0) {
      latestStatusContainer.innerHTML =
        "<p>Aucune donnée enregistrée pour le moment.</p>";
      historyList.innerHTML = "<li>Rien à afficher.</li>";
      return;
    }

    // Affichage de la dernière entrée enregistrée
    const latest = entries[0];
    latestStatusContainer.innerHTML = `
      <p><strong>Dernier bilan :</strong> ${latest.date}</p>
      <ul style="margin-top: 0.5rem; list-style: square; padding-left: 1.2rem;">
        <li>Énergie physique : <strong>${latest.bio.energy}/5</strong></li>
        <li>Humeur : <strong>${latest.psycho.mood}/5</strong></li>
        <li>Batterie sociale : <strong>${latest.social.battery}/5</strong></li>
      </ul>
    `;

    // Liste d'historique
    historyList.innerHTML = entries
      .slice(0, 5)
      .map(
        (e) => `
      <li>
        <span>${e.date}</span>
        <span>Énergie: ${e.bio.energy}/5 | Humeur: ${e.psycho.mood}/5</span>
      </li>
    `,
      )
      .join("");
  }

  // Initialisation au chargement
  renderDashboard();
});
