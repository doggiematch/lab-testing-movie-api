# 1. ¿Qué ventaja tiene escribir los tests ANTES de la implementación?

Los test ayudan a tener claro qué queremos conseguir antes de empezar a programar. Escribimos "una lista de condiciones" que debe cumplir la funcion. Por ejemplo, en favoritos, si la pelicula no existe debe devolver un 404, y si todo es correcto, el código 201.

# 2. ¿Por qué usamos una base de datos de test separada en lugar de mockear el módulo db? ¿Cuándo sí tendría sentido mockear?

Lo hacemos así para probar la API de una forma mas parecida a como funciona de verdad. Necesitamos saber si se llama a una funcion, comprobar que las tablas se relacionan entre sí, que se añaden datos o que se borran favoritos.
Usar mocks podría significar que los test pasan pero, p.e., la consulta SQL esta mal o falta una tabla en PostgreSQL.
Mockear tendría sentido si quisiéramos probar una parte pequeña sin depender de cosas externas.

# 3. ¿Qué es el error de PostgreSQL con código 23505 y por qué lo capturamos específicamente?

Aparece cuando intentamos guardar un dato que rompe una regla UNIQUE. En la tabla favoritos está dicha regla:
`UNIQUE(usuario_id, pelicula_id)`
Esto hace que un usuario no pueda guardar la misma película dos veces como favorita. En este caso, se lanzaría el error `23505` ('Esta película ya está en tus favoritos', 409)
