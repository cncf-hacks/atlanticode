import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

interface Executor {
  exp_date: string;
  model: string;
}

@Injectable({
  providedIn: 'root'
})
export class ExecutorService {

  constructor(private http: HttpClient) { }

  logout() {
    return this.http.post("http://localhost:8080/logout", null, { withCredentials: true })
  }

  createExecutor(executor: Executor): Observable<{id: string}> {
    return this.http.get<{id: string}>(`http://localhost:8080/executor?model=${executor.model}`, {withCredentials: true});
  }

  runExecutor(executorId: string, message: string): Observable<{message: {role: string, content: string}}> {
    const mBase64 = btoa(message);
    // Make message url encoded
    const mUrlEncoded = encodeURIComponent(mBase64);
    return this.http.get<{message: {role: string, content: string}}>(`http://localhost:8080/executor/run?id=${executorId}&content=${mUrlEncoded}`, {withCredentials: true});
  }
}
