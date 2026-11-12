import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Theorem } from "./Theorem";
import { Category } from "./Category";

@Injectable({ providedIn: 'root' })
export class MathService {
    private readonly apiUrl = '/api';
    constructor(private http: HttpClient) {
        // nothing to do
    }

    getTheorems() {
        return this.http.get('/api/theorems');
    }

    getTheoremsForCategory(category: number): Observable<Theorem[]> {
        return this.http.get<Theorem[]>(`${this.apiUrl}/theorems?categories=${category}`)
    }

    getTheorem(id: number): Observable<Theorem> {
        return this.http.get<Theorem>(`${this.apiUrl}/theorems/${id}`);
    }

    getCategories(): Observable<Category[]> {
        return this.http.get<Category[]>(`${this.apiUrl}/categories`);
    }
    createTheorem(theorem: Omit<Theorem, 'id'>) {
        return this.http.post<Theorem>(`${this.apiUrl}/theorems`, theorem);
    }

    updateTheorem(id: number, theorem: Omit<Theorem, 'id'>) {
        return this.http.put<Theorem>(`${this.apiUrl}/theorems/${id}`, theorem);
    }

    login(username: string, password: string) {
        const body = new HttpParams()
            .set('username', username)
            .set('password', password);

        const headers = new HttpHeaders({
            'Content-Type': 'application/x-www-form-urlencoded',
        });

        return this.http.post(
            'https://localhost:8000/token',
            body.toString(),
            { headers },
        );
    }
}