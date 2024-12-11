const language = {
    "processing": "Procesando...",
    "lengthMenu": "Mostrar _MENU_ registros",
    "zeroRecords": "No se encontraron resultados",
    "emptyTable": "No se encontraron registros",
    "infoEmpty": "Mostrando registros del 0 al 0 de un total de 0 registros",
    "infoFiltered": "(filtrado de un total de _MAX_ registros)",
    "search": "Buscar:",
    "infoThousands": ",",
    "loadingRecords": "Cargando...",
    "paginate": {
        "first": "Primero",
        "last": "Último",
        "next": "Siguiente",
        "previous": "Anterior"
    },
    "info": "Mostrando _START_ a _END_ de _TOTAL_ registros"
};
$(document).ready(function () {

    //cargarInstituciones(true);
    //cargarSedes();

})

$("#procesar").click(function (e) {

    $.ajax({
        url: path + "notas/jsonActasNominas",
        type: "POST",
        dataType: "JSON",
        data: {
            opcion: "procesar",
            tipo: $("#tipo").val(),
            periodo: $("#periodo").val()
        },
        beforeSend: function () {
            $("#contenidoModal").html("");
            //$('.text-loader').text('ESTE PROCESO PUEDE TOMAR UNOS MINUTOS, POR FAVOR ESPERE...');
            //$("#modalLoader").modal();
            $("#procesar").prop("disabled",true).html("PROCESANDO Y GENERANDO...")
        },
        complete: function () {            
        },
        success: function (datos) {

            console.log("dataos ", datos);

            if (datos.respuesta === "success") {
                
                datos.data.forEach((json, index) => {
                    
                    const jsontext = JSON.stringify(json);
                    
                    $("#contenidoModal").append(`<div>                    
                        <label>${$("#tipo").val()} ${index + 1}</label>                        
                        <div class="row">
                            <div class="col-lg-10 col-md-10 col-sm-12 col-xs-12 row-fila">                    
                                <input readonly type="text" maxlength="9999999" value='${jsontext.substring(0, 50)}......' class="form-control"/>
                            </div>
                            <div class="col-lg-2 col-md-2 col-sm-12 col-xs-12 row-fila text-center">
                                <span style="display:none" > ${jsontext} </span>                                                                                          
                                <button class="btn boton-tabla boton-azul" type="button" onclick="copiarContenido(this);"><span class="icon-copy"></span></button>
                                <button class="btn boton-tabla boton-rojo" index="${index+1}" type="button" onclick="descargarJson(this);"><span class="icon-download2"></span></button>
                            </div>
                        </div>                    
                    </div>`);                  
                    
                });

                $("#tipoArchivo").text($("#tipo").val().toUpperCase() + " | " + $("#periodo").val());
                $("#modalMostrarActasNominas").modal({ backdrop: 'static', keyboard: false });
                Notiflix.Notify.Success("EL ARCHIVO JSON SE GENERO CORRECTAMENTE");
                //$("#modalLoader").modal("hide");  
                $("#procesar").prop("disabled", false).html('<span class="icon-cloud-upload" style="padding-right:10px"></span>GENERAR JSON');     

            } else {

                Notiflix.Notify.Success("OCURRIO UN ERROR INESPERADO, POR FAVOR RECARGUE LA PÁGINA Y VUELVA A INTENTARLO --> " + datos.error)

            }

        }
    });

})

function descargarJson(btn){

    const jsontext = $(btn).prev().prev("span").html();    
    var data, filename, link;
    var csv = 'data:text/json;charset=utf-8,' + jsontext;
    filename = ($("#tipo").val() + "-" + $("#periodo").val() + "-" + $(btn).attr("index") + ".json") || 'export.csv';
    data = encodeURI(csv);
    link = document.createElement('a');
    link.setAttribute('href', data);
    link.setAttribute('download', filename);
    link.click();
    link.remove();
    
}

function copiarContenido(btn){

    const json = $(btn).prev("span").html(); 
    $("#inputtemporal").val(json);
    let input = $("#inputtemporal")[0];      
    $(btn).removeClass("boton-azul").addClass("boton-verde");          
    input.select();
    input.setSelectionRange(0, 99999);    
    navigator.clipboard.writeText(input.value);
    Notiflix.Notify.Success("CONTENIDO COPIADO")

}

$("#consultar").click(function (e) {

    $('#tablaConsultarActasNominas tbody').empty();
    $('#tablaConsultarActasNominas').dataTable().fnDestroy();
    $(".panel_json").css("display", "block");

    $("#tablaConsultarActasNominas").DataTable({
        ordering: false,
        responsive: true,
        dom: 'lBfrtip',
        buttons: [
            {
                "extend": 'excel',
                "text": 'Exportar Excel',
                "className": 'btn_excel_datatable',
                'filename': 'Reporte'
            }
        ],
        data: [],
        ajax: {
            url: path + "notas/jsonActasNominas",
            type: "POST",
            dataType: "JSON",
            data: {
                opcion: "consultar",
                tipo: $("#tipo").val(),
                periodo: $("#periodo").val()

            },
            beforeSend: function () {
                $("#modalLoader").modal();
                $('.text-loader').text('CARGANDO INFORMACIÓN, POR FAVOR ESPERE...');
            },
            complete: function () {
                $("#modalLoader").modal("hide");
            },
            dataSrc: function (response) {
                console.log("respones", response)
                if (response.respuesta === "success") {
                    return response.data;
                } else {
                    Notiflix.Notify.Failure('OCURRIÓ UN ERROR AL GENERAR EL LISTADO, POR FAVOR VUELVA A INTENTARLO.');
                    return [];
                }

            },
        },
        columns: [
            /**{data: null,
                render: function (data,type, row, meta) {
                    return meta.row + meta.settings._iDisplayStart + 1;
                }
            },**/
            {
                data: null,
                render: function (data) {
                    return '* ' +data.cod_alumno.trim();
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.TipoDocumento.trim();
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.NumDocumento;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.Local.trim();
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.apellidos_nombres != null ? data.apellidos_nombres.toString().trim() : '-';
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.sexo != null ? data.sexo.trim() : '-';
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.edad != null ? data.edad : '-';
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.Ciclo != null ? data.Ciclo.toString().trim() : '-';
                }
            },
            {
                data: null,
                render: function (data) {
                    if(data.C1 != null && data.CD1 != null){ if(data.C1.toString().trim() != "" && data.C1.toString().trim() != "00"){ nota = data.C1.toString().trim() }else{ nota = "0" } resp = nota + " - " + data.CD1.toString().trim() }else{ resp = "-" }
                    return resp;
                }
            },
            {
                data: null,
                render: function (data) {
                    if(data.C2 != null && data.CD2 != null){ if(data.C2.toString().trim() != "" && data.C2.toString().trim() != "00"){ nota = data.C2.toString().trim() }else{ nota = "0" } resp = nota + " - " + data.CD2.toString().trim() }else{ resp = "-" }
                    return resp;
                }
            },
            {
                data: null,
                render: function (data) {
                    if(data.C3 != null && data.CD3 != null){ if(data.C3.toString().trim() != "" && data.C3.toString().trim() != "00"){ nota = data.C3.toString().trim() }else{ nota = "0" } resp = nota + " - " + data.CD3.toString().trim() }else{ resp = "-" }
                    return resp;
                }
            },
            {
                data: null,
                render: function (data) {
                    if(data.C4 != null && data.CD4 != null){ if(data.C4.toString().trim() != "" && data.C4.toString().trim() != "00"){ nota = data.C4.toString().trim() }else{ nota = "0" } resp = nota + " - " + data.CD4.toString().trim() }else{ resp = "-" }
                    return resp;
                }
            },
            {
                data: null,
                render: function (data) {
                    if(data.C5 != null && data.CD5 != null){ if(data.C5.toString().trim() != "" && data.C5.toString().trim() != "00"){ nota = data.C5.toString().trim() }else{ nota = "0" } resp = nota + " - " + data.CD5.toString().trim() }else{ resp = "-" }
                    return resp;
                }
            },
            {
                data: null,
                render: function (data) {
                    if(data.C6 != null && data.CD6 != null){ if(data.C6.toString().trim() != "" && data.C6.toString().trim() != "00"){ nota = data.C6.toString().trim() }else{ nota = "0" } resp = nota + " - " + data.CD6.toString().trim() }else{ resp = "-" }
                    return resp;
                }
            },
            {
                data: null,
                render: function (data) {
                    if(data.C7 != null && data.CD7 != null){ if(data.C7.toString().trim() != "" && data.C7.toString().trim() != "00"){ nota = data.C7.toString().trim() }else{ nota = "0" } resp = nota + " - " + data.CD7.toString().trim() }else{ resp = "-" }
                    return resp;
                }
            },
            {
                data: null,
                render: function (data) {
                    if(data.C8 != null && data.CD8 != null){ if(data.C8.toString().trim() != "" && data.C8.toString().trim() != "00"){ nota = data.C8.toString().trim() }else{ nota = "0" } resp = nota + " - " + data.CD8.toString().trim() }else{ resp = "-" }
                    return resp;
                }
            },
            {
                data: null,
                render: function (data) {
                    if(data.C9 != null && data.CD9 != null){ if(data.C9.toString().trim() != "" && data.C9.toString().trim() != "00"){ nota = data.C9.toString().trim() }else{ nota = "0" } resp = nota + " - " + data.CD9.toString().trim() }else{ resp = "-" }
                    return resp;
                }
            },
            {
                data: null,
                render: function (data) {

                    if(data.C10 != null && data.CD10 != null){ if(data.C10.toString().trim() != "" && data.C10.toString().trim() != "00"){ nota = data.C10.toString().trim() }else{ nota = "0" } resp = nota + " - " + data.CD10.toString().trim() }else{ resp = "-" }
                    return resp;
                }
            },
            {
                data: null,
                render: function (data) {

                    if(data.C11 != null && data.CD11 != null){ if(data.C11.toString().trim() != "" && data.C11.toString().trim() != "00"){ nota = data.C11.toString().trim() }else{ nota = "0" } resp = nota + " - " + data.CD11.toString().trim() }else{ resp = "-" }
                    return resp;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.carrera_ministerio != null ? data.carrera_ministerio.toString().trim() : '-';
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.inicio_periodo != null ? data.inicio_periodo.toString().trim() : '-';
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.fin_periodo != null ? data.fin_periodo.toString().trim() : '-';
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.fecha_nomina != null ? data.fecha_nomina.toString().trim() : '-';
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.descripcion != null ? data.descripcion.toString().trim() : '-';
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.turno_des != null ? data.turno_des.toString().trim() : '-';
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.cod_seccion != null ? data.cod_seccion.toString().trim() : '-';
                }
            }
            
        ],
        language: language,
        columnDefs: [
            {
                targets: '_all',
                className: 'celda-centrada',
                orderable: false
            }
        ],
        lengthMenu: [
            [20, 50, 75, 100],
            [20, 50, 75, 100]
        ],
    });

})

/**$("#formExportar").submit(function(e){

    e.preventDefault();
    let data = $(this).serializeArray();
    data.push({name:"opcion",value:"exportar"})

    $.ajax({
        url: path + "notas/nominasMasivasV2",
        type: "POST",
        dataType: "JSON",
        data: $.param(data), 
        beforeSend: function(){
            $('.text-loader').text('ESTO PUEDE TOMAR UNOS MINUTOS, POR FAVOR ESPERE...');
            $("#modalLoader").modal();
        },
        complete: function(){
            $("#modalLoader").modal("hide");
        },    
        success: function (datos) {
                                                       
            if (datos.respuesta === "success") {

                var a = $("<a>");
                a.attr("href", datos.file);
                $("body").append(a);
                a.attr("download", "nominas-"+$("#periodo").val()+".xlsx");
                a[0].click();
                a.remove();
                Notiflix.Notify.Success("El documento se genero con éxito.")

            } else {

                Notiflix.Notify.Success("OCURRIO UN ERROR INESPERADO, POR FAVOR RECARGUE LA PÁGINA Y VUELVA A INTENTARLO --> "+datos.error)

            }

        }
    });

})**/