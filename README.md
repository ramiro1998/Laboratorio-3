# Laboratorio-3
Laboratorio 3 de computación en la nube


Para crear el contenedor utilizar el siguiente comando:
docker run -p 8000:8000 --network awslocal --name dynamobd amazon/dynamodb-local:1.16.0 -jar DynamoDBLocal.jar -sharedDb

Instrucción para crear la tabla y su índice:
Ingresar a http://localhost:8000/shell/ , luego copiar lo que se encuentra en el archivo "GeneracionTablaDynamodb.txt

Instalar las dependencias:
npm install

Ejecutar la API:

sam local start-api --docker-network awslocal

Métodos:
GET:
http://127.0.0.1:3000/envios

PUT:
http://127.0.0.1:3000/envios/${id}/pendientes
