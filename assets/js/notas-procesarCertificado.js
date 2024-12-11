document.addEventListener("DOMContentLoaded", () => {  
    $("#alumno").autocomplete({
        source: function(request, response){
            $.ajax({
                url: path + "Programacion/descargarBoleta",
                dataType: "json",
                type: 'post',
                data: {
                    term: request.term,
                    opcion: 'searchAlumnos'
                },
                success: function(data){
                    $("#btnGenerarCertificado").prop("disabled",true)
                    $("#alumno").attr("codigo","");
                    $("#alumno").next('i').removeClass('glyphicon-ok');
                    $("#alumno").next('i').addClass('glyphicon-remove');
                    $("#alumno").parent().removeClass('has-success');
                    $("#alumno").parent().addClass('has-error');
                    $("#tablaNotas tbody").html(""); 
                    $("#periodo").html("");
                    $("#convalidacion").val("");
                    $("#observacion").val("");
                    let result = (!data.alumnos) ? [{ vacio: true }] : data.alumnos; 
                    response(result);
                }
            });
        },
        minLength: 2,
        select: function(event, ui){
            if (ui.item.vacio) {
                event.preventDefault();
            } else{
                $("#alumno").val(ui.item.cod_alumno + " - " + ui.item.nombre);
                $("#alumno").attr('codigo', ui.item.cod_alumno);
                $("#alumno").next('i').removeClass('glyphicon-remove');
                $("#alumno").next('i').addClass('glyphicon-ok');
                $("#alumno").parent().removeClass('has-error');
                $("#alumno").parent().addClass('has-success');
                cargarParametrosAlumno(ui.item.cod_alumno);
            }
            return false;
        }
    })
    .autocomplete( "instance" )._renderItem = function( ul, item ) {

        if (item.hasOwnProperty('vacio')) {
            return $( "<li>" )
            .append( "<div>No se encontraron resultados</div>" )
            .appendTo( ul );
        }

        return $( "<li>" )
            .append( "<div>"+item.cod_alumno+" - "+item.nombre+"</div>" )
            .appendTo( ul );
    };
    $("#alumno").focus();
});

$("#periodo").change(function(){

    const parametros = $(this).val();
    vistaPreviaCursosPorCiclo(parametros);

})

$(".ciclo-rango").change(function(){

    if( $("#periodo").val() !== null ){
        vistaPreviaCursosPorCiclo($("#periodo").val());
    }

})

function vistaPreviaCursosPorCiclo(parametros){
    $.ajax({
        url: path + "notas/procesarCertificado",
        type: "POST",
        dataType : "JSON",
        data: {
            parametros: parametros,
            opcion: "seleccionarNotas",
            desde : $("#cicloDesde").val(),
            hasta : $("#cicloHasta").val()
        },
        beforeSend : function(){
            $('.text-loader').text('CARGANDO INFORMACIÓN, POR FAVOR ESPERE...');
            $("#modalLoader").modal();
        },
        complete : function(){
            $("#modalLoader").modal("hide");
        },
        success: function (res) {
            if (res.respuesta == "success") { 
                cargarNotas(res.notas);
            } else {
                $("#tablaNotas tbody").html("")
                Notiflix.Notify.Failure("OCURRIO UN ERROR INESPERADO, POR FAVOR RECARGUE LA PÁGINA Y VUELVA A INTENTARLO.");
            }
        }
    });
}

$("#btnGenerarCertificado").click(function(){
    Notiflix.Confirm.Show(
        'Confirmación',
        '¿Está seguro de generar el certificado?',
        'Si',
        'No',
        function(){
            $.ajax({
                url: path + "notas/procesarCertificado",
                type: "POST",
                dataType:"JSON",
                data: {
                    opcion : "verificarTramite",
                    codigo : $("#alumno").attr("codigo")
                } ,
                beforeSend: function () {
                    $('.text-loader').text('VERIFICANDO ALUMNO...');
                    $("#modalLoader").modal();
                },
                complete : function(){
                    $("#modalLoader").modal("hide");
                },
                success: function (response) {   
                    
                    if(response.resp){
                        $("#modalNumeroCertificado").show();
                    }else{
                        $("#modalNumeroCertificado").hide();
                        Notiflix.Report.Warning("Aviso","El alumno deber ser registrado en TRAMITES antes de ser GENERADO.", "Aceptar");
                    }
                    
                },
            })
            
        }
        ,function(){  
        }
    );
})

$("#btnGenerarCertificado_NumCert").click(function(){
    $.ajax({
        url: path + "notas/procesarCertificado",
        type: "POST",
        dataType:"JSON",
        data: {
            opcion : "generarCertificado",
            parametros : $("#periodo").val(),
            convalidacion : $("#convalidacion").val(),
            observacion : $("#observacion").val(),
            codigo : $("#alumno").attr("codigo"),
            desde : $("#cicloDesde").val(),
            hasta : $("#cicloHasta").val(),
            nro_certificado_modal : $("#nro_certificado_modal").val()
        } ,
        beforeSend: function () {
            $('.text-loader').text('GENERANDO CERTIFICADO, PORFAVOR ESPERE...');
            $("#modalLoader").modal();
        },
        complete : function(){
            $("#modalLoader").modal("hide");
        },
        success: function (response) {
            
            $("#nro_certificado_modal").val('');
            $("#modalNumeroCertificado").hide();
            if(response.respuesta === "success" ){
                $("#modalVistaPreviaCertificado").modal("show")
                $('#modalVistaPreviaCertificado .modal-body #divIframeCertificado').html("");
                let pdf  = '<iframe src="'+response.certificado+'" frameborder="0" width="100%" style="height: 65vh;"></iframe>'
                $('#modalVistaPreviaCertificado .modal-body #divIframeCertificado').html(pdf);     
            }else{  
                $('#modalVistaPreviaCertificado .modal-body #divIframeCertificado').html("");                   
                Notiflix.Report.Failure("Ooops, Ocurrio un error inesperado","Por favor recargue la página y vuelva a intentarlo.", "Aceptar");
            }    
        },
    })
})

function cargarNotas(data){
    $("#tablaNotas tbody").html("") 
    if(data.length > 0){
        $("#btnGenerarCertificado").prop("disabled",false)
        $("#btnEliminarCertificado").prop("disabled", false)
        data.forEach( ( value , key ) => {
            let tr = `<tr>
                <td class="text-center">${key+1}</td>
                <td class="text-center">${value.Curso.trim().toUpperCase()}</td>
                <td class="text-center">${value.Local.trim().toUpperCase()}</td>
                <td class="text-center">${value.Sede.trim().toUpperCase()}</td>
                <td class="text-center">${value.Turno.trim().toUpperCase()}</td>
                <td class="text-center">${value.Semestre.trim().toUpperCase()}</td>
                <td class="text-center">${value.cod_ciclo.trim().toUpperCase()}</td>
                <td class="text-center">${value.cod_seccion.trim().toUpperCase()}</td>
                <td class="text-center">${Math.trunc(value.pf)}</td>
                <td class="text-center">${value.pr}</td>
                <td class="text-center" style="color:red">${value.Aplazado.trim().toUpperCase()}</td>
            </tr>`;
            $("#tablaNotas tbody").append(tr) 
        });
    }else{
        $("#btnGenerarCertificado").prop("disabled",true)
        $("#btnEliminarCertificado").prop("disabled", true)
        $("#tablaNotas tbody").html("<tr><td colspan='11' class='text-center'> <b>No se encontro información para cargar</b> </td></tr>") 
    }

}

$("#cerraModal").click(function(){
    $("#modalVistaPreviaCertificado").modal("hide");
    $("body").css({"padding-right" : 0 })
})

$("#cerraModalCrt").click(function(){
    console.log("rata");
    $("#nro_certificado_modal").val('');
    $("#modalNumeroCertificado").hide();
    $("body").css({"padding-right" : 0 })
})

function cargarParametrosAlumno(codigo){
    $.ajax({
        url: path + "notas/procesarCertificado",
        type: "POST",
        dataType : "JSON",
        data: {
            codAlumno: codigo,
            opcion: "seleccionarAlumno"
        },
        beforeSend : function(){
            $('.text-loader').text('CARGANDO PARÁMETROS, POR FAVOR ESPERE...');
            $("#modalLoader").modal();
        },
        complete : function(){
            $("#modalLoader").modal("hide");
        },
        success: function (res) {
            if (res.respuesta == "success") { 
                $("#periodo").html("<option disabled selected >SELECCIONE</option>");
                res.data.forEach( ( value , key ) => {
                    $("#periodo").append(`<option value="${value.tipo_espe.trim()}-${value.cod_espe.trim()}-${value.cod_local.trim()}-${codigo}" > ${value.cod_local.trim()} --- ${value.tipo_espe_des} --- ${value.especialidad_des.trim()} </option>`)               
                });
            } else {  
                $("#periodo").html("");
            }
        }
    });

}