document.addEventListener('DOMContentLoaded', () => {

    // --- LÓGICA DEL CURSOR PERSONALIZADO ---
    const cursor = document.querySelector('.cursor');
    const interactiveElements = document.querySelectorAll('.interactive');

    // Mover el cursor
    document.addEventListener('mousemove', e => {
        cursor.setAttribute("style", "top: " + (e.pageY - scrollY) + "px; left: " + e.pageX + "px;");
    });

    // Añadir clase 'grow' al pasar sobre elementos interactivos
    interactiveElements.forEach(el => {
        el.addEventListener('mouseover', () => {
            cursor.classList.add('grow');
        });
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('grow');
        });
    });

    // --- LÓGICA DE ANIMACIONES AL HACER SCROLL ---
    const revealElements = document.querySelectorAll('.reveal');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            }
        });
    }, {
        threshold: 0.1 // El elemento se revela cuando el 10% es visible
    });

    revealElements.forEach(el => {
        observer.observe(el);
    });

});

// --- LÓGICA DE GALERÍA TIPO INSTAGRAM ---
document.addEventListener('DOMContentLoaded', () => {
  const posts = document.querySelectorAll('.insta-post');
  const modal = document.getElementById('instaModal');
  const modalImg = document.getElementById('modalImg');
  const modalTitle = document.getElementById('modalTitle');
  const modalDesc = document.getElementById('modalDesc');
  const commentsContainer = document.getElementById('comments');
  const commentInput = document.getElementById('commentInput');
  const postCommentBtn = document.getElementById('postComment');
  const closeModal = document.getElementById('closeModal');

  posts.forEach(post => {
    post.addEventListener('click', () => {
      modal.style.display = 'flex';
      modalImg.src = post.dataset.img;
      modalTitle.textContent = post.dataset.title;
      modalDesc.textContent = post.dataset.desc;

      // Limpiar comentarios anteriores
      commentsContainer.innerHTML = '';

      // Detectar orientación de imagen
      const img = new Image();
      img.src = post.dataset.img;
      img.onload = () => {
        if (img.width > img.height) {
          modalImg.classList.add('horizontal');
        } else {
          modalImg.classList.remove('horizontal');
        }
      };
    });
  });

  // Cerrar modal al presionar fuera del contenido
  modal.addEventListener('click', e => {
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  });

  // Botón de cerrar (×)
  closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
  });

  // Agregar comentario dinámico
  postCommentBtn.addEventListener('click', () => {
    const text = commentInput.value.trim();
    if (text !== '') {
      const comment = document.createElement('div');
      comment.classList.add('comment');
      comment.innerHTML = `<strong>usuario</strong> ${text}`;
      commentsContainer.appendChild(comment);
      commentInput.value = '';
      commentsContainer.scrollTop = commentsContainer.scrollHeight;
    }
  });

  // Permitir Enter para enviar comentario
  commentInput.addEventListener('keypress', e => {
    if (e.key === 'Enter') {
      postCommentBtn.click();
    }
  });
});

