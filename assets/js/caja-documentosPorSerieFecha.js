$("#btnPDF").click(function () {

    $.ajax({
        url: path + "caja/documentosPorSerieFecha",
        dataType: "JSON",
        method: "POST",
        data: {
            opcion: 'pdf',
            fecha: $("#fecha").val()
        },
        beforeSend: function () {
            $('.text-loader').text('GENERANDO ARCHIVO PDF...');
            $("#modalLoader").modal({ backdrop: 'static', keyboard: false });
            $("body").css({ "padding": 0 });
        },
        success: function (response) {

            if (response.respuesta === "success") {
                
                let pdf = '<iframe src="' + response.file + '" frameborder="0" width="100%" style="height: 65vh;"></iframe>'
                $('#modalVistaPreviaPdf .modal-body #divIframePdf').html(pdf);
                $("#modalVistaPreviaPdf").modal({ backdrop: 'static', keyboard: false })

            } else {

                Notiflix.Notify.Failure("OCURRIO UN ERROR AL GENERAR EL ARCHIVO");

            }

        },
        complete: function (data) {                
            $("#modalLoader").modal("hide");
            $("body").css({ "padding": 0 });
        }
    });

})

$("#cerraModal").click(function () {
    $('#modalVistaPreviaPdf .modal-body #divIframePdf').html("");
    $("#modalVistaPreviaPdf").modal("hide");
    $("body").css({ "padding": 0 });
})