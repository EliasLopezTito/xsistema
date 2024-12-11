$(document).ready(function(){
    //console.log("winner")
})

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

const meses = ["ENERO","FEBRERO","MARZO","ABRIL","MAYO","JUNIO","JULIO","AGOSTO","SEPTIEMBRE","OCTUBRE","NOVIEMBRE","DICIEMBRE"];

$(document).ready(function(){
    
    cargarListadoCV();
    console.log("se ejec")

})

function cargarListadoCV(){ 
    
    listadoCV = $("#tablaListadoCV").DataTable({
        ordering: true,
        dom: 'lBfrtip',
        buttons: [
            { "extend": 'excel', "text": 'Exportar Excel', "className": 'btn_excel_datatable' }
        ],
        ajax: {
            url: path + "planilla/listadoCvDocente",
            type: "POST",
            data: {
                opcion: "listadoCV"      
            },
            beforeSend: function () {
                $('.text-loader').text('CARGANDO INFORMACIÓN, POR FAVOR ESPERE...');
                $("#modalLoader").modal();
            },
            dataSrc: function (dat) {
                if (dat.respuesta === "success") {
                    return dat.data;
                    
                } else {
                    return [];
                }

            },
            complete: function () {
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
        lengthMenu: [[10, 20, 50, 100, - 1], [10, 20, 50, 100, "Todos"]],
        iDisplayLength: 20,
         columns: [  
            {
                data: null,
                render: function (data,type, row, meta) {                 
                    return meta.row + 1 ;
               
                }
            },          
            {
                data: null,
                render: function (data) {
                    return data.cod_empleado;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.Empleado;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.dni;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.Cargo;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.RazonSocial;
                }
            },
            {
                data: null,
                render: function (data) {
                    const data_ = JSON.stringify(data);
                    return `
                        <a class='btn boton-tabla boton-rojo' download id_codDocente='${data.cod_empleado}' tipo="general" type='button' onclick='descargarDocenteCV(this)'><span class='icon-download2'></span></a>
                    `;
                }
            }
        ],
        language: language
    });

}


function descargarDocenteCV(id){

    const codigo = $(id).attr("id_codDocente");
    const ruta =  path.replace("siga", "intranet")
    window.open(ruta+'assets/cv/'+codigo+'.pdf', '_blank')
}