$(document).ready(function(){
    
    $("#btnExcel").click(function (){
        var empresa = $("#empresa").val();
        var tipoPlanilla = $("#tipoPlanilla").val();
        var tipoProceso = $("#tipoProceso").val();
        var banco = $("#banco").val();
        var fechaInicio = $("#fechaInicio").val();
        var fechaFinal = $("#fechaFinal").val();
        var anio = $("#anio").val();
        var mes = $("#mes").val();
        
        var texto = empresa + " - " + tipoPlanilla + " - " + tipoProceso + " - " + banco + " - " + fechaInicio + " - " + fechaFinal + " - " + anio + " - " + mes;
        
        if(empresa == ""){
            mostrarMensaje("error","ERROR","Debe seleccionar la Empresa");
            return false;
        }
        if(tipoPlanilla == ""){
            mostrarMensaje("error","ERROR","Debe seleccionar el Tipo de Planilla");
            return false;
        }
        if(tipoProceso == ""){
            mostrarMensaje("error","ERROR","Debe seleccionar el Tipo de Proceso");
            return false;
        }
        if(banco == ""){
            mostrarMensaje("error","ERROR","Debe seleccionar el Banco");
            return false;
        }
        if(fechaInicio == ""){
            mostrarMensaje("error","ERROR","Debe seleccionar la Fecha de Inicio");
            return false;
        }
        if(fechaFinal == ""){
            mostrarMensaje("error","ERROR","Debe seleccionar la Fecha Final");
            return false;
        }
        if(anio == ""){
            mostrarMensaje("error","ERROR","Debe seleccionar el Año");
            return false;
        }
        if(mes == ""){
            mostrarMensaje("error","ERROR","Debe seleccionar el Mes");
            return false;
        }
        if(fechaInicio.substr(0,4) != fechaFinal.substr(0,4)){
            mostrarMensaje("error","ERROR","El año de la fecha de inicio debe ser igual al año de la fecha final");
            return false;
        }
        if(fechaInicio.substr(5,2) != fechaFinal.substr(5,2)){
            mostrarMensaje("error","ERROR","El mes de la fecha de inicio debe ser igual al mes de la fecha final");
            return false;
        }
        if(fechaInicio.substr(0,4) != anio || fechaFinal.substr(0,4) != anio){
            mostrarMensaje("error","ERROR","El año de la fecha de inicio y la fecha final debe ser igual al año seleccionado");
            return false;
        }
        if(fechaInicio.substr(5,2) != mes || fechaFinal.substr(5,2) != mes){
            mostrarMensaje("error","ERROR","El mes de la fecha de inicio y la fecha final debe ser igual al mes seleccionado");
            return false;
        }
        
        $("#frmExcelPlanillaElectronica").submit();
    });
    
    /*$("#btnConfirmar").click(function(){
        asignarEstiloModal("confirmacion");
        $("#mensaje-titulo").html("CONFIRMACION");
        $("#mensaje-contenido").html("Datos grabados correctamente");
        $("#modalMensaje").modal({backdrop: 'static', keyboard: false});
    });
    
    $("#btnError").click(function(){
        asignarEstiloModal("error");
        $("#mensaje-titulo").html("ERROR");
        $("#mensaje-contenido").html("No se pudo grabar los datos, intenete de nuevo");
        $("#modalMensaje").modal({backdrop: 'static', keyboard: false});
    });
    */
    /*
    $("#btnCerrar").click(function(){
        $("#modalMensaje").modal("hide");
    });
    */
});


