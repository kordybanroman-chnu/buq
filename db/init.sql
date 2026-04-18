DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TYPE IF EXISTS order_status CASCADE;

CREATE TYPE order_status AS ENUM ('pending', 'preparing', 'completed', 'rejected');

CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  image_url TEXT,
  category TEXT NOT NULL,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL,
  table_number TEXT NOT NULL,
  guest_name TEXT NOT NULL,
  status order_status DEFAULT 'pending',
  total_amount DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE RESTRICT,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  price_at_time DECIMAL(10, 2) NOT NULL
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read products" ON products FOR SELECT USING (true);
CREATE POLICY "Public read orders" ON orders FOR SELECT USING (true);
CREATE POLICY "Public read order items" ON order_items FOR SELECT USING (true);

ALTER PUBLICATION supabase_realtime ADD TABLE orders;

INSERT INTO products (name, description, price, category, image_url) VALUES
('Еспресо', 'Міцна класична кава', 50, 'Напої / Гарячі', '/images/espresso.png'),
('Американо', 'Еспресо з водою', 55, 'Напої / Гарячі', '/images/americano.png'),
('Капучино', 'Класична кава', 65, 'Напої / Гарячі', '/images/cappuccino.png'),
('Лате', 'Молочна кава', 70, 'Напої / Гарячі', '/images/latte.png'),
('Флет Вайт', 'Ніжна кава з молоком', 75, 'Напої / Гарячі', '/images/flat_white.png'),
('Раф кава', 'З вершками та ваніллю', 85, 'Напої / Гарячі', '/images/raf.png'),
('Гарячий шоколад', 'Насичений шоколадний напій', 80, 'Напої / Гарячі', '/images/hot_chocolate.png'),
('Чай чорний', 'Класичний чай', 40, 'Напої / Гарячі', '/images/black_tea.png'),
('Чай зелений', 'Легкий та освіжаючий', 40, 'Напої / Гарячі', '/images/green_tea.png'),
('Трав’яний чай', 'М’ята, ромашка', 45, 'Напої / Гарячі', '/images/herbal_tea.png'),
('Айс латте', 'Холодна кава з молоком', 75, 'Напої / Холодні', '/images/iced_latte.png'),
('Фрапе', 'Крижаний кавовий напій', 80, 'Напої / Холодні', '/images/frappe.png'),
('Лимонад', 'Цитрусовий мікс', 85, 'Напої / Холодні', '/images/lemonade.png'),
('Апельсиновий сік', 'Свіжовичавлений', 95, 'Напої / Холодні', '/images/orange_juice.png'),
('Яблучний сік', 'Натуральний', 70, 'Напої / Холодні', '/images/apple_juice.png'),
('Мохіто безалкогольний', 'Лайм і м’ята', 90, 'Напої / Холодні', '/images/mojito.png'),
('Смузі ягідний', 'Полуниця, банан', 110, 'Напої / Холодні', '/images/berry_smoothie.png'),
('Кола', 'Газований напій', 50, 'Напої / Холодні', '/images/cola.png'),
('Вода', 'Мінеральна негазована/газована', 35, 'Напої / Холодні', '/images/water.png'),
('Бургер', 'Соковита яловичина', 220, 'Їжа / Основні', '/images/burger.png'),
('Чізбургер', 'З сиром чеддер', 240, 'Їжа / Основні', '/images/cheeseburger.png'),
('Курячий бургер', 'З хрусткою куркою', 210, 'Їжа / Основні', '/images/chicken_burger.png'),
('Паста Карбонара', 'З беконом і вершками', 180, 'Їжа / Основні', '/images/carbonara_pasta.png'),
('Паста Болоньєзе', 'З м’ясним соусом', 175, 'Їжа / Основні', '/images/bolognese_pasta.png'),
('Піца Маргарита', 'Томат і сир', 200, 'Їжа / Основні', '/images/margherita_pizza.png'),
('Піца Пепероні', 'З ковбасками', 230, 'Їжа / Основні', '/images/pepperoni_pizza.png'),
('Салат Цезар', 'Курка, сир, соус', 160, 'Їжа / Основні', '/images/caesar_salad.png'),
('Салат Грецький', 'Овочі та фета', 150, 'Їжа / Основні', '/images/greek_salad.png'),
('Картопля фрі', 'Хрустка картопля', 90, 'Їжа / Закуски', '/images/french_fries.png'),
('Картопля по-селянськи', 'Зі спеціями', 95, 'Їжа / Закуски', '/images/potato_wedges.png'),
('Нагетси', 'Курячі шматочки', 120, 'Їжа / Закуски', '/images/chicken_nuggets.png'),
('Сирні палички', 'Смажений сир', 130, 'Їжа / Закуски', '/images/mozzarella_sticks.png'),
('Крильця BBQ', 'З соусом барбекю', 150, 'Їжа / Закуски', '/images/bbq_wings.png'),
('Тости з сиром', 'Гарячі бутерброди', 85, 'Їжа / Закуски', '/images/cheese_toast.png'),
('Чізкейк', 'Класичний сирний десерт', 120, 'Десерти', '/images/cheesecake.png'),
('Тірамісу', 'Італійський десерт', 130, 'Десерти', '/images/tiramisu.png'),
('Шоколадний торт', 'Насичений смак', 115, 'Десерти', '/images/chocolate_cake.png'),
('Морозиво', 'Ваніль/шоколад/полуниця', 70, 'Десерти', '/images/ice_cream.png'),
('Панкейки', 'З медом або сиропом', 110, 'Десерти', '/images/pancakes.png'),
('Круасан', 'З маслом або шоколадом', 60, 'Десерти', '/images/croissant.png');