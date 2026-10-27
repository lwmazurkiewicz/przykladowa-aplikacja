# Aplikacja edukacyjna
Aplikacja stworzona i rozwijana w ramach wykładu z Projektowania i implementacji aplikacji webowych.

## Instalacja narzędzi
Do pracy w trybie developerskim niezbędny jest `nodeJS` w wersji 24.
Do zarządzania wersjam środowiska `nodeJS` dobrze jest użyć `nvm`:

https://github.com/coreybutler/nvm-windows/releases

Po zainstalowaniu `nvm` dostępna jest komenda CLI, przy pomocy której możemy zainstalować odpowiednią wersję `nodeJS`, np.:

```
nvm list available
nvm install 24.21.0
nvm use 24.21.0
```

Po zainstalowaniu środowiska `nodeJS` dostępne będzie także narzędzie `npm`, którego można opcjonalnie użyć do zainstalowania globalnie Angular CLI:

```
npm install -g @angular/cli
```

## Przygotowanie repozytorium do pracy
Po sklonowaniu niniejszego repozytorium oraz po upewnieniu się, że zarówno `nodeJS` jak i `npm` są zainstalowane, należy, będąc wewnątrz katalogu z zawartością repozytorium, wykonać:

```
npm install
```

Komenda ta spowoduje zainstalowanie niezbędnych zależności.

## Uruchomienie backendu
Po zainstalowaniu zależności możliwe jest uruchomienie backendu za pomocą następującej komendy:

```
npm run backend:start
```

Nie należy zamykać terminala, na którym uruchomiliśmy backend.
Zatrzymanie pracy backendu możliwe jest po wciśnięciu CTRL-C.

## Uruchomienie frontendu w trybie develperskim
Tryb developerski pozwala na szybki restart frondendu w celu natychmiastowej weryfikacji napisanego kodu.
Uruchomienie frontendu następuje po wykonaniu następującej komendy:

```
ng serve -o
```

Frontend w trybie developerskim dostępny będzie pod adresem: http:\\localhost:4200
Narzędzie `serve` monitoruje wszystkie pliki źródłowe i po wykryciu ich zmiany restartuje serwer oraz aplikację w przeglądarce.

## Korzystanie z Angular CLI
Jeśli zainstalowaliśmy Angular CLI globalnie (patrz wyżej), narzędzie to jest dostępne z linii poleceń poprzez wpisanie: `ng`.
Alternatywnie, Angular CLI może być także uruchomiony za pośrednictwem `npm`:

```
npm run ng <parametry>
```

## Wykorzystanie backendu
Aplikacja ma prowizoryczny backend na potrzeby pokazywania przykładów. W późniejszej części semestru będziemy pracować nad przeniesieniem całego backendu do Pythona.
Backend wykorzystuje `json-server`, który serwuje zawartość pliku `backend/data.json`.

Serwer uruchamia się pod adresem:

http://localhost:3000/

Serwer oferuje REST API dla dwóch kolekcji obiektów:

* http://localhost:3000/api/theorems
* http://localhost:3000/api/categories

w tym API do manipulacji pojedynczymi obiektami, np.:

* http://localhost:3000/api/theorems/1
* http://localhost:3000/api/categories/2

Serwer obsługuje metody GET, POST, PUT, DELETE oferując tym samym podstawowe operacje typu CRUD.

Serwer obsługuje wyszukiwanie pełnotekstowe z wykorzystaniem parametru `q`:

http://localhost:3000/api/theorems?q=Lem

Serwer obsługuje wyszukiwanie wg wartości konkretnego pola, np.:

http://localhost:3000/api/theorems?categories=1