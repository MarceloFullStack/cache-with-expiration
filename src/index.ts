
export const cacheWithDuration = async <T>(
    cacheKey: string,
    cacheTime: number,
    fn: () => Promise<T>,
    log: boolean = false
): Promise<T> => {
    console.log('teste')
    // Nome do banco de dados
    const dbName = 'cacheDB';

    // Nome da store (tabela)
    const storeName = 'cacheStore';
    // Variável para armazenar a referência ao banco de dados

    let db: IDBDatabase | null = null;
    // Função para abrir o banco de dados

    const openDB = (): Promise<IDBDatabase> => {
        return new Promise((resolve, reject) => {
            // Cria uma requisição para abrir o banco de dados 'cacheDB', versão 1

            const request: IDBOpenDBRequest = window.indexedDB.open(dbName, 1);
            // Se ocorrer um erro, rejeita a promise com o erro

            request.onerror = (event: any) => reject(event.target.error);
            // Se a abertura do banco de dados for bem-sucedida, resolve a promise com a referência ao banco de dados

            request.onsuccess = (event: any) => resolve(event.target.result);
            // Se for necessário atualizar a versão do banco de dados, cria uma store com o nome 'cacheStore' e keyPath 'key'

            request.onupgradeneeded = (event: any) => {
                const db = event.target.result;
                db.createObjectStore(storeName, { keyPath: 'key' });
            };
        });
    };
    // Função para obter dados do banco de dados a partir de uma chave

    const getData = async (key: string): Promise<{ value: T; timestamp: number } | undefined> => {
        return new Promise((resolve, reject) => {
            // Inicia uma transação de leitura na store 'cacheStore'

            const transaction: IDBTransaction = db!.transaction([storeName], 'readonly');
            const store: IDBObjectStore = transaction.objectStore(storeName);
            // Faz uma requisição para obter o dado associado à chave 'key'

            const request: IDBRequest<{ value: T; timestamp: number } | undefined> = store.get(key);
            // Se ocorrer um erro, rejeita a promise com o erro

            request.onerror = (event: any) => reject(event.target.error);
            // Se a obtenção dos dados for bem-sucedida, resolve a promise com os dados

            request.onsuccess = (event: any) => resolve(event.target.result);
        });
    };

    // Função para salvar dados no banco de dados

    const setData = async (key: string, value: { value: T; timestamp: number }): Promise<void> => {
        return new Promise((resolve, reject) => {
            // Inicia uma transação de escrita no banco de dados

            const transaction: IDBTransaction = db!.transaction([storeName], 'readwrite');
            // Pega a store que será utilizada

            const store: IDBObjectStore = transaction.objectStore(storeName);
            // Inicia uma requisição para salvar o dado na store

            const request: IDBRequest = store.put({ key, ...value });
            // Se houver erro, rejeita a Promise

            request.onerror = (event: any) => reject(event.target.error);
            // Se tudo der certo, resolve a Promise

            request.onsuccess = (event) => resolve();
        });
    };

    // Se o banco de dados ainda não foi inicializado, abre-o

    if (!db) {
        db = await openDB();
    }

    // Pega a hora atual

    let now = Date.now();
    // Tenta pegar o dado armazenado previamente no banco de dados

    let cachedData = await getData(cacheKey);
    // Se o dado estiver armazenado e a diferença entre a hora atual e o timestamp do dado for menor que o tempo de cache, retorna o dado

    if (cachedData && now - cachedData.timestamp < cacheTime) {
        // Se o dado não estiver armazenado ou já estiver fora do tempo de cache, pega o dado da função fn e salva no banco de dados

        log && console.info('returned from cache', cacheKey);
        return cachedData.value;
    }
    log && console.info('returned from API', cacheKey);
    let data = await fn();
    await setData(cacheKey, { value: data, timestamp: now });
    return data;
};

// Função para limpar o cache do banco de dados IndexedDB
export const clearCacheIndexedDB = (): Promise<void> => {
    return new Promise((resolve, reject) => {
        // Abre o banco de dados 'cacheDB' com versão 1
        const request: IDBOpenDBRequest = window.indexedDB.open('cacheDB', 1);
        // Se houver erro na abertura do banco de dados, rejeita a Promise
        request.onerror = (event: any) => reject(event.target.error);
        // Se a abertura do banco de dados for bem-sucedida
        request.onsuccess = (event: any) => {
            // Recupera a instância do banco de dados
            const db = event.target.result;
            // Inicia uma transação em modo de escrita no object store 'cacheStore'
            const transaction: IDBTransaction = db.transaction(['cacheStore'], 'readwrite');
            // Recupera a instância do object store 'cacheStore'
            const store: IDBObjectStore = transaction.objectStore('cacheStore');
            // Executa a operação de limpeza do cache
            const request: IDBRequest = store.clear();
            // Se houver erro na limpeza do cache, rejeita a Promise
            request.onerror = (event: any) => reject(event.target.error);
            // Se a limpeza do cache for bem-sucedida, resolve a Promise
            request.onsuccess = () => resolve();
        };
    });
};
