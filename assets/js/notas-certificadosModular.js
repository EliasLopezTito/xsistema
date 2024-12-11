const rgb = [ 
    "rgba(54, 162, 235, 0.3)",
    "rgba(75, 192, 192, 0.3)",
    "rgba(255, 205, 86, 0.3)",
    "rgba(255, 99, 132, 0.3)",
    "rgba(201, 203, 207, 0.3)",
    "rgba(83, 211, 87, 0.3)",
    "rgba(237, 208, 98, 0.3)"  
]

$(document).ready(function(){   
    
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

                    $("#alumno").attr("codigo","");
                    $("#alumno").next('i').removeClass('glyphicon-ok');
                    $("#alumno").next('i').addClass('glyphicon-remove');
                    $("#alumno").parent().removeClass('has-success');
                    $("#alumno").parent().addClass('has-error');
                    
                    $("#btnActivarEdicion").prop("disabled",true);
                    $("#btnGuardarEdicion").prop("disabled",true);
                    $("#btnCancelarEdicion").prop("disabled",true);
                    $("#btnDescargarCertificado").prop("disabled",true);
                    $("#periodo").html("");
                    $("#tablaInformacioCertificado tbody").html("");
                    $(".promfinal").prop("disabled",true)
                    $(".promrec").prop("disabled",true)
                    
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

function cargarParametrosAlumno(codigo){
    $.ajax({
        url: path + "notas/certificadosModular",
        type: "POST",
        dataType : "JSON",
        data: {
            codAlumno: codigo,
            opcion: "seleccionarAlumno"
        },
        beforeSend : function(){
            $('.text-loader').text('CARGANDO PERIODOS, POR FAVOR ESPERE...');
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

$("#periodo").change(function () {
    const parametros = $(this).val();
    cargarInformacionCertificado(parametros);
})

function cargarInformacionCertificado(periodo) {
    $("#tablaInformacioCertificado tbody").html("")
    $.ajax({
        url: path + "notas/certificadosModular",
        type: "POST",
        dataType: "JSON",
        data: {
            parametros: periodo,
            opcion: "cargarInformacionCertificado"
        },
        beforeSend: function () {
            $('.text-loader').text('CARGANDO CERTIFICADO, POR FAVOR ESPERE...');
            $("#modalLoader").modal();
        },
        complete: function () {
            $("#modalLoader").modal("hide");
        },
        success: function (res) {

            if (res.respuesta == "success") {
                if (res.data.length > 0) {

                    res.data.forEach((value, key) => {

                        value.reverse().forEach((value2, key2) => {

                            let rowspan = "";
                            let rowspan2 = "";
                            if (key2 === 0) {
                                rowspan = `<td style="font-weight:700;background:${colorRGB()}" rowspan="${value.length}" class="text-center">${value2.idcertPK}</td>`;
                                rowspan2 = `<td style="font-weight:700" rowspan="${value.length}" class="text-center"> 
                                                <button class="btn boton-verde btn-desc-x-grupo" idcert="${value2.idcertPK}" type="button"> 
                                                    <span class="icon-download"></span>
                                                </button>
                                                <button class="btn boton-rojo" onclick="eliminarCertificado(this,${value2.idcertPK.trim()})" type="button"> 
                                                    <span class="icon-bin"></span>
                                                </button>
                                            </td>`;
                            }

                            let tr = `<tr>
                                ${rowspan}
                                <td class="text-center" style="color:#000000"><b>${value2.Semestre.trim().toUpperCase()}</b></td> 
                                <td class="text-center">${value2.Curso.trim().toUpperCase()}</td>
                                <td class="text-center">${value2.Local.trim().toUpperCase()}</td>
                                <td class="text-center">${value2.Sede.trim().toUpperCase()}</td>
                                <td class="text-center">${value2.Turno.trim().toUpperCase()}</td>
                                <td class="text-center">${value2.cod_ciclo.trim().toUpperCase()}</td>
                                <td class="text-center">${value2.cod_seccion.trim().toUpperCase()}</td>
                                <td class="text-center">
                                    <input type="hidden" value="${value2.idcert}-${value2.pf.trim().toUpperCase()}" name="pf[]" />   
                                    <input type="text" maxlength="2" id="${value2.idcert}" style="margin:auto;text-align: center; padding-left: 0px; padding-right: 0px; color: rgb(0, 0, 255);width: 40px" class="form-control promfinal" value="${value2.pf.trim().toUpperCase()}" disabled /> 
                                </td>
                                <td class="text-center"> 
                                    <input type="hidden" value="${value2.idcert}-${value2.pr.trim().toUpperCase()}" name="pr[]" />
                                    <input type="text" maxlength="2" id="${value2.idcert}" style="text-align: center; padding-left: 0px; padding-right: 0px; color: rgb(0, 0, 255);width: 40px;margin: auto;" class="form-control promrec" value="${value2.pr.trim().toUpperCase()}" disabled /> 
                                </td>
                                <td class="text-center" style="color:red">${value2.Aplazado.trim().toUpperCase()}</td>
                                ${rowspan2}              
                            </tr>`;

                            $("#tablaInformacioCertificado tbody").append(tr)

                        })

                    });

                    $("#btnActivarEdicion").prop("disabled", false);
                    $("#btnDescargarCertificado").prop("disabled", false);
                    $("#btnGuardarEdicion").prop("disabled", true);
                    $("#btnCancelarEdicion").prop("disabled", true);

                } else {
                    $("#tablaInformacioCertificado tbody").html("<tr><td colspan='11' class='text-center' ><b>NO SE ENCONTRO INFORMACIÓN PARA CARGAR</b></td></tr>")
                    $("#btnActivarEdicion").prop("disabled", true);
                    $("#btnDescargarCertificado").prop("disabled", true);
                    $("#btnGuardarEdicion").prop("disabled", true);
                    $("#btnCancelarEdicion").prop("disabled", true)
                }
            } else {
                $("#tablaInformacioCertificado tbody").html("")
                Notiflix.Notify.Failure("OCURRIO UN ERROR INESPERADO, POR FAVOR RECARGUE LA PÁGINA Y VUELVA A INTENTARLO.");
                $("#btnActivarEdicion").prop("disabled", true);
                $("#btnDescargarCertificado").prop("disabled", true);
                $("#btnGuardarEdicion").prop("disabled", true);
                $("#btnCancelarEdicion").prop("disabled", true)
            }
        }
    });
}

function eliminarCertificado( event , id ){

    Notiflix.Confirm.Show(
        'Confirmación',
        '¿Está seguro de eliminar el certificado seleccionado?',
        'Si',
        'No',
        function () {
            $.ajax({
                url: path + "notas/certificadosModular",
                type: "POST",
                dataType: "JSON",
                data: {
                    opcion: "eliminarCertificado",
                    id: id
                },
                beforeSend: function(){
                },
                complete: function(){
                    cargarInformacionCertificado($("#periodo").val().trim());
                },
                success: function (data) {
                    
                    if (data.respuesta == "success") {
                        
                        Notiflix.Notify.Success("EL CERTIFICADO SE ELIMINO CON ÉXITO.", { timeout: 5000 });

                    } else {
                        
                        Notiflix.Notify.Failure("OCURRIO UN ERROR INESPERADO, POR FAVOR RECARGUE LA PÁGINA Y VUELVA A INTENTARLO", { timeout: 5000 });

                    }

                }
            });

        }
        , function () {
        });

}

function generarNumero(numero){
	return (Math.random()*numero).toFixed(0);
}

function colorRGB(){
	let color = "("+generarNumero(255)+"," + generarNumero(255) + "," + generarNumero(255) +" , 0.3 )";
	return "rgb" + color;
}

$(document).on("click",".btn-desc-x-grupo",function(){
    
    const idcert = $(this).attr("idcert");
    $.ajax({
        url: path + "notas/certificadosModular",
        type: "POST",
        dataType:"JSON",
        data: {
            opcion : "descargarCertificado",
            parametros : $("#periodo").val(),
            idcertPK : idcert        
        } ,
        beforeSend: function () {
            $('.text-loader').text('GENERANDO CERTIFICADO, PORFAVOR ESPERE...');
            $("#modalLoader").modal();
        },
        complete : function(){
            $("#modalLoader").modal("hide");
        },
        success: function (response) {
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

//faltan modificar

$(document).on("blur",".promfinal",function(){
    
    const value = $(this).val().trim();
    const id = $(this).prop("id");

    if (isNaN(value) || value == "" || parseInt(value) > 20 || parseInt(value) < 0){
        $(this).val("");
        $(this).prev("input").val(id+"-")
    }else{
        $(this).prev("input").val(id+"-"+value)
    }
})

$(document).on("blur",".promrec",function(){

    const value = $(this).val();
    const id = $(this).prop("id");
    if (isNaN(value) || value == "" || parseInt(value) > 20 || parseInt(value) < 0){
        $(this).val("");
        $(this).prev("input").val(id+"-")
    }else{
        $(this).prev("input").val(id+"-"+value)
    }

})

$("#btnActivarEdicion").click(function(){
    $(this).prop("disabled",true);
    $(".promfinal").prop("disabled",false)
    $(".promrec").prop("disabled",false)
    $("#btnGuardarEdicion").prop("disabled",false);
    $("#btnCancelarEdicion").prop("disabled",false);
    $("#btnDescargarCertificado").prop("disabled",true);
})

$("#btnCancelarEdicion").click(function(){

    Notiflix.Confirm.Show(
        'Confirmación',
        `¿Está seguro de cancelar la edición de los promedios?`,
        'Si',
        'No',
        function(){
            cargarInformacionCertificado($("#periodo").val());
        },
        function(){
            
        }
    );

})

$("#formEditarPromedios").submit(function(e){

    e.preventDefault();
    let data = $(this).serializeArray();
    data.push({name: "opcion", value: "actualizarPromediosCertificado"})
    
    Notiflix.Confirm.Show(
        'Confirmación',
        `¿Está seguro de actualizar los promedios?`,
        'Si',
        'No',
        function(){
            
            $.ajax({
                url: path + "notas/certificados",
                type: "POST",
                dataType : "JSON",
                data: $.param(data),
                beforeSend : function(){
                    $('.text-loader').text('CARGANDO CERTIFICADO, POR FAVOR ESPERE...');
                    $("#modalLoader").modal();
                },
                complete : function(){
                    $("#modalLoader").modal("hide");
                },
                success: function (res) {
                    if (res.respuesta == "success") { 
                        
                        cargarInformacionCertificado($("#periodo").val());
                        Notiflix.Notify.Success("Los promedios se actualizaron exitosamente.");

                    } else {
                        
                        Notiflix.Notify.Failure("OCURRIO UN ERROR INESPERADO, POR FAVOR RECARGUE LA PÁGINA Y VUELVA A INTENTARLO.");

                    }
                }
            });

        },
        function(){
            e.target.selectedIndex = 0;
        }
    );

})

/**$("#btnDescargarCertificado").click(function(){

    $.ajax({
        url: path + "notas/certificados",
        type: "POST",
        dataType:"JSON",
        data: {
            opcion : "descargarCertificado",
            parametros : $("#periodo").val()         
        } ,
        beforeSend: function () {
            $('.text-loader').text('GENERANDO CERTIFICADO, PORFAVOR ESPERE...');
            $("#modalLoader").modal();
        },
        complete : function(){
            $("#modalLoader").modal("hide");
        },
        success: function (response) {

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

})**/

$("#cerraModal").click(function(){
    $("#modalVistaPreviaCertificado").modal("hide");
    $("body").css({"padding-right" : 0 })
})