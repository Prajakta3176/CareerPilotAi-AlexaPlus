/**
 * Database initialization and connection
 * PostgreSQL persistence with session sync.
 */
import { repository, RepositoryStore } from './repository';

export function initDatabase(_dbPath?: string): RepositoryStore {
  console.log('[Storage] Initializing CareerPilot database store');
  repository.init().catch((e) => console.warn('[Storage] DB Init Warning:', e.message));
  return repository;
}
