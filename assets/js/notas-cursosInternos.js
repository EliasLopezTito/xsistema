$(document).ready(function () {
    
});

$("#btnConsultar").click(function(){

    const curso = $("#inputCursoBuscar").val().trim();
    cargarCursos( curso );

})

function cargarCursos( curso ) {
    let tbody = $("#tablaCursos tbody");
    tbody.find("tr").remove();
    $.ajax({
        url: path + "notas/cursosInternos",
        type: "POST",
        dataType : "JSON",
        data: {
            opcion: "select",
            curso : curso 
        },          
        success: function ( datos ) {           
            if (datos.respuesta === "success") {
                const cursos = datos.cursos;
                for (i = 0; i < cursos.length; i++) {
                    const curso = cursos[i];
                    const tr = `<tr>
                                    <td class="celda-centrada"> ${curso.Codigo.trim()} </td>
                                    <td class="celda-izquierda"> ${curso.Nombre.trim()} </td>
                                    <td class="celda-izquierda"> ${curso.Descripcion.trim()} </td>
                                    <td class="celda-centrada"> ${curso.NHoras} </td>
                                    <td class="celda-centrada">                                    
                                        <button class="btn boton-tabla boton-verde" type="button" horas="${curso.NHoras}" codigo="${curso.Codigo.trim()}" descripcion="${curso.Nombre.trim()}" descriCorta="${curso.Descripcion.trim()}" onclick="editarCurso(this);" ><span class="icon-pencil"></span></button>
                                        <button class="btn boton-tabla boton-rojo" disabled type="button" ><span class="icon-bin"></span></button>
                                    </td>
                                </tr>`;
                    tbody.append(tr);
                }
                Notiflix.Notify.Success('Cursos cargados correctamente!'); 
            } else {
                Notiflix.Notify.Failure('Ocurrio un error inesperado');
            }        
        }
    });
}

function editarCurso(btn) {
    $("#codCursoM").val( $(btn).attr("codigo") );
    $("#descripcionM").val( $(btn).attr("descripcion") );
    $("#desCortaM").val( $(btn).attr("descriCorta") );
    $("#numHoras").val( $(btn).attr("horas") );
    $("#opcion").val("update");
    $("#codCursoM").attr("disabled", true);
    $("#descripcionM").focus();
    $("#tituloModal").html("Editar Curso");
    $("#modalCurso").modal({backdrop: 'static', keyboard: false});
}

$("#btnGrabarEditarCursoInterno").click(function () {
    const codCurso = $("#codCursoM").val();
    const descripcion = $("#descripcionM").val();
    const desCorta = $("#desCortaM").val();
    const horas = $("#numHoras").val();
    const opcion = $("#opcion").val();
    $.ajax({
        url: path + "notas/cursosInternos",
        type: "POST",
        dataType : "JSON",
        data: {
            codCurso: codCurso,
            descripcion: descripcion,
            desCorta: desCorta,
            horas: horas,
            opcion: opcion
        },       
        success: function (datos) {
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

function nuevoCurso(){
    $("#codCursoM").val("M");
    $("#descripcionM").val("");
    $("#desCortaM").val("");
    $("#numHoras").val("");
    $("#codCursoM").attr("disabled", false);
    $("#opcion").val("create");
    $("#codCursoM").focus();
    $("#tituloModal").html("Nuevo Curso");
    $("#modalCurso").modal({backdrop: 'static', keyboard: false});
}

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