$("#btnBuscar").click(function () {
    var menu = $('#menu').val();
    var estado = $('#filtrar__estado').val();
    var tbody = $("#listado_menu tbody");
    tbody.find('tr').remove();
    
    $.ajax({
        url: path + "seguridad/usuariosXmenu",
        type: "POST",
        data: {
            menu: menu,
            estado: estado,
            opcion: "listar"
        },
        beforeSend: function () {
            $('.text-loader').text('CARGANDO CURSOS, POR FAVOR ESPERE...');
            $("#modalLoader").modal();
        },
        success: function(data) {
            var datos = JSON.parse(data);
            console.log(datos);
            if (datos.respuesta == "success") {
                if (datos.listado != null) {
                    var listados = datos.listado;
                    var areas = {}; 
                    var usedColors = []; 
                    for (var i = 0; i < listados.length; i++) {
                        var lista = listados[i];
                        var area = lista.Area;
                        if (!areas[area]) {
                            areas[area] = [];
                        }
                        areas[area].push(lista);
                    }
                    for (var area in areas) {
                        var listadosArea = areas[area];
                        var color = generateUniqueSoftColor(usedColors);
                        for (var j = 0; j < listadosArea.length; j++) {
                            var listadoArea = listadosArea[j];
                            var trLista = "<tr>";
                            if (j === 0) {
                                trLista += "<td class=\"celda-centrada\" style=\"font-weight: bold;background-color: " + color + ";'\" rowspan=\"" + listadosArea.length + "\">" + area + "</td>";
                            }
                            trLista +=
                            "    <input type=\"hidden\" id=\"" + listadoArea.id_menu +"\" name=\"vacio[]\" value=\"" + listadoArea.id_menu + "\">" +
                            "    <td class=\"celda-izquierda\">" + listadoArea.id_usuario + "</td>" +
                            "    <td class=\"celda-izquierda\">" + listadoArea.Usuario + "</td>" +
                            "</tr>";
                            tbody.append(trLista);
                        }
                        usedColors.push(color);
                    }
                    $("#modalLoader").modal("hide");
                    Notiflix.Notify.Success("OPERACIÓN ÉXITOSA.");
                } else {
                    $("#modalLoader").modal("hide");
                    $("#listado_menu tbody").html("<tr><td colspan='3' class='text-center' ><b>NO SE ENCONTRO INFORMACIÓN PARA CARGAR</b></td></tr>")
                    Notiflix.Notify.Warning('AVISO DE SISTEMA');
                }
            } else {
                $("#listado_menu tbody").html("<tr><td colspan='3' class='text-center' ><b>NO SE ENCONTRO INFORMACIÓN PARA CARGAR</b></td></tr>")
                Notiflix.Notify.Warning('NO SE ENCONTRO INFORMACIÓN PARA CARGAR');
                $("#modalLoader").modal("hide");
            }
        }
    });
});

function generateUniqueSoftColor(usedColors) {
    var color;
    do {
        color = generateSoftColor();
    } while (usedColors.includes(color)); 
    return color;
}

function generateSoftColor() {
    var letters = '89ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * letters.length)];
    }
    return color;
}



