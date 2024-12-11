$(document).ready(function () {
    
    cargarInstituciones(true);

});

$("#btnConsultar").click(function(){

    const curso = $("#inputCursoBuscar").val().trim();
    cargarCursos( curso );

})

function cargarCursos( curso = "" ) {

    var tbody = $("#tablaCursos tbody");
    tbody.find("tr").remove();

    $.ajax({
        url: path + "notas/cursos",
        type: "POST",
        dataType : "JSON",
        data: {
            opcion: "select",
            curso : curso 
        },
        beforeSend: function () {
            $('.text-loader').text('CARGANDO CURSOS, POR FAVOR ESPERE...');
            $("#modalLoader").modal();
        },
        complete : function(){
            $("#modalLoader").modal("hide");
        },     
        success: function (datos) {
            console.log(datos);
            if (datos.respuesta === "success") {

                Notiflix.Notify.Success('Cursos cargados correctamente!');

                var cursos = datos.cursos;
                for (i = 0; i < cursos.length; i++) {
                    const curso = cursos[i];
                    const tr = " <tr>" +
                            "    <td class=\"celda-centrada\">" + curso.Cod_Curso.trim() + "</td>" +
                            "    <td class=\"celda-izquierda\">" + curso.Descripcion.trim() + "</td>" +
                            "    <td class=\"celda-izquierda\">" + curso.Des_Corta.trim() + "</td>" +
                            "    <td class=\"celda-centrada\">" +
                            "        <button cod_local=\""+curso.Cod_local+"\" class=\"btn boton-tabla boton-verde\" type=\"button\" onclick=\"editarCurso(this);\" title=\"Editar Curso\"><span class=\"icon-pencil\"></span></button>" +
                            "        <button disabled class=\"btn boton-tabla boton-rojo\" type=\"button\" onclick=\"eliminarCurso(this);\" title=\"Eliminar Curso\"><span class=\"icon-bin\"></span></button>" +
                            "    </td>" +
                            "</tr>";
                    tbody.append(tr);
                }
                
            } else {

                Notiflix.Notify.Failure('Ocurrio un error inesperado');

            }
        }
    });
}






function nuevoCurso(){
    $("#codCursoM").val("M");
    $("#descripcionM").val("");
    $("#desCortaM").val("");
    $("#codCursoM").attr("disabled", false);
    $("#opcion").val("create");
    $("#codCursoM").focus();
    $("#tituloModal").html("Nuevo Curso");
    $("#modalCurso").modal({backdrop: 'static', keyboard: false});
}

function eliminarCurso(btn) {
    $("#codCursoD").val($(btn).parent().parent().find("td").eq(0).html());
    var descripcion = $(btn).parent().parent().find("td").eq(1).html();
    var mensaje = "Seguro de eliminar el curso: " + $("#codCursoD").val() + " - " + descripcion;
    mostrarMensaje("confirmacion", "CONFIRMAR", mensaje);
}

function editarCurso(btn) {

    if ($(btn).attr("cod_local") === "null") {
        $("#institucion option[value='01']").prop("selected",true);
    }else{
        $("#institucion option[value="+$(btn).attr("cod_local").trim()+"]").prop("selected",true);
    }

    $("#codCursoM").val($(btn).parent().parent().find("td").eq(0).html());
    $("#descripcionM").val($(btn).parent().parent().find("td").eq(1).html());
    $("#desCortaM").val($(btn).parent().parent().find("td").eq(2).html());
    $("#opcion").val("update");
    $("#codCursoM").attr("disabled", true);
    $("#descripcionM").focus();
    $("#tituloModal").html("Editar Curso");
    $("#modalCurso").modal({backdrop: 'static', keyboard: false});
}

$("#btnGrabarM").click(function () {
    var codCurso = $("#codCursoM").val();
    var descripcion = $("#descripcionM").val();
    var desCorta = $("#desCortaM").val();
    var institucion = $("#institucion").val();
    var opcion = $("#opcion").val();

    $.ajax({
        url: path + "notas/cursos",
        type: "POST",
        data: {
            codCurso: codCurso,
            descripcion: descripcion,
            desCorta: desCorta,
            opcion: opcion,
            institucion: institucion
        },
        success: function (data) {           
            var datos = JSON.parse(data);
            if (datos.respuesta == "success") {
                $("#modalCurso").modal("hide");
                cargarCursos();
            } else {
                var errores = "";
                for (i = 0; i < datos.errores.length; i++) {
                    errores += datos.errores[i] + "<br>";
                }
                mostrarMensaje("error", "ERROR", errores);
            }
        }
    });
});

$("#mensaje-boton-aceptar").click(function () {
    var codCurso = $("#codCursoD").val();
    $.ajax({
        url: path + "notas/cursos",
        type: "POST",
        data: {
            codCurso: codCurso,
            opcion: "delete"
        },
        success: function (data) {
            //console.log(data);
            var datos = JSON.parse(data);
            if (datos.respuesta == "success") {
                $("#modalMensaje").modal("hide");
                cargarCursos();
            } else {
                var errores = "";
                for (i = 0; i < datos.errores.length; i++) {
                    errores += datos.errores[i] + "<br>";
                }
                mostrarMensaje("error", "ERROR", errores);
            }
        }
    });
});