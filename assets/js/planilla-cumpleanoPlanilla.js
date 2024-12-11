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
}

const meses = ["ENERO","FEBRERO","MARZO","ABRIL","MAYO","JUNIO","JULIO","AGOSTO","SEPTIEMBRE","OCTUBRE","NOVIEMBRE","DICIEMBRE"];

$(document).ready(function(){

    $("#tablaPersonalCumpleanos").DataTable({ data : [] , language : language });

})

$("#btncargarcumples").click(function(){

    $('#tablaPersonalCumpleanos').empty();
    $('#tablaPersonalCumpleanos').dataTable().fnDestroy();
    $("#tablaPersonalCumpleanos").DataTable({
        ordering:  false,
        dom: 'lBfrtip',
        buttons: [
            { "extend": 'excel', "text":'Exportar Excel',"className": 'btn_excel_datatable'}
        ],
        ajax : {
            url: path + "planilla/cumpleanoPlanilla",
            type: "POST",
            dataType: "JSON",
            data: {   
                opcion : "cargarCumpleanos",
                empleador : $("#empleador").val().trim(),
                planilla : $("#planilla").val().trim(),
                mes : $("#mes").val()
            },
            beforeSend : function(){
                $('.text-loader').text('CARGANDO INFORMACIÓN, POR FAVOR ESPERE...');
                $("#modalLoader").modal();
            },
            dataSrc: function(dat){

                if(dat.respuesta === "success"){
                    return dat.data;
                }else{  
                    return [];
                }
  
            },
            complete: function(){
                $("#modalLoader").modal("hide");
                Notiflix.Notify.Success("INFORMACIÓN CARGADA CON ÉXITO."); 
            }
        },       
        columnDefs: [
            {
                targets: '_all',
                className: 'celda-centrada',
                orderable: false
            }
        ],
        lengthMenu: [
            [25], 
            [25]
        ],
        columns: [
            {data: null,
                render: function (data,type, row, meta) {
                    return meta.row + meta.settings._iDisplayStart + 1;
                }
            },
            {data: null,
                render: function (data) {
                    return data.Personal;
                } 
            },
            {data: null,
                render: function (data) {
                    return data.DNI;
                } 
            },     
            {data: null,
                render: function(data){
                    return data.Cargo;
                }
            },
            {
                data: null,
                render: function (data) {
                    return meses[data.Mes - 1];
                }
            },
            {data: null,
                render: function (data) {
                    return data.Area.trim();
                } 
            },
            {data: null,
                render: function (data) {
                    return data.FNacimiento;
                } 
            },
            {data: null,
                render: function (data) {
                    return data.FIngreso;
                } 
            },
            {data: null,
                render: function (data) {
                    return data.TiempoLab;
                } 
            }
        ],
        language : language
    });

})