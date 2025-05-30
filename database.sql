-- Script para crear la base de datos del Sistema de Gestión de Eventos
-- Compatible con PostgreSQL y Supabase
-- Incluye tabla de Perfiles para información adicional del usuario y rol básico

-- Habilitar la extensión pgcrypto si no está habilitada (necesaria para gen_random_uuid())
-- En Supabase, esto suele estar habilitado por defecto.
-- CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Función para actualizar automáticamente la columna updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- ENUM Types para estados y tipos (mejora la consistencia de datos)
CREATE TYPE booking_status AS ENUM ('requested', 'confirmed', 'completed', 'cancelled', 'rejected');
CREATE TYPE payment_method AS ENUM ('cash', 'yape', 'plin', 'transfer', 'card', 'other');
CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'partially_paid', 'refunded');
CREATE TYPE inventory_movement_type AS ENUM ('purchase', 'consumption', 'adjustment_in', 'adjustment_out', 'loss');

-- Tabla: Perfiles de Usuario (Vinculada a auth.users de Supabase)
-- Almacena información adicional y roles básicos
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE, -- Clave foránea a la tabla de usuarios de Supabase Auth
    full_name VARCHAR(200),
    avatar_url TEXT, -- URL al avatar en Supabase Storage
    phone VARCHAR(50),
    is_admin BOOLEAN DEFAULT FALSE, -- Rol básico: TRUE para admin, FALSE para cliente/otro
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Trigger para actualizar updated_at en profiles
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON profiles
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Comentario: Asegúrate de configurar las políticas RLS adecuadas para la tabla profiles.
-- Por ejemplo, los usuarios solo deberían poder actualizar su propio perfil,
-- y solo los administradores (o el sistema) deberían poder cambiar 'is_admin'.

-- Tabla: Tipos de Evento
CREATE TABLE event_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER update_event_types_updated_at
BEFORE UPDATE ON event_types
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Tabla: Espacios del Local
CREATE TABLE spaces (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(150) NOT NULL,
    capacity INTEGER NOT NULL CHECK (capacity > 0),
    description TEXT,
    features TEXT, -- Podría ser JSONB si se quiere más estructura
    base_price NUMERIC(10, 2) DEFAULT 0.00, -- Precio base si se alquila fuera de paquete
    is_active BOOLEAN DEFAULT TRUE,
    -- photo_url VARCHAR(255), -- Se manejará mejor con Supabase Storage
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER update_spaces_updated_at
BEFORE UPDATE ON spaces
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Tabla: Paquetes de Servicios
CREATE TABLE packages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type_id UUID REFERENCES event_types(id) ON DELETE SET NULL,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    base_price NUMERIC(12, 2) NOT NULL CHECK (base_price >= 0),
    base_persons INTEGER NOT NULL CHECK (base_persons > 0),
    extra_person_price NUMERIC(10, 2) NOT NULL CHECK (extra_person_price >= 0),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER update_packages_updated_at
BEFORE UPDATE ON packages
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Tabla: Servicios Individuales/Adicionales
CREATE TABLE services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(150) NOT NULL,
    description TEXT,
    price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
    is_per_person BOOLEAN DEFAULT FALSE, -- Indica si el precio es por persona o fijo
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER update_services_updated_at
BEFORE UPDATE ON services
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Tabla de Unión: Paquetes <-> Servicios (Qué servicios incluye cada paquete base)
CREATE TABLE package_services (
    package_id UUID NOT NULL REFERENCES packages(id) ON DELETE CASCADE,
    service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
    quantity INTEGER DEFAULT 1 CHECK (quantity > 0), -- Por si un paquete incluye '2 horas de DJ'
    PRIMARY KEY (package_id, service_id),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    -- updated_at no suele ser necesario en tablas de unión simples
);

-- Tabla: Clientes
-- Nota: Si los clientes pueden iniciar sesión, su información principal
-- (nombre, email, teléfono) podría residir en la tabla 'profiles'.
-- Esta tabla 'clients' puede usarse si necesitas almacenar clientes
-- que NO inician sesión o información adicional específica del rol de cliente.
-- Considera si necesitas ambas o puedes consolidar en 'profiles'.
-- Por ahora, la mantenemos separada según el script original.
CREATE TABLE clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    -- profile_id UUID UNIQUE REFERENCES profiles(id) ON DELETE SET NULL, -- Enlazar a profiles si se consolida
    full_name VARCHAR(200) NOT NULL,
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(50),
    address TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER update_clients_updated_at
BEFORE UPDATE ON clients
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Tabla: Reservas (Bookings)
CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE RESTRICT, -- O referenciar profiles(id) si se consolida
    event_type_id UUID REFERENCES event_types(id) ON DELETE SET NULL,
    package_id UUID REFERENCES packages(id) ON DELETE SET NULL, -- Paquete base elegido (opcional)
    event_date DATE NOT NULL,
    start_time TIME,
    end_time TIME,
    estimated_persons INTEGER NOT NULL CHECK (estimated_persons > 0),
    final_persons INTEGER CHECK (final_persons > 0),
    total_calculated_price NUMERIC(12, 2) CHECK (total_calculated_price >= 0), -- Calculado al confirmar/actualizar
    final_agreed_price NUMERIC(12, 2), -- Precio final acordado (puede diferir del calculado)
    status booking_status NOT NULL DEFAULT 'requested',
    notes TEXT, -- Requerimientos especiales
    -- created_by_user_id UUID REFERENCES auth.users(id), -- Quién creó/solicitó la reserva
    created_by_admin BOOLEAN DEFAULT TRUE, -- Indica si fue creada por admin o solicitada por cliente (puede deducirse del rol del creador)
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER update_bookings_updated_at
BEFORE UPDATE ON bookings
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Tabla de Unión: Reservas <-> Espacios (Qué espacios usa una reserva)
CREATE TABLE booking_spaces (
    booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    space_id UUID NOT NULL REFERENCES spaces(id) ON DELETE RESTRICT, -- No borrar espacio si está en reserva confirmada? O CASCADE? Revisar lógica negocio.
    PRIMARY KEY (booking_id, space_id),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Unión: Reservas <-> Servicios Adicionales (Servicios extra NO incluidos en el paquete base)
CREATE TABLE booking_services (
    booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    service_id UUID NOT NULL REFERENCES services(id) ON DELETE RESTRICT,
    quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
    price_at_booking NUMERIC(10, 2) NOT NULL, -- Guarda el precio del servicio al momento de añadirlo
    is_per_person BOOLEAN NOT NULL, -- Guarda si era por persona al momento de añadirlo
    PRIMARY KEY (booking_id, service_id),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Tabla: Pagos
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    amount NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
    payment_date DATE NOT NULL DEFAULT CURRENT_DATE,
    method payment_method NOT NULL,
    reference_number VARCHAR(100), -- Para Nro Operación, Yape ID, etc.
    voucher_url TEXT, -- URL al comprobante en Supabase Storage
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    -- Podría añadirse un payment_status si un pago puede estar pendiente/confirmado
);

CREATE TRIGGER update_payments_updated_at
BEFORE UPDATE ON payments
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Tabla: Categorías de Gastos
CREATE TABLE expense_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER update_expense_categories_updated_at
BEFORE UPDATE ON expense_categories
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Tabla: Gastos
CREATE TABLE expenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID REFERENCES expense_categories(id) ON DELETE SET NULL,
    booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL, -- Gasto asociado a un evento específico (opcional)
    expense_date DATE NOT NULL DEFAULT CURRENT_DATE,
    description TEXT NOT NULL,
    amount NUMERIC(10, 2) NOT NULL CHECK (amount > 0),
    supplier VARCHAR(150),
    receipt_url TEXT, -- URL al comprobante/factura en Supabase Storage (opcional)
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER update_expenses_updated_at
BEFORE UPDATE ON expenses
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Tabla: Personal (Staff) - Básica
CREATE TABLE staff (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    -- profile_id UUID UNIQUE REFERENCES profiles(id) ON DELETE SET NULL, -- Si el personal puede iniciar sesión
    full_name VARCHAR(200) NOT NULL,
    position VARCHAR(100),
    contact_phone VARCHAR(50),
    contact_email VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER update_staff_updated_at
BEFORE UPDATE ON staff
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Tabla: Artículos de Inventario
CREATE TABLE inventory_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(150) NOT NULL UNIQUE,
    description TEXT,
    unit_of_measure VARCHAR(50), -- Ej: Botella, Unidad, Caja, Kg
    current_stock INTEGER NOT NULL DEFAULT 0 CHECK (current_stock >= 0),
    min_stock_level INTEGER DEFAULT 0 CHECK (min_stock_level >= 0),
    -- cost_price NUMERIC(10, 2) DEFAULT 0.00, -- Costo promedio o último costo (opcional)
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER update_inventory_items_updated_at
BEFORE UPDATE ON inventory_items
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Tabla: Movimientos de Inventario
CREATE TABLE inventory_movements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    item_id UUID NOT NULL REFERENCES inventory_items(id) ON DELETE RESTRICT,
    booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL, -- Consumo asociado a un evento (opcional)
    movement_type inventory_movement_type NOT NULL,
    quantity INTEGER NOT NULL, -- Positivo para entradas, Negativo para salidas/pérdidas
    movement_date TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    cost_at_movement NUMERIC(10, 2), -- Costo del item en este movimiento (opcional para valoración)
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    -- updated_at no suele ser necesario aquí, los movimientos son registros históricos
);

-- Índices para mejorar rendimiento en consultas comunes
CREATE INDEX idx_bookings_client_id ON bookings(client_id);
CREATE INDEX idx_bookings_event_date ON bookings(event_date);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_payments_booking_id ON payments(booking_id);
CREATE INDEX idx_expenses_booking_id ON expenses(booking_id);
CREATE INDEX idx_expenses_category_id ON expenses(category_id);
CREATE INDEX idx_inventory_movements_item_id ON inventory_movements(item_id);
CREATE INDEX idx_inventory_movements_booking_id ON inventory_movements(booking_id);
CREATE INDEX idx_profiles_is_admin ON profiles(is_admin); -- Índice útil para filtrar por rol

-- Considerar añadir más índices según las consultas más frecuentes que se realicen.

-- FIN DEL SCRIPT
```

**Notas Importantes (Actualizadas):**

1.  **Tabla `profiles` Añadida:** Se incluyó la tabla `profiles` con `id` referenciando `auth.users(id)` y la columna `is_admin`.
2.  **Relación `clients` vs `profiles`:** Se añadió un comentario en la tabla `clients` sugiriendo considerar si se necesita mantener separada o si la información del cliente puede consolidarse en `profiles` ahora que existe (depende de si todos los clientes tendrán login o no).
3.  **Supabase Storage:** Las columnas `avatar_url`, `voucher_url`, `receipt_url`, etc., almacenarán la URL del archivo subido a Supabase Storage.
4.  **RLS (Row Level Security):** Sigue siendo **crucial** configurar las políticas RLS en Supabase para todas las tablas, especialmente `profiles` y las relacionadas con datos sensibles.
5.  **Migraciones:** Se recomienda usar las migraciones de Supabase para aplicar estos cambios.
6.  **`ON DELETE`:** Revisa las acciones `ON DELETE` según la lógica de tu negocio.
