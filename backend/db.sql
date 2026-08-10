CREATE EXTENSION postgis;

-- ============================================
-- 1. TABLA DE ADMINISTRADOR
-- ============================================
CREATE TABLE
  administrador (
    id_administrador SERIAL PRIMARY KEY,
    nombre_administrador VARCHAR(100) NOT NULL,
    email_administrador VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255)
  );

-- ============================================
-- 2. TABLA DE PESCADOR
-- ============================================
CREATE TABLE
  pescador (
    id_pescador SERIAL PRIMARY KEY,
    nombre_pescador VARCHAR(100) NOT NULL,
    email_pescador VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

-- ============================================
-- 3. TABLA CLUBS
-- ============================================
CREATE TABLE
  clubs (
    id_club SERIAL PRIMARY KEY,
    nombre_club VARCHAR(100) NOT NULL UNIQUE,
    email_contacto VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    validado BOOLEAN DEFAULT FALSE,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

-- ============================================
-- 4. TABLAS DE CLASIFICACIÓN DE ESPECIES
-- ============================================
CREATE TABLE
  familia (
    id_familia SERIAL PRIMARY KEY,
    nombre_familia VARCHAR(100) NOT NULL
  );

CREATE TABLE
  genero (
    id_genero SERIAL PRIMARY KEY,
    nombre_genero VARCHAR(100) NOT NULL
  );

CREATE TABLE
  especie (
    id_especie SERIAL PRIMARY KEY,
    nombre_especie VARCHAR(100) NOT NULL,
    id_familia INTEGER REFERENCES familia (id_familia),
    id_genero INTEGER REFERENCES genero (id_genero)
  );

-- ============================================
-- 5. TABLAS DE CONDICIONES AMBIENTALES
-- ============================================
CREATE TABLE
  habitat (
    id_habitat SERIAL PRIMARY KEY,
    tipo_habitat VARCHAR(100) NOT NULL
  );

CREATE TABLE
  tipo_lecho (
    id_tipo_lecho SERIAL PRIMARY KEY,
    nombre_lecho VARCHAR(100) NOT NULL
  );

CREATE TABLE
  direccion_viento (
    id_direccion_viento SERIAL PRIMARY KEY,
    direccion_viento VARCHAR(50) NOT NULL
  );

CREATE TABLE
  velocidad_viento (
    id_velocidad_viento SERIAL PRIMARY KEY,
    grado_beaufort INTEGER NOT NULL,
    denominacion VARCHAR(50),
    velocidad_nudos_min INTEGER,
    velocidad_nudos_max INTEGER
  );

CREATE TABLE
  altura_olas (
    id_altura_olas SERIAL PRIMARY KEY,
    grado_wmo INTEGER NOT NULL,
    descripcion VARCHAR(100),
    altura_min_m DECIMAL(4, 2),
    altura_max_m DECIMAL(4, 2)
  );

CREATE TABLE
  turbidez (
    id_turbidez SERIAL PRIMARY KEY,
    tipo_turbidez VARCHAR(100) NOT NULL
  );

CREATE TABLE
  tiempo_atmosferico (
    id_tiempo_atmosferico SERIAL PRIMARY KEY,
    tipo_tiempo_atmosferico VARCHAR(100) NOT NULL
  );

-- ============================================
-- 6. TABLAS DE PESCA
-- ============================================
CREATE TABLE
  tipo_pesca (
    id_tipo_pesca SERIAL PRIMARY KEY,
    tipo_pesca VARCHAR(100) NOT NULL
  );

CREATE TABLE
  cebo_natural (
    id_cebo_natural SERIAL PRIMARY KEY,
    tipo_cebo_natural VARCHAR(100) NOT NULL
  );

CREATE TABLE
  cebo_artificial (
    id_cebo_artificial SERIAL PRIMARY KEY,
    tipo_cebo_artificial VARCHAR(100) NOT NULL
  );

-- ============================================
-- 7. TABLA PRINCIPAL JORNADA
-- ============================================
CREATE TABLE
  jornada (
    id_jornada SERIAL PRIMARY KEY,
    id_pescador INTEGER REFERENCES pescador (id_pescador),
    fecha_inicio DATE NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_fin TIME NOT NULL,
    geom GEOMETRY (Point, 4326) NOT NULL,
    id_habitat INTEGER REFERENCES habitat (id_habitat),
    id_tipo_lecho INTEGER REFERENCES tipo_lecho (id_tipo_lecho),
    algas_presente BOOLEAN,
    id_direccion_viento INTEGER REFERENCES direccion_viento (id_direccion_viento),
    id_velocidad_viento INTEGER REFERENCES velocidad_viento (id_velocidad_viento),
    id_altura_olas INTEGER REFERENCES altura_olas (id_altura_olas),
    id_turbidez INTEGER REFERENCES turbidez (id_turbidez),
    id_tiempo_atmosferico INTEGER REFERENCES tiempo_atmosferico (id_tiempo_atmosferico),
    id_tipo_pesca INTEGER REFERENCES tipo_pesca (id_tipo_pesca),
    id_cebo_natural INTEGER REFERENCES cebo_natural (id_cebo_natural),
    id_cebo_artificial INTEGER REFERENCES cebo_artificial (id_cebo_artificial),
    mar_fondo BOOLEAN,
    notas TEXT,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

-- ============================================
-- 8. TABLA DE CAPTURAS
-- ============================================
CREATE TABLE
  captura (
    id_captura SERIAL PRIMARY KEY,
    id_jornada INTEGER REFERENCES jornada (id_jornada) ON DELETE CASCADE,
    id_especie INTEGER REFERENCES especie (id_especie),
    talla_cm INTEGER CHECK (talla_cm > 0)
  );

-- ============================================
-- 9. TABLA DE CONCURSOS
-- ============================================
CREATE TABLE
  concursos (
    id_concurso SERIAL PRIMARY KEY,
    id_club_organizador INTEGER NOT NULL REFERENCES clubs (id_club) ON DELETE CASCADE,
    nombre_concurso VARCHAR(200) NOT NULL,
    descripcion TEXT,
    -- Fechas y ubicación
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_fin TIME NOT NULL,
    lat DECIMAL(10, 7) NOT NULL,
    lng DECIMAL(10, 7) NOT NULL,
    -- Estadísticas del concurso
    num_participantes INTEGER NOT NULL DEFAULT 0,
    nombre_ganador VARCHAR(100),
    -- Datos ambientales (opcionales)
    id_habitat INTEGER REFERENCES habitat (id_habitat),
    id_tipo_lecho INTEGER REFERENCES tipo_lecho (id_tipo_lecho),
    algas_presente BOOLEAN,
    id_direccion_viento INTEGER REFERENCES direccion_viento (id_direccion_viento),
    id_velocidad_viento INTEGER REFERENCES velocidad_viento (id_velocidad_viento),
    id_altura_olas INTEGER REFERENCES altura_olas (id_altura_olas),
    id_turbidez INTEGER REFERENCES turbidez (id_turbidez),
    id_tiempo_atmosferico INTEGER REFERENCES tiempo_atmosferico (id_tiempo_atmosferico),
    mar_fondo BOOLEAN,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

-- ============================================
-- 10. TABLA DE PARTICIPACIÓN DE CLUBS
-- ============================================
CREATE TABLE
  participacion_concurso (
    id_concurso INTEGER NOT NULL REFERENCES concursos (id_concurso) ON DELETE CASCADE,
    id_club_participante INTEGER NOT NULL REFERENCES clubs (id_club) ON DELETE CASCADE,
    PRIMARY KEY (id_concurso, id_club_participante)
  );

-- ============================================
-- 11. TABLA DE CAPTURAS DE CONCURSO
-- ============================================
CREATE TABLE
  capturas_concurso (
    id_captura SERIAL PRIMARY KEY,
    id_concurso INTEGER NOT NULL REFERENCES concursos (id_concurso) ON DELETE CASCADE,
    id_especie INTEGER NOT NULL REFERENCES especie (id_especie),
    -- Datos agregados por especie
    num_ejemplares INTEGER,
    peso_total_kg DECIMAL(8, 2),
    pieza_mayor_kg DECIMAL(6, 2),
    -- Validación: al menos un dato obligatorio
    CONSTRAINT captura_tiene_datos CHECK (
      num_ejemplares IS NOT NULL
      OR peso_total_kg IS NOT NULL
    )
  );

-- ============================================
-- ÍNDICES PARA OPTIMIZAR BÚSQUEDAS
-- ============================================
CREATE INDEX idx_concursos_fechas ON concursos (fecha_inicio, fecha_fin);

CREATE INDEX idx_concursos_club ON concursos (id_club_organizador);

CREATE INDEX idx_concursos_coords ON concursos (lat, lng);

CREATE INDEX idx_capturas_concurso_especie ON capturas_concurso (id_especie);

CREATE INDEX idx_participacion_club ON participacion_concurso (id_club_participante);

-- ============================================
-- 1. INSERT ADMINISTRADOR
-- ============================================
INSERT INTO
  administrador (
    nombre_administrador,
    email_administrador,
    password_hash
  )
VALUES
  ('Alfonso Manzano', 'alfonso@gmail.com', '123');

-- ============================================
-- 2. INSERT PESCADOR
-- ============================================
INSERT INTO
  pescador (
    nombre_pescador,
    email_pescador,
    password_hash,
    fecha_registro
  )
VALUES
  (
    'Antonio García',
    'antonio.garcia@email.com',
    'p1',
    '2025-01-15 09:30:00'
  ),
  (
    'Manuel Ruiz',
    'manuel.ruiz@email.com',
    'p2',
    '2025-02-10 14:45:00'
  ),
  (
    'José Sánchez',
    'jose.sanchez@email.com',
    'p3',
    '2025-03-22 08:15:00'
  ),
  (
    'Francisco Moreno',
    'francisco.moreno@email.com',
    'p4',
    '2025-04-05 18:20:00'
  ),
  (
    'Miguel Torres',
    'miguel.torres@email.com',
    'p5',
    '2025-05-12 11:10:00'
  );

-- ============================================================
-- INSERCIÓN DE DATOS DE PRUEBA
-- ============================================================
-- 3. INSERTAR CLUBS
-- ============================================================
INSERT INTO
  clubs (
    nombre_club,
    email_contacto,
    password_hash,
    validado
  )
VALUES
  (
    'Club de Pesca Guadalquivir',
    'contacto@clubguadalquivir.es',
    'cl1',
    TRUE
  ),
  (
    'Club Náutico Sevilla',
    'info@nauticosevilla.es',
    'cl2',
    TRUE
  ),
  (
    'Club Deportivo Río Grande',
    'administracion@riogrande.es',
    'cl3',
    FALSE
  ),
  (
    'Asociación de Pescadores del Sur',
    'secretaria@pescadoressur.es',
    'cl4',
    TRUE
  ),
  (
    'Club de Pesca Costa Atlántica',
    'contacto@costaatlantica.es',
    'cl5',
    FALSE
  );

-- ============================================
-- INSERT VELOCIDAD VIENTO
-- ============================================
INSERT INTO
  velocidad_viento (
    grado_beaufort,
    denominacion,
    velocidad_nudos_min,
    velocidad_nudos_max
  )
VALUES
  (0, 'Calma', 0, 1),
  (1, 'Ventolina', 1, 3),
  (2, 'Flojito', 4, 6),
  (3, 'Flojo', 7, 10),
  (4, 'Bonancible', 11, 16),
  (5, 'Fresquito', 17, 21),
  (6, 'Fresco', 22, 27),
  (7, 'Frescachón', 28, 33),
  (8, 'Temporal', 34, 40),
  (9, 'Temporal fuerte', 41, 47),
  (10, 'Temporal duro', 48, 55),
  (11, 'Temporal muy duro', 56, 63),
  (12, 'Huracán', 64, 99);

-- ============================================
--  INSERT DIRECCIÓN VIENTO
-- ============================================
INSERT INTO
  direccion_viento (direccion_viento)
VALUES
  ('Norte'),
  ('Noreste'),
  ('Este'),
  ('Sureste'),
  ('Sur'),
  ('Suroeste'),
  ('Oeste'),
  ('Noroeste');

-- ============================================
--  INSERT ALTURA OLAS
-- ============================================
INSERT INTO
  altura_olas (
    grado_wmo,
    descripcion,
    altura_min_m,
    altura_max_m
  )
VALUES
  (0, 'Mar llana', 0, 0),
  (1, 'Mar rizada', 0, 0.1),
  (2, 'Marejadilla', 0.1, 0.5),
  (3, 'Marejada', 0.5, 1.25),
  (4, 'Fuerte marejada', 1.25, 2.5),
  (5, 'Mar gruesa', 2.5, 4),
  (6, 'Mar muy gruesa', 4, 6),
  (7, 'Mar arbolada', 6, 9),
  (8, 'Mar montañosa', 9, 99);

-- ============================================
--  INSERT TURBIDEZ
-- ============================================
INSERT INTO
  turbidez (tipo_turbidez)
VALUES
  ('Agua cristalina'),
  ('Ligeramente verdosa'),
  ('Ligeramente marrón'),
  ('Agua chocolate');

-- ============================================
--  INSERT TIPO LECHO
-- ============================================
INSERT INTO
  tipo_lecho (nombre_lecho)
VALUES
  ('Fango'),
  ('Arena'),
  ('Grava'),
  (
    'Bloques (piedras de cantos redondos de 5 a 30 cm)'
  ),
  ('Fondo rocoso'),
  ('Fondo mixto de arena y roca'),
  ('Otro tipo');

-- ============================================
-- INSERT HABITAT
-- ============================================
INSERT INTO
  habitat (tipo_habitat)
VALUES
  ('Río, embalse o lago puramente fluvial'),
  (
    'Estuario con agua salobre e influencia de mareas'
  ),
  ('Hábitat marino puro');

-- ============================================
-- INSERT TIEMPO ATMOSFERICO
-- ============================================
INSERT INTO
  tiempo_atmosferico (tipo_tiempo_atmosferico)
VALUES
  ('Soleado'),
  ('Ligeramente nublado'),
  ('Muy nublado sin lluvias'),
  ('Lluvia muy ligera'),
  ('Lluvia moderada'),
  ('Lluvia intensa');

-- ============================================
-- INSERT TIPO PESCA
-- ============================================
INSERT INTO
  tipo_pesca (tipo_pesca)
VALUES
  ('Surfcasting'),
  ('Boloñesa y otros tipos de corcheo'),
  ('Spinning'),
  ('Curricán'),
  ('Cola de rata');

-- ============================================
-- INSERT CEBO NATURAL
-- ============================================
INSERT INTO
  cebo_natural (tipo_cebo_natural)
VALUES
  ('Otro cebo'),
  ('Americano'),
  ('Coreano'),
  ('Llobarrero'),
  ('Tita'),
  ('Catalana'),
  ('Otro anélido'),
  ('Mújol'),
  ('Lisa'),
  ('Aguja'),
  ('Caballa'),
  ('Jurel'),
  ('Boquerón'),
  ('Sardina'),
  ('Alacha'),
  ('Boga'),
  ('Otro pez muerto'),
  ('Mújol vivo'),
  ('Aguja viva'),
  ('Caballa viva'),
  ('Jurel vivo'),
  ('Alacha viva'),
  ('Boga viva'),
  ('Esparido vivo'),
  ('Otro pez vivo'),
  ('Pulpo'),
  ('Choco'),
  ('Calamar'),
  ('Pota'),
  ('Chipirón'),
  ('Otro cefalópodo'),
  ('Mejillón'),
  ('Navaja'),
  ('Concha fina'),
  ('Otro bivalvo'),
  ('Pepino de mar'),
  ('Erizo'),
  ('Gamba'),
  ('Langostino'),
  ('Quisquilla'),
  ('Galera'),
  ('Cangrejo'),
  ('Cangrejo ermitaño'),
  ('Pulga de mar'),
  ('Otro crustáceo'),
  ('Pan'),
  ('Masa de sardina'),
  ('Otra masilla'),
  ('Lombriz de tierra'),
  ('Asticot'),
  ('Maíz'),
  ('Haba cocida'),
  ('Pan (miga simple)'),
  ('Chufa'),
  ('Cañamón'),
  ('Otro vegetal'),
  ('Boilies'),
  ('Pellet');

-- ============================================
-- INSERT CEBO ARTIFICIAL
-- ============================================
INSERT INTO
  cebo_artificial (tipo_cebo_artificial)
VALUES
  ('Otro señuelo'),
  ('Vinilo'),
  ('Popper'),
  ('Anguilón'),
  ('Paseante'),
  ('Otro superficial'),
  ('Minnow superficie'),
  ('Minnow media agua'),
  ('Minnow profundidad'),
  ('Plumas'),
  ('Jig'),
  ('Cucharilla giratoria'),
  ('Cucharilla ondulante'),
  ('Mosca seca'),
  ('Mosca ahogada'),
  ('Otra mosca'),
  ('Jibionera');

-- ============================================
-- INSERT FAMILIA
-- ============================================
INSERT INTO
  familia (nombre_familia)
VALUES
  ('Otra familia'),
  ('Espáridos (Sparidae)'),
  ('Múlidos (Mullidae)'),
  ('Escómbridos (Scombridae)'),
  ('Istiophóridos (Istiophoridae)'),
  ('Xifíidos (Xiphiidae)'),
  ('Corifénidos (Coryphaenidae)'),
  ('Morónidos (Moronidae)'),
  ('Serránidos (Serranidae)'),
  ('Haemúlidos (Haemulidae)'),
  ('Gádidos (Gadidae)'),
  ('Lotíidos (Lotidae)'),
  ('Ciánidos (Sciaenidae)'),
  ('Batracoididos (Batrachoididae)'),
  ('Escorpenidos (Scorpaenidae)'),
  ('Traquínidos (Trachinidae)'),
  ('Escáridos (Scaridae)'),
  ('Balístidos (Balistidae)'),
  ('Labridos (Labridae)'),
  ('Pomatómidos (Pomatomidae)'),
  ('Belónidos (Belonidae)'),
  ('Esfírenos (Sphyraenidae)'),
  ('Carángidos (Carangidae)'),
  ('Soléidos (Soleidae)'),
  ('Escofálmidos (Scophthalmidae)'),
  ('Cóngridos (Congridae)'),
  ('Murénidos (Muraenidae)'),
  ('Sepiidae (cefalópodo)'),
  ('Loliginidae (cefalópodo)'),
  ('Octopodidae (cefalópodo)'),
  ('Ciprínidos (Cyprinidae)'),
  ('Salmónidos (Salmonidae)'),
  ('Esócidos (Esocidae)'),
  ('Silúridos (Siluridae)'),
  ('Centrárquidos (Centrarchidae)'),
  ('Ictalúridos (Ictaluridae)'),
  ('Cíclidos (Cichlidae)'),
  ('Percidos (Percidae)'),
  ('Anguílidos (Anguillidae)');

-- ============================================
-- INSERT GENERO
-- ============================================
INSERT INTO
  genero (nombre_genero)
VALUES
  ('Otro género'),
  -- Espáridos (Sparidae)
  ('Pagrus'),
  ('Pagellus'),
  ('Sparus'),
  ('Dentex'),
  ('Diplodus'),
  ('Oblada'),
  ('Lithognathus'),
  ('Sarpa'),
  ('Boops'),
  -- Múlidos (Mullidae)
  ('Mullus'),
  -- Escómbridos (Scombridae)
  ('Thunnus'),
  ('Sarda'),
  ('Scomber'),
  ('Auxis'),
  ('Euthynnus'),
  -- Istiophóridos (Istiophoridae)
  ('Istiophorus'),
  ('Makaira'),
  ('Tetrapturus'),
  -- Xifíidos (Xiphiidae)
  ('Xiphias'),
  -- Corifénidos (Coryphaenidae)
  ('Coryphaena'),
  -- Morónidos (Moronidae)
  ('Dicentrarchus'),
  -- Serránidos (Serranidae)
  ('Epinephelus'),
  ('Mycteroperca'),
  ('Polyprion'),
  ('Serranus'),
  -- Haemúlidos (Haemulidae)
  ('Plectorhinchus'),
  ('Pomadasys'),
  -- Gádidos (Gadidae)
  ('Pollachius'),
  ('Micromesistius'),
  ('Trisopterus'),
  -- Lotíidos (Lotidae)
  ('Phycis'),
  -- Ciánidos (Sciaenidae)
  ('Sciaena'),
  ('Umbrina'),
  -- Batracoididos (Batrachoididae)
  ('Halobatrachus'),
  -- Escorpenidos (Scorpaenidae)
  ('Scorpaena'),
  ('Helicolenus'),
  -- Traquínidos (Trachinidae)
  ('Trachinus'),
  -- Escáridos (Scaridae)
  ('Sparisoma'),
  -- Balístidos (Balistidae)
  ('Balistes'),
  -- Labridos (Labridae)
  ('Labrus'),
  ('Symphodus'),
  -- Pomatómidos (Pomatomidae)
  ('Pomatomus'),
  -- Belónidos (Belonidae)
  ('Belone'),
  -- Esfírenos (Sphyraenidae)
  ('Sphyraena'),
  -- Carángidos (Carangidae)
  ('Trachurus'),
  ('Pseudocaranx'),
  ('Seriola'),
  ('Lichia'),
  -- Soléidos (Soleidae)
  ('Solea'),
  -- Escofálmidos (Scophthalmidae)
  ('Scophthalmus'),
  -- Cóngridos (Congridae)
  ('Conger'),
  -- Murénidos (Muraenidae)
  ('Muraena'),
  ('Enchelycore'),
  ('Gymnothorax'),
  -- Cefalópodos Sepiidae
  ('Sepia'),
  -- Cefalópodos Loliginidae
  ('Loligo'),
  -- Cefalópodos Octopodidae
  ('Octopus'),
  -- Ciprínidos (Cyprinidae)
  ('Cyprinus'),
  ('Carassius'),
  ('Barbus'),
  ('Alburnus'),
  ('Tinca'),
  -- *** GÉNEROS CORREGIDOS (CAMBIADOS A "bogas de río") ***
  ('bogas de río'),
  ('bogas de río'),
  -- Salmónidos (Salmonidae)
  ('Salmo'),
  ('Oncorhynchus'),
  ('Salvelinus'),
  ('Hucho'),
  -- Esócidos (Esocidae)
  ('Esox'),
  -- Silúridos (Siluridae)
  ('Silurus'),
  -- Centrárquidos (Centrarchidae)
  ('Micropterus'),
  ('Lepomis'),
  -- Ictalúridos (Ictaluridae)
  ('Ameiurus'),
  ('Ictalurus'),
  -- Cíclidos (Cichlidae)
  ('Australoheros'),
  -- Percidos (Percidae)
  ('Sander'),
  ('Perca'),
  -- Anguílidos (Anguillidae)
  ('Anguilla');

-- ============================================
-- INSERT ESPECIE (CORREGIDO CON NUEVOS IDs)
-- ============================================
INSERT INTO
  especie (nombre_especie, id_familia, id_genero)
VALUES
  ('Otra especie', 1, 1),
  -- Espáridos (Sparidae) - familia 2
  ('Pagrus pagrus', 2, 2),
  ('Pagellus bogaraveo', 2, 3),
  ('Pagellus erythrinus', 2, 3),
  ('Sparus aurata', 2, 4),
  ('Dentex dentex', 2, 5),
  ('Diplodus sargus', 2, 6),
  ('Diplodus vulgaris', 2, 6),
  ('Diplodus annularis', 2, 6),
  ('Diplodus cervinus', 2, 6),
  ('Oblada melanura', 2, 7),
  ('Lithognathus mormyrus', 2, 8),
  ('Sarpa salpa', 2, 9),
  ('Boops boops', 2, 10),
  -- Múlidos (Mullidae) - familia 3
  ('Mullus barbatus', 3, 11),
  ('Mullus surmuletus', 3, 11),
  -- Escómbridos (Scombridae) - familia 4
  ('Thunnus thynnus', 4, 12),
  ('Thunnus alalunga', 4, 12),
  ('Thunnus albacares', 4, 12),
  ('Sarda sarda', 4, 13),
  ('Scomber sp.', 4, 14),
  ('Auxis sp.', 4, 15),
  ('Euthynnus alletteratus', 4, 16),
  -- Istiophóridos (Istiophoridae) - familia 5
  ('Istiophorus albicans', 5, 17),
  ('Makaira nigricans', 5, 18),
  ('Tetrapturus belone', 5, 19),
  -- Xifíidos (Xiphiidae) - familia 6
  ('Xiphias gladius', 6, 20),
  -- Corifénidos (Coryphaenidae) - familia 7
  ('Coryphaena hippurus', 7, 21),
  -- Morónidos (Moronidae) - familia 8
  ('Dicentrarchus labrax', 8, 22),
  ('Dicentrarchus punctatus', 8, 22),
  -- Serránidos (Serranidae) - familia 9
  ('Epinephelus marginatus', 9, 23),
  ('Epinephelus aeneus', 9, 23),
  ('Epinephelus caninus', 9, 23),
  ('Mycteroperca fusca', 9, 24),
  ('Mycteroperca rubra', 9, 24),
  ('Polyprion americanus', 9, 25),
  ('Serranus sp.', 9, 26),
  -- Haemúlidos (Haemulidae) - familia 10
  ('Plectorhinchus mediterraneus', 10, 27),
  ('Pomadasys incisus', 10, 28),
  -- Gádidos (Gadidae) - familia 11
  ('Pollachius pollachius', 11, 29),
  ('Micromesistius poutassou', 11, 30),
  ('Trisopterus luscus', 11, 31),
  -- Lotíidos (Lotidae) - familia 12
  ('Phycis phycis', 12, 32),
  ('Phycis blennoides', 12, 32),
  -- Ciánidos (Sciaenidae) - familia 13
  ('Sciaena umbra', 13, 33),
  ('Umbrina cirrosa', 13, 34),
  -- Batracoididos (Batrachoididae) - familia 14
  ('Halobatrachus didactylus', 14, 35),
  -- Escorpenidos (Scorpaenidae) - familia 15
  ('Scorpaena sp.', 15, 36),
  ('Helicolenus dactylopterus', 15, 37),
  -- Traquínidos (Trachinidae) - familia 16
  ('Trachinus draco', 16, 38),
  -- Escáridos (Scaridae) - familia 17
  ('Sparisoma cretense', 17, 39),
  -- Balístidos (Balistidae) - familia 18
  ('Balistes capriscus', 18, 40),
  -- Labridos (Labridae) - familia 19
  ('Labrus sp.', 19, 41),
  ('Symphodus tinca', 19, 42),
  -- Pomatómidos (Pomatomidae) - familia 20
  ('Pomatomus saltatrix', 20, 43),
  -- Belónidos (Belonidae) - familia 21
  ('Belone belone', 21, 44),
  -- Esfírenos (Sphyraenidae) - familia 22
  ('Sphyraena sphyraena', 22, 45),
  -- Carángidos (Carangidae) - familia 23
  ('Trachurus trachurus', 23, 46),
  ('Pseudocaranx dentex', 23, 47),
  ('Seriola dumerili', 23, 48),
  ('Lichia amia', 23, 49),
  -- Soléidos (Soleidae) - familia 24
  ('Solea sp.', 24, 50),
  -- Escofálmidos (Scophthalmidae) - familia 25
  ('Scophthalmus maximus', 25, 51),
  -- Cóngridos (Congridae) - familia 26
  ('Conger conger', 26, 52),
  -- Murénidos (Muraenidae) - familia 27
  ('Muraena helena', 27, 53),
  ('Muraena augusti', 27, 53),
  ('Enchelycore anatina', 27, 54),
  ('Gymnothorax unicolor', 27, 55),
  -- Cefalópodos Sepiidae - familia 28
  ('Sepia officinalis', 28, 56),
  -- Cefalópodos Loliginidae - familia 29
  ('Loligo vulgaris', 29, 57),
  -- Cefalópodos Octopodidae - familia 30
  ('Octopus vulgaris', 30, 58),
  -- Ciprínidos (Cyprinidae) - familia 31
  ('Cyprinus carpio', 31, 59),
  ('Carassius carassius', 31, 60),
  ('Carassius auratus', 31, 60),
  ('Barbus sp.', 31, 61),
  ('Alburnus alburnus', 31, 62),
  ('Tinca tinca', 31, 63),
  ('Pseudochondrostoma polylepis', 31, 64),
  ('Chondrostoma arrigonis', 31, 65),
  -- Salmónidos (Salmonidae) - familia 32
  ('Salmo trutta', 32, 66),
  ('Salmo salar', 32, 66),
  ('Oncorhynchus mykiss', 32, 67),
  ('Salvelinus fontinalis', 32, 68),
  ('Hucho hucho', 32, 69),
  -- Esócidos (Esocidae) - familia 33
  ('Esox lucius', 33, 70),
  -- Silúridos (Siluridae) - familia 34
  ('Silurus glanis', 34, 71),
  -- Centrárquidos (Centrarchidae) - familia 35
  ('Micropterus salmoides', 35, 72),
  ('Lepomis gibbosus', 35, 73),
  -- Ictalúridos (Ictaluridae) - familia 36
  ('Ameiurus melas', 36, 74),
  ('Ictalurus punctatus', 36, 75),
  -- Cíclidos (Cichlidae) - familia 37
  ('Australoheros facetus', 37, 76),
  -- Percidos (Percidae) - familia 38
  ('Sander lucioperca', 38, 77),
  ('Perca fluviatilis', 38, 78),
  -- Anguílidos (Anguillidae) - familia 39
  ('Anguilla anguilla', 39, 79);

-- ============================================
-- INSERT CAPTURA (JORNADAS)
-- ============================================
INSERT INTO jornada (
    id_pescador,
    fecha_inicio,
    hora_inicio,
    hora_fin,
    geom,
    id_habitat,
    id_tipo_lecho,
    algas_presente,
    id_direccion_viento,
    id_velocidad_viento,
    id_altura_olas,
    id_turbidez,
    id_tiempo_atmosferico,
    id_tipo_pesca,
    id_cebo_natural,
    id_cebo_artificial,
    mar_fondo,
    notas
  )
VALUES
  (
    1,
    '2026-06-01',
    '08:00',
    '12:00',
    ST_SetSRID (ST_MakePoint (-6.3, 37.3), 4326),
    1,
    1,
    TRUE,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    FALSE,
    'Jornada test 1'
  ),
  (
    2,
    '2026-06-02',
    '09:00',
    '13:00',
    ST_SetSRID (ST_MakePoint (-6.4, 37.4), 4326),
    2,
    2,
    FALSE,
    2,
    2,
    2,
    2,
    2,
    2,
    2,
    2,
    TRUE,
    'Jornada test 2'
  ),
  (
    3,
    '2026-06-03',
    '07:30',
    '11:30',
    ST_SetSRID (ST_MakePoint (-6.5, 37.5), 4326),
    3,
    3,
    TRUE,
    3,
    3,
    3,
    3,
    3,
    3,
    3,
    3,
    FALSE,
    'Jornada test 3'
  ),
  (
    4,
    '2026-06-04',
    '06:00',
    '10:00',
    ST_SetSRID (ST_MakePoint (-6.6, 37.6), 4326),
    1,
    2,
    FALSE,
    4,
    4,
    4,
    4,
    4,
    4,
    4,
    4,
    TRUE,
    'Jornada test 4'
  ),
  (
    5,
    '2026-06-05',
    '10:00',
    '14:00',
    ST_SetSRID (ST_MakePoint (-6.7, 37.7), 4326),
    2,
    1,
    TRUE,
    1,
    2,
    3,
    4,
    1,
    2,
    3,
    1,
    FALSE,
    'Jornada test 5'
  );

-- ============================================================
-- 4. INSERTAR CONCURSOS
-- ============================================================
INSERT INTO
  concursos (
    id_club_organizador,
    nombre_concurso,
    descripcion,
    fecha_inicio,
    fecha_fin,
    hora_inicio,
    hora_fin,
    lat,
    lng,
    num_participantes,
    nombre_ganador,
    id_habitat,
    id_tipo_lecho,
    algas_presente,
    id_direccion_viento,
    id_velocidad_viento,
    id_altura_olas,
    id_turbidez,
    id_tiempo_atmosferico,
    mar_fondo
  )
VALUES
  (
    1,
    'Concurso Primavera 2026',
    'Jornada de pesca desde costa en la desembocadura del Guadalquivir.',
    '2026-04-12',
    '2026-04-12',
    '08:00',
    '14:00',
    36.8012000,
    -6.3456000,
    42,
    'Antonio García',
    1,
    2,
    TRUE,
    3,
    2,
    1,
    2,
    1,
    FALSE
  ),
  (
    2,
    'Open Costa Atlántica',
    'Competición anual organizada por el club.',
    '2026-05-23',
    '2026-05-24',
    '07:00',
    '15:00',
    36.5284000,
    -6.2931000,
    67,
    'Miguel Torres',
    2,
    1,
    FALSE,
    2,
    1,
    2,
    1,
    1,
    TRUE
  ),
  (
    3,
    'Trofeo Río Grande',
    'Prueba social para socios y aficionados.',
    '2026-06-14',
    '2026-06-14',
    '09:00',
    '13:00',
    37.3886000,
    -5.9823000,
    28,
    'José Sánchez',
    1,
    3,
    TRUE,
    1,
    2,
    1,
    3,
    2,
    FALSE
  ),
  (
    4,
    'Desafío de Verano',
    'Concurso nocturno de pesca deportiva.',
    '2026-07-18',
    '2026-07-19',
    '20:00',
    '02:00',
    36.6878000,
    -6.1361000,
    55,
    NULL,
    3,
    2,
    FALSE,
    4,
    3,
    2,
    2,
    3,
    TRUE
  ),
  (
    5,
    'Memorial José Pérez',
    'Prueba conmemorativa abierta a todos los clubes.',
    '2026-09-06',
    '2026-09-06',
    '08:30',
    '16:30',
    36.7421000,
    -6.4315000,
    73,
    NULL,
    2,
    1,
    TRUE,
    2,
    2,
    1,
    1,
    1,
    FALSE
  );

-- 4. INSERTAR PARTICIPACIÓN DE CLUBS EN CONCURSOS
-- ============================================================
INSERT INTO
  participacion_concurso (id_concurso, id_club_participante)
VALUES
  (1, 1),
  (1, 2),
  (1, 3),
  (2, 2),
  (2, 4),
  (3, 1),
  (3, 5),
  (4, 3),
  (4, 4),
  (5, 1),
  (5, 2),
  (5, 5);

-- 3. INSERTAR CAPTURAS POR CONCURSO
-- ============================================================
INSERT INTO
  capturas_concurso (
    id_concurso,
    id_especie,
    num_ejemplares,
    peso_total_kg,
    pieza_mayor_kg
  )
VALUES
  (1, 2, 5, 12.50, 3.20),
  (1, 3, 2, 4.80, 2.60),
  (2, 1, 8, 18.30, 4.10),
  (2, 4, 1, 6.75, 6.75),
  (3, 2, 3, 7.40, 3.00),
  (3, 5, 10, 15.90, 2.10),
  (4, 3, 6, 9.60, 2.80),
  (5, 1, 4, 11.20, 3.70);