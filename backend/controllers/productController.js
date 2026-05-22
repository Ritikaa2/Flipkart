const db = require('../config/db');

function parseSpecs(value) {
  if (!value) return {};
  if (typeof value === 'object') return value;
  try {
    return JSON.parse(value);
  } catch {
    return {};
  }
}

function withImages(products, images) {
  return products.map((product) => {
    const productImages = images.filter((image) => image.product_id === product.id);
    const mainImage = productImages.find((image) => image.is_primary === 1) || productImages[0];

    return {
      ...product,
      specifications: parseSpecs(product.specifications),
      image_url: mainImage?.image_url || '',
      images: productImages.map((image) => image.image_url)
    };
  });
}

const text = (value) => String(value || '').toLowerCase();

function productText(product) {
  return [
    product.name,
    product.category_name,
    product.description,
    JSON.stringify(parseSpecs(product.specifications))
  ].map(text).join(' ');
}

function matchesCategory(product, category) {
  if (!category) return true;
  return Number(product.category_id) === Number(category) || text(product.category_name) === text(category);
}

function words(search) {
  return text(search).split(/\s+/).filter(Boolean);
}

function matchScore(product, search) {
  if (!search) return 1;

  const query = text(search);
  const name = text(product.name);
  const category = text(product.category_name);
  const body = productText(product);

  let score = name.includes(query) ? 8 : 0;
  if (category.includes(query)) score += 5;

  for (const word of words(search)) {
    if (name.includes(word)) score += 4;
    else if (category.includes(word)) score += 3;
    else if (body.includes(word)) score += 1;
  }

  return score;
}

function searchedAndRelated(products, search) {
  if (!search) return products;

  const direct = products
    .map((product) => ({ ...product, search_score: matchScore(product, search) }))
    .filter((product) => product.search_score > 0)
    .sort((a, b) => b.search_score - a.search_score || a.id - b.id);

  const categories = new Set(direct.map((product) => product.category_id));
  const directIds = new Set(direct.map((product) => product.id));
  const related = products
    .filter((product) => categories.has(product.category_id) && !directIds.has(product.id))
    .map((product) => ({ ...product, search_score: 0 }));

  return [...direct, ...related];
}

async function loadProducts() {
  const [products] = await db.query(
    'SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id ORDER BY p.id ASC'
  );
  const [images] = await db.query('SELECT * FROM product_images');
  return withImages(products, images);
}

async function sendProducts(res, filters = {}) {
  let products = await loadProducts();
  products = products.filter((product) => matchesCategory(product, filters.category));
  products = searchedAndRelated(products, filters.search);

  if (filters.limit) {
    products = products.slice(0, Number(filters.limit));
  }

  res.json({ products });
}

exports.getAllProducts = async (req, res) => {
  try {
    await sendProducts(res, req.query);
  } catch (err) {
    console.error('Products error:', err);
    res.status(500).json({ message: 'Could not load products' });
  }
};

exports.searchProducts = async (req, res) => {
  if (!req.query.query) {
    return res.status(400).json({ message: 'Search query is required' });
  }

  try {
    await sendProducts(res, { search: req.query.query });
  } catch (err) {
    console.error('Search error:', err);
    res.status(500).json({ message: 'Could not search products' });
  }
};

exports.getProductsByCategory = async (req, res) => {
  try {
    await sendProducts(res, { category: req.params.category });
  } catch (err) {
    console.error('Category products error:', err);
    res.status(500).json({ message: 'Could not load category products' });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const [products] = await db.query('SELECT * FROM products WHERE id = ?', [req.params.id]);
    if (!products.length) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const [images] = await db.query('SELECT * FROM product_images WHERE product_id = ?', [req.params.id]);
    const [categories] = await db.query('SELECT * FROM categories');
    const product = withImages(products, images)[0];
    const category = categories.find((item) => Number(item.id) === Number(product.category_id));

    res.json({ product: { ...product, category_name: category?.name || '' } });
  } catch (err) {
    console.error('Product detail error:', err);
    res.status(500).json({ message: 'Could not load product' });
  }
};

exports.getCategories = async (_req, res) => {
  try {
    const [categories] = await db.query('SELECT * FROM categories');
    res.json({ categories });
  } catch (err) {
    console.error('Categories error:', err);
    res.status(500).json({ message: 'Could not load categories' });
  }
};
