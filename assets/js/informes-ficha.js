/* console.log('lodsad titulacion semestre'); */
document.addEventListener("DOMContentLoaded", () => {
     
    autocompleteAlumno();
    autocompleteAlumnoModal();
    autocompleteAlumnoModalEditar();

});

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

function autocompleteAlumno(){
    $("#alumno").autocomplete({
        source: function (request, response) {
            $.ajax({
                url: path + "titulacion/declaracionJurada",
                dataType: "json",
                type: 'post',
                data: {
                    term: request.term,
                    opcion: 'searchAlumnos'
                },
                success: function (data) {
                    console.log(data);
                    $("#alumno").next('i').removeClass('glyphicon-ok');
                    $("#alumno").next('i').addClass('glyphicon-remove');
                    $("#alumno").parent().removeClass('has-success');
                    $("#alumno").parent().addClass('has-error');
                    let result = (!data.alumnos) ? [{ vacio: true }] : data.alumnos;
                    response(result);
                }
            });
        },
        minLength: 2,
        select: function (event, ui) {
            if (ui.item.vacio) {
                event.preventDefault();
            } else {
                $("#alumno").val(ui.item.cod_alumno + " - " + ui.item.nombre);
                $("#codigoAlumno").val(ui.item.cod_alumno.trim());
                $("#cod_espe").val(ui.item.Cod_espe.trim());
                $("#alumno").next('i').removeClass('glyphicon-remove');
                $("#alumno").next('i').addClass('glyphicon-ok');
                $("#alumno").parent().removeClass('has-error');
                $("#alumno").parent().addClass('has-success');
                //cargarDataAlumno(ui.item.cod_alumno,ui.item.Cod_espe.trim());
            }
            return false;
        }
    })
    .autocomplete("instance")._renderItem = function (ul, item) {
        if (item.hasOwnProperty('vacio')) {
            return $("<li>")
                .append("<div>No se encontraron resultados</div>")
                .appendTo(ul);
        }
        return $("<li>")
            .append("<div>" + item.cod_alumno + " - " + item.nombre + "</div>")
            .appendTo(ul);
    };
    $("#alumno").focus();
} 

$("#alumno").keyup(function(){
    if( $(this).val().length < 1){        
        $("#alumno").next('i').removeClass('glyphicon-ok');
        $("#alumno").next('i').addClass('glyphicon-remove');
        $("#alumno").parent().removeClass('has-success');
        $("#alumno").parent().addClass('has-error');
    }
})

function autocompleteAlumnoModal() {
    $("#alumnoAgregar").autocomplete({
        source: function (request, response) {
            $.ajax({
                url: path + "titulacion/declaracionJurada",
                dataType: "json",
                type: 'post',
                data: {
                    term: request.term,
                    opcion: 'searchAlumnos'
                },
                success: function (data) {

                    $("#alumnoAgregar").attr("codigo", ""); 
                    $("#alumnoAgregar").attr("codespe", ""); 
                    $("#alumnoAgregar").next('i').removeClass('glyphicon-ok');
                    $("#alumnoAgregar").next('i').addClass('glyphicon-remove');
                    $("#alumnoAgregar").parent().removeClass('has-success');
                    $("#alumnoAgregar").parent().addClass('has-error');
                    let result = (!data.alumnos) ? [{ vacio: true }] : data.alumnos;
                    response(result);
                }
            });
        },
        minLength: 2,
        select: function (event, ui) {
            if (ui.item.vacio) {
                event.preventDefault();
            } else {                

                $("#alumnoAgregar").val(ui.item.cod_alumno + " - " + ui.item.nombre);                
                $("#alumnoAgregar_codigo").val(ui.item.cod_alumno);    
                $("#alumnoAgregar").attr("codespe", ui.item.Cod_espe);             
                $("#alumnoAgregar").next('i').removeClass('glyphicon-remove');
                $("#alumnoAgregar").next('i').addClass('glyphicon-ok');
                $("#alumnoAgregar").parent().removeClass('has-error');
                $("#alumnoAgregar").parent().addClass('has-success');                
                
                $("#especialidadAgregar").val(ui.item.Cod_espe.trim());
                $("#sedeAgregar").val(ui.item.Cod_sede.trim());
                $("#periodo_nuevo").val(ui.item.Semestre.trim());
                $("#edad").val(ui.item.Edad);

                setTimeout(() => {
                    consultarBecasDisponibles()
                }, 1000);

            }

            return false;
        }
    })
    .autocomplete("instance")._renderItem = function (ul, item) {
        if (item.hasOwnProperty('vacio')) {
            return $("<li>")
                .append("<div>No se encontraron resultados</div>")
                .appendTo(ul);
        }
        return $("<li>")
            .append("<div>" + item.cod_alumno + " - " + item.nombre + "</div>")
            .appendTo(ul);
    };
    $("#alumnoAgregar").focus();
} 

function autocompleteAlumnoModalEditar() {
    $("#editar_alumnoAgregar").autocomplete({
        source: function (request, response) {
            $.ajax({
                url: path + "titulacion/declaracionJurada",
                dataType: "json",
                type: 'post',
                data: {
                    term: request.term,
                    opcion: 'searchAlumnos'
                },
                success: function (data) {

                    $("#editar_alumnoAgregar").attr("codigo", ""); 
                    $("#editar_alumnoAgregar").attr("codespe", ""); 
                    $("#editar_alumnoAgregar").next('i').removeClass('glyphicon-ok');
                    $("#editar_alumnoAgregar").next('i').addClass('glyphicon-remove');
                    $("#editar_alumnoAgregar").parent().removeClass('has-success');
                    $("#editar_alumnoAgregar").parent().addClass('has-error');
                    let result = (!data.alumnos) ? [{ vacio: true }] : data.alumnos;
                    response(result);
                }
            });
        },
        minLength: 2,
        select: function (event, ui) {
            if (ui.item.vacio) {
                event.preventDefault();
            } else {                

                $("#editar_alumnoAgregar").val(ui.item.cod_alumno + " - " + ui.item.nombre);                
                $("#editar_alumnoAgregar_codigo").val(ui.item.cod_alumno);    
                $("#editar_alumnoAgregar").attr("codespe", ui.item.Cod_espe);             
                $("#editar_alumnoAgregar").next('i').removeClass('glyphicon-remove');
                $("#editar_alumnoAgregar").next('i').addClass('glyphicon-ok');
                $("#editar_alumnoAgregar").parent().removeClass('has-error');
                $("#editar_alumnoAgregar").parent().addClass('has-success');                
                
                $("#editar_especialidadAgregar").val(ui.item.Cod_espe.trim());
                $("#editar_sedeAgregar").val(ui.item.Cod_sede.trim());
                $("#editar_periodo").val(ui.item.Semestre.trim());
                $("#editar_edad").val(ui.item.Edad);

            }

            return false;
        }
    })
    .autocomplete("instance")._renderItem = function (ul, item) {
        if (item.hasOwnProperty('vacio')) {
            return $("<li>")
                .append("<div>No se encontraron resultados</div>")
                .appendTo(ul);
        }
        return $("<li>")
            .append("<div>" + item.cod_alumno + " - " + item.nombre + "</div>")
            .appendTo(ul);
    };
    $("#editar_alumnoAgregar").focus();
} 

let backgroundColor = [
    'rgb(255, 99, 132,0.2)',
    'rgb(54, 162, 235,0.2)',
    'rgb(255, 205, 86,0.2)',
    'rgb(112, 173, 70,0.2)',
    'rgb(230, 148, 92,0.2)',
    'rgb(54, 162, 235,0.2)',
    'rgb(75, 192, 192,0.2)',
    'rgb(255, 205, 86,0.2)',
    'rgb(255, 99, 132,0.2)',
    'rgb(201, 203, 207,0.2)',
    'rgb(83, 211, 87,0.2)',
    'rgb(237, 208, 98,0.2)'
];

document.getElementById('porcentaje').addEventListener('input', function() {
    const value = this.value;
    const errorSpan = document.getElementById('error');
    
    if (value < 0) {
        this.value = 0;
        errorSpan.textContent = 'No puede ser menor a 0.';
    } else if (value > 100) {
        this.value = 0;
        errorSpan.textContent = 'No puede ser mayor a 100.';
    } else {
        errorSpan.textContent = '';
    }
});

$('#btnBuscar').click(function () {
    cargarDataAlumno()
})

$('#btnagregar').click(function () {
     $("#modal__agregar__empleador").modal({
            backdrop: 'static',
            keyboard: false
        });
})
$('.agregar_vacantes').click(function () {
        $("#modalAgregarVacantes").modal({ backdrop: 'static', keyboard: false });
    })


$('#btnReporte').click(function () {
        $('.ver_anio').show()
        $('.ver_mes').hide()
        $("#modalReporte").modal({
            backdrop: 'static',
            keyboard: false
        });
})

$('#cerrar__modal__agregar').click(function () {
    limpiarCamposCabeza()
    $('#btn_nuevo_beca').show(400)
    $('.becasDisponibles').html('-')
    console.log("rata");
    
})

$("#modalAgregarVacantes").on("hidden.bs.modal", function () {
    $('#numero_resolucion').val("")
});

function cargarDataAlumno(){

    $('#tablaListado').dataTable().fnDestroy();
    tablaListado =  $("#tablaListado").DataTable({
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
            url: path + "informes/ficha",
            type: "POST",
            dataType: "JSON",
            data: {
                opcion: 'cargarData',
                alumno: $('#alumno').val().substring(0, 9),
                especialidad: $('#especialidad').val(),
                sede: $('#sede').val(),
                periodo: $('#periodo').val(),
                condicion: $('#condicion').val(),


            },
            beforeSend: function () {
                $("#modalLoader").modal();
                $('.text-loader').text('CARGANDO INFORMACIÓN, POR FAVOR ESPERE...');
            },
            complete: function () {
                $("#modalLoader").modal("hide");
            },
            dataSrc: function (response) {
                console.log("data", response.data);
                if (response.respuesta === "error") {
                    return {}
                } else {
                    return response.data;
                }
            },
        },
        columnDefs: [
            {
                defaultContent: "-",
                targets: '_all',
                className: 'celda-centrada',
                orderable: false
            }
        ],
        lengthMenu: [
            [20, 20, 50, 75, 100],
            [20, 50, 75, 100]
        ],
        columns: [
            {
                data: null,
                render: function (data, type, row, meta) {
                    return data.Op;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.Fecha;
                }
            },
            {
                data: null,
                render: function (data, type, row, meta) {
                    return data.Tipo;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.Especialidad;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.Condicion;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.Semestre;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.cod_alumno;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.Alumno;
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
                    return data.Sede;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.NroResolucion;
                }
            },
            {
                data: null,
                render: function (data) {
                    return Number(data.Porcentaje).toFixed() + "%";
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.FechaReg;
                }
            },
            {
                data: null,
                render: function (data) {
                    let color = '';
                    if (data.Estado === 'Activo') { color = "color:#00b300"; descrip = "Activo"; } else { color = "color:red"; descrip = "Inactivo"; }
                    return `<span style="${color}">${descrip}</span>`;
                    
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.UsuarioReg;
                }
            },
            {
                data: null,
                render: function (data) {
                    return "<button class=\"btn boton-tabla btn-warning\" type=\"button\" onclick=\"editarBeca('" + data.Op + "');\" title=\"Ver solicitud\"><span class=\"icon-pencil\"></span></button>&nbsp;&nbsp;&nbsp;" + 
                        "<button class=\"btn boton-tabla btn-danger\" type=\"button\" onclick=\"eliminarBeca('" + data.Op + "')\"><span class=\"icon-cross\"></span></button>";
                }
            }

        ],
        language: language
    });


}

function editarBeca(op) {

    $.post(path + "informes/Ficha", { op: op, opcion: 'verEditar' })
        .done(function (r) {
            response = JSON.parse(r)
            if (response.respuesta === 'success') {

                data = response.res[0]
                $('.OpCabeza').val(data.Op)
                $('#editar_fechaAgregar').val(data.Fecha.trim().substring(0, 10))
                $('#editar_tipoBeca').val(data.codTipo)
                $('#editar_alumnoAgregar').val(data.Alumno)
                $("#editar_alumnoAgregar_codigo").val(data.Cod_alumno)
                $('#editar_especialidadAgregar').val(data.cod_espe)
                $('#editar_sedeAgregar').val(data.cod_localInst)
                $('#editar_condicion').val(data.cod_condicion)              
                $('#editar_edad').val(data.Edad)
                $('#editar_porcentaje').val(data.Porcentaje) 
                // $('#nro_resolucion').val(data.NroResolucion)
                $('#editar_periodo').val(data.Periodo)

                listaDetallesReoslucion(data.Op)

                $("#modal__editar__empleador").modal("show")

            } else {
                Notiflix.Notify.Failure('Ocurrio un error inesperado, vuela a intentarlo');
            }
        })
        .fail(function (r) {
            Notiflix.Notify.Failure('Ocurrio un error inesperado,por favor recargue la página y vuela a intentarlo');
        })

    
}

function eliminarDetalle(id){

    Notiflix.Confirm.Show(
        'Confirmación',
        `¿Está seguro de eliminar la operación seleccionada?`,
        'Si',
        'No',
        function () {
            
            $.ajax({
                url: path + "informes/Ficha",
                dataType: "JSON",
                type: 'POST',
                data: {
                    opcion: "eliminarDetalle",
                    id: id
                },
                success: function (data) {

                    if (data.respuesta === "success") {
                        tablaVacantes.ajax.reload(null, false);
                        Notiflix.Notify.Success("SE ELIMINO CON ÉXITO", { timeout: 5000 });
                        //cargarDataAlumno(codigo);

                    } else {

                        Notiflix.Notify.Failure('Ocurrió un error inesperado, vuelva a intentarlo', { timeout: 5000 });

                    }

                }
            });

        },
        function () {
            
        }
    );
       
}

function cargarDocumentos() {

    $.ajax({
        url: path + "titulacion/declaracionJurada",
        dataType: 'JSON',
        type: 'POST',
        data: {
            opcion: 'cargarDocumentos'
        },        
        success: function (data) {

            if (data.respuesta === 'success') {
                
                data.data.forEach((e, k) => {
                    $("#tablaListado tbody").append(`<tr>
                        <td class='text-center'>${e.Alumno.trim()}</td>
                        <td class='text-center'>${e.Especialidad.trim()}</td>
                        <td class='text-center'>${e.Semestre.trim()}</td>                                                                    
                        <td class='text-center'>${e.Ciclo.trim()}</td>
                        <td class='text-center'>${e.Turno.trim()}</td>                                                                                        
                    </tr>`);
                });

            }  
        }
    });

}

function listaDetallesReoslucion(op) {
    tablaVacantes = $(".tablaVacantes").DataTable({
        destroy: 'true',
        searching: false,
        processing: false,
        responsive: true,
        ordering: false,
        bLengthChange: false,
        // lengthMenu: [
        //     [50, 100, -1],
        //     [50, 100, 'TODO']
        // ],
        ajax: {
            url: path + "informes/Ficha",
            type: "POST",
            data: {
                op: op,
                opcion: 'listaDetallesReoslucion'
            },
            dataSrc: function (data) {
                console.log("dataVacantes", data)
                if (data.respuesta == "success") {
                    return data.data == "vacio" ? {} : data.data;
                } else {
                    return {};
                }

            }
        },
        columnDefs: [
            {
                targets: '_all',
                className: 'celda-centrada'
            }
        ],
        columns: [
            {
                data: null,
                render: function (data, type, row, meta) {
                    return meta.row + meta.settings._iDisplayStart + 1;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.Resolucion;
                }
            },
            {
                data: null,
                render: function (data) {

                    let ruta = path + data.Ruta
                    return "<div class=\"certificado-container\">" +
                            "<button title=\"Ver Declaración Jurada\" type=\"button\" class=\"btn btn-sm btn-primary\" onclick=\"verPDFresolucion('" + ruta + "')\"><i class='icon-file-pdf'></i></button>" +
                            "</div>";
                }
            },
            {
                data: null,
                render: function (data) {
                    return "<button class=\"btn boton-tabla btn-danger\" type=\"button\" onclick=\"eliminarDetalle('" + data.Id + "')\"><span class=\"icon-cross\"></span></button>;";
                }
            }

        ],
        language: {
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
        }
    });
}

$(".formulario").submit(function(e){

    e.preventDefault();
    let data = $(this).serializeArray();
    data.push({name:"opcion",value:"registrar"})
    //data.push({ name: "codigoAlumno", value: $("#alumnoAgregar").attr("codigo") });
    
    $.ajax({
        url: path + "informes/ficha",
        dataType: "JSON",
        type: 'POST',
        data: $.param(data),
        success: function (response) {
            
            if(response.respuesta === "success"){
                Notiflix.Notify.Success( "LA OPERACION SE REALIZÓ CON ÉXITO" , { timeout: 5000 }); 
                console.log(response.data.Op);
                
                $(".OpCabeza").val(response.data.Op);      
                $("#tipoBeca").attr('disabled', true)               
                $("#especialidadAgregar").attr('disabled', true)   
                $("#sedeAgregar").attr('disabled', true)   
                $("#condicion").attr('disabled', true)    
                $("#edad").attr('disabled', true)   
                $("#porcentaje").attr('disabled', true)   
                $("#alumnoAgregar").attr("codigo", "");
                $("#alumnoAgregar").next('i').removeClass('glyphicon-ok');
                $("#alumnoAgregar").next('i').addClass('glyphicon-remove');
                $("#alumnoAgregar").parent().removeClass('has-success');
                $("#alumnoAgregar").parent().addClass('has-error');
                $("#alumnoAgregar").attr('disabled', true) 

                $('#btn_nuevo_beca').hide(400)
                listaDetallesReoslucion(response.data.Op)
                $("#seccionDetalles").show(200);

                $('.becasDisponibles').html('-')

            }else if(response.respuesta === "warning"){
                Notiflix.Notify.Warning( response.error , {timeout:5000})
            }else{
                Notiflix.Notify.Failure('Ocurrió un error inesperado, vuelva a intentarlo', { timeout: 5000 });
            }

        }
    });
    

})

$('#formRegistrarVacantes').submit(function (e) {
    e.preventDefault();
    //var form = $(this).serializeArray();
    let form = new FormData(this)
    codigo_op = $('.OpCabeza').val();
    //form.push({ name: "opcion", value: "insertarResolucion" });
    form.append("opcion", "insertarResolucion")
    // form.push({ name: "OpCabeza", value: codigo_op });
    console.log("data", form)

    if($('#fileInput').val() == ''){
        Notiflix.Notify.Warning('Seleccione un archivo');
    }else{

        $.ajax({
            url: path + "informes/Ficha",
            type: "POST",
            dataType: "JSON",
            data: form,
            cache: false,
            contentType: false,
            processData: false,
            beforeSend: function () {
                $(".text-loader").html("Guardando informacion...");
                $("#modalLoader").modal({ backdrop: 'static', keyboard: false });
                $("body").css({ "padding": 0 });
            },
            success: function (datos) {
                $("#modalLoader").modal("hide");
                console.log(data);
                if (datos.respuesta === 'success') {
                    Notiflix.Notify.Success("Se agrego una nueva Resolucion");
                    $("#modalAgregarVacantes").modal("hide");
                    $('#numero_resolucion').val("")
                    $('#fileInput').val(null)
                    //document.getElementsByClassName("form-requerimiento").reset();
                    listaDetallesReoslucion(codigo_op)
                    seleccionaArchivo()
                    //tablaVacantes.ajax.reload(null, false);
                } else {
                    Notiflix.Notify.Failure('Ocurrió un error al registrar, recargue la pagina');
                }
            }
        });
    }

})

$("#alumnoAgregar").keyup(function(){
    if( $(this).val().length < 1){
        $("#alumnoAgregar").attr("codigo", "");
        $("#alumnoAgregar").attr("codespe", "");  
        $("#alumnoAgregar").next('i').removeClass('glyphicon-ok');
        $("#alumnoAgregar").next('i').addClass('glyphicon-remove');
        $("#alumnoAgregar").parent().removeClass('has-success');
        $("#alumnoAgregar").parent().addClass('has-error');
    }
})

$(document).on("change", "input[name='opcionReporte']", function () {
    valorActivo = document.querySelector('input[name="opcionReporte"]:checked').value;
    let elementoActivo = document.querySelector('input[name="opcionReporte"]:checked');
    console.log(elementoActivo);
    if (elementoActivo.value == 1) {
        $('.ver_anio').show()
        $('.ver_mes').hide()
    } else {
        $('.ver_anio').show()
        $('.ver_mes').show()
    }
});

$(document).on("change", "#periodo_nuevo, #sedeAgregar, #especialidadAgregar", function () {
    consultarBecasDisponibles()
});

function seleccionaArchivo(){    
    var input = document.getElementById('fileInput');
    var fileName = document.getElementById('fileName');
    if (input.files.length > 0) {
        fileName.textContent = `Archivo seleccionado: ${input.files[0].name}`;
    } else {
        fileName.textContent = 'Ningún archivo seleccionado';
    }
}

function eliminarBeca(cod_temporal){
    Notiflix.Confirm.Show(
        'Eliminar Beca',
        '¿Esta segura de eliminar la beca?',
        'Si',
        'No',
        function okCb() {
            $.ajax({
                url: path + "titulacion/examenOral",
                dataType: "JSON",
                type: 'POST',
                data: {
                    opcion: "validar",
                    tipo: 3,
                    ruta: "titulacion/examenOral"  
                },
                success: function(data) {
                    /* console.log(response) */
                    if (data.respuesta === "success" && data.validarUsuario === "SI") {
                        
                    $.ajax({
                        url: path + "informes/Ficha",
                        type: "POST",
                        data: {
                            op: cod_temporal,
                            opcion: 'eliminarAlumno'},
                        beforeSend: function () {
                            
                        },
                        success: function (data) {
                            let datos = JSON.parse(data);
                            if (datos.respuesta === 'success') {
                                Notiflix.Notify.Success("Beca eliminada");        
                                tablaListado.ajax.reload(null, false);
                            } else {
                                Notiflix.Notify.Failure('Ocurrió un error al registrar, recargue la pagina');
                            }
                        }
                    });

                    } else {
                        Notiflix.Report.Warning("AVISO","No tienes permiso para realizar esta acción.", "Aceptar");;
                    }
                },
                error: function() {
                    Notiflix.Report.Failure("ERROR","Ocurrió un error al validar los permisos. Por favor, intenta de nuevo.", "Cerrar");
                }
            });  
            
        },
        function cancelCb() {

        },
        {
        },
    );
}

function consultarBecasDisponibles(){
    $.ajax({
        url: path + "informes/Ficha",
        type: "POST",
        data: {
            sede : $('#sedeAgregar').val(),
            cod_espe : $('#especialidadAgregar').val(),
            periodo : $('#periodo_nuevo').val(),
            opcion: 'buscarBecasDisponibles'},
        beforeSend: function () {
            
        },
        success: function (data) {
            let datos = JSON.parse(data);
            console.log(datos);
            if (datos.respuesta === 'success') {
                $('.becasDisponibles').html(datos.res[0].Disponibles)
            } else {
                Notiflix.Notify.Failure('Ocurrió un error al registrar, recargue la pagina');
            }
        }
    });
}

function limpiarCamposCabeza(){
    $(".OpCabeza").val("");      
    $("#tipoBeca").attr('disabled', false)               
    $("#especialidadAgregar").attr('disabled', false)   
    $("#sedeAgregar").attr('disabled', false)   
    $("#condicion").attr('disabled', false)   
    $("#edad").attr('disabled', false)   
    $("#porcentaje").attr('disabled', false)   
    $("#alumnoAgregar").attr("codigo", "");
    $("#alumnoAgregar").attr('disabled', false)  
    $("#alumnoAgregar").val("") 
    $("#tipoBeca").val("")            
    $("#especialidadAgregar").val("") 
    $("#sedeAgregar").val("") 
    $("#condicion").val("") 
    $("#edad").val("") 
    $("#porcentaje").val("") 

    listaDetallesReoslucion('0')
    $("#seccionDetalles").hide(200);
}

function verPDFresolucion(rutaPdf) {
            if (rutaPdf.trim() != path) {
                console.log("ruta", rutaPdf);
                $("#modalVistaPreviaCertificado").modal("show")
                $('#modalVistaPreviaCertificado .modal-body #divIframeCertificado').html("");
                let pdf = '<iframe src="' + rutaPdf + '" frameborder="0" width="100%" style="height: 65vh;"></iframe>'
                $('#modalVistaPreviaCertificado .modal-body #divIframeCertificado').html(pdf);

            } else {

                $('#modalVistaPreviaCertificado .modal-body #divIframeCertificado').html("");
                Notiflix.Report.Warning("Ooops", "No se encotro ninguna PDF para esta resolucion.");

            }
}

function descargarBecasPDF() {
    //const op = $(btn).attr("codigo");
    $.ajax({
        url: path + "informes/ficha",
        type: "POST",
        dataType: "JSON",
        data: {
            opcion: "solicitudPDF",
            alumno: $('#alumno').val().substring(0, 9),
            especialidad: $('#especialidad').val(),
            sede: $('#sede').val(),
            periodo: $('#periodo').val(),
        },
        beforeSend: function () {
            //$('.text-loader').text('GENERANDO CERTIFICADO, PORFAVOR ESPERE...');
            //$("#modalLoader").modal();
        },
        complete: function () {
            //$("#modalLoader").modal("hide");
        },
        success: function (response) {

            if (response.respuesta === "success") {

                $("#modalVistaPreviaCertificado").modal("show")
                $('#modalVistaPreviaCertificado .modal-body #divIframeCertificado').html("");
                let pdf = '<iframe src="' + response.solicitud + '" frameborder="0" width="100%" style="height: 65vh;"></iframe>'
                $('#modalVistaPreviaCertificado .modal-body #divIframeCertificado').html(pdf);

            } else {

                $('#modalVistaPreviaCertificado .modal-body #divIframeCertificado').html("");
                Notiflix.Report.Failure("Ooops, Ocurrio un error inesperado", "Por favor recargue la página y vuelva a intentarlo.", "Aceptar");

            }
        },
    })
}
 