document.addEventListener("DOMContentLoaded", function () {
    const searchBar = document.getElementById("search-bar");
    const searchBtn = document.getElementById("search-btn");
    const cardsContainer = document.getElementById("certifications-list");
    
    const apiUrl = "http://localhost:3000/certificacoes";

    const popupPanel = document.getElementById("popup-panel");
    const closePanelBtn = document.getElementById("close-panel");
    const areaFilter = document.getElementById("area-filter");

    let certifications = [];
    let areas = new Set();

    // Puxando as certificações da API
    async function fetchCertifications() {
        try {
            const response = await fetch(apiUrl);


            if (!response.ok) {
                console.error("Erro ao buscar dados da API:", response.status);
                return;
            }

            const data = await response.json();
            
            // Verificando os dados recebidos e analisa se não estão vazios 
            if (Array.isArray(data) && data.length) {
                certifications = data.sort((a, b) => a.name.localeCompare(b.name));
                areas = new Set(certifications.map(cert => cert.area));
                populateAreaFilter(); 
                renderCards(certifications);
            } else {
                console.warn("Nenhuma certificação foi retornada pela API.");
            }
        } catch (error) {
            console.error("Erro ao buscar dados da API:", error);
        }
    }

    // Preenchendo o filtro de áreas
    function populateAreaFilter() {
        areaFilter.innerHTML = '<option value="all">Todas as Áreas</option>';
        areas.forEach(area => {
            const option = document.createElement("option");
            option.value = area;
            option.textContent = area;
            areaFilter.appendChild(option);
        });
    }

    // Criação dos cards na página
    function renderCards(filteredCertifications) {
        cardsContainer.innerHTML = "";
        filteredCertifications.forEach(cert => {
            const card = document.createElement("div");
            card.classList.add("card");
            card.innerHTML = `
                <img src="${cert.logo || 'imagens/default-logo.png'}" alt="${cert.provider}" class="card-logo"/>
                <h3>${cert.name}</h3>
                <p><strong>Área:</strong> ${cert.area || 'N/A'}</p>
                <p>${cert.description || 'Descrição não disponível'}</p>
                <button class="details-btn">Ver Mais</button>
            `;
            cardsContainer.appendChild(card);
            
            card.querySelector(".details-btn").addEventListener("click", () => showDetails(cert.id));
        });
    }

    // Exibição dos detalhes das certificações em popup
    window.showDetails = function (id) {
        const cert = certifications.find(c => c.id === id);
        if (!cert) {
            alert("Certificação não encontrada.");
            return;
        }

        document.getElementById("popup-title").textContent = cert.name;
        document.getElementById("popup-provider").textContent = cert.provider || 'N/A';
        document.getElementById("popup-nivel").textContent = cert.nivel || 'N/A';
        document.getElementById("popup-area").textContent = cert.area || 'N/A';
        document.getElementById("popup-description").textContent = cert.description || 'N/A';
        document.getElementById("popup-requirements").textContent = cert.requirements || 'N/A';
        document.getElementById("popup-cost").textContent = cert.cost || 'N/A';
        document.getElementById("popup-exam-info").textContent = cert.exam_info || 'N/A';
        document.getElementById("popup-material").textContent = cert.material || 'N/A';
        document.getElementById("popup-link").textContent = cert.link || 'N/A';

        popupPanel.classList.add("open");
    };

    closePanelBtn.addEventListener("click", function () {
        popupPanel.classList.remove("open");
    });

    // Filtrando as certificações digitando na barra de pesquisa
    searchBar.addEventListener("input", function () {
        filterAndRender();  // Chama a função de filtro e renderização
    });

    // Filtrando as certificações pela seleção de filtro de área
    areaFilter.addEventListener("change", function () {
        filterAndRender();
    });

    // Filtragem das certificações na pesquisa e no filtro de área selecionado
    function filterAndRender() {
        const query = searchBar.value.toLowerCase();
        const selectedArea = areaFilter.value; 

        // Analise dos filtro com base na pesquisa e na área
        const filteredCertifications = certifications.filter(cert => {
            const matchesSearch = cert.name.toLowerCase().includes(query);
            const matchesArea = selectedArea === "all" || cert.area === selectedArea;
            return matchesSearch && matchesArea;
        });

        renderCards(filteredCertifications);
    }

    fetchCertifications();
});
