tablaArticulo=""
$("#btnBuscar").click(function () {
    mostrarData();
});

function mostrarData()
{
    var codGrupo = $("#codGrupo").val();
    var descripcion = $("#descripcion").val();

    tablaArticulo = $("#listaArt").DataTable({
        destroy: 'true',
        searching: true,
        processing: false,
        responsive: true,
        ordering:  false,
        dom: 'Bfrtip',
        buttons: [
            { "extend": 'excel', "text":'Exportar Excel',"className": 'btn_excel_datatable'}
        ],
        lengthMenu: [
            [50, 100, -1], 
            [50, 100, 'TODO']
        ],
        ajax: {
            url: path + "administracion/articulos",
            type: "POST",
            data: {
                codGrupo: codGrupo,
                descripcion: descripcion,
                opcion: 'buscarArticulo'
            },
            dataSrc: function(data){      
                if(data.respuesta == "success" && data.listaAulas !== "vacio"){
                    return data.articulos; 
                }else{
                    return {};
                }        
                               
            }
        },
        columnDefs: [
            {
                targets: '_all',
                className: 'celda-centrada'
            }
        ],
        columns: [
            {
                data: null,
                render: function (data, type, row, meta) {
                    return data.CodArt;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.Codigo
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.Grupo.trim()
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.DescripCorta.trim()
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.Descripcion.trim()
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.Estado.trim()
                }
            },
            {
                data: null,
                render: function (data) {

                    return "<button class=\"btn boton-tabla boton-naranja\" type=\"button\" onclick=\"editarArticulo("+data.CodArt+");\" title=\"Editar Articulo\"><span class=\"icon-pencil\"></span></button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"+
                    "<button class=\"btn boton-tabla boton-rojo\" type=\"button\" onclick=\"eliminarArticulo("+data.CodArt+");\" title=\"Eliminar Articulo\"><span class=\"icon-bin\"></span></button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
                }
            },
        ],
        language: {
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
    });
}

$("#btnVerModalNuevo").click(function () {
    $("#modalArticulos").modal('show');
    limpiarFormulario(true)
    $("#btn_modal").addClass("btn-info").removeClass("btn-warning")
    $("#btn_modal").html("Registrar");
    $("#tituloModal").html("REGISTRAR ARTICULO");
});

$("#form-articulo").submit(function (e){
    e.preventDefault();

    var codigoVer = $("#codigo").val().trim();
    var descripcionVer = $("#descripcionArt").val().trim();
    var pesoVer = $("#peso").val().trim();
    var alturaVer = $("#altura").val().trim();

    if (codigoVer === "" || descripcionVer === "" || pesoVer === "" || alturaVer === "") {
        Notiflix.Report.Failure('ERROR', 'codigo, descripción, peso y altura son campos requeridos', "Cerrar");
        return;
    }

    var codArt = $("#codArt").val()
    var codigo = $("#codigo").val()
    var codGrupo = $("#grupo").val()
    var descripcion = $("#descripcionArt").val()
    var peso = $("#peso").val()
    var altura = $("#altura").val()
    var codUM = $("#um").val()
    var estado = $("#estado").is(":checked") ? 1 : 0;
    $.ajax({
        url: path + "administracion/articulos",
        type: "POST",
        dataType: "JSON",
        data: {
            opcion: 'registrarArticulo',
            codArt:codArt,
            codigo:codigo,
            codGrupo:codGrupo,
            descripcion:descripcion,
            peso:peso,
            altura:altura,
            codUM:codUM,
            estado:estado
        },
        success: function (response) {                    

            if(response.respuesta === "success"){
                $("#modalArticulos").modal('hide');
                tablaArticulo.ajax.reload(null,false)

            }

        }
    })
})

function editarArticulo(codArt){
    limpiarFormulario(false)
    $.ajax({
        url: path + "administracion/articulos",
        type: "POST",
        dataType: "JSON",
        data: {
            opcion: 'obtenerDatos',
            codArt:codArt
        },
        success: function (response) {                    
            console.log(response)
            if(response.respuesta == "success"){
                const info = response.info[0]
                $("#altura").val(info.Altura ? info.Altura : "0");
                $("#peso").val(info.Peso ? info.Peso : "0");
                $("#codArt").val(info.CodArt)
                $("#grupo").val(info.CodGrupo)
                $("#codigo").val(info.Codigo)
                $("#descripcionArt").val(info.Descripcion)
                $("#estado").prop("checked", info.Estado == 1 ? true : false);
                var verificar = $("#estado").prop("checked", info.Estado == 1 ? true : false);
                console.log(verificar)
                $("#um").val(info.codUM)
            }
            $("#btn_modal").addClass("btn-warning").removeClass("btn-info")
            $("#btn_modal").html("Editar");
        }
    })
    
    $("#tituloModal").html("EDITAR ARTICULO");
    $("#modalArticulos").modal({ backdrop: 'static', keyboard: false });
}

function limpiarFormulario(valor) {
    $('#form-articulo').find('input[type=text], input[type=number]').val('');
    if(valor === true){
        $('#form-articulo').find('input[type=hidden]').val('0');
        $('#form-articulo').find('#grupo').val('1');
        $('#form-articulo').find('#UM').val('1');
        $('#form-articulo').find('#peso').val('0');
        $('#form-articulo').find('#altura').val('0');
        $("#estado").prop("disabled", true);
        $("#codigo").prop("disabled", true);
        $.ajax({
            url: path + "administracion/articulos",
            type: "POST",
            dataType: "JSON",
            data: {
                opcion: "codigoNew"
            },
            beforeSend: function(){
            },
            success: function (data) {
                
                if (data.respuesta == "success") {
                    result = data.result[0]
                    $('#form-articulo').find('#codigo').val(result.Codigo);
                } 

            }
        });
    }else{
        $('#form-articulo').find('input[type=hidden]').val("");
        $("#estado").prop("disabled", false);
        $("#codigo").prop("disabled", false);
    }
}

function eliminarArticulo( codArt ){

    Notiflix.Confirm.Show(
        'Confirmación',
        '¿Está seguro de eliminar el articulo seleccionado?',
        'Si',
        'No',
        function () {
            $.ajax({
                url: path + "administracion/articulos",
                type: "POST",
                dataType: "JSON",
                data: {
                    opcion: "eliminarArticulo",
                    codArt: codArt
                },
                beforeSend: function(){
                },
                success: function (data) {
                    
                    if (data.respuesta == "success") {
                        
                        Notiflix.Notify.Success("EL ARTICULO SE ELIMINO CON ÉXITO.", { timeout: 5000 });
                        tablaArticulo.ajax.reload(null,false)

                    } else {
                        
                        Notiflix.Notify.Failure("OCURRIO UN ERROR INESPERADO, POR FAVOR RECARGUE LA PÁGINA Y VUELVA A INTENTARLO", { timeout: 5000 });

                    }

                }
            });

        }
        , function () {
        });

}