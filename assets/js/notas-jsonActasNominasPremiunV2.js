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

    //cargarInstituciones(true);
    //cargarSedes();

    Notiflix.Loading.Init({
        clickToClose: true
    });

    $("#btnNuevoPremiun").click(function () {
        $("#codigoBus").val("");
        //$("#apellidosNombresBus").val("");
        //$("#tablaModalAlumno tbody").find('tr').remove();
        $("#codigoBus").focus();
        $("#contenedor_tipo").hide()
        $("#modalNuevoAlumno").modal({backdrop: 'static', keyboard: false});

        //$("#alumno").val( ui.item.codigo +" - "+ui.item.nombre);
        $("#alumnoSelecc").next('i').removeClass('glyphicon-remove');
        $("#alumnoSelecc").next('i').addClass('glyphicon-ok');
        $("#alumnoSelecc").parent().removeClass('has-error');
        $("#alumnoSelecc").parent().addClass('has-success');
    });

})

$("#codigoBusPremiun").keydown(function (event) {
    if (event.keyCode == 13) {
        buscarAlumnoJSON();
        $("#alumnoInsert").html('')
        $("#codAlumnoInsert").val('')
        $("#tipoActa").val('')
        $("#seccionInsert").val('')
        $("#cicloInsert").val('')
        $("#turnoInsert").val('')
        
    }
});

$("#cerrarNuevoModal").click(function(){
    $("#alumnoInsert").html('')
    $("#codigoBusPremiun").val('')
    $("#codAlumnoInsert").val('')
    $("#tipoActa").val('')
    $("#seccionInsert").val('')
    $("#cicloInsert").val('')
    $("#turnoInsert").val('')
    document.getElementById("alumnoInsert").style.borderColor = "#d2d6de";
})


$("#alumnoInsert").change(function (event) {
    var codigoBusPremiun = $("#alumnoInsert").val().trim();

    detalle = codigoBusPremiun.split("-")
    //var periodoAlumno = $("#periodoAlumno").val().trim();

    $('#insertarAlumno').attr('disabled', false);
    console.log("codigoBusPremiun", codigoBusPremiun);
    console.log("Al", detalle);
    $('#seccionInsert').val(detalle[0].trim())
    $('#cicloInsert').val(detalle[1].trim())
    $('#turnoInsert').val(detalle[2].trim())
    $('#codAlumnoInsert').val(detalle[3].trim())
    // $.ajax({
    //     url: path + "notas/jsonActasNominasPremiunV2",
    //     type: "POST",
    //     data: {
    //         codigoBusPremiun: codigoBusPremiun,
    //         periodo: periodoAlumno,
    //         opcion: "buscarAlumnoInsert"
    //     },
    //     success: function (data) {
    //         var datos = JSON.parse(data);
    //         if (datos.respuesta == "success") {
    //             if (datos.alumnos != "vacio") {
    //                 $('#insertarAlumno').attr('disabled', false);
    //                 var alumnos = datos.alumnos;
    //                 console.log("Al", alumnos);
    //                 $('#seccionInsert').val(alumnos[0].cod_seccion.trim())
    //                 $('#cicloInsert').val(alumnos[0].cod_ciclo.trim())
    //                 $('#turnoInsert').val(alumnos[0].cod_turno.trim())
    //             } else {
    //                 mostrarMensaje("error", "ERROR", "No existe el alumno en este periodo.");
    //             }
    //         } else {
    //             var errores = "";
    //             for (i = 0; i < datos.errores.length; i++) {
    //                 errores += datos.errores[i] + "<br>";
    //             }
    //             mostrarMensaje("error", "ERROR", errores);
    //         }
    //     }
    // });
})

$("#procesar").click(function (e) {

    procesarJson(false, "procesar")

})

$("#procesarCompleto").click(function (e) {

    procesarJson(true,  "procesarCompleto")

})

// $("#periodoAlumno").change(function () {
//     if(this.value > "2022"){
//         $("#contenedor_tipo").show("200")
//     }else{
//         $("#contenedor_tipo").hide("200")
//     }
// })

$('#insertarAlumno').click(function (e) {

    insertarAlumno($('#periodoAlumno').val(), $('#codAlumnoInsert').val(), $("#tipoActa").val(), $('#seccionInsert').val(), $('#cicloInsert').val(), $('#turnoInsert').val())
})

function buscarAlumnoJSON() {
    var codigoBusPremiun = $("#codigoBusPremiun").val().trim();
    var periodoAlumno = $("#periodoAlumno").val().trim();

    if (codigoBusPremiun == "" && periodoAlumno == "") {
        $("#errorAlumnoBus").html("Debe ingresar el código o apellidos y nombres a buscar");
        $("#errorAlumnoBus").css("display", "block");
        return false;
    } else {
        $("#errorAlumnoBus").html("");
        $("#errorAlumnoBus").css("display", "none");
    }

    $.ajax({
        url: path + "notas/jsonActasNominasPremiunV2",
        type: "POST",
        data: {
            codigoBusPremiun: codigoBusPremiun,
            periodo: periodoAlumno,
            opcion: "buscarAlumnoInsert"
        },
        success: function (data) {
            var datos = JSON.parse(data);
            if (datos.respuesta == "success") {
                if (datos.alumnos != "vacio") {
                    document.getElementById("alumnoInsert").style.borderColor = "#22c55e";
                    var alumnos = datos.alumnos;
                    $("#alumnoInsert").append("<option value=\"\" selected disabled hidden>Seleccione...</option>");
                    for (i = 0; i < alumnos.length; i++) {
                        var alumno = alumnos[i];
                        $("#alumnoInsert").append("<option value=\"" + alumno.cod_seccion +"-"+ alumno.cod_ciclo +"-"+ alumno.cod_turno +"-"+ alumno.Cod_alumno + "\">" + alumno.Cod_alumno +  " - " + alumno.Alumno + "</option>");
                    }
                } else {
                    Notiflix.Notify.Warning("NO EXISTE EL ALUMNO EN ESTE PERIODO.")
                }
                // if (datos.alumnos != "vacio") {
                //     var alumnos = datos.alumnos;
                //     for (i = 0; i < alumnos.length; i++) {
                //         var alumno = alumnos[i];
                //         var tr = "<tr ondblclick=\"seleccionarAlumno(this);\">" +
                //                 "<td class=\"celda-centrada\">" + alumno.cod_alumno + "</td>" +
                //                 "<td>" + alumno.apellidos_nombres + "</td>" +
                //                 "</tr>";
                //         tbody.append(tr);
                //     }
                // }
            } else {
                var errores = "";
                for (i = 0; i < datos.errores.length; i++) {
                    errores += datos.errores[i] + "<br>";
                }
                mostrarMensaje("error", "ERROR", errores);
            }
        }
    });
}

function procesarJson(completo, tipo){
    $.ajax({
        url: path + "notas/jsonActasNominasPremiunV2",
        type: "POST",
        dataType: "JSON",
        data: {
            opcion: "procesar",
            tipo: $("#tipo").val(),
            periodo: $("#periodo").val(),
            jsonCompleto: completo
        },
        beforeSend: function () {
            $("#contenidoModal").html("");
            //$('.text-loader').text('ESTE PROCESO PUEDE TOMAR UNOS MINUTOS, POR FAVOR ESPERE...');
            //$("#modalLoader").modal();

            $("#"+tipo).prop("disabled",true).html("PROCESANDO Y GENERANDO...")
        },
        complete: function () {            
        },
        success: function (datos) {

            console.log("dataos ", datos);

            if (datos.respuesta === "success") {
                
                datos.data.forEach((json, index) => {
                    
                    const jsontext = JSON.stringify(json);
                    
                    $("#contenidoModal").append(`<div>                    
                        <label>${$("#tipo").val()} ${index + 1}</label>                        
                        <div class="row">
                            <div class="col-lg-10 col-md-10 col-sm-12 col-xs-12 row-fila">                    
                                <input readonly type="text" maxlength="9999999" value='${jsontext.substring(0, 50)}......' class="form-control"/>
                            </div>
                            <div class="col-lg-2 col-md-2 col-sm-12 col-xs-12 row-fila text-center">
                                <span style="display:none" > ${jsontext} </span>                                                                                          
                                <button class="btn boton-tabla boton-azul" type="button" onclick="copiarContenido(this);"><span class="icon-copy"></span></button>
                                <button class="btn boton-tabla boton-rojo" index="${index+1}" type="button" onclick="descargarJson(this);"><span class="icon-download2"></span></button>
                            </div>
                        </div>                    
                    </div>`);                  
                    
                });

                $("#tipoArchivo").text($("#tipo").val().toUpperCase() + " | " + $("#periodo").val());
                $("#modalMostrarActasNominas").modal({ backdrop: 'static', keyboard: false });
                Notiflix.Notify.Success("EL ARCHIVO JSON SE GENERO CORRECTAMENTE");
                //$("#modalLoader").modal("hide");  
                $("#"+tipo).prop("disabled", false).html('<span class="icon-cloud-upload" style="padding-right:10px"></span>GENERAR JSON');     

            } else {

                Notiflix.Notify.Success("OCURRIO UN ERROR INESPERADO, POR FAVOR RECARGUE LA PÁGINA Y VUELVA A INTENTARLO --> " + datos.error)

            }

        }
    });
}

function descargarJson(btn){

    const jsontext = $(btn).prev().prev("span").html();    
    var data, filename, link;
    var csv = 'data:text/json;charset=utf-8,' + jsontext;
    filename = ($("#tipo").val() + "-" + $("#periodo").val() + "-" + $(btn).attr("index") + ".json") || 'export.csv';
    data = encodeURI(csv);
    link = document.createElement('a');
    link.setAttribute('href', data);
    link.setAttribute('download', filename);
    link.click();
    $(btn).removeClass("boton-rojo").addClass("boton-verde"); 
    link.remove();
    
}

function copiarContenido(btn){

    const json = $(btn).prev("span").html(); 
    $("#inputtemporal").val(json);
    let input = $("#inputtemporal")[0];      
    $(btn).removeClass("boton-azul").addClass("boton-verde");          
    input.select();
    input.setSelectionRange(0, 99999);    
    navigator.clipboard.writeText(input.value);
    Notiflix.Notify.Success("CONTENIDO COPIADO")

}

$("#insertarJson").click(function (e) {
    periodo =  $("#periodo").val()
    Notiflix.Confirm.Show(
        'Confirmación',
        'Este proceso actualizara las actas de este periodo ' + periodo+'. ¿Esta segura de realizarlo?',
        'Si',
        'No',
        function () {
            $.ajax({
                url: path + "Notas/jsonActasNominasPremiunV2",
                type: "POST",
                data: {
                    opcion: "insertarTablaJSON",
                    periodo: $("#periodo").val()
                },
                beforeSend: function () {
                    $('.text-loader').text('ESTO PUEDE TOMAR UNOS MINUTOS, POR FAVOR ESPERE...');
                    $("#modalLoader").modal();
                },
                complete: function () {
                    $("#modalLoader").modal("hide");
                },    
                success: function (data) {
                    var datos = JSON.parse(data);

                    if (datos.respuesta == "success") {
                        Notiflix.Report.Success("Proceso Exitoso", "Se a insertado correctamente los datos a la nueva tabla.", "Cerrar");
                        //tablaAlumnos.ajax.reload(null, false);
                    } else {
                        var errores = "";

                        for (i = 0; i < datos.errores.length; i++) {
                            errores += datos.errores[i] + "<br>";
                        }

                        Notiflix.Report.Failure('Error', errores, "Cerrar");
                    }

                }
            });

        }
        , function () {
            //En caso, sea no
        });
})


$("#consultar").click(function (e) {

    console.log("Ejecutando función")
    $('#tablaConsultarActasNominas2').dataTable().fnDestroy();
    $('#tablaConsultarActasNominas2 tbody').empty();
    $('#tablaConsultarActasNominas').dataTable().fnDestroy();
    $('#tablaConsultarActasNominas tbody').empty();
    

    if($("#tipo").val() == "ACTAS"){
        $("#modalLoader").modal(),
            $('.text-loader').text('CARGANDO ACTAS, POR FAVOR ESPERE...'),
            $('#tablaConsultarActasNominas').show();
            setTimeout(() => {
                $('.panel_json').hide();
                $('#tablaConsultarActasNominas2').hide();
                ejecutarFuncionJSON()
                    .then(() => setTimeout(() => {
                        $('.panel_json').show();
                        //$("#modalLoader").modal("hide")
                    }, 3500))
                    .catch(() => setTimeout(() => {
                        $("#modalLoader").modal("hide")
                        Notiflix.Notify.Failure('Actualize la pagina por favor...');
                    }, 3500))
            }, 500);
    }else{
        $("#modalLoader").modal(),
            $('.text-loader').text('CARGANDO NOMINAS, POR FAVOR ESPERE...'),
            $('#tablaConsultarActasNominas2').show();
            setTimeout(() => {
                $('.panel_json').hide();
                $('#tablaConsultarActasNominas').hide();
                ejecutarFuncionJSONominas()
                    .then(() => setTimeout(() => {
                        $('.panel_json').show();
                        //$("#modalLoader").modal("hide")
                    }, 3500))
                    .catch(() => setTimeout(() => {
                        $("#modalLoader").modal("hide")
                        Notiflix.Notify.Failure('Actualize la pagina por favor...');
                    }, 3500))
            }, 500);
    }

    

})

function ejecutarFuncionJSON() {
    return new Promise((resolve, reject) => {
        // Código que toma mucho tiempo
        //tablaResumen();
        resolve(listaJSON())
    })
}

function ejecutarFuncionJSONominas() {
    return new Promise((resolve, reject) => {
        // Código que toma mucho tiempo
        //tablaResumen();
        resolve(listaJSONNominas())
    })
}

function listaJSON(){
    //$('#tablaConsultarActasNominas tbody').empty();
    //$('#tablaConsultarActasNominas').dataTable().fnDestroy();
    //$(".panel_json").css("display", "block");

    tablaAlumnos = $("#tablaConsultarActasNominas").DataTable({
        ordering: false,
        responsive: true,
        dom: 'lBfrtip',
        buttons: [
            {
                "extend": 'excel',
                "text": 'Exportar Excel',
                "className": 'btn_excel_datatable',
                'filename': 'Reporte'
            }
        ],
        data: [],
        ajax: {
            url: path + "Notas/jsonActasNominasPremiunV2",
            type: "POST",
            dataType: "JSON",
            data: {
                opcion: "consultar",
                tipo: $("#tipo").val(),
                periodo: $("#periodo").val()

            },
            beforeSend: function () {
                // $("#modalLoader").modal();
                // $('.text-loader').text('CARGANDO INFORMACIÓN, POR FAVOR ESPERE...');
            },
            complete: function () {
                $("#modalLoader").modal("hide");
            },
            dataSrc: function (response) {
                console.log("respones", response)
                if (response.respuesta === "success") {
                    return response.data;
                } else {
                    Notiflix.Notify.Failure('OCURRIÓ UN ERROR AL GENERAR EL LISTADO, POR FAVOR VUELVA A INTENTARLO.');
                    return [];
                }

            },
        },
        scrollX: true,
        columns: [
            /**{data: null,
                render: function (data,type, row, meta) {
                    return meta.row + meta.settings._iDisplayStart + 1;
                }
            },**/
            {
                data: null,
                render: function (data) {
                    return '* ' + data.cod_alumno.trim();
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.TipoDocumento.trim();
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.NumDocumento;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.local_descripcion.trim();
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.ApellidoPaterno != null ? data.ApellidoPaterno.toString().trim() : '-';
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.ApellidoMaterno != null ? data.ApellidoMaterno.toString().trim() : '-';
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.nombres != null ? data.nombres.toString().trim() : '-';
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.sexo != null ? data.sexo.trim() : '-';
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.Edad != null ? data.Edad : '-';
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.fecha_naci != null ? data.fecha_naci : '-';
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.fechaingreso != null ? data.fechaingreso : '-';
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.Ciclo != null ? data.Ciclo.toString().trim() : '-';
                }
            },
            {
                data: null,
                render: function (data) {
                    if(data.C1 != null && data.CD1 != null){ if(data.C1.toString().trim() != "" && data.C1.toString().trim() != "00"){ nota = data.C1.toString().trim() }else{ nota = "00" } resp = nota + " - " + data.CD1.toString().trim() }else{ resp = "-" }
                    return resp;
                }
            },
            {
                data: null,
                render: function (data) {
                    if(data.C2 != null && data.CD2 != null){ if(data.C2.toString().trim() != "" && data.C2.toString().trim() != "00"){ nota = data.C2.toString().trim() }else{ nota = "00" } resp = nota + " - " + data.CD2.toString().trim() }else{ resp = "-" }
                    return resp;
                }
            },
            {
                data: null,
                render: function (data) {
                    if(data.C3 != null && data.CD3 != null){ if(data.C3.toString().trim() != "" && data.C3.toString().trim() != "00"){ nota = data.C3.toString().trim() }else{ nota = "00" } resp = nota + " - " + data.CD3.toString().trim() }else{ resp = "-" }
                    return resp;
                }
            },
            {
                data: null,
                render: function (data) {
                    if(data.C4 != null && data.CD4 != null){ if(data.C4.toString().trim() != "" && data.C4.toString().trim() != "00"){ nota = data.C4.toString().trim() }else{ nota = "00" } resp = nota + " - " + data.CD4.toString().trim() }else{ resp = "-" }
                    return resp;
                }
            },
            {
                data: null,
                render: function (data) {
                    if(data.C5 != null && data.CD5 != null){ if(data.C5.toString().trim() != "" && data.C5.toString().trim() != "00"){ nota = data.C5.toString().trim() }else{ nota = "00" } resp = nota + " - " + data.CD5.toString().trim() }else{ resp = "-" }
                    return resp;
                }
            },
            {
                data: null,
                render: function (data) {
                    if(data.C6 != null && data.CD6 != null){ if(data.C6.toString().trim() != "" && data.C6.toString().trim() != "00"){ nota = data.C6.toString().trim() }else{ nota = "00" } resp = nota + " - " + data.CD6.toString().trim() }else{ resp = "-" }
                    return resp;
                }
            },
            {
                data: null,
                render: function (data) {
                    if(data.C7 != null && data.CD7 != null){ if(data.C7.toString().trim() != "" && data.C7.toString().trim() != "00"){ nota = data.C7.toString().trim() }else{ nota = "00" } resp = nota + " - " + data.CD7.toString().trim() }else{ resp = "-" }
                    return resp;
                }
            },
            {
                data: null,
                render: function (data) {
                    if(data.C8 != null && data.CD8 != null){ if(data.C8.toString().trim() != "" && data.C8.toString().trim() != "00"){ nota = data.C8.toString().trim() }else{ nota = "00" } resp = nota + " - " + data.CD8.toString().trim() }else{ resp = "-" }
                    return resp;
                }
            },
            {
                data: null,
                render: function (data) {
                    if(data.C9 != null && data.CD9 != null){ if(data.C9.toString().trim() != "" && data.C9.toString().trim() != "00"){ nota = data.C9.toString().trim() }else{ nota = "00" } resp = nota + " - " + data.CD9.toString().trim() }else{ resp = "-" }
                    return resp;
                }
            },
            {
                data: null,
                render: function (data) {

                    if(data.C10 != null && data.CD10 != null){ if(data.C10.toString().trim() != "" && data.C10.toString().trim() != "00"){ nota = data.C10.toString().trim() }else{ nota = "00" } resp = nota + " - " + data.CD10.toString().trim() }else{ resp = "-" }
                    return resp;
                }
            },
            {
                data: null,
                render: function (data) {

                    if(data.C11 != null && data.CD11 != null){ if(data.C11.toString().trim() != "" && data.C11.toString().trim() != "00"){ nota = data.C11.toString().trim() }else{ nota = "00" } resp = nota + " - " + data.CD11.toString().trim() }else{ resp = "-" }
                    return resp;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.carrera_ministerio != null ? data.carrera_ministerio.toString().trim() : '-';
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.turno_des != null ? data.turno_des.toString().trim() : '-';
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.cod_seccion != null ? data.cod_seccion.toString().trim() : '-';
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.tipoacta != null ? data.tipoacta.toString().trim() : '-';
                }
            },
            {
                data: null,
                render: function (data) {
                    return "<button class=\"btn boton-tabla btn-warning\" type=\"button\" onclick=\"editarAlumno('" + data.idAJ + "', '" + data.semestre + "');\" title=\"Editar\"><span class=\"icon-pencil\"></span></button>&nbsp;&nbsp;&nbsp;" +
                    // "<button class=\"btn boton-tabla btn-success\" type=\"button\" onclick=\"insertarAlumno('" + data.semestre.trim() + "','" + data.cod_alumno.trim() + "','" + data.cod_seccion.trim() + "','" + data.cod_ciclo.trim() + "','" + data.cod_turno.trim() + "');\" title=\"Regenerar\"><span class=\"icon-loop2\"></span></button>&nbsp;&nbsp;&nbsp;" +
                    "<button class=\"btn boton-tabla btn-danger\" type=\"button\" onclick=\"eliminarAlumno('" + data.idAJ + "','" + data.cod_alumno.trim() + "');\" title=\"Eliminar\"><span class=\"icon-bin\"></span></button>&nbsp;&nbsp;&nbsp;";
                }
            }

        ],
        language: language,
        columnDefs: [
            {
                targets: '_all',
                className: 'celda-centrada',
                orderable: false
            }
        ],
        lengthMenu: [
            [20, 50, 75, 100],
            [20, 50, 75, 100]
        ],
    });
}

function listaJSONNominas() {
    //$('#tablaConsultarActasNominas tbody').empty();
    //$('#tablaConsultarActasNominas2').dataTable().fnDestroy();
    //$(".panel_json").css("display", "block");

    tablaAlumnos2 = $("#tablaConsultarActasNominas2").DataTable({
        ordering: false,
        responsive: true,
        dom: 'lBfrtip',
        buttons: [
            {
                "extend": 'excel',
                "text": 'Exportar Excel',
                "className": 'btn_excel_datatable',
                'filename': 'Reporte'
            }
        ],
        data: [],
        ajax: {
            url: path + "Notas/jsonActasNominasPremiunV2",
            type: "POST",
            dataType: "JSON",
            data: {
                opcion: "consultar",
                tipo: $("#tipo").val(),
                periodo: $("#periodo").val()

            },
            beforeSend: function () {
                // $("#modalLoader").modal();
                // $('.text-loader').text('CARGANDO INFORMACIÓN, POR FAVOR ESPERE...');
            },
            complete: function () {
                $("#modalLoader").modal("hide");
            },
            dataSrc: function (response) {
                console.log("respones", response)
                if (response.respuesta === "success") {
                    return response.data;
                } else {
                    Notiflix.Notify.Failure('OCURRIÓ UN ERROR AL GENERAR EL LISTADO, POR FAVOR VUELVA A INTENTARLO.');
                    return [];
                }

            },
        },
        scrollX: true,
        columns: [
            /**{data: null,
                render: function (data,type, row, meta) {
                    return meta.row + meta.settings._iDisplayStart + 1;
                }
            },**/
            {
                data: null,
                render: function (data) {
                    return '* ' + data.cod_alumno.trim();
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.TipoDocumento.trim();
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.NumDocumento;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.ApellidoPaterno != null ? data.ApellidoPaterno.toString().trim() : '-';
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.ApellidoMaterno != null ? data.ApellidoMaterno.toString().trim() : '-';
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.nombres != null ? data.nombres.toString().trim() : '-';
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.sexo != null ? data.sexo.trim() : '-';
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.Edad != null ? data.Edad : '-';
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.fecha_naci != null ? data.fecha_naci : '-';
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.fechaingreso != null ? data.fechaingreso : '-';
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.Ciclo != null ? data.Ciclo.toString().trim() : '-';
                }
            },
            // {
            //     data: null,
            //     render: function (data) {
            //         if(data.C1 != null && data.CD1 != null){ if(data.C1.toString().trim() != "" && data.C1.toString().trim() != "00"){ nota = data.C1.toString().trim() }else{ nota = "00" } resp = nota + " - " + data.CD1.toString().trim() }else{ resp = "-" }
            //         return resp;
            //     }
            // },
            // {
            //     data: null,
            //     render: function (data) {
            //         if(data.C2 != null && data.CD2 != null){ if(data.C2.toString().trim() != "" && data.C2.toString().trim() != "00"){ nota = data.C2.toString().trim() }else{ nota = "00" } resp = nota + " - " + data.CD2.toString().trim() }else{ resp = "-" }
            //         return resp;
            //     }
            // },
            // {
            //     data: null,
            //     render: function (data) {
            //         if(data.C3 != null && data.CD3 != null){ if(data.C3.toString().trim() != "" && data.C3.toString().trim() != "00"){ nota = data.C3.toString().trim() }else{ nota = "00" } resp = nota + " - " + data.CD3.toString().trim() }else{ resp = "-" }
            //         return resp;
            //     }
            // },
            // {
            //     data: null,
            //     render: function (data) {
            //         if(data.C4 != null && data.CD4 != null){ if(data.C4.toString().trim() != "" && data.C4.toString().trim() != "00"){ nota = data.C4.toString().trim() }else{ nota = "00" } resp = nota + " - " + data.CD4.toString().trim() }else{ resp = "-" }
            //         return resp;
            //     }
            // },
            // {
            //     data: null,
            //     render: function (data) {
            //         if(data.C5 != null && data.CD5 != null){ if(data.C5.toString().trim() != "" && data.C5.toString().trim() != "00"){ nota = data.C5.toString().trim() }else{ nota = "00" } resp = nota + " - " + data.CD5.toString().trim() }else{ resp = "-" }
            //         return resp;
            //     }
            // },
            // {
            //     data: null,
            //     render: function (data) {
            //         if(data.C6 != null && data.CD6 != null){ if(data.C6.toString().trim() != "" && data.C6.toString().trim() != "00"){ nota = data.C6.toString().trim() }else{ nota = "00" } resp = nota + " - " + data.CD6.toString().trim() }else{ resp = "-" }
            //         return resp;
            //     }
            // },
            // {
            //     data: null,
            //     render: function (data) {
            //         if(data.C7 != null && data.CD7 != null){ if(data.C7.toString().trim() != "" && data.C7.toString().trim() != "00"){ nota = data.C7.toString().trim() }else{ nota = "0" } resp = nota + " - " + data.CD7.toString().trim() }else{ resp = "-" }
            //         return resp;
            //     }
            // },
            // {
            //     data: null,
            //     render: function (data) {
            //         if(data.C8 != null && data.CD8 != null){ if(data.C8.toString().trim() != "" && data.C8.toString().trim() != "00"){ nota = data.C8.toString().trim() }else{ nota = "00" } resp = nota + " - " + data.CD8.toString().trim() }else{ resp = "-" }
            //         return resp;
            //     }
            // },
            // {
            //     data: null,
            //     render: function (data) {
            //         if(data.C9 != null && data.CD9 != null){ if(data.C9.toString().trim() != "" && data.C9.toString().trim() != "00"){ nota = data.C9.toString().trim() }else{ nota = "00" } resp = nota + " - " + data.CD9.toString().trim() }else{ resp = "-" }
            //         return resp;
            //     }
            // },
            // {
            //     data: null,
            //     render: function (data) {

            //         if(data.C10 != null && data.CD10 != null){ if(data.C10.toString().trim() != "" && data.C10.toString().trim() != "00"){ nota = data.C10.toString().trim() }else{ nota = "00" } resp = nota + " - " + data.CD10.toString().trim() }else{ resp = "-" }
            //         return resp;
            //     }
            // },
            // {
            //     data: null,
            //     render: function (data) {

            //         if(data.C11 != null && data.CD11 != null){ if(data.C11.toString().trim() != "" && data.C11.toString().trim() != "00"){ nota = data.C11.toString().trim() }else{ nota = "00" } resp = nota + " - " + data.CD11.toString().trim() }else{ resp = "-" }
            //         return resp;
            //     }
            // },
            {
                data: null,
                render: function (data) {
                    return data.carrera_ministerio != null ? data.carrera_ministerio.toString().trim() : '-';
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.turno_des != null ? data.turno_des.toString().trim() : '-';
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.cod_seccion != null ? data.cod_seccion.toString().trim() : '-';
                }
            }

        ],
        language: language,
        columnDefs: [
            {
                targets: '_all',
                className: 'celda-centrada',
                orderable: false
            }
        ],
        lengthMenu: [
            [20, 50, 75, 100],
            [20, 50, 75, 100]
        ],
    });
}

function editarAlumno(id, periodo) {

    $.post(path + "Notas/jsonActasNominasPremiunV2", { id: id, periodo: periodo, opcion: 'verEditar' })
        .done(function (r) {
            response = JSON.parse(r)
            if (response.respuesta === 'Valido') {

                data = response.data[0]
                console.log("dataEDITAR", data)
                Notiflix.Notify.Success(response.respuesta, {
                    position: 'top-center',
                    borderRadius: '15px',
                    fontSize: '16px',
                });
                
                $('#idJSON').val(data.idAJ)
                $('#editar_codAlumno').val(data.cod_alumno)
                $('#editar_nombre').val(data.apellidos_nombres)
                $('#editar_CD1').val(data.CD1)
                $('#editar_C1').val(data.C1)
                $('#editar_CD2').val(data.CD2)
                $('#editar_C2').val(data.C2)
                $('#editar_CD3').val(data.CD3)
                $('#editar_C3').val(data.C3)
                $('#editar_CD4').val(data.CD4)
                $('#editar_C4').val(data.C4)
                $('#editar_CD5').val(data.CD5)
                $('#editar_C5').val(data.C5)
                $('#editar_CD6').val(data.CD6)
                $('#editar_C6').val(data.C6)
                $('#editar_CD7').val(data.CD7)
                $('#editar_C7').val(data.C7)
                $('#editar_CD8').val(data.CD8)
                $('#editar_C8').val(data.C8)
                $('#editar_CD9').val(data.CD9)
                $('#editar_C9').val(data.C9)
                $('#editar_CD10').val(data.CD10)
                $('#editar_C10').val(data.C10)
                $('#editar_CD11').val(data.CD11)
                $('#editar_C11').val(data.C11)
                

                $("#modal__editar__alumnos").modal("show")

            } else {
                Notiflix.Notify.Failure('Ocurrio un error inesperado, vuela a intentarlo');
            }
        })
        .fail(function (r) {
            Notiflix.Notify.Failure('Ocurrio un error inesperado,por favor recargue la página y vuela a intentarlo');
        })


}

$('#form__editar__alumno').submit(function (e) {
    e.preventDefault();
    var form = $(this).serializeArray();
    form.push({ name: "opcion", value: "guardarEditar" });
    form.push({ name: "periodo", value: $('#periodo').val() });
    console.log("data", form)
    
    $.ajax({
        url: path + "Notas/jsonActasNominasPremiunV2",
        type: "POST",
        data: form,
        success: function (data) {
            console.log(data);

            let datos = JSON.parse(data);
            if (datos.respuesta === 'success') {
                Notiflix.Notify.Success(datos.msj);
                $("#modal__editar__alumnos").modal("hide");
                //document.getElementsByClassName("form-requerimiento").reset();
                tablaAlumnos.ajax.reload(null, false);
            } else {
                Notiflix.Notify.Failure('Ocurrió un error al registrar, recargue la pagina');
            }
        }
    });

})

function insertarAlumno(semestre, codAlumno, tipoActa, codEspe, ciclo, turno) {

    Notiflix.Confirm.Show(
        'Confirmación',
        'Este proceso duplicara el acta del alumno '+ codAlumno +' este periodo ' + semestre+'. ¿Esta segura de realizarlo?',
        'Si',
        'No',
        function () {
            Notiflix.Loading.Hourglass('Insertando...');
            $.post(path + "Notas/jsonActasNominasPremiunV2", { semestre: semestre, codAlumno: codAlumno, tipoActa: tipoActa, codEspe: codEspe, ciclo: ciclo, turno: turno, opcion: 'duplicarAlumno' })
                .done(function (r) {
                    response = JSON.parse(r)
                    if (response.respuesta === 'success') {
                    
                         Notiflix.Report.Success(response.mensaje);
                        
                        //tablaAlumnos.ajax.reload(null, false);
                        $("#NotiflixLoadingWrap").trigger("click");

                    } else {
                        $("#NotiflixLoadingWrap").trigger("click");
                        Notiflix.Report.Failure("Error", response.mensaje);
                    }
                })
                .fail(function (r) {
                    Notiflix.Notify.Failure('Ocurrio un error inesperado,por favor recargue la página y vuelva a intentarlo');
                })
        }
        , function () {
            //En caso, sea no
        });

}

function eliminarAlumno(idAJ, codAlumno) {

    Notiflix.Confirm.Show(
        'Confirmación',
        'ELIMINAR el acta del alumno '+ codAlumno +'. ¿Esta segura de realizarlo?',
        'Si',
        'No',
        function () {
            $.post(path + "Notas/jsonActasNominasPremiunV2", { idAJ: idAJ, semestre: $('#periodo').val() , opcion: 'eliminarAlumno' })
                .done(function (r) {
                    response = JSON.parse(r)
                    if (response.respuesta === 'success') {
                    
                        Notiflix.Notify.Success(response.mensaje, {
                            ID: 'MKA',
                            timeout: 6923,
                            showOnlyTheLastOne: true,
                            width: '300px',
                            cssAnimationDuration: 1400,
                            position: 'center-top',
                            });

                        tablaAlumnos.ajax.reload(null, false);

                    } else {
                        Notiflix.Notify.Failure('No se pudo terminar la accion, vuelva a intentarlo');
                    }
                })
                .fail(function (r) {
                    Notiflix.Notify.Failure('Ocurrio un error inesperado,por favor recargue la página y vuelva a intentarlo');
                })
        }
        , function () {
            //En caso, sea no
        },{
            okButtonBackground: '#ef4444',
            titleColor: '#ef4444',
        });

}

/**$("#formExportar").submit(function(e){

    e.preventDefault();
    let data = $(this).serializeArray();
    data.push({name:"opcion",value:"exportar"})

    $.ajax({
        url: path + "notas/nominasMasivasV2",
        type: "POST",
        dataType: "JSON",
        data: $.param(data), 
        beforeSend: function(){
            $('.text-loader').text('ESTO PUEDE TOMAR UNOS MINUTOS, POR FAVOR ESPERE...');
            $("#modalLoader").modal();
        },
        complete: function(){
            $("#modalLoader").modal("hide");
        },    
        success: function (datos) {
                                                       
            if (datos.respuesta === "success") {

                var a = $("<a>");
                a.attr("href", datos.file);
                $("body").append(a);
                a.attr("download", "nominas-"+$("#periodo").val()+".xlsx");
                a[0].click();
                a.remove();
                Notiflix.Notify.Success("El documento se genero con éxito.")

            } else {

                Notiflix.Notify.Success("OCURRIO UN ERROR INESPERADO, POR FAVOR RECARGUE LA PÁGINA Y VUELVA A INTENTARLO --> "+datos.error)

            }

        }
    });

})**/