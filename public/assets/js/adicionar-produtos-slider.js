 // Exibir nome do arquivo selecionado
 document.getElementById('productImage').addEventListener('change', function(e) {
    const fileName = e.target.files[0]?.name || 'Nenhum arquivo selecionado';
    document.getElementById('fileName').textContent = fileName;
});

// Limpar formulário
function clearForm() {
    document.getElementById('addProductForm').reset();
    document.getElementById('fileName').textContent = 'Nenhum arquivo selecionado';
}

// Submeter formulário
document.getElementById('addProductForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = new FormData(this);
    
    console.log('Dados do produto:', {
        nome: formData.get('productName'),
        preco: formData.get('productPrice'),
        descricao: formData.get('productDescription'),
        quantidade: formData.get('productQuantity'),
        imagem: formData.get('productImage')?.name
    });
    
    alert('Produto adicionado com sucesso!');
    clearForm();
});