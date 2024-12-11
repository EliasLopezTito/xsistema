$(document).ready(function(){
    cargarInstituciones(true,false,cargarModulos);
    cargarInstituciones2(true,true,cargarListado);
    cargarSedes();
    cargarSedes2();
    cargarAulas(); 
    autcompleteDocentes();  
    autocompleteCurso(); 
})

$("#institucion").change(function () {
    cargarTipoEspecialidades(true,false,cargarModulos);    
})

$("#tipoEspecialidad").change(function () {
    cargarEspecialidades(true,false,cargarModulos);
})

$("#institucion2").change(function () {
    cargarTipoEspecialidades2(true,true,cargarListado);
})

$("#tipoEspecialidad2").change(function () {
    cargarEspecialidades2(true, true, cargarListado);
})

$("#especialidad2").change(function () {
    cargarListado();
})

$("#sede2").change(function () {
    cargarListado();
})

$("#especialidad").change(function () {
    cargarModulos();
})

$("#mes").change(function(){
    cargarAulas();
})

$("#anio").change(function () {
    cargarAulas();
})

$("#docentes").keyup(function(){
    if( $(this).val().length < 1 ){
        $("#docentes").attr("codigo", "");
        $("#docentes").next('i').removeClass('glyphicon-ok');
        $("#docentes").next('i').addClass('glyphicon-remove');
        $("#docentes").parent().removeClass('has-success');
        $("#docentes").parent().addClass('has-error');
    }
})

$("#curso").keyup(function () {
    if ($(this).val().length < 1) {
        $("#curso").attr("codigo", "");
        $("#curso").next('i').removeClass('glyphicon-ok');
        $("#curso").next('i').addClass('glyphicon-remove');
        $("#curso").parent().removeClass('has-success');
        $("#curso").parent().addClass('has-error');
    }
})

$("#formGuardar").submit(function (e) {

    e.preventDefault();

    const docente = $("#docentes").attr("codigo");
    const curso = $("#curso").attr("codigo");

    if (docente === "" || curso === "") {
        Notiflix.Notify.Warning("LOS CAMPOS DOCENTE Y CURSO SON OBLIGATORIOS");
        return;
    }

    let data = $(this).serializeArray();
    data.push({ name: "opcion", value: "registrar" });
    data.push({ name: "docente", value: docente });
    data.push({ name: "curso", value: curso });

    $.ajax({
        url: path + "practicas/rolPracticas",
        type: "POST",
        dataType: "JSON",
        data: $.param(data),
        beforeSend: function () {
            $("#btnRegistrar").prop("disabled",true).html("Registrando...");
        },
        complete: function () {            
            $("#btnRegistrar").prop("disabled",false).html("<span class='con-disk'></span> Registrar");
        },
        success: function (response) {

            if (response.respuesta === "success") {

                Notiflix.Notify.Success("INFORMACIÓN REGISTRADA CON ÉXITO.");
                cargarListado();

            } else {

                Notiflix.Report.Failure('ERROR INESPERADO', response.error, "Cerrar");

            }

        },
    });

})

function cargarAulas(){
    const mes = $("#mes").val();
    const anio = $("#anio").val();
    $.ajax({
        url: path + "practicas/rolPracticas",
        type: "POST",
        dataType: "JSON",
        data: {
            opcion: "cargarAulas",
            mes: mes,
            anio: anio
        },
        beforeSend: function(){
            $("#aula").html("");
        },
        success: function (data) {
                     
            if (data.respuesta === "success") {
                data.data.forEach( e => {
                    $("#aula").append(`<option>${e.cod_aula}</option>`)
                });
            }
        }
    });
}

function cargarModulos() {  
    const local = $("#institucion").val();
    const sede = $("#sede").val();
    const tespe = $("#tipoEspecialidad").val();
    const espe = $("#especialidad").val();
    
    $.ajax({
        url: path + "practicas/rolPracticas",
        type: "POST",
        dataType: "JSON",
        data: {
            opcion: "cargarModulos",
            local: local,
            sede: sede,
            tespe: tespe,
            espe: espe
        },
        beforeSend: function () {
            $("#modulo").html("");
        },
        success: function (data) {          
            if (data.respuesta === "success") {
                data.data.forEach(e => {
                    $("#modulo").append(`<option>${e.modulo}</option>`)
                });
            }
        }
    });
}

function autcompleteDocentes(){
    $("#docentes").autocomplete({
        source: function (request, response) {
            $.ajax({
                url: path + "programacion/datosDocente",
                dataType: "json",
                method: "post",
                data: {
                    docente: request.term,
                    opcion: 'buscarDocente'
                },
                success: function (data) {
                    $("#docentes").attr("codigo","");
                    $("#docentes").next('i').removeClass('glyphicon-ok');
                    $("#docentes").next('i').addClass('glyphicon-remove');
                    $("#docentes").parent().removeClass('has-success');
                    $("#docentes").parent().addClass('has-error');                    
                    let result = (!data.docentes) ? [{ vacio: true }] : data.docentes;
                    response(result);
                }
            });
        },
        minLength: 2,
        select: function (event, ui) {
            if (ui.item.vacio) {
                event.preventDefault();
            } else {
                $("#docentes").attr("codigo",ui.item.cod_emp);
                $("#docentes").val(ui.item.cod_emp + " - " + ui.item.nombre);
                $("#docentes").next('i').removeClass('glyphicon-remove');
                $("#docentes").next('i').addClass('glyphicon-ok');
                $("#docentes").parent().removeClass('has-error');
                $("#docentes").parent().addClass('has-success');                
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
            .append("<div>"+item.cod_emp+" - "+item.nombre+"</div>")
            .appendTo(ul);
    };
}

function autocompleteCurso() {
    $("#curso").autocomplete({
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
                    $("#curso").attr("codigo", "");
                    $("#curso").next('i').removeClass('glyphicon-ok');
                    $("#curso").next('i').addClass('glyphicon-remove');
                    $("#curso").parent().removeClass('has-success');
                    $("#curso").parent().addClass('has-error');
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
                $("#curso").val(ui.item.Cod_Curso.trim() + " - " + ui.item.Descripcion.trim());
                $("#curso").attr('codigo', ui.item.Cod_Curso.trim());
                $("#curso").next('i').removeClass('glyphicon-remove');
                $("#curso").next('i').addClass('glyphicon-ok');
                $("#curso").parent().removeClass('has-error');
                $("#curso").parent().addClass('has-success');                
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

function cargarListado(){

    const local = $("#institucion2").val();
    const sede = $("#sede2").val();
    const tespe = $("#tipoEspecialidad2").val();
    const espe = $("#especialidad2").val();

    $.ajax({
        url: path + "practicas/rolPracticas",
        type: "POST",
        dataType: "JSON",
        data: {
            opcion: "cargarListado",
            local: local,
            sede: sede,
            tespe: tespe,
            espe: espe
        },
        beforeSend: function () {   
            $("#tblListado tbody").html("");         
        },
        complete: function () {            
        },
        success: function (data) {

            if (data.respuesta === "success") {

                data.data.forEach( (e,k) => {
                    $("#tblListado tbody").append(`
                        <tr>
                            <td class="text-center">${k+1}</td>
                            <td class="text-center">${e.Curso.trim()}</td>
                            <td class="text-center">${e.Docente.trim()}</td>
                            <td class="text-center">${e.Especialidad.trim()}</td>
                            <td class="text-center">${e.Rol.trim()}</td>
                            <td class="text-center">${e.Dia}</td>
                            <td class="text-center">${e.NroAlumno.trim()}</td>
                            <td class="text-center">${e.cod_aula.trim()}</td>
                            <td class="text-center">${e.cod_ciclo.trim()}</td>
                            <td class="text-center">${e.cod_modulo.trim()}</td>
                            <td class="text-center">${e.fecha.trim()}</td>
                            <td class="text-center">${e.Turno.trim()}</td>
                            <td class="text-center">
                                <button class="btn boton-rojo boton-tabla" op="${e.Op}" type="button" onclick="eliminar(this)"> <span class="icon-bin"></span></button>
                            </td>
                        </tr>
                    `);
                });

                Notiflix.Notify.Success("INFORMACIÓN CARGADA CON ÉXITO.");

            } else {

                Notiflix.Report.Failure('ERROR INESPERADO', data.error, "Cerrar");

            }
        }
    });

}

function eliminar( btn ){

    const op = $(btn).attr("op");

    Notiflix.Confirm.Show(
        'Confirmación',
        '¿Está seguro de eliminar el registro seleccionado?',
        'Si',
        'No',
        function () {

            $.ajax({
                url: path + "practicas/rolPracticas",
                type: "POST",
                dataType: "JSON",
                data: {
                    opcion: "eliminar",
                    op: op
                },
                beforeSend: function () {
                },
                complete: function () {
                },
                success: function (data) {

                    if (data.respuesta === "success") {

                        Notiflix.Notify.Success("SE ELIMINO CON ÉXITO LA FILA SELECCIONADA.");
                        cargarListado();

                    } else {

                        Notiflix.Report.Failure('ERROR INESPERADO', data.error, "Cerrar");

                    }
                }
            });

        }
        , function () {           
        });
   
}