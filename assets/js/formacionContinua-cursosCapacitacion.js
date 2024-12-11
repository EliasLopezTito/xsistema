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
}

document.addEventListener("DOMContentLoaded", () => {

    autocomplete();
    autocompleteModalAgregar();
    cargarTipoEspecialidades_(true);
    cargarTipoEspecialidades(true);  
    autocompleteCurso();  
    autocompleteCursoEditar();
    $("#tablaListado").DataTable({ data: [], language: language, ordering: false });    

});

$("#btnModalExcel").click(function(){
    $("#modalExportarExcel").modal({backdrop:"static",keyboard:false})
})

$("#btnExportarExcel").click(function(){
    const anio = $("#anioExcel").val();
    $.ajax({
        url: path + "formacionContinua/cursosCapacitacion",
        type: "POST",
        dataType: "JSON",
        data: {
            opcion:"exportarExcel",
            anio: anio
        },
        beforeSend: function () {  
            $("#btnExportarExcel").prop("disabled",true).html("EXPORTANDO...");                     
        },
        complete: function () {            
            $("#btnExportarExcel").prop("disabled",false).html("Exportar");                     
        },
        success: function (datos) {

            console.log(datos)            

            if (datos.respuesta === "success") {

                var a = $("<a>");
                a.attr("href", datos.file);
                $("body").append(a);
                a.attr("download", "cursosCapacitacion.xlsx");
                a[0].click();
                a.remove();
                Notiflix.Notify.Success("EL DOCUMENTO SE GENERÓ CON ÉXITO.")

            } else {

                Notiflix.Notify.Failure( "OCURRIO UN ERROR INESPERADO, POR FAVOR RECARGUE LA PÁGINA Y VUELVA A INTENTARLO --> " + datos.error , {timeout:6000} );

            }

            }
    });

})

$("#tipoEspecialidad_").change(function () {
    cargarEspecialidades_();
})

function cargarTipoEspecialidades_(enlazado) {
    var institucion = $("#institucion_").val();
    $.ajax({
        url: path + "tipoEspecialidad/getTipoEspecialidades",
        type: "POST",
        data: {
            institucion: institucion
        },
        success: function (data) {
            //console.log(data);
            var cboTipoEspecialidad = $("#tipoEspecialidad_");
            cboTipoEspecialidad.find('option').remove();
            var datos = JSON.parse(data);
            if (datos.respuesta == "success") {
                if (datos.tipoEspecialidades != "vacio") {
                    var tipoEspecialidades = datos.tipoEspecialidades;
                    cboTipoEspecialidad.append(`<option value="0">TODOS</option>`)
                    for (i = 0; i < tipoEspecialidades.length; i++) {
                        var tipoEspecialidad = tipoEspecialidades[i];
                        cboTipoEspecialidad.append("<option value=\"" + tipoEspecialidad.tipo_espe + "\" >" + tipoEspecialidad.tipo_espe + " - " + tipoEspecialidad.descripcion + "</option>");
                    }
                    if (enlazado == true) {
                        cargarEspecialidades_(enlazado);
                    }
                }
            } else {
                mostrarMensaje("error", "ERROR", datos.errores);
            }
        }
    });
}

function cargarEspecialidades_(enlazado) {
    var institucion = $("#institucion_").val();
    var tipoEspecialidad = $("#tipoEspecialidad_").val();
    $.ajax({
        url: path + "especialidad/getEspecialidades",
        type: "POST",
        data: {
            institucion: institucion,
            tipoEspecialidad: tipoEspecialidad
        },
        success: function (data) {
            //console.log(data);
            var cboEspecialidad = $("#especialidad_");
            cboEspecialidad.find('option').remove();
            var datos = JSON.parse(data);
            if (datos.respuesta == "success") {
                cboEspecialidad.append(`<option value="0">TODOS</option>`)
                if (datos.especialidades != "vacio") {
                    var especialidades = datos.especialidades;
                    for (i = 0; i < especialidades.length; i++) {
                        var especialidad = especialidades[i];
                        cboEspecialidad.append("<option value=\"" + especialidad.cod_espe + "\" >" + especialidad.cod_espe + " - " + especialidad.descripcionM + "</option>");
                    }
                    if (enlazado == true) {
                        cargarMallaCurriculares(enlazado);
                    }
                }
            } else {
                mostrarMensaje("error", "ERROR", datos.errores);
            }
        }
    });
}

function autocomplete() {
    $("#alumno").autocomplete({
        source: function (request, response) {
            $.ajax({
                url: path + "Programacion/descargarBoleta",
                dataType: "json",
                type: 'post',
                data: {
                    term: request.term,
                    opcion: 'searchAlumnos'
                },
                success: function (data) {
                    reiniciar();
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
                $("#alumno").attr('codigo', ui.item.cod_alumno);
                $("#alumno").next('i').removeClass('glyphicon-remove');
                $("#alumno").next('i').addClass('glyphicon-ok');
                $("#alumno").parent().removeClass('has-error');
                $("#alumno").parent().addClass('has-success');
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
};

$("#alumno").keyup(function () {
    if ($(this).val().length < 1) {
        reiniciar();
    }
})

function reiniciar() {
    $("#alumno").attr("codigo", "0");
    $("#alumno").next('i').removeClass('glyphicon-ok');
    $("#alumno").next('i').addClass('glyphicon-remove');
    $("#alumno").parent().removeClass('has-success');
    $("#alumno").parent().addClass('has-error');    
    $("#alumno").focus();

    $('#tablaListado').empty();
    $('#tablaListado').dataTable().fnDestroy();
    $("#tablaListado").DataTable({ data: [], language: language, ordering: false });
}

$("#btnCargarListado").click(function () {
    
    cargarListado();

})

function cargarListado(){

    $('#tablaListado').empty();
    $('#tablaListado').dataTable().fnDestroy();
    $("#tablaListado").DataTable({
        ordering: false,
        ajax: {
            url: path + "formacionContinua/cursosCapacitacion",
            type: 'post',
            beforeSend: function () {
                $('.text-loader').text('Cargando información, por favor espere..');
                $("#modalLoader").modal();
            },
            data: {
                opcion: 'cargarInformacion',
                codigo: $("#alumno").attr("codigo"),
                tespe: $("#tipoEspecialidad_").val(),
                espe: $("#especialidad_").val()
            },
            dataSrc: function (data) {
                return data.data;
            },
            complete: function (data) {
                $("#modalLoader").modal("hide");
            }
        },
        lengthMenu: [
            [25, 50, 100, 0],
            [25, 50, 100, 'Todos']
        ],
        columnDefs: [
            {
                targets: '_all',
                className: 'celda-centrada',
                orderable: false
            }
        ],
        columns: [
            {
                data: null,
                render: function (data, type, row, meta) {
                    return meta.row + meta.settings._iDisplayStart + 1;
                }
            },
            { data: 'cod_alumno' },
            { data: 'Alumno' },
            { data: 'TipoEspe' },
            { data: 'Especialidad' },
            { data: 'codigo' },
            { data: 'turno' },
            {
                data: null,
                render: function (data, type, row, meta) {
                    return data.Cod_Curso.trim();
                }
            },
            {
                data: null,
                render: function (data, type, row, meta) {
                    return data.Curso.trim();
                }
            },
            {
                data: null,
                render: function (data, type, row, meta) {
                    return data.ano.trim();
                }
            },
            {
                data: null,
                render: function (data, type, row, meta) {
                    return data.mes.trim();
                }
            },
            {
                data: null,
                render: function (data, type, row, meta) {
                    return data.observacion.trim();
                }
            },
            {
                data: null,
                render: function (data, type, row, meta) {
                    return Number(data.Nota) >= 13 ? "<span style='color:blue'>" + data.Nota + "</span>" : "<span style='color:red'>" + data.Nota + "</span>";
                }
            },
            {
                data: null,
                render: function (data, type, row, meta) {
                    
                    return `
                        <button class="btn boton-naranja boton-tabla" type="button" data='${ JSON.stringify(data) }' onclick="informacionEditar(this)"> <span class="icon-pencil2"></span></button>
                    `;
                }
            }
        ],
        createdRow: function (row, data, dataIndex) {            
            $(row).css({"background":data.color});            
        },
        language: language
    });

}

/***********************************
 * SECCION EDITAR
***********************************/
function autocompleteCursoEditar() {
    $("#cursoEditar").autocomplete({
        source: function (request, response) {
            $.ajax({
                url: path + "formacionContinua/cursosCapacitacion",
                dataType: "JSON",
                type: 'POST',
                data: {
                    term: request.term,
                    opcion: 'buscarCurso'
                },
                success: function (data) {
                    $("#cursoEditar").attr("codigo", "");
                    $("#cursoEditar").next('i').removeClass('glyphicon-ok');
                    $("#cursoEditar").next('i').addClass('glyphicon-remove');
                    $("#cursoEditar").parent().removeClass('has-success');
                    $("#cursoEditar").parent().addClass('has-error');
                    let result = (!data.cursos) ? [{ vacio: true }] : data.cursos;
                    response(result);
                }
            });
        },
        minLength: 2,
        select: function (event, ui) {
            if (ui.item.vacio) {
                event.preventDefault();
            } else {
                $("#cursoEditar").val(ui.item.Cod_Curso.trim() + " - " + ui.item.Descripcion.trim());
                $("#cursoEditar").attr('codigo', ui.item.Cod_Curso.trim());
                $("#cursoEditar").next('i').removeClass('glyphicon-remove');
                $("#cursoEditar").next('i').addClass('glyphicon-ok');
                $("#cursoEditar").parent().removeClass('has-error');
                $("#cursoEditar").parent().addClass('has-success');
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
                .append("<div style='font-size:12px'>" + item.Cod_Curso.trim() + " - " + item.Descripcion.trim() + "</div>")
                .appendTo(ul);
        };
};

$("#cursoEditar").keyup(function () {
    if ($(this).val().length < 1) {
        $("#cursoEditar").attr("codigo", "");
        $("#cursoEditar").next('i').removeClass('glyphicon-ok');
        $("#cursoEditar").next('i').addClass('glyphicon-remove');
        $("#cursoEditar").parent().removeClass('has-success');
        $("#cursoEditar").parent().addClass('has-error');
    }
})

function informacionEditar(btn){

    const data = JSON.parse( $(btn).attr("data") );
    $("#idEditar").val(data.Op);
    $("#codAlumnoEditar").val(data.cod_alumno.trim());
    $("#nombresEditar").val(data.Nombres.trim());
    $("#apellidosEditar").val(data.Apellidos.trim());
    $("#tEspeEditar").html(`<option value="${data.tip_espe.trim()}">${data.TipoEspe.trim()}</option>`);
    $("#espeEditar").html(`<option value="${data.Cod_espe.trim()}">${data.Especialidad.trim()}</option>`);
    $("#codigoEditar").val(data.codigo.trim());
    $("#turnoEditar").val(data.turno.trim());
    $("#anioEditar").val(data.ano.trim());
    $("#mesEditar").val(data.mes.trim());
    $("#notaEditar").val(data.Nota.trim());

    $("#cursoEditar").val(data.Cod_Curso.trim()+" - "+data.Curso.trim());
    $("#cursoEditar").attr('codigo', data.Cod_Curso.trim());
    $("#cursoEditar").next('i').removeClass('glyphicon-remove');
    $("#cursoEditar").next('i').addClass('glyphicon-ok');
    $("#cursoEditar").parent().removeClass('has-error');
    $("#cursoEditar").parent().addClass('has-success');

    $("#observacionEditar").val(data.observacion.trim());

    $("#modalEditar").modal({backdrop:'static',keyboard:false})

}

$("#formEditar").submit(function (e) {

    e.preventDefault();
    let data = $(this).serializeArray();
    data.push({ name: "opcion", value: "editar" })    
    data.push({ name: "codigoCurso", value: $("#cursoEditar").attr("codigo") });

    $.ajax({
        url: path + "formacionContinua/cursosCapacitacion",
        dataType: "JSON",
        type: 'POST',
        data: $.param(data),
        beforeSend: function () {
            $("#btnActualizar").prop("disabled", true).html("Actualizando...");
        },
        complete: function () {
            $("#btnActualizar").prop("disabled",false).html("Actualizar");                        
        },
        success: function (data) {

            if (data.respuesta === "success") {
                Notiflix.Notify.Success('EL REGISTRO SE ACTUALIZO CON ÉXITO', { timeout: 5000 });                
                cargarListado();
            } else if (data.respuesta === "warning") {
                Notiflix.Notify.Warning(data.error, { timeout: 5000 });
            } else {
                Notiflix.Notify.Failure('OCURRIO UN ERROR INESPERADO POR FAVOR RECARGUE LA PÁGINA Y VUELVA HA INTENTARLO.', { timeout: 5000 });
            }

        }
    });

})

/***********************************
 * SECCION AGREGAR
***********************************/
//AUTOCOMPLETE ALUMNO MODAL
function autocompleteModalAgregar() {
    $("#alumnoAgregar").autocomplete({
        source: function (request, response) {
            $.ajax({
                url: path + "Programacion/descargarBoleta",
                dataType: "json",
                type: 'post',
                data: {
                    term: request.term,
                    opcion: 'searchAlumnos'
                },
                success: function (data) {
                    $("#alumnoAgregar").attr("codigo", "");
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
                $("#alumnoAgregar").attr('codigo', ui.item.cod_alumno);
                $("#alumnoAgregar").next('i').removeClass('glyphicon-remove');
                $("#alumnoAgregar").next('i').addClass('glyphicon-ok');
                $("#alumnoAgregar").parent().removeClass('has-error');
                $("#alumnoAgregar").parent().addClass('has-success');
                cargarInformacionMatricula(ui.item.cod_alumno);
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
};

$("#alumnoAgregar").keyup(function () {
    if ($(this).val().length < 1) {
        $("#alumnoAgregar").attr("codigo", "");
        $("#alumnoAgregar").next('i').removeClass('glyphicon-ok');
        $("#alumnoAgregar").next('i').addClass('glyphicon-remove');
        $("#alumnoAgregar").parent().removeClass('has-success');
        $("#alumnoAgregar").parent().addClass('has-error');
    }
})

//AUTOCOMPLETE CURSO MODAL
function autocompleteCurso() {
    $("#cursoAgregar").autocomplete({
        source: function (request, response) {
            $.ajax({
                url: path + "formacionContinua/cursosCapacitacion",
                dataType: "JSON",
                type: 'POST',
                data: {
                    term: request.term,
                    opcion: 'buscarCurso'
                },
                success: function (data) {                    
                    $("#cursoAgregar").attr("codigo", "");
                    $("#cursoAgregar").next('i').removeClass('glyphicon-ok');
                    $("#cursoAgregar").next('i').addClass('glyphicon-remove');
                    $("#cursoAgregar").parent().removeClass('has-success');
                    $("#cursoAgregar").parent().addClass('has-error');
                    let result = (!data.cursos) ? [{ vacio: true }] : data.cursos;
                    response(result);
                }
            });
        },
        minLength: 2,
        select: function (event, ui) {
            if (ui.item.vacio) {
                event.preventDefault();
            } else {
                $("#cursoAgregar").val(ui.item.Cod_Curso.trim() + " - " + ui.item.Descripcion.trim());
                $("#cursoAgregar").attr('codigo', ui.item.Cod_Curso.trim());
                $("#cursoAgregar").next('i').removeClass('glyphicon-remove');
                $("#cursoAgregar").next('i').addClass('glyphicon-ok');
                $("#cursoAgregar").parent().removeClass('has-error');
                $("#cursoAgregar").parent().addClass('has-success');
                cargarNota();                
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
            .append("<div style='font-size:12px'>" + item.Cod_Curso.trim() + " - " + item.Descripcion.trim() + "</div>")
            .appendTo(ul);
    };
};

$("#cursoAgregar").keyup(function () {
    if ($(this).val().length < 1) {
        $("#cursoAgregar").attr("codigo", "");
        $("#cursoAgregar").next('i').removeClass('glyphicon-ok');
        $("#cursoAgregar").next('i').addClass('glyphicon-remove');
        $("#cursoAgregar").parent().removeClass('has-success');
        $("#cursoAgregar").parent().addClass('has-error');
    }
})

function cargarEspecialidadesModal(espe) {
    var institucion = $("#institucion").val();
    var tipoEspecialidad = $("#tipoEspecialidad").val();
    $.ajax({
        url: path + "especialidad/getEspecialidades",
        type: "POST",
        data: {
            institucion: institucion,
            tipoEspecialidad: tipoEspecialidad
        },
        success: function (data) {            
            var cboEspecialidad = $("#especialidad");
            cboEspecialidad.find('option').remove();
            var datos = JSON.parse(data);
            if (datos.respuesta == "success") {                
                if (datos.especialidades != "vacio") {
                    var especialidades = datos.especialidades;
                    for (i = 0; i < especialidades.length; i++) {
                        var especialidad = especialidades[i];
                        cboEspecialidad.append("<option " + (especialidad.cod_espe.trim() === espe.trim() ? "selected" : "")+" value=\"" + especialidad.cod_espe + "\" >" + especialidad.cod_espe + " - " + especialidad.descripcionM + "</option>");
                    }                                      
                }
            } else {
                mostrarMensaje("error", "ERROR", datos.errores);
            }
        }
    });
}

$("#tipoEspecialidad").change(function () {
    cargarEspecialidades();        
})

$("#especialidad").change(function () {    
    cargarNota();
})
$("#anioAgregar").change(function () {
    cargarNota();
})
$("#mesAgregar").change(function () {
    cargarNota();
})

function cargarNota(){
    const tespe = $("#tipoEspecialidad").val();
    const espe = $("#especialidad").val();
    const curso = $("#cursoAgregar").attr("codigo");
    const anio = $("#anioAgregar").val();
    const mes = $("#mesAgregar").val();
    const alumno = $("#alumnoAgregar").attr("codigo");
    if (tespe !== "" && tespe !== null && espe !== "" && espe !== null && curso !== "" && curso !== null) {
        $.ajax({
            url: path + "formacionContinua/cursosCapacitacion",
            dataType: "JSON",
            type: 'POST',
            data: {
                opcion: "cargarNota",
                tespe: tespe,
                espe: espe,
                curso: curso,
                anio: anio,
                mes: mes,
                alumno: alumno
            },
            success: function (data) {
                if (data.respuesta === "success") {
                    if (data.data.length > 0) {
                        $("#notaAgregar").val(data.data[0].Nota);
                    }
                }
            }
        });
    }
}

$("#btnAgregarAlumno").click(function () {
    $("#modalAgregarAlumno").modal({ backdrop: 'static', keyboard: false });
})

$("#checkNuevo").on('change', function () {
    if ($(this).is(':checked')) {              
        
        $("#alumnoAgregar").attr("codigo", "").val("").prop("disabled",true);
        $("#alumnoAgregar").next('i').removeClass('glyphicon-ok');
        $("#alumnoAgregar").next('i').addClass('glyphicon-remove');
        $("#alumnoAgregar").parent().removeClass('has-success');
        $("#alumnoAgregar").parent().addClass('has-error');

        $("#nombresAgregar").prop("readonly",false).val("");
        $("#apellidosAgregar").prop("readonly",false).val("");
        
        $("#btnRegistrar").prop("disabled", false);
        cargarTipoEspecialidades(true);

    } else {

        $("#btnRegistrar").prop("disabled", true);
        $("#alumnoAgregar").attr("codigo", "").val("").prop("disabled", false);
        $("#nombresAgregar").prop("readonly", true).val("");
        $("#apellidosAgregar").prop("readonly", true).val("");  
              
    }
});

function reiniciarModalAgregar() {

    $("#alumnoAgregar").attr("codigo", "").val("").prop("disabled",false);
    $("#alumnoAgregar").next('i').removeClass('glyphicon-ok');
    $("#alumnoAgregar").next('i').addClass('glyphicon-remove');
    $("#alumnoAgregar").parent().removeClass('has-success');
    $("#alumnoAgregar").parent().addClass('has-error');
    
    $("#cursoAgregar").attr("codigo", "").val("");
    $("#cursoAgregar").next('i').removeClass('glyphicon-ok');
    $("#cursoAgregar").next('i').addClass('glyphicon-remove');
    $("#cursoAgregar").parent().removeClass('has-success');
    $("#cursoAgregar").parent().addClass('has-error');

    $("#turnoAgregar").val("");
    $("#codigoAgregar").val("");
    $("#notaAgregar").val("");
    $("#observacionAgregar").val("");

    $("#checkNuevo").prop('checked', false); 

    $("#nombresAgregar").prop("readonly", true).val("");
    $("#apellidosAgregar").prop("readonly", true).val("");

    $("#btnRegistrar").prop("disabled",true);

    cargarTipoEspecialidades(true);       
}

function cargarInformacionMatricula(codigo){

    $.ajax({
        url: path + "formacionContinua/cursosCapacitacion",
        dataType: "JSON",
        type: 'POST',
        data: {
            opcion: "cargarInformacionMatricula",
            codigo: codigo
        },
        beforeSend: function(){
        },
        complete: function(){
        },
        success: function (data) {
            
            if(data.respuesta === "success"){

                const info = data.data; 
                if(info[0].estado === "vacio"){
                    
                    /**$("#alumnoAgregar").val("").attr("codigo", "");
                    $("#alumnoAgregar").next('i').removeClass('glyphicon-ok');
                    $("#alumnoAgregar").next('i').addClass('glyphicon-remove');
                    $("#alumnoAgregar").parent().removeClass('has-success');
                    $("#alumnoAgregar").parent().addClass('has-error'); **/
                    cargarTipoEspecialidades(true);
                    $("#nombresAgregar").val(info[0].nombre_alumno.trim());
                    $("#apellidosAgregar").val(info[0].apell_alumno.trim());
                    $("#btnRegistrar").prop("disabled", false);
                    //Notiflix.Notify.Warning('EL ALUMNO DEBE PERTENECER AL LOCAL "ARZOBISPO LOAYZA" (17).',{timeout:5000});

                }else{
                                                                                                 
                    //$("#tipoEspecialidad").html(`<option value="${info[0].tipo_espe.trim()}">${info[0].tipo_espe.trim()} - ${info[0].des_tespe.trim() }</option>`)
                    $("#tipoEspecialidad").val(info[0].tipo_espe.trim());
                    //$("#especialidad").html(`<option value="${info[0].cod_espe.trim()}">${info[0].cod_espe.trim()} - ${info[0].des_espe.trim()}</option>`)
                    $("#nombresAgregar").val(info[0].nombre_alumno.trim());
                    $("#apellidosAgregar").val(info[0].apell_alumno.trim());
                    $("#btnRegistrar").prop("disabled",false);
                    cargarEspecialidadesModal(info[0].cod_espe.trim());

                }

            }else{

            }

        }
    });

}

$("#formAgregar").submit(function(e){
    
    e.preventDefault();
    let data = $(this).serializeArray();
    data.push({ name: "opcion",value:"registrar"})
    data.push({ name: "codigoAlumno", value: $("#alumnoAgregar").attr("codigo") });
    data.push({ name: "codigoCurso", value: $("#cursoAgregar").attr("codigo") });
    
    $.ajax({
        url: path + "formacionContinua/cursosCapacitacion",
        dataType: "JSON",
        type: 'POST',
        data: $.param(data),
        beforeSend: function () {            
            $("#btnRegistrar").prop("disabled",true).html("Registrando...");
        },
        complete: function () {            
            $("#btnRegistrar").html("Guardar");                
        },
        success: function (data) {

            if (data.respuesta === "success") {         

                Notiflix.Notify.Success('LA OPERACIÓN SE REALIZO CON ÉXITO', { timeout: 5000 });  
                reiniciarModalAgregar();   
                $("#modalAgregarAlumno").modal("hide");
                cargarListado();                 
                
            } else if(data.respuesta === "warning" ) {

                Notiflix.Notify.Warning( data.error , { timeout: 5000 });
                $("#btnRegistrar").prop("disabled", false)

            }else{
                Notiflix.Notify.Failure('OCURRIO UN ERROR INESPERADO POR FAVOR RECARGUE LA PÁGINA Y VUELVA HA INTENTARLO.', { timeout: 5000 });
            }

        }
    });

})

$("#cerrar-modal_").click(function(){
    reiniciarModalAgregar();
})