const rgb = [
    "rgba(54, 162, 235, 0.3)",
    "rgba(75, 192, 192, 0.3)",
    "rgba(255, 205, 86, 0.3)",
    "rgba(255, 99, 132, 0.3)",
    "rgba(201, 203, 207, 0.3)",
    "rgba(83, 211, 87, 0.3)",
    "rgba(237, 208, 98, 0.3)"
]

$(document).ready(function () {

    autocompleteDocentes();
    autocompleteCurso();    

});

function autocompleteDocentes() {
    $("#docente").autocomplete({
        source: function (request, response) {
            $.ajax({
                url: path + "Notas/verRegistro",
                dataType: "json",
                data: {
                    term: request.term,
                    opcion: 'buscarDocente'
                },
                success: function (data) {
                    $("#docente").attr("codigo","");
                    $("#docente").next('i').removeClass('glyphicon-ok');
                    $("#docente").next('i').addClass('glyphicon-remove');
                    $("#docente").parent().removeClass('has-success');
                    $("#docente").parent().addClass('has-error');                    
                    let result = (!data.docentes) ? [{ vacio: true }] : data.docentes;
                    response(result);
                }
            });
        },
        minLength: 3,
        select: function (event, ui) {
            if (ui.item.vacio) {
                event.preventDefault();
            } else {
                $("#docente").val(ui.item.cod_emp+" "+ui.item.nombre);
                $("#docente").attr('codigo', ui.item.cod_emp);
                $("#docente").next('i').removeClass('glyphicon-remove');
                $("#docente").next('i').addClass('glyphicon-ok');
                $("#docente").parent().removeClass('has-error');
                $("#docente").parent().addClass('has-success');                
            }
            return false;
        }
    })
    .autocomplete("instance")._renderItem = function (ul, item) {
        if (item.vacio) {
            return $("<li>")
                .append("<div>No se encontraron resultados</div>")
                .appendTo(ul);
        }
        return $("<li>")
            .append("<div style='font-size:11px'> <b>" + item.cod_emp + "</b> - " + item.nombre + "</div>")
            .appendTo(ul);
    };
    $("#docente").focus();
}

$("#docente").keyup(function(){
    if($(this).val().length < 1){
        $("#docente").attr("codigo","");
        $("#docente").next('i').removeClass('glyphicon-ok');
        $("#docente").next('i').removeClass('glyphicon-remove');
        $("#docente").parent().removeClass('has-success');
        $("#docente").parent().removeClass('has-error');
    }
})

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
            .append("<div style='font-size:11px'>" + item.Cod_Curso.trim() + " - " + item.Descripcion.trim() + "</div>")
            .appendTo(ul);
    };
};

$("#curso").keyup(function () {
    if ($(this).val().length < 1) {
        $("#curso").attr("codigo","");
        $("#curso").next('i').removeClass('glyphicon-ok');
        $("#curso").next('i').removeClass('glyphicon-remove');
        $("#curso").parent().removeClass('has-success');
        $("#curso").parent().removeClass('has-error');
    }
})

$("#btnBuscar").click(function () {
    cargarListado();
})

function cargarListado( loader = true ) {

    $.ajax({
        url: path + "ccal/certificadosEmitidos",
        type: "POST",
        dataType: "JSON",
        data: {
            opcion: "buscar",            
            anio: $("#anio").val(),
            mes: $("#mes").val(),
            curso: $("#curso").attr("codigo"),
            docente: $("#docente").attr("codigo")
        },
        beforeSend: function () {
            if (loader) {
                $('.text-loader').text('CARGANDO LISTADO, PORFAVOR ESPERE...');
                $("#modalLoader").modal();
            }
            $("#tablaListadoAlumnos tbody").html("");
        },
        complete: function () {
            $("#modalLoader").modal("hide");
        },
        success: function (response) {
                
            if (response.respuesta === "success") {                
                if(response.data.length > 0){
                    response.data.forEach((el, key) => {
                        $("#tablaListadoAlumnos tbody").append(`
                            <tr>
                                <td class="text-center">${key + 1}</td>
                                <td class="text-center">${el.Alumno.trim()}</td>
                                <td class="text-center">${el.CodAlumno.trim()}</td>                                
                                <td class="text-center">${el.TipoEspe.trim()}</td>                                
                                <td class="text-center">${el.Aula.trim()}</td>
                                <td class="text-center">${el.cod_curso.trim()}</td>
                                <td class="text-center">${el.Curso.trim()}</td>
                                <td class="text-center">${el.creditos}</td>  
                                <td class="text-center" style="color:${Number(el.Nota)>12?"blue":"red"}" ><b>${el.Nota.trim()}</b></td>                                
                                <td class="text-center">
                                    <button class="btn boton-tabla boton-rojo" op="${el.Op}" type="button" onclick="eliminar(this);"><span class="icon-bin"></span></button>
                                </td>
                            </tr>
                        `);
                    });

                }else{
                    $("#tablaListadoAlumnos tbody").html(`
                        <tr class="text-center">
                            <td colspan="10"><b>NO SE ENCONTRÓ INFORMACIÓN</b></td>
                        </tr>
                    `);
                }
            } else {

                Notiflix.Report.Failure("Ooops, Ocurrio un error inesperado", "Por favor recargue la página y vuelva a intentarlo.", "Aceptar");

            }
        },
    })

}

function eliminar(btn){

    let op = $(btn).attr("op");

    Notiflix.Confirm.Show(
        'Confirmación',
        '¿Está seguro de eliminar el registro?',
        'Si',
        'No',
        function () {

            $.ajax({
                url: path + "ccal/certificadosEmitidos",
                type: "POST",
                dataType: "JSON",
                data: {
                    opcion: "eliminar",
                    op: op
                },                
                success: function (response) {

                    if (response.respuesta === "success") {

                        Notiflix.Notify.Success("Operación exitosa.");
                        cargarListado();

                    } else {

                        Notiflix.Report.Failure("Ooops, Ocurrio un error inesperado", "Por favor recargue la página y vuelva a intentarlo.", "Aceptar");

                    }
                },
            })            

        }, 
        function () {          
        }
    );
    
}