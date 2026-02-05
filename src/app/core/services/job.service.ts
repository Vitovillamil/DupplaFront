import { Injectable }	from '@angular/core';
import { HttpClient }	from '@angular/common/http';

import { Job }	from '../models/job.model';

import { environment }	from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class JobService {
	private api = `${environment.apiUrl}/jobs`;

	constructor(private http: HttpClient) {}

	get(id: number) {
		return this.http.get<Job>(`${this.api}/${id}`);
	}
}
