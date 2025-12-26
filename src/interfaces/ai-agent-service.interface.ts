import { Observable } from 'rxjs';
import { ChunkEventDto } from '../dto/chunk-event.dto';

export interface IAiService {
  askAiAgentSummary<T>(messages: T[]): Promise<T>;
  sendDialogToAiStreamed(dialogId: string): Observable<ChunkEventDto>;
  get aiStreamEvents$(): Observable<ChunkEventDto>;
}
