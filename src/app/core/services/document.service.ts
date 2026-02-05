import { Injectable }	from '@angular/core';
import { HttpClient }	from '@angular/common/http';

import { Document }	from '../models/document.model';

import { environment }	from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class DocumentService {
	private api = `${environment.apiUrl}/documentos`;

	constructor(private http: HttpClient) {}

	list(params: any) {
		return this.http.get<{
			items: Document[];
			page: number;
			size: number;
			total: number;
		}>(this.api, { params });
	}

	get(id: number) {
		return this.http.get<Document>(`${this.api}/${id}`);
	}

	create(data: Partial<Document>) {
		return this.http.post<Document>(this.api, data);
	}

	update(id: number, data: Partial<Document>) {
		return this.http.put<Document>(`${this.api}/${id}`, data);
	}

	processBatch(ids: number[]) {
		return this.http.post<{ job_id: number }>(
			`${this.api}/batch/procesar`,
			{document_ids: ids}
		);
	}
}
