const $fecha = document.querySelector('input[type="date"]');
const $base = document.querySelector('select');

class Moneda {
    constructor(base = 'EUR', fecha = 'latest') {
        this.base = base;
        this.fecha = fecha;
    }

    async obtenerCambios() {
        const endpoint = `https://api.exchangeratesapi.io/${this.fecha}?base=${this.base}`;
        const respuesta = await fetch(endpoint).catch(err => { throw new Error(err); });
        const cambios = await respuesta.json();
        return cambios;
    }
}

class Listado {
    constructor(cambios) {
        this.cambios = cambios.rates;
        this.base = cambios.base;
        this.date = cambios.date;
    }

    listarConversiones() {
        const monedas = Object.entries(this.cambios);
        const $listadoConversiones = document.querySelector('ul');
        const $descripcion = document.querySelector('#descripcion');
        $listadoConversiones.innerHTML = '';
        $descripcion.textContent = `Listando conversiones del ${this.date} con base ${this.base}:`
        monedas.forEach(valor => {
            const conversion = document.createElement('option');
            conversion.textContent = `${valor[0]}: ${valor[1]}`;
            $listadoConversiones.appendChild(conversion);
        });
    }

    listarBasesDeCambio() {
        const monedas = Object.keys(this.cambios);
        const listadoBasesDeCambio = document.querySelector('#seleccionar');
        monedas.forEach(valor => {
            const option = document.createElement('option');
            option.textContent = valor;
            listadoBasesDeCambio.appendChild(option);
        });
    }
}

inicializar();

$fecha.addEventListener('change', () => {
        const baseSeleccionada = $base.value;
        if (baseSeleccionada !== 'Seleccione una base' ? actualizar() :
            console.warn('Aún no se eligió una base'));
});

$base.addEventListener('change', () => {
    actualizar();
});

async function inicializar() {
    const moneda = new Moneda();
    const listado = new Listado(await moneda.obtenerCambios());
    $fecha.removeAttribute('disabled');
    $base.removeAttribute('disabled');
    $fecha.value = listado.date;
    const $baseCambio = document.querySelectorAll('option')[1];
    $baseCambio.textContent = listado.base;

    listado.listarBasesDeCambio();
}

async function actualizar() {
    const $descripcion = document.querySelector('#descripcion');
    const $ul = document.querySelector('ul');
    $descripcion.textContent = 'Cargando...';
    $ul.innerHTML = '';
    let fecha;
    fecha = ($fecha.value === '' ? 'latest' : $fecha.value );
    const moneda = new Moneda($base.value, fecha);
    const listado = new Listado(await moneda.obtenerCambios());
    listado.listarConversiones();
}
