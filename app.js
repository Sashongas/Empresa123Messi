let usuarioActual = null;

async function cargarUsuarios() {
    const r = await fetch("data/usuarios.json");
    return await r.json();
}

document.getElementById("loginForm").addEventListener("submit", async e => {
    e.preventDefault();

    const user = document.getElementById("user").value;
    const pass = document.getElementById("pass").value;
    const loginMensaje = document.getElementById("loginMensaje");

    const usuarios = await cargarUsuarios();
    const encontrado = usuarios.find(u => u.usuario === user && u.password === pass);

    if (!encontrado) {
        loginMensaje.textContent = "Usuario o contraseña incorrectos.";
        loginMensaje.style.color = "red";
        return;
    }

    usuarioActual = encontrado;

    loginMensaje.textContent = "Inicio de sesión exitoso.";
    loginMensaje.style.color = "green";

    document.querySelector(".form-section").style.display = "block";
    document.querySelector(".reservas-section").style.display = "block";
    document.querySelector(".login-section").style.display = "none";
    document.getElementById("logoutBtn").style.display = "block";
});



document.getElementById("logoutBtn").addEventListener("click", () => {

    usuarioActual = null;

    document.querySelector(".form-section").style.display = "none";
    document.querySelector(".reservas-section").style.display = "none";
    document.querySelector(".login-section").style.display = "block";
    document.getElementById("logoutBtn").style.display = "none";

    document.getElementById("loginMensaje").textContent = "Sesión cerrada correctamente.";
    document.getElementById("loginMensaje").style.color = "black";
});


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
        li.textContent = `${r.sala} - ${r.fecha} ${r.hora} (por ${r.usuario})`;

  
        if (usuarioActual.rol === "admin") {
            const borrar = document.createElement("button");
            borrar.textContent = "Eliminar";
            borrar.style.marginLeft = "10px";

            borrar.onclick = () => {
                reservas = reservas.filter(x => x !== r);
                mostrarReservas();
            };

            li.appendChild(borrar);
        }

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
        hora: document.getElementById("hora").value,
        usuario: usuarioActual.usuario
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

// Inicializar
cargarSalas();
mostrarReservas();
