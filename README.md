Biblioteca de cache com duração
===============================

Esta biblioteca é uma solução simples e eficiente para armazenar o resultado de uma função em cache por um determinado período de tempo, utilizando o IndexedDB.

Instalação
----------

Para instalar a biblioteca, você precisa ter o npm instalado em seu computador. Execute o seguinte comando:

```
npm install cache-with-expiration
```

Uso
---

Importe a função `cacheWithDurationIndexedDB` e passe três argumentos para ela:

*   `cacheKey`: uma string que representa a chave para armazenar o resultado em cache.
*   `cacheTime`: um número em milissegundos que representa o tempo que o resultado será armazenado em cache.
*   `fn`: uma função que representa a ação que você deseja cachear.
*   `log`: um booleano que controla se as informações de log serão exibidas ou não (opcional, padrão é `false`).

```
import { cacheWithDurationIndexedDB } from 'cache-with-expiration';

const getData = async () => {
  // Sua lógica para obter os dados
};

const result = await cacheWithDurationIndexedDB('myCacheKey', 30 * 1000, getData);
```

A função `cacheWithDurationIndexedDB` retorna o resultado da função passada como argumento, seja ele obtido a partir da cache ou da execução da função em si.

Limpeza do cache
----------------

Você também pode limpar o cache armazenado com a função `clearCacheIndexedDB`:

```
import { clearCacheIndexedDB } from 'cache-with-expiration';

await clearCacheIndexedDB();
```

Documentação
------------

A biblioteca cache-with-expiration é uma solução simples e eficiente para armazenar o resultado de uma função em cache por um determinado período de tempo, utilizando o IndexedDB. A função `cacheWithDurationIndexedDB` verifica se o resultado da função já está em cache e, se sim, retorna o resultado desse cache. Se o resultado não estiver em cache ou se o tempo de cache expirou, a função `cacheWithDurationIndexedDB` executa a função passada como argumento e armazena o resultado em cache.

Além disso, a biblioteca também oferece a função `clearCacheIndexedDB` para limpar o cache armazenado.
[continuar documentacao]
