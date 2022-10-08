--   Modification du type de la colonne date de timestamp en date car on ne stocke l'heure que pour la date de rédaction 

ALTER TABLE rapport ALTER COLUMN date TYPE date;

