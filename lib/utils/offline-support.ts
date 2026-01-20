"use client"

import { useState, useEffect, useCallback } from "react"

export interface OfflineOperation<T> {
  id: string
  type: "create" | "update" | "delete"
  data: T
  timestamp: number
  synced: boolean
  error?: string
}

export interface OfflineStorageOptions {
  dbName?: string
  storeName?: string
  version?: number
}

export class OfflineStorage<T> {
  private db: IDBDatabase | null = null
  private dbName: string
  private storeName: string
  private version: number

  constructor(options: OfflineStorageOptions = {}) {
    this.dbName = options.dbName || "yyc3-offline-db"
    this.storeName = options.storeName || "offline-data"
    this.version = options.version || 1
  }

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version)

      request.onerror = () => {
        reject(new Error("Failed to open IndexedDB"))
      }

      request.onsuccess = () => {
        this.db = request.result
        resolve()
      }

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result

        if (!db.objectStoreNames.contains(this.storeName)) {
          const objectStore = db.createObjectStore(this.storeName, { keyPath: "id" })
          objectStore.createIndex("timestamp", "timestamp", { unique: false })
          objectStore.createIndex("synced", "synced", { unique: false })
        }
      }
    })
  }

  async add(item: T & { id: string }): Promise<void> {
    if (!this.db) {
      await this.init()
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], "readwrite")
      const objectStore = transaction.objectStore(this.storeName)
      const request = objectStore.add(item)

      request.onsuccess = () => resolve()
      request.onerror = () => reject(new Error("Failed to add item"))
    })
  }

  async update(item: T & { id: string }): Promise<void> {
    if (!this.db) {
      await this.init()
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], "readwrite")
      const objectStore = transaction.objectStore(this.storeName)
      const request = objectStore.put(item)

      request.onsuccess = () => resolve()
      request.onerror = () => reject(new Error("Failed to update item"))
    })
  }

  async delete(id: string): Promise<void> {
    if (!this.db) {
      await this.init()
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], "readwrite")
      const objectStore = transaction.objectStore(this.storeName)
      const request = objectStore.delete(id)

      request.onsuccess = () => resolve()
      request.onerror = () => reject(new Error("Failed to delete item"))
    })
  }

  async get(id: string): Promise<T | null> {
    if (!this.db) {
      await this.init()
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], "readonly")
      const objectStore = transaction.objectStore(this.storeName)
      const request = objectStore.get(id)

      request.onsuccess = () => {
        resolve(request.result || null)
      }
      request.onerror = () => reject(new Error("Failed to get item"))
    })
  }

  async getAll(): Promise<T[]> {
    if (!this.db) {
      await this.init()
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], "readonly")
      const objectStore = transaction.objectStore(this.storeName)
      const request = objectStore.getAll()

      request.onsuccess = () => resolve(request.result || [])
      request.onerror = () => reject(new Error("Failed to get all items"))
    })
  }

  async clear(): Promise<void> {
    if (!this.db) {
      await this.init()
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], "readwrite")
      const objectStore = transaction.objectStore(this.storeName)
      const request = objectStore.clear()

      request.onsuccess = () => resolve()
      request.onerror = () => reject(new Error("Failed to clear store"))
    })
  }
}

export class OfflineManager<T> {
  private storage: OfflineStorage<T>
  private operations: OfflineOperation<T>[] = []
  private isOnline: boolean
  private syncInProgress: boolean

  constructor(storageOptions: OfflineStorageOptions = {}) {
    this.storage = new OfflineStorage<T>(storageOptions)
    this.isOnline = navigator.onLine
    this.syncInProgress = false

    this.init()
    this.setupEventListeners()
  }

  private async init(): Promise<void> {
    await this.storage.init()
    this.loadOperations()
  }

  private setupEventListeners(): void {
    window.addEventListener("online", this.handleOnline.bind(this))
    window.addEventListener("offline", this.handleOffline.bind(this))
  }

  private handleOnline(): void {
    this.isOnline = true
    this.sync()
  }

  private handleOffline(): void {
    this.isOnline = false
  }

  private async loadOperations(): Promise<void> {
    try {
      const operations = await this.storage.getAll() as OfflineOperation<T>[]
      this.operations = operations.filter((op) => !op.synced)
    } catch (error) {
      console.error("Failed to load operations:", error)
    }
  }

  async addOperation(
    type: "create" | "update" | "delete",
    data: T
  ): Promise<void> {
    const operation: OfflineOperation<T> = {
      id: `op-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      data,
      timestamp: Date.now(),
      synced: false,
    }

    this.operations.push(operation)
    await this.storage.add(operation as any)

    if (this.isOnline && !this.syncInProgress) {
      this.sync()
    }
  }

  async sync(): Promise<void> {
    if (this.syncInProgress || !this.isOnline) {
      return
    }

    this.syncInProgress = true

    try {
      const unsynced = this.operations.filter((op) => !op.synced)

      for (const operation of unsynced) {
        try {
          await this.syncOperation(operation)
          operation.synced = true
          await this.storage.update(operation as any)
        } catch (error) {
          operation.error = error instanceof Error ? error.message : "Unknown error"
          await this.storage.update(operation as any)
        }
      }

      this.operations = this.operations.filter((op) => !op.synced)
    } catch (error) {
      console.error("Sync failed:", error)
    } finally {
      this.syncInProgress = false
    }
  }

  private async syncOperation(operation: OfflineOperation<T>): Promise<void> {
    throw new Error("syncOperation must be implemented by subclass")
  }

  getPendingOperations(): OfflineOperation<T>[] {
    return this.operations.filter((op) => !op.synced)
  }

  getFailedOperations(): OfflineOperation<T>[] {
    return this.operations.filter((op) => op.error !== undefined)
  }

  clearOperations(): void {
    this.operations = []
    this.storage.clear()
  }

  isOffline(): boolean {
    return !this.isOnline
  }

  getOperationCount(): number {
    return this.operations.length
  }
}

export interface UseOfflineOptions<T> {
  syncFn?: (operation: OfflineOperation<T>) => Promise<void>
  storageOptions?: OfflineStorageOptions
}

export function useOffline<T>(options: UseOfflineOptions<T>) {
  const { syncFn, storageOptions } = options

  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [operations, setOperations] = useState<OfflineOperation<T>[]>([])
  const [syncing, setSyncing] = useState(false)

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  const addOperation = useCallback(
    async (type: "create" | "update" | "delete", data: T) => {
      const operation: OfflineOperation<T> = {
        id: `op-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type,
        data,
        timestamp: Date.now(),
        synced: false,
      }

      setOperations((prev) => [...prev, operation])

      if (isOnline && syncFn) {
        setSyncing(true)
        try {
          await syncFn(operation)
          setOperations((prev) => prev.filter((op) => op.id !== operation.id))
        } catch (error) {
          setOperations((prev) =>
            prev.map((op) =>
              op.id === operation.id
                ? { ...op, error: error instanceof Error ? error.message : "Unknown error" }
                : op
            )
          )
        } finally {
          setSyncing(false)
        }
      }
    },
    [isOnline, syncFn]
  )

  const retryFailedOperations = useCallback(async () => {
    const failedOps = operations.filter((op) => op.error !== undefined)

    if (failedOps.length === 0 || !syncFn) {
      return
    }

    setSyncing(true)

    for (const operation of failedOps) {
      try {
        await syncFn(operation)
        setOperations((prev) => prev.filter((op) => op.id !== operation.id))
      } catch (error) {
        setOperations((prev) =>
          prev.map((op) =>
            op.id === operation.id
              ? { ...op, error: error instanceof Error ? error.message : "Unknown error" }
              : op
          )
        )
      }
    }

    setSyncing(false)
  }, [operations, syncFn])

  const clearOperations = useCallback(() => {
    setOperations([])
  }, [])

  return {
    isOnline,
    operations,
    syncing,
    addOperation,
    retryFailedOperations,
    clearOperations,
    pendingCount: operations.filter((op) => !op.synced).length,
    failedCount: operations.filter((op) => op.error !== undefined).length,
  }
}

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error)
      return initialValue
    }
  })

  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        const valueToStore = value instanceof Function ? value(storedValue) : value
        setStoredValue(valueToStore)
        window.localStorage.setItem(key, JSON.stringify(valueToStore))
      } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error)
      }
    },
    [key, storedValue]
  )

  const removeValue = useCallback(() => {
    try {
      window.localStorage.removeItem(key)
      setStoredValue(initialValue)
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error)
    }
  }, [key, initialValue])

  return [storedValue, setValue, removeValue] as const
}
