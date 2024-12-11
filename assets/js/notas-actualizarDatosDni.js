const language = {
    "processing": "Procesando...",
    "lengthMenu": "Mostrar _MENU_ registros",
    "zeroRecords": "No se encontraron resultados",
    "emptyTable": "No se encontraron registros",
    "infoEmpty": "Mostrando registros del 0 al 0 de un total de 0 registros",
    "infoFiltered": "(filtrado de un total de _MAX_ registros)",
    "search": "Buscar:",
    "infoThousands": ",",
    "loadingRecords": "Cargando...",
    "paginate": {
        "first": "Primero",
        "last": "Último",
        "next": "Siguiente",
        "previous": "Anterior"
    },
    "info": "Mostrando _START_ a _END_ de _TOTAL_ registros"
};

$(document).ready(function () {

    results = []
    length = 0

});

$("#btnInsertar").click(function () {

    mejoraInsertarDatos()

    //insertarTodoApiCompleto();

    //insertarDatos()

})

function mejoraInsertarDatos() {
    ///const semestre = $("#semestre").val();

    $.ajax({
        url: path + "notas/actualizarDatosDni",
        type: "POST",
        data: {
            semestre: '2024-I',
            opcion: 'listar'
        },
        beforeSend: function () {
            $('.text-loader').text('INSERTANDO DATOS, por favor espere...');
            $("#modalLoader").modal();
        },
        success: function (data) {
            var datos = JSON.parse(data);

            results = datos.data;
            length = results.length;

            procesarConsultaAPI();
        }
    });
}





function procesarConsultaAPI() {
    if (results.length) {

        dni = results[0].dni.trim()
        //new_cod_alumno = results[0].cod_alumno.trim()
        id_periodo = results[0].periodo.trim()

        $.ajax({
            url: path + "notas/actualizarDatosDni",
            type: "POST",
            data: {
                dni: dni,
                opcion: 'consultarDNIApi'
            },
            success: function (data) {
                const datos = JSON.parse(data);
                const dni_new = datos.dni;
                if (datos.data !== null) {
                    if (datos.data.success === true) {

                        resp = datos.data.data

                        insertarCompletoData(id_periodo, dni_new, resp.nombre_completo, resp.apellido_paterno, resp.apellido_materno, resp.nombres, resp.fecha_nacimiento); //Todo success
                        console.log((length - results.length) + 1, "DE", length, "DNI", dni, "->", datos.data.success)
                        results.shift();
                        procesarConsultaAPI()
                    } else {
                        insertarCompletoData(id_periodo, dni_new, "", "", "", "", ""); //No existe DNI
                        console.log((length - results.length) + 1, "DE", length, "DNI", dni_new, "->", datos.data.success)
                        results.shift();
                        procesarConsultaAPI()
                    }
                } else {
                    insertarCompletoData(id_periodo, dni_new, "reset", "reset", "reset", "reset", "reset"); //Fallo peticion api, volver a correrlo
                    console.log((length - results.length) + 1, "DE", length, "DNI", dni_new, "->", "reset")
                    results.shift();
                    procesarConsultaAPI()
                }


            }
        });
    } else {
        console.log("PROCESO COMPLETADO CON EXITO")
    }
}


$("#btnConsultar").click(function () {
    console.log("Ejecutando función")

    $("#modalLoader").modal(),
        $('.text-loader').text('CARGANDO INFORMACIÓN, POR FAVOR ESPERE...'),

        setTimeout(() => {
            $('#tablaListado').hide();
            $('#tablaListado_2').hide();
            //$('#tablaListado_2').dataTable().fnDestroy();
            ejecutarFuncionEgresados()
                .then(() => setTimeout(() => {
                    $('#tablaListado').show();
                    $('#tablaListado_2').show();
                    //$("#modalLoader").modal("hide")
                }, 4000))
                .catch(() => setTimeout(() => {
                    $("#modalLoader").modal("hide")
                    Notiflix.Notify.Failure('Actualize la pagina por favor...');
                }, 4000))
        }, 500);


})


function ejecutarFuncionEgresados() {
    return new Promise((resolve, reject) => {
        // Código que toma mucho tiempo
        //tablaResumen();
        //resolve(tablaResumen(), tablaDetalle() )
        resolve(tablaResumen())
    })
}



function tablaResumen() {
    const semestre = $("#semestre").val();

    //$('#tablaListado').empty();
    $('#tablaDNI').dataTable().fnDestroy();
    $("#tablaDNI").DataTable({
        ordering: false,
        dom: 'lBfrtip',
        buttons: [
            {
                "extend": 'excel',
                "text": 'Exportar Excel',
                "className": 'btn_excel_datatable',
                'filename': 'Reporte'
            }
        ],
        ajax: {
            url: path + "Notas/actualizarDatosDni",
            type: "POST",
            dataType: "JSON",
            data: {
                opcion: "listar",
                semestre: semestre
            },
            beforeSend: function () {
                $("#modalLoader").modal();
                $('.text-loader').text('CARGANDO INFORMACIÓN, POR FAVOR ESPERE...');
            },
            complete: function () {
                $("#modalLoader").modal("hide");
            },
            dataSrc: function (response) {
                console.log(response.data);
                if (response.respuesta === "error") {
                    return {}
                } else {
                    return response.data;
                }
            },
        },
        columnDefs: [
            {
                targets: '_all',
                className: 'celda-centrada',
                orderable: false
            }
        ],
        lengthMenu: [
            [50, 75, 100],
            [50, 75, 100]
        ],
        columns: [
            // {
            //     data: null,
            //     render: function (data) {
            //         return data.UltSemestre;
            //     }
            // },
            {
                data: null,
                render: function (data) {
                    return data.cod_alumno;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.Apellidos;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.Nombres;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.dni;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.sexo;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.FecNac;
                }
            }
            // {
            //     data: null,
            //     render: function (data) {
            //         return "<button class=\"btn boton-tabla boton-naranja\" type=\"button\" onclick=\"tablaDetalle('"+data.UltSemestre+"');\" title=\"Ver Detalle\"><span class=\"icon-eye\"></span></button>";
            //     }
            // }
        ],
        language: language
    });
}

// function insertarDatos() {
//     const semestre = $("#semestre").val();

//     $.ajax({
//         url: path + "notas/actualizarDatosDni",
//         type: "POST",
//         data: {
//             semestre: semestre,
//             opcion: 'listar'
//         },
//         beforeSend: function () {
//             $('.text-loader').text('INSERTANDO DATOS, por favor espere...');
//             $("#modalLoader").modal();
//         },
//         success: function (data) {
//             var datos = JSON.parse(data);
//             if (datos.respuesta == "success") {
//                 console.log(datos)

//                 datex = datos.data

//                 console.log("TOTAL: ", datex.length)

//                 datex.forEach(function (valor, index, array) {
//                     setTimeout(function () {
//                         id = datex[index];
//                         dni = id.dni.trim();

//                         $.ajax({
//                             url: path + "notas/actualizarDatosDni",
//                             type: "POST",
//                             data: {
//                                 dni: dni,
//                                 opcion: 'consultarDNIApi'
//                             },
//                             success: function (data) {
//                                 var datos = JSON.parse(data);
//                                 if (datos.data.success === true) {
//                                     //console.log("API", datos)

//                                     resp = datos.data.data

//                                     // dni = resp.numero
//                                     // if (resp.apellido_paterno != null) { ape_parterno = resp.apellido_paterno } else { ape_parterno = ""}
//                                     // if (resp.apellido_materno != null) { ape_materno = resp.apellido_materno } else { ape_materno = ""}
//                                     // if (resp.nombres != null) { nombres = resp.nombres } else { nombres = ""}
//                                     // if (resp.sexo != null) { sexo = resp.sexo == "FEMENINO" ? "F" : "M"  }else{ sexo = ""}
//                                     // if (resp.fecha_nacimiento != null) { fechaNac = resp.fecha_nacimiento } else { fechaNac  = ""}

//                                     ape_parterno = resp.apellido_paterno
//                                     ape_materno = resp.apellido_materno
//                                     nombres = resp.nombres
//                                     fechaNac = resp.fecha_nacimiento

//                                     insertarCompletoData(dni, ape_parterno, ape_materno, nombres, "", fechaNac);
//                                     console.log((index + 1), "DNI", dni, "->", datos.data.success)

//                                 } else {
//                                     //console.log("API", datos)
//                                     dni_false = datos.dni
//                                     insertarCompletoData(dni_false, "", "", "", "", "");
//                                     console.log((index + 1), "DNI", dni, "->", datos.data.success)
//                                 }
//                             }
//                         });

//                     }, index * 500);

//                 });


//             } else {
//                 console.log("error");
//             }
//         }
//     });
// }

function insertarCompletoData(id_periodo, dni, nombre_completo, apellido_paterno, apellido_materno, nombres, fecha_nacimiento) {
    $.ajax({
        url: path + "notas/actualizarDatosDni",
        type: "POST",
        data: {
            id_periodo: id_periodo,
            dni: dni,            
            nombre_completo: nombre_completo,
            apellido_paterno: apellido_paterno,
            apellido_materno: apellido_materno,
            nombres: nombres,
            fecha_nacimiento: fecha_nacimiento,
            // ape_materno: ape_materno,
            // nombres: nombres,
            // fechaNac: fechaNac,
            opcion: 'insertarTabla'
        },
        success: function (data) {

        }
    });
}



////////////////////////////////////////////////////

function insertarTodoApiCompleto() {
    const semestre = $("#semestre").val();

    $.ajax({
        url: path + "notas/actualizarDatosDni",
        type: "POST",
        data: {
            semestre: semestre,
            opcion: 'insertarTodoApiCompleto'
        },
        success: function (data) {
            var datos = JSON.parse(data);
            if (datos.respuesta == "success") {
                console.log(datos)
            } else {
                console.log("error");
            }
        }
    });
}