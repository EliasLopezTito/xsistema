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

$("#buscar").click(function(){

    const instituto = $("#instituto").val(); 
    const desde = $("#desde").val();
    const hasta = $("#hasta").val();
    listadoPagantes( instituto , desde , hasta );

})

function listadoPagantes( instituto , desde , hasta ) {

    $.ajax({
        type:'POST',
        url: path + "programacion/alumnosPagantes",
        data: {
            opcion : "listadoPagantes",
            desde : desde,
            hasta : hasta,
            local : instituto
        },
        dataType:'JSON',
        beforeSend: function(){
            $('.text-loader').text('CARGANDO INFORMACIÓN, POR FAVOR ESPERE...');
            $("#modalLoader").modal();
        },
        complete : function(){
            $("#modalLoader").modal("hide");
        },
        success: function(response){
            console.log(response);
            $("#tablaListadoPagantes tbody").html("");
            if(response.respuesta === "success"){ 

                if(response.data.length > 0){
              
                    response.data.forEach(function(value,index){
                                      
                        const plantilla = `<tr>
                            <td class="text-center" style="font-size:15px"> <b> ${value.Especialidad.toUpperCase().trim()} </b></td>                         
                            <td class="text-center" style="font-size:15px"> <b> <a href="javascript:void(0)" cod_local="${value.Cod_local}" cod_espe="${value.cod_espe}" especialidad="${value.Especialidad.toUpperCase().trim()}" onclick='verDetalleAlumnosPagantes(this)' > ${value.Cant} </a></b> </td>                              
                        </tr>`;
                        $("#tablaListadoPagantes tbody").append(plantilla);                           
                        
                    });

                }else{

                    $("#tablaListadoPagantes tbody").html("<tr><td colspan='2' class='text-center'><b>No se encontro información para mostrar.</b></td></tr>");
                    Notiflix.Notify.Warning('NO HAY INFORMACIÓN PARA CARGAR');

                }     
   
            }else{

                $("#tablaListadoPagantes tbody").html("<tr><td colspan='2' class='text-center'><b>REALICE UNA BÚSQUEDA</b></td></tr>");           
                Notiflix.Notify.Failure('OCURRIÓ UN ERROR AL GENERAR EL LISTADO!');             
            
            }

        },
        error: function(error){

            $("#tablaListadoPagantes tbody").html("<tr><td colspan='2' class='text-center'><b>REALICE UNA BÚSQUEDA</b></td></tr>");           
            Notiflix.Notify.Failure('OCURRIÓ UN ERROR AL GENERAR EL LISTADO!');
        
        }    
    });
}

function verDetalleAlumnosPagantes( btn ){

    $("#modalDetalleAlumnosPagantes").modal({backdrop: 'static', keyboard: false} , 'show');
    $("#tituloModal").text( "ESPECIALIDAD : " + $(btn).attr("especialidad") );

    $("#tablaListadoDetalle").DataTable({
        ordering : false,
        dom : 'lBfrtip',
        buttons : [
            { "extend": 'excel', 
                "text":'Exportar Excel',
                "className": 'btn_excel_datatable',
                'filename' : 'Reporte'}
        ],
        data : [] ,
        ajax : {
            url: path + "programacion/alumnosPagantes",
            type: "POST",
            dataType: "JSON",
            data: {
                opcion : "generarDetalleListado",
                desde : $("#desde").val(),
                hasta : $("#hasta").val(),
                cod_local : $(btn).attr("cod_local"),
                cod_espe : $(btn).attr("cod_espe")
                
            },
            beforeSend : function(){
                $("#modalLoader").modal();
                $('.text-loader').text('CARGANDO INFORMACIÓN, POR FAVOR ESPERE...');
            },
            complete : function(){
                $("#modalLoader").modal("hide");
            },
            dataSrc: function(response){
                console.log(response)
                if(response.respuesta === "success"){
                    return response.data;
                }else{
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
            {data: null,
                render: function (data) {
                    return data.Codigo_Alumno.trim();
                } 
            },
            {data: null,
                render: function (data) {
                    return data.Alumno.trim();
                } 
            },
            {data: null,
                render: function (data) {
                    return data.Fecha;
                } 
            },
            {data: null,
                render: function (data) {
                    return data.Transaccion.trim();
                } 
            },
            {data: null,
                render: function (data) {
                    return data.Concepto.trim();
                } 
            },
            {data: null,
                render: function (data) {
                    return data.PeriodoPago;
                } 
            },
            {data: null,
                render: function (data) {
                    return data.Observacion;
                } 
            }
        ],
        language : language,
        columnDefs: [
            {
                targets: '_all',
                className: 'celda-centrada',
                orderable: false
            }
        ],
        lengthMenu: [
            [20,50,75,100], 
            [20,50,75,100]
        ],
    });

}

$(document).on("click","#close__modal",function(){
    
    $('#tablaListadoDetalle').empty();
    $('#tablaListadoDetalle').dataTable().fnDestroy();
    $("#modalDetalleAlumnosPagantes").modal("hide");

})