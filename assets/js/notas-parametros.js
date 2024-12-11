$("#formRegistrarSemestresActivosEdicion").submit(function(e){
    e.preventDefault();

    let req = $(this).serializeArray();
    req.push({ name: "opcion", value:"registrarSemestresActivosEdicion"});

    $.ajax({
        url: path + "notas/parametros",
        type: "POST",
        dataType: "JSON",
        data: $.param(req),
        beforeSend: function () {   
            $("#btnGrabarSemestresActivosEdicion").prop("disabled",true);         
        },
        complete: function () {           
            $("#btnGrabarSemestresActivosEdicion").prop("disabled", false);
        },
        success: function (response) {
            Notiflix.Notify.Success("OPERACIÓN ÉXITOSA")          
        }
    });


})

$("#formRegistrarSemestresActivosEdicion2").submit(function (e) {
    e.preventDefault();

    let req = $(this).serializeArray();
    req.push({ name: "opcion", value: "registrarSemestresActivosEdicion2" });

    $.ajax({
        url: path + "notas/parametros",
        type: "POST",
        dataType: "JSON",
        data: $.param(req),
        beforeSend: function () {
            $("#btnGrabarSemestresActivosEdicion2").prop("disabled", true);
        },
        complete: function () {
            $("#btnGrabarSemestresActivosEdicion2").prop("disabled", false);
        },
        success: function (response) {
            Notiflix.Notify.Success("OPERACIÓN ÉXITOSA")
        }
    });


})

$('.activo').on('click', function () {

    if ($(this).is(':checked')) {
        $(this).next("input").val("1");
    } else {
        $(this).next("input").val("0");
    }

});
