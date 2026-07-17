export interface Repository<T> {
  findById(id: number): Promise<T | null>
  findAll(params?: Partial<T>): Promise<T[]>
  create(data: Partial<T>): Promise<T>
  update(id: number, data: Partial<T>): Promise<T | null>
  delete(id: number): Promise<boolean>
}
