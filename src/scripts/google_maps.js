function calcular_distancia(enderecos) {
    enderecos = ["Rua Tiradentes 458, Sapucaia do Sul, RS, 93214-000"]
    /* FIXME - Calcular a distancia de mais endereços de uma só vez 
    para diminuir a cobrança da API 
    */
    // Obter localização atual do usuário
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            const latAtual = position.coords.latitude;
            const lngAtual = position.coords.longitude;


            const service = new google.maps.DistanceMatrixService();

            service.getDistanceMatrix(
                {
                    origins: [{ lat: latAtual, lng: lngAtual }],
                    destinations: enderecos,
                    travelMode: 'DRIVING', // Pode ser 'DRIVING', 'WALKING', 'BICYCLING', 'TRANSIT'
                    unitSystem: google.maps.UnitSystem.METRIC,
                }, callback);

            function callback(response, status) {
                if (status == 'OK') {
                    const origem = response.originAddresses[0];
                    const destino = response.destinationAddresses[0];
                    const distancia = response.rows[0].elements[0].distance.text;
                    const duracao = response.rows[0].elements[0].duration.text;

                    //console.log(`Distância entre ${origem} e ${destino}\n é de ${distancia}`);
                } else {
                    //console.log('Erro ao calcular distância: ' + status);
                }
            }
        })
    } else {
        alert("Geolocalização não é suportada por este navegador.");
    }
}
//calcularDistancia()