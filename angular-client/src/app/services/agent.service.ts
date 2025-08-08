import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map, catchError, of } from 'rxjs';
import { Agent } from '../models/property.model';

@Injectable({
  providedIn: 'root'
})
export class AgentService {
  private apiUrl = 'http://localhost:8081/api/agents';

  constructor(private http: HttpClient) { }

  getAgents(): Observable<Agent[]> {
    return this.http.get<Agent[]>(this.apiUrl).pipe(
      catchError(error => {
        console.error('Error fetching agents:', error);
        return of([] as Agent[]); // Return empty array on error
      })
    );
  }
  
  findAgentByEmail(email: string): Observable<Agent | null> {
    return this.getAgents().pipe(
      map(agents => {
        const foundAgent = agents.find(agent => agent.email === email);
        console.log('Looking for agent with email:', email, 'Found:', foundAgent);
        return foundAgent || null;
      })
    );
  }

  getAgentById(id: number): Observable<Agent> {
    return this.http.get<Agent>(`${this.apiUrl}/${id}`);
  }

  createAgent(agent: Agent): Observable<Agent> {
    return this.http.post<Agent>(this.apiUrl, agent);
  }

  updateAgent(id: number, agent: Agent): Observable<Agent> {
    return this.http.put<Agent>(`${this.apiUrl}/${id}`, agent);
  }

  deleteAgent(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
