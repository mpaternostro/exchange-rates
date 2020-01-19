const $fecha = document.querySelector('input[type="date"]');
const $base = document.querySelector('select');

inicializar();

let timeoutID;
$fecha.addEventListener('change', () => {
    clearTimeout(timeoutID);
    timeoutID = setTimeout(() => {
        const baseSeleccionada = $base.value;
        const fechaSeleccionada = $fecha.value;
        if (baseSeleccionada !== 'Seleccione una base' ? actualizar(baseSeleccionada, fechaSeleccionada) :
            console.warn('Aún no se eligió una base'));
    }, 750);
});

$base.addEventListener('change', () => {
    const baseSeleccionada = $base.value;
    const fechaSeleccionada = $fecha.value;
    actualizar(baseSeleccionada, fechaSeleccionada);
});

function inicializar() {
    fetch(`https://api.exchangeratesapi.io/latest`)
        .then(respuesta => respuesta.json())
        .then(respuestaJSON => {
            $fecha.value = respuestaJSON.date;
            const $base_cambio = document.querySelectorAll('option')[1];
            $base_cambio.textContent = respuestaJSON.base;
            listarBasesDeCambio(respuestaJSON.rates);
        })
        .catch(error => console.error("LA INICIALIZACION FALLÓ", error));
}

function listarBasesDeCambio(objetoRates) {
    const monedas = Object.keys(objetoRates);
    const listadoBasesDeCambio = document.querySelector('select');
    monedas.forEach(valor => {
        const option = document.createElement('option');
        option.textContent = valor;
        listadoBasesDeCambio.appendChild(option);
    });
}

function listarConversiones(objetoRates) {
    const rates = Object.entries(objetoRates);
    const listadoConversiones = document.querySelector('ul');
    rates.forEach(valor => {
        const conversion = document.createElement('option');
        conversion.textContent = `${valor[0]}: ${valor[1]}`;
        listadoConversiones.appendChild(conversion);
    });
}

function actualizar(base, fecha) {
    fetch(`https://api.exchangeratesapi.io/${fecha}?base=${base}`)
        .then(respuesta => respuesta.json())
        .then(respuestaJSON => {
            const $conversiones = document.querySelector('ul');
            $conversiones.textContent = `Listando conversiones del día ${respuestaJSON.date} 
                para la base de cambio ${respuestaJSON.base}:`;
            listarConversiones(respuestaJSON.rates);
        })
        .catch(error => console.error("LA ACTUALIZACIÓN FALLÓ", error));
}