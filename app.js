// Simulación de base de datos
let reservas = [];

async function cargarSalas() {
    const response = await fetch("data/salas.json");
    const salas = await response.json();

    const select = document.getElementById("sala");

    salas.forEach(sala => {
        const option = document.createElement("option");
        option.value = sala.nombre;
        option.textContent = `${sala.nombre} - Cap: ${sala.capacidad}`;
        select.appendChild(option);
    });
}

function mostrarReservas() {
    const lista = document.getElementById("listaReservas");
    lista.innerHTML = "";

    reservas.forEach(r => {
        const li = document.createElement("li");
        li.textContent = `${r.sala} - ${r.fecha} ${r.hora}`;
        lista.appendChild(li);
    });
}

function validarReserva(nueva) {
    return !reservas.some(r =>
        r.sala === nueva.sala &&
        r.fecha === nueva.fecha &&
        r.hora === nueva.hora
    );
}

document.getElementById("reservaForm").addEventListener("submit", e => {
    e.preventDefault();

    const reserva = {
        sala: document.getElementById("sala").value,
        fecha: document.getElementById("fecha").value,
        hora: document.getElementById("hora").value
    };

    const mensaje = document.getElementById("mensaje");

    if (!validarReserva(reserva)) {
        mensaje.textContent = "⚠️ La sala ya está reservada en ese horario.";
        mensaje.style.color = "red";
        return;
    }

    reservas.push(reserva);
    mensaje.textContent = "✔ Reserva creada con éxito.";
    mensaje.style.color = "green";

    mostrarReservas();
});

// Inicializa
cargarSalas();
mostrarReservas();
