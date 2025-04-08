-- Vytvoření tabulky pro uživatele
CREATE TABLE IF NOT EXISTS uzivatele (
    id SERIAL PRIMARY KEY,
    jmeno VARCHAR(100) UNIQUE NOT NULL,
    heslo VARCHAR(100) NOT NULL
);

-- Vložení existujících uživatelů - bezpečnější přístup pomocí ON CONFLICT
INSERT INTO uzivatele (id, jmeno, heslo) 
VALUES (1, 'test', '$2a$10$wLsMOrScaMkEdjkQbz9W..5NPZplC/t9ffj6vUFvA4rqHGNgLVnM2')
ON CONFLICT (jmeno) DO NOTHING;

INSERT INTO uzivatele (id, jmeno, heslo) 
VALUES (2, 'senkyr', '$2a$10$0EZI7iJxxn.6pWvUgnK4o.7yEdP22bLycrK6j3RWpCV.Xegd6f4fm')
ON CONFLICT (jmeno) DO NOTHING;

-- Resetování sekvence pro automatické ID na poslední hodnotu + 1
SELECT setval('uzivatele_id_seq', COALESCE((SELECT MAX(id) FROM uzivatele), 0) + 1, false);
