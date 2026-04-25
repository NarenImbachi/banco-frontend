# Banco Frontend

Aplicacion frontend de la prueba tecnica bancaria, construida con Angular 19 y orientada a operar junto al backend `banco-app` dentro de un unico repositorio.

## Objetivo

Este frontend permite gestionar desde la interfaz web:

- Clientes
- Cuentas
- Movimientos
- Reportes

Ademas incluye busqueda rapida, formularios con validaciones, componentes reutilizables y generacion de reporte PDF desde la vista de reportes.

## Contexto dentro del repositorio

Este proyecto hace parte de una solucion full-stack unificada:

- `banco-app`: backend Spring Boot
- `banco-frontend`: frontend Angular
- `docker-compose.yaml`: orquestacion general de ambos servicios

La documentacion describe el frontend como modulo independiente y tambien como parte de la solucion completa.

## Stack tecnologico

- Angular 19.2
- TypeScript
- SCSS
- RxJS
- Jest
- jsPDF
- jsPDF AutoTable
- Docker

## Funcionalidades implementadas

- CRUD visual de clientes
- CRUD visual de cuentas
- Registro y eliminacion de movimientos
- Filtros por cuenta y rango de fechas en movimientos
- Consulta de estado de cuenta por cliente y fechas
- Exportacion del reporte a PDF desde el navegador
- Tabla reutilizable para listados
- Modal reutilizable para formularios
- Validaciones en formularios reactivos
- Consumo de API REST del backend

## Arquitectura del frontend

La aplicacion esta organizada con una separacion clara entre modelos, servicios, paginas, layout y componentes compartidos.

```text
banco-frontend/
|-- src/
|   |-- app/
|   |   |-- core/
|   |   |   |-- models/      # Tipos y contratos del frontend
|   |   |   `-- response/    # Envoltura ApiResponse
|   |   |-- features/
|   |   |   |-- clientes/
|   |   |   |-- cuentas/
|   |   |   |-- movimientos/
|   |   |   `-- reportes/
|   |   |-- layout/
|   |   |   |-- header/
|   |   |   `-- sidebar/
|   |   |-- pages/
|   |   |   |-- clientes/
|   |   |   |-- cuentas/
|   |   |   |-- movimientos/
|   |   |   `-- reportes/
|   |   |-- shared/
|   |   |   |-- modal/
|   |   |   `-- table/
|   |   |-- app.component.*
|   |   |-- app.config.ts
|   |   `-- app.routes.ts
|   |-- main.ts
|   `-- styles.scss
|-- angular.json
|-- package.json
|-- jest.config.js
|-- Dockerfile
`-- README.md
```

## Navegacion

Las rutas definidas en la aplicacion son:

- `/clientes`
- `/cuentas`
- `/movimientos`
- `/reportes`

La ruta raiz redirige automaticamente a `/clientes`.

## Shell visual

La estructura principal de la aplicacion usa:

- `HeaderComponent`
- `SidebarComponent`
- `router-outlet` para renderizar las paginas

Esto le da al frontend una estructura tipo dashboard administrativo, adecuada para la prueba tecnica.

## Paginas principales

### Clientes

Gestiona el mantenimiento de clientes mediante:

- carga inicial de registros
- formulario reactivo para crear
- formulario reactivo para editar
- filtro por nombre, identificacion y clienteId
- eliminacion con confirmacion

Validaciones visibles destacadas:

- nombre obligatorio y minimo 3 caracteres
- genero obligatorio
- edad entre 18 y 99
- identificacion de 10 digitos
- telefono de 10 digitos
- contrasena minima de 4 caracteres

### Cuentas

Gestiona la administracion de cuentas bancarias mediante:

- listado general
- asociacion a clientes existentes
- creacion de cuenta
- actualizacion de tipo y estado
- eliminacion
- filtro por numero de cuenta, tipo y cliente

Validaciones destacadas:

- numero de cuenta obligatorio y de 6 digitos
- tipo obligatorio
- saldo inicial no negativo
- cliente obligatorio

### Movimientos

Gestiona las operaciones financieras sobre cuentas:

- carga del listado formateado desde `GET /api/movimientos/listado`
- filtro por cuenta
- filtro por fecha inicial y final
- creacion de deposito o retiro
- eliminacion de movimiento

Comportamiento importante:

- si el usuario elige `DEPOSITO`, el valor se normaliza a positivo
- si elige `RETIRO`, el valor se normaliza a negativo
- los errores del backend se muestran al usuario con mensajes de alerta

### Reportes

Permite consultar el estado de cuenta por cliente y rango de fechas:

- seleccion de cliente
- seleccion de fechas
- consulta al backend
- visualizacion tabular del reporte
- exportacion del resultado a PDF con `jsPDF` y `autoTable`

## Integracion con el backend

Los servicios del frontend consumen directamente el backend en:

```text
http://localhost:8080/api
```

Servicios implementados:

- `ClienteService`
- `CuentaService`
- `MovimientoService`
- `ReporteService`

Observacion tecnica importante:

- Las URLs del backend estan actualmente definidas de forma directa dentro de los servicios.
- Esto funciona correctamente para la prueba local y con Docker Compose, aunque en una evolucion futura convendria centralizar la URL base en un archivo de entorno.

## Formato de respuesta esperado

El frontend trabaja con un contrato comun:

```ts
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  code: string;
  data: T;
}
```

Esto simplifica el manejo uniforme de respuestas exitosas y errores funcionales.

## Modelos principales

Entre los contratos mas importantes del frontend estan:

- `Cliente`
- `ClienteResponse`
- `Cuenta`
- `CreateCuentaRequest`
- `UpdateCuentaRequest`
- `CreateMovimientoRequest`
- `MovimientoResponse`
- `MovimientoListadoResponse`
- `ReporteMovimientoResponse`

Esto ayuda a mantener tipado fuerte en formularios, servicios y vistas.

## Estilos

La interfaz no usa frameworks CSS prefabricados, en linea con lo pedido en la prueba.

La base visual se apoya en:

- `SCSS`
- variables CSS globales en [styles.scss](</C:/Users/naren/OneDrive/Desktop/Naren Unicauca/CHAMBA/PruebaTecnicaDevsuNimbachi/banco-frontend/src/styles.scss>)
- componentes de layout propios
- clases reutilizables para botones, formularios, errores y espaciado

Direccion visual actual:

- paleta azul corporativa
- acento amarillo
- tarjetas claras
- sidebar administrativa

## Configuracion del proyecto

Aspectos relevantes de [angular.json](</C:/Users/naren/OneDrive/Desktop/Naren Unicauca/CHAMBA/PruebaTecnicaDevsuNimbachi/banco-frontend/angular.json>):

- aplicacion Angular standalone
- estilos en `SCSS`
- build de produccion con salida en `dist/banco-frontend`
- assets cargados desde `public`
- configuracion `development` y `production`

## Requisitos

- Node.js 18 o superior
- npm 9 o superior

Verificacion:

```bash
node --version
npm --version
```

## Instalacion

Desde la carpeta `banco-frontend`:

```bash
npm install
```

## Ejecucion en desarrollo

```bash
npm start
```

La aplicacion queda disponible en:

```text
http://localhost:4200
```

Para que funcione correctamente, el backend debe estar ejecutandose en:

```text
http://localhost:8080
```

## Build de produccion

```bash
npm run build
```

La salida se genera en:

```text
dist/banco-frontend
```

## Pruebas

El proyecto usa Jest como framework de pruebas.

Archivos relevantes:

- [jest.config.js](</C:/Users/naren/OneDrive/Desktop/Naren Unicauca/CHAMBA/PruebaTecnicaDevsuNimbachi/banco-frontend/jest.config.js>)
- [setup-jest.ts](</C:/Users/naren/OneDrive/Desktop/Naren Unicauca/CHAMBA/PruebaTecnicaDevsuNimbachi/banco-frontend/setup-jest.ts>)

Ejecutar pruebas:

```bash
npm test
```

Cobertura funcional observada en el proyecto:

- componentes principales
- componentes compartidos
- servicios HTTP

Ejemplos presentes:

- `clientes.component.spec.ts`
- `cuentas.component.spec.ts`
- `movimientos.component.spec.ts`
- `reportes.component.spec.ts`
- `cliente.service.spec.ts`
- `cuenta.service.spec.ts`
- `movimiento.service.spec.ts`
- `reporte.service.spec.ts`

## Docker

El proyecto incluye [Dockerfile](</C:/Users/naren/OneDrive/Desktop/Naren Unicauca/CHAMBA/PruebaTecnicaDevsuNimbachi/banco-frontend/Dockerfile>) multi-stage:

- etapa de build con Node
- etapa final con Apache HTTPD

Construccion manual:

```bash
docker build -t banco-frontend .
```

Ejecucion manual:

```bash
docker run -p 4200:80 banco-frontend
```

## Flujo de ejecucion

El orden sugerido de lectura es:

1. README general del repositorio
2. README de `banco-app`
3. README de `banco-frontend`

El orden sugerido de ejecucion es:

1. levantar backend y frontend con `docker-compose.yaml`
2. abrir `http://localhost:4200`
3. validar operaciones CRUD
4. generar reporte
5. descargar PDF



