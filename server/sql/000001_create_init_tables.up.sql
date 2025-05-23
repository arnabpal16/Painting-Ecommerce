-- Add UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- +migrate Up
SET TIMEZONE="Asia/Kolkata";

-- CREATE TABLE users (
--                        id UUID DEFAULT uuid_generate_v4 () PRIMARY KEY,
--                        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW (),
--                        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW (),
--                        first_name VARCHAR(100) NOT NULL,
--                        last_name VARCHAR(100) NOT NULL,
--                        email VARCHAR(255) NOT NULL UNIQUE,
--                        password_hash VARCHAR(255) NOT NULL,
--                        user_status INT NOT NULL,
--                        user_role VARCHAR(25) NOT NULL
-- );
CREATE TABLE users (

                        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
                        created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
                        updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
                        first_name VARCHAR(100) NOT NULL,
                        last_name VARCHAR(100) NOT NULL,
                        email VARCHAR(255) NOT NULL UNIQUE,
                        password_hash VARCHAR(255),
                        user_status INT NOT NULL,
                        user_role VARCHAR(25) NOT NULL,
                        google_id VARCHAR(255), -- Optional Google ID for users signing in with Google
                        profile_picture VARCHAR(255) -- Optional profile picture URL
);
-- Create the addresses table
CREATE TABLE addresses (
                           id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                           user_id UUID NOT NULL,
                           first_name VARCHAR(100) NOT NULL,
                           last_name VARCHAR(100) NOT NULL,
                           country VARCHAR(100) NOT NULL,
                           street_address VARCHAR(255) NOT NULL,
                           town_city VARCHAR(100) NOT NULL,
                           state VARCHAR(100) NOT NULL,
                           pin_code VARCHAR(20) NOT NULL,
                           mobile_number VARCHAR(20) NOT NULL,
                           email VARCHAR(255) NOT NULL,
                           order_notes TEXT,
                           set_as_default BOOLEAN NOT NULL DEFAULT FALSE,
                           created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
                           updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
                           FOREIGN KEY (user_id) REFERENCES users(id)
);
CREATE TABLE categories (
                            id UUID PRIMARY KEY,
                            name VARCHAR(255) NOT NULL UNIQUE,
                            description TEXT
);
CREATE TABLE coupons
(
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    coupon_code         VARCHAR(50) NOT NULL UNIQUE,
    validity            DATE,
    discount_percentage NUMERIC     NOT NULL,
    is_active           BOOLEAN     NOT NULL
);

CREATE TABLE products (
                          id UUID PRIMARY KEY,
                          title VARCHAR(255) NOT NULL,
                          description TEXT,
                          original_price   DECIMAL(10, 2) NOT NULL, -- Adjust precision and scale as needed
                          discounted_price DECIMAL(10, 2) NOT NULL,
                          is_active BOOLEAN NOT NULL,
                          category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
                          created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
                          updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE products_size
(
    id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES products (id) ON DELETE CASCADE,
    size       VARCHAR(50),
    charge     DECIMAL(10, 2) NOT NULL
);

CREATE TABLE products_subcategory
(
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id  UUID REFERENCES products (id) ON DELETE CASCADE,
    subcategory VARCHAR(50),
    charge      DECIMAL(10, 2) NOT NULL
);
CREATE TABLE product_images (
                                id UUID PRIMARY KEY,
                                product_id UUID REFERENCES products(id) ON DELETE CASCADE,
                                image_url TEXT NOT NULL,
                                created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE orders (
                        id UUID PRIMARY KEY,
                        user_id UUID REFERENCES users(id) ON DELETE SET NULL,
                        total DECIMAL(10, 2) NOT NULL,
                        coupon_code       VARCHAR(50),
                        status VARCHAR(50) NOT NULL, -- e.g., 'pending', 'completed', 'shipped'
                        address_id UUID REFERENCES addresses(id) ON DELETE SET NULL,
                        invoice_url TEXT NOT NULL,
                        created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
                        updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE order_items (
                         id UUID PRIMARY KEY,
                         order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
                         product_id UUID REFERENCES products(id) ON DELETE SET NULL,
                         product_name VARCHAR(255) NOT NULL,
                         size           VARCHAR(50)    NOT NULL,
                         subcategory    VARCHAR(50)    NOT NULL,
                         quantity INT NOT NULL,
                         quantity_price DECIMAL(10, 2) NOT NULL,
                         price DECIMAL(10, 2) NOT NULL, -- Price at the time of purchase
                         status VARCHAR(50) NOT NULL, -- e.g., 'approved', 'canceled'
                         created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
                         updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);


-- Create the contact_us table
CREATE TABLE contacts (
                        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                        first_name VARCHAR(100) NOT NULL,
                        last_name VARCHAR(100) NOT NULL,
                        email VARCHAR(100) NOT NULL,
                        phone VARCHAR(20) NOT NULL,
                        subject VARCHAR(200) NOT NULL,
                        message TEXT NOT NULL,
                        submitted_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                        replied BOOLEAN NOT NULL DEFAULT FALSE
);



-- Create the carts table
CREATE TABLE carts (
                       id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                       user_id UUID NOT NULL,
                       is_coupon_applied BOOLEAN NOT NULL,
                       coupon_code       VARCHAR(50),
                       discount_percentage NUMERIC NOT NULL,
                       created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
                       updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
                       FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);




-- Create the cart_items table
CREATE TABLE cart_items (
                            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                            cart_id UUID NOT NULL,
                            product_id UUID NOT NULL,
                            product_name VARCHAR(255) NOT NULL,
                            product_image TEXT NOT NULL,
                            quantity INT NOT NULL CHECK (quantity > 0),
                            quantity_price DECIMAL(10, 2) NOT NULL,
                            after_discount_total_price DECIMAL(10, 2) NOT NULL,
                            total_price DECIMAL(10, 2) NOT NULL, -- Price at the time of adding to cart
                            product_size_id        UUID        NOT NULL,
                            product_subcategory_id UUID        NOT NULL,
                            size                   VARCHAR(50) NOT NULL,
                            subcategory            VARCHAR(50) NOT NULL,
                            created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
                            updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
                            FOREIGN KEY (cart_id) REFERENCES carts(id) ON DELETE CASCADE,
                            FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL
);
