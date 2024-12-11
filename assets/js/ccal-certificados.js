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
            .append("<div>" + item.cod_emp + " - " + item.nombre + "</div>")
            .appendTo(ul);
    };
    $("#docente").focus();
}

$("#docente").keyup(function(){
    if($(this).val().length < 1){
        $("#docente").attr("codigo","");
        $("#docente").next('i').removeClass('glyphicon-ok');
        $("#docente").next('i').addClass('glyphicon-remove');
        $("#docente").parent().removeClass('has-success');
        $("#docente").parent().addClass('has-error');
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
            .append("<div style='font-size:12px'>" + item.Cod_Curso.trim() + " - " + item.Descripcion.trim() + "</div>")
            .appendTo(ul);
    };
};

$("#curso").keyup(function () {
    if ($(this).val().length < 1) {
        $("#curso").attr("codigo","");
        $("#curso").next('i').removeClass('glyphicon-ok');
        $("#curso").next('i').addClass('glyphicon-remove');
        $("#curso").parent().removeClass('has-success');
        $("#curso").parent().addClass('has-error');
    }
})

$("#btnBuscar").click(function () {
    cargarListado();
})

function cargarListado( reload = true ) {

    $.ajax({
        url: path + "ccal/certificados",
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
            if (reload) {
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
                            <tr class="success">
                                <td class="text-center">${key + 1}</td>
                                <td class="text-center">${el.Alumno.trim()}</td>
                                <td class="text-center">${el.CodAlumno.trim()}</td>                                
                                <td class="text-center">${el.TipoEspe.trim()}</td>                                
                                <td class="text-center">${el.Aula.trim()}</td>
                                <td class="text-center">${el.cod_curso.trim()}</td>
                                <td class="text-center">${el.Curso.trim()}</td>
                                <td class="text-center">${el.creditos.trim()}</td>  
                                <td class="text-center" style="color:${Number(el.Nota)>12?"blue":"red"}" ><b>${el.Nota.trim()}</b></td>                                
                                <td class="text-center">
                                    <input type="hidden" name="codigoAlumno[]" value="${el.CodAlumno.trim()}">
                                    <input style="cursor:pointer" checked type="checkbox" class="selectCheckbox"></input>
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

$(document).on("change", ".selectCheckbox", function () {    
    if ($(this).is(":checked")) {
        $(this).parent().parent().addClass("success");
        $(this).prev("input").attr("name", "codigoAlumno[]");
    } else {
        $(this).parent().parent().removeClass("success");
        $(this).prev("input").attr("name","");
    }
})

$("#btnModalGenerar").click(function(){
    $("#modalGenerarCertificados").modal({ backdrop: 'static', keyboard: false });
})

$("#btnGenerar").click(function () {

    Notiflix.Confirm.Show(
        'Confirmación',
        `¿Está seguro de generar certificado para los alumnos seleccionados?`,
        'Si',
        'No',
        function () {

            let req = $("#formGenerarCertificados").serializeArray();           

            if ( req.length < 1 ){                
                Notiflix.Notify.Warning("SELECCIONE MÍNIMO UN ALUMNO.");
                return;
            }

            if ($("#fechaEmision").val() == "") {
                Notiflix.Notify.Warning("SELECCIONE LA FECHA DE EMISIÓN.");
                return;
            }

            if ($("#curso").attr("codigo") == "") {
                Notiflix.Notify.Warning("SELECCIONE UN CURSO");
                return;
            }

            if ($("#docente").attr("codigo") == "") {
                Notiflix.Notify.Warning("SELECCIONE UN DOCENTE");
                return;
            }

            req.push({ name: "opcion", value: "generar" });
            req.push({ name: "fechaEmision", value: $("#fechaEmision").val() });
            req.push({ name: "anio", value: $("#anio").val() });
            req.push({ name: "mes", value: $("#mes").val() });
            req.push({ name: "curso", value: $("#curso").attr("codigo") });
            req.push({ name: "docente", value: $("#docente").attr("codigo") });            
               
            $.ajax({
                url: path + "ccal/certificados",
                type: "POST",
                dataType: "JSON",
                data: $.param(req),
                beforeSend: function () {                    
                    //$('.text-loader').text('GENERANDO CERTIFICADOS, PORFAVOR ESPERE...');
                    //$("#modalLoader").modal();   
                    $("#btnGenerar").html("GENERANDO Y DESCARGANDO...").prop("disabled",true);                 
                },
                complete: function () {
                    //$("#modalLoader").modal("hide");                    
                    $("#modalGenerarCertificados").modal("hide");
                    $("#btnGenerar").html("GENERAR").prop("disabled", false);  
                },
                success: function (response) {

                    if (response.respuesta === "success") {
                       
                        var $a = $("<a>");
                        $a.attr("href", response.certificado);
                        $("body").append($a);
                        $a.attr("download", "certificados.pdf");
                        $a[0].click();
                        $a.remove();
                        Notiflix.Notify.Success("CERTIFICADOS GENERADOS CON ÉXITO.",{timeout:6000});                                                

                    } else {

                        Notiflix.Notify.Failure("OCURRIO UN ERROR INESPERADO, PORFAVOR RECARGUE LA PÁGINA Y VUELVA A INTENTARLO.");

                    }

                },
            })

        },
        function (){}
    );

})