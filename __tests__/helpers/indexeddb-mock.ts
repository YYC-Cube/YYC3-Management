// IndexedDB模拟工具 - 用于测试环境中模拟IndexedDB
// @author: YYC3团队
// @version: v1.0.0
// @created: 2025-01-20
// @updated: 2025-01-20
// @tags: 测试,IndexedDB,模拟,辅助工具

export class MockIDBRequest<T = any> implements IDBRequest<T> {
  public result: T | null = null
  public error: DOMException | null = null
  public readyState: IDBRequestReadyState = "done"
  public transaction: IDBTransaction | null = null
  public source: IDBObjectStore | IDBIndex | IDBCursor | null = null

  private _onsuccess: ((this: IDBRequest<T>, ev: Event) => any) | null = null
  private _onerror: ((this: IDBRequest<T>, ev: Event) => any) | null = null

  get onsuccess() {
    return this._onsuccess
  }

  set onsuccess(callback: ((this: IDBRequest<T>, ev: Event) => any) | null) {
    this._onsuccess = callback
  }

  get onerror() {
    return this._onerror
  }

  set onerror(callback: ((this: IDBRequest<T>, ev: Event) => any) | null) {
    this._onerror = callback
  }
}

export class MockIDBObjectStore implements IDBObjectStore {
  public name: string
  public keyPath: string | string[] | null
  public indexNames: DOMStringList
  public transaction: IDBTransaction | null = null
  public autoIncrement: boolean

  private data: Map<string, any> = new Map()
  private indexes: Map<string, MockIDBIndex> = new Map()

  constructor(
    name: string,
    options: IDBObjectStoreParameters = {}
  ) {
    this.name = name
    this.keyPath = options.keyPath || null
    this.autoIncrement = options.autoIncrement || false
    this.indexNames = [] as any
  }

  add(value: any, key?: IDBValidKey): MockIDBRequest {
    const request = new MockIDBRequest()
    const id = key || (this.keyPath ? value[this.keyPath as string] : Date.now())
    this.data.set(String(id), { ...value, id })
    request.result = id
    return request
  }

  put(value: any, key?: IDBValidKey): MockIDBRequest {
    const request = new MockIDBRequest()
    const id = key || (this.keyPath ? value[this.keyPath as string] : value.id)
    this.data.set(String(id), { ...value, id })
    request.result = id
    return request
  }

  get(key: IDBValidKey): MockIDBRequest {
    const request = new MockIDBRequest()
    request.result = this.data.get(String(key)) || null
    return request
  }

  delete(key: IDBValidKey): MockIDBRequest {
    const request = new MockIDBRequest()
    this.data.delete(String(key))
    request.result = undefined
    return request
  }

  clear(): MockIDBRequest {
    const request = new MockIDBRequest()
    this.data.clear()
    request.result = undefined
    return request
  }

  getAll(): MockIDBRequest {
    const request = new MockIDBRequest()
    request.result = Array.from(this.data.values())
    return request
  }

  createIndex(
    name: string,
    keyPath: string | string[],
    options?: IDBIndexParameters
  ): MockIDBIndex {
    const index = new MockIDBIndex(name, keyPath, options)
    this.indexes.set(name, index)
    return index
  }
}

export class MockIDBIndex implements IDBIndex {
  public name: string
  public keyPath: string | string[]
  public objectStore: IDBObjectStore
  public multiEntry: boolean
  public unique: boolean

  constructor(
    name: string,
    keyPath: string | string[],
    options?: IDBIndexParameters
  ) {
    this.name = name
    this.keyPath = keyPath
    this.multiEntry = options?.multiEntry || false
    this.unique = options?.unique || false
    this.objectStore = {} as any
  }

  get(key: IDBValidKey): MockIDBRequest {
    const request = new MockIDBRequest()
    request.result = null
    return request
  }

  getAll(): MockIDBRequest {
    const request = new MockIDBRequest()
    request.result = []
    return request
  }
}

export class MockIDBTransaction implements IDBTransaction {
  public db: IDBDatabase
  public mode: IDBTransactionMode
  public objectStoreNames: DOMStringList
  public error: DOMException | null = null
  public readyState: IDBTransactionReadyState = "done"

  private _oncomplete: ((this: IDBTransaction, ev: Event) => any) | null = null
  private _onerror: ((this: IDBTransaction, ev: Event) => any) | null = null
  private _onabort: ((this: IDBTransaction, ev: Event) => any) | null = null

  constructor(
    db: IDBDatabase,
    storeNames: string[],
    mode: IDBTransactionMode = "readonly"
  ) {
    this.db = db
    this.mode = mode
    this.objectStoreNames = storeNames as any
  }

  objectStore(name: string): IDBObjectStore {
    const db = this.db as any
    return db.getStore(name) || {} as any
  }

  commit(): void {
    this._oncomplete?.call(this, new Event("complete"))
  }

  abort(): void {
    this._onabort?.call(this, new Event("abort"))
  }

  get oncomplete() {
    return this._oncomplete
  }

  set oncomplete(callback: ((this: IDBTransaction, ev: Event) => any) | null) {
    this._oncomplete = callback
  }

  get onerror() {
    return this._onerror
  }

  set onerror(callback: ((this: IDBTransaction, ev: Event) => any) | null) {
    this._onerror = callback
  }

  get onabort() {
    return this._onabort
  }

  set onabort(callback: ((this: IDBTransaction, ev: Event) => any) | null) {
    this._onabort = callback
  }
}

export class MockIDBDatabase implements IDBDatabase {
  public name: string
  public version: number
  public objectStoreNames: DOMStringList
  private stores: Map<string, MockIDBObjectStore> = new Map()

  constructor(name: string, version: number) {
    this.name = name
    this.version = version
    this.objectStoreNames = [] as any
  }

  createObjectStore(
    name: string,
    options?: IDBObjectStoreParameters
  ): MockIDBObjectStore {
    const store = new MockIDBObjectStore(name, options)
    this.stores.set(name, store)
    return store
  }

  deleteObjectStore(name: string): void {
    this.stores.delete(name)
  }

  getStore(name: string): MockIDBObjectStore | undefined {
    return this.stores.get(name)
  }

  transaction(
    storeNames: string[],
    mode: IDBTransactionMode = "readonly"
  ): MockIDBTransaction {
    return new MockIDBTransaction(this, storeNames, mode)
  }

  close(): void {
    this.stores.clear()
  }
}

export class MockIDBOpenDBRequest extends MockIDBRequest<IDBDatabase> {
  public result: IDBDatabase | null = null
  public onupgradeneeded: ((this: IDBOpenDBRequest, ev: IDBVersionChangeEvent) => any) | null = null

  constructor(
    private dbName: string,
    private version: number,
    private db: MockIDBDatabase
  ) {
    super()
    this.result = db
    this.onupgradeneeded?.call(this, {
      type: "upgradeneeded",
      target: this,
      oldVersion: 0,
      newVersion: version,
    } as IDBVersionChangeEvent)
  }
}

export function setupMockIndexedDB() {
  const stores: Map<string, MockIDBDatabase> = new Map()

  (global as any).indexedDB = {
    open: (dbName: string, version: number): MockIDBOpenDBRequest => {
      let db = stores.get(dbName)
      if (!db) {
        db = new MockIDBDatabase(dbName, version)
        stores.set(dbName, db)
      }
      return new MockIDBOpenDBRequest(dbName, version, db)
    },
    deleteDatabase: (dbName: string): MockIDBRequest => {
      stores.delete(dbName)
      const request = new MockIDBRequest()
      request.result = undefined
      return request
    },
  }
}

export function cleanupMockIndexedDB() {
  delete (global as any).indexedDB
}
