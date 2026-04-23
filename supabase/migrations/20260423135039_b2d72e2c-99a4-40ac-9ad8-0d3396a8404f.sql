UPDATE products SET images = jsonb_build_array('https://apfvvhishvyjithdshdr.supabase.co/storage/v1/object/public/product-images/' || slug || '.jpg')
WHERE category = 'piece' AND slug IN (
  'adaptateur-boite-vitesse','aile-avant','bache-devant','batterie-12v-moto','boite-pignon',
  'cable-de-frein','carrenage','clacson-arriere','clacson-devant','filtre-complet',
  'guidon','maitre-cylindre','maitre-cylindre-principale','reservoir-dessence','ressort-a-lames',
  'robinet-dessence','tige-pignon','vilebrequin'
);

UPDATE products SET images = jsonb_build_array('https://apfvvhishvyjithdshdr.supabase.co/storage/v1/object/public/product-images/batterie.jpg')
WHERE slug = 'batterie-12v-moto';