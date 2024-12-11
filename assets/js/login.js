$(document).ready(function()
{
    console.log("ENTRO LOGIN");
    
    //DESCOMENTAR EN NAVIDAD
    // new Snowflakes({
    //     color: "#ffffff",
    //     container: document.querySelector('#snowflakes-container'), 
    //     count: 100, 
    //     minOpacity: 0.6, 
    //     maxOpacity: 1,
    //     minSize: 15, 
    //     maxSize: 60, 
    //     rotation: true, 
    //     speed: 1, 
    //     wind: true, 
    //     //width: 500, 
    //     //height: 950, 
    //     //zIndex: 100, 
    //     autoResize: true
    // });
    // var sound = new Howl({
    //     src: [path+'assets/mp3/navidad.mp3'],
    //     autoplay: true,
    //     //loop: true,
    //     volume: 0.8,
    //     //onend: function() {            
    //     //}
    // });
    // sound.play();
    
   //END............

    $("#usuario").focus();

    Notiflix.Notify.Init({
        position:'center-top',
        fontSize:'17px',
    });

});

$("#kt_sign_in_submit").click(function(){
    validarLogin();
});

// $("#usuario").keyup(function (e) {
//     if (e.which == 13) {
//         validarLogin();
//     }else{
//         $("#error").text("");
//         $("#error").css("display","none");
//     }
// });    
// $("#contrasenia").keyup(function (e) {
//     if (e.which == 13) {
//         validarLogin();
//     }else{
//         $("#error").text("");
//         $("#error").css("display","none");
//     }
// });

function validarLogin()
{

    console.log("asAAAAAAAAAAd");
    
    if($("#usuario").val().trim() === "")
    {
        Notiflix.Notify.Warning('Ingrese su usuario');

    }else if($("#contrasenia").val().trim() === "")
    {

        Notiflix.Notify.Warning('Ingrese su contraseña');

    }else
    {
        console.log("entr");
        
        $.ajax({
            url: path + "Auth/index",
            type: "POST",
            data: {usuario: $("#usuario").val(),
                contrasenia : $("#contrasenia").val()
            },
            success: function(data){
                console.log(data);
                var datos = JSON.parse(data);                
                if(datos.respuesta === "success"){
                    window.location.href = path + "main";
                }else{

                    Notiflix.Notify.Failure(datos.error);                       
                    $("#usuario").val("");
                    $("#contrasenia").val("");
                    $("#usuario").focus();
                }
            }
        });
    }
}



/*PARA NAVIDAD EN IA: Descomentar*/
/*
var canvas = document.getElementById('snow');
var ctx = canvas.getContext('2d');

var w = canvas.width = window.innerWidth;
var h = canvas.height = window.innerHeight;

var num = 60; //Número de copos de nieve
var tamaño = 30; //Tamaño de copos de nieve
var elementos = [];

inicio();
nevada();

window.addEventListener("resize", function() {
w = canvas.width = window.innerWidth;
h = canvas.height = window.innerHeight;
});

function inicio() {
for (var i = 0; i < num; i++) {
    elementos[i] = {
    x: Math.ceil(Math.random() * w),
    y: Math.ceil(Math.random() * h),
    toX: Math.random() * 10 - 5,
    toY: Math.random() * 5 + 1,
    tamaño: Math.random() * tamaño
    }
}
}

function nevada() {
ctx.clearRect(0, 0, w, h);
for (var i = 0; i < num; i++) {
    var e = elementos[i];
    ctx.beginPath();
    cristal(e.x, e.y, e.tamaño);
    ctx.fill();
    ctx.stroke();
    e.x = e.x + e.toX;
    e.y = e.y + e.toY;
    if (e.x > w) { e.x = 0;}
    if (e.x < 0) { e.x = w;}
    if (e.y > h) { e.y = 0;}
}
timer = setTimeout(nevada,25);//Velocidad de copos de nieve
}

function cristal(cx, cy, long) {
ctx.fillStyle = "white";
ctx.lineWidth = long / 20;
ctx.arc(cx, cy, long / 15, 0, 2 * Math.PI);
for (i = 0; i < 6; i++) {
    ctx.strokeStyle = "white";
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + long / 2 * Math.sin(i * 60 / 180 * Math.PI),
            cy + long / 2 * Math.cos(i * 60 / 180 * Math.PI));
}
}*/