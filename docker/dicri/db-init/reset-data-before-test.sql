-- USE THIS IN DEV ENV
USE mp_dicri_db;
GO

update expedientes set activo  = 1 where 1=1;
update indicios  set activo = 1 where 1 = 1;

update expedientes set estado = 'BORRADOR' WHERE id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1';
update expedientes set estado = 'EN_REVISION' WHERE id = '76c1702e-9dbe-4d69-b8d0-1b0a38e6a111';