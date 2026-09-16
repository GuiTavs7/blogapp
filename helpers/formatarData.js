function formatarData(data) {
    if (!data) return 'Data não informada';

    const dataFormatada = new Date(data);

    return new Intl.DateTimeFormat('pt-BR', { 
        dateStyle: 'short', 
        timeStyle: 'short'
    }).format(dataFormatada);
}

module.exports = formatarData;