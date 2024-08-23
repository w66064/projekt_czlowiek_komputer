// Przykładowa baza danych zgłoszeń
let zgloszenia = JSON.parse(localStorage.getItem('zgloszenia')) || [];

document.addEventListener('DOMContentLoaded', () => {
    const dodajZgloszenieBtn = document.getElementById('dodajZgloszenieBtn');
    const zgloszeniePopup = document.getElementById('zgloszeniePopup');
    const szczegolyPopup = document.getElementById('szczegolyPopup');
    const zgloszenieForm = document.getElementById('zgloszenieForm');
    const anulujZgloszenieBtn = document.getElementById('anulujZgloszenie');
    const zapiszZgloszenieBtn = document.getElementById('zapiszZgloszenie');
    const szczegolyZgloszenia = document.getElementById('szczegolyZgloszenia');
    const zgloszeniaTableBody = document.getElementById('zgloszeniaTableBody');

    // Otwórz popup dodawania/edycji zgłoszenia
    dodajZgloszenieBtn.addEventListener('click', () => {
        zgloszeniePopup.style.display = 'flex';
        zgloszenieForm.reset();
        zgloszenieForm.dataset.index = ''; // Resetowanie indeksu edytowanego zgłoszenia
    });

    // Anuluj dodawanie/edycję zgłoszenia
    anulujZgloszenieBtn.addEventListener('click', () => {
        zgloszeniePopup.style.display = 'none';
    });

    // Zapisz zgłoszenie
    zapiszZgloszenieBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const index = zgloszenieForm.dataset.index;
        const pracownik = document.getElementById('pracownik').value;
        const status = document.getElementById('status').value;
        const klientImie = document.getElementById('klientImie').value;
        const klientNazwisko = document.getElementById('klientNazwisko').value;
        const klientTel = document.getElementById('klientTel').value;
        const klientEmail = document.getElementById('klientEmail').value;
        const opis = document.getElementById('opis').value;

        // Walidacja
        if (!pracownik || !status || !klientImie || !klientNazwisko || !klientTel || !klientEmail || !opis) {
            alert('Wypełnij wszystkie pola!');
            return;
        }

        // Walidacja numeru telefonu
        if (!/^\d{9,15}$/.test(klientTel)) {
            alert('Numer telefonu musi być liczbą z 9-15 cyframi.');
            return;
        }

        // Walidacja adresu e-mail
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(klientEmail)) {
            alert('Podaj poprawny adres e-mail.');
            return;
        }

        // Walidacja imienia i nazwiska
        if (!/^[a-zA-ZąćęłńóśżźĄĆĘŁŃÓŚŻŹ\s]+$/.test(klientImie) || !/^[a-zA-ZąćęłńóśżźĄĆĘŁŃÓŚŻŹ\s]+$/.test(klientNazwisko)) {
            alert('Imię i nazwisko mogą zawierać tylko litery.');
            return;
        }

        if (index !== '') {
            // Edytowanie istniejącego zgłoszenia
            zgloszenia[index] = { pracownik, status, klientImie, klientNazwisko, klientTel, klientEmail, opis };
        } else {
            // Dodawanie nowego zgłoszenia
            zgloszenia.push({ pracownik, status, klientImie, klientNazwisko, klientTel, klientEmail, opis });
        }

        saveToLocalStorage();
        zgloszeniePopup.style.display = 'none';
        renderTable();
    });

    // Zamknij popup szczegółów
    szczegolyPopup.querySelector('.close-btn').addEventListener('click', () => {
        szczegolyPopup.style.display = 'none';
    });

    // Funkcja renderująca tabelę
    function renderTable() {
        zgloszeniaTableBody.innerHTML = '';
        zgloszenia.forEach((zgloszenie, index) => {
            const row = document.createElement('tr');

            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${zgloszenie.pracownik}</td>
                <td>${zgloszenie.status}</td>
                <td><button class="szczegolyBtn" data-index="${index}">Szczegóły</button></td>
                <td>
                    <button class="actions edit" data-index="${index}">Edytuj</button>
                    <button class="actions delete" data-index="${index}">Usuń</button>
                </td>
            `;
            zgloszeniaTableBody.appendChild(row);
        });

        // Dodaj obsługę przycisków "Szczegóły", "Edytuj" i "Usuń"
        zgloszeniaTableBody.querySelectorAll('.szczegolyBtn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = e.target.dataset.index;
                showDetails(index);
            });
        });

        zgloszeniaTableBody.querySelectorAll('.edit').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = e.target.dataset.index;
                editZgloszenie(index);
            });
        });

        zgloszeniaTableBody.querySelectorAll('.delete').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = e.target.dataset.index;
                deleteZgloszenie(index);
            });
        });
    }

    // Funkcja wyświetlająca szczegóły zgłoszenia
    function showDetails(index) {
        const zgloszenie = zgloszenia[index];
        szczegolyZgloszenia.innerHTML = `
            <p><strong>ID:</strong> ${parseInt(index) + 1}</p>
            <p><strong>Pracownik:</strong> ${zgloszenie.pracownik}</p>
            <p><strong>Status:</strong> ${zgloszenie.status}</p>
            <p><strong>Imię klienta:</strong> ${zgloszenie.klientImie}</p>
            <p><strong>Nazwisko klienta:</strong> ${zgloszenie.klientNazwisko}</p>
            <p><strong>Numer telefonu klienta:</strong> ${zgloszenie.klientTel}</p>
            <p><strong>Adres email klienta:</strong> ${zgloszenie.klientEmail}</p>
            <p><strong>Opis:</strong> ${zgloszenie.opis}</p>
        `;
        szczegolyPopup.style.display = 'flex';
    }

    // Funkcja edytująca zgłoszenie
    function editZgloszenie(index) {
        const zgloszenie = zgloszenia[index];
        document.getElementById('pracownik').value = zgloszenie.pracownik;
        document.getElementById('status').value = zgloszenie.status;
        document.getElementById('klientImie').value = zgloszenie.klientImie;
        document.getElementById('klientNazwisko').value = zgloszenie.klientNazwisko;
        document.getElementById('klientTel').value = zgloszenie.klientTel;
        document.getElementById('klientEmail').value = zgloszenie.klientEmail;
        document.getElementById('opis').value = zgloszenie.opis;
        zgloszeniePopup.style.display = 'flex';
        zgloszenieForm.dataset.index = index;
    }

    // Funkcja usuwająca zgłoszenie
    function deleteZgloszenie(index) {
        if (confirm('Czy na pewno chcesz usunąć to zgłoszenie?')) {
            zgloszenia.splice(index, 1);
            saveToLocalStorage();
            renderTable();
        }
    }

    // Funkcja zapisywania do localStorage
    function saveToLocalStorage() {
        localStorage.setItem('zgloszenia', JSON.stringify(zgloszenia));
    }

    // Renderowanie tabeli przy załadowaniu strony
    renderTable();
});
