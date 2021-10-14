const AWS = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");

var dynamodb = new AWS.DynamoDB({
  apiVersion: "2012-08-10",
  endpoint: "http://dynamodb:8000",
  region: "us-west-2",
  credentials: {
    accessKeyId: "2345",
    secretAccessKey: "2345",
  },
});
var docClient = new AWS.DynamoDB.DocumentClient({
  apiVersion: "2012-08-10",
  service: dynamodb,
});

exports.handler = async (event) => {
  console.log("EVENTO: ", event);

  switch (event.httpMethod) {
    //Método para obtener envío
    case "GET":
      if (event.path === "/envios/pendientes") {
        let params = {
          TableName: 'Envio',
          IndexName: 'EnviosPendientesIndex'
        };

        try {
          console.log("Get");
          const envios = await docClient.scan(params).promise();
          return {
            statusCode: 200,
            headers: { "content-type": "application/json" },
            body: JSON.stringify(envios),
          };
        } catch (err) {
          console.log("ERROR: ", err);
          return {
            statusCode: 500,
            headers: { "content-type": "text/plain" },
            body: "El listado de envíos pendientes no se pudo obtener.",
          };
        }
      }

    //Método para la creación de envío
    case "POST":
      if (event.path === "/envios") {
        let body = JSON.parse(event.body);
        if (!body.destino || !body.email) {
          return {
            statusCode: 400,
            headers: { "content-type": "application/json" },
            body: "La creación del envío ha fallado",
          };
        }
        let params = {
          TableName: "Envio",
          Item: {
            id: uuidv4(),
            fechaAlta: new Date().toISOString(),
            destino: body.destino,
            email: body.email,
            pendiente: new Date().toISOString(),
          },
        };

        try {
          await docClient.put(params).promise();
          return {
            statusCode: 201,
            headers: { "content-type": "application/json" },
            body: JSON.stringify(params.Item),
          };
        } catch {
          return {
            statusCode: 500,
            headers: { "content-type": "text/plain" },
            body: "Fallo en la creación del envío",
          };
        }
      }

    //Método para la modificación de un envío
    case "PUT":
      if (event.path === `/envios/${event.pathParameters.idEnvio}/entregado`) {
        const idEnvio = (event.pathParameters || {}).idEnvio || false;
        let params = {
          TableName: "Envio",
          Key: {
            id: idEnvio,
          },
          UpdateExpression: "remove pendiente",
          ConditionExpression: "attribute_exists(pendiente)",
          ReturnValues: "UPDATED_NEW",
        };

        try {
          await docClient.update(params).promise();
          return {
            statusCode: 200,
            headers: { "content-type": "text/plain" },
            body: `El envío con el id: ${idEnvio} ha sido entregado.`,
          };
        } catch {
          return {
            statusCode: 500,
            headers: { "content-type": "text/plain" },
            body: `Error al momento de actualizar el envío con el id: ${idEnvio}.`,
          };
        }
      }

    //En caso de obtener un error, arrojar el siguiente mensaje
    default:
      return {
        statusCode: 400,
        headers: { "content-type": "text/plain" },
        body: `Método ${httpMethod} no soportado.`,
      };
  }
};
