
const localText = document.getElementById("status-local");

var latitude = 0;
var longitude = 0;


document.getElementById('formulario_denuncia').addEventListener('submit', function(event) {
    event.preventDefault(); // Impede o envio padrão

    const formData = new FormData(this); 
    
    const imagemData = formData.get("imagem");
    const descricaoData = formData.get("descricao");
    formData.append('Latitude', latitude);
    formData.append('Longitude', longitude);
    
    if(!imagemData.type.includes("image")){
      alert("formato da imagem incorreto!");
      return null;
    }

    if(latitude == 0 && longitude == 0){
      alert("informe a localização da ocorrência!");
      return null;
    }

    console.log(formData.get("Tipo_Denuncia"));
  
    fetch('https://reporta-colombo-back.onrender.com/Adicionar-Denuncia', {
      method: 'POST',
      body: formData // Não precisa definir Content-Type, o navegador faz isso
    })
  .then(response => response.json())
  .then(data => console.log(data));
});

function RegistrarLocalizacao(){
    

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) =>{
            latitude = position.coords.latitude;
            longitude = position.coords.longitude;
            const accuracy = position.coords.accuracy;

            localText.innerHTML = `<iframe id='localIframe' src='https://maps.google.com/maps?q=${latitude},${longitude}&output=embed' allowfullscreen='' loading='lazy' referrerpolicy='no-referrer-when-downgrade'></iframe>`;
        }, showErrorLocal, { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 });
    
        
    } else {
        localText.innerText = "Geolocation não é suportado pelo navegador.";
    }
}

function showErrorLocal(error) {
  switch(error.code) {
    case error.PERMISSION_DENIED:
      localText.innerText = "Permissão para pegar localização foi negada."
      break;
    case error.POSITION_UNAVAILABLE:
      localText.innerText = "Informação da localização não disponível."
      break;
    case error.TIMEOUT:
      localText.innerText = "A procura da localização esgotou o tempo."
      break;
    case error.UNKNOWN_ERROR:
      localText.innerText = "Um erro ocorreu ao buscar a localização."
      break;
  }
}

