let map;

const tipoDenuncias = ["Esgoto", "Queimada", "PoluicaoRio", "FocoDengue", "Desmatamento", "LixoEntulho"]

async function initMap() {
    const { Map } = await google.maps.importLibrary("maps");
    const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary("marker");

    const centro = { lat: -25.3611, lng: -49.1822 }; 
    map = new Map(document.getElementById("map"), {
        zoom: 12,
        center: centro,
        mapId: "ef924b5f828bd2229ec9b1d3 ",
    });

    carregarDenunciasNoMapa(AdvancedMarkerElement, PinElement);
}

async function carregarDenunciasNoMapa(AdvancedMarkerElement, PinElement) {
    const response = await fetch(API_URL+'Buscar-Denuncias-Filtrado', {
      method: 'POST',
      headers: {
      'Content-Type': 'application/json' 
        },
      body: JSON.stringify({ QuantPorPagina: 100 }),
    })
    const denuncias = await response.json();

    denuncias.forEach(denuncia => {
        const pinCustomizado = new PinElement({
            background: definirIcone(tipoDenuncias[denuncia.tipo_Denuncia - 1]),
            borderColor: "#ffffff",
            glyphColor: "#ffffff",
        });

        const marker = new AdvancedMarkerElement({
            map: map,
            position: { lat: denuncia.latitude, lng: denuncia.longitude },
            title: denuncia.des_Denuncia,
            content: pinCustomizado.element,
        });
        
        const infoWindow = new google.maps.InfoWindow({
            content: `
                <div style="color: #2c3e50; padding: 5px;">
                    <strong style="color: ${definirIcone(tipoDenuncias[denuncia.tipo_Denuncia - 1])}">${tipoDenuncias[denuncia.tipo_Denuncia - 1]}</strong><br>
                    <p style="margin: 5px 0;">${denuncia.des_Denuncia}</p>
                    <img src="${denuncia.url_Imagem}" style="width:100%; border-radius:5px;"><br>
                    <small>Relatado em: ${new Date(denuncia.dta_Cadastro).toLocaleString()}</small>
                </div>
            `
        });

        marker.addListener("click", () => {
            infoWindow.open(map, marker);
        });
    });
}

function definirIcone(categoria) {
    switch (categoria) {
        case 'Esgoto': return "#9b59b6";
        case 'Queimada': return "#e67e22";
        case 'PoluicaoRio': return "#3498db";
        case 'FocoDengue': return "#e74c3c";
        case 'Desmatamento': return "#2ecc71";
        case 'LixoEntulho': return "#f1c40f";
        default: return "#7f8c8d";
    }
}

window.addEventListener('scroll', () => {
    const authSection = document.querySelector('.auth-buttons');
    const header = document.querySelector('.main-header');

    if (window.scrollY > 50) {
        authSection.classList.add('hidden-scroll');
        header.classList.add('scrolled'); 
    } else {
        authSection.classList.remove('hidden-scroll');
        header.classList.remove('scrolled');
    }
});