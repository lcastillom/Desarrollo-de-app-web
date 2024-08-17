(() => {
    'use strict';

    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.needs-validation');
    const usuarios = [
        {
            usuario: "cesar@mail.com",
            contrasena: "12345"
        },
        {
            usuario: "lety@mail.com",
            contrasena: "54321"
        },
        {
            usuario: "angel@mail.com",
            contrasena: "951623"
        }
    ];
  
    // Loop over them and prevent submission
    Array.from(forms).forEach(form => {
      form.addEventListener('submit', event => {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
          form.classList.add('was-validated');
          return;
        }

        console.log("Validar usuario contra datos");
        const usuario = document.getElementById("usuario").value;
        const contrasena = document.getElementById("contrasena").value;
        
        const encontrados = usuarios.filter(usr => 
            usr.usuario.toLowerCase() === usuario.toLowerCase() &&
            usr.contrasena === contrasena);

        if (encontrados.length == 0) {
            event.preventDefault();
            event.stopPropagation();

            alert("Usuario no encontrado");
            console.log("Usuario no encontrado");
        }
      }, false);
    });
  })();