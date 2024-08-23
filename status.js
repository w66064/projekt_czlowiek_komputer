document.getElementById('statusForm').addEventListener('submit', function(event) {
    event.preventDefault();

    let statusId = document.getElementById('statusId').value;
    let statusTel = document.getElementById('statusTel').value;

    if (statusId === '' || statusTel === '') {
        document.getElementById('statusResult').textContent = 'Wypełnij wszystkie pola!';
        return;
    }

    let zgloszenia = JSON.parse(localStorage.getItem('zgloszenia')) || [];
    let znalezioneZgloszenie = zgloszenia.find(zgloszenie => 
        zgloszenie.klientTel === statusTel
    );

    if (znalezioneZgloszenie) {
        document.getElementById('statusResult').textContent = `Status zgłoszenia: ${znalezioneZgloszenie.status}`;
    } else {
        document.getElementById('statusResult').textContent = 'Nie znaleziono zgłoszenia lub dane są nieprawidłowe.';
    }
});
