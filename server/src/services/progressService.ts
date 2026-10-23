/**
 * Progress Service
 * Tracks preparation progress, quiz scores, and plan completion.
 */
import { repository } from '../storage/repository';

export async function getProgress(sessionId: string) {
  return repository.getProgress(sessionId);
}

export async function updateProgress(sessionId: string, data: any) {
  return repository.updateProgress(sessionId, data);
}
