// src/controllers/peliculasController.js
const peliculaService = require("../services/PeliculaService");
const pool = require("../config/db");

// GET /api/peliculas
const listarPeliculas = async (req, res, next) => {
  try {
    const { genero, buscar } = req.query;
    const peliculas = await peliculaService.obtenerTodas({ genero, buscar });
    res.json(peliculas);
  } catch (err) {
    next(err);
  }
};

// GET /api/peliculas/:id
const obtenerPelicula = async (req, res, next) => {
  try {
    const pelicula = await peliculaService.obtenerPorId(Number(req.params.id));
    res.json(pelicula);
  } catch (err) {
    next(err);
  }
};

// POST /api/peliculas
const crearPelicula = async (req, res, next) => {
  try {
    const { titulo, anio, nota, director_id, genero_id } = req.body;

    if (!titulo || !anio) {
      return res.status(400).json({
        error: "Los campos titulo y anio son obligatorios",
      });
    }

    const nueva = await peliculaService.crear({
      titulo,
      anio,
      nota,
      director_id,
      genero_id,
    });

    res.status(201).json(nueva);
  } catch (err) {
    next(err);
  }
};

// PUT /api/peliculas/:id
const actualizarPelicula = async (req, res, next) => {
  try {
    const actualizada = await peliculaService.actualizar(
      Number(req.params.id),
      req.body,
    );

    res.json(actualizada);
  } catch (err) {
    next(err);
  }
};

// DELETE /api/peliculas/:id
const eliminarPelicula = async (req, res, next) => {
  try {
    const eliminada = await peliculaService.eliminar(Number(req.params.id));
    res.json({ mensaje: "Pelicula eliminada", pelicula: eliminada });
  } catch (err) {
    next(err);
  }
};

// GET /api/peliculas/:id/resenas
const listarResenas = async (req, res, next) => {
  try {
    const peliculaId = Number(req.params.id);
    const resenas = await peliculaService.obtenerResenas(peliculaId);
    res.json(resenas);
  } catch (err) {
    next(err);
  }
};

// POST /api/peliculas/:id/resenas
const crearResena = async (req, res, next) => {
  try {
    const peliculaId = Number(req.params.id);
    const { autor, texto, puntuacion } = req.body;

    if (!autor || !texto || puntuacion === undefined) {
      return res.status(400).json({
        error: "Los campos autor, texto y puntuacion son obligatorios",
      });
    }

    const nueva = await peliculaService.crearResena(peliculaId, {
      autor,
      texto,
      puntuacion,
    });

    res.status(201).json(nueva);
  } catch (err) {
    next(err);
  }
};

// GET /api/estadisticas/directores
const estadisticasDirectores = async (req, res, next) => {
  try {
    const { rows } = await pool.query(`
      SELECT
        d.nombre AS director,
        COUNT(p.id) AS num_peliculas,
        ROUND(AVG(p.nota), 2) AS nota_media,
        MAX(p.nota) AS nota_maxima,
        MIN(p.nota) AS nota_minima
      FROM directores d
      JOIN peliculas p ON p.director_id = d.id
      GROUP BY d.id, d.nombre
      HAVING COUNT(p.id) >= 1
      ORDER BY nota_media DESC
    `);
    res.json(rows);
  } catch (err) {
    next(err);
  }
};

// GET /api/estadisticas/generos
const estadisticasGeneros = async (req, res, next) => {
  try {
    const { rows } = await pool.query(`
      WITH stats AS (
        SELECT
          g.nombre AS genero,
          COUNT(p.id) AS num_peliculas,
          ROUND(AVG(p.nota), 2) AS nota_media,
          COUNT(r.id) AS total_resenas
        FROM generos g
        LEFT JOIN peliculas p ON p.genero_id = g.id
        LEFT JOIN resenas r ON r.pelicula_id = p.id
        GROUP BY g.id, g.nombre
      )
      SELECT *, RANK() OVER (ORDER BY nota_media DESC NULLS LAST) AS ranking
      FROM stats
      ORDER BY ranking
    `);
    res.json(rows);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  listarPeliculas,
  obtenerPelicula,
  crearPelicula,
  actualizarPelicula,
  eliminarPelicula,
  listarResenas,
  crearResena,
  estadisticasDirectores,
  estadisticasGeneros,
};
