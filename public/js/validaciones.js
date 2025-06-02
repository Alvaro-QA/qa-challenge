function evaluatePasswordStrength(password) {
  console.log("evaluatePasswordStrength ejecutado con:", password);

  let score = 0;
  let feedback = '';

  if (password.length >= 8) score += 1;
  if (/[a-z]/.test(password)) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  const strengthBar = document.getElementById('strengthBar');
  const strengthText = document.getElementById('strengthText');

  if (password.length === 0) {
    console.log('Contraseña vacía');
    strengthBar.style.width = '0%';
    strengthText.textContent = '';
    strengthBar.className = 'strength-bar';
    return;
  }

  if (score <= 2) {
    console.log('Contraseña débil');
    strengthBar.style.width = '33%';
    strengthBar.className = 'strength-bar strength-weak';
    feedback = 'Débil - Agrega mayúsculas, números y símbolos';
  } else if (score <= 3) {
    console.log('Contraseña media');
    strengthBar.style.width = '66%';
    strengthBar.className = 'strength-bar strength-medium';
    feedback = 'Media - Considera agregar más caracteres especiales';
  } else {
    console.log('Contraseña fuerte');
    strengthBar.style.width = '100%';
    strengthBar.className = 'strength-bar strength-strong';
    feedback = 'Fuerte - ¡Excelente contraseña!';
  }

  strengthText.textContent = feedback;
}

function validateEmailRealTime(email) {
  console.log('validateEmailRealTime ejecutado con:', email);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const emailInput = document.getElementById('email');
  const errorEmail = document.getElementById('error-email');

  if (!email) {
    errorEmail.textContent = '';
    emailInput.className = '';
    return;
  }

  if (!emailRegex.test(email)) {
    console.log('Email con formato inválido');
    errorEmail.textContent = 'Formato de email inválido';
    emailInput.className = 'error';
  } else if (!email.endsWith('@empresa.com.ar')) {
    console.log('Email fuera del dominio');
    errorEmail.textContent = 'Debe usar el dominio @empresa.com.ar';
    emailInput.className = 'error';
  } else {
    console.log('Email válido');
    errorEmail.textContent = '';
    emailInput.className = 'success';
  }
}

function clearErrors() {
  console.log('Limpiando errores del formulario');
  ['nombre', 'email', 'edad', 'password', 'repetir'].forEach(field => {
    document.getElementById('error-' + field).textContent = '';
    document.getElementById(field).classList.remove('error', 'success');
  });
}

function validateNombre(nombre) {
  console.log('Validando nombre:', nombre);

  const nombreInput = document.getElementById('nombre');
  const errorNombre = document.getElementById('error-nombre');

  if (!nombre) {
    errorNombre.textContent = 'El nombre es obligatorio';
    nombreInput.classList.add('error');
    return false;
  } else if (nombre.length < 2) {
    errorNombre.textContent = 'El nombre debe tener al menos 2 caracteres';
    nombreInput.classList.add('error');
    return false;
  } else {
    nombreInput.classList.add('success');
    return true;
  }
}

function validateEmail(email) {
  console.log('Validando email:', email);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const emailInput = document.getElementById('email');
  const errorEmail = document.getElementById('error-email');

  if (!email) {
    errorEmail.textContent = 'El email es obligatorio';
    emailInput.classList.add('error');
    return false;
  } else if (!emailRegex.test(email)) {
    errorEmail.textContent = 'Formato de email inválido';
    emailInput.classList.add('error');
    return false;
  } else if (!email.endsWith('@empresa.com.ar')) {
    errorEmail.textContent = 'El email debe pertenecer al dominio @empresa.com.ar';
    emailInput.classList.add('error');
    return false;
  } else {
    emailInput.classList.add('success');
    return true;
  }
}

function validateEdad(edad) {
  console.log('Validando edad:', edad);

  const edadInput = document.getElementById('edad');
  const errorEdad = document.getElementById('error-edad');

  if (edad !== '') {
    const edadNum = Number(edad);
    if (isNaN(edadNum) || edadNum < 18 || edadNum > 99) {
      errorEdad.textContent = 'La edad debe ser un número entre 18 y 99 años';
      edadInput.classList.add('error');
      return false;
    } else {
      edadInput.classList.add('success');
      return true;
    }
  }
  return true;
}

function validatePassword(password) {
  console.log('Validando contraseña');

  const passwordInput = document.getElementById('password');
  const errorPassword = document.getElementById('error-password');

  if (!password) {
    errorPassword.textContent = 'La contraseña es obligatoria';
    passwordInput.classList.add('error');
    return false;
  } else if (password.length < 6) {
    errorPassword.textContent = 'La contraseña debe tener al menos 6 caracteres';
    passwordInput.classList.add('error');
    return false;
  } else {
    passwordInput.classList.add('success');
    return true;
  }
}

function validateRepetir(password, repetir) {
  console.log('Validando repetición de contraseña');

  const repetirInput = document.getElementById('repetir');
  const errorRepetir = document.getElementById('error-repetir');

  if (!repetir) {
    errorRepetir.textContent = 'Debe confirmar la contraseña';
    repetirInput.classList.add('error');
    return false;
  } else if (password !== repetir) {
    errorRepetir.textContent = 'Las contraseñas no coinciden';
    repetirInput.classList.add('error');
    return false;
  } else {
    repetirInput.classList.add('success');
    return true;
  }
}

function showLoading(show) {
  console.log('Estado de carga:', show);

  const submitBtn = document.getElementById('submitBtn');
  const loading = document.getElementById('loading');

  if (show) {
    submitBtn.disabled = true;
    submitBtn.textContent = 'Procesando...';
    loading.style.display = 'block';
  } else {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Crear Cuenta';
    loading.style.display = 'none';
  }
}

function showSuccessMessage(nombre) {
  console.log('Mostrando mensaje de éxito');

  const mensajeExito = document.getElementById('mensajeExito');
  mensajeExito.textContent = `Registro exitoso. Bienvenido/a, ${nombre}!`;
  mensajeExito.style.display = 'block';
  mensajeExito.style.color = '#27ae60';
  mensajeExito.style.background = '#d4edda';
  mensajeExito.style.borderColor = '#c3e6cb';
}

function showErrorMessage(mensaje) {
  console.log('Mostrando mensaje de error general');

  const mensajeExito = document.getElementById('mensajeExito');
  mensajeExito.textContent = mensaje;
  mensajeExito.style.display = 'block';
  mensajeExito.style.color = '#e74c3c';
  mensajeExito.style.background = '#fdf2f2';
  mensajeExito.style.borderColor = '#e74c3c';
}

function resetForm() {
  console.log('Reseteando formulario');

  document.getElementById('registroForm').reset();
  ['nombre', 'email', 'edad', 'password', 'repetir'].forEach(field => {
    document.getElementById(field).classList.remove('error', 'success');
  });
  document.getElementById('strengthBar').style.width = '0%';
  document.getElementById('strengthText').textContent = '';
}

// Eventos
document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('password').addEventListener('input', function () {
    evaluatePasswordStrength(this.value);
  });

  document.getElementById('email').addEventListener('input', function () {
    validateEmailRealTime(this.value.trim());
  });

  document.getElementById('repetir').addEventListener('input', function () {
    const password = document.getElementById('password').value;
    const repetir = this.value;
    const errorRepetir = document.getElementById('error-repetir');
    const repetirInput = this;

    if (!repetir) {
      repetirInput.className = '';
      errorRepetir.textContent = '';
      return;
    }

    if (password !== repetir) {
      repetirInput.className = 'error';
      errorRepetir.textContent = 'Las contraseñas no coinciden';
    } else {
      repetirInput.className = 'success';
      errorRepetir.textContent = '';
    }
  });
});

document.getElementById('registroForm').addEventListener('submit', async function (e) {
  e.preventDefault();
  console.log('Formulario enviado');

  clearErrors();
  const mensajeExito = document.getElementById('mensajeExito');
  mensajeExito.style.display = 'none';

  const nombre = document.getElementById('nombre').value.trim();
  const email = document.getElementById('email').value.trim();
  const edad = document.getElementById('edad').value.trim();
  const password = document.getElementById('password').value;
  const repetir = document.getElementById('repetir').value;

  let valid = true;
  valid = validateNombre(nombre) && valid;
  valid = validateEmail(email) && valid;
  valid = validateEdad(edad) && valid;
  valid = validatePassword(password) && valid;
  valid = validateRepetir(password, repetir) && valid;

  if (!valid) return;

  showLoading(true);

  try {
    const response = await fetch('/api/registro', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, email, edad, password, repetir }),
    });

    if (response.ok) {
      const data = await response.json();
      showSuccessMessage(data.nombre || nombre);
      resetForm();
    } else {
      const errorData = await response.json();
      if (errorData.error === 'El email ya está registrado') {
        console.log('Email duplicado');
        const errorEmail = document.getElementById('error-email');
        const emailInput = document.getElementById('email');
        errorEmail.textContent = errorData.error;
        emailInput.classList.add('error');
      } else {
        showErrorMessage(errorData.message || errorData.error || 'Error en el registro. Por favor, inténtalo nuevamente.');
      }
    }
  } catch (error) {
    console.error('Error en el registro:', error);
    showErrorMessage('Error de conexión. Por favor, verifica tu conexión a internet e inténtalo nuevamente.');
  } finally {
    showLoading(false);
  }
});