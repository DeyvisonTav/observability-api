export interface BaseRepository<T, CreateDto, UpdateDto> {
  create(dto: CreateDto): Promise<T>;
  findById(id: string): Promise<T | null>;
  findAll(): Promise<T[]>;
  update(id: string, dto: Partial<UpdateDto>): Promise<T>;
  delete(id: string): Promise<void>;
  exists(id: string): Promise<boolean>;
} 