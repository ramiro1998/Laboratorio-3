
var params = {
    //Nombre de la tabla
    TableName: "Envio",
    //Atributos de la tabla
    AttributeDefinitions: [
        { AttributeName: "id", AttributeType: "S" },
        { AttributeName: "pendiente", AttributeType: "S" }
    ],
    //Índices globales secundarios
    GlobalSecondaryIndexUpdates: [
        {
            Create: {
                IndexName: "EnviosPendientesIndex",
                KeySchema: [
                    { AttributeName: "id", KeyType: "HASH" }, //Atributo de partición
                    { AttributeName: "pendiente", KeyType: "RANGE" }, //Atributo que se utiliza para ordenar
                ],
                Projection: {
                    "ProjectionType": "ALL"
                },
                ProvisionedThroughput: {
                    "ReadCapacityUnits": 1, "WriteCapacityUnits": 1
                }
            }
        }
    ]
}
dynamodb.updateTable(params, function (err, data) {
    if (err) {
        console.log("Error al momento de crear la tabla")
    } else {
        console.log("La tabla ha sido creada con éxito")
    }
});