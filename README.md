# Práctica Consumo de APIs: ¿Quién es ese Pokémon?

*Opción B de la rúbrica*

## Introducción

Para esta práctica de Entorno Cliente he creado un minijuego inspirado en el clásico "¡¿Quién es ese Pokémon?!", donde hay que adivinar el nombre del Pokémon oculto basándose únicamente en su silueta. 

Como en el ciclo hasta ahora nos hemos centrado principalmente en la maquetación web y justo acabamos de descubrir qué es y para qué sirve una API, este proyecto ha sido la oportunidad perfecta para aplicar mis conocimientos de interfaces y apoyarme en la Inteligencia Artificial para desarrollar la parte de la lógica de programación y el consumo de datos, ya que aún no hemos dado JavaScript a este nivel.

## Estructura de archivos y Diseño (HTML y CSS)

He puesto bastante cariño en que el proyecto sea limpio, semántico y visualmente atractivo. Toda la base visual la he estructurado de la siguiente forma:

- **`index.html`**: Aquí he montado el esqueleto. He intentado usar etiquetas semánticas de HTML5 para darle un buen sentido; por ejemplo, he envuelto la zona central interactiva del juego en la etiqueta `<main>` y he usado un `<aside>` para colocar una barra lateral donde se va guardando el historial de los Pokémon capturados.
- **`style.css`**: Para maquetarlo he usado bastante CSS Grid y Flexbox; me pareció la herramienta ideal para estructurar la aplicación a dos columnas de forma fluida y *responsive*. Además, he usado variables de CSS en el selector `:root` para centralizar mi paleta de colores y variables globales, haciendo el código mucho más mantenible.

Un detalle del que estoy bastante orgulloso es cómo he resuelto la mecánica visual del "Pokémon misterioso" sin necesidad de editar imágenes. Simplemente he creado una clase de CSS llamada `.silueta` con la propiedad `filter: brightness(0);`. Al aplicársela a la imagen que viene de la API, se pinta de negro puro. Cuando el usuario acierta, JavaScript le retira la clase y se aplica una animación keyframe que restaura los colores naturales.

## Integración con la API y uso de Inteligencia Artificial (JavaScript)

Dado que todavía no sabemos programar peticiones asíncronas ni manipular el DOM avanzado por nuestra cuenta, he utilizado herramientas de Inteligencia Artificial como un "compañero de programación" para que redactara el contenido de **`script.js`**. En vez de copiar código sin más, el reto ha sido saber *cómo* pedirle a la IA exactamente lo que necesitaba.

Este ha sido mi flujo de *prompting* y peticiones a la IA:

1. **Definir reglas y restricciones**: Le pedí que actuara como un desarrollador web experto y que utilizara únicamente Vanilla JS (sin React ni otras librerías) para encajar con lo que se pide en el grado.
2. **Definir la conexión a la PokéAPI**: Le expliqué la lógica secuencial que yo tenía en mente:
   - Que generase internamente un número al azar del 1 al 1025.
   - Que utilizase `fetch` apuntando al endpoint interactivo: `https://pokeapi.co/api/v2/pokemon/{id}`.
   - Que, al recibir el JSON, sacase de él el nombre del Pokémon y la URL de su imagen.
3. **Manejo del DOM e interacciones**: Le di instrucciones claras sobre cómo poner esos datos en los contenedores de mi HTML. Le pedí que conectara mi formulario para que, al enviarlo, comparara el nombre escrito por el usuario con el nombre devuelto por la API (haciendo que ignorase mayúsculas y minúsculas).
4. **Mejoras iterativas (Características extra)**: Una vez que el juego base funcionaba, volví a hablar con la IA para implementar mejoras más complejas:
   - Le pedí que añadiera lógica para crear pequeñas miniaturas de los Pokémon adivinados y los fuese poniendo dinámicamente como historial en mi elemento `<aside>`.
   - Le pedí que añadiese un botón secundario llamado "No lo sé (Saltar)" para omitir ese Pokémon cargando uno nuevo, pero sin que se perdiera la puntuación del historial.
   - Finalmente, implementamos un sistema de pistas. Le pedí que llevara un contador interno de fallos y que, si el usuario fallaba 2 veces seguidas, el `script.js` extrajese las primeras tres letras del nombre (como por ejemplo `"pik..."`) usando métodos de cadena de texto, para dárselas como ayuda al jugador sin revelar toda la respuesta.

Ha sido una práctica genial para ver de primera mano cómo el HTML y el CSS que hemos dado cobran vida usando JavaScript y cómo una API real proporciona los datos.
