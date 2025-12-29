import { Observable } from 'rxjs';
import { ChunkEventDto } from '../dto/chunk-event.dto';

export interface IAiService {
  askAiAgentSummary(messages: string[]): Promise<string>;
  sendDialogToAiStreamed(dialogId: string): Observable<ChunkEventDto>;
  get aiStreamEvents$(): Observable<ChunkEventDto>;
}
