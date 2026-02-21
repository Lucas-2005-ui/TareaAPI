document.addEventListener('DOMContentLoaded', () => {
    // Referencias a los elementos del DOM
    const imageContainer = document.getElementById('image-container');
    const form = document.getElementById('guess-form');
    const input = document.getElementById('guess-input');
    const submitBtn = document.getElementById('submit-btn');
    const skipBtn = document.getElementById('skip-btn');
    const messageContainer = document.getElementById('message-container');
    const nextBtn = document.getElementById('next-btn');

    let currentPokemonName = '';
    let currentPokemonSprite = '';
    let currentPokemonTypes = [];
    let isGameOver = false;
    let caughtCount = 0;
    let failedAttempts = 0;

    // Utilidad para limpiar y normalizar textos (ignorar mayúsculas, guiones, etc.)
    const normalizeName = (name) => {
        return name.toLowerCase().replace(/[^a-z0-9]/g, '');
    };

    // Requisito Técnico: Función asíncrona que utilice fetch
    const fetchPokemon = async () => {
        try {
            // Reiniciar estado
            isGameOver = false;
            failedAttempts = 0;
            currentPokemonTypes = [];
            imageContainer.innerHTML = '<div class="loader" id="loader">Cargando...</div>';
            input.value = '';
            input.disabled = true;
            submitBtn.disabled = true;
            skipBtn.disabled = true;
            skipBtn.classList.remove('hidden');
            nextBtn.classList.add('hidden');
            messageContainer.className = 'message-container';
            messageContainer.textContent = '';

            // Requisito Técnico: id generado aleatoriamente entre 1 y 1025
            const randomId = Math.floor(Math.random() * 1025) + 1;

            // Requisito Técnico: llamar a la PokéAPI (https://pokeapi.co/api/v2/pokemon/{id})
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`);

            if (!response.ok) {
                throw new Error('No se pudo obtener el Pokémon');
            }

            const data = await response.json();

            // Guardamos el nombre para comprobar la victoria
            currentPokemonName = data.name;

            // Guardamos los tipos para la pista
            currentPokemonTypes = data.types.map(t => t.type.name);

            // Imagen del Artwork oficial o usar el sprite front_default para el panel principal
            const spriteUrl = data.sprites.other['official-artwork'].front_default || data.sprites.front_default;

            // Guardar un sprite en miniatura para el historial (Pixel art estilo clásico)
            currentPokemonSprite = data.sprites.front_default || spriteUrl;

            // Requisito Técnico: Inyectar la imagen dinámicamente en el HTML
            const imgElement = document.createElement('img');
            imgElement.src = spriteUrl;
            imgElement.alt = 'Pokémon misterioso';

            // Aplicar la clase .silueta según los requisitos técnicos
            imgElement.className = 'pokemon-img silueta';

            // Esperar a que la imagen cargue antes de mostrarla y activar el input
            imgElement.onload = () => {
                imageContainer.innerHTML = '';
                imageContainer.appendChild(imgElement);
                input.disabled = false;
                submitBtn.disabled = false;
                skipBtn.disabled = false;
                input.focus();
            };

        } catch (error) {
            console.error('Error:', error);
            imageContainer.innerHTML = '<div class="message-error" style="color:var(--error); font-weight:bold;">Error de conexión.</div>';
            nextBtn.classList.remove('hidden');
        }
    };

    // Muestra el mensaje en la interfaz
    const showMessage = (text, type) => {
        messageContainer.textContent = text;
        messageContainer.className = `message-container show message-${type}`;
    };

    // Lógica para manejar el formulario
    const handleGuess = (e) => {
        e.preventDefault();

        if (isGameOver) return;

        const guess = input.value.trim();
        if (!guess) return;

        const imgElement = document.querySelector('.pokemon-img');

        // Requisito Técnico: comprobar si el texto coincide ignorando mayúsculas y minúsculas
        if (normalizeName(guess) === normalizeName(currentPokemonName)) {
            // ¡Correcto!
            isGameOver = true;
            input.disabled = true;
            submitBtn.disabled = true;
            skipBtn.disabled = true;
            skipBtn.classList.add('hidden'); // Ocultar saltar al adivinar

            // Requisito Técnico: eliminar la clase .silueta para revelarlo
            if (imgElement) {
                imgElement.classList.remove('silueta');
                imgElement.classList.add('revealed'); // Añade animación de revelado
            }

            // Formatear nombre para mostrarlo bonito ("Pikachu" en vez de "pikachu")
            const displayName = currentPokemonName
                .split('-')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');

            // === LÓGICA DE HISTORIAL DINÁMICO ===
            addToHistory(displayName, currentPokemonSprite);

            // Requisito Técnico: mostrar mensaje de victoria
            showMessage(`¡Correcto! Es ${displayName}.`, 'success');

            // Mostrar botón de jugar de nuevo
            nextBtn.classList.remove('hidden');
            nextBtn.focus();
        } else {
            // Requisito Técnico: mostrar mensaje de error
            failedAttempts++;

            if (failedAttempts >= 2) {
                // Generar pista: Tres primeras letras del nombre
                const hintLetters = currentPokemonName.substring(0, 3).toUpperCase();
                showMessage(`¡Incorrecto! PISTA: Empieza por "${hintLetters}...".`, 'error');
            } else {
                showMessage('¡Incorrecto! Intenta de nuevo.', 'error');
            }

            // Animación de shake en el input para feedback visual
            input.style.transform = 'translateX(-8px)';
            setTimeout(() => input.style.transform = 'translateX(8px)', 50);
            setTimeout(() => input.style.transform = 'translateX(-8px)', 100);
            setTimeout(() => input.style.transform = 'translateX(8px)', 150);
            setTimeout(() => input.style.transform = 'translateX(0)', 200);

            // Seleccionar el texto para que el usuario pueda sobrescribirlo rápido
            input.select();
        }
    };

    // Helper para inyectar dinámicamente elementos al historial
    const addToHistory = (name, spriteUrl) => {
        const historyGrid = document.getElementById('history-grid');
        const emptyHistoryMsg = document.getElementById('empty-history');
        const catchCountSpan = document.getElementById('catch-count');

        // Quitar mensaje de "Vacío" la primera vez
        if (emptyHistoryMsg) {
            emptyHistoryMsg.remove();
        }

        // Incrementar el contador global
        caughtCount++;
        catchCountSpan.textContent = caughtCount;

        // Crear dinámicamente el contenedor del ítem
        const itemDiv = document.createElement('div');
        itemDiv.className = 'history-item';

        // Crear dinámicamente la imagen
        const img = document.createElement('img');
        img.src = spriteUrl;
        img.alt = name;

        // Crear dinámicamente el texto
        const nameSpan = document.createElement('span');
        nameSpan.textContent = name; // Usaremos el displayName formatado

        // Ensamblar nodo en el DOM
        itemDiv.appendChild(img);
        itemDiv.appendChild(nameSpan);

        // prepend para que el más nuevo esté arriba/primero
        historyGrid.insertBefore(itemDiv, historyGrid.firstChild);
    };

    // Lógica para saltar el Pokémon actual
    const handleSkip = () => {
        if (isGameOver) return;

        isGameOver = true;
        input.disabled = true;
        submitBtn.disabled = true;
        skipBtn.disabled = true;
        skipBtn.classList.add('hidden'); // Ocultar el botón una vez pulsado

        const imgElement = document.querySelector('.pokemon-img');

        // Revelarlo para que vean cuál era, pero sin animación grande
        if (imgElement) {
            imgElement.classList.remove('silueta');
            imgElement.style.filter = 'brightness(1) grayscale(0.8)'; // Lo mostramos en gris para indicar que se perdió
            imgElement.style.opacity = '0.7';
        }

        const displayName = currentPokemonName
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');

        // Mostrar mensaje informativo (no suma al historial)
        showMessage(`Era ${displayName}.`, 'error');

        // Mostrar botón de cargar otro (Jugar de nuevo)
        nextBtn.classList.remove('hidden');
        nextBtn.focus();
    };

    // Escuchar eventos
    form.addEventListener('submit', handleGuess);
    skipBtn.addEventListener('click', handleSkip);
    nextBtn.addEventListener('click', fetchPokemon);

    // Inicializar el juego
    fetchPokemon();
});
