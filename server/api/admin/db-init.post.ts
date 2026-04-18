import postgres from 'postgres'
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const sql = postgres(process.env.DIRECT_URL!)
  try {
    await sql.begin(async (sql) => {
      await sql`DROP TABLE IF EXISTS order_items CASCADE`
      await sql`DROP TABLE IF EXISTS orders CASCADE`
      await sql`DROP TABLE IF EXISTS products CASCADE`
      await sql`DROP TYPE IF EXISTS order_status CASCADE`
      await sql`CREATE TYPE order_status AS ENUM ('pending', 'preparing', 'completed', 'rejected')`
      await sql`
        CREATE TABLE products (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          name TEXT NOT NULL,
          description TEXT,
          price DECIMAL(10, 2) NOT NULL,
          image_url TEXT,
          category TEXT NOT NULL,
          is_available BOOLEAN DEFAULT true,
          created_at TIMESTAMPTZ DEFAULT NOW()
        )
      `
      await sql`
        CREATE TABLE orders (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          client_id UUID NOT NULL,
          table_number TEXT NOT NULL,
          guest_name TEXT NOT NULL,
          status order_status DEFAULT 'pending',
          total_amount DECIMAL(10, 2) NOT NULL,
          created_at TIMESTAMPTZ DEFAULT NOW()
        )
      `
      await sql`
        CREATE TABLE order_items (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
          product_id UUID REFERENCES products(id) ON DELETE RESTRICT,
          quantity INTEGER NOT NULL CHECK (quantity > 0),
          price_at_time DECIMAL(10, 2) NOT NULL
        )
      `
      await sql`ALTER TABLE products ENABLE ROW LEVEL SECURITY`
      await sql`ALTER TABLE orders ENABLE ROW LEVEL SECURITY`
      await sql`ALTER TABLE order_items ENABLE ROW LEVEL SECURITY`
      await sql`CREATE POLICY "Public read products" ON products FOR SELECT USING (true)`
      await sql`CREATE POLICY "Public read orders" ON orders FOR SELECT USING (true)`
      await sql`CREATE POLICY "Public read order items" ON order_items FOR SELECT USING (true)`
      await sql`ALTER PUBLICATION supabase_realtime ADD TABLE orders`
      const menuItems = [
        { name: 'Еспресо', desc: 'Міцна класична кава', price: 50, cat: 'Напої / Гарячі', img: '/images/espresso.png' },
        { name: 'Американо', desc: 'Еспресо з водою', price: 55, cat: 'Напої / Гарячі', img: '/images/americano.png' },
        { name: 'Капучино', desc: 'Класична кава', price: 65, cat: 'Напої / Гарячі', img: '/images/cappuccino.png' },
        { name: 'Лате', desc: 'Молочна кава', price: 70, cat: 'Напої / Гарячі', img: '/images/latte.png' },
        { name: 'Флет Вайт', desc: 'Ніжна кава з молоком', price: 75, cat: 'Напої / Гарячі', img: '/images/flat_white.png' },
        { name: 'Раф кава', desc: 'З вершками та ваніллю', price: 85, cat: 'Напої / Гарячі', img: '/images/raf.png' },
        { name: 'Гарячий шоколад', desc: 'Насичений шоколадний напій', price: 80, cat: 'Напої / Гарячі', img: '/images/hot_chocolate.png' },
        { name: 'Чай чорний', desc: 'Класичний чай', price: 40, cat: 'Напої / Гарячі', img: '/images/black_tea.png' },
        { name: 'Чай зелений', desc: 'Легкий та освіжаючий', price: 40, cat: 'Напої / Гарячі', img: '/images/green_tea.png' },
        { name: 'Трав’яний чай', desc: 'М’ята, ромашка', price: 45, cat: 'Напої / Гарячі', img: '/images/herbal_tea.png' },
        { name: 'Айс латте', desc: 'Холодна кава з молоком', price: 75, cat: 'Напої / Холодні', img: '/images/iced_latte.png' },
        { name: 'Фрапе', desc: 'Крижаний кавовий напій', price: 80, cat: 'Напої / Холодні', img: '/images/frappe.png' },
        { name: 'Лимонад', desc: 'Цитрусовий мікс', price: 85, cat: 'Напої / Холодні', img: '/images/lemonade.png' },
        { name: 'Апельсиновий сік', desc: 'Свіжовичавлений', price: 95, cat: 'Напої / Холодні', img: '/images/orange_juice.png' },
        { name: 'Яблучний сік', desc: 'Натуральний', price: 70, cat: 'Напої / Холодні', img: '/images/apple_juice.png' },
        { name: 'Мохіто безалкогольний', desc: 'Лайм і м’ята', price: 90, cat: 'Напої / Холодні', img: '/images/mojito.png' },
        { name: 'Смузі ягідний', desc: 'Полуниця, банан', price: 110, cat: 'Напої / Холодні', img: '/images/berry_smoothie.png' },
        { name: 'Кола', desc: 'Газований напій', price: 50, cat: 'Напої / Холодні', img: '/images/cola.png' },
        { name: 'Вода', desc: 'Мінеральна негазована/газована', price: 35, cat: 'Напої / Холодні', img: '/images/water.png' },
        { name: 'Бургер', desc: 'Соковита яловичина', price: 220, cat: 'Їжа / Основні', img: '/images/burger.png' },
        { name: 'Чізбургер', desc: 'З сиром чеддер', price: 240, cat: 'Їжа / Основні', img: '/images/cheeseburger.png' },
        { name: 'Курячий бургер', desc: 'З хрусткою куркою', price: 210, cat: 'Їжа / Основні', img: '/images/chicken_burger.png' },
        { name: 'Паста Карбонара', desc: 'З беконом і вершками', price: 180, cat: 'Їжа / Основні', img: '/images/carbonara_pasta.png' },
        { name: 'Паста Болоньєзе', desc: 'З м’ясним соусом', price: 175, cat: 'Їжа / Основні', img: '/images/bolognese_pasta.png' },
        { name: 'Піца Маргарита', desc: 'Томат і сир', price: 200, cat: 'Їжа / Основні', img: '/images/margherita_pizza.png' },
        { name: 'Піца Пепероні', desc: 'З ковбасками', price: 230, cat: 'Їжа / Основні', img: '/images/pepperoni_pizza.png' },
        { name: 'Салат Цезар', desc: 'Курка, сир, соус', price: 160, cat: 'Їжа / Основні', img: '/images/caesar_salad.png' },
        { name: 'Салат Грецький', desc: 'Овочі та фета', price: 150, cat: 'Їжа / Основні', img: '/images/greek_salad.png' },
        { name: 'Картопля фрі', desc: 'Хрустка картопля', price: 90, cat: 'Їжа / Закуски', img: '/images/french_fries.png' },
        { name: 'Картопля по-селянськи', desc: 'Зі спеціями', price: 95, cat: 'Їжа / Закуски', img: '/images/potato_wedges.png' },
        { name: 'Нагетси', desc: 'Курячі шматочки', price: 120, cat: 'Їжа / Закуски', img: '/images/chicken_nuggets.png' },
        { name: 'Сирні палички', desc: 'Смажений сир', price: 130, cat: 'Їжа / Закуски', img: '/images/mozzarella_sticks.png' },
        { name: 'Крильця BBQ', desc: 'З соусом барбекю', price: 150, cat: 'Їжа / Закуски', img: '/images/bbq_wings.png' },
        { name: 'Тости з сиром', desc: 'Гарячі бутерброди', price: 85, cat: 'Їжа / Закуски', img: '/images/cheese_toast.png' },
        { name: 'Чізкейк', desc: 'Класичний сирний десерт', price: 120, cat: 'Десерти', img: '/images/cheesecake.png' },
        { name: 'Тірамісу', desc: 'Італійський десерт', price: 130, cat: 'Десерти', img: '/images/tiramisu.png' },
        { name: 'Шоколадний торт', desc: 'Насичений смак', price: 115, cat: 'Десерти', img: '/images/chocolate_cake.png' },
        { name: 'Морозиво', desc: 'Ваніль/шоколад/полуниця', price: 70, cat: 'Десерти', img: '/images/ice_cream.png' },
        { name: 'Панкейки', desc: 'З медом або сиропом', price: 110, cat: 'Десерти', img: '/images/pancakes.png' },
        { name: 'Круасан', desc: 'З маслом або шоколадом', price: 60, cat: 'Десерти', img: '/images/croissant.png' }
      ]
      for (const item of menuItems) {
        await sql`
          INSERT INTO products (name, description, price, category, image_url)
          VALUES (${item.name}, ${item.desc}, ${item.price}, ${item.cat}, ${item.img})
        `
      }
    })
    return { status: 'success', message: 'Database reset and initialized with seed data' }
  } catch (error: any) {
    console.error(error)
    throw createError({ statusCode: 500, message: error.message })
  } finally {
    await sql.end()
  }
})