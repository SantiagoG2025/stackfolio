# Stackfolio
Es una aplicación  que tiene como objetivo central  indicar a los desarrolladores de SW: quién eres, qué haces y hacia dónde quieres dirigir tu carrera para captar la atención de reclutadores o clientes en pocos segundos.
Para poder laburar con git vamos a usar los siguientes comandos:
Abran en su compu el VSCode, si quieren antes creen una carpeta así saben en donde van a guardar nuestro proyecto.
Una vez en el VSCode van a abrir la terminal y van a poner:
1-git clone "https://github.com/SantiagoG2025/stackfolio.git"
Este lo que hace es crear una copia local en su compu del proyecto que está subido en el github.

2-cd Stackfolio
Los va a posicionar en la carpeta del pryecto y desde esta comenzamos a laburar.

3-git checkout main
git pull origin main
Lo que van a hacer acá es descargar los últimos cambios de main.

4-git checkout -b nombre-de-rama
Este comando va a crear una rama en la que van a trabajar ustedes de manera independiente. Desde este momento recién a codificar
Recuerden siempre estar en su rama de trabajo y no en la main.

5-git status
Sirve para verificar los cambios.

6-git diff 
Este es para consultar la diferencia hechas en los archivos.

7-git add . 
En este comando van a subir todos los cambios al área de preparación.

8-git commit -m "Descripción del cambio".
Acá van a subir un comentario de lo que hicieron

9-git push -u origin nombre-de-la-rama
Acá van a subir los cambios en el repositorio remoto pero desde su rama.

10-Luego van a ingresar en al repositorio en github y van a crear una Pull Request desde su rama hacia main
Van a revisar y luego van a integrar el pull request en el main. Recién ahí se realizaron los cambios en el main que sería el trabajo que vamos a mostrar.

11- Para volver a trabajar vuelven a bajar los cambios hechos en el main en su copia local con: 
git checkout main
git pull origin main
Listo!
