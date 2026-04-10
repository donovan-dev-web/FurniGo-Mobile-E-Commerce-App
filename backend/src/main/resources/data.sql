DELETE FROM product_gallery_images;
DELETE FROM products;

INSERT INTO products (
    id,
    name,
    description,
    price,
    image_url,
    category,
    created_at
)
VALUES
    (
        '11111111-1111-1111-1111-111111111111',
        'Canapé Oslo',
        'Canapé 3 places en tissu gris clair, pieds en chêne naturel. Design scandinave épuré.',
        899.00,
        'canape-oslo-cover.jpg',
        'Salon',
        NOW()
    ),
    (
        '22222222-2222-2222-2222-222222222222',
        'Table Basse Finn',
        'Table basse ronde en bois massif de noyer. Diamètre 80cm, hauteur 40cm.',
        349.00,
        'table-finn-cover.jpg',
        'Salon',
        NOW()
    ),
    (
        '33333333-3333-3333-3333-333333333333',
        'Chaise Asta',
        'Chaise en velours vert sauge avec pieds dorés. Idéale salle à manger ou bureau.',
        189.00,
        'chaise-asta-cover.jpg',
        'Salle à manger',
        NOW()
    ),
    (
        '44444444-4444-4444-4444-444444444444',
        'Bibliothèque Saga',
        'Bibliothèque modulable 5 étagères en pin naturel. 180x80x30cm.',
        459.00,
        'bibliotheque-saga-cover.jpg',
        'Bureau',
        NOW()
    ),
    (
        '55555555-5555-5555-5555-555555555555',
        'Lit Vera',
        'Lit double 160x200 en bois de chêne huilé avec tête de lit rembourrée en lin naturel.',
        1290.00,
        'lit-vera-cover.jpg',
        'Chambre',
        NOW()
    ),
    (
        '66666666-6666-6666-6666-666666666666',
        'Lampe Arc Lumi',
        'Lampadaire arc en métal noir mat. Hauteur 180cm, abat-jour en coton blanc.',
        229.00,
        'lampe-arc-lumi-cover.jpg',
        'Décoration',
        NOW()
    ),
    (
        '77777777-7777-7777-7777-777777777777',
        'Bureau Nori',
        'Bureau en MDF blanc avec 2 tiroirs et niche de rangement. 120x60x75cm.',
        319.00,
        'bureau-nori-cover.jpg',
        'Bureau',
        NOW()
    ),
    (
        '88888888-8888-8888-8888-888888888888',
        'Fauteuil Bergère Elsa',
        'Fauteuil bergère en bouclette crème. Structure en hêtre laqué blanc. Ultra confortable.',
        549.00,
        'fauteuil-elsa-cover.jpg',
        'Salon',
        NOW()
    );

INSERT INTO product_gallery_images (product_id, sort_order, image_name)
VALUES
    ('11111111-1111-1111-1111-111111111111', 0, 'canape-oslo-cover.jpg'),
    ('11111111-1111-1111-1111-111111111111', 1, 'canape-oslo-detail-1.jpg'),
    ('11111111-1111-1111-1111-111111111111', 2, 'canape-oslo-detail-2.jpg'),
    ('22222222-2222-2222-2222-222222222222', 0, 'table-finn-cover.jpg'),
    ('22222222-2222-2222-2222-222222222222', 1, 'table-finn-detail-1.jpg'),
    ('22222222-2222-2222-2222-222222222222', 2, 'table-finn-detail-2.jpg'),
    ('33333333-3333-3333-3333-333333333333', 0, 'chaise-asta-cover.jpg'),
    ('33333333-3333-3333-3333-333333333333', 1, 'chaise-asta-detail-1.jpg'),
    ('33333333-3333-3333-3333-333333333333', 2, 'chaise-asta-detail-2.jpg'),
    ('44444444-4444-4444-4444-444444444444', 0, 'bibliotheque-saga-cover.jpg'),
    ('44444444-4444-4444-4444-444444444444', 1, 'bibliotheque-saga-detail-1.jpg'),
    ('44444444-4444-4444-4444-444444444444', 2, 'bibliotheque-saga-detail-2.jpg'),
    ('55555555-5555-5555-5555-555555555555', 0, 'lit-vera-cover.jpg'),
    ('55555555-5555-5555-5555-555555555555', 1, 'lit-vera-detail-1.jpg'),
    ('55555555-5555-5555-5555-555555555555', 2, 'lit-vera-detail-2.jpg'),
    ('66666666-6666-6666-6666-666666666666', 0, 'lampe-arc-lumi-cover.jpg'),
    ('66666666-6666-6666-6666-666666666666', 1, 'lampe-arc-lumi-detail-1.jpg'),
    ('66666666-6666-6666-6666-666666666666', 2, 'lampe-arc-lumi-detail-2.jpg'),
    ('77777777-7777-7777-7777-777777777777', 0, 'bureau-nori-cover.jpg'),
    ('77777777-7777-7777-7777-777777777777', 1, 'bureau-nori-detail-1.jpg'),
    ('77777777-7777-7777-7777-777777777777', 2, 'bureau-nori-detail-2.jpg'),
    ('88888888-8888-8888-8888-888888888888', 0, 'fauteuil-elsa-cover.jpg'),
    ('88888888-8888-8888-8888-888888888888', 1, 'fauteuil-elsa-detail-1.jpg'),
    ('88888888-8888-8888-8888-888888888888', 2, 'fauteuil-elsa-detail-2.jpg');
