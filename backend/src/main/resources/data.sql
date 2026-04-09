INSERT INTO
    products (
        id,
        name,
        description,
        price,
        image_url,
        category,
        created_at
    )
VALUES (
        gen_random_uuid (),
        'Canapé Oslo',
        'Canapé 3 places en tissu gris clair, pieds en chêne naturel. Design scandinave épuré.',
        899.00,
        '/uploads/products/canape-oslo.jpg',
        'Salon',
        NOW()
    ),
    (
        gen_random_uuid (),
        'Table Basse Finn',
        'Table basse ronde en bois massif de noyer. Diamètre 80cm, hauteur 40cm.',
        349.00,
        '/uploads/products/table-finn.jpg',
        'Salon',
        NOW()
    ),
    (
        gen_random_uuid (),
        'Chaise Asta',
        'Chaise en velours vert sauge avec pieds dorés. Idéale salle à manger ou bureau.',
        189.00,
        '/uploads/products/chaise-asta.jpg',
        'Salle à manger',
        NOW()
    ),
    (
        gen_random_uuid (),
        'Bibliothèque Saga',
        'Bibliothèque modulable 5 étagères en pin naturel. 180x80x30cm.',
        459.00,
        '/uploads/products/bibliotheque-saga.jpg',
        'Bureau',
        NOW()
    ),
    (
        gen_random_uuid (),
        'Lit Vera',
        'Lit double 160x200 en bois de chêne huilé avec tête de lit rembourrée en lin naturel.',
        1290.00,
        '/uploads/products/lit-vera.jpg',
        'Chambre',
        NOW()
    ),
    (
        gen_random_uuid (),
        'Lampe Arc Lumi',
        'Lampadaire arc en métal noir mat. Hauteur 180cm, abat-jour en coton blanc.',
        229.00,
        '/uploads/products/lampe-lumi.jpg',
        'Décoration',
        NOW()
    ),
    (
        gen_random_uuid (),
        'Bureau Nori',
        'Bureau en MDF blanc avec 2 tiroirs et niche de rangement. 120x60x75cm.',
        319.00,
        '/uploads/products/bureau-nori.jpg',
        'Bureau',
        NOW()
    ),
    (
        gen_random_uuid (),
        'Fauteuil Bergère Elsa',
        'Fauteuil bergère en bouclette crème. Structure en hêtre laqué blanc. Ultra confortable.',
        549.00,
        '/uploads/products/fauteuil-elsa.jpg',
        'Salon',
        NOW()
    );