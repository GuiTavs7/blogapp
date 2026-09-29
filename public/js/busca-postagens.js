const inputSearch = document.getElementById('search-posts');

inputSearch.addEventListener('input', function() {
    
    const searchTerm = inputSearch.value.toLowerCase();
    const postagens = document.querySelectorAll('.postagem-item');

    console.log(searchTerm);

    postagens.forEach(postagem => {
        const titulo = postagem.querySelector('h3').textContent.toLowerCase();
        const descricao = postagem.querySelector('p').textContent.toLowerCase();

        if (titulo.includes(searchTerm) || descricao.includes(searchTerm)) {
            postagem.style.display = 'block';
        } else {
            postagem.style.display = 'none';
        }
    });
});