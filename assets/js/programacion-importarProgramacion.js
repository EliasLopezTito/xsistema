$(document).ready(function () {
    
    $("#cbxCodigo").attr("disabled", true);
    $("#codigo").css("display", "none");
    cargarInstituciones(true);

    $("#institucion").change(function () {
        cargarTipoEspecialidades(true);
    });

    $("#tipoEspecialidad").change(function () {
        cargarEspecialidades(true);
    });

    $("#sede, #turno").change(function () {
        $("#cbxCodigo").prop("checked", false);
        $("#codigo").val("");
        $("#codigo").css("display", "none");
        if ($("#sede").val() !== "00" && $("#turno").val() !== "0" && $("#sede").val() !== "" && $("#turno").val() !== "") {
            $("#cbxCodigo").attr("disabled", false);
        } else {
            $("#cbxCodigo").attr("disabled", true);
        }
    });

    $("#cbxCodigo").change(function () {
        $("#codigo").val("");
        if ($("#cbxCodigo").prop("checked") === true) {
            $("#codigo").css("display", "block");
            $("#cbxCodigo").attr("disabled", false);
        } else {
            $("#codigo").css("display", "none");
            $("#cbxCodigo").attr("disabled", true);
        }
    });
    //bloquearMasivos();
});

$("#btnImportar").click(function () {
    var institucion = $("#institucion").val();
    var tipoEspecialidad = $("#tipoEspecialidad").val();
    var especialidad = $("#especialidad").val();
    var anioProg = $("#anioProg").val();
    var mesProg = $("#mesProg").val();
    var sede = $("#sede").val();
    var turno = $("#turno").val();
    var cbxCodigo = $("#cbxCodigo").prop("checked");
    var codigo = $("#codigo").val();

    $.ajax({
        url: path + "programacion/importarProgramacion",
        type: "POST",
        data: {
            institucion: institucion,
            tipoEspecialidad: tipoEspecialidad,
            especialidad: especialidad,
            anioProg: anioProg,
            mesProg: mesProg,
            sede: sede,
            turno: turno,
            cbxCodigo: cbxCodigo,
            codigo: codigo
        },
        beforeSend: function () {
            $("#loader").css({"display": "block"});
            desactivarFiltro(true);
        },
        success: function (data) {
            console.log(data);
            var datos = JSON.parse(data);
            $("#loader").css({"display": "none"});
            desactivarFiltro(false);
            
            if (datos.respuesta === "success") {
                mostrarMensaje("exito", "EXITO", "La importacion finalizo correctamente");
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

function desactivarFiltro(opcion) {
    $("#institucion").attr("disabled", opcion);
    $("#tipoEspecialidad").attr("disabled", opcion);
    $("#especialidad").attr("disabled", opcion);
    $("#anioProg").attr("disabled", opcion);
    $("#mesProg").attr("disabled", opcion);
    $("#sede").attr("disabled", opcion);
    $("#turno").attr("disabled", opcion);
    $("#cbxCodigo").attr("disabled", opcion);
    $("#codigo").attr("disabled", opcion);
    if(opcion === false){
        if ($("#sede").val() === "00" || $("#turno").val() === "0" || $("#sede").val() === "" || $("#turno").val() === "") {
            $("#cbxCodigo").attr("disabled", true);
            $("#codigo").attr("disabled", true);
        }
    } 
    $("#btnImportar").attr("disabled", opcion);
}