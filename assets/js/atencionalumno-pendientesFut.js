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
    
    $("#tablaBusqueda").DataTable({
        data: {},
        language: language
    })
    cargarTabla();

});

$("#btnConsultar").click(function(){

    cargarTabla();

})

function cargarTabla(){

    const estado = $("#estado").val();
    const area = $("#area").val();

    $('#tablaBusqueda tbody').empty();
    $('#tablaBusqueda').dataTable().fnDestroy();
    $("#tablaBusqueda").DataTable({
        language: language,
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
        lengthMenu: [[10, 20, 50, 100, - 1], [10, 20, 50, 100, "Todos"]],
        iDisplayLength: 20,
        ajax: {
            url: path + "atencionAlumno/pendientesFut",
            dataType: "JSON",
            method: "POST",
            data: {
                opcion: "select",
                estado: estado,
                area: area
            },
            beforeSend: function () {
                $('.text-loader').text('CARGANDO INFORMACIÓN, POR FAVOR ESPERE...');
                $("#modalLoader").modal();
                $("body").css({ "padding": 0 });
            },
            dataSrc: function (r) {
                if (r.respuesta === "success") {
                    return r.res;
                } else {
                    return {};
                }
            },
            complete: function () {
                $("#modalLoader").modal("hide");
                $("body").css({ "padding": 0 });
            }
        },
        columns: [
            {
                data: null,
                render: function (data) {
                    return data.Op
                },
                className: "text-center"
            },
            {
                data: null,
                render: function (data) {
                    if (data.Estado.trim() === "PENDIENTE") {
                        color = "red";
                    } else if (data.Estado.trim() === "EN PROCESO") {
                        color = "orange";
                    } else {
                        color = "#00bd00";
                    }
                    return "<b><span style='color:"+color+"'>" + data.Estado + " </span><b>";
                },
                className: "text-center"
            },
            {
                data: null,
                render: function (data) {      
                    if (data.Estado.trim() === "PENDIENTE") {
                        color = "red";
                    } else {
                        color = "black";
                    }            
                    return "<b><span style='color:" + color + "'>" + data.Dias + " </span><b>";
                },
                className: "text-center"
            },
            {
                data: null,
                render: function (data) {                    
                    return data.CodAlumno;
                },
                className: "text-center"
            },
            {
                data: null,
                render: function (data) {
                    return data.Alumno.trim();                    
                },
                className: "text-center"
            },
            {
                data: null,
                render: function (data) {
                    return "<b>" + data.Area.trim() + "</b>";                    
                },
                className: "text-center"
            },
            {
                data: null,
                render: function (data) {
                    return data.Tramite.trim();
                    //return data.CodAlumno;
                },
                className: "text-center"
            },
            {
                data: null,
                render: function (data) {
                    return data.Solicitud.trim();                                     
                },
                className: "text-center"
            },
            {
                data: null,
                render: function (data) {
                    return data.especialidad.trim();                       
                },
                className: "text-center"
            },
            {
                data: null,
                render: function (data) {
                    return data.telefonoo;
                },
                className: "text-center"
            },
            {
                data: null,
                render: function (data) {
                    return data.Fechareg.substring(0, 10);
                },
                className: "text-center"
            }           
        ],
        createdRow: function (row, data, dataIndex) {
            $(row).attr("data", JSON.stringify(data)).addClass("trSelect");
        },

    });

}

$(document).on("dblclick","#tablaBusqueda tbody tr" , function(){
    
    $(".trSelect").removeClass("success");
    $(this).addClass("success");
    const data = JSON.parse($(this).attr("data"));   
    $("#op").html(data.Op.trim())
    $("#solicitud").html(data.Solicitud.trim().toUpperCase())
    $("#respuesta").html(data.Respuesta.trim().toUpperCase())
    $("#estado_").html(data.Estado.trim().toUpperCase())
    $("#modalDetalles").modal({backdrop:'static',keyboard:false})
    
})

$(document).on("click", ".paginate_button", function () {
    $(".trSelect").removeClass("success");        
})