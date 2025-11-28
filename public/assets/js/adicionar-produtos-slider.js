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
