
const localText = document.getElementById("status-local");

var latitude = 0;
var longitude = 0;


document.getElementById('formulario_denuncia').addEventListener('submit', async function(event) {
    event.preventDefault(); 

    const btnSubmit = document.getElementById('btn-submit');

    btnSubmit.disabled = true; 
    btnSubmit.innerText = "Enviando denúncia...";
    btnSubmit.style.opacity = "0.7";
    btnSubmit.style.cursor = "not-allowed";

    const formData = new FormData(this); 
    
    var imagemData = formData.get("imagem");
    const descricaoData = formData.get("descricao");
    formData.append('Latitude', latitude);
    formData.append('Longitude', longitude);
    
    if(!imagemData.type.includes("image")){
      alert("formato da imagem incorreto!");
      return null;
    }
    
    imagemData = await redimensionarImagem(imagemData);

    if(latitude == 0 && longitude == 0){
      alert("informe a localização da ocorrência!");
      return null;
    }
  
    try{
      const response = fetch('https://reporta-colombo-back.onrender.com/Adicionar-Denuncia', {
        method: 'POST',
        body: formData 
      })

      if(response.ok){
        mostrarFeedbackSucesso()
      }else{
        const erroData = await response.json().catch(() => ({})); 
        const mensagem = erroData.message || "Verifique os dados e tente novamente.";
        
        mostrarErro(mensagem);
      }
    }catch(error){
      mostrarErro("Não foi possível conectar ao servidor. Tente mais tarde.");
    }

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

async function redimensionarImagem(arquivo, larguraMaxima = 1024) {
    return new Promise((resolve, reject) => {
        const leitor = new FileReader();
        leitor.readAsDataURL(arquivo);

        leitor.onload = (evento) => {
            const img = new Image();
            img.src = evento.target.result;

            img.onload = () => {
                const canvas = document.createElement('canvas');
                let largura = img.width;
                let altura = img.height;

                // Calcula a proporção para não distorcer
                if (largura > larguraMaxima) {
                    altura *= larguraMaxima / largura;
                    largura = larguraMaxima;
                }

                canvas.width = largura;
                canvas.height = altura;

                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, largura, altura);

                // Exporta como JPEG com 70% de qualidade (ótimo equilíbrio)
                canvas.toBlob((blob) => {
                    resolve(blob);
                }, 'image/jpeg', 0.7);
            };
        };

        leitor.onerror = (erro) => reject(erro);
    });
}

function mostrarFeedbackSucesso() {
    const toast = document.getElementById("toast");
    toast.className = "toast show";
    
    setTimeout(() => { 
        toast.className = toast.className.replace("show", ""); 
        window.location.href = "index.html"; 
    }, 3000);
}

function mostrarErro(mensagem) {
    const toast = document.getElementById("toast");
    const btnSubmit = document.getElementById('btn-submit');

    toast.innerText = `⚠️ ${mensagem}`;
    toast.style.backgroundColor = "#e74c3c";
    toast.classList.add("show");

    btnSubmit.disabled = false;
    btnSubmit.innerText = "Tentar Novamente";
    btnSubmit.style.opacity = "1";

    setTimeout(() => {
        toast.classList.remove("show");
    }, 4000);
}